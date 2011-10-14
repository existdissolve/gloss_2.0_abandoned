Ext.define("Gloss.store.Bookmarks", {
    extend: "Ext.data.Store",
	model:	"Gloss.model.Bookmark",
	autoLoad: true,
	proxy: {
        type: 'localstorage',
        id  : 'gloss-bookmarks'
    }
});