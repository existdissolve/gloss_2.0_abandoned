Ext.define("Gloss.controller.Settings", {
    extend: "Ext.app.Controller",
    stores: ["Settings"],
    models: ["Setting"],
    views:  ["settings.Form","settings.Walkthrough"],
    refs:   [
        {ref: 'mainContent', selector: 'maincontent'},
        {ref: "SettingsForm",selector: 'settingsform'},
        {ref: "Walkthrough",selector: 'walkthrough'}
    ],
    init: function() {        
        var me = this;
        this.getSettingsStore().on("datachanged",function(store,records,successful,operation,opts) {
            var loadlastvisited = me.getsetting("loadlastvisited");
            var loadnavigation = me.getsetting("loadnavigation");
            var colorscheme = me.getsetting("colorscheme");
            var sawwalkthrough = me.getsetting("sawwalkthrough");
            if(loadlastvisited) {
                Ext.getCmp("loadlastvisited").setValue({
                    loadlastvisited: loadlastvisited.data.value
                });
            }
            if(loadnavigation) {
                Ext.getCmp("loadnavigation").setValue({
                    loadnavigation: loadnavigation.data.value
                });
            }
            if(colorscheme) {
                Ext.getCmp("colorschemegroup").setValue({
                    colorscheme: colorscheme.data.value
                });
            }
        })
        this.control({          
            "maincontent": {
                afterupdate: function(target,title,type) {
                    var value = {target:target,title:title,type:type};
                    this.savesetting("lastvisited",Ext.encode(value));
                }
            },
            "settingsform radiofield": {
                change: function(field,newval,oldval,opts) {
                    if(field.checked) {
                        var name = field.name;
                        var value= field.inputValue;
                        
                        this.savesetting(name,value);
                        if (name == "colorscheme") {
                            this.switchstylesheet(value);
                        }
                    }
                }
            },
            "settingsform button": {
                click: this.showwalkthrough
            }
        }); 
    },
    showwalkthrough: function() {
        var win = Ext.getCmp("walkthroughwindow")
        if(!win) {
            Ext.create("Ext.window.Window",{
                title: "Gloss Walkthrough",
                id: "walkthroughwindow",
                layout: "fit",
                width: 550,
                shadow: "frame",
                modal: true,
                closeAction: "hide",
                items: [{xtype: "walkthrough"}]
            }).show();
        }
        else {
            win.show()
        }
    },
    hassetting: function(name) {
        var store = this.getSettingsStore();
        if(store.find("name","lastvisited") != -1) {
            return true;
        }
        else {
            return false;
        }
    },
    getsetting: function(name,simple) {
        var store = this.getSettingsStore();
        var idx = store.find("name",name);
        var record = store.getAt(idx);
        if(record && simple) {
            return record.data.value;
        }
        else {
            return record;
        } 
    },
    savesetting: function(name,value) {
        var store = this.getSettingsStore();
        var match = store.find("name",name);
        if (match == -1) {
            this.addsetting(name,value);
        }
        else {
            this.updatesetting(name,value);
        }
    },
    addsetting: function(name,value) {
        var store = this.getSettingsStore();
        var setting = Ext.ModelMgr.getModel('Gloss.model.Setting');
        var newrecord = new setting({
            name:   name,
            value:  value
        });
        store.add(newrecord);
        store.sync();   
    },
    updatesetting: function(name,value) {
        var store = this.getSettingsStore();
        var idx = store.find("name",name);
        var record = store.getAt(idx);
        // set the new values
        record.set("value",value);
        store.sync();
    },
    deletesetting: function(name) {
        
    },
    switchstylesheet: function(sheet) {
        var base = "resources/css/";
        var bodymasked = Ext.getBody().isMasked();
        if(!bodymasked) {
           var longstring = "<span id='sp1' class='sp'>Adjusting aesthetic...</span><span id='sp2' class='sp'>Enhancing experience...</span><span id='sp3' class='sp'>Pre-fetching awesome...</span>";
           var shortstring= "Loading Color Scheme..."
           var maskstring = !Ext.isGecko && !Ext.isWebKit ? shortstring : longstring;
           var maskcls = !Ext.isGecko && !Ext.isWebKit ? "" : "custommask";
           Ext.getBody().mask(maskstring,maskcls); 
        }
        if(Ext.get("ss-" + sheet)) {
            Ext.select("link[id!=ss-"+sheet+"]").each(function(){
               this.set({rel:"alternate"}); 
            });
            Ext.get("ss-"+sheet).set({rel:"stylesheet"});
        }
        else {
            var dh = Ext.core.DomHelper;
            dh.append("header",{tag:"link",rel:"stylesheet",type:"text/css",href:base+"ext-all-"+sheet+".css",id:"ss-"+sheet});
        }
        if (!bodymasked) {
            Ext.Function.defer(function(){
                Ext.getBody().unmask()
            }, 2000)
        }
    }
});