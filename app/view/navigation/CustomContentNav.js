Ext.define("Gloss.view.navigation.CustomContentNav", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.customcontentnav",
	store:		"CustomContent",
	scroll:		"vertical",
	height: 	"100%",
	title:		"Custom Content",
	iconCls:	"title-custom",
	cls:		"customcontent",
    layout:     "fit",
	hideHeaders:true,
	viewConfig: {
    	stripeRows: true
   	},
	minWidth: 250,
	initComponent: function() {
		this.tbar = [
  			"->",
			{ 
				xtype: 	"button", 
				text: 	"Add",
				icon:	"images/add.png"
			}
		]
		this.columns = [
			{
				dataIndex: "title",
				flex: 1,
				renderer: function(value,meta) {
					meta.tdAttr = 'data-qtip="' + value + '"';
					return value;
				}
			}
		];
		this.callParent(arguments);
	}
});