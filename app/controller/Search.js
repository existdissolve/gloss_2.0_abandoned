Ext.define("Gloss.controller.Search", {
    extend: "Ext.app.Controller",
	stores: ["Search"],
	models: ["Search"],
	views: 	["search.Form","search.Panel","search.List"],
	refs:	[
		{ref: "navigationTree", selector: "navigationtree"},
		{ref: "searchForm",selector:"searchform"},
		{ref: "searchGrid",selector:"searchgrid"},
		{ref: "search", selector: "search"}
	],
	init: function() {
		this.control({
			"searchform textfield": {
                keydown: function(fld,e,opts) {
                    len = fld.getValue().length;
                    if(len>=3 && e.keyCode!= 9) {
                        this.dosearch(fld.getValue());
                    }
                    if(e.keyCode==9 || e.keyCode==40) {
                        var grid = this.getSearchGrid();
                        if(grid.store.getCount() > 0) {
                            grid.getView().focusRow(0);
                            grid.getSelectionModel().select(0);
                        }  
                    }  
                }
			},
			"searchgrid checkboxfield": {
				change: function(fld,newvalue,oldvalue,opts) {
					this.filterresults();
				}
			},
			"searchgrid": {
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
                afterrender: function(grid,opts) {
                    grid.view.getEl().set({tabindex:1001})
                }
			},
            "searchgrid gridview": {
                itemkeydown: function(grid,rec,item,idx,e,opts) {
                    if(e.keyCode==13 || e.keyCode==32) {
                        var tree = this.getNavigationTree();
                        tree.fireEvent("externalload",rec.data.target,rec.data.title,rec.data.type);
                    }
                    if(e.keyCode==9) {
                        e.preventDefault();
                        var total = rec.store.getCount();
                        if(idx+1 < total) {
                           grid.select(idx+1);
                        }
                        
                    }
                }
            }
        });	
	},
	filterresults: function() {
		var store = this.getSearchStore();
		var ref = Ext.getCmp("checkbox-reference");
        var ten = Ext.getCmp("checkbox-10");
		var cflib = Ext.getCmp("checkbox-cflib");
		var custom = Ext.getCmp("checkbox-custom");
		var filters = [];
		store.clearFilter();
		if(ref.checked) {
			filters.push('cfmlref');
		}
        if(ten.checked) {
            filters.push('cfmlref10');
        }
		if(cflib.checked) {
			filters.push('udf');
		}
		if(custom.checked) {
			filters.push('custom');
		}
		var filter = new Ext.util.Filter({
			filterFn: function(item) {
				for(i=0;i<filters.length;i++) {
					if(item.data.type==filters[i]) {
						return true;
					}
				}
			}
		})
		store.filter(filter);
	},
	dosearch: function(q) {
		var customcontent = Ext.getStore("CustomContent").getRange();
        var cc = [];
        if(customcontent.length) {
            for (i=0;i<customcontent.length;i++) {
                cc.push(customcontent[i].data);
            }
        }
        Ext.Ajax.request({
			url:	"com/search.cfc",
			params:	{method:"searchcontent",query:q,returnformat:"json",customcontent:Ext.encode(cc)},
			success:this.loadsearchgrid,
			scope:	this
		})
	},
	loadsearchgrid: function(req,opts) {
		var store = this.getSearchStore();
		store.loadData(Ext.decode(req.responseText).search);
		me = store; 
	},
	updatetitle: function(ct) {
		var panel = this.getBookmarks();
		panel.setTitle("My Bookmarks (" + ct + ")");
	},
    activatesearch: function() {
        Ext.getCmp("searchfield").focus(true);
        this.getSearch().expand();
    }
});