<?php

namespace App\Controllers;

use App\Libraries\Drive\Models\DriveFolderModel;
use App\Libraries\Drive\Models\DriveFileModel;
use App\Models\AppModel;
use stdClass;

class Drive extends ErpController
{

    private $arrReplaceModule = [];
    private $arrReplacePermission = [];
    private $modelDriveFolder;
    private $modelDriveFile;
    private $modelDriveInteractLog;
    private $currentUser;
    private $permissionViewByOffice = '';
    private $permissionEditByOffice = '';
    private $permissionViewByDepartment = '';
    private $permissionEditByDepartment = '';
    private $permissionViewByUser = '';
    private $permissionEditByUser = '';

    public function __construct()
    {
        $this->arrReplaceModule = [
            'users' => 'u',
            'departments' => 'd',
            'offices' => 'o'
        ];

        $this->arrReplacePermission = [
            'view_only' => 'v',
            'editable' => 'e'
        ];

        $this->modelDriveFolder = new DriveFolderModel();
        $this->modelDriveFile = new DriveFileModel();

        $this->modelDriveInteractLog = new AppModel();
        $this->modelDriveInteractLog->setTable('drive_interact_logs');

        $this->currentUser = user();
        $this->permissionViewByOffice = 'o_' . $this->currentUser->office . '_v';
        $this->permissionEditByOffice = 'o_' . $this->currentUser->office . '_e';
        $this->permissionViewByDepartment = 'd_' . $this->currentUser->department_id . '_v';
        $this->permissionEditByDepartment = 'd_' . $this->currentUser->department_id . '_e';
        $this->permissionViewByUser = 'u_' . $this->currentUser->id . '_v';
        $this->permissionEditByUser = 'u_' . $this->currentUser->id . '_e';
    }

    public function get_my_folder_get()
    {
        $modules = \Config\Services::modules('drive_folders');
        $model = $this->modelDriveFolder;

        $currentUserId = user_id();

        $listMyFolder = $model->asArray()
            ->where('owner', $currentUserId)
            ->where('parent', 0)
            ->where('deleted_at', null)
            ->findAll();

        $listFolderHandle = handleDataBeforeReturn($modules, $listMyFolder, true);

        return $this->respond([
            'list_folder' => $this->_getFolderCapacityAndFileNumber(null, $listFolderHandle)
        ]);
    }

    public function get_init_drive_get()
    {
        $listRecentFileAndFolder = $this->_getListRecentFileAndFolder();

        return $this->respond([
            'list_recent_file_and_folder' => $listRecentFileAndFolder
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
        $model = $this->modelDriveFolder;
        $dataHandleFolder = handleDataBeforeSave($modules, $postData);
        if (!empty($dataHandleFolder['validate'])) {
            if (!$validation->reset()->setRules($dataHandleFolder['validate'])->run($dataHandleFolder['data'])) {
                return $this->failValidationErrors($validation->getErrors());
            }
        }

        $dataSave = $this->_handleDriveFolderDataForInsert($dataHandleFolder['data']);
        try {
            $model->save($dataHandleFolder['data']);
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

        $infoDriveFolder = $model->find($id);

        return $this->respond([
            'data' => $this->_handleDriveFolderDataToReturn($infoDriveFolder)
        ]);
    }

    public function get_drive_folder_detail()
    {
        $modules = \Config\Services::modules('drive_folders');
        $model = $this->modelDriveFolder;

        $getParams = $this->request->getGet();
        $id = isset($getParams['id']) ? $getParams['id'] : 0;
        $page = $getParams['page'] == 1 ? 0 : $getParams['page'] - 1;
        $perPage = $getParams['per_page'];
        $sortColumn = $getParams['sort_by'];

        $infoFolder = $model->asArray()->find($id);

        if (!$infoFolder) {
            return $this->failNotFound();
        }

        // get parent folder
        $listAllFolder = $model->asArray()
            ->where('deleted_at', null)
            ->orderBy('updated_at', 'DESC')
            ->findAll();

        $listParentFolder = $this->_getFolderByRank($listAllFolder, $id, 'superior', array());

        return $this->respond([
            'info_folder' => handleDataBeforeReturn($modules, $infoFolder),
            'list_file_and_folder' => $this->_getListFileAndFolderOrder($id, $perPage, $page, $sortColumn),
            'list_parent_folder' => array_values(array_reverse($listParentFolder))
        ]);
    }

    public function upload_file_drive_post()
    {
        $modules = \Config\Services::modules('drive_files');
        $modulesFolder = \Config\Services::modules('drive_folders');

        $postData = $this->request->getPost();
        $fileData = $this->request->getFiles();

        $result = '';

        if ($postData['upload_type'] === 'file') {
            // upload file
            $result = $this->_uploadFileDrive($modulesFolder, $modules, $postData, $fileData);
        } elseif ($postData['upload_type'] === 'folder') {
            // upload folder
            $result = $this->_uploadFolderDrive($modulesFolder, $modules, $postData, $fileData);
        }

        return $this->respond([
            'result' => $result
        ]);
    }

    public function get_upload_progress_get()
    {
        $session = session();
        $key = ini_get("session.upload_progress.prefix") . 'upload_drive';

        return $this->respond([
            'data' => $session->get($key)
        ]);
    }

    public function share_file_and_folder_post()
    {
        $postData = $this->request->getPost();

        $updateData = [
            'id' => $postData['item']['id'],
            'share_type' => $postData['share_type'],
            'permission' => '[]'
        ];

        if ($postData['share_type'] == 3) {
            $permissionData = $this->_handleDataSharePermissionFileAndFolder($postData['data']);
            $updateData['permission'] = json_encode($permissionData);
        }

        try {
            if ($postData['item']['type'] == 'file') {
                $modelFile = $this->modelDriveFile;

                $modelFile->setAllowedFields(array_keys($updateData));
                $modelFile->save($updateData);
            } elseif ($postData['item']['type'] == 'folder') {
                $modelFolder = $this->modelDriveFolder;

                $modelFolder->setAllowedFields(array_keys($updateData));
                $modelFolder->save($updateData);
            }
        } catch (\Exception $err) {
            return $this->respond($err->getMessage());
        }

        return $this->respond(ACTION_SUCCESS);
    }

    public function get_file_and_folder_permission_get()
    {
        $getData = $this->request->getGet();
        $id = $getData['id'];
        $type = $getData['type'];

        if (empty($id)) {
            return $this->respond([
                'data' => new stdClass()
            ]);
        }

        if ($type == 'file') {
            $model = $this->modelDriveFile;
        } elseif ($type == 'folder') {
            $model = $this->modelDriveFolder;
        }

        $info = $model->asArray()->find($id);
        return $this->respond([
            'data' => $info,
            'share_type' => isset($info['share_type']) ? $info['share_type'] : 0,
            'chosen_user' => (isset($info['share_type']) && $info['share_type'] == 3) ? $this->_getShareUser(json_decode($info['permission'], true)) : []
        ]);
    }

    public function update_favorite_post()
    {
        $postData = $this->request->getPost();
        $data = $postData['data'];

        if ($data['type'] == 'file') {
            $model = $this->modelDriveFile;
        } elseif ($data['type'] == 'folder') {
            $model = $this->modelDriveFolder;
        }

        $updateData = [
            'id' => $data['id'],
            'is_favorite' => $data['is_favorite'] == true ? 1 : 0
        ];

        $model->setAllowedFields(array_keys($updateData));

        try {
            $model->save($updateData);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }

        return $this->respond(ACTION_SUCCESS);
    }

    public function remove_drive_content_post()
    {
        $postData = $this->request->getPost();

        if ($postData['type'] == 'file') {
            $model = $this->modelDriveFile;
        } elseif ($postData['type'] == 'folder') {
            $model = $this->modelDriveFolder;
        }

        $model->delete($postData['id']);
    }

    // ** support function
    private function _handleDriveFolderDataToReturn(&$infoFolder)
    {
        $infoFolder['type'] = 'folder';
        $infoFolder['key'] = 'folder-' . $infoFolder['id'];
        $metas = json_decode($infoFolder['metas'], true);
        $infoFolder['total_size'] = isset($metas['total_size']) ? $metas['total_size'] : 0;
        $infoFolder['file_number'] = isset($metas['file_number']) ? $metas['file_number'] : 0;
        $infoFolder['permission'] = $this->_getFileAndFolderPermission($infoFolder);

        return $infoFolder;
    }

    private function _handleDriveFileDataToReturn(&$infoFile)
    {
        $infoFile['type'] = 'file';
        $infoFile['key'] = 'file-' . $infoFile['id'];
        $infoFile['permission'] = $this->_getFileAndFolderPermission($infoFile);

        return $infoFile;
    }

    private function _handleDriveFolderDataForInsert($data)
    {
        if (!isset($data['parent'])) {
            $data['parent'] = 3;
        }

        $data['share_type'] = 0;
        $data['metas'] = '[]';

        return $data;
    }

    private function _getFolderDirection($modulesFolder, $id, $getPathByParent = false, $customPath = '')
    {
        $model = $modulesFolder->model;

        $path = $customPath != '' ?  $customPath : '/' . $_ENV['data_folder_module'] . '/' . 'drive_folders/';

        if ($getPathByParent) {
            $infoDriveFolder = $model->asArray()->find($id);
            $parent = $infoDriveFolder['parent'];

            if (empty($parent)) {
                $path .= $infoDriveFolder['id'] . '/data/';
            } else {
                $infoParent = $model->asArray()->find($parent);
                $parentPath = json_decode($infoParent['metas'], true)['folder_path'];
                $path = $parentPath . $id  . '/data/';
            }
        } else {
            $listAllFolder = handleDataBeforeReturn($modulesFolder, $model->asArray()->findAll(), true);
            $listParentFolder = array_reverse($this->_getFolderByRank($listAllFolder, $id, 'superior', array()));

            foreach ($listParentFolder as $rowParentFolder) {
                $path .= $rowParentFolder['id'] . '/data/';
            }
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

        $model = $modules->model;

        $infoDriveFolder = $model->asArray()->find($folderId);
        $metas = json_decode($infoDriveFolder['metas'], true);

        return isset($metas['folder_path']) ? $metas['folder_path'] : $commonFolder;
    }

    private function _handleUploadFile($modules, $folderId, $filesUpload, $customStorePath = '')
    {
        $uploadService = \App\Libraries\Upload\Config\Services::upload();

        $storePath = $customStorePath != '' ? $customStorePath : $this->_getFolderUploadFile($modules, $folderId);
        $result = $uploadService->uploadFile($storePath, $filesUpload);

        return $result;
    }

    private function _saveFileFromUploadResult($modulesFile, $resultUpload, $folderId)
    {
        $model = $this->modelDriveFile;

        foreach ($resultUpload['arr_upload_file'] as $row) {
            $dataSaveFile = [
                'name' => $row['filename'],
                'file_size' => $row['size'],
                'file_type' => $row['type'],
                'share_type' => 0,
                'drive_folder' => empty($folderId) ? 0 : $folderId,
                'metas' => json_encode([
                    'file_path' => $row['url']
                ])
            ];

            $model->save($dataSaveFile);
        }
    }

    private function _uploadFileDrive($modulesFolder, $modules, $postData, $fileData)
    {
        try {
            $resultUpload = $this->_handleUploadFile($modulesFolder, $postData['folder_id'], $fileData);
            $modules->setModule('drive_files');
            $model = $modules->model;

            //save file to db
            $this->_saveFileFromUploadResult($modules, $resultUpload, $postData['folder_id']);

            return $resultUpload;
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    private function _uploadFolderDrive($modulesFolder, $modules, $postData, $fileData)
    {
        try {
            $modelFolder = $modulesFolder->model;
            $modelFile = $modules->model;

            $listFilePathClient = $postData['file_path_client'];

            $sourcePath = '/' . $_ENV['data_folder_module'] . '/' . 'drive_folders/';
            $rootFolderId = 0;
            if (!empty($postData['folder_id'])) {
                $infoFolder = $modelFolder->asArray()->find($postData['folder_id']);
                $sourcePath = json_decode($infoFolder['metas'], true)['folder_path'];
                $rootFolderId = $postData['folder_id'];
            }

            // create directory, insert Folder to DB
            $listFilePathServer = $this->_insertFolderAndCreateDirectory($modulesFolder, $listFilePathClient, $sourcePath, $rootFolderId);

            // save file to folder
            $this->_insertAndSaveFile($modules, $fileData, $listFilePathServer);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    private function _insertFolderAndCreateDirectory($modulesFolder, $listFilePathClient, $sourcePath, $rootFolderId)
    {
        $result = [];

        $arrDirectoryCreated = [];
        foreach ($listFilePathClient as $keyFilePathClient => $rowFilePathClient) {
            $arrFilePath = explode('/', $rowFilePathClient);
            $currentIndex = (count($arrFilePath) - 2 >= 0) ? (count($arrFilePath) - 2) : 0;
            $currentDir = $arrFilePath[$currentIndex];
            $prevIndex = count($arrFilePath) - 3;
            $prevDir = isset($arrFilePath[$prevIndex]) ? $arrFilePath[$prevIndex] : '';

            if (empty($prevDir) && !isset($arrDirectoryCreated[$currentDir . '_0'])) { // parent folder
                // save folder
                $saveData = [
                    'name' => $currentDir,
                    'description' => '',
                    'share_type' => 0,
                    'parent' => $rootFolderId,
                    'metas' => '[]'
                ];

                $resultFolder = $this->_handleSaveFolderAndCreateDirectory($modulesFolder, $saveData, $sourcePath);
                $id = $resultFolder['id'];
                $path = $resultFolder['path'];

                $arrDirectoryCreated[$currentDir . '_0'] = [
                    'id' => $id,
                    'path' => $path
                ];

                $result[$keyFilePathClient] = [
                    'path' => $path,
                    'id' => $id
                ];
            } elseif (!isset($arrDirectoryCreated[$currentDir . '_' . $currentIndex])) {
                $saveData = [
                    'name' => $currentDir,
                    'description' => '',
                    'share_type' => 0,
                    'parent' => $arrDirectoryCreated[$prevDir . '_' . $prevIndex]['id'],
                    'metas' => '[]'
                ];

                $resultFolder = $this->_handleSaveFolderAndCreateDirectory($modulesFolder, $saveData, $sourcePath);
                $id = $resultFolder['id'];
                $path = $resultFolder['path'];

                $arrDirectoryCreated[$currentDir . '_' . $currentIndex] = [
                    'id' => $id,
                    'path' => $path
                ];

                $result[$keyFilePathClient] = [
                    'path' => $path,
                    'id' => $id
                ];
            } elseif (isset($arrDirectoryCreated[$currentDir . '_' . $currentIndex])) {
                $result[$keyFilePathClient] = $arrDirectoryCreated[$currentDir . '_' . $currentIndex];
            }
        }

        return $result;
    }

    private function _handleSaveFolderAndCreateDirectory($modulesFolder, $saveData, $sourcePath)
    {
        $modelFolder = $modulesFolder->model;

        // save folder
        $modelFolder->setAllowedFields(array_keys($saveData));
        $modelFolder->save($saveData);
        $id = $modelFolder->getInsertID();

        // create directory
        $path = $this->_getFolderDirection($modulesFolder, $id, true, $sourcePath);

        // update folder path
        $updateData = [
            'id' => $id,
            'metas' => json_encode([
                'folder_path' => $path
            ])
        ];

        $modelFolder->save($updateData);

        return [
            'id' => $id,
            'path' => $path
        ];
    }

    private function _insertAndSaveFile($modulesFile, $fileData, $listFilePathServer)
    {
        if (count($fileData) == 0 || count($listFilePathServer) == 0) {
            return false;
        }

        foreach ($fileData as $rowFile) {
            foreach ($rowFile as $indexFile => $file) {
                // upload
                $resultUpload = $this->_handleUploadFile(null, null, [$file], $listFilePathServer[$indexFile]['path']);

                // save to db
                $this->_saveFileFromUploadResult($modulesFile, $resultUpload, $listFilePathServer[$indexFile]['id']);
            }
        }
    }

    private function _getListRecentFileAndFolder()
    {
        $result = [];

        $listRecent = $this->modelDriveInteractLog->asArray()
            ->where('owner', user_id())
            ->groupStart()
            ->where('action', 'insert')
            ->orWhere('action', 'update')
            ->groupEnd()
            ->orderBy('created_at', 'DESC')
            ->findAll();

        foreach ($listRecent as $rowRecent) {
            if ($rowRecent['type'] == 'file' && !empty($rowRecent['module_id'])) {
                $info = $this->modelDriveFile->find($rowRecent['module_id']);
                if ($info) {
                    $info = $this->_handleDriveFileDataToReturn($info);
                    $result[$rowRecent['type'] . '-' . $rowRecent['module_id']] = $info;
                }
            } else if ($rowRecent['type'] == 'folder') {
                $info = $this->modelDriveFolder->find($rowRecent['module_id']);
                if ($info) {
                    $info = $this->_handleDriveFolderDataToReturn($info);
                    $result[$rowRecent['type'] . '-' . $rowRecent['module_id']] = $info;
                }
            }
        }


        return $result;
    }

    private function _getListFileAndFolderOrder($folderId, $limit, $page, $sortColumn = 'created_at')
    {
        $modulesFolder = \Config\Services::modules('drive_folders');
        $modelFolder = $this->modelDriveFolder;
        $modulesFile = \Config\Services::modules('drive_files');
        $modelFile = $this->modelDriveFile;
        // get list file
        $builderFile = $modelFile->asArray();

        if (!empty($folderId)) {
            $builderFile->where('drive_folder', $folderId);
        }

        $builderFile = $this->_getQueryBuilderFileAndFolderPermission($builderFile);
        $listFile = $builderFile->findAll($limit, $page);

        foreach ($listFile as $keyFile => $rowFile) {
            $listFile[$keyFile]['key'] = 'file-' . $rowFile['id'];
            $listFile[$keyFile]['type'] = 'file';
            $listFile[$keyFile]['permission'] = $this->_getFileAndFolderPermission($rowFile);
        }
        $listFile = handleDataBeforeReturn($modulesFile, $listFile, true);

        // get list sub-folder
        $builderFolder = $modelFolder->asArray();

        if (!empty($folderId)) {
            $builderFolder->where('parent', $folderId);
        }

        $builderFolder = $this->_getQueryBuilderFileAndFolderPermission($builderFolder);
        $listFolder = $builderFolder
            ->orderBy('updated_at', 'DESC')
            ->findAll($limit, $page);

        $listFolder = $this->_getFolderCapacityAndFileNumber($modelFile, $listFolder);
        $listFolder = handleDataBeforeReturn($modulesFolder, $listFolder, true);

        $listAll = array_merge($listFile, $listFolder);

        $listAllWithKey = [];
        foreach ($listAll as $row) {
            $listAllWithKey[$row['type'] . '-' . $row['id']] = $row;
        }

        $this->_arraySortByColumn($listAllWithKey, $sortColumn);

        return array_slice($listAllWithKey, 0, $limit);
    }

    private function _arraySortByColumn(&$arr, $col, $dir = SORT_ASC)
    {
        $sortCol = array();
        foreach ($arr as $key => $row) {
            $sortCol[$key] = $row[$col];
        }

        array_multisort($sortCol, $dir, $arr);
    }

    private function _getFolderCapacityAndFileNumber($modelFile, &$listFolder)
    {
        $modelFile = $modelFile == null ? $this->modelDriveFile : $modelFile;
        foreach ($listFolder as $keyFolder => $rowFolder) {
            $listFolder[$keyFolder]['type'] = 'folder';
            $listFolder[$keyFolder]['key'] = 'folder-' . $rowFolder['id'];
            $listFolder[$keyFolder]['permission'] = $this->_getFileAndFolderPermission($rowFolder);
            $listFileFolder = $modelFile->asArray()
                ->where('drive_folder', $rowFolder['id'])
                ->where('deleted_at', null)
                ->findAll();

            if (count($listFileFolder) == 0) {
                $listFolder[$keyFolder]['total_size'] = 0;
                continue;
            }

            foreach ($listFileFolder as $rowFileFolder) {
                if (!isset($listFolder[$keyFolder]['total_size'])) {
                    $listFolder[$keyFolder]['total_size'] = 0;
                }

                $listFolder[$keyFolder]['total_size'] += $rowFileFolder['file_size'];
            }

            $listFolder[$keyFolder]['file_number'] = count($listFileFolder);
        }

        return $listFolder;
    }

    private function _handleDataSharePermissionFileAndFolder($data)
    {
        $result = [];
        foreach ($data as $key => $row) {
            if (strpos($key, 'share-permission-') === 0) {
                $keyReplace = str_replace('share-permission-', '', $key);
                $arrKey = explode('-', $keyReplace);
                $module = $arrKey[0];
                $id = $arrKey[1];

                // ** sample: u_1_v
                $strPermission = $this->arrReplaceModule[$module] . '_' . $id . '_' . $this->arrReplacePermission[$row];
                $result[] = $strPermission;
            }
        }

        return $result;
    }

    private function _getQueryBuilderFileAndFolderPermission(&$builder)
    {
        $builder->groupStart()
            ->where('owner', user_id())
            ->orGroupStart()
            ->groupStart()
            ->where('share_type', 3) // user
            ->groupStart()
            ->groupStart()
            ->where(handleJsonQueryString('permission', $this->permissionViewByOffice, '=', false))
            ->orWhere(handleJsonQueryString('permission', $this->permissionEditByOffice, '=', false))
            ->groupEnd()
            ->orGroupStart()
            ->where(handleJsonQueryString('permission', $this->permissionViewByDepartment, '=', false))
            ->orWhere(handleJsonQueryString('permission', $this->permissionEditByDepartment, '=', false))
            ->groupEnd()
            ->orGroupStart()
            ->where(handleJsonQueryString('permission',  $this->permissionViewByUser, '=', false))
            ->orWhere(handleJsonQueryString('permission',  $this->permissionEditByUser, '=', false))
            ->groupEnd()
            ->groupEnd()
            ->groupEnd()
            ->orGroupStart()
            ->where('share_type', 1) // public view only
            ->groupEnd()
            ->orGroupStart()
            ->where('share_type', 2) // public view only
            ->groupEnd()
            ->groupEnd()
            ->groupEnd();

        return $builder;
    }

    private function _getFileAndFolderPermission(&$record)
    {
        $arrReplacePermissionFlip = array_flip($this->arrReplacePermission);

        $shareType = $record['share_type'];

        if ($shareType == 0) {
            return $arrReplacePermissionFlip['e'];
        }

        if ($shareType == 1) {
            return $arrReplacePermissionFlip['v'];
        }

        if ($shareType == 2) {
            return $arrReplacePermissionFlip['e'];
        }

        $arrPermission = json_decode($record['permission'], true);

        if (empty($arrPermission)) {
            return "";
        }

        $permission = '';
        foreach ($arrPermission as $rowPermission) {
            if (
                $rowPermission == $this->permissionViewByOffice
                || $rowPermission == $this->permissionViewByDepartment
                || $rowPermission == $this->permissionViewByUser
            ) {
                $permission = $arrReplacePermissionFlip['v'];
                break;
            } elseif (
                $rowPermission == $this->permissionEditByOffice
                || $rowPermission == $this->permissionEditByDepartment
                || $rowPermission == $this->permissionEditByUser
            ) {
                $permission = $arrReplacePermissionFlip['e'];
                break;
            }
        }

        return $permission;
    }

    private function _getShareUser($arrPermission)
    {
        if (!$arrPermission) {
            return [];
        }

        $result = [];
        $arrReplaceModuleFlip = array_flip($this->arrReplaceModule);
        $arrReplacePermissionFlip = array_flip($this->arrReplacePermission);

        foreach ($arrPermission as $rowPermission) {
            $arrItem = explode('_', $rowPermission);

            if (count($arrPermission) == 0) {
                continue;
            }

            $module = $arrReplaceModuleFlip[$arrItem[0]];
            $id = $arrItem[1];
            $permission = $arrItem[2];

            $arrSelect = ['id'];
            if ($module == 'users') {
                $arrSelect[] = 'full_name';
                $arrSelect[] = 'email';
                $arrSelect[] = 'avatar';
            } else {
                $arrSelect[] = 'name';
            }

            $modules = \Config\Services::modules($module);
            $model = $modules->model;

            $info = $model->asArray()
                ->select($arrSelect)
                ->find($id);
            $info['share_permission'] = $arrReplacePermissionFlip[$permission];
            $info['with_modules_option_type'] = $module;

            $result[$info['id']] = $info;
        }

        return $result;
    }
}
