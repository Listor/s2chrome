(function($) {
  /**
   * binds the linsteners to the dom
   */
  function bindListeners() {
    $('#qrcode').on('click', function() {
      openRtcConnection();
    });
  }

  $(document).ready(function() {
    bindListeners();
    openRtcConnection();
  });
})($);