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
    api = chrome;

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
        
        alert(tabs[0].id);
        api.tabs.sendMessage(tabs[0].id, {action: cmd}, function(response) {
            if(typeof callback == 'function')
            {
                callback(response);   
            }
        });        
    });
}

/**
 * copies a text to the clipboard
 * @param {String} text
 */
function copyText(text)
{
    var copyFrom = $('<textarea/>');
    copyFrom.text(text);
    $('body').append(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.remove();    
}

/**
 * converts and copies string 
 * @param {String} string
 */
function convertAndCopy(string)
{
    copyText(replacePath(string));
}

/**
 * replaces a single path
 * @param {String} string
 * @return {String} result
 */
function replacePath(string)
{
    var result = '',
        pathDataCopy = $.extend(true, {}, pathData),
        currentName = (string.indexOf(pathData.mac.divider) != -1)? 'mac': 'win',
        currentType = pathDataCopy[currentName],
        convertType = pathDataCopy[currentType.convert],
        firstPart = string.substr(0, currentType.prefix.length),
        lastPart = string.substr(currentType.prefix.length);
    
        if(currentName == 'win')
        {
            currentType.divider = currentType.divider.replace('\\', '\\\\');
        }
        
        firstPart = firstPart.replace(currentType.prefix, convertType.prefix);
        result = firstPart + lastPart.replace(new RegExp(currentType.divider, 'g'), convertType.divider);
    
    return result;
}

/**
 * replace all paths found in the string
 * @param {String} string
 * @param {Array} shareTypes
 */   
function replacePaths(string, shareTypes)
{
    var paths = getPaths(string, shareTypes);
    
    for(var i=0; i<paths.length; i++)
    {
        var currentPath = paths[i],
            currentType = pathData[shareTypes[i]],
            divider = currentType.divider,
            prefix = currentType.prefix,
            convertType = pathData[currentType.convert],
            convertDivider = convertType.divider,
            convertPrefix = convertType.prefix;
            
            if(divider == pathData.win.divider)
            {
                // escape them again
                divider = divider + divider;   
            }                   

            newPath = currentPath.replace(prefix, convertPrefix).replace(new RegExp(divider, 'g'), convertDivider);
            
            console.log(newPath);
            // TODO warp em replace em and make marked as wrapped
            
    }
}

// TODO create a more elegant way
function log(txt)
{
    var selector = $('body'),
        logSelector = 'log',
        logBox = $('<div class="' + logSelector + '" style="margin-top:80px;" ></div>');

    if(selector.find('.' + logSelector).length == 0)
    {
        selector.append(logBox);
    }
    else
    {
        logBox = selector.find('.' + logSelector);
    }
    
    // console.log(typeof txt);
    // console.log(txt);
    
    // console.log(JSON.stringify(txt));
    
    console.log(txt);
    logBox.append(JSON.stringify(txt) + '<br/>');
};