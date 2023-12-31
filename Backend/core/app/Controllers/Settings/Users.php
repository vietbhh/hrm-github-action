<?php

namespace App\Controllers\Settings;

use App\Controllers\ErpController;
use App\Models\SettingModel;
use App\Models\UserModel;

class Users extends ErpController
{
	public function initController(\CodeIgniter\HTTP\RequestInterface $request, \CodeIgniter\HTTP\ResponseInterface $response, \Psr\Log\LoggerInterface $logger)
	{
		parent::initController($request, $response, $logger); // TODO: Change the autogenerated stub
		helper('user');
	}

	/*
	 * load user list from setting
	 */
	public function load_get()
	{
		$module = \Config\Services::modules("users");
		if (!hasPermission('users.manage')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$model = new UserModel();
		$model = $model->select(['id', 'email', 'username', 'full_name', 'active', 'account_status', 'phone', 'dob', 'avatar', 'gender', 'office', 'group_id', 'job_title_id', 'department_id']);
		$data = $this->request->getGet();
		$result = loadDataWrapper($module, $model, $data, false);
		$result['results'] = handleDataBeforeReturn($module, $result['results'], true, function ($rawItem, $item) {
			$item['avatar'] = $rawItem['avatar'];
			$item['active'] = filter_var($rawItem['active'], FILTER_VALIDATE_BOOLEAN);
			return $item;
		});
		return $this->respond($result);
	}

	/*
	 * get user detail from setting
	 */
	public function detail_get($identity)
	{
		$module = \Config\Services::modules("users");
		if (!hasPermission('users.manage')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$model = new UserModel();
		$whereKey = 'id';
		if (!is_numeric($identity)) {
			$whereKey = 'username';
		}
		$info = $model->select(['id', 'email', 'username', 'full_name', 'active', 'account_status', 'phone', 'dob', 'avatar', 'gender', 'office', 'group_id', 'job_title_id', 'department_id'])->asArray()->where($whereKey, $identity)->first();
		if (!$info) {
			return $this->failNotFound(NOT_FOUND);
		}
		$data = handleDataBeforeReturn($module, $info, false, function ($rawItem, $item) {
			$item['avatar'] = $rawItem['avatar'];
			$item['active'] = filter_var($rawItem['active'], FILTER_VALIDATE_BOOLEAN);
			return $item;
		});
		return $this->respond($data);
	}

	/*
	 * Save update user from core user setting
	 */
	public function save_post()
	{
		$getPost = $this->request->getPost();
		if (!hasPermission('users.manage')) {
			return $this->failForbidden(MISSING_PERMISSION);
		}
		try {
			if (isset($getPost['id']) && !empty(isset($getPost['id']))) {
				if ($action = updateUser($getPost)) return $this->respondUpdated($getPost['id']);
			} else {
				if ($action = addUser($getPost, true)) return $this->respondCreated();
			}
			if (!$action) return $this->fail(FAILED_SAVE);
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
	}

	/**
	 * @throws \Exception
	 * Change user password api
	 */
	public function changePwd_post($id)
	{
		$validation = \Config\Services::validation();
		if (!hasPermission('users.manage')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$model = new UserModel();
		$user = $model->find($id);
		if (!$user) {
			return $this->failNotFound(NOT_FOUND);
		}
		if (!$validation->reset()->setRules([
			'password' => 'required|min_length[6]',
		])->withRequest($this->request)->run()) {
			throw new \Exception(json_encode($validation->getErrors()));
		}
		if (!empty($this->request->getPost('password'))) {
			$user->password = $this->request->getPost('password');
		}
		try {
			$model->save($user);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
		return $this->respond(ACTION_SUCCESS);
	}

	/*
	 * user action : activate || deactivate
	 */
	public function action_get($id, $type)
	{
		if (!hasPermission('users.manage')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$model = new UserModel();
		$user = $model->find($id);
		if (!$user) {
			return $this->failNotFound(NOT_FOUND);
		}
		if ($type === 'activate') {
			$settingModel = new SettingModel();
			$listSettings = $settingModel->getDefaultSettings();
			$isForceOnboard = false;
			foreach ($listSettings as $rowSetting) {
				if ($rowSetting->key === 'force_onboard') {
					$isForceOnboard = $rowSetting->value;
				}
			}
			$user->activate();
			if ($isForceOnboard === true) {
				$user->custom_fields = json_encode([
					'onboard' => true
				]);
			}
		}
		if ($type === 'deactivate') $user->deactivate();

		try {
			$model->save($user);
			\CodeIgniter\Events\Events::trigger('on_after_update_account_status_user', $user);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
		return $this->respond(ACTION_SUCCESS);
	}

	public function invite_get($id): \CodeIgniter\HTTP\Response
	{
		if (!hasPermission('users.manage')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$model = new UserModel();
		$userData = $model->find($id);
		if (!$userData) {
			return $this->failNotFound(NOT_FOUND);
		}
		$userData->generateActivateHash();
		$activator = service('activator');
		$sent = $activator->send($userData);
		if (!$sent) {
			return $this->failServerError($activator->error());
		} else {
			$userData->account_status = 'invited';
			try {
				$model->save($userData);
			} catch (\Exception $e) {
				return $this->failServerError($e->getMessage());
			}
		}
		return $this->respond('ACTION_SUCCESS');
	}

	/*
	 * delete user list from setting
	 */
	public function delete_delete($ids)
	{
		if (!hasPermission('users.manage')) return $this->failForbidden(MISSING_DELETE_PERMISSION);
		deleteUser($ids);
		return $this->respondDeleted(json_encode($ids));
	}
}
