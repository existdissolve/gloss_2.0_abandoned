Ext.define("Gloss.store.Settings", {
    extend: "Ext.data.Store",
    model:  "Gloss.model.Setting",
    autoLoad: true,
    proxy: {
        type: 'localstorage',
        id  : 'gloss-settings'
    }
});