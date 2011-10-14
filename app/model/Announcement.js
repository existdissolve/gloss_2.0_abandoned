Ext.define("Gloss.model.Announcement", {
	extend:	"Ext.data.Model",
	idProperty: "id",
	fields: [
		{name: "id", type: "int"},
		{name: "title", type: "string"},
		{name: "content", type: "string"},
		{name: "created", type: "date"}
	]
});