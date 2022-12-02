<?php

namespace HRM\Modules\Employees\Config;

use App\Models\AppAutoNumberModel;
use Exception;
use HRM\Controllers\Search;
use ReflectionException;

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
			if ($typeCreate == 'changed') {
				$modules = \Config\Services::modules();
				$modules->setModule("employees");
				$metas = $modules->getMetas();
				$model = $modules->model;
				$employee = $model->asArray()->find($employeeId);
				foreach ($metas as $item_meta) {
					$field = $item_meta->field;
					if (isset($dataEmployee[$field])) {
						$check_date = strpos($field, 'date');
						$old_data = $employee[$field] ?? "";
						$new_data = $dataEmployee[$field] ?? "";
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

							$dataInsert[] = [
								'field' => $field,
								'from' => $old_data,
								'to' => $new_data
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
				$dataInsert[] = [
					'department' => $arr_department[$department] ?? "",
					'job_title' => $arr_job_title[$job_title] ?? "",
					'date' => empty($dataEmployee['date']) ? date("Y-m-d") : $dataEmployee['date'],
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
		}
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

		$model->save($dataSave);
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
