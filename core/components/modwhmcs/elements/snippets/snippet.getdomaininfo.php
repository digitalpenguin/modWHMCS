<?php
//include_once '/var/www/modx-extras/modwhmcs/core/components/modwhmcs/autoload.php';

$domainHelper = $modx->getService('domainhelper','DomainHelper',$modx->getOption('modwhmcs.core_path',null,$modx->getOption('core_path').'components/modwhmcs/').'model/domains/');
if (!($domainHelper instanceof DomainHelper)) return '';

$domainName = $_POST['domain'];
$domainExtension = $_POST['ext'];

return $domainHelper->getDomainInfo($domainName, $domainExtension);