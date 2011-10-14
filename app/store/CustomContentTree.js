Ext.define("Gloss.store.CustomContentTree", {
    extend: "Ext.data.TreeStore",
	model:	"Gloss.model.CustomContentTree",
	proxy: {
        type: 'memory',
		reader: {
			type: "json"
		}
    }
});