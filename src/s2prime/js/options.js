(function($) {
    var saved = false;
    
    /**
     * process the click for save options 
     */
    function clickSaveOptions()
    {
        saveOptions({
            userName: $('#appUserName').val(),
            passWord: $('#appPassWord').val()
        });
        $('#saveOptions').hide().after('<br/>' + lang('savedOptions'));
        saved = true;
        
        api.tabs.getCurrent(function(tab){
            api.tabs.remove(tab.id, function(){});
        });        
    }
    
    $(document).ready(function(){
        replaceLang();
        
        $('#saveOptions').on('click', function(){
            clickSaveOptions();
        });
        
        $(document).keypress(function(e){
            if(saved == false && e.which == 13)
            {
                clickSaveOptions();
            }
        });        
    });
})($);