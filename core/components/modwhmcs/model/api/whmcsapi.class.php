<?php

namespace modWHMCS\Model\API;

use GuzzleHttp\ClientInterface;
use Psr\Http\Message\ResponseInterface;

class WHMCSClient {

    /**
     * @var ClientInterface
     */
    private $client;

    /**
     * Constructor
     *
     * @param ClientInterface $client
     */
    public function __construct(ClientInterface $client) {
        $this->client = $client;
    }




}