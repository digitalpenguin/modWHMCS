<?php
/**
 * Resolve creating db tables
 *
 * @package modwhmcs
 * @subpackage build
 */
if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
            $modx =& $object->xpdo;
            $modelPath = $modx->getOption('modwhmcs.core_path',null,$modx->getOption('core_path').'components/modwhmcs/').'model/';
            $modx->addPackage('modwhmcs',$modelPath);

            $manager = $modx->getManager();

            $manager->createObjectContainer('modWHMCSItem');

            break;
        case xPDOTransport::ACTION_UPGRADE:
            break;
    }
}
return true;