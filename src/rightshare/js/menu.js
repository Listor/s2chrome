var parent = api.contextMenus.create({
        title: lang('menuTitle'),
        contexts: ["selection"],
        onclick: function(info){
            convertAndCopy(info.selectionText);
        }
});

