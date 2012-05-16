Ext.define("Gloss.view.history.List", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.history",
	store:		"History",
	scroll:		"vertical",
	title:		"My History",
	iconCls:	"title-history",
	cls:		"docked sidepanel customcontent",
	viewConfig: {
    	stripeRows: true,
		emptyText: "<div class='emptytext'>Wow, you haven't done anything yet!</div>",
		deferEmptyText: false
   	},
	initComponent: function() {
		this.tbar = [
            "->",
            { 
                xtype:  "button", 
                text:   "Clear",
                icon:   "images/delete.png",
                tooltip: "Clear all history",
                action: "clearhistory"
            }
        ];
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
				text:	"Page",
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
				hidden: true,
				dataIndex: "created",
				xtype:	"datecolumn",
				format:	"m-d-y",
				hidden: true
			}
		];
		this.callParent(arguments);
	}
});