Ext.define("Gloss.model.CustomContentTree", {
    extend: "Ext.data.Model",
	idProperty: "id",
    fields: [
        {name: "id", type: "int"},
		{name: "title", type: "string"},
		{name: "target",type:"string"},
		{name: "description", type: "string"},
		{name: "type", type: "string", defaultValue:"custom"},
		{name: "text", type: "string"},
		{name: "cls", type:"string", defaultValue:"list-item"},
		{name: "iconCls",type:"string", defaultValue: "no-icon"},
		{name: "leaf",type:"boolean", defaultValue: true},
		{name: "syntax", type: "string"},
		{name: "usage", type: "string"},
		{name: "example", type: "string"},
		{name: "params", type: "string"}
	]
});