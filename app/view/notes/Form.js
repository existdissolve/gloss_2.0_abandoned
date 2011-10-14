Ext.define("Gloss.view.notes.Form", {
    extend:     "Ext.form.Panel",
    alias:      "widget.notesform",
    bodyPadding:5,
    initComponent: function() {
        this.items = [
            {
                xtype: "textarea",
                id: "notetextarea",
                labelAlign: "top",
                anchor: "100% 100%",
                name: "content",
                fieldLabel: ""
            },
            {
                xtype: "hidden",
                id:    "notetitle",
                name: "title"
            },
            {
                xtype: "hidden",
                id:    "notetarget",
                name: "target"
            },
            {
                xtype: "hidden",
                id:    "notetype",
                name: "type"
            }
        ]
        this.callParent(arguments);
    }
});