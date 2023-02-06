<?php

namespace HRM\Modules\Employees\Controllers;

use App\Controllers\ErpController;
use App\Entities\User;
use App\Models\AppAutoNumberModel;
use App\Models\AppModel;
use App\Models\UserModel;
use Exception;
use HRM\Modules\Employees\Models\EmployeesModel;
use Myth\Auth\Authorization\GroupModel;
use stdClass;

class Employee extends ErpController
{
	protected $module;
	protected $model;

	protected $accountStatusConvert = [
		1 => 'uninvited',
		2 => 'invited',
		3 => 'activated',
		4 => 'deactivated'
	];

	protected $linkedModules = [
		'contracts' => [
			'linked_field' => 'employee',
			'permits' => []
		],
		'educations' => [
			'linked_field' => 'employee',
			'permits' => []
		],
		'dependents' => [
			'linked_field' => 'employee',
			'permits' => []
		],
		'employee_histories' => [
			'linked_field' => 'employee',
			'permits' => []
		],
	];

	public function __construct()
	{
		$this->module = \Config\Services::modules('employees');
		$this->model = $this->module->model;
	}

	protected function setModule($name)
	{
		$this->module->setModule($name);
		$this->model = $this->module->model;
	}

	protected function getEmployee($identity)
	{
		$whereKey = 'm_employees.id';
		if (!is_numeric($identity)) {
			$whereKey = 'm_employees.username';
		}
		$info = $this->model->asArray()->where($whereKey, $identity)->first();
		if (!$info) {
			return false;
		}

		$data = handleDataBeforeReturn($this->module, $info, false, function ($rawItem, $item) {
			$item['avatar'] = $rawItem['avatar'];
			return $item;
		});

		try {
			$disc_point = array_slice(json_decode($data['disc'], true), 0, 2);
		} catch (\Exception $e) {
			$disc_point = [];
		}
		$data['disc_point'] = $disc_point;

		return $data;
	}

	protected function loadEmployee($request): array
	{
		$modelName = 'employees';
		$module = \Config\Services::modules($modelName);
		$model = new EmployeesModel();
		$result = loadDataWrapper($module, $model, $request, false);
		$result['results'] = handleDataBeforeReturn($module, $result['results'], true, function ($rawItem, $item) {
			$item['avatar'] = $rawItem['avatar'];
			return $item;
		});
		return $result;
	}

	protected function handleInsert($model, $dataHandleUser, $dataHandleEmployee)
	{
		helper('app_select_option');
		$db = getDb();
		$db->transStart();

		$entityUser = new User();
		$userModel = new UserModel();
		$saveUser = $dataHandleUser;
		$entityUser->generateActivateHash();
		$entityUser->fill($saveUser);
		try {
			$userModel->save($entityUser);
		} catch (\Exception $e) {
			return false;
		}
		$id = $userModel->getInsertID();

		$saveUser['id'] = $id;
		$groupModel = new GroupModel();
		$group = $groupModel->where('default', TRUE)->first();
		$groupModel->addUserToGroup($id, $group->id);

		$appNumberModel = new AppAutoNumberModel();
		// Employees
		$number = $appNumberModel->getCurrentNumber('employees', 'employee_code');

		$dataHandleEmployee['users_id'] = $id;
		$dataHandleEmployee['id'] = $id;
		$dataHandleEmployee['employee_code'] = $number['active'] == 1 ? $number['result'] : ($dataHandleEmployee['employee_code'] ?? '');
		$saveEmployee = $dataHandleEmployee;
		if (!empty($saveEmployee['status'])) {
			$saveEmployee['status'] = getOptionValue("employees", "status", "onboarding");
		}
		if (!empty($saveEmployee['work_schedule'])) {
			$modulesWorkSchedule = \Config\Services::modules("work_schedules");
			$modelWorkSchedule = $modulesWorkSchedule->model;
			$workScheduleDefault = $modelWorkSchedule->where('default', 1)->first();
			$saveEmployee['work_schedule'] = $workScheduleDefault->id;
		}


		try {
			$model->save($saveEmployee);
		} catch (\ReflectionException $e) {
			return false;
		}
		$appNumberModel->increaseCurrentNumber(1);

		try {
			if (!empty($saveEmployee['department_id'])) {
				\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $saveEmployee);
			}
			$saveEmployee['id'] = $id;
			\CodeIgniter\Events\Events::trigger('after_insert_employee_event', $saveEmployee);
		} catch (\Exception $e) {
			throw new Exception($e);
		}

		$db->transComplete();
		if ($db->transStatus() === false) {
			return false;
		}

		$result['id'] = $id;
		$result['entityUser'] = $entityUser;
		$result['userModel'] = $userModel;
		$result['saveEmployee'] = $saveEmployee;
		$result['saveUser'] = $saveUser;

		return $result;
	}

	/**
	 * @throws Exception
	 */
	protected function addEmployee($data)
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
		$modules->setModule('employees');
		$model = $modules->model;
		$dataHandleEmployee = handleDataBeforeSave($modules, $getPost);

		if (!empty($dataHandleEmployee['validate'])) {
			if (!$validation->reset()->setRules($dataHandleEmployee['validate'])->run($dataHandleEmployee['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		$model->setAllowedFields($dataHandleEmployee['fieldsArray']);

		$handleInsert = $this->handleInsert($model, $dataHandleUser['data'], $dataHandleEmployee['data']);
		if ($handleInsert === false) {
			throw new Exception(FAILED_SAVE);
		}
		$id = $handleInsert['id'];
		$entityUser = $handleInsert['entityUser'];
		$userModel = $handleInsert['userModel'];
		$saveEmployee = $handleInsert['saveEmployee'];
		$saveUser = $handleInsert['saveUser'];

		if (filter_var($getPost['invitation_active'], FILTER_VALIDATE_BOOLEAN) === true) {
			$activator = service('activator');
			if ($activator->send($entityUser)) {
				//set account status to invited
				$saveEmployee['account_status'] = 2;
				try {
					$model->save($saveEmployee);
				} catch (\ReflectionException $e) {
					return false;
				}
				$saveUser['account_status'] = $this->accountStatusConvert[2];
				try {
					$userModel->save($saveUser);
				} catch (\ReflectionException $e) {
					return false;
				}
			}
		}

		return $id;
	}

	/**
	 * @throws Exception
	 */
	protected function updateEmployee($id, &$data, $fieldValidate = []): bool
	{
		$validation = \Config\Services::validation();
		$updateUser = false;
		$data['id'] = $id;
		$userFields = ['id', 'username', 'full_name', 'email', 'phone', 'dob', 'office', 'group_id', 'job_title_id', 'department_id'];
		$dataUser = [];
		foreach ($userFields as $item) {
			if (isset($data[$item]) && !empty($data[$item])) {
				if ($item !== 'id') {
					$updateUser = true;
				}
				$dataUser[$item] = $data[$item];
			}
		}
		if ($updateUser) {
			$this->setModule('users');
			$dataHandleUser = handleDataBeforeSave($this->module, $dataUser, [], array_keys($dataUser));
			if (!empty($dataHandleUser['validate'])) {
				if (!$validation->reset()->setRules($dataHandleUser['validate'])->run($dataHandleUser['data'])) {
					throw new Exception(json_encode($validation->getErrors()));
				}
			}
		}
		$this->setModule('employees');
		$fieldValidateEmployee = (count($fieldValidate) > 0) ? $fieldValidate : array_keys($data);
		$dataHandleEmployee = handleDataBeforeSave($this->module, $data, [], $fieldValidateEmployee);
		if (!empty($dataHandleEmployee['validate'])) {
			if (!$validation->reset()->setRules($dataHandleEmployee['validate'])->run($dataHandleEmployee['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		if ($updateUser) {
			$entityUser = new \App\Entities\User();
			$userModel = new UserModel();
			$saveUser = $dataHandleUser['data'];
			$entityUser->fill($saveUser);
			try {
				$userModel->save($entityUser);
			} catch (\ReflectionException $e) {
				return false;
			}
		}

		$saveEmployee = $dataHandleEmployee['data'];

		$this->model->setAllowedFields($dataHandleEmployee['fieldsArray']);
		try {
			$dataEmployee['dataSaveEmployee'] = $saveEmployee;
			$dataEmployee['dataEmployeeHistory'] = [
				'employeeId' => $saveEmployee['id'],
				'typeCreate' => 'changed',
				'dataEmployee' => $saveEmployee
			];
			if (!empty($saveEmployee['department_id'])) {
				\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $saveEmployee);
			}

			\CodeIgniter\Events\Events::trigger('on_update_employee_event', $dataEmployee);
			$this->model->save($saveEmployee);
		} catch (\ReflectionException $e) {
			return false;
		}

		return true;
	}

	/**
	 * @throws Exception
	 */
	protected function uploadAvatar($id, $avatar)
	{
		if ($avatar) {
			helper('user');
			$savePath = _uploadAvatar($id, $avatar);
			$this->model->setAllowedFields(['avatar'])->set('avatar', $savePath)->where('id', $id)->update();
			$this->setModule('users');
			$this->model->setAllowedFields(['avatar'])->set('avatar', $savePath)->where('id', $id)->update();
		}
	}

	protected function getLinkedList($module, $employeeId, $getData): array
	{
		$this->setModule($module);

		$this->model->where($this->linkedModules[$module]['linked_field'], $employeeId);
		$data = loadDataWrapper($this->module, $this->model, $getData);

		if ($module === 'contracts') {
			$min_date = "";
			foreach ($data['results'] as $item) {
				if ($item['active']) {
					$min_date = $item['contract_date_start'];
				}
			}
			$data['min_date'] = $min_date;
		}

		if ($module === 'employee_histories') {
			$arr_history = [];
			$firstKey = "";
			foreach ($data['results'] as $item) {
				$year = '"' . date("Y", strtotime($item['created_at']));
				$date = date("Y-m-d", strtotime($item['created_at']));

				$arr_history[$year][$date][] = $item['description'];

				if (empty($firstKey)) $firstKey = str_replace('"', '', $year);
			}

			$data['results'] = $arr_history;
			$data['firstKey'] = $firstKey;
		}

		return $data;
	}

	protected function getLinkedDetail($module, $employeeId, $dataId)
	{
		$this->setModule($module);
		$data = $this->model->where([
			'id' => $dataId,
			$this->linkedModules[$module]['linked_field'] => $employeeId
		])->first();
		if ($data) return handleDataBeforeReturn($this->module, $data);
		else return false;
	}

	/**
	 * @throws Exception
	 */
	protected function saveLinkedData($module, $employeeId, $data): bool
	{
		$validation = \Config\Services::validation();
		$this->setModule($module);
		$getPost = $data;
		$model = $this->model;
		$getPost[$this->linkedModules[$module]['linked_field']] = $employeeId;

		$dataHandleData = handleDataBeforeSave($this->module, $getPost, []);
		if (!empty($dataHandleData['validate'])) {
			if (!$validation->reset()->setRules($dataHandleData['validate'])->run($dataHandleData['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		$saveContract = $dataHandleData['data'];
		$appNumberModel = new AppAutoNumberModel();
		if (!isset($getPost['id']) && $module == 'contracts') {
			$autoNumberContract = $appNumberModel->getCurrentNumber('contracts', 'contract_code');
			$saveContract['contract_code'] = $autoNumberContract['active'] == 1 ? $autoNumberContract['result'] : "";
		}
		try {
			$db = getDb();
			$db->transStart();
			if ($module == 'contracts') {
				$contract_date_start = $saveContract['contract_date_start'];
				$check_duplicate_contract_start_date = $model->where("employee", $employeeId)->where("(('$contract_date_start' between contract_date_start and contract_date_end) or ('$contract_date_start' = contract_date_start))");
				if (!empty($saveContract['id'])) {
					if ($check_duplicate_contract_start_date->where("id <>", $saveContract['id'])->first()) {
						throw new Exception("error_date_start");
					}
				} else {
					if ($check_duplicate_contract_start_date->first()) {
						throw new Exception("error_date_start");
					}
				}

				if (!empty($saveContract['contract_date_end'])) {
					$contract_date_end = $saveContract['contract_date_end'];
					$check_duplicate_contract_end_date = $model->where("employee", $employeeId)->where("(('$contract_date_start' <= contract_date_end and '$contract_date_end' >= contract_date_start) or ('$contract_date_end' < '$contract_date_start'))");
					if (!empty($saveContract['id'])) {
						if ($check_duplicate_contract_end_date->where("id <>", $saveContract['id'])->first()) {
							throw new Exception("error_date_end");
						}
					} else {
						if ($check_duplicate_contract_end_date->first()) {
							throw new Exception("error_date_end");
						}
					}
				}
			}

			$model->setAllowedFields($dataHandleData['fieldsArray'])->save($saveContract);

			// check active contracts
			$date_today = date("Y-m-d");
			if ($module == 'contracts' && strtotime($saveContract['contract_date_start']) <= strtotime($date_today)) {
				$contractId = $model->getInsertID();
				if (empty($contractId)) $contractId = $saveContract['id'];
				$this->_handleSetEmployeeContractActive($employeeId, $contractId, $saveContract);
			}

			$db->transComplete();
			if ($db->transStatus() === false) {
				return false;
			}
		} catch (Exception $e) {
			throw new Exception($e->getMessage());
		}
		if (!isset($getPost['id']) && $module == 'contracts') $appNumberModel->increaseCurrentNumber(2);
		return true;
	}

	public function _handleSetEmployeeContractActive($employeeId, $contractId, $dataContract, $onlyContract = false)
	{
		$this->setModule('contracts');
		$this->model->setAllowedFields(["active"]);
		$listContracts = $this->model->where("employee", $employeeId)->select(['id'])->asArray()->findAll();
		$saveContractUpdateBatch = [];
		foreach ($listContracts as $item) {
			$saveContractUpdateBatch[] = ['id' => $item['id'], 'active' => 0];
		}
		if (!empty($saveContractUpdateBatch)) {
			$this->model->updateBatch($saveContractUpdateBatch, 'id');
		}
		$saveContractActive = ['id' => $contractId, 'active' => 1];
		$this->model->save($saveContractActive);

		if ($onlyContract) return true;

		$this->setModule('employees');
		$saveEmployee = [
			"id" => $employeeId,
			"department_id" => $dataContract['contract_department'] ?? "",
			"job_title_id" => $dataContract['contract_job_title'] ?? "",
			"employee_type" => $dataContract['employee_type'] ?? ""
		];
		$this->model->setAllowedFields(["department_id", "job_title_id", "employee_type"]);
		try {
			$dataEmployee['dataSaveEmployee'] = $saveEmployee;
			$dataEmployee['dataEmployeeHistory'] = [
				'employeeId' => $saveEmployee['id'],
				'typeCreate' => 'changed',
				'dataEmployee' => $saveEmployee
			];
			\CodeIgniter\Events\Events::trigger('on_update_employee_event', $dataEmployee);
			$this->model->save($saveEmployee);
		} catch (\ReflectionException $e) {
			return false;
		}
		return true;
	}

	protected function deleteLinkedData($module, $employeeId, $contractId)
	{
		$this->setModule($module);
		$model = $this->model;
		$record = $model->where([
			'id' => $contractId,
			$this->linkedModules[$module]['linked_field'] => $employeeId
		])->first();
		return ($record) ? $model->delete($contractId) : false;
	}

	protected function getDocuments($id): array
	{
		helper('filesystem');
		$uploadFolderPath = WRITEPATH . $_ENV['data_folder'];
		$storePath = '/' . $_ENV['data_folder_module'] . '/employees/' . $id . '/data/';
		$fileList = directory_map($uploadFolderPath . $storePath);
		$files = [];
		foreach ($fileList as $item) {
			$files[] = getFilesProps($item, $storePath);
		}
		usort($files, function ($a, $b) {
			return $a['fileMT'] <=> $b['fileMT'];
		});
		return $files;
	}

	/**
	 * @throws Exception
	 */
	protected function postDocuments($employeeId, $filesData): array
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$paths = [];
		if ($filesData['files']) {
			$storePath = getModuleUploadPath('employees', $employeeId, false) . 'data/';
			$paths = $uploadService->uploadFile($storePath, $filesData);
		}

		return $paths;
	}

	protected function deleteDocuments($employeeId, $file): bool
	{
		$storePath = getModuleUploadPath('employees', $employeeId) . 'data/';
		$removePath = $storePath . $file;
		if (is_file($removePath)) {
			unlink($removePath);
		}
		return true;
	}
}
