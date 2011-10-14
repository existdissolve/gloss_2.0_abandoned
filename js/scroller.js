Ext.onReady(function(){
    Ext.override(Ext.grid.Scroller,{
        initComponent: function() {
            var me       = this,
                dock     = me.dock,
                cls      = Ext.baseCSSPrefix + 'scroller-vertical',
                sizeProp = 'width';
    
            me.offsets = {bottom: 0};
            me.scrollProp = 'scrollTop';
            me.vertical = true;
    
            if (dock === 'top' || dock === 'bottom') {
                cls = Ext.baseCSSPrefix + 'scroller-horizontal';
                sizeProp = 'height';
                me.scrollProp = 'scrollLeft';
                me.vertical = false;
                me.weight += 5;
            }
    
            me[sizeProp] = me.scrollerSize = Ext.isWebKit ? 10 : Ext.getScrollbarSize()[sizeProp];
    
            me.cls += (' ' + cls);
    
            Ext.applyIf(me.renderSelectors, {
                stretchEl: '.' + Ext.baseCSSPrefix + 'stretcher',
                scrollEl: '.' + Ext.baseCSSPrefix + 'scroller-ct'
            });
            me.callParent();
        }
    });
});