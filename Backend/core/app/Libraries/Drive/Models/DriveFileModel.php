<?php

namespace App\Libraries\Drive\Models;

use App\Models\AppModel;
use App\Libraries\Drive\Models\DriveFolderModel;

class DriveFileModel extends AppModel
{
    protected $table = 'drive_files';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $allowedFields = [
        'name',
        'file_size',
        'file_type',
        'is_favorite',
        'share_type',
        'drive_folder',
        'permission',
        'metas',
        'view_permissions',
        'update_permissions'
    ];

    protected $afterInsert = ['logInsertFile'];
    protected $afterUpdate = ['logUpdateFile'];

    private $currentTime;
    private $currentUser;
    private $modelDriveInteractLog;
    private $driveFolderModel;


    public function __construct()
    {
        parent::__construct();
        $this->currentTime = date('Y-m-d H:i:s');
        $this->currentUser = user_id();

        $this->modelDriveInteractLog = new AppModel();
        $this->modelDriveInteractLog->setTable('drive_interact_logs');

        $this->driveFolderModel = new DriveFolderModel();
    }

    public function insertLogFile($data)
    {
        if (!$data) {
            return false;
        }

        try {
            $data['type'] = 'file';

            if (!isset($data['owner'])) {
                $data['owner'] = $this->currentUser;
            }

            if (!isset($data['created_at'])) {
                $data['created_at'] = $this->currentTime;
            }

            $this->modelDriveInteractLog->setAllowedFields(array_keys($data));
            $this->modelDriveInteractLog->insert($data);
        } catch (\Exception $err) {
            return false;
        }

        return true;
    }

    protected function logInsertFile(array $data)
    {
        if (!$data['result']) {
            return false;
        }

        $dataInsert  = [
            'type' => 'file',
            'module_id' => $data['id'],
            'data' => json_encode($data['data']),
            'action' => 'insert',
            'description' => 'user ' . $this->currentUser . ' insert file at ' . $this->currentTime,
            'created_at' => $this->currentTime,
            'updated_at' => $this->currentTime,
            'owner' => user_id(),
            'created_by' => user_id()
        ];

        $this->modelDriveInteractLog->setAllowedFields(array_keys($dataInsert));
        $this->modelDriveInteractLog->insert($dataInsert);

        $this->updateFolderTotalSizeAndFileNumber($data);
    }

    protected function logUpdateFile(array $data)
    {
        if (!$data['result']) {
            return false;
        }

        $dataInsert  = [
            'type' => 'file',
            'module_id' => $data['id'],
            'data' => json_encode($data['data']),
            'action' => 'update',
            'description' => $this->currentUser . 'update file at ' . $this->currentTime,
            'created_at' => $this->currentTime,
            'updated_at' => $this->currentTime,
            'owner' => user_id(),
            'created_by' => user_id()
        ];

        $this->modelDriveInteractLog->setAllowedFields(array_keys($dataInsert));
        $this->modelDriveInteractLog->insert($dataInsert);
    }

    private function updateFolderTotalSizeAndFileNumber(array $data)
    {
        if (!$data['result']) {
            return false;
        }
        
        $dataFile = $data['data'];
        $folderId = $dataFile['drive_folder'];

        if (!empty($folderId)) {
            $infoDriveFolder = $this->driveFolderModel->asArray()->find($folderId);
            $metas = json_decode($infoDriveFolder['metas'], true);

            $totalSize = isset($metas['total_size']) ? $metas['total_size'] : 0;
            $fileNumber = isset($metas['file_number']) ? $metas['file_number'] : 0;

            $metas['total_size'] = $totalSize + $dataFile['file_size'];
            $metas['file_number'] = $fileNumber + 1;

            $updateData = [
                'id' => $folderId,
                'metas' => json_encode($metas)
            ];

            $this->driveFolderModel->setAllowedFields(array_keys($updateData));
            $this->driveFolderModel->save($updateData);
        }
    }
}
