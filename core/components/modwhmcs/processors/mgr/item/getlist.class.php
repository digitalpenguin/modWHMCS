<?php
/**
 * Get list Items
 *
 * @package modwhmcs
 * @subpackage processors
 */
class modWHMCSGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'modWHMCSItem';
    public $languageTopics = array('modwhmcs:default');
    public $defaultSortField = 'position';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'modwhmcs.modwhmcs_items';

    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $query = $this->getProperty('query');
        if (!empty($query)) {
            $c->where(array(
                    'name:LIKE' => '%'.$query.'%',
                    'OR:description:LIKE' => '%'.$query.'%',
                ));
        }
        return $c;
    }
}
return 'modWHMCSGetListProcessor';