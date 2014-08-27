(function($) {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var response = {
      error : null,
      success : false
    };

    var cmd = request.data.cmd;

    switch (request.action) {
      case 'execCmd' :
        if (isControllerCookie(request.data.cookie)) {
          execCmd(cmd);
        } else {
          addCmdToConsole(request.data.cookie, cmd);
        }
        break;
      default :
        response.error = 404;
        break;
    }

    return response;
  });
})($);