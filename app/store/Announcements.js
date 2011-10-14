Ext.define("Gloss.store.Announcements", {
    extend: "Ext.data.Store",
	model:	"Gloss.model.Announcement",
	autoLoad: true,
	proxy: {
        type: 'localstorage',
        id  : 'gloss-announcements'
    },
	sorters: [
		{
			property: "created",
			direction:"DESC",
			root: "data"
		}
	]
});