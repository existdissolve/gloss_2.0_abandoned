Ext.define("Gloss.store.Navigation", {
    extend: "Ext.data.TreeStore",
	autoLoad: true,
	model:	"Gloss.model.Navigation",
	root:	{
		expanded:	 true,
		id:			"root"
	},
	proxy:	{
		type:	"ajax",
		url: "nav_handler.cfm?type=regular"
	}
});