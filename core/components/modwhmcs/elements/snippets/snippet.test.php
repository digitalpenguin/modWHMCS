<?php
$whmcsUrl = $modx->getOption('modwhmcs.whmcs_url');

$username = $modx->getOption('modwhmcs.username');
$password = $modx->getOption('modwhmcs.password');

// Set post values
$postfields = array(
    'username' => $username,
    'password' => md5($password),
    'action' => 'gettickets',
    'responsetype' => 'json',
);

// Call the API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $whmcsUrl . 'includes/api.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postfields));
$response = curl_exec($ch);
if (curl_error($ch)) {
    die('Unable to connect: ' . curl_errno($ch) . ' - ' . curl_error($ch));
}
curl_close($ch);
// Attempt to decode response as json

$jsonData = json_decode($response, true);

$count = $jsonData['numreturned'];

$tickets = $jsonData['tickets']['ticket'];

return '{"success":true,"total":"'.$count.'", "results":'.$modx->toJSON($tickets).'}';

//convert to JSON for grid consumption
//return $modx->outputArray($tickets,$count);
// Dump array structure for inspection
//echo '<pre>' . var_export($jsonData, true) . '</pre>';