Ext.define("Gloss.controller.History", {
    extend: "Ext.app.Controller",
	stores: ["History"],
	models: ["History"],
	views: 	["history.List"],
	refs:	[
		{ref: 'navigationTree', selector: 'navigationtree'},
		{ref: "history", selector:"history"},
		{ref: "navigationTree", selector: "navigationtree"},
		{ref: "CustomContentNav", selector: "customcontentnav"},
		{ref: "cflib", selector: "cflib"}
	],
	init: function() {
		var me = this;
		this.getHistoryStore().on("datachanged",function(store){
			me.updatetitle(this.getCount());
		});
		
		this.control({
			"history": {
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
										me.deletehistory(record,item);
									}
								}
								
							],
							defaultAlign: "tl"
						});
					}
					item.ctxMenu.showBy(item);
				}
			},
            "history button[action=clearhistory]": {
                click: function(btn,e){
                    this.clearhistory();
                }
            }
        });	
	},
	addhistory: function(target,title,type) {
		var store = this.getHistoryStore();
		var bookmark = Ext.ModelMgr.getModel('Gloss.model.History');
		var dt = new Date();
		var date = Ext.Date.format(dt,'Y-m-d g:i a');
        // only add history entry if it's different from the last history entry
        if(store.last() && store.last().data.target == target) {
            return false;   
        }
       var newrecord = new bookmark({
            title:      title,
            target:     target,
            type:       type,
            created:    date
        });
        store.add(newrecord);
        store.sync(); 
	},
	deletehistory: function(record,item) {
		this.getController("Messages").showmessage("deletehistory");
		Ext.get(item).fadeOut({
			opacity: 0,
			easing: "easeOut",
			duration: 500,
			useDisplay:true,
			scope: this,
			callback: function() {
				var store = record.store;
				store.remove(record);
				store.sync();
			}
		});
	},
    clearhistory: function() {
        var store = this.getHistoryStore();
        Ext.Msg.confirm("Say What?","Are you sure you really want to remove your entire Gloss history? There's no going back if you stubbornly pursue this course...", function(btn) {
           if(btn=="yes") {
               store.remove(store.getRange());
               store.sync();
           } 
        });
    },
	updatetitle: function(ct) {
		var panel = this.getHistory();
		panel.setTitle("My History (" + ct + ")");
	}
});