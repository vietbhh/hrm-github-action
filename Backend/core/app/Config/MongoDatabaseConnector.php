<?php 

namespace App\Config;
use MongoDB\Client as MongoDBClient;
use MongoDB\Driver\ServerApi;

class MongoDatabaseConnector
{
    private $client;
    private $database;

    public function __construct()
    {
        $uri = getenv('MONGODB_URI');
        $database = 'core';

        if (empty($uri)) {
            throw new \Exception('MONGODB_URI is empty!');
        }

        try {
            $this->client = new \MongoDB\Client($uri);
        } catch(\Exception $ex) {
            throw new \Exception('Couldn\'t connect to database: ' . $ex->getMessage());
        }

        try {
            $this->database = $this->client->selectDatabase($database);
        } catch(\Exception $ex) {
            throw new \Exception('Error while fetching database with name: ' . $database . $ex->getMessage());
        }
    }

    public function getDatabase() {
        return $this->database;
    }
}