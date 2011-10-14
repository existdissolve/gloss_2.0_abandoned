Ext.define("Gloss.store.Comments", {
    extend: "Ext.data.Store",
	model:	"Gloss.model.Comment",
	proxy: {
        type: 'ajax',
        url: "com/comments.cfc",
		extraParams: {method:"getcomments",returnformat:"json"},
    	reader: {
            type: "json",
            root: "comments"
        }
	}
});