<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : home
*/

namespace App\Controllers;

use CodeIgniter\Files\File;

class Lib extends ErpController
{
	protected function _uploadFile($file)
	{
		if (!$file->hasMoved()) {
			$libPath = 'lib/' . date('Y') . '/' . date('m') . '/' . date('d') . '/';
			$storePath = WRITEPATH . 'uploads/' . $libPath;

			$fileName = safeFileName($file->getName());

			if ($file->move($storePath, $fileName)) {
				$fileName = $file->getName();
				return $libPath . $fileName;
			}
		}
		return null;
	}

	public function upload_post()
	{
		$filesData = $this->request->getFiles();
		$result = [];
		if ($filesData) {
			foreach ($filesData as $key => $files) {

				if (empty($files)) continue;
				if (!is_array($files)) $files = [$files];
				foreach ($files as $position => $file) {
					if (!$file->isValid()) {
						return $this->failValidationErrors($file->getErrorString() . '(' . $file->getError() . ')');
					}
					$fileName = $this->_uploadFile($file);
					if (!empty($fileName)) {
						$result[] = getenv('app.baseURL') . '/lib/download/image?name=' . $fileName;
						//$result[] = getenv('app.baseURL') . '/test.png';
					}
				}
			}
		}
		if (count($result) === 1)
			$result = $result[0];
		return $this->respond($result);
	}

	public function download_get($type)
	{

		$path = urldecode($this->request->getVar('name'));
		$path = ltrim($path, '/');

		$folder = explode('/', $path)[0];
		$allowFolders = (empty($_ENV['data_folder_public'])) ? [] : explode(',', $_ENV['data_folder_public']);
		$allowFolders = array_merge($allowFolders, ['lib']);
		if (!in_array($folder, $allowFolders)) {
			return $this->failNotFound('permission_denied');
		}
		$filepath = WRITEPATH . 'uploads/' . $path;
		if ($type === 'file' && (empty($path) || !file_exists($filepath))) {
			return $this->failNotFound("File $filepath does not exist");
		}
		if ($type === 'file' && !is_readable($filepath)) {
			return $this->failNotFound("File $filepath is not readable");
		}
		if ($type === 'image' && empty($path) || !file_exists($filepath) || !is_readable($filepath)) {
			$customDefault = WRITEPATH . 'uploads/default/img-not-found.png';
			if (empty($customDefault) || !file_exists($customDefault) || !is_readable($customDefault)) {
				$filepath = COREPATH . 'assets/images/default/img-not-found.png';
			} else {
				$filepath = $customDefault;
			}
		}

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
		$method = $_SERVER['REQUEST_METHOD'];
		if ($method == "OPTIONS") {
			die();
		}
		http_response_code(200);
		header('Content-Length: ' . filesize($filepath));
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$fileinfo = pathinfo($filepath);

		header('Content-Type: ' . finfo_file($finfo, $filepath));
		header('fileName: ' . basename($fileinfo['basename']));
		finfo_close($finfo);
		header('Content-Disposition: attachment; filename="' . basename($fileinfo['basename']) . '"'); // feel free to change the suggested filename
		ob_clean();
		flush();
		readfile($filepath);
		exit;

	}
}