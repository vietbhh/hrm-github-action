<?php

namespace App\Controllers;

use App\Libraries\Upload\GoogleCloudStorage;
use App\Models\UserModel;

class Download extends ErpController
{

	public function file()
	{
		$downloadType = preference('upload_type');
		if ($downloadType == 'direct') {
			$path = urldecode($this->request->getVar('name'));
			$filepath = WRITEPATH . 'uploads/' . $path;
		} elseif ($downloadType == 'cloud_storage') {
			$content = $this->_getContentFileFromCloudStorage();
			if (empty($content)) {
				$filepath = '';
			} else {
				$temp = tmpfile();
				fwrite($temp, $content);
				$filepath = stream_get_meta_data($temp)['uri'];
			}
		}

		if ($downloadType == 'direct' && (empty($path) || !file_exists($filepath))) {
			return $this->failNotFound("File $filepath does not exist");
		}
		if (!is_readable($filepath)) {
			return $this->failNotFound("File $filepath is not readable");
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

	public function image()
	{
		$downloadType = preference('upload_type');
		$path = $this->request->getVar('name');

		if ($downloadType == 'direct') {
			$filepath = WRITEPATH . 'uploads/' . $path;
		} elseif ($downloadType == 'cloud_storage') {
			$content = $this->_getContentFileFromCloudStorage();
			if (empty($content)) {
				$filepath = '';
			} else {
				$temp = tmpfile();
				fwrite($temp, $content);
				$filepath = stream_get_meta_data($temp)['uri'];
			}
		}

		if (empty($path) || !file_exists($filepath) || !is_readable($filepath)) {
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
		finfo_close($finfo);
		header('Content-Disposition: attachment; filename="' . basename($fileinfo['basename']) . '"'); // feel free to change the suggested filename
		ob_clean();
		flush();
		readfile($filepath);
		exit;
	}

	public function avatar()
	{
		$downloadType = preference('upload_type');
		$userId = $this->request->getVar('user');
		if (!empty($userId)) {
			$userModel = new UserModel();
			$user = $userModel->select(['id', 'avatar'])->find($userId);
			$path = $user ? $user->avatar : "";
		} else {
			$path = $this->request->getVar('name');
		}
		$filepath = WRITEPATH . 'uploads/' . $path;
		if ($downloadType == 'direct') {
			$filepath = WRITEPATH . 'uploads/' . $path;
		} elseif ($downloadType == 'cloud_storage') {
			$content = $this->_getContentFileFromCloudStorage();
			if (empty($content)) {
				$filepath = '';
			} else {
				$temp = tmpfile();
				fwrite($temp, $content);
				$filepath = stream_get_meta_data($temp)['uri'];
			}
		}

		if (empty($path) || !file_exists($filepath) || !is_readable($filepath)) {
			$customDefault = WRITEPATH . 'uploads/default/noavt.webp';
			if (empty($customDefault) || !file_exists($customDefault) || !is_readable($customDefault)) {
				$filepath = COREPATH . 'assets/images/default/noavt.webp';
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
		finfo_close($finfo);
		header('Content-Disposition: attachment; filename="' . basename($fileinfo['basename']) . '"'); // feel free to change the suggested filename
		ob_clean();
		flush();
		readfile($filepath);
		exit;
	}

	public function publicDownload($type)
	{
		$downloadType = preference('upload_type');
		$path = urldecode($this->request->getVar('name'));
		$path = ltrim($path, '/');
		if ($downloadType == 'direct') {

			$folder = explode('/', $path)[0];
			$allowFolders = (empty($_ENV['data_folder_public'])) ? [] : explode(',', $_ENV['data_folder_public']);
			$hasPermit = false;
			foreach ($allowFolders as $item) {
				if (strpos($path, $item) === 0) {
					$hasPermit = true;
				}
			}
			if (!$hasPermit) {
				return $this->failNotFound('permission_denied');
			}
			$filepath = WRITEPATH . 'uploads/' . $path;
		} elseif ($downloadType == 'cloud_storage') {
			if (empty($content)) {
				$filepath = '';
			} else {
				$temp = tmpfile();
				fwrite($temp, $content);
				$filepath = stream_get_meta_data($temp)['uri'];
			}
		}

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

	public function logoDownload($type)
	{
		$downloadType = preference('upload_type');
		if ($downloadType == 'direct') {
			$path = urldecode($this->request->getVar('name'));
			$path = ltrim($path, '/');

			$folder = explode('/', $path)[0];
			if (!empty($folder)) {
				$allowFolders = (empty($_ENV['data_folder_public'])) ? [] : explode(',', $_ENV['data_folder_public']);

				if (!in_array($folder, $allowFolders)) {
					return $this->failNotFound('permission_denied');
				}
			}
			$filepath = WRITEPATH . 'uploads/' . $path;
		} elseif ($downloadType == 'cloud_storage') {
			$content = $this->_getContentFileFromCloudStorage();
			if (empty($content)) {
				$filepath = '';
			} else {
				$temp = tmpfile();
				fwrite($temp, $content);
				$filepath = stream_get_meta_data($temp)['uri'];
			}
		}
		$defaultLogoName = $this->request->getVar('type') === 'small' ? 'logo-icon.png' : 'logo.png';

		if ($type === 'image' && empty($path) || !file_exists($filepath) || !is_readable($filepath)) {
			$customDefault = WRITEPATH . 'uploads/default/' . $defaultLogoName;
			if (empty($customDefault) || !file_exists($customDefault) || !is_readable($customDefault)) {
				$filepath = COREPATH . 'assets/images/default/' . $defaultLogoName;
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

	//--------------------------------------------------------------------
	private function _getContentFileFromCloudStorage()
	{
		$firstCharacter = substr($this->request->getVar('name'), 0, 1);
		$name = $firstCharacter != '/' ? '/' . $this->request->getVar('name') : $this->request->getVar('name');
		$path = 'default' . urldecode($name);
		$googleCloudStorage = new GoogleCloudStorage();
		$storage = $googleCloudStorage->storage();
		$bucketName = empty($_ENV['gcs_bucket_name']) ? 'friday-storage' : $_ENV['gcs_bucket_name'];
		$bucket = $storage->bucket($bucketName);
		try {
			$object = $bucket->object($path);
			$content = $object->downloadAsString();

			return $content;
		} catch (\Exception $e) {
			return '';
		}
	}
}
