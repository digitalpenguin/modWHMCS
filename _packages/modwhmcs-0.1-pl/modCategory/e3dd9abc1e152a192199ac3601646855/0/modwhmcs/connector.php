<?php
/**
 * modWHMCS Connector
 *
 * @package modwhmcs
 */
require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';
$corePath = $modx->getOption('modwhmcs.core_path',null,$modx->getOption('core_path').'components/modwhmcs/');
require_once $corePath.'model/modwhmcs/modwhmcs.class.php';
$modx->modwhmcs = new modWHMCS($modx);
$modx->lexicon->load('modwhmcs:default');
/* handle request */
$path = $modx->getOption('processorsPath',$modx->modwhmcs->config,$corePath.'processors/');

$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));