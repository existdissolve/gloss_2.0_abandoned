Ext.define("Gloss.view.notes.List", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.notes",
	store:		"Notes",
	scroll:		"vertical",
	title:		"My Notes",
	cls:		"docked sidepanel",
	iconCls:	"title-note",
	viewConfig: {
    	stripeRows: true,
		deferEmptyText: false,
		emptyText: "<div class='emptytext'>No notes! For shame...</div>"
   	},
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
				text:	"Article",
				dataIndex: "title",
				flex: 1,
                xtype: "templatecolumn",
                tpl: coltemplate,
				renderer: function(value,meta,record) {
					meta.tdAttr = 'data-qtip="' + record.data.content + '"';
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