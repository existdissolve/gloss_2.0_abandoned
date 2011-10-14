Ext.define("Gloss.model.Setting", {
	extend:	"Ext.data.Model",
    idProperty:"id",
	fields: [
        {name: "id", type: "int"},
		{name: "name", type: "string"},
		{name: "value", type: "string"}
	]
});