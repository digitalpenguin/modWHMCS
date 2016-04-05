modWHMCS.grid.Items = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        id: 'modwhmcs-grid-items'
        ,url: modWHMCS.config.connectorUrl
        ,baseParams: {
            action: 'mgr/item/getlist'
        }
        ,fields: ['id','name','description']
        ,paging: true
        ,remoteSort: true
        ,save_action: 'mgr/item/updatefromgrid'
        ,autosave: true
        ,autoHeight: true
        //,ddGroup: 'modwhmcsItemDDGroup'
        //,enableDragDrop: true
        ,columns: [{
            header: _('id')
            ,dataIndex: 'id'
            ,width: 70
        },{
            header: _('name')
            ,dataIndex: 'name'
            ,width: 200
            ,editor: { xtype: 'textfield' }
        },{
            header: _('description')
            ,dataIndex: 'description'
            ,width: 250
            ,editor: { xtype: 'textfield' }
        }]
        ,tbar: [{
            text: _('modwhmcs.item_create')
            ,handler: this.createItem
            ,scope: this
        },'->',{
            xtype: 'textfield'
            ,id: 'modwhmcs-search-filter'
            ,emptyText: _('modwhmcs.search...')
            ,listeners: {
                'change': {fn:this.search,scope:this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: function() {
                            this.fireEvent('change',this);
                            this.blur();
                            return true;
                        }
                        ,scope: cmp
                    });
                },scope:this}
            }
        }]
    });
    modWHMCS.grid.Items.superclass.constructor.call(this,config);
};
Ext.extend(modWHMCS.grid.Items,MODx.grid.Grid,{
    windows: {}
    ,search: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }, clearFilter: function () {
        this.getStore().baseParams = {
            action: 'mgr/item/getList'
        };
        Ext.getCmp('item-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },getMenu: function() {
        var m = [];
        m.push({
            text: 'Update Item'
            ,handler: this.updateItem
        });
        m.push('-');
        m.push({
            text: 'Remove Item'
            ,handler: this.removeItem
        });
        this.addContextMenuItem(m);
    },createItem: function(btn,e) {
        this.createUpdateItem(btn, e, false);
    },updateItem: function(btn,e) {
        this.createUpdateItem(btn, e, true);
    },createUpdateItem: function(btn, e, isUpdate) {
        var r;
        if(isUpdate){
            if (!this.menu.record || !this.menu.record.id) return false;
            r = this.menu.record;
        }else{
            r = {};
        }
        this.windows.createUpdateItem = MODx.load({
            xtype: 'modwhmcs-window-item-create-update'
            ,isUpdate: isUpdate
            ,title: (isUpdate) ?  'Update Item' : 'Create Item'
            ,record: r
            ,listeners: {
                'success': {fn:function() { this.refresh(); },scope:this}
            }
        });
        this.windows.createUpdateItem.fp.getForm().reset();
        this.windows.createUpdateItem.fp.getForm().setValues(r);
        this.windows.createUpdateItem.show(e.target);
    },removeItem: function(btn,e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: 'Remove Item'
            ,text: 'Are you sure you want to remove this Item?'
            ,url: this.config.url
            ,params: {
                action: 'mgr/item/remove'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success': {fn:function(r) { this.refresh(); },scope:this}
            }
        });
    }
});
Ext.reg('modwhmcs-grid-items',modWHMCS.grid.Items);

modWHMCS.window.CreateUpdateItem = function(config) {
    config = config || {};
    //this.contactId = Ext.getCmp('modwhmcs-panel-contact').getForm().getValues().id;
    this.ident = config.ident || 'item-window'+Ext.id();
    Ext.applyIf(config, {
        id: this.ident
        ,url: modWHMCS.config.connectorUrl
        ,baseParams: {
            action: (config.isUpdate)? 'mgr/item/update':'mgr/item/create'
            //,contactId: this.contactId
        }
        ,closeAction: 'close'
        ,fields: [{
            xtype: 'textfield'
            ,name: 'id'
            ,id: this.ident+'-id'
            ,hidden: true
        },{
            xtype: 'textfield'
            ,fieldLabel: _('name')
            ,name: 'name'
            ,id: this.ident+'-name'
            ,anchor: '100%'
        },{
            xtype: 'textarea'
            ,fieldLabel: _('description')
            ,name: 'description'
            ,id: this.ident+'-description'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,name: 'position'
            ,id: this.ident+'-position'
            ,hidden: true
        }]
    });
    modWHMCS.window.CreateUpdateItem.superclass.constructor.call(this,config);
};
Ext.extend(modWHMCS.window.CreateUpdateItem,MODx.Window);
Ext.reg('modwhmcs-window-item-create-update',modWHMCS.window.CreateUpdateItem);