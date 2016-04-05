<?php
class GetTicketsProcessor extends modProcessor {


    public function process() {

        $whmcsUrl = $this->modx->getOption('modwhmcs.modwhmcs_url');

        $username = $this->modx->getOption('modwhmcs.username');
        $password = $this->modx->getOption('modwhmcs.password');

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

        // Dump array structure for inspection
        //var_dump($jsonData);
        //die();


        //convert to JSON for grid consumption
        //return $this->outputArray($jsonData);
        return $jsonData;
    }
}
return 'GetTicketsProcessor';