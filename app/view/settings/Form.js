Ext.define("Gloss.view.settings.Form", {
    extend:     "Ext.form.Panel",
    alias:      "widget.settingsform",
    title:      "Settings",
    iconCls:    "title-settings",
    layout:     "anchor",
    bodyPadding: 5,
    items: [
        {
            xtype: "fieldset",
            title: "Auto-load most recent on next visit?",
            items: [
                {
                    xtype: "radiogroup",
                    id: "loadlastvisited",
                    defaults: {xtype:"radiofield",name:"loadlastvisited"},
                    items: [
                        {
                            boxLabel: "Yes",
                            inputValue: 1,
                            id: "loadlastvisitedyes"
                        },
                        {
                            boxLabel: "No",
                            inputValue: 0,
                            id: "loadlastvisitedno"
                        }
                    ]     
                }
            ]
        },
        {
            xtype: "fieldset",
            title: "Find page in navigation on load?",
            items: [
                {
                    xtype: "radiogroup",
                    id: "loadnavigation",
                    defaults: {
                        xtype: "radio",
                        name: "loadnavigation"
                    },
                    items: [
                        {
                            boxLabel: "Yes",
                            inputValue: 1,
                            id: "loadnavigationyes"
                        }, {
                            boxLabel: "No",
                            inputValue: 0,
                            id: "loadnavigationno"
                        }
                    ]
                }
            ]
        },
        {
            xtype: "fieldset",
            title: "Color Scheme",
            items: [
                {
                    xtype: "radiogroup",
                    id: "colorschemegroup",
                    columns: 2, 
                    vertical: true,
                    defaults: {
                        xtype: "radio",
                        name: "colorscheme"
                    },
                    items: [
                        {
                            boxLabel: "Classic",
                            inputValue: "gray",
                            id: "colorschemegray"
                        }, 
                        {
                            boxLabel: "Simple",
                            inputValue: "newspaper",
                            id: "colorschemenewspaper"
                        }, 
                        {
                            boxLabel: "Big Blue",
                            inputValue: "bigblue",
                            id: "colorschemebigblue"
                        },
                        {
                            boxLabel: "Autumnal",
                            inputValue: "red",
                            id: "colorschemered"
                        }
                    ]
                }
            ]
        }, 
        {
            xtype: "button",
            text: "View Walkthrough",
            cls: "walkthroughbutton",
            anchor: "100%",
            height:48
        }
    ],
    initComponent: function() {
        this.callParent(arguments);
    }
});
