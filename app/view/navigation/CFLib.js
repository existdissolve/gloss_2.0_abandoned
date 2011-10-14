Ext.define("Gloss.view.navigation.CFLib", {
	extend: 	"Ext.tree.Panel",
	alias:		"widget.cflib",
	height: 	"100%",
	minWidth:	250,
	store:		"CFLib",
	rootVisible:false,
	useArrows: 	true,
	singleExpand: true,
	iconCls:	"title-cflib",
    layout:     "fit",
	title:		"CFLib.org UDFs",
	viewConfig: {
		loadingText: "Please wait...",
		loadingHeight: 200
	},
	initComponent: function() {
		this.addEvents("externalload");
		this.callParent(arguments);
	},
	externalload: function(target,title) {
		this.fireEvent("externalload",this,target,title)
	}
});