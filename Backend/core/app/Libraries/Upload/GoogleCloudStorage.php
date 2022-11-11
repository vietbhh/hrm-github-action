<?php

namespace App\Libraries\Upload;

use Google\Cloud\Storage\StorageClient;

class GoogleCloudStorage
{
    public function __construct()
    {
    }

    public function storage()
    {
        $projectId = 'friday-351410';
        $storage = new StorageClient([
            'projectId' => $projectId,
            'keyFilePath' => FCPATH . '..' . DIRECTORY_SEPARATOR . 'service_account_file.json'
        ]);
 
        return $storage;
    }
}
