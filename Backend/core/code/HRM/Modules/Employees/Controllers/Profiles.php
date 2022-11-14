<?php

namespace HRM\Modules\Employees\Controllers;

use App\Models\UserModel;

class Profiles extends Employee
{

	public function __construct()
	{
		parent::__construct();
		$this->linkedModules['contracts']['permits'] = [
			'view' => 'custom.profile.viewContracts',
			'update' => 'custom.profile.updateContracts'
		];
		$this->linkedModules['educations']['permits'] = [
			'view' => 'custom.profile.viewEducations',
			'update' => 'custom.profile.updateEducations'
		];
		$this->linkedModules['dependents']['permits'] = [
			'view' => 'custom.profile.viewDependents',
			'update' => 'custom.profile.updateDependents'
		];
		$this->linkedModules['documents']['permits'] = [
			'view' => 'custom.profile.viewDocuments',
			'update' => 'custom.profile.updateDocuments',
		];
		$this->linkedModules['employee_histories']['permits'] = [
			'view' => '',
			'update' => ''
		];
	}

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
		$users->save($user);
		return $this->respond(ACTION_SUCCESS);
	}

	public function validateCurrentPwd()
	{
		$rules = [
			'currentPassword' => 'required',

		];
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

	///Employee data
	public function profile_get()
	{
		$data = $this->getEmployee(user_id());
		if (!$data) return $this->failNotFound(NOT_FOUND);
		return $this->respond($data);
	}

	public function update_post()
	{
		$getPost = $this->request->getPost();
		try {
			if ($this->updateEmployee(user_id(), $getPost)) {
				return $this->respondUpdated(ACTION_SUCCESS);
			} else {
				return $this->fail(FAILED_SAVE);
			}
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
	}


	public function avatar()
	{
		$avatar = $this->request->getPost('avatar');
		if ($avatar) {
			try {
				$this->uploadAvatar(user_id(), $avatar);
			} catch (\Exception $e) {
				return $this->failValidationErrors($e->getMessage());
			}
		}
	}

	public function documents_get()
	{
		if (!hasPermission($this->linkedModules['documents']['permits']['view'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		$files = $this->getDocuments(user_id());
		return $this->respond($files);
	}

	public function documents_post()
	{
		$filesData = $this->request->getFiles();
		if (!hasPermission($this->linkedModules['documents']['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		try {
			$paths = $this->postDocuments(user_id(), $filesData);
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
		return $this->respond($paths);
	}

	public function documents_delete($file)
	{
		if (!hasPermission($this->linkedModules['documents']['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		if (empty($file)) return $this->failValidationErrors(VALIDATE_DATA_ERROR);
		$this->deleteDocuments(user_id(), $file);
		return $this->respond(ACTION_SUCCESS);
	}

	public function related_get($module, $recordId = null)
	{
		if (!hasPermission($this->linkedModules[$module]['permits']['view'])) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		if (!empty($recordId)) {
			$data = $this->getLinkedDetail($module, user_id(), $recordId);
			if ($data) return $this->respond([
				'data' => $data,
				'files_upload_module' => []
			]);
			else return $this->failNotFound(NOT_FOUND);
		} else {
			$getGet = $this->request->getGet();
			$data = $this->getLinkedList($module, user_id(), $getGet);
			return $this->respond($data);
		}
	}

	public function related_post($module)
	{
		if (!hasPermission($this->linkedModules[$module]['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		$getPost = $this->request->getPost();
		$getPost[$this->linkedModules[$module]['linked_field']] = user_id();
		try {
			$this->saveLinkedData($module, user_id(), $getPost);
		} catch (\Exception $e) {
			return $this->failForbidden($e->getMessage());
		}
		return $this->respondCreated(ACTION_SUCCESS);
	}

	public function related_delete($module, $dataId)
	{
		if (!hasPermission($this->linkedModules[$module]['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		if ($this->deleteLinkedData($module, user_id(), $dataId)) return $this->respond(ACTION_SUCCESS);
		else return $this->failNotFound(NOT_FOUND);
	}


	public function create_google_access_token_post()
	{
		$modules = \Config\Services::modules();

		$googleService = \App\Libraries\Google\Config\Services::google();
		$googleClient = $googleService->client();

		$data = $this->request->getPost();

		$redirectUri = 'http://localhost:3000';
		$googleClient->setRedirectUri($redirectUri);
		$token = $googleClient->fetchAccessTokenWithAuthCode($data['code']);
		// save access token to user
		$result = $googleService->handleInsertToken($modules, $token);
		if ($result != true) {
			return $this->fail($result);
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_user_access_token_get()
	{
		$googleService = \App\Libraries\Google\Config\Services::google();
		[$accessToken, $refreshToken] = $googleService->getUserAccessToken();
		$resultSync = $googleService->getInfoUserSyncedGoogle();
		return $this->respond([
			'synced' => $resultSync['synced'],
			'sync_calendar_status' => $resultSync['sync_calendar_status'],
			'sync_drive_status' => $resultSync['sync_drive_status'],
			'access_token' => $accessToken
		]);
	}

	public function get_google_account_info_get()
	{
		$googleService = \App\Libraries\Google\Config\Services::google();
		$oauth2 = $googleService->oauth2();

		return $this->respond([
			'account_info' => $oauth2->getAccountInfo()
		]);
	}

	public function sign_out_google_post()
	{
		$userId = user_id();

		$modules = \Config\Services::modules('users');
		$model = $modules->model;

		$updateData = [
			'id' => $userId,
			'google_linked' => ''
		];

		$model->setAllowedFields(array_keys($updateData));
		$model->save($updateData);

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_user_info_get()
	{
		$userId = user_id();

		// get google user
		$modules = \Config\Services::modules('users');
		$model = $modules->model;
		$userInfo = $model
			->asArray()
			->select(['id', 'google_linked'])
			->where('id', $userId)
			->first();
		$googleLinked = !empty($userInfo['google_linked']) ? json_decode($userInfo['google_linked'], true) : [];

		$result['synced'] = count($googleLinked) > 0;
		$result['sync_calendar_status'] = isset($googleLinked['sync_calendar_status']) ? ($googleLinked['sync_calendar_status'] == 1) : false;
		$result['sync_drive_status'] = isset($googleLinked['sync_drive_status']) ? ($googleLinked['sync_drive_status'] == 1) : false;

		return $this->respond($result);
	}

	public function update_sync_status_post()
	{
		$modules = \Config\Services::modules('users');
		$model = $modules->model;

		$currentUser = user();
		$googleLinked = json_decode($currentUser->google_linked, true);
		$data = $this->request->getPost();

		$googleLinked[$data['name']] = $data['status'];

		$arrUpdateData = [
			'id' => $currentUser->id,
			'google_linked' => json_encode($googleLinked)
		];

		$model->setAllowedFields(array_keys($arrUpdateData));
		$model->save($arrUpdateData);

		return $this->respond(ACTION_SUCCESS);
	}
}
