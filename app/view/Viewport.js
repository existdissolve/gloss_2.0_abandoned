Ext.define('Gloss.view.Viewport', {
    extend:     'Ext.container.Viewport',
    layout:     "border",
    alias:      "glossviewport",
    renderTo:   Ext.getBody(),
    items: [
        {
            region:     "north",
            contentEl:  "toolbar",
            height:     27,
            border:     false,
            margins:    "0 0 5 0"
        },
        {
            region:     "west",
            collapsible:true,
            split:      true,
            cls:        "navtree",
            preventHeader:true,
            layout:     "accordion",
            minWidth:   250,
            items: [
                {xtype: "cf10"},
                {xtype: "navigationtree"},
                {xtype: "customcontentnav"},
                {xtype: "cflib"}  
            ]
        },
        {
            region: "center",
            collapsible: false,
            bodyCls:    "maincontent",
            items: [
                {xtype: "maincontent"}
            ]
        },
        {
            region: "east",
            collapsible: true,
            split:  true,
            layout: "accordion",
            minWidth: 250,
            width: 250,
            preventHeader:true,
            items: [
                {xtype: "search"},
                {xtype: "bookmarks"},
                {xtype: "notes"},
                {xtype: "comments"},
                {xtype: "history"},
                {xtype: "announcements"},
                {xtype: "settingsform"}
            ]
        }
    ]
});