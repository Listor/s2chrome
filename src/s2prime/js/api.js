var pathData = {
        mac:    {
            prefix:         'smb://',
            divider:        '/',
            convert:        'win',
            segmentStart:   2
        },
        win:    {
            prefix:         '\\\\',
            divider:        '\\',
            convert:        'mac',
            segmentStart:   2
        }
    },
    replacedClass = 'rightShare',
    api = chrome,
    // serverUrl = 'http://stageffm.sinnerschrader.de/time/',
    serverUrl = 'http://battle.local/time/',
    passPhrase = '__$ecr3t_' + api.i18n.getMessage('@@extension_id') + '542d_fs4$%';

/**
 * source from https://code.google.com/p/crypto-js/ 
 */
var JsonFormatter = {
    stringify: function (cipherParams) {
        // create json object with ciphertext
        var jsonObj = {
            ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
        };

        // optionally add iv and salt
        if (cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString();
        }
        if (cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString();
        }

        // stringify json object
        return JSON.stringify(jsonObj);
    },

    parse: function (jsonStr) {
        // parse json string
        var jsonObj = JSON.parse(jsonStr);

        // extract ciphertext from json object, and create cipher params object
        var cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
        });

        // optionally extract iv and salt
        if (jsonObj.iv) {
            cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
        }
        if (jsonObj.s) {
            cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
        }

        return cipherParams;
    }
};    

/**
 * gets variables from the chrome manifest
 * @param {String} name
 * @return {Mixed} result
 */
function getManifestVar(name)
{
    var manifest = api.runtime.getManifest(),
        result = null;
        
    if(typeof manifest[name] != 'undefined')
    {
        result = manifest[name];   
    }
    
    return result;
}

/**
 * gets the message from the locale 
 * @param {String} key
 * @return {String} result
 */
function lang(key)
{
    var result = null,
        tmp = null;
    
    tmp = api.i18n.getMessage(key);

    if(tmp != '')
    {
        result = tmp;
    }
    else
    {
        result = '__' + key.toUpperCase() + '_NOT_FOUND__';
    }

    return result;
}

/**
 * sends a command to the current tab 
 * @param {String} cmd
 */
function sendToTab(cmd, callback)
{
    api.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        api.tabs.sendMessage(tabs[0].id, {action: cmd}, function(response) {
            if(typeof callback == 'function')
            {
                callback(response);   
            }
        });        
    });
}

/**
 * gets the time from the server
 * @param {Object} callback
 * @return {String} time
 */
function getTime(callback)
{
    var userName = decrypt(getStoredUserName()),
        passWord = decrypt(getStoredPassWord());
    
    $.ajax({
        url: serverUrl,
        type: 'POST',
        data: {'u': userName, 'p': passWord},
        complete: function(data){
            api.extension.sendMessage({action: 'getTimePopup', text: data.responseText});
        },
        dataType: 'string'
    });    
}

/**
 * replaces all containers with the messages
 */
function replaceLang()
{
    // replace all messages with the lang text
    $('span.msg, input[type="button"].msg').each(function(){
        var key = $(this).attr('id'),
            method = ($(this).is('input'))? 'val': 'text';
        
        $(this)[method](lang(key));
    });    
}

/**
 * saves options
 * @param {Object} options
 */
function saveOptions(options)
{
    $.each(options, function(key, value){
        localStorage[key] = encrypt(value);
    });
}

/**
 * small encryption of data 
 * @param {String} data
 */
function encrypt(data)
{
    return CryptoJS.AES.encrypt(data, passPhrase, { format: JsonFormatter });
}

/**
 * decryption of data 
 * @param {String} data
 */
function decrypt(data)
{
    return CryptoJS.AES.decrypt(data, passPhrase, { format: JsonFormatter }).toString(CryptoJS.enc.Utf8);
}

/**
 * gets the stored username
 * @return {String} 
 */
function getStoredUserName()
{
    return localStorage['userName'];
}

/**
 * gets the stored password
 * @return {String} 
 */
function getStoredPassWord()
{
    return localStorage['passWord'];
}

/**
 * checks if username and password are stored 
 * @return {Boolean} check
 */
function checkOptions()
{
    var check = false;
    
    if(typeof getStoredUserName() != 'undefined' && typeof getStoredPassWord() != 'undefined')
    {
        check = true;
    }
    
    return check;
}