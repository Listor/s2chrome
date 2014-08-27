(function($) {
    $.fn.extend({
        blink: function(){
            $(this).fadeTo(300, 0.2, function(){
                $(this).fadeTo(300, 1);
            });
        } 
    });

    $.fn.extend({
        copy: function(){
            var copyValue = this.parent().children('.copyValue'),
                text = copyValue.text();

            copyText(text);
            copyValue.blink();
        } 
    });
    
    /**
     * get paths callback function
     * @param {Object} response
     */
    function getPathsCb(response)
    {
        if(typeof response.data == 'object')
        {
            $.each(response.data, function(key, value){
                $.each(value, function(index, path){
                    path = replacePath(path);
                    $('#pathsResult').append('<div class="path" ><div class="copyValue" ><a href="' + path + '" target="_blank" >' + path + '</a></div><div class="copy" ></div></div>');
                });
            });
            
            setCopyListeners();
        }
    }
    
    /**
     * sets the copy listener 
     */
    function setCopyListeners()
    {
        $('.copy').off('click').on('click', function(){
            $(this).copy(); 
        });
        
        // $('.copyValue').on('click', function(){
            // $(this).parent().children('.copy').click(); 
        // });        
    }
    
    $(document).ready(function(){
        $('.refreshBox').on('click', function(){
            // TODO check if getpathscb will return the new page content
            $('#pathsResult').html('');
            sendToTab('getPaths', getPathsCb);
            
            $(this).blink();
        });
        
        // append version
        $('.popup .title').append(' v' +getManifestVar('version'));
        $('#manualConvert').on('click', function(){
            var manualPath = replacePath($('#manualPath').val());
            $('#manualResult').html('<a href="' + manualPath + '" target="_blank">' + manualPath + '</a>');
        });
        $('#manualPath').on('click', function(){
            $(this).val(''); 
        });
        
        setCopyListeners();
        sendToTab('getPaths', getPathsCb);
        
        // replace all messages with the lang text
        $('span.msg, input[type="button"].msg').each(function(){
            var key = $(this).attr('id'),
                method = ($(this).is('input'))? 'val': 'text';
            
            $(this)[method](lang(key));
        });
    });
})($);