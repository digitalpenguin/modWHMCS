Ext.onReady(function() {
    MODx.load({ xtype: 'modwhmcs-page-home'});
});

modWHMCS.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'modwhmcs-panel-home'
            ,renderTo: 'modwhmcs-panel-home-div'
        }]
    });
    modWHMCS.page.Home.superclass.constructor.call(this,config);
};
Ext.extend(modWHMCS.page.Home,MODx.Component);
Ext.reg('modwhmcs-page-home',modWHMCS.page.Home);