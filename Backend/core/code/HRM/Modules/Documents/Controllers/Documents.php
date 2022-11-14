<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : document
* Controller name : Document
* Time created : 28/04/2022 09:07:47
*/

namespace HRM\Modules\Documents\Controllers;

use App\Controllers\ErpController;
use stdClass;
use ZipArchive;

class Documents extends ErpController
{
	// ** handle request function
	public function index_get()
	{
		return $this->respond([]);
	}

	public function document_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');

		if (!mayList('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$data = $this->request->getGet();
		$model = $modules->model;
		$result = $model->asArray()->where('parent', 0)->findAll();
		$currentUser = user();
		$arrDocument = handleDataBeforeReturn($modules, $result, true);
		$listDocument = $this->_getDocumentViewable($currentUser, $arrDocument);

		foreach ($listDocument as $key => $row) {
			$listDocument[$key]['type'] = "document";
			$listDocument[$key]['created_at'] = date('d M Y H:i A', strtotime($row['created_at']));
		}

		return $this->respond([
			'results' => $listDocument
		]);
	}

	public function save_document_post()
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$modules->setModule('documents');

		if (!mayAdd('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$postData = $this->request->getPost();
		$model = $modules->model;
		$dataHandleDocument = handleDataBeforeSave($modules, $postData);
		if (!empty($dataHandleDocument['validate'])) {
			if (!$validation->reset()->setRules($dataHandleDocument['validate'])->run($dataHandleDocument['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandleDocument['fieldsArray']);
		$saveDocument = $this->_handleDocumentDataBeforeSave($dataHandleDocument['data']);
		try {
			$model->save($saveDocument);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		$id = $model->getInsertID();

		//create folder
		$this->_getDocumentDirection($modules, $id);

		return $this->respondCreated($id);
	}

	public function update_document_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$modules->setModule('documents');

		if (!mayUpdate('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$postData = $this->request->getPost();
		$postData['id'] = $id;
		$model = $modules->model;
		$dataHandleDocument = handleDataBeforeSave($modules, $postData);
		if (!empty($dataHandleDocument['validate'])) {
			if (!$validation->reset()->setRules($dataHandleDocument['validate'])->run($dataHandleDocument['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}

		$model->setAllowedFields($dataHandleDocument['fieldsArray']);
		$saveDocument = $dataHandleDocument['data'];
		try {
			$model->save($saveDocument);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function remove_document_delete($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');

		if (!mayDelete('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$model = $modules->model;

		try {
			//remove folder
			$this->_deleteDirectory($modules, $id);

			$model->delete($id);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_DELETE);
		}



		return $this->respondDeleted($id);
	}

	public function download_document_get($id)
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$modules->setModule('documents');
		$model = $modules->model;
		$infoDocument = (array)$model->find($id);
		$uploadFilename = json_decode($infoDocument['upload_filename'], true);

		//export zip file
		$storePath = $this->_getDocumentDirection($modules, $id);
		$zipFile = $infoDocument['name'];

		$listAllDocument = handleDataBeforeReturn($modules, $model->asArray()->findAll(), true);
		$listChildDocument = $this->_getDocumentByRank($listAllDocument, $id, 'subordinate', array());
		$listChildDocumentValid = $this->_getDocumentViewable(user(), $listChildDocument, true);
		$arrSubFilename = [];
		if (count($listChildDocumentValid) > 1) {
			foreach ($listChildDocumentValid as $rowChildDocumentValid) {
				$arrSubFilename[$rowChildDocumentValid['id']] = [
					'name' => $rowChildDocumentValid['name']
				];
			}
		}
		$res = $uploadService->downloadFolder($storePath, $uploadFilename, $zipFile, $arrSubFilename);
		if (!$res) {
			return $this->failNotFound();
		}
	}

	public function share_document_post($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');

		if (!mayUpdate('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$postData = $this->_handleShareDocumentData($this->request->getPost());
		$model = $modules->model;
		$model->setAllowedFields(array_keys($postData));
		$postData['id'] = $id;
		$dataHandleDocument = handleDataBeforeSave($modules, $postData);
		$saveDocument = $dataHandleDocument['data'];
		$sharingPermissionRecursively = $postData['sharing_permission_recursively'];
		if ($sharingPermissionRecursively) {
			$listAllDocument = $model->asArray()->findAll();
			$listChildDocument = $this->_getDocumentByRank($listAllDocument, $id, 'subordinate', array());
			foreach ($listChildDocument as $row) {
				if ($row['id'] != $id) {
					$dataUpdate = [
						'id' => $row['id'],
						'share' => $row['share'],
						'share_type' => $saveDocument['share_type'],
						'office' => $saveDocument['office'],
						'department' => $saveDocument['department'],
						'employee' => $saveDocument['employee']
					];
					$model->setAllowedFields(array_keys($dataUpdate));
					$model->save($dataUpdate);
				}
			}
		}
		try {
			$model->save($saveDocument);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function update_share_status_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$modules->setModule('documents');

		if (!mayUpdate('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$postData = $this->request->getPost();
		$model = $modules->model;
		$postData['id'] = $id;
		$model->setAllowedFields(array_keys($postData));
		$saveDocument = $postData;
		try {
			$model->save($saveDocument);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function document_detail_get($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');

		$params = $this->request->getGet();
		$model = $modules->model;

		$result = [
			'data' => new stdClass,
			'list_file_and_folder' => []
		];
		$currentUser = user();
		$listDocument = [];
		$infoDocument = $model->asArray()->find($id);
		if (!$infoDocument) {
			return $this->failNotFound();
		}


		$infoDocument = handleDataBeforeReturn($modules, $infoDocument);
		$listDocument[] = $infoDocument;

		// child documents

		$modules->setModule('documents');
		$model = $modules->model;
		$listAllDocuments = $model->asArray()
			->findAll();
		$listChildDocuments = [];

		foreach ($listAllDocuments as $row) {
			if ($row['parent'] == $id) {
				$listChildDocuments[] = $row;
			}
		}

		$arrDocument = handleDataBeforeReturn($modules, $listChildDocuments, true);
		foreach ($arrDocument as $rowDocument) {
			$arrayPush = $rowDocument;
			$arrayPush['type'] = 'document';
			$listDocument[] = $arrayPush;
		}



		$documentViewable = $this->_getDocumentViewable($currentUser, $listDocument, true);
		if (count($documentViewable) > 0) {
			$isValidCurrentDocument = false;
			$listDocumentValid = [];
			foreach ($documentViewable as $rowDocumentViewable) {
				if ($rowDocumentViewable['id'] == $id) {
					$isValidCurrentDocument = true;
				} else {
					$arrayPushChildDocument = $rowDocumentViewable;
					$arrayPushChildDocument['created_at'] = date('d M Y H:i A', strtotime($rowDocumentViewable['created_at']));
					$result['list_file_and_folder'][] = $arrayPushChildDocument;
					$listDocumentValid[] =  $arrayPushChildDocument;
				}
			}

			if ($isValidCurrentDocument) {
				$uploadFilename = json_decode($infoDocument['upload_filename'], true);

				$result['data'] = $infoDocument;
				//get list file
				if (isset($params['filename'])) {
					$uploadFilename = array_filter($uploadFilename, function ($item) use ($params) {
						return $item['fileName'] == $params['filename'];
					});
				}
				foreach (array_values($uploadFilename) as $rowFile) {
					$arrayPush = $rowFile;
					$rowFile['type'] = 'file';
					$result['list_file_and_folder'][] = $arrayPush;
				}
			}

			$documentParent = $this->_getDocumentByRank($listAllDocuments, $id, 'superior', array());
			$result['parent_document'] = array_reverse($documentParent);
		}

		return $this->respond($result);
	}

	public function upload_file_document_post($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');
		$model = $modules->model;
		$postData = $this->request->getPost();
		$filesUpload = $this->request->getFiles();
		$resultUpload = $this->_uploadFileDocument($modules, $id, $filesUpload);

		//update document
		if (!mayUpdate('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$infoDocument = (array)$model->find($id);
		$size = intval($infoDocument['size']) + $resultUpload['total_size'];
		$uploadFilename = array_merge($resultUpload['arr_upload_file'], json_decode($infoDocument['upload_filename'], true));
		$updateData = [
			'id' => $id,
			'upload_filename' => json_encode($uploadFilename),
			'size' => $size
		];
		$model->setAllowedFields(array_keys($updateData));
		try {
			$model->save($updateData);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function replace_file_document_post($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');
		$model = $modules->model;
		$infoDocument = (array)$model->find($id);
		$uploadFilename = json_decode($infoDocument['upload_filename'], true);
		$postData = $this->request->getPost();
		$filesUpload = $this->request->getFiles();

		//remove old file
		$oldFileInfo = $postData['current_file_data'];
		$this->_removeFileDocument($modules, $id, $oldFileInfo['filename']);

		//upload file
		$resultUpload = $this->_uploadFileDocument($modules, $id, $filesUpload);

		foreach ($uploadFilename as $key => $row) {
			if ($row['fileName'] == $oldFileInfo['fileName']) {
				$uploadFilename[$key] = $resultUpload['arr_upload_file'][0];
				break;
			}
		}

		//update document
		$size = intval($infoDocument['size']) - $oldFileInfo['size'] + $resultUpload['total_size'];
		$updateData = [
			'id' => $id,
			'size' => $size,
			'upload_filename' => json_encode(array_values($uploadFilename))
		];
		$model->setAllowedFields(array_keys($updateData));
		try {
			$model->save($updateData);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function delete_file_document_post($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');
		$model = $modules->model;
		$infoDocument = (array)$model->find($id);
		$uploadFilename = json_decode($infoDocument['upload_filename'], true);
		$postData = $this->request->getPost();

		//remove file
		$fileInfo = $postData['current_file_data'];
		$this->_removeFileDocument($modules, $id, $fileInfo['filename']);

		foreach ($uploadFilename as $key => $row) {
			if ($row['filename'] == $fileInfo['filename']) {
				unset($uploadFilename[$key]);
				break;
			}
		}

		//update document
		$size = intval($infoDocument['size']) - $fileInfo['size'];
		$updateData = [
			'id' => $id,
			'size' => $size,
			'upload_filename' => json_encode($uploadFilename)
		];
		$model->setAllowedFields(array_keys($updateData));
		try {
			$model->save($updateData);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function upload_file_from_google_drive_post($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('documents');
		$model = $modules->model;

		$postData = $this->request->getPost();
		$files = $postData['files'];

		$googleService = \App\Libraries\Google\Config\Services::google();
		$driveService = $googleService->drive();

		$result = $driveService->handleGetFileContent($files);

		if (count($result['result']) > 0) {
			$files = $result['result'];
			$resultUpload = $this->_uploadFileDocumentByContentFile($id, $files);

			//update document
			if (!mayUpdate('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
			$infoDocument = (array)$model->find($id);
			$size = intval($infoDocument['size']) + $resultUpload['total_size'];
			$uploadFilename = array_merge($resultUpload['arr_upload_file'], json_decode($infoDocument['upload_filename'], true));
			$updateData = [
				'id' => $id,
				'upload_filename' => json_encode($uploadFilename),
				'size' => $size
			];
			$model->setAllowedFields(array_keys($updateData));
			try {
				$model->save($updateData);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
		} else {
			return $this->respond(FAILED_UPLOAD);
		}
	}

	public function get_info_document_get($id)
	{
		$modules = \Config\Services::modules('documents');
		$model = $modules->model;

		try {
			$infoDocument = $model->asArray()->find($id);
		} catch (\Exception $e) {
			return $this->failNotFound();
		}

		return $this->respond([
			'data' => handleDataBeforeReturn($modules, $infoDocument)
		]);
	}

	// ** support function
	private function _getDocumentViewable($currentUser, $document, $isMultiple = true)
	{
		$result = [];
		$documentList = !$isMultiple ? [$document] : $document;
		$userId = $currentUser->id;
		$currentDepartment = $currentUser->department_id;
		$currentOffice = $currentUser->department_id;
		foreach ($documentList as $key => $row) {
			if (isset($row['created_by']['value']) && $row['created_by']['value'] == $userId) {
				$result[] = $row;
			} elseif ($row['share'] == 1) {
				$shareType = isset($row['share_type']['name_option']) ? $row['share_type']['name_option'] : '';
				if ($shareType == 'everyone') { //everyone
					$result[] = $row;
				} else if ($shareType == 'department' && in_array($currentDepartment, json_decode($row['department'], true))) { //department
					$result[] = $row;
				} else if ($shareType == 'offices' && in_array($currentOffice, json_decode($row['office'], true))) { // offices
					$result[] = $row;
				} else if ($shareType == 'employee' && in_array($userId, json_decode($row['employee'], true))) { // employee
					$result[] = $row;
				}
			}
		}

		return $result;
	}

	private function _handleDocumentDataBeforeSave($data)
	{
		$data['size'] = 0;
		$data['upload_filename'] = json_encode([]);
		return $data;
	}

	private function _deleteDirectory($modules, $id)
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$storePath = $this->_getDocumentDirection($modules, $id);
		$uploadService->deleteFolder($storePath);
	}

	private function _handleShareDocumentData($data)
	{
		$arrUpdateField = [
			471 => 'everyone',
			472 => 'department',
			473 => 'office',
			474 => 'employee_groups'
		];
		$shareType = intval($data['share_type']);
		foreach ($arrUpdateField as $key => $row) {
			if ($key != $shareType) {
				$data[$row] = [];
			}
		}
		unset($data['everyone']);
		return $data;
	}

	private function _getDocumentDirection($modules, $id)
	{
		$modules->setModule('documents');
		$model = $modules->model;

		$path =  '/' . $_ENV['data_folder_module'] . '/' . 'documents/';

		$listAllDocuments = handleDataBeforeReturn($modules, $model->asArray()->findAll(), true);
		$listParentDocument = array_reverse($this->_getDocumentByRank($listAllDocuments, $id, 'superior', array()));

		foreach ($listParentDocument as $rowParentDocument) {
			$path .= $rowParentDocument['id'] . '/data/';
		}

		$realPath = WRITEPATH . $_ENV['data_folder'] . '/' . $path;
		if (!is_dir($realPath)) {
			mkdir($realPath, 0777, true);
		}

		return $path;
	}

	private function _uploadFileDocument($modules, $id, $filesUpload)
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$storePath = $this->_getDocumentDirection($modules, $id);
		$result = $uploadService->uploadFile($storePath, $filesUpload);

		return $result;
	}

	private function _uploadFileDocumentByContentFile($id, $files)
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$storePath = getModuleUploadPath('documents', $id, false) . 'data/';
		$result = $uploadService->uploadFile($storePath, $files, true);

		return $result;
	}

	private function _removeFileDocument($modules, $id, $filename)
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$path = $this->_getDocumentDirection($modules, $id);
		$storePath = $path . $filename;
		$uploadService->removeFile($storePath);
	}

	private function _getDocumentByRank($data, $parent = 0,  $type = 'subordinate', $return = array(), $directOnly = false)
	{
		$compareKey = $type == 'superior' ? 'id' : 'parent';
		$parentKey =  $type == 'superior' ? 'parent' : 'id';

		foreach ($data as $key => $item) {
			if (!is_numeric($item[$parentKey])) $item[$parentKey] = 0;
			if ($item['id'] == $parent) $return[$item['id']] = $item;
			if ((int)$item[$compareKey] == (int)$parent) {
				$child = $directOnly ? [] : $this->_getDocumentByRank($data, $item[$parentKey], $type, $return);
				if (!empty($child)) {
					$return = $return + $child;
				}
				$return[$item['id']] = $item;
			}
		}
		return $return;
	}
}
