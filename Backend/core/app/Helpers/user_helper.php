<?php

use App\Entities\User;
use App\Models\UserModel;
use Myth\Auth\Authorization\GroupModel;

if (!function_exists('addUser')) {
	/**
	 * @throws Exception
	 */
	function addUser($data, $setPwd = false, $addUserToDefaultGroup = true, $addUserToGroups = []): bool
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$getPost = $data;
		$modules->setModule('users');
		$dataHandleUser = handleDataBeforeSave($modules, $getPost);
		if (!empty($dataHandleUser['validate'])) {
			if (!$validation->reset()->setRules($dataHandleUser['validate'])->run($dataHandleUser['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		$entityUser = new User();
		$userModel = new UserModel();
		$saveUser = $dataHandleUser['data'];
		$entityUser->generateActivateHash();
		$entityUser->fill($saveUser);
		if ($setPwd && !empty($getPost['password'])) {
			$entityUser->password = $getPost['password'];
			$entityUser->activate();
		}
		try {
			$userModel->save($entityUser);
		} catch (\Exception $e) {
			throw new Exception(json_encode($e->getMessage()));
		}
		$id = $userModel->getInsertID();
		$saveUser['id'] = $id;
		$groupModel = new GroupModel();
		if ($addUserToDefaultGroup) {
			$defaultGroup = $groupModel->where('default', TRUE)->first();
			$addUserToGroups[] = $defaultGroup->id;
		}
		if(!empty($addUserToGroups)){
			foreach ($addUserToGroups as $groupId) {
				$groupModel->addUserToGroup($id, $groupId);
			}
		}


		if (filter_var($getPost['invitation_active'], FILTER_VALIDATE_BOOLEAN) === true) {
			$activator = service('activator');
			if ($activator->send($entityUser)) {
				$saveUser['account_status'] = 'invited';
				$entityUser->fill($saveUser);
				try {
					$userModel->save($entityUser);
				} catch (\ReflectionException $e) {
					throw new Exception(json_encode($e->getMessage()));
				}
			}
		}
		return true;
	}
}

if (!function_exists('updateUser')) {
	/**
	 * @throws Exception
	 */
	function updateUser($data): bool
	{
		$modules = \Config\Services::modules('users');
		$validation = \Config\Services::validation();
		$updateUser = false;
		$dataHandleUser = handleDataBeforeSave($modules, $data);
		if (!empty($dataHandleUser['validate'])) {
			if (!$validation->reset()->setRules($dataHandleUser['validate'])->run($dataHandleUser['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		$entityUser = new \App\Entities\User();
		$userModel = new UserModel();
		$saveUser = $dataHandleUser['data'];
		$entityUser->fill($saveUser);
		try {
			$userModel->save($entityUser);
		} catch (\ReflectionException $e) {
			return false;
		}
		return true;
	}
}

if (!function_exists('deleteUser')) {
	function deleteUser($ids): bool
	{
		$userModel = new UserModel();
		$ids = explode(',', $ids);
		foreach ($ids as $id) {
			$userModel->delete($id);
		}
		return true;
	}
}

if (!function_exists('uploadAvatar')) {
	/**
	 * @throws Exception
	 */
	function _uploadAvatar($id, $avatar)
	{
		if ($avatar) {
			if (preg_match('/^data:image\/(\w+);base64,/', $avatar, $type)) {
				$uploadService = \App\Libraries\Upload\Config\Services::upload();
				$data = substr($avatar, strpos($avatar, ',') + 1);
				$mime_type = getimagesize($avatar);
				$type = strtolower($type[1]); // jpg, png, gif
				if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
					throw new Exception(FILE_NOT_ALLOWED);
				}
				$data = str_replace(' ', '+', $data);
				$data = base64_decode($data);
				if (!$data) {
					throw new Exception(FILE_CORRUPTED);
				}
				$filePath = WRITEPATH . 'uploads/avatars/' . $id;
				if (!is_dir($filePath)) mkdir($filePath, 0777, true);
				$name = $id . "_avatar";
				$avatarName = $filePath . '/' . $name;
				$tempImage = tmpfile();
				fwrite($tempImage, $data);
				$fileName = stream_get_meta_data($tempImage)['uri'];
				$image = \Config\Services::image();
				$webpPath = $avatarName . '.' . 'webp';
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
				$storePath = $filePath . '/';
				$path = '/avatars/' . $id . '/';
				$uploadService->uploadFile($path, $filesUpload, true);

				return 'avatars/' . $id . '/' . $id . "_avatar.webp";
			} else {
				throw new Exception(FILE_CORRUPTED);
			}
		}
	}
}