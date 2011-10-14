Ext.define("Gloss.store.History", {
    extend: "Ext.data.Store",
	model:	"Gloss.model.History",
	autoLoad: true,
	proxy: {
        type: 'localstorage',
        id  : 'gloss-history'
    }
});