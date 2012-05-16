Ext.define("Gloss.view.navigation.CF10", {
	extend: 	"Ext.tree.Panel",
	alias:		"widget.cf10",
	store:		"CF10",
	rootVisible:false,
	iconCls:	"title-10",
	useArrows: 	true,
	singleExpand: true,
    height:     "100%",
    minWidth:   250,
	title:		"ColdFusion 10 Reference <span style='color:green;font-weight;bold;'>(New!)</span>",
	initComponent: function() {
		this.addEvents("externalload");
		this.callParent(arguments);
	},
	externalload: function(target,title) {
		this.fireEvent("externalload",this,target,title)
	}
});
