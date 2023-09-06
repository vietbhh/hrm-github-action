<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : User
* Controller name : User
* Time created : 12/09/2020 04:46:02
*/

namespace HRM\Modules\Employees\Controllers;

use App\Entities\User;
use App\Models\AppAutoNumberModel;
use App\Models\AppModel;
use App\Models\UserModel;
use Halo\Modules\Models\MetaModel;
use HRM\Modules\Employees\Models\EmployeesModel;
use HRM\Modules\Payrolls\Controllers\Payrolls;
use Myth\Auth\Authorization\GroupModel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Halo\Modules\ModulesManager;

class Employees extends Employee
{
	protected $accountStatusConvert = [
		1 => 'uninvited',
		2 => 'invited',
		3 => 'activated',
		4 => 'deactivated'
	];


	public function __construct()
	{
		parent::__construct();
		$this->linkedModules['contracts']['permits'] = [
			'view' => 'modules.employees.viewContracts',
			'update' => 'modules.employees.updateContracts'
		];
		$this->linkedModules['educations']['permits'] = [
			'view' => 'modules.employees.viewEducations',
			'update' => 'modules.employees.updateEducations'
		];
		$this->linkedModules['dependents']['permits'] = [
			'view' => 'modules.employees.viewDependents',
			'update' => 'modules.employees.updateDependents'
		];
		$this->linkedModules['documents']['permits'] = [
			'view' => 'modules.employees.viewDocuments',
			'update' => 'modules.employees.updateDocuments',
		];
		$this->linkedModules['employee_histories']['permits'] = [
			'view' => '',
			'update' => ''
		];
	}

	protected function handleModelPermission($model): AppModel
	{
		//Todo handle view permission here
		return $model;
	}

	public function get_get($identity)
	{
		$data = $this->getEmployee($identity);
		if (!$data) return $this->failNotFound(NOT_FOUND);
		if (!mayAccessResource('employees', $data['id'])) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		return $this->respond($data);
	}

	public function add_post()
	{
		$getPost = $this->request->getPost();
		//Todo need update permission check for each section - personalInformation,address..v.v
		if (!mayAdd('employees')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}
		try {
			if ($this->addEmployee($getPost)) {
				return $this->respondCreated();
			} else {
				return $this->fail(FAILED_SAVE);
			}
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
	}

	public function update_post($id)
	{
		$getPost = $this->request->getPost();
		//Todo need update permission check for each section - personalInformation,address..v.v
		if (!mayUpdateResource('employees', $id)) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		try {
			if ($this->updateEmployee($id, $getPost)) {
				return $this->respondUpdated($id);
			} else {
				return $this->fail(FAILED_SAVE);
			}
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
	}

	public function offboard_post($id)
	{
		helper('app_select_option');
		$getPost = $this->request->getPost();
		if (!mayUpdateResource('employees', $id)) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		if (!hasPermission('modules.employees.termination')) return $this->failForbidden(MISSING_PERMISSION);
		try {
			$lastWorkingDate = $getPost['last_working_date'];
			if (strtotime($lastWorkingDate) <= strtotime(date('Y-m-d'))) {
				$employeeModel = new EmployeesModel();
				$result = $employeeModel->resign([$id]);
				if ($result['success'] == false) {
					throw new \Exception($result['err']);
				}
			} else {
				$getPost['status'] = getOptionValue('employees', 'status', 'offboarding');
				if ($this->updateEmployee($id, $getPost)) {
					//Delete onboarding checklist if it is exist
					$this->_handleRemoveChecklistEmployeeOffboarding($id);
					//Todo handle other task for off-boarding
					return $this->respondUpdated($id);
				} else {
					return $this->fail(FAILED_SAVE);
				}
			}
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
	}

	public function cancel_offboard_get($id)
	{
		if (!mayUpdateResource('employees', $id)) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		if (!hasPermission('modules.employees.termination')) return $this->failForbidden(MISSING_PERMISSION);
		$data = array();
		$data['status'] = 13;
		$data['id'] = $id;
		$metas = $this->module->getMetas();
		foreach ($metas as $item) {
			if (empty($item->field_options['form']['tabId']) || $item->field_options['form']['tabId'] != 'offboarding') continue;
			$data[$item->field] = "";
		}
		if ($this->updateEmployee($id, $data)) {
			//Todo handle other task for cancel off-boarding
			return $this->respondUpdated($id);
		} else {
			return $this->fail(FAILED_SAVE);
		}
	}

	public function load_get()
	{
		if (!mayList('employees')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$request = $this->request->getGet();
		$result = $this->loadEmployee($request);
		return $this->respond($result);
	}

	public function delete_delete($ids)
	{
		$modules = \Config\Services::modules();
		$arrDel = ['contracts', 'educations'];
		$employeeModel = new EmployeesModel();
		$userModel = new UserModel();
		$ids = explode(',', $ids);

		foreach ($ids as $id) {
			if (!mayDeleteResource('employees', $id)) return $this->failForbidden(MISSING_DELETE_PERMISSION . '_' . $id);
			$employeeModel->delete($id);
			$userModel->delete($id);

			foreach ($arrDel as $val) {
				$modules->setModule($val);
				$modules->model->where('employee', $id)->delete();
			}
		}

		return $this->respondDeleted(json_encode($ids));
	}

	public function avatar($id)
	{
		if (!mayUpdateResource('employees', $id)) return $this->fail(MISSING_UPDATE_PERMISSION);
		$avatar = $this->request->getPost('avatar');
		if ($avatar) {
			try {
				$this->uploadAvatar($id, $avatar);
			} catch (\Exception $e) {
				return $this->failValidationErrors($e->getMessage());
			}
		}
		return $this->respondUpdated(ACTION_SUCCESS);
	}

	public function load_users_get()
	{
		$module = \Config\Services::modules('employees');
		$model = new EmployeesModel();
		$model = $model->selectBasicFields()->exceptResigned();

		$data = $this->request->getGet();
		$isLoadOptions = (isset($data['isLoadOptions']) && !empty($data['isLoadOptions'])) ? $data['isLoadOptions'] : false;

		if (!$isLoadOptions) {
			$model = $model->selectCommonFields();
		}
		helper('HRM\Modules\Employees\Helpers\employee');
		if (in_array($data['rankType'], ['subordinate', 'superior', 'other', 'subordinate-superior', 'subordinate-other', 'superior-other'])) {
			$search = $data['search'] ?? '';
			$userIds = $data['rankTarget'] ?? 0;
			$level = $data['rankLevel'] ?? 0;
			if ($isLoadOptions) {
				$model = $model->selectOptionFields($isLoadOptions);
			}
			$listResults = getEmployeesByRank($userIds, $data['rankType'], $model, true);
			if ($search || !empty($data['filters'])) {
				$search = strtolower($search);
				$filters = $data['filters'] ?? [];
				$result = array();
				foreach ($listResults as $k => $item) {
					$checkSearch = true;
					if (!empty($search)) $checkSearch = strpos(cleanStringUnicode(strtolower($item['email'])), $search) !== false
						|| strpos(cleanStringUnicode(strtolower($item['username'])), $search) !== false
						|| strpos(cleanStringUnicode(strtolower($item['full_name'])), $search) !== false;
					$checkFilter = true;
					if (!empty($filters)) {
						foreach ($filters as $key => $val) {
							$checkFilter = is_array($val) ? in_array($item[$key], $val) : $item[$key] == $val;
						}
					}
					if (!$checkSearch || !$checkFilter) unset($listResults[$k]);
				}
			}

			if (isset($data['exceptSelf']) && $data['exceptSelf']) {
				unset($listResults[user_id()]);
			}

			if (isset($data['excepts']) && !empty($data['excepts'])) {
				foreach ($data['excepts'] as $item) {
					if (isset($listResults[$item])) unset($listResults[$item]);
				}
			}

			$result['recordsTotal'] = count($listResults);
			//Paginate
			$isPaginate = !((isset($data['isPaginate']) && !(filter_var($data['isPaginate'], FILTER_VALIDATE_BOOLEAN))));
			if ($isPaginate) {
				$page = (isset($data['page'])) ? $data['page'] : 1;
				if (isset($data['perPage'])) {
					$length = $data['perPage'];
				} else {

					$length = preference('perPage');
				}
				if (isset($data['page'])) {
					$start = ($page - 1) * $length;
				} else {
					$start = (isset($data['start'])) ? $data['start'] : 0;
				}
				$listResults = array_slice($listResults, $start, $length);
			}
			//Return
			$result['results'] = $listResults;
			$result['page'] = ($length > 0) ? round($start / $length) + 1 : 1;
			$result['start'] = $start;
			$result['hasMore'] = !(($start + $length) >= $result['recordsTotal'] || !$isPaginate);
		} else {
			if (isset($data['exceptSelf']) && $data['exceptSelf']) {
				$model->where('id !=', user_id());
			}
			if (isset($data['excepts']) && !empty($data['excepts'])) {
				$model->whereNotIn('id', $data['excepts']);
			}
			$result = loadData($model, $data, ['email', 'username', 'full_name', 'phone']);
		}
		if (!$isLoadOptions) {
			$result['results'] = handleDataBeforeReturn($module, $result['results'], true, function ($rawItem, $item) {
				$item['avatar'] = $rawItem['avatar'];
				return $item;
			});
		}
		return $this->respond($result);
	}

	public function documents_get($id)
	{
		if (!mayAccessResource('employees', $id)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		if (!hasPermission($this->linkedModules['documents']['permits']['view'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		$files = $this->getDocuments($id);
		return $this->respond($files);
	}

	public function documents_post($employeeId)
	{
		$filesData = $this->request->getFiles();
		if (!mayUpdateResource('employees', $employeeId)) return $this->fail(MISSING_UPDATE_PERMISSION);
		if (!hasPermission($this->linkedModules['documents']['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		try {
			$paths = $this->postDocuments($employeeId, $filesData);
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
		return $this->respond($paths);
	}

	public function documents_delete($employeeId, $file)
	{
		if (!mayUpdateResource('employees', $employeeId)) return $this->fail(MISSING_UPDATE_PERMISSION);
		if (!hasPermission($this->linkedModules['documents']['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		if (empty($file)) return $this->failValidationErrors(VALIDATE_DATA_ERROR);
		$this->deleteDocuments($employeeId, $file);
		return $this->respond(ACTION_SUCCESS);
	}

	public function related_get($module, $employeeId, $recordId = null)
	{
		if (!mayAccessResource('employees', $employeeId) || !hasPermission($this->linkedModules[$module]['permits']['view'])) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		if (!empty($recordId)) {
			$data = $this->getLinkedDetail($module, $employeeId, $recordId);
			if ($data) return $this->respond([
				'data' => $data,
				'files_upload_module' => []
			]);
			else return $this->failNotFound(NOT_FOUND);
		} else {
			$getGet = $this->request->getGet();
			$data = $this->getLinkedList($module, $employeeId, $getGet);

			return $this->respond($data);
		}
	}

	public function related_post($module, $employeeId)
	{
		if (!mayAccessResource('employees', $employeeId)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		if (!hasPermission($this->linkedModules[$module]['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		$getPost = $this->request->getPost();
		$getPost[$this->linkedModules[$module]['linked_field']] = $employeeId;
		try {
			$this->saveLinkedData($module, $employeeId, $getPost);
		} catch (\Exception $e) {
			return $this->failForbidden($e->getMessage());
		}

		return $this->respondCreated($employeeId);
	}

	public function related_delete($module, $employeeId, $dataId)
	{
		if (!mayAccessResource('employees', $employeeId)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		if (!hasPermission($this->linkedModules[$module]['permits']['update'])) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		if ($this->deleteLinkedData($module, $employeeId, $dataId)) return $this->respond(ACTION_SUCCESS);
		else return $this->failNotFound(NOT_FOUND);
	}

	public function rehire_post($id)
	{
		if (!mayAccessResource('employees', $id)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		if (!hasPermission('modules.employees.hiring')) return $this->failForbidden(MISSING_PERMISSION);
		$employeeModel = new EmployeesModel();
		$userModel = new UserModel();
		$employeeData = $employeeModel->find($id);
		$userData = $userModel->find($id);
		$getPost = $this->request->getPost();
		$getPost['id'] = $id;
		if (empty($employeeData) || empty($userData)) {
			return $this->failNotFound(NOT_FOUND);
		}
		$modules = \Config\Services::modules();
		$validation = \Config\Services::validation();
		$modules->setModule('users');
		$dataHandleUser = handleDataBeforeSave($modules, $getPost, [], ['full_name', 'username', 'phone', 'email']);
		if (!empty($dataHandleUser['validate'])) {
			if (!$validation->reset()->setRules($dataHandleUser['validate'])->run($dataHandleUser['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$modules->setModule('employees');
		$dataHandleEmployee = handleDataBeforeSave($modules, $getPost, [], array_keys($getPost));

		if (!empty($dataHandleEmployee['validate'])) {
			if (!$validation->reset()->setRules($dataHandleEmployee['validate'])->run($dataHandleEmployee['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}

		$saveUser = $dataHandleUser['data'];
		$userData->fill($saveUser);
		$userData->generateActivateHash();
		$userData->account_status = $this->accountStatusConvert[2];
		$userModel->save($userData);

		$employeeData = array_merge($employeeData, $dataHandleEmployee['data']);
		$employeeData['account_status'] = 2;
		$employeeData['status'] = 11; //set employee status to onboard
		$employeeModel->setAllowedFields(array_merge($dataHandleEmployee['fieldsArray'], ['account_status', 'status']))->save($employeeData);

		if (filter_var($getPost['invitation_active'], FILTER_VALIDATE_BOOLEAN) === true) {
			$activator = service('activator');
			if (!$activator->send($userData)) {
				return $this->failServerError($activator->error());
			}
		}

		return $this->respond('ACTION_SUCCESS');
	}

	public function org_chart_get($parent = 0)
	{
		$module = \Config\Services::modules('employees');
		$model = new EmployeesModel();
		$model = $model->exceptResigned()->select(['m_employees.id as id', 'departments.name as department', 'job_titles.name as title', 'avatar', 'email', 'full_name', 'line_manager', 'username'])->join('departments', 'departments.id = department_id', 'left')->join('job_titles', 'job_titles.id = job_title_id', 'left');

		//////Array Version/////
		$listResults = $model->findAll();
		$data = $this->getLevel($listResults, $parent);
		//////End Array Version/////


		//$listResults = $this->getLevel($listResults);
		return $this->respond($data);
	}

	public function invite($id)
	{
		if (!mayAccessResource('employees', $id)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		if (!hasPermission('modules.employees.hiring')) return $this->failForbidden(MISSING_PERMISSION);
		$employeeModel = new EmployeesModel();
		$userModel = new UserModel();
		$employeeData = $employeeModel->find($id);
		$userData = $userModel->find($id);
		if (empty($employeeData) || empty($userData)) {
			return $this->failNotFound(NOT_FOUND);
		}

		$userData->generateActivateHash();

		$activator = service('activator');
		$sent = $activator->send($userData);
		if (!$sent) {
			return $this->failServerError($activator->error());
		} else {
			$employeeData['account_status'] = 2;
			try {
				$employeeModel->setAllowedFields(['account_status'])->save($employeeData);
			} catch (\Exception $e) {
				return $this->failServerError($e->getMessage());
			}
			$userData->account_status = $this->accountStatusConvert[2];
			try {
				$userModel->save($userData);
			} catch (\Exception $e) {
				return $this->failServerError($e->getMessage());
			}
		}

		// Success!
		return $this->respond('ACTION_SUCCESS');
	}

	public function export_excel_get()
	{
		/*alphabet A to BZ*/
		$arr_alphabet = [];
		for ($k = -1; $k <= 1; $k++) {
			$alphabet_ = $arr_alphabet[$k] ?? "";
			foreach (range('A', 'Z') as $columnId) {
				$arr_alphabet[] = $alphabet_ . $columnId;
			}
		}

		/*fake data*/
		$arr_data_fake = [
			[
				"full_name" => "Nguyễn văn a",
				"pob" => "Hà Nội",
				"username" => "nguyenvana",
				"email" => "nguyenvana@gmail.com",
				"phone" => "0973111111",
				"identity_card_location_issue" => "Ha Noi",
				"ethnic" => "Khong",
				"domicile" => "Ha Noi",
				"temp_address" => "100 Dịch Vọng Hậu",
				"temp_province" => "Thành phố Hà Nội",
				"temp_district" => "Quận Cầu Giấy",
				"temp_ward" => "Phường Dịch Vọng Hậu",
				"per_address" => "100 Dịch Vọng Hậu",
				"per_province" => "Thành phố Hà Nội",
				"per_district" => "Quận Cầu Giấy",
				"per_ward" => "Phường Dịch Vọng Hậu",
				"bank_owner" => "Nguyễn Văn A",
				"bank_number" => "123456789",
				"bank_name" => "ACB",
				"line_manager" => "username_manager",
			],
			[
				"full_name" => "Nguyễn văn b",
				"pob" => "Hà Nội",
				"username" => "nguyenvanb",
				"email" => "nguyenvanb@gmail.com",
				"phone" => "0973111111",
				"identity_card_location_issue" => "Ha Noi",
				"ethnic" => "Khong",
				"domicile" => "Ha Noi",
				"temp_address" => "100 Dịch Vọng Hậu",
				"temp_province" => "Thành phố Hà Nội",
				"temp_district" => "Quận Cầu Giấy",
				"temp_ward" => "Phường Dịch Vọng Hậu",
				"per_address" => "100 Dịch Vọng Hậu",
				"per_province" => "Thành phố Hà Nội",
				"per_district" => "Quận Cầu Giấy",
				"per_ward" => "Phường Dịch Vọng Hậu",
				"bank_owner" => "Nguyễn Văn B",
				"bank_number" => "123456789",
				"bank_name" => "ACB",
				"line_manager" => "username_manager",
			]
		];

		/*metas data*/
		$modules = \Config\Services::modules();
		$modules->setModule("employees");
		$metas = $modules->getMetas();
		$resultColumn = $this->getArrColumnExcel($metas);
		$arr_column = $resultColumn['arr_column'];
		$arr_column_payroll_employee = $resultColumn['arr_column_payroll_employee'];
		$arr_column_payroll = $resultColumn['arr_column_payroll'];
		$arr_column_contract = $resultColumn['arr_column_contract'];
		$arr_column_education = $resultColumn['arr_column_education'];
		$arr_column_dependents = $resultColumn['arr_column_dependents'];
		$arr_select = $resultColumn['arr_select'];
		$arr_select_modules = $resultColumn['arr_select_modules'];
		$arr_select_modules_ = $resultColumn['arr_select_modules_'];
		$arr_select_options = $resultColumn['arr_select_options'];

		$arr_select[] = [
			"type" => "custom",
			"field" => "switch"
		];
		$arr_select_custom["switch"] = ["Yes", "No"];

		$modules->setModule("contracts");
		$metas_contract = $modules->getMetas();
		foreach ($metas_contract as $item) {
			if ($item->field == 'contract_type' && $item->field_type == 'select_module') {
				$arr_select[] = [
					"type" => "module",
					"field" => $item->field
				];
				$arr_select_modules_[$item->field] = $item;
			}
		}

		$modules->setModule("educations");
		$metas_education = $modules->getMetas();
		foreach ($metas_education as $item) {
			if ($item->field == 'edu_level' && $item->field_type == 'select_option') {
				$arr_select[] = [
					"type" => "option",
					"field" => $item->field
				];
				$arr_select_options[$item->field] = $item;
			}
		}

		$arr_select_key = [];
		foreach ($arr_select as $key => $item) {
			if ($item['type'] == 'module') {
				$field_select_module = $arr_select_modules_[$item['field']]->field_select_module;
				$field_select_field_show = $arr_select_modules_[$item['field']]->field_select_field_show;
				$modules->setModule($field_select_module);
				$model = $modules->model;
				$data = $model->select(["$field_select_field_show as label"])->findAll();
				$arr_select_modules[$item['field']] = $data;
			}

			$arr_select_key[$item['field']]['key'] = $key;
		}

		/*clone sheet from template*/
		$path_template = COREPATH . 'assets/templates/Employee_Template.xlsx';
		$reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
		$reader->setLoadSheetsOnly(["Instructions"]);
		$spreadsheet = $reader->load($path_template);
		$styleArray = [
			'fill' => [
				'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
				'startColor' => [
					'argb' => 'A9D08E',
				],
				'endColor' => [
					'argb' => 'A9D08E',
				],
			],
		];
		$styleArray_3 = [
			'fill' => [
				'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
				'startColor' => [
					'argb' => 'f9d324',
				],
				'endColor' => [
					'argb' => 'f9d324',
				],
			],
		];

		/*sheet Employee list (Template)*/
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Employee list (Template)");
		$i = 1;
		foreach ($arr_column as $j => $item) {
			$sheet->getStyle($arr_alphabet[$j] . $i . ':' . $arr_alphabet[$j] . '300')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
			$sheet->getStyle($arr_alphabet[$j] . $i)->applyFromArray($styleArray);
			$field = $item->field_form_require ? $item->field . "*" : $item->field;
			$sheet->setCellValue($arr_alphabet[$j] . $i, $field);
		}

		/*sheet Payroll*/
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Payroll");
		$payroll_col_general = count($arr_column_payroll['general']);
		$payroll_col_payroll = count($arr_column_payroll['payroll']);
		$payroll_col_recurring = count($arr_column_payroll['recurring']);
		$general_end = $payroll_col_general - 1;
		$payroll_start = $general_end + 1;
		$payroll_end = $payroll_start + $payroll_col_payroll - 1;
		if ($payroll_col_recurring > 0) {
			$recurring_start = $payroll_end + 1;
		}
		$col_probationary_salary_percent = 0;
		$col_official_salary = 0;
		$col_probationary_salary = 0;
		$i = 1;
		$j = 0;
		foreach ($arr_column_payroll as $key => $item) {
			foreach ($item as $field) {
				$sheet->getStyle($arr_alphabet[$j] . $i . ':' . $arr_alphabet[$j] . '300')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
				if ($key == 'payroll') {
					$sheet->getStyle($arr_alphabet[$j] . $i)->applyFromArray($styleArray_3);
				} else {
					$sheet->getStyle($arr_alphabet[$j] . $i)->applyFromArray($styleArray);
				}
				$sheet->setCellValue($arr_alphabet[$j] . $i, $field);

				if ($field == 'probationary_salary_percent') {
					$col_probationary_salary_percent = $j;
				}

				if ($field == 'Official salary') {
					$col_official_salary = $j;
				}

				if ($field == 'Probationary salary') {
					$col_probationary_salary = $j;
				}

				$j++;
			}
		}
		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*sheet Contract*/
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Contract");
		$i = 1;
		foreach ($arr_column_contract as $j => $field) {
			$sheet->getStyle($arr_alphabet[$j] . $i . ':' . $arr_alphabet[$j] . '300')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
			$sheet->getStyle($arr_alphabet[$j] . $i)->applyFromArray($styleArray);
			$sheet->setCellValue($arr_alphabet[$j] . $i, $field);
		}
		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*sheet Education*/
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Education");
		$i = 1;
		foreach ($arr_column_education as $j => $field) {
			$sheet->getStyle($arr_alphabet[$j] . $i . ':' . $arr_alphabet[$j] . '300')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
			$sheet->getStyle($arr_alphabet[$j] . $i)->applyFromArray($styleArray);
			$sheet->setCellValue($arr_alphabet[$j] . $i, $field);
		}
		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*sheet Dependents*/
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Dependents");
		$i = 1;
		foreach ($arr_column_dependents as $j => $field) {
			$sheet->getStyle($arr_alphabet[$j] . $i . ':' . $arr_alphabet[$j] . '300')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
			$sheet->getStyle($arr_alphabet[$j] . $i)->applyFromArray($styleArray);
			$sheet->setCellValue($arr_alphabet[$j] . $i, $field);
		}
		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*sheet Master Data*/
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Master Data");
		$i = 1;
		foreach ($arr_select as $j => $item) {
			$sheet->getStyle($arr_alphabet[$j] . $i)->applyFromArray($styleArray);
			$sheet->setCellValue($arr_alphabet[$j] . $i, $item['field']);
		}
		$i++;
		foreach ($arr_select as $j => $item) {
			$k = $i;
			$arr_select_key[$item['field']]['start'] = $k;
			$arr_select_key[$item['field']]['end'] = $k;
			if ($item['type'] == "option") {
				foreach ($arr_select_options[$item['field']]->field_options_values['values'] as $item_option) {
					$sheet->setCellValue($arr_alphabet[$j] . $k, $item_option['name']);
					$arr_select_key[$item['field']]['end'] = $k;
					$k++;
				}
			}
			if ($item['type'] == "module") {
				foreach ($arr_select_modules[$item['field']] as $item_option) {
					$sheet->setCellValue($arr_alphabet[$j] . $k, $item_option->label);
					$arr_select_key[$item['field']]['end'] = $k;
					$k++;
				}
			}
			if ($item['type'] == 'custom') {
				foreach ($arr_select_custom[$item['field']] as $item_custom) {
					$sheet->setCellValue($arr_alphabet[$j] . $k, $item_custom);
					$arr_select_key[$item['field']]['end'] = $k;
					$k++;
				}
			}
		}
		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*sheet Employee list (Template)*/
		/*set default active sheet*/
		$sheet = $spreadsheet->setActiveSheetIndex(1);
		$i = 2;
		for ($m = 0; $m <= 1; $m++) {
			foreach ($arr_column as $j => $item) {
				$value = '';
				if ($item->field_type == 'date') {
					$value = date("d/m/Y");
				}
				if (isset($arr_data_fake[$m][$item->field])) {
					$value = $arr_data_fake[$m][$item->field];
				}
				$sheet->setCellValue($arr_alphabet[$j] . $i, $value);
				if (($item->field_type == 'select_option' || $item->field_type == 'select_module' || $item->field_type == 'switch') && (isset($arr_select_key[$item->field]) || isset($arr_select_key["switch"]))) {
					if ($m == 0) {
						if ($item->field_type == 'switch') {
							$k = $arr_select_key["switch"]['key'];
							$start = $arr_select_key["switch"]['start'];
							$end = $arr_select_key["switch"]['end'];
						} else {
							$k = $arr_select_key[$item->field]['key'];
							$start = $arr_select_key[$item->field]['start'];
							$end = $arr_select_key[$item->field]['end'];
						}
						$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);
					}
					if ($item->field_type == 'select_option') {
						$value = $arr_select_options[$item->field]->field_options_values['values'][$m]['name'] ?? "";
						$sheet->setCellValue($arr_alphabet[$j] . $i, $value);
					}
					if ($item->field_type == 'select_module') {
						$value = $arr_select_modules[$item->field][$m]->label ?? "";
						$sheet->setCellValue($arr_alphabet[$j] . $i, $value);
					}
					if ($item->field_type == 'switch') {
						$value = $arr_select_custom["switch"][$m] ?? "";
						$sheet->setCellValue($arr_alphabet[$j] . $i, $value);
					}
				}
			}

			$i++;
		}
		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*sheet Payroll*/
		/*set default active sheet*/
		$sheet = $spreadsheet->setActiveSheetIndex(2);
		$i = 2;
		$j = $payroll_start;
		foreach ($arr_column_payroll_employee as $item) {
			if (($item->field_type == 'select_option' || $item->field_type == 'select_module' || $item->field_type == 'switch') && (isset($arr_select_key[$item->field]) || isset($arr_select_key["switch"]))) {
				if ($item->field_type == 'switch') {
					$k = $arr_select_key["switch"]['key'];
					$start = $arr_select_key["switch"]['start'];
					$end = $arr_select_key["switch"]['end'];
				} else {
					$k = $arr_select_key[$item->field]['key'];
					$start = $arr_select_key[$item->field]['start'];
					$end = $arr_select_key[$item->field]['end'];
				}
				$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);
			}
			$j++;
		}
		if (!empty($col_probationary_salary_percent) && !empty($col_official_salary) && !empty($col_probationary_salary)) {
			$this->renderColumnCalculateExcel($sheet, $arr_alphabet, $col_probationary_salary, $col_probationary_salary_percent, $col_official_salary);
		}
		if ($payroll_col_recurring > 0) {
			$j = $recurring_start;
			foreach ($arr_column_payroll['recurring'] as $item) {
				$k = $arr_select_key["switch"]['key'];
				$start = $arr_select_key["switch"]['start'];
				$end = $arr_select_key["switch"]['end'];
				$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);
				$j++;
			}
		}

		/*sheet Contract*/
		/*set default active sheet*/
		$sheet = $spreadsheet->setActiveSheetIndex(3);
		$i = 2;
		$j = 3;
		$k = $arr_select_key["contract_type"]['key'];
		$start = $arr_select_key["contract_type"]['start'];
		$end = $arr_select_key["contract_type"]['end'];
		$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);
		$j = 4;
		$k = $arr_select_key["employee_type"]['key'];
		$start = $arr_select_key["employee_type"]['start'];
		$end = $arr_select_key["employee_type"]['end'];
		$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);
		$j = 5;
		$k = $arr_select_key["department_id"]['key'];
		$start = $arr_select_key["department_id"]['start'];
		$end = $arr_select_key["department_id"]['end'];
		$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);

		/*sheet Education*/
		/*set default active sheet*/
		$sheet = $spreadsheet->setActiveSheetIndex(4);
		$i = 2;
		for ($j = 3; $j <= 12; $j = $j + 3) {
			$k = $arr_select_key["edu_level"]['key'];
			$start = $arr_select_key["edu_level"]['start'];
			$end = $arr_select_key["edu_level"]['end'];
			$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);
		}

		/*sheet Dependents*/
		/*set default active sheet*/
		$sheet = $spreadsheet->setActiveSheetIndex(5);
		$i = 2;
		$j = 3;
		$k = $arr_select_key["relationship_status"]['key'];
		$start = $arr_select_key["relationship_status"]['start'];
		$end = $arr_select_key["relationship_status"]['end'];
		$this->renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end);

		/*set default active sheet employees*/
		$spreadsheet->setActiveSheetIndex(1);

		/*export excel*/
		$writer = new Xlsx($spreadsheet);
		$name = "Employee_Template_" . date("Ymd") . "_" . rand() . ".xlsx";
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
		$writer->save('php://output');

		exit;
	}

	public function preview_post()
	{
		$modules = \Config\Services::modules();
		$modules->setModule("employees");
		$data = $this->request->getPost();
		$metas = $modules->getMetas();

		$arr_metas = [];
		foreach ($metas as $item) {
			$arr_metas[$item->field] = $item;
		}

		$header = $data['header'];
		$body = $data['body'];
		$dataMapFields = $data['dataMapFields'];
		$unmapped = $data['unmapped'];

		$arr_data = [];
		$arr_unmapped = [];
		$arr_created = [];
		$arr_duplicated = [];
		$arr_skipped = [];

		foreach ($metas as $item) {
			$field = $item->field;
			foreach ($unmapped as $item_un) {
				if ($field == $item_un) {
					$arr_unmapped[] = [
						'field' => $field,
						'type' => $item->field_type == 'select_option' || $item->field_type == 'select_module' ? "Dropdown" : $item->field_type
					];
				}
			}
		}

		foreach ($body as $key => $item) {
			$key = $key + 2;
			$arr = [];
			foreach ($dataMapFields as $field => $item_field) {
				$arr[$field] = $item[$item_field] ?? "";
			}
			$arr_data[$key] = $arr;
		}

		$model = $modules->model;
		$arr_email = [];
		$arr_username = [];
		$arr_duplicated_ = [];
		$arr_created_ = [];

		/*set arr check duplicate and arr created*/
		foreach ($arr_data as $row => $item) {
			$arr_email[$item['email']][] = [
				"type" => "excel",
				"row" => $row,
				"full_name" => $item['full_name'],
				"email" => $item['email'],
				"username" => $item['username']
			];

			$arr_username[$item['username']][] = [
				"type" => "excel",
				"row" => $row,
				"full_name" => $item['full_name'],
				"email" => $item['email'],
				"username" => $item['username']
			];

			$check_username_email = $model->select(["id", "full_name", "email", "username"])->where('email', $item['email'])->where('username', $item['username'])->first();
			if (!empty($check_username_email)) {
				$arr_username[$item['username']][] = [
					"type" => "db",
					"row" => "db_" . $check_username_email->id,
					"full_name" => $check_username_email->full_name,
					"email" => $check_username_email->email,
					"username" => $check_username_email->username
				];

				$arr_duplicated_[$row]['duplicated_username'][] = [
					"type" => "db",
					"row" => "db_" . $check_username_email->id,
					"full_name" => $check_username_email->full_name,
					"email" => $check_username_email->email,
					"username" => $check_username_email->username
				];
			} else {
				$data_email = $model->select(["id", "full_name", "email", "username"])->where('email', $item['email'])->first();
				if (!empty($data_email)) {
					$arr_email[$item['email']][] = [
						"type" => "db",
						"row" => "db_" . $data_email->id,
						"full_name" => $data_email->full_name,
						"email" => $data_email->email,
						"username" => $data_email->username
					];

					$arr_duplicated_[$row]['duplicated_email'][] = [
						"type" => "db",
						"row" => "db_" . $data_email->id,
						"full_name" => $data_email->full_name,
						"email" => $data_email->email,
						"username" => $data_email->username
					];
				}

				$data_username = $model->select(["id", "full_name", "email", "username"])->where('username', $item['username'])->first();
				if (!empty($data_username)) {
					$arr_username[$item['username']][] = [
						"type" => "db",
						"row" => "db_" . $data_username->id,
						"full_name" => $data_username->full_name,
						"email" => $data_username->email,
						"username" => $data_username->username
					];

					$arr_duplicated_[$row]['duplicated_username'][] = [
						"type" => "db",
						"row" => "db_" . $data_username->id,
						"full_name" => $data_username->full_name,
						"email" => $data_username->email,
						"username" => $data_username->username
					];
				}
			}

			foreach ($arr_data as $row_2 => $item_2) {
				if ($row != $row_2) {
					if ($item['email'] == $item_2['email'] && $item['username'] == $item_2['username']) {
						$arr_duplicated_[$row]['duplicated_username'][] = [
							"row" => $row_2,
							"full_name" => $item_2['full_name'],
							"email" => $item_2['email'],
							"username" => $item_2['username']
						];
					} else {
						if ($item['email'] == $item_2['email']) {
							$arr_duplicated_[$row]['duplicated_email'][] = [
								"row" => $row_2,
								"full_name" => $item_2['full_name'],
								"email" => $item_2['email'],
								"username" => $item_2['username']
							];
						}

						if ($item['username'] == $item_2['username']) {
							$arr_duplicated_[$row]['duplicated_username'][] = [
								"row" => $row_2,
								"full_name" => $item_2['full_name'],
								"email" => $item_2['email'],
								"username" => $item_2['username']
							];
						}
					}
				}
			}

			if (!isset($arr_duplicated_[$row])) {
				$arr_created_[$row] = [
					"row" => $row,
					"full_name" => $item['full_name'],
					"email" => $item['email'],
					"username" => $item['username']
				];
			}
		}

		/*delete key db duplicate*/
		foreach ($arr_email as $email => $item_email) {
			$arr_check_db = [];
			foreach ($item_email as $key => $item) {
				if ($item['type'] == 'db') {
					$arr_check_db[]['key'] = $key;
				}
			}

			if (count($arr_check_db) > 1) {
				for ($i = 0; $i < count($arr_check_db) - 1; $i++) {
					unset($arr_email[$email][$arr_check_db[$i]['key']]);
				}
			}
		}
		foreach ($arr_username as $username => $item_username) {
			$arr_check_db = [];
			foreach ($item_username as $key => $item) {
				if ($item['type'] == 'db') {
					$arr_check_db[]['key'] = $key;
				}
			}

			if (count($arr_check_db) > 1) {
				for ($i = 0; $i < count($arr_check_db) - 1; $i++) {
					unset($arr_username[$username][$arr_check_db[$i]['key']]);
				}
			}
		}

		/*count record duplicate 2 (username and email)*/
		$record_duplicated_2 = 0;
		foreach ($arr_duplicated_ as $item) {
			if (isset($item['duplicated_email']) && isset($item['duplicated_username'])) {
				$record_duplicated_2++;
			}
		}

		/*set out arr created*/
		foreach ($arr_created_ as $key => $item) {
			$arr_created[] = [
				"key" => $key,
				"row" => $item['row'],
				"email" => $item['full_name'] . " - " . $item['email'] . " - " . $item['username']
			];
		}

		/*set out arr duplicated*/
		foreach ($arr_email as $email => $item) {
			if (count($item) >= 2) {
				$arr = [
					'title' => "Email",
					'value' => $email,
				];
				foreach ($item as $item_2) {
					$arr['table'][] = [
						"type" => $item_2['type'],
						"row" => $item_2['row'],
						"email" => $item_2['full_name'] . " - " . $item_2['email'] . " - " . $item_2['username']
					];
				}
				$arr_duplicated[] = $arr;
			}
		}
		foreach ($arr_username as $username => $item) {
			if (count($item) >= 2) {
				$arr = [
					'title' => "Username",
					'value' => $username,
				];
				foreach ($item as $item_2) {
					$arr['table'][] = [
						"type" => $item_2['type'],
						"row" => $item_2['row'],
						"email" => $item_2['full_name'] . " - " . $item_2['email'] . " - " . $item_2['username']
					];
				}
				$arr_duplicated[] = $arr;
			}
		}

		//** data_tab */
		$data_tab = $data['data_tab'];
		$data_tab_payroll = $data_tab[0];
		$data_tab_contract = $data_tab[1];
		$data_tab_education = $data_tab[2];
		$data_tab_dependents = $data_tab[3];
		$data_tab_error = [];
		$data_tab_import = $data_tab;

		foreach ($data_tab_payroll['body'] as $key => $item) {
			if (!empty($item) && empty($item['Email'])) {
				$data_tab_error['payroll_error_email'] = 'payroll_error_email';
				unset($data_tab_import[0]['body'][$key]);
			}
		}
		$arr_tab_contract_email = [];
		foreach ($data_tab_contract['body'] as $key => $item) {
			if (!empty($item)) {
				if (empty($item['Email'])) {
					$data_tab_error['contract_error_email'] = 'contract_error_email';
					unset($data_tab_import[1]['body'][$key]);
				} else {
					if (empty($item['Contract Start date'])) {
						unset($data_tab_import[1]['body'][$key]);
					} else {
						$arr_tab_contract_email[$item['Email']][] = $item;
					}
				}
			}
		}
		$arr_tab_contract_email_check_date = [];
		/*foreach ($arr_tab_contract_email as $email => $value) {
			for ($i = 0; $i < count($value); $i++) {
				$start_date = $this->convertDateExcel($value[$i]['Contract Start date']);
				$end_date = isset($value[$i]['Contract End date']) ? $this->convertDateExcel($value[$i]['Contract End date']) : "";
				$start_date_2 = isset($value[$i + 1]['Contract Start date']) ? $this->convertDateExcel($value[$i + 1]['Contract Start date']) : "";
				$end_date_2 = isset($value[$i + 1]['Contract End date']) ? $this->convertDateExcel($value[$i + 1]['Contract End date']) : "";

				if (!empty($start_date_2)) {
					if ((strtotime($start_date_2) <= strtotime($start_date) && strtotime($start_date) <= strtotime($end_date_2)) || (strtotime($start_date_2) <= strtotime($end_date) && strtotime($end_date) <= strtotime($end_date_2))) {
						$arr_tab_contract_email_check_date[$email] = 'error';
					}
				}
			}
		}*/
		foreach ($data_tab_import[1]['body'] as $key => $item) {
			if (!empty($item) && !empty($item['Email']) && isset($arr_tab_contract_email_check_date[$item['Email']])) {
				$data_tab_error['contract_error_date'] = 'contract_error_date';
				unset($data_tab_import[1]['body'][$key]);
			}
		}

		foreach ($data_tab_education['body'] as $key => $item) {
			if (!empty($item) && empty($item['Email'])) {
				$data_tab_error['education_error_email'] = 'education_error_email';
				unset($data_tab_import[2]['body'][$key]);
			}
		}
		foreach ($data_tab_dependents['body'] as $key => $item) {
			if (!empty($item) && empty($item['Email'])) {
				$data_tab_error['dependents_error_email'] = 'dependents_error_email';
				unset($data_tab_import[3]['body'][$key]);
			}
		}


		$result['record_unmapped'] = count($arr_unmapped);
		$result['unmapped'] = $arr_unmapped;
		$result['record_created'] = count($arr_created);
		$result['created'] = $arr_created;
		$result['record_duplicated'] = count($arr_duplicated);
		$result['duplicated'] = $arr_duplicated;
		$result['record_skipped'] = count($arr_skipped);
		$result['skipped'] = $arr_skipped;
		$result['record_duplicated_2'] = $record_duplicated_2;
		$result['arr_data'] = $arr_data;
		$result['data_tab_error'] = $data_tab_error;
		$result['data_tab_import'] = $data_tab_import;

		return json_encode($result);
	}

	public function import_post()
	{
		$user_id = user_id();
		$datetoday = date('Y-m-d');
		$modules = \Config\Services::modules();
		$modules->setModule("employees");
		$data = $this->request->getPost();
		$metas = $modules->getMetas();
		if ($data['record_duplicated_2'] > 0 || ($data['record_created'] == 0 && $data['record_duplicated_2'] == 0 && $data['record_duplicated'] == 0)) {
			return $this->failNotFound(NOT_FOUND);
		}
		$arr_metas = [];
		foreach ($metas as $item) {
			$arr_metas[$item->field] = $item;
		}

		$dataMapFields = $data['dataMapFields'];
		$arr_data = $data['arr_data'];
		$data_created = $data['data_created'];
		$record_duplicated = $data['record_duplicated'];
		$data_duplicated = $data['data_duplicated'];
		$arr_data_import = [];

		$allowedFields[] = 'id';
		$allowedFields[] = 'user_id';
		$allowedFields[] = 'employee_code';
		$allowedFields[] = 'account_status';
		$allowedFields[] = 'line_manager';
		foreach ($dataMapFields as $field => $item) {
			$allowedFields[] = $field;
		}

		if (!empty($data_created)) {
			foreach ($data_created as $item) {
				if (isset($item['row'])) {
					$arr_data_import[$item['row']] = $arr_data[$item['row']];
				}
			}
		}

		/*check row checked duplicated*/
		$modules->setModule("employees");
		$model = $modules->model;
		if ($record_duplicated > 0) {
			for ($i = 0; $i < $record_duplicated; $i++) {
				$row = $data['duplicated_' . $i];
				if (strpos($row, "db") === false) {
					$data_duplicated_ = $data_duplicated[$i];
					$data_excel = $arr_data[$row];
					$email = $data_excel['email'];
					$username = $data_excel['username'];
					$arr_data_import[$row] = $data_excel;
					if ($data_duplicated_['title'] == 'Email') {
						$data_db = $model->select(["id"])->where('email', $email)->first();
						if (!empty($data_db)) {
							$arr_data_import[$row]['id'] = $data_db->id;
						}
					}
					if ($data_duplicated_['title'] == 'Username') {
						$data_db = $model->select(["id"])->where('username', $username)->first();
						if (!empty($data_db)) {
							$arr_data_import[$row]['id'] = $data_db->id;
						}
					}
				}
			}
		}

		/*set data import*/
		$data_insert = [];
		$data_update = [];
		$data_import = [];
		foreach ($arr_data_import as $row => $item) {
			$data_import[$row] = $item;
			foreach ($item as $field => $value) {
				if (isset($arr_metas[$field])) {
					$data_metas = $arr_metas[$field];
					$data_import[$row][$field] = $this->getValueFromMetasDataExcel($data_metas, $value);
				}
			}

			if (isset($item['id']) && !empty($item['id'])) {
				$data_update[$row] = $data_import[$row];
			} else {
				$data_insert[$row] = $data_import[$row];
			}
		}

		/*insert and update*/
		$arr_id_employee = [];
		$modules->setModule("employees");
		$model = $modules->model;
		$model->setAllowedFields($allowedFields);
		foreach ($data_insert as $row => $item) {
			$item['account_status'] = 1;
			$resultInsert = $this->handleInsert($model, $item, $item);
			$arr_id_employee[] = $resultInsert['id'];
		}

		foreach ($data_update as $row => $item) {
			if (empty($item['employee_code'])) {
				unset($item['employee_code']);
			}
			$this->updateEmployee($item['id'], $item);
			$arr_id_employee[] = $item['id'];
		}

		/** data_tab */
		$data_tab = $data['data_tab_import'];
		$data_tab_payroll = $data_tab[0];
		$data_tab_contract = $data_tab[1];
		$data_tab_education = $data_tab[2];
		$data_tab_dependents = $data_tab[3];
		$resultColumn = $this->getArrColumnExcel($metas);
		$arr_column_payroll = $resultColumn['arr_column_payroll'];
		$employeeModel = new EmployeesModel();
		$allowedFields_employee = [];
		for ($i = 0; $i <= count($arr_column_payroll['payroll']) - 3; $i++) {
			$allowedFields_employee[] = $arr_column_payroll['payroll'][$i];
		}
		$employeeModel->setAllowedFields($allowedFields_employee);

		$data_import_payroll_employee = [];
		$data_import_payroll_salary = [];
		$data_import_payroll_recurring = [];
		foreach ($data_tab_payroll['body'] as $item) {
			if (!empty($item) && !empty($item['Email']) && $dataEmployee = $employeeModel->getEmployeeByEmail($item['Email'])) {
				if (!in_array($dataEmployee['id'], $arr_id_employee)) continue;
				$data_import = $item;
				$data_import['id'] = $dataEmployee['id'];
				foreach ($item as $field => $value) {
					if (isset($arr_metas[$field])) {
						$data_metas = $arr_metas[$field];
						$data_import[$field] = $this->getValueFromMetasDataExcel($data_metas, $value);
					}

					if (in_array($field, $arr_column_payroll['recurring']) && $value == 'Yes') {
						$field_exp = explode("_", $field);
						$id_recurring = $field_exp[count($field_exp) - 1];
						if (is_numeric($id_recurring)) {
							$modules->setModule("recurring");
							$model = $modules->model;
							$recurring_db = $model->asArray()->find($id_recurring);
							if ($recurring_db) {
								$data_import_payroll_recurring[] = [
									"recurring" => $recurring_db['id'],
									"employee" => $dataEmployee['id'],
									"valid_from" => $recurring_db['valid_from'],
									"valid_to" => $recurring_db['valid_to'],
									'owner' => $user_id,
									'created_by' => $user_id,
									'updated_by' => $user_id
								];
							}
						}
					}
				}

				$data_import_payroll_employee[] = $data_import;

				if (!empty($item['Probationary salary'])) {
					$data_import_payroll_salary[] = [
						'employee' => $dataEmployee['id'],
						'salary' => $item['Probationary salary'],
						'date_from' => $data_import['probation_start_date'] ?? "",
						'date_to' => $data_import['probation_end_date'] ?? "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id,
						'salary_percentage' => $item['probationary_salary_percent'],
						'basic_salary' => $item['Official salary']
					];
				}
				if (!empty($item['Official salary'])) {
					if (!empty($data_import['probation_end_date'])) {
						$date_salary_start = date('Y-m-d', strtotime($data_import['probation_end_date'] . "+1 day"));
					} else {
						$date_salary_start = $dataEmployee['join_date'];
					}
					$data_import_payroll_salary[] = [
						'employee' => $dataEmployee['id'],
						'salary' => $item['Official salary'],
						'date_from' => $date_salary_start,
						'date_to' => "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id,
						'salary_percentage' => 100,
						'basic_salary' => $item['Official salary']
					];
				}
			}
		}
		if (!empty($data_import_payroll_employee)) {
			$employeeModel->updateBatch($data_import_payroll_employee, 'id');
		}
		if (!empty($data_import_payroll_salary)) {
			$modules->setModule("employee_salary");
			$model = $modules->model;
			$model->setAllowedFields(["employee", "salary", "date_from", "date_to", "owner", "created_by", "updated_by", "salary_percentage", "basic_salary"]);
			$model->insertBatch($data_import_payroll_salary);
		}
		if (!empty($data_import_payroll_recurring)) {
			$modules->setModule("employee_recurring");
			$model = $modules->model;
			$model->setAllowedFields(["recurring", "employee", "valid_from", "valid_to", "owner", "created_by", "updated_by"]);
			$model->insertBatch($data_import_payroll_recurring);
		}

		foreach ($data_tab_contract['body'] as $item) {
			if (!empty($item) && !empty($item['Email']) && $dataEmployee = $employeeModel->getEmployeeByEmail($item['Email'])) {
				if (!in_array($dataEmployee['id'], $arr_id_employee)) continue;
				$data_import = $item;
				$data_import['employee'] = $dataEmployee['id'];
				if (!empty($item['Contract Type'])) {
					$data_import['contract_type'] = null;
					$modules->setModule("contract_type");
					$model = $modules->model;
					$data_db = $model->where('name', $item['Contract Type'])->asArray()->first();
					if ($data_db) {
						$data_import['contract_type'] = $data_db['id'];
					}
				}
				if (!empty($item['Employee Type'])) {
					$data_import['employee_type'] = null;
					$modules->setModule("employee_types");
					$model = $modules->model;
					$data_db = $model->where('name', $item['Employee Type'])->asArray()->first();
					if ($data_db) {
						$data_import['employee_type'] = $data_db['id'];
					}
				}
				if (!empty($item['Department'])) {
					$data_import['contract_department'] = null;
					$modules->setModule("departments");
					$model = $modules->model;
					$data_db = $model->where('name', $item['Department'])->asArray()->first();
					if ($data_db) {
						$data_import['contract_department'] = $data_db['id'];
					}
				}
				if (!empty($item['Contract Start date'])) {
					$data_import['contract_date_start'] = $this->convertDateExcel($item['Contract Start date']);
				}
				if (!empty($item['Contract End date'])) {
					$data_import['contract_date_end'] = $this->convertDateExcel($item['Contract End date']);
				}
				$appNumberModel = new AppAutoNumberModel();
				$data_import['contract_code'] = $appNumberModel->getCurrentNumber('contracts', 'contract_code')['result'];
				$data_import['insurance_salary'] = !empty($item['Insurance salary']) ? removeComma($item['Insurance salary']) : '';

				$modules->setModule("contracts");
				$model = $modules->model;
				$model->setAllowedFields(["employee", "contract_code", "contract_date_start", "contract_date_end", "contract_department", "employee_type", "contract_type", "owner", "created_by", "updated_by", "insurance_salary"]);
				$model->save($data_import);
				$contractId = $model->getInsertID();
				if (!empty($contractId)) {
					if (strtotime($data_import['contract_date_start']) <= strtotime($datetoday)) {
						$checkContract = $model->where('employee', $dataEmployee['id'])->where('contract_date_start <=', $datetoday)->orderBy('contract_date_start', 'desc')->asArray()->first();
						if ($checkContract) {
							$contractId = $checkContract['id'];
							$data_import = $checkContract;
						}
						$data_import['active'] = 1;
						$employeeController = new Employee();
						$employeeController->_handleSetEmployeeContractActive($dataEmployee['id'], $contractId, $data_import, true);
					}
				}

				$appNumberModel->increaseCurrentNumber(2);
			}
		}

		helper('app_select_option');
		$data_import_education = [];
		$modules->setModule("educations");
		$module = $modules->getModule();
		foreach ($data_tab_education['body'] as $item) {
			if (!empty($item) && !empty($item['Email']) && $dataEmployee = $employeeModel->getEmployeeByEmail($item['Email'])) {
				if (!in_array($dataEmployee['id'], $arr_id_employee)) continue;
				if (!empty($item['Academic Level 1']) || !empty($item['School 1']) || !empty($item['Major 1'])) {
					$data_import_education[] = [
						'employee' => $dataEmployee['id'],
						'edu_level' => getOptionValue($module, 'edu_level', $item['Academic Level 1'] ?? ""),
						'edu_school' => $item['School 1'] ?? "",
						'edu_major' => $item['Major 1'] ?? "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
				if (!empty($item['Academic Level 2']) || !empty($item['School 2']) || !empty($item['Major 2'])) {
					$data_import_education[] = [
						'employee' => $dataEmployee['id'],
						'edu_level' => getOptionValue($module, 'edu_level', $item['Academic Level 2'] ?? ""),
						'edu_school' => $item['School 2'] ?? "",
						'edu_major' => $item['Major 2'] ?? "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
				if (!empty($item['Academic Level 3']) || !empty($item['School 3']) || !empty($item['Major 3'])) {
					$data_import_education[] = [
						'employee' => $dataEmployee['id'],
						'edu_level' => getOptionValue($module, 'edu_level', $item['Academic Level 3'] ?? ""),
						'edu_school' => $item['School 3'] ?? "",
						'edu_major' => $item['Major 3'] ?? "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
				if (!empty($item['Academic Level 4']) || !empty($item['School 4']) || !empty($item['Major 4'])) {
					$data_import_education[] = [
						'employee' => $dataEmployee['id'],
						'edu_level' => getOptionValue($module, 'edu_level', $item['Academic Level 4'] ?? ""),
						'edu_school' => $item['School 4'] ?? "",
						'edu_major' => $item['Major 4'] ?? "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
			}
		}
		if (!empty($data_import_education)) {
			$model = $modules->model;
			$model->setAllowedFields(["employee", "edu_level", "edu_school", "edu_major", "owner", "created_by", "updated_by"]);
			$model->insertBatch($data_import_education);
		}

		$data_import_dependnets = [];
		foreach ($data_tab_dependents['body'] as $item) {
			if (!empty($item) && !empty($item['Email']) && $dataEmployee = $employeeModel->getEmployeeByEmail($item['Email'])) {
				if (!in_array($dataEmployee['id'], $arr_id_employee)) continue;
				if (!empty($item['Relationship status'])) {
					$modules->setModule("employees");
					$model = $modules->model;
					$model->setAllowedFields(["relationship_status"]);
					$saveData = [
						'id' => $dataEmployee['id'],
						'relationship_status' => null
					];
					foreach ($arr_metas['relationship_status']->field_options_values['values'] as $val_option) {
						if ($val_option['name'] == $item['Relationship status']) {
							$saveData['relationship_status'] = $val_option['id'];
							break;
						}
					}
					$model->save($saveData);
				}

				$modules->setModule("dependents");
				$module = $modules->getModule();
				if (!empty($item["husband/wife's name"]) || !empty($item["husband/wife's dob"]) || !empty($item["Identity card of husband/wife"])) {
					$data_import_dependnets[] = [
						'employee' => $dataEmployee['id'],
						'fullname' => $item["husband/wife's name"],
						'relationship' => getOptionValue($module, 'relationship', 'spouse'),
						'dob' => $this->convertDateExcel($item["husband/wife's dob"] ?? ""),
						'identity_card' => $item["Identity card of husband/wife"],
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
				if (!empty($item["Child's name 1"]) || !empty($item["Child's dob 1"])) {
					$data_import_dependnets[] = [
						'employee' => $dataEmployee['id'],
						'fullname' => $item["Child's name 1"],
						'relationship' => getOptionValue($module, 'relationship', 'son'),
						'dob' => $this->convertDateExcel($item["Child's dob 1"] ?? ""),
						'identity_card' => "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
				if (!empty($item["Child's name 2"]) || !empty($item["Child's dob 2"])) {
					$data_import_dependnets[] = [
						'employee' => $dataEmployee['id'],
						'fullname' => $item["Child's name 2"],
						'relationship' => getOptionValue($module, 'relationship', 'son'),
						'dob' => $this->convertDateExcel($item["Child's dob 2"] ?? ""),
						'identity_card' => "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
				if (!empty($item["Child's name 3"]) || !empty($item["Child's dob 3"])) {
					$data_import_dependnets[] = [
						'employee' => $dataEmployee['id'],
						'fullname' => $item["Child's name 3"],
						'relationship' => getOptionValue($module, 'relationship', 'son'),
						'dob' => $this->convertDateExcel($item["Child's dob 3"] ?? ""),
						'identity_card' => "",
						'owner' => $user_id,
						'created_by' => $user_id,
						'updated_by' => $user_id
					];
				}
			}
		}
		if (!empty($data_import_dependnets)) {
			$modules->setModule("dependents");
			$model = $modules->model;
			$model->setAllowedFields(["employee", "fullname", "relationship", "dob", "identity_card", "owner", "created_by", "updated_by"]);
			$model->insertBatch($data_import_dependnets);
		}
		/** end data_tab */

		return $this->respond(ACTION_SUCCESS);
	}

	public function payroll_get($employeeId)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('employee_salary');
		$modelSalary = $modules->model; // amount
		$listSalary = handleDataBeforeReturn($modules, $modelSalary->asArray()->where('employee', $employeeId)->orderBy('date_from ASC')->findAll(), true);
		$modules->setModule('employee_recurring');
		$modelRecurring = $modules->model;
		$listRecurring = handleDataBeforeReturn($modules, $modelRecurring->select('m_employee_recurring.id as key,m_employee_recurring.id as id,recurring ,employee ,m_employee_recurring.valid_from as valid_from,m_employee_recurring.valid_to as valid_to, amount,repeat_type ')->join('m_recurring', 'm_recurring.id = m_employee_recurring.recurring')->where('employee', $employeeId)->findAll(), true);

		$iSalary = 0;
		$salaryFM = [];
		$effective_end_salary = '';
		foreach ($listSalary as $key => $itemSa) {
			$itemSa['key'] = $key;
			$effective_end_salary = !$itemSa['date_to'] ? $itemSa['date_from'] : $itemSa['date_to'];
			if (!$itemSa['date_to'] || $itemSa['date_to'] == '0000-00-00' || $itemSa['date_to'] == '1970-01-01' || empty($itemSa['date_to'])) {
				$iSalary++;
				if (isset($listSalary[$key + 1]['date_from'])) {
					$itemSa['date_to'] = date("Y-m-d", strtotime($listSalary[$key + 1]['date_from'] . " -1 day"));
				}
				if (!isset($listSalary[$iSalary])) {
					$itemSa['date_to_next'] = "2099-12-01";
					$salaryFM[] = $itemSa;
					continue;
				}
				$itemSa['date_to_next'] = $listSalary[$iSalary]['date_from'];
				$salaryFM[] = $itemSa;
				continue;
			}
			$salaryFM[] = $itemSa;
			$iSalary++;
		}

		$result['employees_salary'] = array_reverse($salaryFM);
		$result['employees_recurring'] = $listRecurring;
		$result['effective_end_salary'] = $effective_end_salary;
		return $this->respond($result);
	}

	public function payroll_by_year_get()
	{
		$getPara = $this->request->getGet();
		$year = $getPara['year'];
		$employeeId = $getPara['employeeId'];

		$payroll = $this->getEmployeesPayroll($employeeId, $year);

		$result['employees_payroll'] = $payroll;
		return $this->respond($result);
	}

	public function add_recurring_post()
	{
		$modules = \Config\Services::modules();
		$modules->setModule('employee_recurring');
		$model = $modules->model;
		$data = $this->request->getPost();
		$arrRecurring = $data['arrRecurring'];
		$employeeId = $data['employeeId'];

		foreach ($arrRecurring as $val) {

			if (isset($val['checked']) && $val['checked'] === 'true') {
				$insert = [
					'recurring' => $val['id'],
					'valid_from' => $val['valid_from'],
					'valid_to' => $val['valid_to'],
					'employee' => $employeeId,
				];
				$dataHandle = handleDataBeforeSave($modules, $insert);
				$model->setAllowedFields($dataHandle['fieldsArray'])->save($dataHandle['data']);
			}
		}

		/* salary employee */
		if (isset($data['salary'])) {
			$modules->setModule('employee_salary');
			$model = $modules->model;
			$salaryInsert = [
				'employee' => $employeeId,
				'salary' => $data['salary'],
				'date_from' => $data['date_from'],
				'date_to' => isset($data['date_to']) ?? $data['date_to'],
			];
			$dataHandle = handleDataBeforeSave($modules, $salaryInsert);
			$model->setAllowedFields($dataHandle['fieldsArray'])->save($dataHandle['data']);

			/* update pay cycle*/

			$modules->setModule('pay_cycles');
			$payCycleModel = $modules->model;
			$pay_cycle = $payCycleModel->asArray()->orderBy('id', 'ASC')->first()['id'];
			if (isset($data['pay_cycle']) && $data['pay_cycle'] !== '') $pay_cycle = $data['pay_cycle'];

			$modules->setModule('employees');
			$modelEmployee = $modules->model;
			$modelEmployee->setAllowedFields(['pay_cycle'])->update($employeeId, ['pay_cycle' => $pay_cycle]);
		}
		return $this->respond(ACTION_SUCCESS);
	}

	public function update_recurring_post()
	{
		if (!mayAdd('employees')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}
		$modules = \Config\Services::modules();
		$modules->setModule('employee_recurring');
		$model = $modules->model;
		$data = $this->request->getPost();
		$model->setAllowedFields(['valid_from', 'valid_to']);
		$model->save($data);
		return $this->respond(ACTION_SUCCESS);
	}

	public function info_recurring_get($id)
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$modules->setModule('employee_recurring');
		$model = $modules->model;
		$info = $model->select('m_employee_recurring.id as id,recurring ,employee ,m_employee_recurring.valid_from as valid_from,m_employee_recurring.valid_to as valid_to, amount,m_recurring.valid_from as re_valid_from,m_recurring.valid_to as re_valid_to, repeat_type,repeat_number, m_recurring.end_date as end_date')->join('m_recurring', 'm_recurring.id = m_employee_recurring.recurring', 'left')->where('m_employee_recurring.id', $id)->first();
		$repeatTypeOP = getAppSelectOptions('recurring')['repeat_type'];
		$found_key = array_search($info->repeat_type, array_column($repeatTypeOP, 'value'));
		$info->repeat_type = $repeatTypeOP[$found_key]['name_option'];
		$result['data'] = $info;
		return $this->respond($result);
	}

	public function add_employee_view_post()
	{
		$metasUser = $this->getMetasUser();

		$getPara = $this->request->getPost();
		$setting = preference("employee_view");
		$key_next = 0;
		foreach ($setting as $key => $item) {
			$setting[$key]['active'] = false;
			$key_next = $item['key'];
		}
		$key_next++;
		$setting[] = [
			'key' => $key_next,
			'active' => true,
			'edit' => true,
			'title' => $getPara['title'],
			'description' => $getPara['description'],
			'filters' => $getPara['filters'],
			'tableFilters' => json_decode($getPara['tableFilters'], true),
			'metasUser' => $metasUser,
			'sortColumn' => $getPara['sortColumn'] ?? []
		];
		preference("employee_view", $setting);

		return $this->respond($setting);

		/*$setting = [
			0 => ['key' => 1, 'active' => false, 'edit' => false, 'title' => 'Default View', 'description' => 'All current employees', 'filters' => ['department_id' => '', 'office' => '', 'status' => '', 'job_title_id' => ''], 'tableFilters' => []],
			1 => ['key' => 2, 'active' => true, 'edit' => false, 'title' => 'Active Employees', 'description' => 'All current active employees', 'filters' => ['department_id' => '', 'office' => '', 'status' => '13', 'job_title_id' => ''], 'tableFilters' => []],
		];
		preference("employee_view", $setting);
		exit;*/
	}

	public function update_employee_view_post()
	{
		$metasUser = $this->getMetasUser();
		$getPara = $this->request->getPost();
		$setting = $this->handleUpdateEmployeeView($getPara['filters'], json_decode($getPara['tableFilters'], true), $metasUser, $getPara['sortColumn'] ?? null);
		return $this->respond($setting);
	}

	public function delete_employee_view_post()
	{
		$getPara = $this->request->getPost();
		$setting = preference("employee_view");
		$key_delete = $getPara['key'];
		$check_delete_active = false;
		foreach ($setting as $key => $item) {
			if ($key_delete == $item['key']) {
				if ($item['active']) {
					$check_delete_active = true;
				}
				unset($setting[$key]);
				break;
			}
		}
		if ($check_delete_active) {
			$setting[0]['active'] = true;
		}
		$setting = array_values($setting);
		preference("employee_view", $setting);

		return $this->respond(['data_setting' => $setting, 'check_delete_active' => $check_delete_active]);
	}

	public function update_employee_view_name_post()
	{
		$getPara = $this->request->getPost();
		$setting = preference("employee_view");
		$row = $getPara['row'];
		foreach ($setting as $key => $item) {
			if ($row['key'] == $item['key']) {
				$setting[$key]['title'] = $row[1];
				$setting[$key]['description'] = $row[2];
				break;
			}
		}
		preference("employee_view", $setting);

		return $this->respond($setting);
	}

	public function set_active_employee_view_get()
	{
		$getPara = $this->request->getGet();
		$setting = preference("employee_view");
		$key_active = $getPara['key'];
		$key_update = -1;
		$data_active = [];
		foreach ($setting as $key => $item) {
			if ($key_active == $item['key']) {
				$setting[$key]['active'] = true;
				$data_active = $setting[$key];
				$key_update = $key;
				continue;
			}
			$setting[$key]['active'] = false;
		}
		preference("employee_view", $setting);

		// update MetasUser
		$this->deleteMetasUser();
		$idModule = $this->module->moduleData->id;
		if (!empty($setting[$key_update]['metasUser'])) {
			$dataSaveMetasUser = [];
			foreach ($setting[$key_update]['metasUser'] as $item) {
				$dataSaveMetasUser[] = [
					"module_id" => $idModule,
					"user_id" => user_id(),
					"module_meta_id" => $item['id'],
					"field_table_show" => $item['field_table_show'],
					"field_table_order" => $item['field_table_order'],
					"field_table_width" => $item['field_table_width']
				];
			}
			$this->insertMetasUser($dataSaveMetasUser);
		}
		$module = \Config\Services::modules("employees");
		$module->getAllMetasUser(true);
		$module->getMetas("employees", true);

		helper('app_helper');
		$moduleData = modulesConstructs();
		return $this->respond(['data_employee_view' => $setting, 'data_active' => $data_active, 'moduleData' => $moduleData]);
	}

	public function get_setting_column_table_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule("employees");
		$metas = $modules->getMetas();
		$arrSettingColumn = [];
		foreach ($metas as $item) {
			if (isset($item->field_options['form']['tabId'])) {
				$arrSettingColumn[$item->field_options['form']['tabId']][] = $item;
			}
		}

		return $this->respond($arrSettingColumn);
	}

	public function save_setting_column_table_post()
	{
		$data = $this->request->getPost();
		$module = \Config\Services::modules("employees");
		if (empty($data)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}

		$array = [];
		foreach ($data as $key => $item) {
			if (!filter_var($item['defaultShow'], FILTER_VALIDATE_BOOLEAN)) {
				$array[] = [
					'module_id' => $module->moduleData->id,
					'module_meta_id' => $key,
					'field_table_show' => filter_var($item['checked'], FILTER_VALIDATE_BOOLEAN),
				];
			}
		}
		if (!empty($array)) {
			$module->updateMetasUser($array);
		}

		$this->handleUpdateEmployeeView(null, null, $this->getMetasUser());

		helper('app_helper');
		$moduleData = modulesConstructs();
		return $this->respond($moduleData);
	}

	public function update_employee_user_metas_post()
	{
		$module = \Config\Services::modules("employees");
		$data = $this->request->getPost('data');
		if (empty($data)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		$module->updateMetasUser($data);

		$this->handleUpdateEmployeeView(null, null, $this->getMetasUser());

		helper('app_helper');
		$moduleData = modulesConstructs();
		return $this->respond($moduleData);
	}

	public function in_department_get()
	{
		$request = $this->request->getGet();
		$employeeModel = new EmployeesModel();
		if (isset($request['department_id']) && $request['department_id']) {
			$employeeModel->whereIn('department_id', $request['department_id']);
		}

		if (isset($request['job_title_id']) && $request['job_title_id']) {
			$employeeModel->whereIn('job_title_id', $request['job_title_id']);
		}
		$list = $employeeModel->findAll();
		$idArr = array_column($list, 'id');
		return $this->respond($idArr);
	}

	public function load_approve_post_get()
	{
		$authorize = \Config\Services::authorization();
		$employeeModel = new EmployeesModel();
		$builder = $employeeModel->asArray()->exceptResignedEmployee();
		$data = $builder->findAll();
		$arrHasPer = [];
		foreach ($data as $user):
			$isSuper = $authorize->hasPermission('sys.superpower', $user['id']);
			if ($isSuper) {
				$arrHasPer[] = $user;
			} else {
				$checkPer = $authorize->hasPermission('modules.feed.ApprovalPost', $user['id']);
				if ($checkPer) {
					$arrHasPer[] = $user;
				}
			}

		endforeach;
		$dataHandle = handleDataBeforeReturn('employees', $arrHasPer, true);
		$userSelected = preference('feed_approval_post_notification_user');
		$arrSelected = [];
		foreach ($dataHandle as $key => $val):
			$dataHandle[$key]['label'] = $val['full_name'];
			$dataHandle[$key]['tag'] = $val['email'];
			$dataHandle[$key]['value'] = $val['id'] . "_employee";
			if (in_array($val['id'], $userSelected)) {
				$arrSelected[] = $dataHandle[$key];
			}
		endforeach;
		$dataReturn['userSelected'] = $arrSelected;
		$dataReturn['userData'] = $dataHandle;
		return $this->respond($dataReturn);

	}

	public function save_setting_approve_feed_post()
	{
		$getPost = $this->request->getPost();
		$Users = $getPost['users'];
		preference('feed_approval_post_notification_user', $Users, true);
		return $this->respond(1);
	}

	/**
	 *  support function
	 */
	private function getLevel($data, $parent = 0, $recursive = false)
	{
		$return = array();
		foreach ($data as $key => $item) {
			if (!is_numeric($item['line_manager'])) $item['line_manager'] = 0;
			if ((int)$item['line_manager'] == (int)$parent) {
				$children = $this->getLevel($data, $item['id']);
				$newItem = [
					'id' => $item['id'],
					'person' => [
						'id' => $item['id'],
						'avatar' => $item['avatar'],
						'name' => $item['full_name'],
						'department' => $item['department'],
						'title' => $item['title'],
						'totalReports' => count($children),
						'link' => '/employees/u/' . $item['username']
					],
					'hasChild' => true,
					'hasParent' => true
				];
				if ($recursive) $newItem['children'] = $children;
				$return[] = $newItem;
			}
		}
		return $return;
	}

	private function getEmployeesPayroll($employeeId, $year)
	{
		$data = [];
		$date_from_year = $year . "-01-01";
		$date_to_year = $year . "-12-31";
		$modules = \Config\Services::modules();
		$modules->setModule("payrolls");
		$model = $modules->model;
		$listPayrolls = $model->asArray()->where("(date_from <= '$date_to_year' and date_to >= '$date_from_year')")->orderBy('id', 'desc')->findAll();
		$payrollController = new Payrolls();
		foreach ($listPayrolls as $item) {
			$payrollId = $item['id'];
			$dataPayroll = $payrollController->getTablePayroll($payrollId, 'all_type', '', $employeeId);
			$arr = $dataPayroll['data_table'][$employeeId] ?? [];
			$arr["employee_name"] = $item['name'];
			$arr["payroll_id"] = $payrollId;
			$arr["closed"] = $item['closed'];

			$data[] = $arr;
		}

		return ["data_payroll" => $data, "total_row" => count($data)];
	}

	private function _handleRemoveChecklistEmployeeOffboarding($employeeId)
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$modules->setModule('checklist');
		$model = $modules->model;

		//handle delete
		$model->where('type', getOptionValue('checklist', 'type', 'onboarding'))
			->where('employee_id', $employeeId)
			->delete();
	}

	private function getArrColumnExcel($metas)
	{
		$modules = \Config\Services::modules();
		$arr_column = [];
		$arr_column_payroll_employee = [];
		$arr_column_payroll['general'] = ["STT", "Name ", "Email"];
		$arr_column_contract = ['STT', 'Name ', 'Email', 'Contract Type', 'Employee Type', 'Department', 'Contract Start date', 'Contract End date', 'Insurance salary'];
		$arr_column_education = ['STT', 'Name ', 'Email', 'Academic Level 1', 'School 1', 'Major 1', 'Academic Level 2', 'School 2', 'Major 2', 'Academic Level 3', 'School 3', 'Major 3', 'Academic Level 4', 'School 4', 'Major 4'];
		$arr_column_dependents = ["STT", "Name ", "Email", "Relationship status", "husband/wife's name", "husband/wife's dob", "Identity card of husband/wife", "Child's name 1", "Child's dob 1", "Child's name 2", "Child's dob 2", "Child's name 3", "Child's dob 3"];
		$arr_select = [];
		$arr_select_modules = [];
		$arr_select_modules_ = [];
		$arr_select_options = [];
		foreach ($metas as $item) {
			if ((!isset($item->field_options['import']) || (isset($item->field_options['import']) && $item->field_options['import'])) && (!isset($item->field_options['form']['tabId']) || (isset($item->field_options['form']['tabId']) && $item->field_options['form']['tabId'] != 'payroll'))) {
				$arr_column[] = $item;

				if ($item->field_type == 'select_option') {
					$arr_select[] = [
						"type" => "option",
						"field" => $item->field
					];
					$arr_select_options[$item->field] = $item;
				}

				if ($item->field_type == 'select_module') {
					$arr_select[] = [
						"type" => "module",
						"field" => $item->field
					];
					$arr_select_modules_[$item->field] = $item;
				}
			}

			if ((!isset($item->field_options['import']) || (isset($item->field_options['import']) && $item->field_options['import'])) && isset($item->field_options['form']['tabId']) && $item->field_options['form']['tabId'] == 'payroll') {
				$arr_column_payroll['payroll'][] = $item->field;
				$arr_column_payroll_employee[$item->field] = $item;
			}

			if ($item->field == 'relationship_status' && $item->field_type == 'select_option') {
				$arr_select[] = [
					"type" => "option",
					"field" => $item->field
				];
				$arr_select_options[$item->field] = $item;
			}
		}
		$arr_column_payroll['payroll'][] = "Probationary salary";
		$arr_column_payroll['payroll'][] = "Official salary";
		$modules->setModule("recurring");
		$model = $modules->model;
		$listRecurring = $model->asArray()->findAll();
		$arr_column_payroll['recurring'] = [];
		foreach ($listRecurring as $item) {
			$arr_column_payroll['recurring'][] = $item['name'] . "_" . round($item['amount'], 2) . "_" . $item['id'];
		}

		$out['arr_column'] = $arr_column;
		$out['arr_column_payroll_employee'] = $arr_column_payroll_employee;
		$out['arr_column_payroll'] = $arr_column_payroll;
		$out['arr_column_contract'] = $arr_column_contract;
		$out['arr_column_education'] = $arr_column_education;
		$out['arr_column_dependents'] = $arr_column_dependents;
		$out['arr_select'] = $arr_select;
		$out['arr_select_modules'] = $arr_select_modules;
		$out['arr_select_modules_'] = $arr_select_modules_;
		$out['arr_select_options'] = $arr_select_options;

		return $out;
	}

	private function renderColumnDropdownExcel($sheet, $arr_alphabet, $i, $j, $k, $start, $end)
	{
		$validation = $sheet->getCell($arr_alphabet[$j] . $i)
			->getDataValidation();
		$validation->setSqref($arr_alphabet[$j] . $i . ':' . $arr_alphabet[$j] . '300');
		$validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
		$validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
		$validation->setAllowBlank(false);
		$validation->setShowInputMessage(true);
		$validation->setShowErrorMessage(true);
		$validation->setShowDropDown(true);
		$validation->setErrorTitle('Input error');
		$validation->setError('Value is not in list.');
		$validation->setFormula1('\'Master Data\'!$' . $arr_alphabet[$k] . '$' . $start . ':$' . $arr_alphabet[$k] . '$' . $end);

		return $validation;
	}

	private function renderColumnCalculateExcel($sheet, $arr_alphabet, $j, $col_probationary_salary_percent, $col_official_salary)
	{
		for ($i = 2; $i <= 300; $i++) {
			$sheet->setCellValue("$arr_alphabet[$j]$i", "=$arr_alphabet[$col_probationary_salary_percent]$i*$arr_alphabet[$col_official_salary]$i/100");
		}

		return $sheet;
	}

	private function getValueFromMetasDataExcel($data_metas, $value)
	{
		$data_import = $value;
		$modules = \Config\Services::modules();
		if ($data_metas->field_type == 'date') {
			$date = explode("/", $value);
			if (!empty($date) && isset($date[2])) {
				$value = "$date[2]-$date[1]-$date[0]";
			}
		}
		if ($data_metas->field_type == 'int' && isset($value) && !empty($value)) $data_import = removeComma($value);
		if ($data_metas->field_type == 'decimal' && isset($value) && !empty($value)) $data_import = removeComma($value);
		if ($data_metas->field_type == 'date' && isset($value) && !empty($value)) $data_import = date('Y-m-d', strtotime($value));
		if ($data_metas->field_type == 'datetime' && isset($value) && !empty($value)) $data_import = date('Y-m-d H:i:s', strtotime($value));
		if ($data_metas->field_type == 'time' && isset($value) && !empty($value)) $data_import = date('H:i:s', strtotime($value));

		if ($data_metas->field_type == 'select_option') {
			$data_import = null;
			foreach ($data_metas->field_options_values['values'] as $val_option) {
				if ($val_option['name'] == $value) {
					$data_import = $val_option['id'];

					break;
				}
			}
		}
		if ($data_metas->field_type == 'select_module') {
			$data_import = null;
			$field_select_module = $data_metas->field_select_module;
			$field_select_field_show = $data_metas->field_select_field_show;
			$modules->setModule($field_select_module);
			$model = $modules->model;
			$data_select = $model->select(["$field_select_field_show as label", "id"])->findAll();
			foreach ($data_select as $val_option) {
				if ($val_option->label == $value) {
					$data_import = $val_option->id;

					break;
				}
			}
		}

		if ($data_metas->field_type == 'switch') {
			if ($value == 'Yes') {
				$data_import = 1;
			} else {
				$data_import = 0;
			}
		}

		return $data_import;
	}

	private function convertDateExcel($value)
	{
		$date = explode("/", $value);
		if (!empty($date) && isset($date[2])) {
			return "$date[2]-$date[1]-$date[0]";
		}

		return "";
	}

	private function getMetasUser()
	{
		$idModule = $this->module->moduleData->id;
		$model = new AppModel();
		return $model->setTable("modules_metas_users")->select(["module_meta_id as id", "field_table_show", "field_table_order", "field_table_width"])->where("module_id", $idModule)->where("user_id", user_id())->asArray()->findAll();
	}

	private function deleteMetasUser()
	{
		$idModule = $this->module->moduleData->id;
		$model = new AppModel();
		$model->setTable("modules_metas_users")->where("module_id", $idModule)->where("user_id", user_id())->delete();
		return true;
	}

	private function insertMetasUser($data)
	{
		$model = new MetaModel();
		$model->setTable("modules_metas_users")->setAllowedFields(["module_id", "user_id", "module_meta_id", "field_table_show", "field_table_order", "field_table_width"]);
		$model->insertBatch($data);
		return true;
	}

	private function handleUpdateEmployeeView($filters = null, $tableFilters = null, $metasUser = null, $sortColumn = null)
	{
		$setting = preference("employee_view");
		$key_active = 0;
		foreach ($setting as $key => $item) {
			if ($item['active']) {
				$key_active = $key;
				break;
			}
		}
		if ($key_active <= 1) {
			return $setting;
		}

		if (is_array($filters)) {
			$setting[$key_active]['filters'] = $filters;
		}
		if (is_array($tableFilters)) {
			$setting[$key_active]['tableFilters'] = $tableFilters;
		}
		if (is_array($metasUser)) {
			$setting[$key_active]['metasUser'] = $metasUser;
		}
		if (is_array($sortColumn)) {
			$setting[$key_active]['sortColumn'] = $sortColumn;
		}
		preference("employee_view", $setting);

		return $setting;
	}

	public function add_custom_field_post()
	{
		$modules = \Config\Services::modules('employees');
		$forge = \Config\Database::forge();
		$postData = $this->request->getPost();

		// add field to metas
		$metaData = $this->_handleDataCustomField($postData, $modules->moduleData->id);
		$modules->saveMeta($metaData, $modules->moduleData->id);

		// add field to table
		$fieldTypeDef = $modules->getFieldTypeDef();
		$forgeData = [
			$this->_safeFieldName($postData['name']) => $fieldTypeDef[$this->_getFieldType($postData['type']['value'])]
		];

		$forge->addColumn('m_employees', $forgeData);

		$modules->getMetas('employees', true);
		$modules->getAllMetasUser(true);

		return $this->respond(ACTION_SUCCESS);
	}

	public function load_tab_content_get()
	{
		$modules = \Config\Services::modules('employees');
		$getData = $this->request->getGet();
		$tab = $getData['tab'];

		$result = [];
		$listField = $modules->getMetas();
		if (count($listField) == 0) {
			return $this->respond([
				'results' => []
			]);
		}

		foreach ($listField as $row) {
			$row = (array)$row;
			$fieldOption = $row['field_options'];
			if (!isset($fieldOption['is_custom_field'])) {
				continue;
			}
			if ($fieldOption['form']['tabId'] == $tab) {
				$dataPush = $row;
				$isMultiple = isset($row['field_options']['multiple']) ? $row['field_options']['multiple'] : false;
				$dataPush['field_type'] = $this->_convertFieldType($row['field_type'], $isMultiple);
				$result[] = $dataPush;
			}
		}

		return $this->respond([
			'results' => $result
		]);
	}

	public function load_custom_field_detail_post($id)
	{
		$modules = \Config\Services::modules('employees');

		return $this->respond([
			'data' => $this->_getCustomFieldById($modules, $id)
		]);
	}

	public function update_custom_field_post($id)
	{
		$modules = \Config\Services::modules('employees');
		$postData = $this->request->getPost();

		$metaData = $this->_getCustomFieldById($modules, $id);
		$fieldOption = $this->_getFieldOption($postData);
		$metaData['field_options']['name_show'] = $fieldOption['name_show'];
		$metaData['field_options']['show_in_hiring'] = $fieldOption['show_in_hiring'];
		$metaData['field_options']['show_in_onboarding'] = $fieldOption['show_in_onboarding'];
		$metaData['field_options']['required_field'] = $fieldOption['required_field'];
		$metaData['field_options_values'] = [
			'values' => $this->_getFieldOptionValue($postData),
			'default' => '',
		];
		$metaData['field_type'] = $this->_getFieldType($metaData['field_type']);
		$metaData['id'] = $id;
		$modules->saveMeta($metaData, $modules->moduleData->id);

		$modules->getMetas('employees', true);
		$modules->getAllMetasUser(true);

		return $this->respond(ACTION_SUCCESS);
	}

	public function delete_custom_field_post($id)
	{
		$modules = \Config\Services::modules('employees');
		$forge = \Config\Database::forge();
		$modules->deleteMeta($id);

		// delete column
		$fieldInfo = $this->_getCustomFieldById($modules, $id);
		$forge->dropColumn('m_employees', [$fieldInfo['field']]);

		$modules->getMetas('employees', true);
		$modules->getAllMetasUser(true);

		return $this->respond(ACTION_SUCCESS);
	}

	public function load_auto_generate_code_get()
	{
		$model = new AppAutoNumberModel();

		$params = $this->request->getGet();
		$result = $model->getCurrentNumber($params['module'], $params['field']);

		return $this->respond([
			'data' => $result
		]);
	}

	public function update_auto_generate_code_post($id)
	{
		$model = new AppAutoNumberModel();
		$postData = $this->request->getPost();
		$postData['id'] = $id;
		$result = $model->updateAutoNumber($postData);
		if (!$result) {
			return $this->fail(FAILED_SAVE);;
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function update_employee_status_post($id)
	{
		$modules = \Config\Services::modules('employees');
		$model = $modules->model;

		$postData = $this->request->getPost();
		try {
			$this->updateEmployee($id, $postData);
		} catch (\Exception $e) {
			return $this->fail($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_over_view_employee_get()
	{
		$employeeService = \HRM\Modules\Employees\Libraries\Employees\Config\Services::employees();
		$result = $employeeService->getOverviewEmployee();

		return $this->respond($result);
	}

	private function _handleDataCustomField($data, $modulesId)
	{
		$result = [
			'field' => $this->_safeFieldName($data['name']),
			'field_type' => $this->_getFieldType($data['type']['value']),
			'field_default_value' => '',
			'field_detail_order' => 0,
			'field_detail_show' => false,
			'field_enable' => true,
			'field_filter_order' => '0',
			'field_filter_show' => false,
			'field_form_col_size' => '6',
			'field_form_order' => 0.1,
			'field_form_require' => false,
			'field_form_show' => true,
			'field_form_unique' => false,
			'field_icon' => '',
			'field_icon_type' => '',
			'field_options' => $this->_getFieldOption($data),
			'field_options_values' => [
				'values' => $this->_getFieldOptionValue($data),
				'default' => ""
			],
			'field_quick_form_show' => false,
			'field_quick_view_order' => 0,
			'field_quick_view_show' => false,
			'field_readonly' => false,
			'field_select_field_show' => false,
			'field_select_module' => false,
			'field_table_order' => '999',
			'field_table_show' => false,
			'field_table_sortable' => false,
			'field_table_width' => '0',
			'field_validate_rules' => null,
			'moduleName' => 'employees',
			'module' => $modulesId
		];


		return $result;
	}

	private function _getFieldType($type)
	{
		switch ($type) {
			case 'single_line_text':
				return 'text';
				break;
			case 'multi_line_text':
				return 'textarea';
				break;
			case 'dropdown':
				return 'select_option';
				break;
			case 'multiple_selection':
				return 'select_option';
				break;
			case 'number':
				return 'number_int';
				break;
			case 'yes_no':
				return 'switch';
				break;
			case 'date':
				return 'date';
				break;
			default:
				return '';
				break;
		}
	}

	private function _convertFieldType($type, $isMultiple)
	{
		switch ($type) {
			case 'text':
				return 'single_line_text';
				break;
			case 'textarea':
				return 'multi_line_text';
				break;
			case 'select_option':
				if ($isMultiple) {
					return 'multiple_selection';
				}
				return 'dropdown';
				break;
			case 'number_int':
				return 'number';
				break;
			case 'switch':
				return 'yes_no';
				break;
			case 'date':
				return 'date';
				break;
			default:
				return '';
				break;
		}
	}

	private function _getFieldOption($data)
	{
		$tabId = $data['tab'];
		if ($tabId == 'bank') {
			$tabId = 'bankaccount';
		}
		$result = [
			'is_custom_field' => true,
			'name_show' => $data['name'],
			'form' => [
				'tabId' => $tabId
			]
		];

		if ($data['type']['value'] == 'multiple_selection') {
			$result['multiple'] = true;
		} elseif ($data['type']['value'] == 'dropdown') {
			$result['multiple'] = false;
		}
		$result['show_in_hiring'] = $data['show_in_hiring'] == 'true';
		$result['show_in_onboarding'] = $data['show_in_onboarding'] == 'true';
		$result['required_field'] = $data['required_field'] == 'true';
		$result['option_values'] = $this->_getFieldOptionValue($data, false);

		return $result;
	}

	private function _getFieldOptionValue($data, $safeName = true)
	{
		if (
			!isset($data['list_option'])
			|| empty($data['list_option'])
			|| ($data['type']['value'] != 'dropdown'
				&& $data['type']['value'] != 'multiple_selection')
		) {
			return [];
		}

		$result = [];
		foreach ($data['list_option'] as $row) {
			if ($safeName) {
				$result[] = [
					'name' => $this->_safeFieldName($row['value'])
				];
			} else {
				$result[] = [
					'key' => $this->_safeFieldName($row['value']),
					'name' => $row['value']
				];
			}
		}

		return $result;
	}

	private function _safeFieldName($fieldName)
	{
		$fieldName = create_slug($fieldName);
		$fieldName = str_replace('-', '_', $fieldName);
		return $fieldName;
	}

	private function _getCustomFieldById($modules, $id)
	{
		$listField = $modules->getMetas();

		$info = [];
		foreach ($listField as $row) {
			$row = (array)$row;
			if ($row['id'] == $id) {
				$dataPush = $row;
				$isMultiple = isset($row['field_options']['multiple']) ? $row['field_options']['multiple'] : false;
				$dataPush['field_type'] = $this->_convertFieldType($row['field_type'], $isMultiple);

				$info = $dataPush;
				break;
			}
		}

		return $info;
	}
}
