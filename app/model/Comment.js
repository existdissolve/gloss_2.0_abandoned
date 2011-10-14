Ext.define("Gloss.model.Comment", {
	extend:	"Ext.data.Model",
	idProperty: "id",
	fields: [
		{name: "id",type:"int"},
		{name: "description", type: "string"},
		{name: "author", type: "string"},
		{name: "pubdate", type: "string"}
	]
});