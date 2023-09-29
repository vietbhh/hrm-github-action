<?php

namespace HRM\Modules\Employees\Config;

use App\Models\AppAutoNumberModel;
use Exception;
use HRM\Controllers\Search;
use ReflectionException;
use App\Models\SettingModel;

class Events
{

	/**
	 * @throws ReflectionException
	 * @throws Exception
	 */
	public function afterInsertEmployeeEvent($dataSaveEmployee)
	{
		// add new contracts
		/*$appNumberModel = new AppAutoNumberModel();
		$modules = \Config\Services::modules("contracts");
		$contractsModel = $modules->model;
		$contractsModel->setAllowedFields(["employee", "contract_code", "contract_type", "contract_date_start", "contract_job_title", "contract_department", "active"]);
		$dataContractSave = [
			"employee" => $dataSaveEmployee['id'],
			"contract_code" => $appNumberModel->getCurrentNumber('contracts', 'contract_code')['result'],
			"contract_type" => 0,
			"contract_date_start" => $dataSaveEmployee['join_date'],
			"contract_job_title" => $dataSaveEmployee['job_title_id'],
			"contract_department" => $dataSaveEmployee['department_id'],
			"active" => 1
		];
		$contractsModel->save($dataContractSave);
		$appNumberModel->increaseCurrentNumber(2);*/

		// employee history
		$dataEmployeeHistory['dataEmployeeHistory'] = [
			'employeeId' => $dataSaveEmployee['id'],
			'typeCreate' => 'joining',
			'dataEmployee' => $dataSaveEmployee
		];
		$this->onUpdateEmployeeEvent($dataEmployeeHistory);

		// time-off
		$listEmployee[] = $dataSaveEmployee;
		$timeOff = \HRM\Modules\TimeOff\Libraries\TimeOff\Config\Services::TimeOff();
		$timeOff->updateEmployeeBalance($listEmployee, true);

		// auto add employee to group
		$employeeGroupService = \HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups\Config\Services::employeeGroups();
		$employeeGroupService->autoAddEmployeeToGroup($dataSaveEmployee['id']);

		// cache data employee search
		$searchController = new Search();
		$searchController->cacheDataEmployeeSearch();
	}

	/**
	 * @param array $params
	 * @throws Exception
	 */
	public function onUpdateEmployeeEvent(array $params)
	{
		/**
		 * employee history
		 */
		if (isset($params['dataEmployeeHistory'])) {
			$dataEmployeeHistory = $params['dataEmployeeHistory'];
			$employeeId = $dataEmployeeHistory['employeeId'];
			$typeCreate = $dataEmployeeHistory['typeCreate'];
			$dataEmployee = $dataEmployeeHistory['dataEmployee'];
			$dataInsert = [];
			$modules = \Config\Services::modules();

			if ($typeCreate == 'changed') {
				$modules->setModule("employees");
				$metas = $modules->getMetas();
				$model = $modules->model;
				$employee = $model->asArray()->find($employeeId);
				$employeeHandle = handleDataBeforeReturn($modules, $employee);
				$employment['department'] = $employeeHandle['department_id'];
				$employment['job_title_id'] = $employeeHandle['job_title_id'];
				$employment['employee_type'] = $employeeHandle['employee_type'];


				foreach ($metas as $item_meta) {
					$field = $item_meta->field;
					if (isset($dataEmployee[$field])) {
						$check_date = strpos($field, 'date');
						$old_data = $employee[$field] ?? "";
						$new_data = $dataEmployee[$field] ?? "";

						if ($field === 'department_id') {
							$employment['department']['value'] = $new_data;
						}
						if ($field === 'job_title_id') {
							$employment['job_title_id']['value'] = $new_data;
						}
						if ($field === 'employee_type') {
							$employment['employee_type']['value'] = $new_data;
						}
						if ($check_date !== false) {
							$old_data = $old_data == "0000-00-00" ? "" : $old_data;
							$new_data = $new_data == "0000-00-00" ? "" : $new_data;
						}

						if ($old_data != $new_data) {
							if ($item_meta->field_type == 'select_option') {
								$list_option = $item_meta->field_options_values['values'];
								$data_option = [];
								foreach ($list_option as $item_option) {
									$data_option[$item_option['id']] = $item_option['name'];
								}
								$old_data = $data_option[$old_data] ?? "";
								$new_data = $data_option[$new_data] ?? "";
							}

							if ($item_meta->field_type == 'select_module') {
								$field_select_module = $item_meta->field_select_module;
								$field_select_field_show = $item_meta->field_select_field_show;
								$modules->setModule($field_select_module);
								$model = $modules->model;
								$data = $model->select(["$field_select_field_show as label", "id"])->asArray()->findAll();
								$data_option = [];
								foreach ($data as $item_module) {
									$data_option[$item_module['id']] = $item_module['label'];
								}
								$old_data = $data_option[$old_data] ?? "";
								$new_data = $data_option[$new_data] ?? "";
							}
							if ($field === 'department_id') {
								$employment['department']['label'] = $new_data;
							}
							if ($field === 'job_title_id') {
								$employment['job_title_id']['label'] = $new_data;
							}
							if ($field === 'employee_type') {
								$employment['employee_type']['label'] = $new_data;
							}

							$dataInsert[] = [
								'field' => $field,
								'from' => $old_data,
								'to' => $new_data,
								'employment' => ($field === 'department_id' || $field === 'job_title_id' || $field === 'employee_type') ? json_encode($employment) : ""
							];
						}
					}
				}
			}

			if ($typeCreate == 'joining') {
				$departmentModules = \Config\Services::modules("departments");
				$departmentModel = $departmentModules->model;
				$dataDepartment_db = $departmentModel->select("id as value, name as label")->asArray()->findAll();
				$arr_department = [];
				foreach ($dataDepartment_db as $item) {
					$arr_department[$item['value']] = $item['label'];
				}

				$jobTitleModules = \Config\Services::modules("job_titles");
				$jobTitleModel = $jobTitleModules->model;
				$dataJobTitle_db = $jobTitleModel->select("id as value, name as label")->asArray()->findAll();
				$arr_job_title = [];
				foreach ($dataJobTitle_db as $item) {
					$arr_job_title[$item['value']] = $item['label'];
				}

				$department = empty($dataEmployee['department_id']) ? "" : $dataEmployee['department_id'];
				$job_title = empty($dataEmployee['job_title_id']) ? "" : $dataEmployee['job_title_id'];

				$modules->setModule("employees");
				$model = $modules->model;
				$employee = $model->asArray()->find($employeeId);
				$employeeHandle = handleDataBeforeReturn($modules, $employee);
				$employment['department'] = $employeeHandle['department_id'];
				$employment['job_title_id'] = $employeeHandle['job_title_id'];
				$employment['employee_type'] = $employeeHandle['employee_type'];
				$dataInsert[] = [
					'department' => $arr_department[$department] ?? "",
					'job_title' => $arr_job_title[$job_title] ?? "",
					'date' => empty($dataEmployee['date']) ? date("Y-m-d") : $dataEmployee['date'],
					'employment' => json_encode($employment),
				];
			}

			if (!empty($dataInsert)) {
				$employeeService = \HRM\Modules\Employees\Libraries\Employees\Config\Services::employees();
				$employeeService->createNewEmployeeHistory($employeeId, $typeCreate, $dataInsert);
			}
		}

		/**
		 * @param array $dataSaveEmployee
		 * time-off
		 */
		if (isset($params['dataSaveEmployee'])) {
			$dataSaveEmployee = $params['dataSaveEmployee'];
			$modulesEmployees = \Config\Services::modules("employees");
			$employeeModel = $modulesEmployees->model;
			$listEmployee = $employeeModel->where('id', $dataSaveEmployee['id'])->asArray()->findAll();
			$timeOff = \HRM\Modules\TimeOff\Libraries\TimeOff\Config\Services::TimeOff();
			$timeOff->updateEmployeeBalance($listEmployee, true);

			// auto add employee to group
			$employeeGroupService = \HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups\Config\Services::employeeGroups();
			$employeeGroupService->autoAddEmployeeToGroup($dataSaveEmployee['id']);

			// update employee workgroup and chat group
			$this->_handleUpdateWorkgroupAndChatGroup($params['dataSaveEmployee']);
		}

		/**
		 * @param array $dataSaveEmployee
		 * time-off
		 */
	}

	public function updateLineManager($dataSave)
	{
		$modules = \Config\Services::modules();
		$modules->setModule("departments");
		$model = $modules->model;
		$listDepartment = $model->asArray()->orderBy('id ASC')->findAll();
		$allParent = $this->find_parents($listDepartment, $dataSave['department_id']);
		$idParentUpdate = preference('app_owner');

		foreach ($allParent as $val) :
			if ($val['line_manager'] && $val['line_manager'] != $dataSave['id']) {
				$idParentUpdate = $val['line_manager'];
				break;
			}
		endforeach;
		$modules->setModule("employees");
		$model = $modules->model;
		$model->setAllowedFields(['department_id', 'line_manager', 'id']);
		$dataSave['line_manager'] = $idParentUpdate;
		$params['dataEmployeeHistory'] = [
			'employeeId' => $dataSave['id'],
			'typeCreate' => 'changed',
			'dataEmployee' => [
				'line_manager' => $idParentUpdate,
				'id' => $dataSave['id']
			]
		];
		$this->onUpdateEmployeeEvent($params);

		$model->save($dataSave);
	}

	/**
	 * @param array $dataSaveEmployee (include employee_id and department_id)
	 * remove user from old workgroup and chat group
	 * add user to new workgroup and chat group
	 * -- get workgroup_id by department.custom_fields.workgroup_id
	 */
	private function _handleUpdateWorkgroupAndChatGroup($dataSaveEmployee)
	{
		helper('app_select_option');
		$employeeId = isset($dataSaveEmployee['id']) ? $dataSaveEmployee['id'] : 0;
		$modules = \Config\Services::modules('employees');
		$model = $modules->model;
		$infoEmployee = $model->asArray()->find($employeeId);
		if (!$infoEmployee) {
			return false;
		}

		if ($infoEmployee['account_status'] != getOptionValue('employees', 'account_status', 'activated')) {
			return [
				'success' => false,
				'msg' => 'employee is not activated'
			];
		}

		$departmentId = isset($dataSaveEmployee['department_id']) ? $dataSaveEmployee['department_id'] : 0;
		if (intval($infoEmployee['department_id']) !== intval($departmentId)) {
			if (empty($employeeId) || empty($departmentId)) {
				return [
					'success' => false,
					'msg' => 'empty user id or department_id'
				];
			}

			$departmentAdd = $departmentId;
			$departmentRemove = $infoEmployee['department_id'];

			return $this->_updateWorkgroupAndChatGroup($employeeId, $departmentAdd, $departmentRemove);
		}
	}

	public function onUpdateAccountStatusUser($userInfo)
	{
		$modules = \Config\Services::modules('users');
		$model = $modules->model;
		$infoEmployee = $model->asArray()->find($userInfo->id);
		if (!$infoEmployee) {
			return false;
		}
		$isRemove = $infoEmployee['account_status'] == 'deactivated';
		$departmentAdd = !$isRemove ? $infoEmployee['department_id'] : null;
		$departmentRemove = $isRemove ? $infoEmployee['department_id'] : null;

		$result = $this->_updateWorkgroupAndChatGroup($userInfo->id, $departmentAdd, $departmentRemove, true, $isRemove);

		return $result;
	}

	private function _updateWorkgroupAndChatGroup($employeeId, $departmentAdd, $departmentRemove, $isAccountStatusChange = false, $isRemove = false)
	{
		$modulesDepartment = \Config\Services::modules('departments');
		$modelDepartment = $modulesDepartment->model;

		$workspaceAdd = null;
		if ($departmentAdd != null) {
			$infoDepartment = $modelDepartment
				->asArray()
				->select(['id', 'custom_fields'])
				->where('id', $departmentAdd)
				->first();
			$customField = !isset($infoDepartment['custom_fields']) || $infoDepartment['custom_fields'] == null ? [] : json_decode($infoDepartment['custom_fields'], true);
			$workspaceAdd = isset($customField['workgroup_id']) && !empty($customField['workgroup_id']) ? $customField['workgroup_id'] : null;
		}

		// ** remove from old workgroup and chat group
		$workspaceRemove = null;
		if ($departmentRemove != null) {
			$infoOldDepartment = $modelDepartment
				->asArray()
				->select(['id', 'custom_fields'])
				->where('id', $departmentRemove)
				->first();
			$customFieldOld = !isset($infoOldDepartment['custom_fields']) || $infoOldDepartment['custom_fields'] == null ? [] : json_decode($infoOldDepartment['custom_fields'], true);
			$workspaceRemove = isset($customFieldOld['workgroup_id']) && !empty($customFieldOld['workgroup_id']) ? $customFieldOld['workgroup_id'] : null;
		}

		$nodeServer = \Config\Services::nodeServer();

		$commonChat = null;
		if ($isAccountStatusChange == true) {
			$settingModel = new SettingModel();
			$infoSetting = $settingModel->asArray()->where('key', 'company_chat_group')->first();
			if ($infoSetting && isset($infoSetting['value']) && $infoSetting['value'] !== null) {
				$commonChat = $infoSetting['value'];
			}
		}

		$result = $nodeServer->node->post('/workspace/update-workspace-member-and-chat-group', [
			'json' => [
				'employee_id' => $employeeId,
				'workspace_add' => $workspaceAdd,
				'workspace_remove' => $workspaceRemove,
				'common_chat_group' => $commonChat,
				'is_remove_common_chat_group' => $isRemove
			]
		]);

		return json_decode($result->getBody());
	}


	private function find_parents(array $dataDepartments, $idParent)
	{
		$all = [];
		foreach ($dataDepartments as $val) {
			if ($val['id'] == $idParent) {
				array_push($all, $val);
				$parent = $this->find_parents($dataDepartments, $val['parent']);
				if ($parent) {
					array_push($all, ...$parent);
				}
			}
		}
		return $all;
	}
}
