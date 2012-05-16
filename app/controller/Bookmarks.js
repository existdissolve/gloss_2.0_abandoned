Ext.define("Gloss.controller.Bookmarks", {
    extend: "Ext.app.Controller",
	stores: ["Bookmarks"],
	models: ["Bookmark"],
	views: 	["bookmarks.List"],
	refs:	[
		{ref: 'mainContent', selector: 'maincontent'},
		{ref: "bookmarks", selector: "bookmarks"},
		{ref: "navigationTree", selector: "navigationtree"}
	],
	init: function() {
		var me = this;
		this.getBookmarksStore().on("datachanged",function(){
			me.updatetitle(this.getCount());
		});
		
		this.control({
            "maincontent": {
				afterupdate: function(target,title,type) {
					var me = this;
					var links = Ext.select("*[class=actionbookmark]").each(function(){
						this.on("click",function(){me.addbookmark(target,title,type)},me);
					});
				}
			},
			"bookmarks": {
				itemclick: function(grid,rec,item,idx,e,opts) {
					// only allow event if it's a true right click; block event if ctrl+click on mac
					if (e.type == "click" && e.ctrlKey == false) {
						var tree = this.getNavigationTree();
						tree.fireEvent("externalload",rec.data.target,rec.data.title,rec.data.type);
					}
					else {
						return false;
					}
				},
				itemcontextmenu: function(view,record,item,index,e) {
					var me = this;
					var r  = record.data;
					e.stopEvent();
					if (!item.ctxMenu) {
						item.ctxMenu = new Ext.menu.Menu({
							items : [
								{
									text:	"Delete Forever",
									icon:	"images/delete.png",
									handler:function(btn) {
										me.deletebookmark(record,item);
									}
								}
								
							],
							defaultAlign: "tl"
						});
					}
					item.ctxMenu.showBy(item);
				}
			}
        });	
	},
	addbookmark: function(target,title,type) {
		var store = this.getBookmarksStore();
		var match = store.findBy(function(record,id) {
            if(record.get('target')==target && record.get('type')==type) {
                return true;
            }
        });
		if(match == -1) {
			var bookmark = Ext.ModelMgr.getModel('Gloss.model.Bookmark');
			var dt = new Date();
			var date = Ext.Date.format(dt,'Y-m-d g:i a');
			var newrecord = new bookmark({
				title: 		title,
				target:		target,
				type:		type,
				created:	date
	        });
			store.add(newrecord);
			store.sync();	
			this.getController("Messages").showmessage("addbookmark");
		}
	},
	deletebookmark: function(rec,item) {
		this.getController("Messages").showmessage("deletebookmark");
		Ext.get(item).fadeOut({
			opacity: 0,
			easing: "easeOut",
			duration: 500,
			useDisplay:true,
			scope: this,
			callback: function() {
				var store = this.getBookmarksStore();
				store.remove(store.getById(rec.data.id));
				store.sync();
			}
		});
	},
	updatetitle: function(ct) {
		var panel = this.getBookmarks();
		panel.setTitle("My Bookmarks (" + ct + ")");
	}
});