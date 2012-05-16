Ext.define("Gloss.view.bookmarks.List", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.bookmarks",
	store:		"Bookmarks",
	scroll:		"vertical",
	title:		"My Bookmarks",
	iconCls:	"title-bookmark",
	cls:		"docked sidepanel",
	viewConfig: {
    	stripeRows: true,
        deferEmptyText: false,
        emptyText: "<div class='emptytext'>What? No bookmarks? Well, you know what to do.</div>"
   	},
	minWidth: 200,
	initComponent: function() {
		var coltemplate = new Ext.XTemplate(
            '<tpl for=".">',
                '<div data-qtip="{title}">',
                    '<tpl if="type.toLowerCase() == \'cfmlref\'">',
                        '<img src="images/coldfusion.png" class="list-icon" />',
                    '</tpl>',
                    '<tpl if="type.toLowerCase() == \'cfmlref10\'">',
                        '<img src="images/10.png" class="list-icon" />',
                    '</tpl>',
                    '<tpl if="type.toLowerCase() == \'library\' || type == \'udf\'">',
                        '<img src="images/book_open.png" class="list-icon" />',
                    '</tpl>',
                    '<tpl if="type.toLowerCase() == \'custom\'">',
                        '<img src="images/bricks.png" class="list-icon" />',
                    '</tpl>',
                    '{title}',
                '</div>',
            '</tpl>'
        );
        this.columns = [
			{
				text:	"Bookmark",
				dataIndex: "title",
				flex: 1,
                xtype: "templatecolumn",
                tpl: coltemplate,
				renderer: function(value,meta) {
					meta.tdAttr = 'data-qtip="' + value + '"';
					return value;
				}
			},
			{
				text:	"Created",
				dataIndex: "created",
				xtype:	"datecolumn",
				format:	"m-d-y",
				hidden: true
			}
		];
		this.callParent(arguments);
	}
});