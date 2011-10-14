Ext.define("Gloss.model.Note", {
	extend:	"Ext.data.Model",
	idProperty: "id",
	fields: [
		{name: "id", type: "int"},
		{name: "target", type: "string"},
		{name: "title", type: "string"},
		{name: "type", type: "string"},
		{name: "content", type: "string"},
		{name: "created", type: "date"},
		{name: "updated", type: "date"}
	]
});