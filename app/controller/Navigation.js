Ext.define("Gloss.controller.Navigation", {
    extend: "Ext.app.Controller",
	stores: ["Navigation","CFLib","CustomContent"],
	models: ["Navigation","CFLib","CustomContentTree"],
	views: 	[
		"navigation.Content",
        "navigation.Tree",
		"navigation.CFLib",
		"navigation.CustomContentNav"
	],
	refs:	[
		{ref: 'mainContent', selector: 'maincontent'},
		{ref: "tree", selector: "navigationtree"},
		{ref: "CFLib", selector: "cflib"},
		{ref: "CustomContentNav", selector: "customcontentnav"}
	],
	init: function() {
        var me = this;
        var hash = location.hash;
        var splithash = hash.split(":")[0].replace("#","");
        this.getNavigationStore().on("load",function(){
            if(hash!="" && splithash == 1 || hash=="") {
                // once store is loaded, try to retrieve the default page
                me.loaddefaultpage();
            }
            Ext.Function.defer(function(){
                Ext.getBody().unmask()
                /* uncomment to show walkthrough immediately...
                var sw = me.getController("Settings").getsetting("sawwalkthrough",true);
                if(!sw) {
                    me.getController("Settings").showwalkthrough();
                }
                */
            }, 3000)
        });
        this.getCFLibStore().on("load",function(){
            if(hash!="" && (splithash==3 || splithash==4)) {
                // once store is loaded, try to retrieve the default page
                me.loaddefaultpage();
            }
        });
        this.getCustomContentStore().on("load",function(){
            if(hash!="" && splithash==2) {
                // once store is loaded, try to retrieve the default page
                me.loaddefaultpage();
            }
        });
        this.control({			
			"maincontent": {
				afterupdate: function(target,title,type,redirect) {
					var me = this;
					var links = Ext.select("*[class=glosslink]").each(function(){
						var title 	= this.getAttribute("linktitle");
						var target	= this.getAttribute("linktarget");
						var type	= this.getAttribute("linktype");
						this.on("click",function(){
							me.loadurl(target,title,type)
						});
					});
					var anchors = Ext.get("body").select("*[href^=#W]").on("click",this.scrollpage,this);
					if (redirect) {
                        this.doredirect(redirect);
                    }
                    else {
                        this.resetpage();
                    }
                    this.getController("History").addhistory(target,title,type);
                    // add to real Ext History
                    var otoken = Ext.util.History.getToken();
                    switch(type) {
                        case "CFMLRef":
                            type = 1;
                            break;
                        case "custom":
                            type = 2;
                            target = target.replace("custom_content_","");
                            break;
                        case "library":
                            type = 3;
                            target = target.replace("cflib_lib_","");
                            break;
                        case "udf": 
                            type = 4;
                            target = target.replace("cflib_udf_","");
                            break;
                    }
                    var ntoken = type + ":" + target;
                    if(otoken === null || otoken.search(ntoken) === -1) {
                        Ext.History.add(ntoken,true,true);
                    }
                    var bodymasked = Ext.getBody().isMasked();
                    if(!bodymasked) {
                        var maincontent = Ext.select(".maincontent");
                        maincontent.unmask();
                    }
				}
			},
			"customcontentnav": {
				itemclick: function(grid,rec,item,idx,e,opts) {
					// only allow event if it's a true right click; block event if ctrl+click on mac
					if (e.type == "click" && e.ctrlKey == false) {
						var tree = this.getTree();
						tree.fireEvent("externalload", rec.data.target, rec.data.title, rec.data.type);
					}
					else {
						return false;
					}
				},
                itemdblclick: function(grid,rec,item,idx,e,opts) {
                    this.getController("CustomContent").loadcustomcontent(rec);
                },
				itemcontextmenu: function(view,record,item,index,e) {
					var me = this;
					var r  = record.data;
					e.stopEvent();
					if (!item.ctxMenu) {
						item.ctxMenu = new Ext.menu.Menu({
							items : [
								{
									text:	"Edit",
									icon:	"images/cog.png",
									handler:function(btn) {
										me.getController("CustomContent").loadcustomcontent(record);
									}
								},
								{
									text : 	"Add Bookmark",
									icon:	"images/tag-color.png",
									handler: function(btn) {
										me.getController("Bookmarks").addbookmark(r.target,r.title,r.type);
									}
								},
								{
									text: 	"Add Note",
									icon:	"images/note.png",
									handler:function(btn) {
										me.getController("Notes").shownote(r.target,r.title,r.type);
									}
								},
								{
									text:	"Delete Forever",
									icon:	"images/delete.png",
									handler:function(btn) {
										me.getController("CustomContent").deletecustomcontent(record,item);
									}
								}
								
							],
							defaultAlign: "tr"
						});
					}
					item.ctxMenu.showBy(item);
				}
			},
            "customcontentnav button": {
				click: function(tool,e,options){
					this.getController("CustomContent").loadcustomcontent(false);
				}
			},
			"navigationtree": {
				itemclick: function(view,record,item,index,e) {
					// only allow event if it's a true right click; block event if ctrl+click on mac
					if (e.type == "click" && e.ctrlKey == false) {
						var store = this.getCustomContentStore();
						this.loadurl(record.data.target, record.data.title, record.data.type);
					}
					else {
						return false;
					}
				},
				externalload: function(target,title,type) {
					this.loadurl(target,title,type);
				},
				itemcontextmenu: function(view,record,item,index,e) {
					var me = this;
					var r  = record.data;
					e.stopEvent();
					if (!item.ctxMenu) {
						item.ctxMenu = new Ext.menu.Menu({
							items : [
								{
									text : 	"Add Bookmark",
									icon:	"images/tag-color.png",
									handler: function(btn) {
										me.getController("Bookmarks").addbookmark(r.target,r.title,r.type);
									}
								},
								{
									text: 	"Add Note",
									icon:	"images/note.png",
									handler:function(btn) {
										me.getController("Notes").shownote(r.target,r.title,r.type);
									}
								}
							],
							defaultAlign: "tr"
						});
					}
					item.ctxMenu.showBy(item);
				}
			},
			"cflib": {
				itemclick: function(view,record,item,index,e) {
					// only allow event if it's a true right click; block event if ctrl+click on mac
					if (e.type == "click" && e.ctrlKey == false) {
						this.loadurl(record.data.target, record.data.title, record.data.type);
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
									text : 	"Add Bookmark",
									icon:	"images/tag-color.png",
									handler: function(btn) {
										me.getController("Bookmarks").addbookmark(r.target,r.title,r.type);
									}
								},
								{
									text: 	"Add Note",
									icon:	"images/note.png",
									handler:function(btn) {
										me.getController("Notes").shownote(r.target,r.title,r.type);
									}
								}
							],
							defaultAlign: "tr"
						});
					}
					item.ctxMenu.showBy(item);
				}
			}
        });	
	},
    loadfromhistory: function(target,type) {
        var title;
        switch (type.toLowerCase()) {
            case "cfmlref":
                var store = this.getNavigationStore().getRootNode();
                var record = store.findChild("target",target,true);
                title = record.data.title;
                break;
            case "library":
                var store  = this.getCFLibStore().getRootNode();
                var record = store.findChild("target",target,true);
                title = record.data.title;
                break;
            case "udf":
                var store  = this.getCFLibStore().getRootNode();
                var record = store.findChild("target",target,true);
                title = record.data.title;
                break;
            case "custom":
               var store = this.getCustomContentStore();
               var record= store.findRecord("target",target); 
               title = record.data.title;
               break;
        }  
        this.loadurl(target,title,type);
    },
	loadurl: function(target,title,type) {
		var me = this;
		var method 	= "";
		var url		= "";
		switch(type.toLowerCase()) {
			case "library":
                method 	= "getlibrary";
				url  	= "com/cflib.cfc";
				params 	= {method:method,returnformat:"json",target:target,title:title,type:type};
				break;	
			case "udf":
                method 	= "getudf";
				url  	= "com/cflib.cfc";
				params 	= {method:method,returnformat:"json",target:target,title:title,type:type};
				break;
			case "cfmlref":
                method 	= "loadpage";
				url  	= "com/navigation.cfc";
				type	= "CFMLRef";
				params 	= {method:method,returnformat:"json",target:target,title:title,type:type};
				break;
			case "developing": 
				method	= "loadpage";
				url		= "com/navigation.cfc";
				type	= "Developing";
				params	= {method:method,returnformat:"json",target:target,title:title,type:type};
				break;
			case "custom": 
				method 	= "loadcustompage";
				url	   	= "com/custom.cfc";
				var store = this.getCustomContentStore();
                
				var index = store.find("target",target);
				if(index != -1) {
					var content = Ext.encode(store.getAt(index).data);
					params 	= {method:method,returnformat:"json",target:target,title:title,type:type,content:content};
				}
				else {
					Ext.Msg.alert("Attention","Whoops, someone broke something (it was probably Larry...). We couldn't find your custom page...");
					return false;
				}
				break;
		}
        var bodymasked = Ext.getBody().isMasked();
        if (!bodymasked) {
            var maincontent = Ext.select(".maincontent");
            maincontent.mask("Searching high and low...");
        }
		Ext.Ajax.request({
			url: 	url,
			params: params,
			success: function(req,opts) {me.loadpage(req,opts)},
            failure: function() {mainbody.unmask()}
		});
	},
	loadpage: function(req,opts) {
		var me = this;
		var content = this.getMainContent();
        var response = Ext.decode(req.responseText);
		var result = response.content;
		content.update(result,false,function(){
            me.addgoodies(opts.params.target,opts.params.title,opts.params.type);
			content.fireEvent("afterupdate",opts.params.target,opts.params.title,opts.params.type,response.redirect);
			me.findnavitem(opts.params.target,opts.params.type);
		});	
	},
    doredirect: function(loc) {
        var el = Ext.get(loc.replace(/#/,''));
        var ct = Ext.query(".maincontent")[0];
        ct = Ext.get(ct);
        var yoffset = el.getOffsetsTo(ct)[1];
        ct.scrollTo("top",yoffset,true);
    },
	addgoodies: function(target,title,type) {
		var content = this.getMainContent().getEl();
		var header = content.query("h1")[0];
		var link = Ext.core.DomHelper;
        var loc = window.location;
		link.append(header,[
			{
				tag: 	"a",
				title:	"Add a bookmark",
				linktitle: title,
				target: target,
				type: type,
				cls: "actionbookmark"
			},
			{
				tag:	"a",
				title:	"Add a note",
				linktitle: title,
				target: target,
				type:	type,
				cls:	"actionnote"
			}
		]);
        if (type != "custom") {
            var href= "";
            switch(type.toLowerCase()) {
                case "cfmlref":
                    type = 1;
                    break;
                case "library":
                    type = 3;
                    target = target.replace("cflib_lib_","");
                    break;
                case "udf": 
                    type = 4;
                    target = target.replace("cflib_udf_","");
                    break;
            }
            if(target!='index.html') {
                href = loc.protocol + "//" + loc.host + loc.pathname + "#" + type + ":" + target;
            }
            link.append(header, {
                tag: "a",
                title: "Direct link to this page",
                linktitle: title,
                target: target,
                type: type,
                cls: "actionpage",
                href: href
            })
        }
	},
	findnavitem: function(target,type) {
		var me = this;
		var tree = "";
		var grid = "";
		var store = "";
        
        var setting = this.getController("Settings").getsetting("loadnavigation",true);
        if(setting==0) {
            return false;
        }
        
		switch(type.toLowerCase()) {
			case "library":
				tree 	= this.getCFLib();
				store  	= this.getCFLibStore().getRootNode();
				break;	
			case "udf":
				tree 	= this.getCFLib();
				store  	= this.getCFLibStore().getRootNode();
				break;
			case "cfmlref":
				tree 	= this.getTree();
				store  	= this.getNavigationStore().getRootNode();
				break;
			case "custom":
				grid	= this.getCustomContentNav();
				store	= this.getCustomContentStore();
				break;
		}
		if(type!="custom") {
			var node = store.findChild("target",target,true);
			if(node) {
				tree.expand();
				var path = this.getPath(node);
				tree.selectPath(path)
                tree.determineScrollbars();
			}
		}
		else {
			var path = store.find("target",target);
			if(path!=-1) {
				grid.expand();
				grid.getSelectionModel().select(path);
                grid.determineScrollbars();
			}	
		}
	},
	getPath: function(node,field, separator) {
        field = field || node.idProperty;
        separator = separator || '/';

        var path = [node.get(field)],
            parent = node.parentNode;

        while (parent) {
            path.unshift(parent.get(field));
            parent = parent.parentNode;
        }
        return separator + path.join(separator);
    },
	loadcflib: function(target,title,type) {
		var me = this;
		var method = "";
		switch(type) {
			case "library":
				method = "getlibrary";
				break;	
			case "udf":
				method = "getudf";
				break;
		}
		Ext.Ajax.request({
			url: 	"com/cflib.cfc",
			params: {method:method,returnformat:"json",target:target,title:title},
			success: function(req,opts) {me.loadpage(req,opts)}
		});
	},
    loaddefaultpage: function() {
        var hash = location.hash;
        var record = this.getController("Settings").getsetting("lastvisited");
        if(hash!="") {
            var type = hash.split(":")[0].replace("#","");
            var target = hash.split(":")[1];
            switch(type) {
                case "1":
                    type = "cfmlref";
                    //target = target.replace(".html","")
                    break;
                case "2":
                    type = "custom";
                    target = "custom_content_"+target;
                    break;
                case "3":
                    type = "library";
                    target = "cflib_lib_"+target;
                    break;
                case "4":
                    type = "udf";
                    target = "cflib_udf_"+target;
                    break;
            }
            if (type=="cfmlref") {
                var store = this.getStore("Navigation").getRootNode();
                var node = store.findChild("target",target,true);
                var title = node.data.title;
            }
            else if(type=="library" || type=="udf") {
                var store = this.getStore("CFLib").getRootNode();
                var node = store.findChild("target",target,true);
                var title = node.data.title;
            }
            else if(type=="custom") {
                var store = this.getCustomContentStore();
                var node= store.getAt(store.find("target",target,0,true,false,false));
                var title = node.data.title;
            }
            this.loadurl(target,title,type);
        }
        // last visited
        else if(record) {
            var setting = this.getController("Settings").getsetting("loadlastvisited",true);
            if(setting==0) {
                this.loadurl("index.html","About This App","CFMLRef");
                return false;
            }
            var value = record.data.value;
            var vals = Ext.decode(value);
            this.loadurl(vals.target,vals.title,vals.type);
        }
        // default or first time visit
        else {
            this.loadurl("index.html","About This App","CFMLRef");
        }
    },
	scrollpage: function (e,el,o) {
		// get the element we're basing the scroll on (the target)
		var el = Ext.get(e.currentTarget.hash.replace(/#/,''));
		// get the container
		var ct = Ext.query(".maincontent")[0];
		ct = Ext.get(ct);
		// calculate y position of target element; this is how far we need to scroll
		var yoffset = el.getOffsetsTo(ct)[1];
		// do the scroll
		ct.scrollTo("top",yoffset,true);
		// call preventDefault on the original click event to prevent anchor jump
		e.preventDefault();
	},
	resetpage: function() {
		var ct = Ext.query(".maincontent")[0];
		ct = Ext.get(ct);
		ct.scrollTo("top",0,true);
	}
});