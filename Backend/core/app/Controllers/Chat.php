<?php

namespace App\Controllers;

use App\Models\UserModel;

class Chat extends ErpController
{
	public function get_employees_get()
	{
		$userModel = new UserModel();
		$publicField = $userModel->getPublicField();
		$select = [];
		foreach ($publicField as $item) {
			$select[] = "users." . $item;
		}
		$select[] = "job_titles.name as job_title";

		$dataUser = $userModel->asArray()->select($select)->join('job_titles', 'job_titles.id = users.job_title_id', 'left')->onlyActived()->findAll();
		return $this->respond($dataUser);
	}

	public function post_up_file_post()
	{
		sleep(1);
		$getPara = $this->request->getPost();
		$file = $this->request->getFiles()['file'];
		$groupId = $getPara['groupId'];
		$compress_images = $getPara['compress_images'];
		$file_type = $getPara['file_type'];
		$arrFileType = $getPara['file'];
		$moduleName = "chat";
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$out = [];
		if ($file_type == 'image' && filter_var($compress_images, FILTER_VALIDATE_BOOLEAN)) {
			foreach ($file as $key => $item) {
				$result = $this->_renderImageWebp($moduleName, $groupId, $item['file'], "other");
				if (!empty($result['error_file'])) {
					return $this->failServerError('error');
				}

				$out[] = $this->_handleResultFile($arrFileType, $key, $result);
			}
		} else {
			foreach ($file as $key => $item) {
				$storePath = getModuleUploadPath($moduleName, $groupId, false) . "other/";
				$result = $uploadService->uploadFile($storePath, [$item['file']]);
				if (!empty($result['error_file'])) {
					return $this->failServerError('error');
				}

				$out[] = $this->_handleResultFile($arrFileType, $key, $result);
			}
		}

		return $this->respond($out);
	}

	public function post_up_background_post()
	{
		$out = "";
		$getPara = $this->request->getPost();
		$file = $getPara['file'];
		$groupId = $getPara['groupId'];
		$moduleName = "chat";
		if (preg_match('/^data:image\/(\w+);base64,/', $file, $type)) {
			$uploadService = \App\Libraries\Upload\Config\Services::upload();
			$data = substr($file, strpos($file, ',') + 1);
			$mime_type = getimagesize($file);
			$type = strtolower($type[1]); // jpg, png, gif
			if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
				throw new \Exception(FILE_NOT_ALLOWED);
			}
			$data = str_replace(' ', '+', $data);
			$data = base64_decode($data);
			if (!$data) {
				throw new \Exception(FILE_CORRUPTED);
			}
			$name = $this->_handleNameWebp($moduleName, $groupId, 'background');
			$tempImage = tmpfile();
			fwrite($tempImage, $data);
			$fileName = stream_get_meta_data($tempImage)['uri'];
			$result = $this->_handleImageWebp($moduleName, $groupId, "background", $name, $fileName);
			if (!empty($result['error_file'])) {
				return $this->failServerError('error');
			}

			$out = $result['arr_upload_file'][0]['filename'];
		}

		return $this->respond($out);
	}

	public function post_up_avatar_post()
	{
		$out = "";
		$getPara = $this->request->getPost();
		$file = $getPara['file'];
		$groupId = $getPara['groupId'];
		$moduleName = "chat";
		if (preg_match('/^data:image\/(\w+);base64,/', $file, $type)) {
			$uploadService = \App\Libraries\Upload\Config\Services::upload();
			$data = substr($file, strpos($file, ',') + 1);
			$mime_type = getimagesize($file);
			$type = strtolower($type[1]); // jpg, png, gif
			if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
				throw new \Exception(FILE_NOT_ALLOWED);
			}
			$data = str_replace(' ', '+', $data);
			$data = base64_decode($data);
			if (!$data) {
				throw new \Exception(FILE_CORRUPTED);
			}
			$name = $this->_handleNameWebp($moduleName, $groupId, 'avatar');
			$tempImage = tmpfile();
			fwrite($tempImage, $data);
			$fileName = stream_get_meta_data($tempImage)['uri'];
			$result = $this->_handleImageWebp($moduleName, $groupId, "avatar", $name, $fileName);
			if (!empty($result['error_file'])) {
				return $this->failServerError('error');
			}

			$out = $result['arr_upload_file'][0]['filename'];
		}

		return $this->respond($out);
	}

	public function post_delete_message_post()
	{
		exit;
		/*$getPara = $this->request->getPost();
		$collectionName = $getPara['collectionName'];

		$db = new FirestoreClient([
			'projectId' => 'friday-351410',
		]);
		$collectionReference = $db->collection($collectionName);
		$documents = $collectionReference->documents();
		while (!$documents->isEmpty()) {
			foreach ($documents as $document) {
				//printf('Deleting document %s' . PHP_EOL, $document->id());
				$document->reference()->delete();
			}
			$documents = $collectionReference->documents();
		}

		return $this->respond(ACTION_SUCCESS);*/
	}

	/** support function */
	private function _renderImageWebp($moduleName, $groupId, $file, $folder)
	{

		$resultNameImage = $this->_handleNameImageWebp($moduleName, $groupId, $file, $folder);
		$name = $resultNameImage['name'];
		$fileName = $resultNameImage['fileName'];

		return $this->_handleImageWebp($moduleName, $groupId, $folder, $name, $fileName);
	}

	private function _handleNameImageWebp($moduleName, $groupId, $file, $folder)
	{
		$name = explode(".", safeFileName($file->getName()))[0] . ".webp";
		for ($i = 1; $i <= 50; $i++) {
			if (file_exists(getModuleUploadPath($moduleName, $groupId) . $folder . "/" . $name)) {
				$name = explode(".", safeFileName($file->getName()))[0] . "_" . $i . ".webp";
			} else {
				break;
			}
		}

		$fileName = $file->getPathName();
		return ['name' => $name, 'fileName' => $fileName];
	}

	private function _handleNameWebp($moduleName, $groupId, $folder)
	{
		$name = $folder . ".webp";
		for ($i = 1; $i <= 50; $i++) {
			if (file_exists(getModuleUploadPath($moduleName, $groupId) . $folder . "/" . $name)) {
				$name = $folder . "_" . $i . ".webp";
			} else {
				break;
			}
		}

		return $name;
	}

	private function _handleImageWebp($moduleName, $groupId, $folder, $name, $fileName)
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$image = \Config\Services::image();
		$tempFile = tmpfile();
		$path = stream_get_meta_data($tempFile)['uri'];
		$image->withFile($fileName)->withResource()->convert(IMAGETYPE_WEBP)->save($path, 80);
		$filesUpload = [
			[
				'filename' => $name,
				'filesize' => filesize($path),
				'content' => file_get_contents($path)
			]
		];
		$pathUpload = getModuleUploadPath($moduleName, $groupId, false) . $folder . "/";
		return $uploadService->uploadFile($pathUpload, $filesUpload, true);
	}

	private function _handleResultFile($arrFileType, $key, $result)
	{
		$size = $result['arr_upload_file'][0]['size'] / 1024;
		$size_type = "KB";
		if ($size >= 1024) {
			$size = $size / 1024;
			$size_type = "MB";
		}
		$size = round($size, 2);
		$file_name = $result['arr_upload_file'][0]['filename'];
		$file_name_arr = explode(".", $file_name);
		$fileType =
			count($file_name_arr) > 1 ? $file_name_arr[count($file_name_arr) - 1] : "";

		return [
			'type' => $arrFileType[$key]['type'],
			'file' => $result['arr_upload_file'][0]['filename'],
			'file_type' => $fileType,
			'size' => $size,
			'size_type' => $size_type
		];
	}
}