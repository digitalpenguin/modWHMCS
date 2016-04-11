<?php
/**
 * Remove an Item.
 * 
 * @package modwhmcs
 * @subpackage processors
 */
class modWHMCSRemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'modWHMCSItem';
    public $languageTopics = array('modwhmcs:default');
    public $objectType = 'modwhmcs.items';
}
return 'modWHMCSRemoveProcessor';