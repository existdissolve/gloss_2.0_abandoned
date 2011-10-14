Ext.define("Gloss.model.Navigation", {
    extend: "Ext.data.Model",
	idProperty: "id",
    fields: [
        {name: "id", type: "string"},
		{name: "title", type: "string"},
		{name: "target",type:"string"},
		{name: "description", type: "string"},
		{name: "type", type: "string"},
		{name: "text", type: "string"},
		{name: "cls", type:"string"},
		{name: "iconCls",type:"string"},
		{name: "leaf",type:"boolean"}
	]
});