<?php

namespace App\Controllers;

class Drive extends ErpController
{

    public function __construct()
    {
    }

    public function get_my_folder_get()
    {
        $modules = \Config\Services::modules('drive_folders');
        $model = $modules->model;

        $currentUserId = user_id();

        $listMyFolder = $model->asArray()
            ->where('owner', $currentUserId)
            ->where('parent', 0)
            ->where('deleted_at', null)
            ->findAll();

        return $this->respond([
            'list_folder' => handleDataBeforeReturn($modules, $listMyFolder, true)
        ]);
    }

    public function get_init_drive_get()
    {
        $modules = \Config\Services::modules('drive_folders');
        $model = $modules->model;

        $currentUserId = user_id();

        $listMyFolder = $model->asArray()
            ->where('owner', $currentUserId)
            ->where('deleted_at', null)
            ->findAll();


        $listMyFolderHandle = handleDataBeforeReturn($modules, $listMyFolder, true);
        $listTreeFolder = $this->_buildTree($listMyFolderHandle);

        return $this->respond([
            'list_folder' => $this->_fixKeys($listTreeFolder)
        ]);
    }

    public function create_drive_folder_post()
    {
        $validation = \Config\Services::validation();
        $modules = \Config\Services::modules('drive_folders');

        if (!mayAdd('drive_folders')) {
            return $this->failForbidden(MISSING_LIST_PERMISSION);
        }

        $postData = $this->request->getPost();
        $model = $modules->model;
        $dataHandleFolder = handleDataBeforeSave($modules, $postData);
        if (!empty($dataHandleFolder['validate'])) {
            if (!$validation->reset()->setRules($dataHandleFolder['validate'])->run($dataHandleFolder['data'])) {
                return $this->failValidationErrors($validation->getErrors());
            }
        }

        $model->setAllowedFields($dataHandleFolder['fieldsArray']);
        $dataSave = $this->_handleDriveFolderData($dataHandleFolder['data']);

        try {
            $model->save($dataSave);
        } catch (\ReflectionException $e) {
            return $this->fail(FAILED_SAVE);
        }

        $id = $model->getInsertID();

        //create folder
        $direction = $this->_getFolderDirection($modules, $id);

        //update folder direction
        $dataUpdate = [
            'id' => $id,
            'metas' => json_encode([
                'folder_path' => $direction
            ])
        ];

        $model->setAllowedFields(array_keys($dataUpdate));
        $model->save($dataUpdate);


        if (empty($dataSave['parent'])) {
            $infoNewFolder = $model->asArray()->find($id);

            return $this->respond([
                'data' => handleDataBeforeReturn($modules, $infoNewFolder)
            ]);
        }

        return $this->respondCreated($id);
    }

    public function get_drive_folder_detail()
    {
        $modules = \Config\Services::modules('drive_folders');
        $model = $modules->model;

        $getParams = $this->request->getGet();
        $id = isset($getParams['id']) ? $getParams['id'] : 0;

        $infoFolder = $model->asArray()->find($id);

        if (!$infoFolder) {
            return $this->failNotFound();
        }

        $metas = json_decode($infoFolder['metas'], true);
        $folderPath = $metas['folder_path'];

        // get list file
        $listFile = $this->_getListFile($folderPath);

        // get list sub-folder
        $listSubFolder = $model->asArray()
            ->where('parent', $id)
            ->where('deleted_at', null)
            ->findAll();

        // get parent folder
        $listAllFolder = $model->asArray()
            ->where('deleted_at', null)
            ->findAll();

        $listParentFolder = $this->_getFolderByRank($listAllFolder, $id, 'superior', array());

        return $this->respond([
            'info_folder' => handleDataBeforeReturn($modules, $infoFolder),
            'list_file' => $listFile,
            'list_sub_folder' => $listSubFolder,
            'list_parent_folder' => array_values(array_reverse($listParentFolder))
        ]);
    }

    public function upload_file_drive_post()
    {
        $modules = \Config\Services::modules();

        $postData = $this->request->getPost();
        $fileData = $this->request->getFiles();

        // upload file
        try {
            $resultUpload = $this->_handleUploadFile($modules, $postData['folder_id'], $fileData);

            return $this->respond([
                'file_info' => $resultUpload
            ]);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function get_upload_progress_get()
    {
        $session = session();
        $key = ini_get("session.upload_progress.prefix") . 'upload_drive';
        
        return $this->respond([
            'data' => $session->get($key)
        ]);
    }

    // ** support function
    private function _handleDriveFolderData($data)
    {
        if (!isset($data['parent'])) {
            $data['parent'] = 3;
        }

        $data['share_type'] = 0;

        return $data;
    }

    private function _getFolderDirection($modules, $id)
    {
        $modules->setModule('drive_folders');
        $model = $modules->model;

        $path =  '/' . $_ENV['data_folder_module'] . '/' . 'drive_folders/';

        $listAllFolder = handleDataBeforeReturn($modules, $model->asArray()->findAll(), true);
        $listParentFolder = array_reverse($this->_getFolderByRank($listAllFolder, $id, 'superior', array()));

        foreach ($listParentFolder as $rowParentFolder) {
            $path .= $rowParentFolder['id'] . '/data/';
        }

        $realPath = WRITEPATH . $_ENV['data_folder'] . '/' . $path;
        if (!is_dir($realPath)) {
            mkdir($realPath, 0777, true);
        }

        return $path;
    }

    private function _getFolderByRank($data, $parent = 0,  $type = 'subordinate', $return = array(), $directOnly = false)
    {
        $compareKey = $type == 'superior' ? 'id' : 'parent';
        $parentKey =  $type == 'superior' ? 'parent' : 'id';

        foreach ($data as $key => $item) {
            if (!is_numeric($item[$parentKey])) $item[$parentKey] = 0;
            if ($item['id'] == $parent) $return[$item['id']] = $item;
            if ((int)$item[$compareKey] == (int)$parent) {
                $child = $directOnly ? [] : $this->_getFolderByRank($data, $item[$parentKey], $type, $return);
                if (!empty($child)) {
                    $return = $return + $child;
                }
                $return[$item['id']] = $item;
            }
        }

        return $return;
    }

    private function _buildTree(array &$elements, $parentId = 0)
    {
        $branch = array();

        foreach ($elements as $element) {
            if ($element['parent'] == $parentId) {
                $children = $this->_buildTree($elements, $element['id']);
                if ($children) {
                    $element['children'] = $children;
                }
                $branch[$element['id']] = $element;
            }
        }

        return $branch;
    }

    private function _fixKeys($array)
    {
        foreach ($array as $k => $val) {
            if (is_array($val)) {
                $array[$k] = $this->_fixKeys($val);
            }
        }

        if (isset($array['id'])) {
            return $array;
        } else {
            return array_values($array);
        }
    }

    private function _getListFile($path)
    {
        $storePath = WRITEPATH . $_ENV['data_folder'] . '/' . $path;

        if (!is_dir($storePath)) {
            return [];
        }

        $result = [];
        foreach (scandir($storePath) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }

            if (is_file($storePath . $item)) {
                $result[] = [
                    $path . $item
                ];
            }
        }

        return $result;
    }

    private function _getFolderUploadFile($modules, $folderId)
    {
        $commonFolder = '/' . $_ENV['data_folder_module'] . '/common/data/';

        if ($folderId == 0) {
            return  $commonFolder;
        }

        $modules->setModule('drive_folders');
        $model = $modules->model;

        $infoDriveFolder = $model->asArray()->find($folderId);
        $metas = json_decode($infoDriveFolder['metas'], true);

        return isset($metas['folder_path']) ? $metas['folder_path'] : $commonFolder;
    }

    private function _handleUploadFile($modules, $folderId, $filesUpload)
    {
        $uploadService = \App\Libraries\Upload\Config\Services::upload();


        $storePath = $this->_getFolderUploadFile($modules, $folderId);
        $result = $uploadService->uploadFile($storePath, $filesUpload);

        return $result;
    }
}
