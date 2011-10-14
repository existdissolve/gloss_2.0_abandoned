Ext.define("Gloss.controller.CustomContent", {
    extend: "Ext.app.Controller",
    stores: ["CustomContent","CustomParameters"],
    models: ["CustomContent","CustomParameter"],
    views:  [
        "customcontent.ContentForm",
        "customcontent.ParamForm",
        "customcontent.ParamGrid"
    ],
    refs:   [
        {ref: "ContentForm", selector:"contentform"},
        {ref: "ParamForm", selector: "paramform"},
        {ref: "ParamGrid", selector: "paramgrid"}
    ],
    init: function() {
        var me = this;
        this.getCustomParametersStore().on("datachanged",function(){
            me.refreshcustomcontent();
        });
        this.control({          
            "#customcontentwindow": {
                hide: function(win, options) {
                    this.getCustomParametersStore().removeAll();
                }
            },
            "#customcontentwindow button[action=savecustomcontent]": {
                click: function(button,e,options) {
                    this.savecustomcontent();
                }
            },
            "paramgrid tool[type=plus]": {
                click: function(tool,e,options) {
                    this.loadcustomparameters(false);
                }
            },
            "paramgrid": {
                cellclick: function(grid,col,cidx,rec,row,ridx,e) {
                    if(cidx==4) {
                        this.deletecustomparameter(rec);
                    }
                    else {
                        this.loadcustomparameters(rec);
                    }
                }
            },
            "#customparamwindow button[action=savecustomparams]": {
                click: function(button,e,options) {
                    this.savecustomparameter();                   
                }
            }
        }); 
    },  
    loadcustomcontent: function(rec) {
        var win = Ext.getCmp("customcontentwindow");
        if(!win) {
            win = new Ext.window.Window({
                title:      "Add/Edit Custom Content",
                id: "customcontentwindow",
                modal:      true,
                layout:     "fit",
                width:      740,
                height:     500,
                padding:    5,
                closeAction:"hide",
                fbar: [
                    '->',
                    {
                        text:   "Save Custom Content",
                        id:     "customcontentbutton",
                        action: "savecustomcontent"
                    }
                ],
                items: [{xtype: "contentform"}]
            });
        }

        var cform   = this.getContentForm();
        var pform   = this.getParamForm();
        var pstore  = this.getCustomParametersStore();
        // if record is not defined (or false), reset forms; it's a new record! :)      
        if(!rec) {
            cform.getForm().reset();
        }
        // otherwise, use record to load up form with the right values
        else {
            cform.loadRecord(rec);
            pstore.loadData(Ext.decode(rec.data.params));
            this.refreshcustomcontent();
        }
        // now show the window
        win.show();
    },
    savecustomcontent: function() {
        var win     = Ext.getCmp("customcontentwindow");
        var cform   = this.getContentForm();
        var store   = this.getCustomContentStore();
        var pstore  = this.getCustomParametersStore();
        var vals    = cform.getValues();
        var params  = pstore.getRange();
        var paramsstr = [];
        params.forEach(function(item,index,allitems){
            paramsstr.push(item.data);
        })
        vals.params = paramsstr;
        // try to find match on the customcontent title                 
        var match = store.find("id",vals.id,0,false,true,true);
        // if there is NO match, add a record
        if (match == -1) {
           this.addcustomcontent(vals);
        }
        // otherwise, we have a match and should UPDATE data
        else {
            this.updatecustomcontent(match,vals);
        }
        win.hide();
    },
    addcustomcontent: function(vals) {
        var store   = this.getCustomContentStore();
        var customcontent = Ext.ModelMgr.getModel('Gloss.model.CustomContent');
        // create new model instance with desired data
        var newrecord = new customcontent({
            title:          vals.title,
            target:         "custom_content_" + vals.title,
            description:    vals.description,
            syntax:         vals.syntax,
            usage:          vals.usage,
            example:        vals.example,
            params:         Ext.encode(vals.params)
        });
        store.add(newrecord);
        store.sync();
        this.getController("Messages").showmessage("addcontent");
    },
    updatecustomcontent: function(idx,vals) {
        var store  = this.getCustomContentStore();
        var record = store.getAt(idx);
        record.set("title",vals.title);
        record.set("target","custom_content_"+vals.title);
        record.set("description",vals.description);
        record.set("syntax",vals.syntax);
        record.set("usage",vals.usage);
        record.set("example",vals.example);
        record.set("params",Ext.encode(vals.params)); 
        store.sync();
        this.getController("Messages").showmessage("savecontent");
    },
    deletecustomcontent: function(rec,item) {
        Ext.Msg.confirm(
            "Hold your horses...",
            "Are you sure you want to delete this? Like a poorly executed tattoo, this is something you can't 'undo'...",
            function(btn) {
                if(btn=='yes') {
                    this.getController("Messages").showmessage("deletecontent");
                    Ext.get(item).fadeOut({
                        opacity: 0,
                        easing: "easeOut",
                        duration: 500,
                        useDisplay:true,
                        scope: this,
                        callback: function() {
                            var store = this.getCustomContentStore();
                            store.remove(rec);
                            store.sync();
                            var bstore = Ext.getStore("Bookmarks");
                            var nstore = Ext.getStore("Notes");
                            var hstore = Ext.getStore("History");
                            
                            var brec = bstore.findRecord("target",rec.data.target);
                            var nrec = nstore.findRecord("target",rec.data.target);
                            var hrec = hstore.findRecord("target",rec.data.target)
                            if(brec) {
                                bstore.remove(brec);
                                bstore.sync();
                            }
                            if(nrec) {
                                nstore.remove(nrec);
                                nstore.sync();
                            }
                            if(hrec) {
                                hstore.remove(hrec);
                                hstore.sync();
                            }
                        }
                    })
                }
                else {
                    return false;
                }
            },
            this
        );
    },
    loadcustomparameters: function(rec) {
        var win = Ext.getCmp("customparamwindow");
        if (!win) {
            win = new Ext.window.Window({
                title:      "Add/Edit Parameter",
                modal:      true,
                resizable:  true,
                draggable:  true,
                padding:    5,
                closeAction:"hide",
                id: "customparamwindow",
                fbar: [
                    '->',
                    {
                        text:   "Save Parameter",
                        id:     "customcontentparambutton",
                        action: "savecustomparams"
                    }
                ],
                items: [{xtype:"paramform"}]
            })
        }
        var pform   = this.getParamForm();
        // if record is not defined (or false, reset form; it's a new parameter! :)
        if(!rec) {
            pform.getForm().reset();
        }
        // otherwise, use record to load up form with the right values
        else {
            pform.loadRecord(rec);
        }
        win.show();
    },
    savecustomparameter: function() {
        var win =Ext.getCmp("customparamwindow");    
        var form =  this.getParamForm();
        var store = this.getCustomParametersStore();
        var vals =  form.getValues();
        
        // do some validation
        if(vals.title =="") {
            Ext.Msg.alert("Hey now...","Yeah, you should enter a title before saving that.");
            return false;
        }
        if(vals.required==undefined) {
            Ext.Msg.alert("Um?","What do you have against clicking buttons? Let us know whether this is required or not, por favor.")
            return false;
        }
        
        // try to find match on the param title
        var match = store.find("id",vals.id,0,false,true,true);
        // if there is NO match, add a record
        if (match == -1) {          
            this.addcustomparameter(vals);
        }
        // otherwise, we have a match and should UPDATE data
        else {
            this.updatecustomparameter(match,vals);
        }
        win.hide();
    },
    addcustomparameter: function(vals) {
        var store = this.getCustomParametersStore();
        var param = Ext.ModelMgr.getModel('Gloss.model.CustomParameter');
        var newrecord = new param({
            title:      vals.title,
            required:   vals.required,
            defaultvalue:vals.defaultvalue,
            description:vals.description
        });
        store.add(newrecord);
        store.sync();
    },
    updatecustomparameter: function(idx,vals) {
        var store = this.getCustomParametersStore();
        // get model instance at specified index
        var record = store.getAt(idx);
        // set the new values
        record.set("title",vals.title);
        record.set("required",vals.required);
        record.set("defaultvalue",vals.defaultvalue);
        record.set("description",vals.description);
        store.sync();
    },
    deletecustomparameter: function(record) {
        var store = record.store;
        store.remove(record);
        store.sync();
    },
    refreshcustomcontent: function() {
        var cform   = this.getContentForm();
        cform.doComponentLayout();
    }
});