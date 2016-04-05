<?php
$modwhmcs = $modx->getService('modwhmcs','modWHMCS',$modx->getOption('modwhmcs.core_path',null,$modx->getOption('core_path').'components/modwhmcs/').'model/modwhmcs/',$scriptProperties);
if (!($modwhmcs instanceof modWHMCS)) return '';


$m = $modx->getManager();
$m->createObjectContainer('modWHMCSItem');
return 'Table created.';