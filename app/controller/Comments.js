Ext.define("Gloss.controller.Comments", {
    extend: "Ext.app.Controller",
	stores: ["Comments"],
	models: ["Comment"],
	views: 	["comments.List"],
	refs:	[
		{ref: 'mainContent', selector: 'maincontent'},
		{ref: "comments", selector:"comments"}
	],
	init: function() {
		var me = this;
		this.getCommentsStore().on("datachanged",function(){
			me.updatetitle(this.getCount());
		});
		this.control({
            "maincontent": {
				afterupdate: function(target,title) {
					var me = this;
					this.getcomments(target,title)
				}
			}
        });	
	},
	getcomments: function(target,title) {
		var store = this.getCommentsStore();
		var params = store.getProxy().extraParams;
		params.title = title;
		params.target= target;
		store.load();
	},
	updatetitle: function(ct) {
		var panel = this.getComments();
		panel.setTitle("Community Comments (" + ct + ")");
	}
});