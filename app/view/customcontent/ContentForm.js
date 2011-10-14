Ext.define("Gloss.view.customcontent.ContentForm", {
    extend:     "Ext.form.Panel",
    alias:      "widget.contentform",
    bodyCls:"scrollable",
    autoScroll: true,
    bodyPadding: '5 10 10 5',
    id:     "customcontentform",
    initComponent: function() {
        this.items = [
            {
                xtype:  "fieldset",
                title:  "Basic Details",
                collapsible: true,
                width:  700,
                items: [
                    {
                        xtype:  "textfield",
                        fieldLabel: "Title",
                        name:   "title"
                    },
                    {
                        xtype:  "htmleditor",
                        fieldLabel: "Description",
                        name:   "description",
                        enableFont:     false,
                        enableAlignments:false,
                        enableFontSize: false,
                        enableColors:   false                               
                    },
                    {
                        xtype:  "htmleditor",
                        fieldLabel: "Syntax",
                        name:   "syntax",
                        enableFont:     false,
                        enableAlignments:false,
                        enableFontSize: false,
                        enableColors:   false
                    }
                ]
            },
            {
                xtype:  "fieldset",
                title:  "Parameters",
                collapsible: true,
                width:  700,
                items: [
                    {
                        xtype:  "paramgrid"
                        
                    }
                ]
            },
            {
                xtype:  "fieldset",
                title:  "Usage",
                collapsible: true,
                width:  700,
                items: [
                    {
                        xtype:  "htmleditor",
                        fieldLabel: "Usage/Notes",
                        name:   "usage",
                        enableFont:     false,
                        enableAlignments:false,
                        enableFontSize: false,
                        enableColors:   false
                    },
                    {
                        xtype:  "htmleditor",
                        fieldLabel: "Example",
                        name:   "example",
                        enableFont:     false,
                        enableAlignments:false,
                        enableFontSize: false,
                        enableColors:   false
                    }
                ]
            },
            {
                xtype:  "hidden",
                name:   "id"
            }
        ]
        this.callParent(arguments);
    }
});