var invalidbrowser = (Ext.isIE && !Ext.isIE9)|| !localStorage ? true : false;
Ext.require(['Ext.util.History']);
Ext.onReady(function(){
    if(invalidbrowser) {
        Ext.getBody().mask('', "maskmsg");
        Ext.get("iemessage").setDisplayed("block");
    }
    else {   
        var body = Ext.getBody();
        var longstring = "<span id='sp1' class='sp'>Loading warm-fuzzies...</span><span id='sp2' class='sp'>Instantiating shinyness...</span><span id='sp3' class='sp'>Pre-fetching awesome...</span>";
        var shortstring = "Loading Gloss...";
        var maskcls = !Ext.isGecko && !Ext.isWebKit ? "" : "custommask";
        var maskstring = !Ext.isGecko && !Ext.isWebKit ? shortstring : longstring;
        body.mask(maskstring, maskcls);
    }
});
if (!invalidbrowser) {
    Ext.application({
        name: "Gloss",
        appFolder: "app",
        autoCreateViewport: true,
        controllers: ["Settings", "Navigation", "CustomContent", "Bookmarks", "Notes", "Comments", "History", "Announcements", "Messages", "Search"],
        launch: function(){
            var me = this;
            Ext.util.History.init();
            Ext.apply(Ext.util.History, {
                suppressChange: false,
                add: function(token, preventDup, suppressChange){
                    var me = this;
                    this.suppressChange = suppressChange ? true : false;
                    if (preventDup !== false) {
                        if (me.getToken() === token) {
                            return true;
                        }
                    }
                    if (me.oldIEMode) {
                        return me.updateIFrame(token);
                    }
                    else {
                        window.top.location.hash = token;
                        return true;
                    }
                },
                handleStateChange: function(token){
                    this.currentToken = token;
                    // only fire "change" event if suppressChange is false
                    if (!this.suppressChange) {
                        this.fireEvent('change', token);
                    }
                    // now just reset the suppressChange flag
                    this.suppressChange = false;
                }
            });
            Ext.util.History.on('change', function(token, opts){
                if (token) {
                    var page = token.split(":");
                    var type, target;
                    switch (page[0]) {
                        case '1':
                            type = "CFMLRef";
                            target = page[1];
                            break;
                        case '5':
                            type = "CFMLRef10";
                            target = page[1];
                            break;
                        case '2':
                            type = "custom";
                            target = "custom_content_" + page[1];
                            break;
                        case '3':
                            type = "library";
                            target = "cflib_lib_" + page[1];
                            break;
                        case '4':
                            type = "udf";
                            target = "cflib_udf_" + page[1];
                            break;
                    }
                    me.getController("Navigation").loadfromhistory(target, type);
                }
            });
            var map = new Ext.util.KeyMap(Ext.getBody(), {
                key: 83,
                ctrl: true,
                handler: function(){
                    this.getController("Search").activatesearch();
                },
                scope: this,
                defaultEventAction: "stopEvent"
            });
        }
    });
}