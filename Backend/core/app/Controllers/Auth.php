<?php

namespace App\Controllers;

use App\Models\SettingModel;
use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
{
	protected $auth;
	/**
	 * @var BackAuth
	 */
	protected $config;

	/**
	 * @var \CodeIgniter\Session\Session
	 */
	protected $session;

	public function __construct()
	{
		// Most services in this controller require
		// the session to be started - so fire it up!
		$this->session = service('session');
		$this->config = config('Auth');
		$this->auth = service('authentication');
	}

	//--------------------------------------------------------------------
	// Login/out
	//--------------------------------------------------------------------

	/**
	 * Attempts to verify the user's credentials
	 * through a POST request.
	 */
	public function login()
	{
		$rules = [
			'login' => 'required',
			'password' => 'required',
		];
		if ($this->config->validFields == ['email']) {
			$rules['login'] .= '|valid_email';
		}
		if (!$this->validate($rules)) {
			return $this->failValidationErrors('missing_field_require_or_validate_error');
		}

		$login = $this->request->getPost('login');
		$password = $this->request->getPost('password');
		$remember = $this->request->getPost('remember') === 'true';


		// Determine credential type
		$type = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

		// Try to log them in...
		if (!$this->auth->attempt([$type => $login, 'password' => $password], $remember)) {
			return $this->failUnauthorized($this->auth->error() ?? 'wrong_credentials');
		}

		// Is the user being forced to reset their password?
		if ($this->auth->user()->force_pass_reset === true) {
			return $this->failUnauthorized('force_pass_reset');
		}


		$response = [];
		$response['accessToken'] = $this->auth->token();
		$response['refreshToken'] = $this->auth->getRefreshToken();
		$response['userData'] = $this->auth->user();
		$userPermits = $this->auth->user()->permissions;

		$permits = [];
		if (in_array('sys.superpower', $userPermits)) {
			$permits = [
				[
					'action' => 'manage',
					'subject' => 'all'
				]
			];
		} else {

			foreach ($userPermits as $item) {
				if (strpos($item, 'modules') === 0 || strpos($item, 'custom') === 0) {
					$permitArray = explode(".", $item);
					$permitName = implode('.', array_slice($permitArray, 2));
					$permitModule = $permitArray[1];
				} else {
					$permitArray = explode(".", $item);
					$permitName = implode('.', array_slice($permitArray, 1));
					$permitModule = $permitArray[0];
				}
				$permits[] = [
					'action' => $permitName,
					'subject' => $permitModule
				];
			}
		}
		$permits[] = [
			'action' => 'login',
			'subject' => 'app'
		];
		$response['permits'] = $permits;
		$response['roles'] = $this->auth->user()->roles;
		$response['re'] = $remember;
		if (!function_exists('dataInit')) {
			helper('app');
		}
		$response['init'] = dataInit();
		$modules = modulesList();
		$listRoutes = array();
		$moduleServices = service('modules');
		foreach ($modules as $item) {
			if ($r = $moduleServices->getRoutes($item->name)) {
				foreach ($r as $routeKey => $routeItem) {
					$r[$routeKey]->routePath = str_replace($moduleServices->getRouteModuleNameVar(), str_replace('_', '-', decamelize($item->name)), $r[$routeKey]->routePath);
				}
				$listRoutes = array_merge($listRoutes, $r);
			}
		}
		$routeModuleNames = array_column($listRoutes, 'name');
		$routeModuleOrders = array_column($listRoutes, 'order');
		array_multisort($routeModuleNames, SORT_ASC, $routeModuleOrders, SORT_ASC, $listRoutes);


		$response['modules'] = $listRoutes;
		if (!function_exists('modulesConstructs')) {
			helper('app');
		}
		$modulesConstructs = modulesConstructs();
		$response['init']['modules'] = $modulesConstructs['modules'];
		$response['init']['optionsModules'] = $modulesConstructs['optionsModules'];
		$response['init']['filters'] = $modulesConstructs['filters'];
		$response['init']['routes'] = $listRoutes;


		return $this->respond($response, 200, 'login_success');
	}


	/**
	 * Refresh token
	 */
	public function refreshToken()
	{
		$request = $this->request->getJSON();
		$refreshToken = $request->refreshToken;

		if (!$refreshToken) {
			return $this->failUnauthorized('invalid_refresh_token');
		}
		$token = $this->auth->refreshToken($refreshToken);
		if (!$token) return $this->failUnauthorized('invalid_refresh_token');
		return $this->respond($token, 200, 'refresh_token_success');
	}

	/**
	 * Log the user out.
	 */
	public function logout()
	{
		if ($this->auth->check()) {
			$this->auth->logout();
		}

		return redirect()->to(site_url('/'));
	}


	//--------------------------------------------------------------------
	// Forgot Password
	//--------------------------------------------------------------------

	/**
	 * Attempts to find a user account with that password
	 * and send password reset instructions to them.
	 */
	public function forgotPassword()
	{
		if ($this->config->activeResetter === false) {
			return $this->failForbidden('forgot_password_disabled', null, 'forgot_password_disabled');
		}

		$users = model(UserModel::class);

		$user = $users->where('email', $this->request->getPost('email'))->first();

		if (is_null($user)) {
			return $this->failNotFound('user_not_found');
		}
		// Save the reset hash /
		$user->generateResetHash();
		$users->save($user);
		$resetter = service('resetter');
		$sent = $resetter->send($user);

		if (!$sent) {
			return $this->failServerError($resetter->error());
			//return redirect()->back()->withInput()->with('error', $resetter->error() ?? lang('Auth.unknownError'));
		}

		return $this->respond('success');
	}


	public function validateResetToken()
	{
		if ($this->config->activeResetter === false) {
			return $this->failForbidden('reset_password_disabled', null, 'reset_password_disabled');
		}
		$users = model(UserModel::class);

		$rules = [
			'token' => 'required'
		];

		if (!$this->validate($rules)) {
			return $this->failValidationErrors('token_required');
		}

		$decodeData = base64_decode($this->request->getPost('token'));
		$data = explode('&', $decodeData);
		$hash = $data[0];
		$email = $data[1];
		if (empty($hash) || empty($email)) {
			return $this->failValidationErrors('token_error');
		}

		$user = $users->where('email', $email)
			->where('reset_hash', $this->request->getPost('token'))
			->first();
		if (is_null($user)) {
			return $this->failNotFound('token_not_found');
		}
		return $this->respond($user);
	}


	/**
	 * Verifies the code with the email and saves the new password,
	 * if they all pass validation.
	 *
	 * @return mixed
	 */
	public function resetPassword()
	{
		if ($this->config->activeResetter === false) {
			return $this->failForbidden('reset_password_disabled', null, 'reset_password_disabled');
		}

		$users = model(UserModel::class);


		$rules = [
			'token' => 'required',
			'password' => 'required'
		];

		if (!$this->validate($rules)) {
			return $this->failValidationErrors('token_or_password_missing');
		}
		$decodeData = base64_decode($this->request->getPost('token'));
		$data = explode('&', $decodeData);
		$hash = $data[0];
		$email = $data[1];
		if (empty($hash) || empty($email)) {
			return $this->failValidationErrors('token_error');
		}
		// First things first - log the reset attempt.
		$users->logResetAttempt(
			$email,
			$this->request->getPost('token'),
			$this->request->getIPAddress(),
			(string)$this->request->getUserAgent()
		);

		$user = $users->where('email', $email)
			->where('reset_hash', $this->request->getPost('token'))
			->first();

		if (is_null($user)) {
			return $this->failNotFound('user_not_found');
		}

		// Reset token still valid?
		if (!empty($user->reset_expires) && time() > $user->reset_expires->getTimestamp()) {
			return $this->failValidationErrors('reset_token_expired');
		}

		// Success! Save the new password, and cleanup the reset hash.
		$user->password = $this->request->getPost('password');
		$user->reset_hash = null;
		$user->reset_at = date('Y-m-d H:i:s');
		$user->reset_expires = null;
		$user->force_pass_reset = false;
		$users->save($user);
		return $this->respond('success');
	}

	public function validateActiveToken()
	{
		$users = model(UserModel::class);

		$rules = [
			'token' => 'required'
		];

		if (!$this->validate($rules)) {
			return $this->failValidationErrors('token_required');
		}

		$user = $users->where('activate_hash', $this->request->getGet('token'))
			->where('active', 0)
			->first();
		if (is_null($user)) {
			return $this->failNotFound('token_not_found');
		}
		return $this->respond([
			'email' => $user->email,
			'username' => $user->username
		]);
	}


	/**
	 * Activate account.
	 *
	 * @return mixed
	 */
	public function activateAccount()
	{
		$users = model(UserModel::class);
		$rules = [
			'token' => 'required',
			'password' => 'required'
		];

		if (!$this->validate($rules)) {
			return $this->failValidationErrors('token_or_password_missing');
		}

		// First things first - log the activation attempt.
		$users->logActivationAttempt(
			$this->request->getPost('token'),
			$this->request->getIPAddress(),
			(string)$this->request->getUserAgent()
		);

		$throttler = service('throttler');

		if ($throttler->check($this->request->getIPAddress(), 2, MINUTE) === false) {
			return service('response')->setStatusCode(429)->setBody(lang('Auth.tooManyRequests', [$throttler->getTokentime()]));
		}

		$user = $users->where('activate_hash', $this->request->getPost('token'))
			->where('active', 0)
			->first();
		if (is_null($user)) {
			return $this->failNotFound('user_not_found');
		}

		$user->activate();
		$user->account_status = 'activated';
		//If exits module employee,update employee status
		try {
			$module = \Config\Services::modules('employees');
			$employeeData = $module->model->find($user->id);
			if ($employeeData) {
				$employeeData->account_status = 3;
				$module->model->setAllowedFields(['account_status'])->save($employeeData);
			}
		} catch (\Exception $e) {
		}
		$user->password = $this->request->getPost('password');
		$users->save($user);

		return $this->respond('success');
	}

	/**
	 * Resend activation account.
	 *
	 * @return mixed
	 */
	public function resendActivateAccount()
	{
		if ($this->config->requireActivation === false) {
			return $this->failForbidden('activation_is_disabled', null, 'activation_is_disabled');
		}

		$throttler = service('throttler');

		if ($throttler->check($this->request->getIPAddress(), 2, MINUTE) === false) {
			return service('response')->setStatusCode(429)->setBody(lang('Auth.tooManyRequests', [$throttler->getTokentime()]));
		}

		$login = urldecode($this->request->getGet('login'));
		$type = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

		$users = model(UserModel::class);

		$user = $users->where($type, $login)
			->where('active', 0)
			->first();

		if (is_null($user)) {
			return $this->failNotFound('user_not_found');
		}

		$activator = service('activator');
		$sent = $activator->send($user);

		if (!$sent) {
			return $this->failServerError($activator->error());
		}

		// Success!
		return $this->respond('success');
	}


	/**
	 * User's profile for authentication on each request.
	 */
	public function profile()
	{
		if (!$this->auth->check()) {
			return $this->failUnauthorized('invalid_auth_token');
		}

		$response['userData'] = $this->auth->user();
		$userPermits = $this->auth->user()->permissions;

		$permits = [];
		if (in_array('sys.superpower', $userPermits)) {
			$permits = [
				[
					'action' => 'manage',
					'subject' => 'all'
				]
			];
		} else {
			foreach ($userPermits as $item) {
				if (strpos($item, 'modules') === 0 || strpos($item, 'custom') === 0) {
					$permitArray = explode(".", $item);
					$permitName = implode('.', array_slice($permitArray, 2));
					$permitModule = $permitArray[1];
				} else {
					$permitArray = explode(".", $item);
					$permitName = implode('.', array_slice($permitArray, 1));
					$permitModule = $permitArray[0];
				}
				$permits[] = [
					'action' => $permitName,
					'subject' => $permitModule
				];
			}
		}
		$permits[] = [
			'action' => 'login',
			'subject' => 'app'
		];
		$response['permits'] = $permits;
		$response['roles'] = $this->auth->user()->roles;
		helper('app');
		$response['init'] = dataInit();
		$modules = modulesList();
		$listRoutes = array();
		$moduleServices = \Config\Services::modules();
		foreach ($modules as $item) {
			if ($r = $moduleServices->getRoutes($item->name)) {
				foreach ($r as $routeKey => $routeItem) {
					$r[$routeKey]->routePath = str_replace($moduleServices->getRouteModuleNameVar(), str_replace('_', '-', decamelize($item->name)), $r[$routeKey]->routePath);
				}
				$listRoutes = array_merge($listRoutes, $r);
			}
		}
		$routeModuleNames = array_column($listRoutes, 'name');
		$routeModuleOrders = array_column($listRoutes, 'order');
		array_multisort($routeModuleNames, SORT_ASC, $routeModuleOrders, SORT_ASC, $listRoutes);

		$response['modules'] = $listRoutes;
		if (!function_exists('modulesConstructs')) {
			helper('app');
		}

		/*Quick access*/
		helper('preference');
		$quick_access = $this->request->getPost('quick_access');
		if (empty($quick_access) || $quick_access == 'null') {
			preference("quick_access", []);
		} else {
			preference("quick_access", json_decode($quick_access, true));
		}

		$modulesConstructs = modulesConstructs();
		$response['init']['modules'] = $modulesConstructs['modules'];
		$response['init']['filters'] = $modulesConstructs['filters'];
		$response['init']['optionsModules'] = $modulesConstructs['optionsModules'];
		$response['init']['routes'] = $listRoutes;

		$userNotification = $this->_getUserNotification();
		$response['list_notification'] = $userNotification['list_notification'];
		$response['number_notification'] = $userNotification['number_notification'];

		return $this->respond($response, 200, 'data_found');
	}


	public function setting()
	{
		$settingModel = new SettingModel();
		$listSettings = $settingModel->getDefaultSettings();
		$response = [
			'settings' => [],
			'routes' => []
		];
		$settings = [];
		$listRoutes = [];
		helper('preferences');
		foreach ($listSettings as $item) {
			if ($item->secret == 1) continue;
			$keyName = ($item->class === 'Preferences') ? $item->key : $item->class . '.' . $item->key;
			$settings[$keyName] = preference($keyName);
		}
		helper('app');
		$modules = modulesList();

		$moduleServices = \Config\Services::modules();
		foreach ($modules as $item) {
			if ($r = $moduleServices->getRoutes($item->name)) {
				$publicArray = $r;
				foreach ($r as $routeKey => $routeItem) {
					$publicArray[$routeKey]->routePath = str_replace($moduleServices->getRouteModuleNameVar(), str_replace('_', '-', decamelize($item->name)), $r[$routeKey]->routePath);
					if (!$routeItem->isPublic) {
						unset($publicArray[$routeKey]);
					}
				}
				$listRoutes = array_merge($listRoutes, $publicArray);
			}
		}
		$response = [
			'settings' => $settings,
			'routes' => $listRoutes
		];
		return $this->respond($response, 200, 'data_found');
	}

	private function _getUserNotification()
	{
		$notification = \Config\Services::notifications();
		$modules = \Config\Services::modules('users');
		$model = $modules->model;
		$listUser = $model->select([
			'id',
			'username',
			'full_name',
			'email',
			'avatar'
		])
			->asArray()
			->findAll();
		$arrUser = [];
		foreach ($listUser as $rowUser) {
			$arrUser[$rowUser['id']] = $rowUser;
		}
		$userId = user_id();
		$listNotification  = $notification->list($userId);
		$result = [];
		foreach ($listNotification as $key => $val) {
			$dataPush = $val;
			unset($dataPush['recipient_id']);
			unset($dataPush['read_by']);
			$dataPush['sender_id'] = isset($arrUser[$val['sender_id']]) ? $arrUser[$val['sender_id']] : [];
			$dataPush['seen'] = false;
			if (!empty($val['read_by'])) {
				$a = array_search($userId, json_decode($val['read_by'], true));
				if ($a || $a === 0) {
					$dataPush['seen'] = true;
				}
			}
			$result[] = $dataPush;
		}
		$listNotification = $listNotification;
		$numberNotification = $notification->getNotificationNumber($userId);

		return [
			'list_notification' => $result,
			'number_notification' => $numberNotification
		];
	}
}
