Ext.define("Gloss.view.announcements.Window", {
	extend: 	"Ext.window.Window",
	alias:		"widget.announcementswindow",
	title:		"Announcement",
    id:         "announcementwindow",
	modal: 		true,
	resizable: 	true,
	draggable: 	true,
	layout:		"fit",
	width:		350,
	padding:	5,
	minHeight:	300,
	closeAction:"hide",
	bodyPadding: 5,
	styleHtmlContent: true,
	initComponent: function() {
		this.callParent(arguments);
	}
});