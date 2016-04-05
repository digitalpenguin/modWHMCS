<?php
/**
 * Update an Item
 * 
 * @package modwhmcs
 * @subpackage processors
 */

class modWHMCSUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'modWHMCSItem';
    public $languageTopics = array('modwhmcs:default');
    public $objectType = 'modwhmcs.items';

    public function beforeSet() {
        $name = $this->getProperty('name');

        if (empty($name)) {
            $this->addFieldError('name',$this->modx->lexicon('modwhmcs.item_err_ns_name'));

        } else if ($this->modx->getCount($this->classKey, array('name' => $name)) && ($this->object->name != $name)) {
            $this->addFieldError('name',$this->modx->lexicon('modwhmcs.item_err_ae'));
        }
        return parent::beforeSet();
    }

}
return 'modWHMCSUpdateProcessor';