Ext.define("Gloss.store.Search", {
    extend: "Ext.data.Store",
	model:	"Gloss.model.Search",
	proxy: {
		type:	"memory",
        reader: {
			type: "json",
			root: "search"
		}
   }
});