Ext.define("Gloss.view.search.List", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.searchgrid",
	store:		"Search",
	scroll:		"vertical",
	cls:		"docked",
    border:     false,
	hideHeaders:true,
	viewConfig: {
    	stripeRows: true,
		deferEmptyText: false,
		emptyText: "<div class='emptytext'>No search results!</div>"
   	},
	initComponent: function() {
		var coltemplate = new Ext.XTemplate(
            '<tpl for=".">',
                '<div data-qtip="{title}">',
                    '<tpl if="type.toLowerCase() == \'cfmlref\'">',
                        '<img src="images/coldfusion.png" class="list-icon" />',
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
				dataIndex: "title",
				flex: 1,
                xtype: "templatecolumn",
                tpl: coltemplate,
				renderer: function(value,meta) {
					meta.tdAttr = 'data-qtip="' + value + '"';
					return value;
				}
			}
		];
		this.callParent(arguments);
	}
});