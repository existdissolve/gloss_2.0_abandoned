Ext.define("Gloss.controller.Announcements", {
    extend: "Ext.app.Controller",
	stores: ["Announcements"],
	models: ["Announcement"],
	views: 	["announcements.List","announcements.Window"],
	refs:	[
		{ref: "announcements", selector: "announcements"}
	],
	init: function() {
		var me = this;
		if(Ext.isChrome) {
			this.notice  = window.webkitNotifications;
		}
		this.getAnnouncementsStore().on("datachanged",function(){
			me.updatetitle(this.getCount());
		});
		this.getAnnouncementsStore().on("load",function(){
			Ext.Ajax.request({
				url: "js/news.js",
				success: function(req,opts){
					me.loadannouncements(req, opts)
				}
			});
		})
		
		this.control({
			"announcements": {
				cellclick: function(grid,col,cidx,rec,row,ridx,e) {
					this.showannouncements(rec);
				}
			},
            "announcements button[action=getnews]": {
                click: function(btn,opts){
                    this.authorize(true);
                }
            }
        });	
	},
	showannouncements: function(rec) {
		var win = Ext.getCmp("announcementwindow");
        if (!win) {
            win = new Gloss.view.announcements.Window();
        }
		win.setTitle(rec.data.title);
		win.update(rec.data.content);
		win.show();
	},
	loadannouncements: function(req,opts) {
		var store = this.getAnnouncementsStore();
		var news = Ext.decode(req.responseText).glossnews;
		
		for(var i=0;i<news.length;i++) {
			var date = Ext.Date.format(news[i].datereleased,'Y-m-d g:i a');
			var match = store.findExact("title",news[i].title);
			if(match == -1) {
				var announcement = Ext.ModelMgr.getModel("Gloss.model.Announcement");
				var date = Ext.Date.format(news[i].datereleased,'Y-m-d g:i a');
				var newrecord = new announcement({
					title: news[i].title,
					content:news[i].content,
					created:date
				});
				store.add(newrecord);
				store.sync();
				if(Ext.isChrome) {
					if(this.check()==0) {
						this.pushnotify(newrecord);
					}
					else {
						this.authorize();
					}
				} 
			}
		}
	},
	updatetitle: function(ct) {
		var panel = this.getAnnouncements();
		panel.setTitle("Gloss News (" + ct + ")");
	},
	check:	function() {
		return this.notice.checkPermission();	
	},
	authorize: function() {
		var me = this;
        this.notice.requestPermission(function(){
			if(me.check()==0) {
                var docked = me.getAnnouncements().getDockedItems();   
                me.getAnnouncements().removeDocked(docked[1]);
            }
		});
	},
	pushnotify:	function(a) {
        var notify = this.notice.createHTMLNotification("notification_helper.cfm?title="+a.data.title+"&content="+a.data.content);
		notify.show();
	}
});