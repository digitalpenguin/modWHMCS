<?php
/**
 * Add snippets to build
 * 
 * @package modwhmcs
 * @subpackage build
 */
$snippets = array();

$snippets[0]= $modx->newObject('modSnippet');
$snippets[0]->fromArray(array(
    'id' => 0,
    'name' => 'modWHMCS',
    'description' => 'Displays Items.',
    'snippet' => getSnippetContent($sources['source_core'].'/elements/snippets/snippet.modwhmcs.php'),
),'',true,true);
$properties = include $sources['build'].'properties/properties.modwhmcs.php';
$snippets[0]->setProperties($properties);
unset($properties);

return $snippets;