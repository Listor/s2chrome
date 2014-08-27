(function($) {
    $(document).ready(function(){
        api.runtime.onMessage.addListener(function(request, sender, sendResponse){
            switch(request.action)
            {
                case 'getTime':
                    getTime();
                break;
                default:
                break;   
            }
        });
    });
})($);