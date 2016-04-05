modWHMCS.panel.Home = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('modwhmcs')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,activeTab: 0
            ,hideMode: 'offsets'
            ,items: [{
                title: _('modwhmcs.items')
                ,items: [{
                    html: '<p>'+_('modwhmcs.intro_msg')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'modwhmcs-grid-items'
                    ,preventRender: true
                    ,cls: 'main-wrapper'
                }]
            }]
        }]
    });
    modWHMCS.panel.Home.superclass.constructor.call(this,config);
};
Ext.extend(modWHMCS.panel.Home,MODx.Panel);
Ext.reg('modwhmcs-panel-home',modWHMCS.panel.Home);
