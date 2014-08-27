(function($) {
    $.fn.extend({
        blink: function(){
            $(this).fadeTo(300, 0.2, function(){
                $(this).fadeTo(300, 1);
            });
        } 
    });    
    
    /**
     * send a message to the background.js to get the time 
     */
    function getTimeRequest()
    {
        $('#time').text(lang('loading'));
        api.extension.sendMessage({action: 'getTime'});
    }
    
    $(document).ready(function(){
        if(checkOptions())
        {
            api.runtime.onMessage.addListener(function(request, sender, sendResponse){
                switch(request.action)
                {
                    case 'getTimePopup':
                        var time = request.text,
                            timeDiv = $('#time'),
                            negativeCss = 'negative';
                        
                        timeDiv.text(time);
                        
                        if(time.indexOf('-') !== -1)
                        {
                            timeDiv.addClass(negativeCss);
                        }
                        else
                        {
                            timeDiv.removeClass(negativeCss);
                        }
                    break;
                    default:
                    break;   
                }
            });        
            
            getTimeRequest();
            
            $('.refreshBox').on('click', function(){
                $(this).blink();
                getTimeRequest();
            });
        }
        else
        {
            $('.refreshBox').hide().after('<b>' + lang('fillOptionsDesc') + '</b>');
            api.tabs.create({url: "views/options.html"});
        }
        
        replaceLang();
    });
})($);