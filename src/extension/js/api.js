var appUrl = 'http://www.busy5.com/rtc/chrome.html?rtc=', qrcode = null;

/**
 * gets variables from the chrome manifest
 * 
 * @param {String}
 *          name
 * @return {Mixed} result
 */
function getManifestVar(name) {
  var manifest = chrome.runtime.getManifest(), result = null;

  if (typeof manifest[name] != 'undefined') {
    result = manifest[name];
  }

  return result;
}

/**
 * sends a command to the current tab
 * 
 * @param {String}
 *          cmd
 * @param {Object}
 *          data
 * @param {Object}
 *          callback
 */
function sendToTab(cmd, data, callback) {
  chrome.tabs.query({
    currentWindow : true,
    active : true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action : cmd,
      data : data
    }, function(response) {
      if (typeof callback == 'function') {
        callback(response);
      }
    });
  });
}

function sendMessage(msg, callback) {
  chrome.runtime.sendMessage(msg, function(response) {
    console.log(response);
  });
}

/**
 * generates a QR code on th element id
 * 
 * @param {String}
 *          elementId
 * @return {String} connectionUri
 */
function createQR(elementId) {
  var id = generateRandomId();

  if (qrcode === null) {
    var scale = 200;

    qrcode = new QRCode(document.getElementById(elementId), {
      width : scale,
      height : scale
    });
  }

  var connectionUri = appUrl + id;

  // TODO #1 - remove this
  var staticConnectionUri = appUrl + '1234';

  qrcode.clear();
  qrcode.makeCode(connectionUri);

  // TODO #1 - change this to connectionUri to generate a unique session but now
  // we're keeping it simple for the presentation.
  return staticConnectionUri;;
}

/**
 * TODO doesnt work propably wont fix for presentation
 * 
 * @param char
 */
function pressKey(char) {
  $.event.trigger({
    type : 'keypress',
    which : char.charCodeAt(0)
  });
}

function isControllerCookie(cookie) {
  var isController = false;

  // TODO #2 - make this dynamic from the app settings - available list of all
  // connection cookies
  if (cookie == "500029582") {
    isController = true;
  }

  return isController;
}

/**
 * opens an rtc connection
 */
function openRtcConnection() {
  var uri = createQR('qrcode');

  sendMessage({
    action : 'openRtc',
    uri : uri
  }, function(test) {
    console.log(test);
  });
}

function openRtc(uri) {
  var rtcFrame = $('#rtcFrame');

  rtcFrame.attr('src', uri + '&open=1');
}

function addFrameListeners() {
  window.addEventListener('message', executeFrameCmd, false);
}

function executeFrameCmd(event) {
  if (typeof event.data !== 'undefined') {
    sendToTab('execCmd', event.data, null);
  }
}

/**
 * generates a random id
 * 
 * @returns {Integer}
 */
function generateRandomId() {
  return Math.round(Math.random() * 60535) + 500000;
}

function execCmd(cmd) {
  switch (cmd) {
    case 'right' :
    case 'left' :
    case 'up' :
    case 'down' :
    case 'prev' :
    case 'next' :
      execCmdInContentTab(generateCmdText(cmd));
      break;
    case 'console' :
      alert('t console');
      break;
    default :
      // unknown cmd
      break;
  }
}

function addCmdToConsole(cookie, cmd){
  execCmdInContentTab("$('.controls-window').append('" + cookie + " - " + (new Date().getTime() + "").substring(5) + " - " + cmd + "<br/>')");
}

/**
 * generates the text block for the inline js to be executed
 * 
 * @param {String}
 *          cmd
 * @returns {String}
 */
function generateCmdText(cmd) {
  return "if(typeof Reveal !== 'undefined'){ Reveal." + cmd + "(); }";
}

/**
 * executes a command in the scope of the current tab / window
 * 
 * @param {string}
 *          cmd
 */
function execCmdInContentTab(cmd) {
  var script = document.createElement('script');

  script.id = 'execCmdInContentTab';
  script.appendChild(document.createTextNode(cmd));

  (document.body || document.head || document.documentElement).appendChild(script);

   $('#' + script.id).remove();
}