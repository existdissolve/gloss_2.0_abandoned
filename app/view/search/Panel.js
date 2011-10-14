Ext.define("Gloss.view.search.Panel", {
	extend: 	"Ext.panel.Panel",
	alias:		"widget.search",
	title:		"Search",
	iconCls:	"title-search",
    layout: "fit",
	initComponent: function() {
		this.items = [
			{
				xtype:	"searchgrid",
                dockedItems: [
                    {xtype: "searchform"}
                ]
			}
		];
		this.callParent(arguments);
	}
});
