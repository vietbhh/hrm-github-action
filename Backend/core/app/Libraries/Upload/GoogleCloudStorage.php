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
        $projectId = empty($_ENV['gcs_project_id']) ? 'friday-351410' : $_ENV['gcs_project_id'];
        $storage = new StorageClient([
            'projectId' => $projectId,
            'keyFilePath' => FCPATH . '..' . DIRECTORY_SEPARATOR . 'service_account_file.json'
        ]);
 
        return $storage;
    }
}
