Ext.define("Gloss.view.search.Form", {
	extend: 	"Ext.form.Panel",
	alias:		"widget.searchform",
	bodyPadding:'5 5 1 5',
    border:     false,
    bodyCls:    "searchbg",
    items: [
		{
			xtype: 	"textfield",
			anchor:	"100%",
            enableKeyEvents: true,
            id: "searchfield",
            tabIndex:1000
		},
        {
            xtype: "checkboxgroup",
            vertical: false,
            layout:"hbox",
            defaults: {checked:true,name:"resultfilter",xtype:"checkbox",width:50},
            fieldLabel: "Filter",
            labelWidth: 40,
            labelStyle: "font-weight:bold;font-size:8pt;display:inline-block;position:relative;bottom:-3px",
            items: [
                {
                    boxLabel:   "<img src='images/10inv.png' align='absmiddle' class='inline-icon' data-qtip='ColdFusion 10 Reference' />",
                    value:      "10",
                    id:         "checkbox-10"
                },
                {
                    boxLabel:   "<img src='images/coldfusion.png' align='absmiddle' class='inline-icon' data-qtip='ColdFusion 9 Reference' />",
                    value:      "reference",
                    id:         "checkbox-reference"
                },
                {
                    boxLabel:   "<img src='images/book_open.png' align='absmiddle' class='inline-icon' data-qtip='CFLib.org UDFs' />",
                    value:      "cflib",
                    id:         "checkbox-cflib"
                },
                {
                    boxLabel:   "<img src='images/bricks.png' align='absmiddle' class='inline-icon' data-qtip='Custom Content' />",
                    value:      "custom",
                    id:         "checkbox-custom"
                }
            ]
        }
	],
	initComponent: function() {
		this.callParent(arguments);
	}
});
