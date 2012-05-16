Ext.define("Gloss.controller.Notes", {
    extend: "Ext.app.Controller",
	stores: ["Notes"],
	models: ["Note"],
	views: 	["notes.List","notes.Form"],
	refs:	[
		{ref: 'mainContent', selector: 'maincontent'},
		{ref: "notes", selector: "notes"},
		{ref: "notesForm", selector: "notesform"},
		{ref: "navigationTree", selector: "navigationtree"}
	],
	init: function() {
		var me = this;
		this.getNotesStore().on("datachanged",function(){
			me.updatetitle(this.getCount());
		});
		this.control({
            "maincontent": {
				afterupdate: function(target,title,type) {
					var me = this;
					// after content has been updated, get all links for notes
					// add a listener to add/edit note based on selected
					var links = Ext.select("*[class=actionnote]").each(function(){
						this.on("click",function(){me.shownote(target,title,type);},me);
					});
				}
			},
			"notes": {
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
                itemdblclick: function(grid,record,item,idx,e,opts) {
                    this.shownote(record.data.target,record.data.title,record.data.type)  
                },
				itemcontextmenu: function(view,record,item,index,e) {
					var me = this;
					var r  = record.data;
					e.stopEvent();
					if (!item.ctxMenu) {
						item.ctxMenu = new Ext.menu.Menu({
							items : [
								{
									text:	"View/Edit Note",
									icon:	"images/magnifier.png",
									handler:function(btn) {
										me.shownote(record.data.target,record.data.title,record.data.type);
									}
								},
								{
									text:	"Delete Forever",
									icon:	"images/delete.png",
									handler:function(btn) {
										me.deletenote(record,item);
									}
								}
								
							],
							defaultAlign: "tl"
						});
					}
					item.ctxMenu.showBy(item);
				}
			},
			"#noteswindow button[action=savenote]": {
				click: function() {
					// invoke savenote() to add/edit a note
					this.savenote();
					// hide the window...since we're done with it :)
					Ext.getCmp("noteswindow").hide();
				}
			}
        });	
	},
	shownote: function(target,title,type) {
		var win = Ext.getCmp("noteswindow");
        if (!win) {
            win = new Ext.window.Window({
                title:      "Add/Edit Note",
                modal:      true,
                id:         "noteswindow",
                resizable:  true,
                draggable:  true,
                layout:     "fit",
                width:      350,
                padding:    5,
                minHeight:  300,
                height:     300,
                bodyPadding:5,
                closeAction:"hide",
                fbar: [
                    '->',
                    {
                        text:   "Save Note",
                        id:     "notebutton",
                        action: "savenote"
                    }
                ],
                items: [{xtype:"notesform"}]
            })
        }
        var store = this.getNotesStore();
        var form  = this.getNotesForm();
		// try to find a match on the target
		var match = store.findBy(function(record,id) {
            if(record.get('target')==target && record.get('type')==type) {
                return true;
            }
        });
		// if there is a match, get the model instance at the index and set the content
		if(match != -1) {
			var record = store.getAt(match);
		}
		else {
			 var note = Ext.ModelMgr.getModel('Gloss.model.Note');
             var record = new note({
                title:  title,
                target: target,
                type:   type,
                content:''
            });
		}
        form.loadRecord(record);
        if(Ext.getCmp("notetextarea").labelEl!=null) {
            // set label
            Ext.getCmp("notetextarea").labelEl.update("Note for <span style='font-weight:bold;'>" + title + "</span>");
        }
        else {
            Ext.getCmp("notetextarea").fieldLabel = "Note for <span style='font-weight:bold;'>" + title + "</span>";
        }
		// show window
		win.show();
	},
    savenote: function() {
        var store = this.getNotesStore();
        var form  = this.getNotesForm();
        var dt = new Date();
        var date = Ext.Date.format(dt, 'Y-m-d g:i a');
        var vals = form.getValues();
        vals.date = date;
        // try to find match on the target
        var match = store.findBy(function(record,id) {
            if(record.get('target')==vals.target && record.get('type')==vals.type) {
                return true;
            }
        });
        // if there is NO match, add a record
        if (match == -1) {          
            this.addnote(vals);
        }
        // otherwise, we have a match and should UPDATE data
        else {
           this.updatenote(match,vals);
        }
    },
	addnote: function(vals) {
		var store = this.getNotesStore();
        var note = Ext.ModelMgr.getModel('Gloss.model.Note');
        // create new model instance with desired data
        var newrecord = new note({
            title:  vals.title,
            target: vals.target,
            type:   vals.type,
            content:vals.content,
            created:vals.date
        });
        store.add(newrecord);
        store.sync();
        this.getController("Messages").showmessage("addnote");
	},
    updatenote: function(idx,vals) {
        var store = this.getNotesStore();
        // get model instance at specified index
        var record = store.getAt(idx);
        // set the new values
        record.set("content",vals.content);
        record.set("updated",vals.date);
        store.sync();
        this.getController("Messages").showmessage("savenote");
    },
    deletenote: function(record,item) {
        Ext.Msg.confirm(
            "Wait, wait, wait!",
            "Have you thought through the political, philosophical, and grammatical consequences of deleting this?",
            function(btn) {
                if(btn=='yes') {
                    this.getController("Messages").showmessage("deletenote");
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
                }
                else {
                    return false;
                }
            },
            this
        );
    },
	updatetitle: function(ct) {
		var panel = this.getNotes();
		panel.setTitle("My Notes (" + ct + ")");
	}
});