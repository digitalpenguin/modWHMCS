modWHMCS.grid.Tickets = function(config) {
    config = config || {};
    if (!config.id) {
        config.id = 'modwhmcs-grid-tickets';
    }
    Ext.applyIf(config, {
        url: modWHMCS.config.connectorUrl,
        fields: this.getFields(config),
        columns: this.getColumns(config),
        tbar: this.getTopBar(config),
        sm: new Ext.grid.CheckboxSelectionModel(),
        baseParams: {
            action: 'mgr/ticket/getlist'
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
        ,save_action: 'mgr/ticket/updatefromgrid'
        ,autosave: true
        ,autoHeight: true
        ,listeners: {
            render: function() {
                this.el.mask('<h2 id="loading-tickets-notice">Loading tickets from WHMCS...</h2><img id="loading-tickets-animation" alt="loading tickets" src=\''+MODx.config["modwhmcs.assets_url"]+'img/loading.gif\'>');
            }
        }
    });
    modWHMCS.grid.Tickets.superclass.constructor.call(this,config);
    // Clear selection on grid refresh
    this.store.on('load', function () {
        if (this._getSelectedIds().length) {
            this.getSelectionModel().clearSelections();
        }
        this.el.unmask();
    }, this);
};
Ext.extend(modWHMCS.grid.Tickets,MODx.grid.Grid,{
    windows: {}
    ,search: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }, clearFilter: function () {
        this.getStore().baseParams = {
            action: 'mgr/ticket/getList'
        };
        Ext.getCmp('ticket-search-filter').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },getMenu: function() {
        var m = [];
        m.push({
            text: 'Update Ticket'
            ,handler: this.updateTicket
        });
        m.push('-');
        m.push({
            text: 'Remove Ticket'
            ,handler: this.removeTicket
        });
        //this.addContextMenuTicket(m);
    },getTopBar: function (config) {
        return [{
            text: '<i class="icon icon-plus"></i>&nbsp;' + _('modwhmcs.ticket_create'),
            handler: this.createTicket,
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
    },createTicket: function(btn,e) {
        this.createUpdateTicket(btn, e, false);
    },updateTicket: function(btn,e) {
        this.createUpdateTicket(btn, e, true);
    },createUpdateTicket: function(btn, e, isUpdate) {
        var r;
        if(isUpdate){
            if (!this.menu.record || !this.menu.record.id) return false;
            r = this.menu.record;
        }else{
            r = {};
        }
        this.windows.createUpdateTicket = MODx.load({
            xtype: 'modwhmcs-window-ticket-create-update'
            ,isUpdate: isUpdate
            ,title: (isUpdate) ?  'Update Ticket' : 'Create Ticket'
            ,record: r
            ,listeners: {
                'success': {fn:function() { this.refresh(); },scope:this}
            }
        });
        this.windows.createUpdateTicket.fp.getForm().reset();
        this.windows.createUpdateTicket.fp.getForm().setValues(r);
        this.windows.createUpdateTicket.show(e.target);
    },removeTicket: function(btn,e) {
        if (!this.menu.record) return false;

        MODx.msg.confirm({
            title: 'Remove Ticket'
            ,text: 'Are you sure you want to remove this Ticket?'
            ,url: this.config.url
            ,params: {
                action: 'mgr/ticket/remove'
                ,id: this.menu.record.id
            }
            ,listeners: {
                'success': {fn:function(r) { this.refresh(); },scope:this}
            }
        });
    },
    getFields: function (config) {
        return ['id', 'email', 'name', 'subject', 'date', 'lastreply', 'status'];
    },

    getColumns: function (config) {
        return [{
            header: _('modwhmcs.ticket_id'),
            dataIndex: 'id',
            sortable: true,
            width: 70
        },{
            header: _('modwhmcs.ticket_email'),
            dataIndex: 'email',
            sortable: true,
            width: 200
        },{
            header: _('modwhmcs.ticket_subject'),
            dataIndex: 'subject',
            sortable: true,
            width: 250
        },{
            header: _('modwhmcs.ticket_creation_date'),
            dataIndex: 'date',
            sortable: true,
            width: 250
        },{
            header: _('modwhmcs.ticket_last_reply'),
            dataIndex: 'lastreply',
            sortable: true,
            width: 250
        },{
            header: _('modwhmcs.ticket_status'),
            dataIndex: 'status',
            sortable: true,
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
Ext.reg('modwhmcs-grid-tickets',modWHMCS.grid.Tickets);

modWHMCS.window.CreateUpdateTicket = function(config) {
    config = config || {};
    //this.contactId = Ext.getCmp('modwhmcs-panel-contact').getForm().getValues().id;
    this.ident = config.ident || 'ticket-window'+Ext.id();
    Ext.applyIf(config, {
        id: this.ident
        ,url: modWHMCS.config.connectorUrl
        ,baseParams: {
            action: (config.isUpdate)? 'mgr/ticket/update':'mgr/ticket/create'
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
        }]
    });
    modWHMCS.window.CreateUpdateTicket.superclass.constructor.call(this,config);
};
Ext.extend(modWHMCS.window.CreateUpdateTicket,MODx.Window);
Ext.reg('modwhmcs-window-ticket-create-update',modWHMCS.window.CreateUpdateTicket);