Ext.define("Gloss.controller.Messages", {
    extend: "Ext.app.Controller",
	init: function() {
		this.control({
            
        });	
	},
	showmessage: function(type) {
		var el = Ext.get("message");
		var msg = "";
		var dir = !dir ? "fadeIn" : dir;
		switch(type) {
			case "loadpage":
				msg = "Fetching page..."; 
				break;
			case "addbookmark":
				msg = "Bookmark saved!"; 
				break;
			case "deletebookmark":
				msg = "Bookmark deleted."; 
				break;
			case "addnote":
				msg = "Note added!"; 
				break;
			case "savenote": 
				msg = "Note saved.";
				break;
			case "deletenote":
				msg = "Note discarded."; 
				break;
			case "deletehistory":
				msg = "History undone."; 
				break;
			case "addcontent":
				msg = "Content added!"; 
				break;
			case "savecontent":
				msg = "Content saved."; 
				break;
			case "deletecontent":
				msg = "Delete it? Done."; 
				break;
		}
		el.update(msg);
		el.fadeIn({
			endOpacity:1,
			easing:'easeOut',
			duration:1000,
			stopFx:true,
			useDisplay: true
		}).pause(1000).fadeOut({
			endOpacity:0,
			easing:'easeOut',
			duration:1500,
			useDisplay: true
		});
	}
});