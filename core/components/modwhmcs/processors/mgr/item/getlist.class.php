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


    public function getData() {
        $data = array();
        $limit = intval($this->getProperty('limit'));
        $start = intval($this->getProperty('start'));

        /* query for chunks */
        $c = $this->modx->newQuery($this->classKey);
        $c = $this->prepareQueryBeforeCount($c);
        $data['total'] = $this->modx->getCount($this->classKey,$c);
        $c = $this->prepareQueryAfterCount($c);

        $sortClassKey = $this->getSortClassKey();
        $sortKey = $this->modx->getSelectColumns($sortClassKey,$this->getProperty('sortAlias',$sortClassKey),'',array($this->getProperty('sort')));
        $this->modx->log(modX::LOG_LEVEL_DEBUG, 'Before iteration: '.print_r($sortKey,true) );
        if (empty($sortKey)) $sortKey = $this->getProperty('sort');
        $c->sortby($sortKey,$this->getProperty('dir'));
        if ($limit > 0) {
            $c->limit($limit,$start);
        }

        $data['results'] = $this->modx->getCollection($this->classKey,$c);
        return $data;
    }


    public function process() {
        $beforeQuery = $this->beforeQuery();
        if ($beforeQuery !== true) {
            return $this->failure($beforeQuery);
        }
        $data = $this->getData();
        //$this->modx->log(modX::LOG_LEVEL_DEBUG, 'Before iteration: '.print_r($data['results'],true) );
        $list = $this->iterate($data);
        return $this->outputArray($list,$data['total']);
    }


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