<?php

namespace App\Controllers;


use App\Models\UserModel;

class User extends ErpController
{

	/**
	 * User's setting.
	 */
	public function setting($name): \CodeIgniter\HTTP\Response
	{
		$value = $this->request->getPost('value');
		if (empty($name)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		try {
			if ($value == "true" || $value == "false") {
				$value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
			}
			preference($name, $value);
		} catch (\Exception $e) {
			return $this->failNotFound($e->getMessage());
		}
		return $this->respond(preference($name), 200, 'update_success');
	}

	public function changePwd(): \CodeIgniter\HTTP\Response
	{
		$rules = [
			'currentPassword' => 'required',
			'password' => 'required',
		];
		if (!$this->validate($rules)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}

		$currentPwd = $this->request->getPost('currentPassword');
		$password = $this->request->getPost('password');
		$credentials = [
			'password' => $currentPwd,
			'username' => user()->username
		];
		$auth = service('authentication');
		$user = $auth->validate($credentials, true);
		if (!$user) {
			return $this->failValidationErrors('current_password_incorrect');
		}
		$user->password = $password;
		$users = model(UserModel::class);
		try {
			$users->save($user);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
		return $this->respond(ACTION_SUCCESS);
	}

	public function validateCurrentPwd(): \CodeIgniter\HTTP\Response
	{
		$rules = ['currentPassword' => 'required'];
		if (!$this->validate($rules)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		$currentPwd = $this->request->getPost('currentPassword');
		$credentials = [
			'password' => $currentPwd,
			'username' => user()->username
		];
		$auth = service('authentication');

		return $this->respond($auth->validate($credentials));
	}

	/**
	 * @throws \Exception
	 */
	protected function _getUserPublicInformation($identity)
	{
		$modules = \Config\Services::modules('users');
		$userModel = model(UserModel::class);
		$info = $userModel->getPublicInformation($identity);
		if (!$info) throw new \Exception(NOT_FOUND);
		return handleDataBeforeReturn($modules, $info, false, function ($rawItem, $item) {
			$item['avatar'] = $rawItem['avatar'];
			return $item;
		});
	}

	public function get_get($identity): \CodeIgniter\HTTP\Response
	{
		try {
			$info = $this->_getUserPublicInformation($identity);
		} catch (\Exception $e) {
			return $this->failNotFound(NOT_FOUND);
		}
		return $this->respond($info);
	}

	public function profile_get(): \CodeIgniter\HTTP\Response
	{
		try {
			$info = $this->_getUserPublicInformation(user_id());
		} catch (\Exception $e) {
			return $this->failNotFound(NOT_FOUND);
		}
		return $this->respond($info);
	}

	public function update_post(): \CodeIgniter\HTTP\Response
	{
		$getPost = $this->request->getPost();
		$modules = \Config\Services::modules('users');
		$userModel = model(UserModel::class);
		$userFields = ['id', 'full_name', 'email', 'phone', 'dob', 'gender'];
		$getPost['id'] = user_id();
		$dataHandleUser = handleDataBeforeSave($modules, $getPost, [], $userFields);
		if (!empty($dataHandleUser['validate'])) {
			$validation = \Config\Services::validation();
			if (!$validation->reset()->setRules($dataHandleUser['validate'])->run($dataHandleUser['data'])) {
				$this->failValidationErrors(json_encode($validation->getErrors()));
			}
		}
		$entityUser = new \App\Entities\User();
		$saveUser = $dataHandleUser['data'];
		$entityUser->fill($saveUser);
		try {
			$userModel->save($entityUser);
		} catch (\ReflectionException $e) {
			return $this->failValidationErrors($e->getMessage());
		}
		return $this->respondUpdated(ACTION_SUCCESS);
	}


	/**
	 * @throws \ReflectionException
	 */
	public function avatar(): \CodeIgniter\HTTP\Response
	{
		$avatar = $this->request->getPost('avatar');
		$id = user_id();
		if ($avatar) {
			try {
				helper('user');
				$savePath = _uploadAvatar($id, $avatar);
				$userModel = model(UserModel::class);
				$userModel->setAllowedFields(['avatar'])->update($id, ['avatar' => $savePath]);
			} catch (\Exception $e) {
				return $this->fail($e->getMessage());
			}
		}
		return $this->respondUpdated(ACTION_SUCCESS);
	}

	public function save_device_token_post()
	{
		$modules = \Config\Services::modules('users');
		$userModel = model(UserModel::class);
		$postData = $this->request->getPost();
		$userId = user_id();
		$userInfo = $userModel->asArray()->find($userId);

		if (empty($postData['token'])) return $this->respond(ACTION_SUCCESS);

		$arrDeviceToken = (empty($userInfo['device_token'])) ? [] : json_decode($userInfo['device_token'], true);

		//Check for auto logout - if someone is auto logout,then other login on same pc,we remove token from previous user
		/*$checkTokenExist = $userModel->select(['id', 'device_token'])->asArray()->like('device_token', $postData['token'])->where('id !=',$userId)->findAll();
		if(!empty($checkTokenExist)){
			foreach ($checkTokenExist as $userExist) {
				//$userExist['devide']

			}
		}

		exit;*/
		$allowSave = true;
		foreach ($arrDeviceToken as $rowDeviceToken) {
			if ($rowDeviceToken['token'] == $postData['token']) {
				$allowSave = false;
				break;
			}
		}

		if ($allowSave) {
			array_push($arrDeviceToken, [
				'token' => $postData['token'],
				'created_at' => date('Y-m-d H:i:s')
			]);
			$dataSave = [
				'id' => $userId,
				'device_token' => json_encode($arrDeviceToken)
			];
			$userModel->setAllowedFields(array_keys($dataSave));
			$userModel->save($dataSave);
		}

		return $this->respond(ACTION_SUCCESS);
	}
}
