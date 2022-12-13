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

		$dataUser = $userModel->asArray()->select($select)->join('job_titles', 'job_titles.id = users.job_title_id', 'left')->where("account_status", "activated")->findAll();
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
				$name = explode(".", safeFileName($item['file']->getName()))[0];
				for ($i = 1; $i <= 50; $i++) {
					if (file_exists(getModuleUploadPath($moduleName, $groupId) . "other/" . $name . ".webp")) {
						$name = explode(".", safeFileName($item['file']->getName()))[0] . "_" . $i;
					} else {
						break;
					}
				}
				$fileName = $item['file']->getPathName();
				$image = \Config\Services::image();
				$tempFile = tmpfile();
				$path = stream_get_meta_data($tempFile)['uri'];
				$image->withFile($fileName)->withResource()->convert(IMAGETYPE_WEBP)->save($path, 80);
				$filesUpload = [
					[
						'filename' => $name . '.webp',
						'filesize' => filesize($path),
						'content' => file_get_contents($path)
					]
				];
				$pathUpload = getModuleUploadPath($moduleName, $groupId, false) . "other/";
				$result = $uploadService->uploadFile($pathUpload, $filesUpload, true);
				$out[] = [
					'type' => $arrFileType[$key]['type'],
					'file' => $result['arr_upload_file'][0]['filename']
				];
			}
		} else {
			foreach ($file as $key => $item) {
				$storePath = getModuleUploadPath($moduleName, $groupId, false) . "other/";
				$result = $uploadService->uploadFile($storePath, [$item['file']]);
				$out[] = [
					'type' => $arrFileType[$key]['type'],
					'file' => $result['arr_upload_file'][0]['filename']
				];
			}
		}

		return $this->respond($out);
	}
}