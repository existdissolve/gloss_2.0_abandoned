Ext.define("Gloss.store.CustomContent", {
    extend: "Ext.data.Store",
	autoLoad: true,
	model:	"Gloss.model.CustomContent",
	proxy: {
        type: 'localstorage',
        id  : 'gloss-customcontent'
    }
});