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
				afterupdate: function(target,title,type) {
					var me = this,
                        version = type.toLowerCase()=='cfmlref' ? '9.0' : type.toLowerCase()=='cfmlref10' ? '10.0' : '0';
					this.getcomments(target,title,version)
				}
			}
        });	
	},
	getcomments: function(target,title,version) {
		var store = this.getCommentsStore();
		var params = store.getProxy().extraParams;
		params.title = title;
		params.target= target;
        params.version = version;
		store.load();
	},
	updatetitle: function(ct) {
		var panel = this.getComments();
		panel.setTitle("Community Comments (" + ct + ")");
	}
});