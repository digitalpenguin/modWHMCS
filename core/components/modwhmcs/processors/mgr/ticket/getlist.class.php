<?php
class GetTicketsProcessor extends modProcessor {
    /** @var string $defaultSortField The default field to sort by */
    public $defaultSortField = 'id';
    /** @var string $defaultSortDirection The default direction to sort */
    public $defaultSortDirection = 'ASC';
    /** @var int $currentIndex The current index of successful iteration */
    public $currentIndex = 0;


    public function initialize() {
        $this->setDefaultProperties(array(
            'start' => 0,
            'limit' => 20,
            'sort' => $this->defaultSortField,
            'dir' => $this->defaultSortDirection,
            'combo' => false,
            'query' => '',
        ));
        return parent::initialize();
    }

    public function getAPIData() {
        $whmcsUrl = $this->modx->getOption('modwhmcs.whmcs_url');
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
        $apiData['total'] = $jsonData['numreturned'];
        $apiData['results'] = $jsonData['tickets']['ticket'];
        return $apiData;
    }

    public function process() {
        $data = $this->getData();
        return $this->outputArray($data['results'],$data['total']);
    }

    public function getData() {
        $apiData = $this->getAPIData();
        $data = array();
        $data['results'] = array();
        $data['total'] = $apiData['total'];

        $limit = intval($this->getProperty('limit'));
        $start = intval($this->getProperty('start'));

        $count = 0;
        foreach ($apiData['results'] as $key => $value) {
            if ($key >= $start) {
                if($count < $limit) {
                    array_push($data['results'], $value);
                    $count++;
                }
            }
            if ($key > $limit) break;
        }

        //Sort not working yet
        if (empty($sortKey = $this->getProperty('sort'))) $sortKey = $this->defaultSortField;
        if ($this->defaultSortField == 'ASC') {
            $data['results'] = asort($data['results'][$this->defaultSortField]);
        } else if ($this->defaultSortField == 'DESC') {
            $data['results'] = arsort($data['results'][$this->defaultSortField]);
        }

        return $data;
    }
}
return 'GetTicketsProcessor';