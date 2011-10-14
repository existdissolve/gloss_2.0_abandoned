Ext.define("Gloss.view.navigation.Content", {
	extend: 	"Ext.panel.Panel",
	alias:		"widget.maincontent",
	border:		false,
	scroll: 	false,
	cls:		"content",
	id:			"body",
	initComponent: function() {
		this.addEvents("afterupdate");
		this.callParent(arguments);
	},
	aferupdate: function(target,title,type,redirect) {
		this.fireEvent("afterupdate",this,target,title,type,redirect)
	}
});
