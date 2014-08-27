(function($) {
  $(document).ready(function() {
    addFrameListeners();
    $('body').append('<iframe id="rtcFrame"></iframe>');
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var response = {
      error : null,
      success : false
    };

    switch (request.action) {
      case 'openRtc' :
        openRtc(request.uri);
        break;
      default :
        response.error = 404;
        break;
    }
    
    return response;
  });
})($);