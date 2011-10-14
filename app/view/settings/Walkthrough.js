Ext.define("Gloss.view.settings.Walkthrough", {
    extend: "Ext.tab.Panel",
    alias: "widget.walkthrough",
    scroll: "vertical",
    defaults: {bodyPadding:10},
    initComponent: function() {
        this.items = [
            {
                title: "Welcome!",
                contentEl: "welcome",
                styleHtmlContent: true
            },
            {
                title: "Reference Guides",
                contentEl: "reference",
                iconCls: "title-coldfusion",
                styleHtmlContent: true
            },
            {
                title: "Custom Content",
                contentEl: "custom",
                iconCls: "title-custom",
                styleHtmlContent: true
            },
            {
                title: "Tools",
                contentEl: "tools",
                iconCls: "title-bookmark",
                styleHtmlContent: true
            },
            {
                title: "Settings",
                contentEl: "settings",
                iconCls: "title-settings",
                styleHtmlContent: true
            }    
        ]    
        this.callParent(arguments);
    }
});
