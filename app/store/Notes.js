Ext.define("Gloss.store.Notes", {
    extend: "Ext.data.Store",
    model: "Gloss.model.Note",
	autoLoad: true,
	proxy: {
		type: 	"localstorage",
		id:		"gloss-notes"
	}
});