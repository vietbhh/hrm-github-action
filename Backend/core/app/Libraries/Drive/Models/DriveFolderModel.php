<?php

namespace App\Libraries\Drive\Models;

use App\Models\AppModel;

class DriveFolderModel extends AppModel
{
    protected $table = 'drive_folders';
    protected $primaryKey = 'id';
    protected $returnType = 'array';
    protected $useSoftDeletes = true;
    protected $allowedFields = [
        'name',
        'description',
        'is_favorited',
        'share_type',
        'parent',
        'metas',
        'permission',
        'view_permissions',
        'update_permissions'
    ];

    protected $afterInsert = ['logInsertFolder'];
    protected $afterUpdate = ['logUpdateFolder'];

    private $currentTime;
    private $currentUser;
    private $modelDriveInteractLog;

    public function __construct()
    {
        parent::__construct();
        $this->currentTime = date('Y-m-d H:i:s');
        $this->currentUser = user_id();

        $this->modelDriveInteractLog = new AppModel();
        $this->modelDriveInteractLog->setTable('drive_interact_logs');
    }

    public function insertLogFolder($data)
    {
        if (!$data) {
            return false;
        }

        try {
            $data['type'] = 'folder';

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

    public function logUpdateFolderPath($id, $path)
    {
        $dataInsert = [
            'type' => 'folder',
            'module_id' => $id,
            'data' => json_encode([
                'id' => $id,
                'folder_path' => $path
            ]),
            'action' => 'update',
            'description' => 'user ' . $this->currentUser . ' update folder at ' . $this->currentTime,
            'created_at' => $this->currentTime,
            'updated_at' => $this->currentTime,
            'owner' => user_id(),
            'created_by' => user_id()
        ];

        try {
            $this->modelDriveInteractLog->setAllowedFields(array_keys($dataInsert));
            $this->modelDriveInteractLog->insert($dataInsert);
        } catch (\Exception $err) {
            return false;
        }

        return true;
    }

    protected function logInsertFolder(array $data)
    {
        if (!$data['result']) {
            return false;
        };

        $dataInsert  = [
            'type' => 'folder',
            'module_id' => $data['id'],
            'data' => json_encode($data['data']),
            'action' => 'insert',
            'description' => 'user ' . $this->currentUser . ' insert folder at ' . $this->currentTime,
            'created_at' => $this->currentTime,
            'updated_at' => $this->currentTime,
            'owner' => user_id(),
            'created_by' => user_id()
        ];

        $this->modelDriveInteractLog->setAllowedFields(array_keys($dataInsert));
        $this->modelDriveInteractLog->insert($dataInsert);
    }

    protected function logUpdateFolder(array $data)
    {
        if (!$data['result']) {
            return false;
        }

        $dataInsert  = [
            'type' => 'folder',
            'module_id' => $data['id'],
            'data' => json_encode($data['data']),
            'action' => isset($data['data']['metas']) ? 'system_update' : 'update',
            'description' => 'user ' . $this->currentUser . ' update folder at ' . $this->currentTime,
            'created_at' => $this->currentTime,
            'updated_at' => $this->currentTime,
            'owner' => user_id(),
            'created_by' => user_id()
        ];

        $this->modelDriveInteractLog->setAllowedFields(array_keys($dataInsert));
        $this->modelDriveInteractLog->insert($dataInsert);
    }
}
