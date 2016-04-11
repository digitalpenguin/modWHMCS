<?php
//namespace modWHMCS\Model\Domains;
/**
 * Domain Helper class for modWHMCS
 *
 * @package modwhmcs
 */
class DomainHelper {
    public $modx;
    private $domain;

    function __construct(modX &$modx,array $config = array()) {
        $this->modx = $modx;
    }

    function validateInput($domainName, $domainExtension) {

        $validatedDomainName = $this->modx->sanitizeString($domainName);
        $validatedDomainExtension = $this->modx->sanitizeString($domainExtension);

        if (stripos($domainName, '.') !== FALSE) {
            return false;
        } else {
            $this->domain = $validatedDomainName . $validatedDomainExtension;
            return true;
        }
    }

    public function getDomainInfo($domainName, $domainExtension) {

        if (!$this->validateInput($domainName, $domainExtension)) {
            return 'error';
        }

        // The fully qualified URL to your WHMCS installation root directory
        $whmcsUrl = $this->modx->getOption('modwhmcs.whmcs_url');

        // Admin username and password

        $username = $this->modx->getOption('modwhmcs.username'); # Admin username goes here
        $password = $this->modx->getOption('modwhmcs.password'); # Admin password goes here

        // Set post values
        $postfields = array(
            'username' => $username,
            'password' => md5($password),
            'action' => 'domainwhois',
            'domain' => $this->domain,
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

        $result='';
        if ($jsonData['result'] == 'success') {
            $result = '<p>The domain name is: '.$jsonData['status'].'</p>';
            $result .= '<p>'.$jsonData['whois'].'</p>';
        } else {
            $result = 'There was an error looking up the specified domain name.';
        }

        return $result;
    }
}