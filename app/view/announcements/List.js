Ext.define("Gloss.view.announcements.List", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.announcements",
	store:		"Announcements",
	scroll:		"vertical",
	title:		"Gloss News",
	iconCls:	"title-news",
	cls:		"docked sidepanel customcontent",
	viewConfig: {
    	stripeRows: true
   	},
	initComponent: function() {
		/* uncomment to enable notifications...
        if (Ext.isChrome && window.webkitNotifications.checkPermission()!=0) {
            this.tbar = ["->", {
                xtype: "button",
                text: "Get Alerts",
                icon: "images/transmit.png",
                tooltip: "Get desktop notifications for news about Gloss",
                action: "getnews"
            }];
        } 
        */
        this.columns = [
			{
				text:	"Announcement",
				dataIndex: "title",
				flex: 1,
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