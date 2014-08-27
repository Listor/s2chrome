(function($) {
    // TODO deprecated ??? 
    var smbPrefix = 'smb://',
        winPrefix = '\\\\',
        // smbRegex = new RegExp('smb://([a-zA-Z0-9-/\.\_ ])+', 'g');
        // smbRegex = new RegExp('smb://([a-zA-Z0-9-\.\_ ]*)\/', 'g');
        smbRegex = new RegExp('smb://([a-zA-Z0-9-.\_ ]*/)*', 'g');
        // smbRegex = new RegExp('smb://(.*$\/)*', 'g');

        // smbRegex = new RegExp('smb://[a-z/-0-9\.]+', 'g'); // new RegExp('%smb://[a-z/]+%', 'g')
        
    /**
     * gets all shared types found in the string
     * @param {String} string
     * @return {Array} result
     */
    function getShareTypes(string)
    {
        var result = [];
        
        $.each(pathData, function(type, data){
            var search = new RegExp(data.prefix),
                matches = search.exec(string);
                
            if(matches != null)
            {
                result.push(type);   
            }
        });
        
        return result;
    }
 
    /**
     * gets all paths found in the string
     * @param {String} string
     * @param {Array} shareTypes
     * @return {Array} paths
     */
    function getPaths(string, shareTypes)
    {
        var paths = [];
        
        for(var i=0; i<shareTypes.length; i++)
        {
            var currentString = string,
                currentType = pathData[shareTypes[i]],
                divider = currentType.divider,
                segments = string.split(divider),
                prefix = currentType.prefix;
                newString = prefix + '',
                leave = false;
                
            $.each(segments, function(key, value){
                if(key >= currentType.segmentStart && leave == false)
                {
                    pos = isEndOfPath(value, currentType);
                    
                    if(pos != -1)
                    {
                        leave = true;
                        newString += value.substr(0, pos);
                    }
                    else
                    {
                        newString += value;
                        newString += divider;
                    }
                }
            });
            
            paths.push(newString);
        }
        
        return paths;
    };

    /**
     * checks if this is the end of the path
     * @param {String} string
     * @param {String} shareType
     * @return {Integer} result
     */    
    function isEndOfPath(string, shareType)
    {
        var result = -1,
            endChars = ["\n", "  "]; // TODO multichars not supported yet
            // currentPrefix = (!mode)? : ;
        
        for(var i=0; i<string.length; i++)
        {
            // console.log(string[i]);
            // console.log($.inArray(string[i], endChars) + '##');
            if($.inArray(string[i], endChars) != -1)
            {
                result = i;
                break;                
            }
        }
        
        return result;
    }
    
    /**
     * gets all the paths in the tab
     * @return {Array} result 
     */
    function getAllPaths()
    {
        var result = [];

        return [['test']];
        
        $('div, p, span, h1, h2, h3, a, b').each(function(){
            var oldText = $(this).text(),
                shareTypes = getShareTypes(oldText);
            
            if(shareTypes.length != 0)
            {
                // log(replacePaths(oldText, shareTypes));
   
                result.push(getPaths(oldText, shareTypes));
            }
        });
        
        return result;
    }
    
    // add popup listener
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        var response = {
                            error: null,
                            success: false
        };
                    
        switch(request.action)
        {
            case 'getPaths':
                response.data = getAllPaths();
            break;
            default:
                response.error = 404;
            break;   
        }
        
        sendResponse(response);
    });        
})($);