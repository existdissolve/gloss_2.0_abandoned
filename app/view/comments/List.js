Ext.define("Gloss.view.comments.List", {
	extend: 	"Ext.grid.Panel",
	alias:		"widget.comments",
	store:		"Comments",
	scroll:		"vertical",
	title:		"Community Comments",
	iconCls:	"title-comment",
	cls:		"docked sidepanel nobg",
	hideHeaders: true,
    viewConfig: {
        deferEmptyText: false,
        emptyText: "<div class='emptytext'>No comments on this article</div>"
    },
	initComponent: function() {
		this.columns = [
			{
				flex: 1,
				xtype: "templatecolumn",
				tpl: "<tpl for='.'><div class='comments'><div class='comment-header'><span class='comment-author'>{author}</span><span class='comment-date'>{pubdate}</span></div><div class='comment-content'>{description}</div></div></tpl>"
			}
		];
		this.callParent(arguments);
	}
});