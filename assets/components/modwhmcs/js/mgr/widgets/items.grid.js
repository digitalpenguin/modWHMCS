modWHMCS.grid.Items = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'modwhmcs-grid-items';
    }
    Ext.applyIf(config, {
        url: modWHMCS.config.connectorUrl,
        fields: this.getFields(config),
        columns: this.getColumns(config),
        tbar: this.getTopBar(config),
        //sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/item/getlist'
        }
        ,viewConfig: {
            forceFit: true
            ,enableRowBody: true
            ,autoFill: true
            ,showPreview: true
            ,scrollOffset: 0
            ,getRowClass: function (rec, ri, p) {
                return !rec.data.active
                    ? 'modwhmcs-grid-row-disabled'
                    : '';
            }
        },
        paging: true
        ,remoteSort: true
        ,save_action: 'mgr/item/updatefromgrid'
        ,autosave: true
        ,autoHeight: true
        ,ddGroup: 'modwhmcsItemDDGroup'
        ,enableDragDrop: true
    });
    modWHMCS.grid.Items.superclass.constructor.call(this,config);
    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
    }, this);
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
    },getTopBar: function (config) {
        return [{
            text: '<i class="icon icon-plus"></i>&nbsp;' + _('modwhmcs.item_create'),
            handler: this.createItem,
            scope: this
        }, '->', {
            xtype: 'textfield',
            name: 'query',
            width: 200,
            id: config.id + '-search-field',
            emptyText: _('modwhmcs.grid_search'),
            listeners: {
                render: {
                    fn: function (tf) {
                        tf.getEl().addKeyListener(Ext.EventObject.ENTER, function () {
                            this._doSearch(tf);
                        }, this);
                    }, scope: this
                }
            }
        }, {
            xtype: 'button',
            id: config.id + '-search-clear',
            text: '<i class="icon icon-times"></i>',
            listeners: {
                click: {fn: this._clearSearch, scope: this}
            }
        }];
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
    },
    getFields: function (config) {
        return ['id', 'name', 'description'];
    },

    getColumns: function (config) {
        return [{
            header: _('modwhmcs.item_id'),
            dataIndex: 'id',
            sortable: true,
            width: 70
        }, {
            header: _('modwhmcs.item_name'),
            dataIndex: 'name',
            sortable: true,
            width: 200
        }, {
            header: _('modwhmcs.item_description'),
            dataIndex: 'description',
            sortable: false,
            width: 250
        }];
    },

    _getSelectedIds: function () {
        var ids = [];
        var selected = this.getSelectionModel().getSelections();

        for (var i in selected) {
            if (!selected.hasOwnProperty(i)) {
                continue;
            }
            ids.push(selected[i]['id']);
        }
        return ids;
    },

    _doSearch: function (tf, nv, ov) {
        this.getStore().baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },

    _clearSearch: function (btn, e) {
        this.getStore().baseParams.query = '';
        Ext.getCmp(this.config.id + '-search-field').setValue('');
        this.getBottomToolbar().changePage(1);
        this.refresh();
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