Ext.define("Gloss.store.CFLib", {
    extend: "Ext.data.TreeStore",
    autoLoad: true,
    model:  "Gloss.model.CFLib",
    root:   {
        expanded:    true,
        id:         "root"
    },
    proxy:  {
        type:   "ajax",
        url: "nav_handler.cfm?type=cflib"
    }
});