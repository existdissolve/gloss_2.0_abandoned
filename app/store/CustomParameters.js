Ext.define("Gloss.store.CustomParameters", {
    extend: "Ext.data.Store",
	model:	"Gloss.model.CustomParameter",
	proxy: {
         type: "memory"
    }
});