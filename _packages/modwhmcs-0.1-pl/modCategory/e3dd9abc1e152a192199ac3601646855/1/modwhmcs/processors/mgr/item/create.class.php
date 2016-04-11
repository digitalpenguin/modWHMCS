<?php
/**
 * Create an Item
 * 
 * @package modwhmcs
 * @subpackage processors
 */
class modWHMCSCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'modWHMCSItem';
    public $languageTopics = array('modwhmcs:default');
    public $objectType = 'modwhmcs.items';

    public function beforeSet(){
        $items = $this->modx->getCollection($this->classKey);

        $this->setProperty('position', count($items));

        return parent::beforeSet();
    }

    public function beforeSave() {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('modwhmcs.item_err_ns_name'));
        } else if ($this->doesAlreadyExist(array('name' => $name))) {
            $this->addFieldError('name',$this->modx->lexicon('modwhmcs.item_err_ae'));
        }
        return parent::beforeSave();
    }
}
return 'modWHMCSCreateProcessor';
