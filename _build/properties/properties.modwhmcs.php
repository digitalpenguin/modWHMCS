<?php
/**
 * Properties for the modWHMCS snippet.
 *
 * @package modwhmcs
 * @subpackage build
 */
$properties = array(
    array(
        'name' => 'tpl',
        'desc' => 'prop_modwhmcs.tpl_desc',
        'type' => 'textfield',
        'options' => '',
        'value' => 'Item',
        'lexicon' => 'modwhmcs:properties',
    ),
    array(
        'name' => 'sortBy',
        'desc' => 'prop_modwhmcs.sortby_desc',
        'type' => 'textfield',
        'options' => '',
        'value' => 'name',
        'lexicon' => 'modwhmcs:properties',
    ),
    array(
        'name' => 'sortDir',
        'desc' => 'prop_modwhmcs.sortdir_desc',
        'type' => 'textfield',
        'options' => '',
        'value' => 'ASC',
        'lexicon' => 'modwhmcs:properties',
    ),
    array(
        'name' => 'limit',
        'desc' => 'prop_modwhmcs.limit_desc',
        'type' => 'textfield',
        'options' => '',
        'value' => 5,
        'lexicon' => 'modwhmcs:properties',
    ),
    array(
        'name' => 'outputSeparator',
        'desc' => 'prop_modwhmcs.outputseparator_desc',
        'type' => 'textfield',
        'options' => '',
        'value' => '',
        'lexicon' => 'modwhmcs:properties',
    ),
    array(
        'name' => 'toPlaceholder',
        'desc' => 'prop_modwhmcs.toplaceholder_desc',
        'type' => 'textfield',
        'options' => '',
        'value' => true,
        'lexicon' => 'modwhmcs:properties',
    ),
/*
    array(
        'name' => '',
        'desc' => 'prop_modwhmcs.',
        'type' => 'textfield',
        'options' => '',
        'value' => '',
        'lexicon' => 'modwhmcs:properties',
    ),
    */
);

return $properties;