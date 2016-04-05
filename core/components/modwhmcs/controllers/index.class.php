<?php
require_once dirname(dirname(__FILE__)) . '/model/modwhmcs/modwhmcs.class.php';
/**
 * @package modwhmcs
 */
class modWHMCSIndexManagerController extends modExtraManagerController {
    /** @var modWHMCS $modwhmcs */
    public $modwhmcs;
    public function initialize() {
        $this->modwhmcs = new modWHMCS($this->modx);
        
        $this->addCss($this->modwhmcs->config['cssUrl'].'mgr.css');
        $this->addJavascript($this->modwhmcs->config['jsUrl'].'mgr/modwhmcs.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            modWHMCS.config = '.$this->modx->toJSON($this->modwhmcs->config).';
            modWHMCS.config.connector_url = "'.$this->modwhmcs->config['connectorUrl'].'";
        });
        </script>');
        return parent::initialize();
    }
    public function getLanguageTopics() {
        return array('modwhmcs:default');
    }
    public function checkPermissions() { return true;}
    public function process(array $scriptProperties = array()) {

    }
    public function getPageTitle() { return $this->modx->lexicon('modwhmcs'); }
    public function loadCustomCssJs() {
        $this->addJavascript($this->modwhmcs->config['jsUrl'].'mgr/extra/griddraganddrop.js');
        $this->addJavascript($this->modwhmcs->config['jsUrl'].'mgr/widgets/items.grid.js');
        $this->addJavascript($this->modwhmcs->config['jsUrl'].'mgr/widgets/home.panel.js');
        $this->addLastJavascript($this->modwhmcs->config['jsUrl'].'mgr/sections/index.js');
    }
    public function getTemplateFile() { return $this->modwhmcs->config['templatesPath'].'home.tpl'; }
}

