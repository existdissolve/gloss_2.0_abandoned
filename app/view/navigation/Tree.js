Ext.define("Gloss.view.navigation.Tree", {
	extend: 	"Ext.tree.Panel",
	alias:		"widget.navigationtree",
	store:		"Navigation",
	rootVisible:false,
	iconCls:	"title-coldfusion",
	useArrows: 	true,
	singleExpand: true,
    height:     "100%",
    minWidth:   250,
	title:		"ColdFusion 9 Reference",
	initComponent: function() {
		this.addEvents("externalload");
		this.callParent(arguments);
	},
	externalload: function(target,title) {
		this.fireEvent("externalload",this,target,title)
	}
});
