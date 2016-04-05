var modWHMCS = function(config) {
    config = config || {};
    modWHMCS.superclass.constructor.call(this,config);
};
Ext.extend(modWHMCS,Ext.Component,{
    page:{},window:{},grid:{},tree:{},panel:{},combo:{},config: {}
});
Ext.reg('modwhmcs',modWHMCS);
modWHMCS = new modWHMCS();
