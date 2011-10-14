Ext.define("Gloss.model.CustomParameter", {
	extend:	"Ext.data.Model",
	idProperty: "id",
	fields: [
		{name: "id", type: "int"},
		{name: "title", type: "string"},
		{name: "required", type: "int"},
		{name: "defaultvalue", type: "string"},
		{name: "description", type: "string"}
	]
});