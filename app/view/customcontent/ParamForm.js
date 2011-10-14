Ext.define("Gloss.view.customcontent.ParamForm", {
    extend:     "Ext.form.Panel",
    alias:      "widget.paramform",
    id:     "parametersform",
    scroll: "vertical",
    bodyPadding: 10,
    initComponent: function() {
        this.items = [
            {
                xtype:  "textfield",
                fieldLabel: "Name",
                name:   "title"
            },
            {
                xtype: "radiogroup",
                fieldLabel: "Required?",
                id: "requiredparent",
                width: 200,
                defaults: {
                    xtype: "radio",
                    name: "required"
                },
                items: [
                    {
                        boxLabel:   "Yes",
                        inputValue: 1
                    },
                    {
                        boxLabel:   "No",
                        inputValue: 0
                    }
                ]
            },
            {
                xtype:  "textfield",
                fieldLabel: "Default",
                name:   "defaultvalue"
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
                xtype:  "hidden",
                name:   "id"
            }
        ];
        this.callParent(arguments);
    }
});
