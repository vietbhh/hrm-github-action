<?php

namespace HRM\Modules\Reports\Controllers;

use App\Controllers\ErpController;

class Employee extends ErpController
{
	public function get_employee_get()
	{
		helper("app_select_option");
		$totalEmployee = 0;
		$currentEmployee = 0;
		$formerEmployee = 0;
		$dataGender = ['empty' => true];
		$_dataGender = [];
		$dataOffice = ['empty' => true];
		$_dataOffice = [];
		$dataDepartment = ['empty' => true];
		$_dataDepartment = [];
		$dataJobTitle = ['empty' => true];
		$_dataJobTitle = [];

		$genderModules = \Config\Services::modules("gender");
		$genderModel = $genderModules->model;
		$dataGender_db = $genderModel->select("id as value, name as label")->asArray()->findAll();
		$arr_gender = [];
		foreach ($dataGender_db as $item) {
			$arr_gender[$item['value']] = $item['label'];
			$_dataGender[$item['value']] = 0;
			$dataGender['labels'][] = $item['label'];
		}

		$officeModules = \Config\Services::modules("offices");
		$officeModel = $officeModules->model;
		$dataOffice_db = $officeModel->select("id as value, name as label")->asArray()->findAll();
		$arr_office = [];
		foreach ($dataOffice_db as $item) {
			$arr_office[$item['value']] = $item['label'];
			$_dataOffice[$item['value']] = 0;
			$dataOffice['labels'][] = $item['label'];
		}

		$departmentModules = \Config\Services::modules("departments");
		$departmentModel = $departmentModules->model;
		$dataDepartment_db = $departmentModel->select("id as value, name as label")->asArray()->findAll();
		$arr_department = [];
		foreach ($dataDepartment_db as $item) {
			$arr_department[$item['value']] = $item['label'];
			$_dataDepartment[$item['value']] = 0;
			$dataDepartment['labels'][] = $item['label'];
		}

		$jobTitleModules = \Config\Services::modules("job_titles");
		$jobTitleModel = $jobTitleModules->model;
		$dataJobTitle_db = $jobTitleModel->select("id as value, name as label")->asArray()->findAll();
		$arr_job_title = [];
		foreach ($dataJobTitle_db as $item) {
			$arr_job_title[$item['value']] = $item['label'];
			$_dataJobTitle[$item['value']] = 0;
			$dataJobTitle['labels'][] = $item['label'];
		}

		$employeeModules = \Config\Services::modules("employees");
		$employeeModel = $employeeModules->model;
		$employeeModule = $employeeModules->getModule();
		$dataEmployee = $employeeModel->select("id, gender, office, department_id, job_title_id, status")->asArray()->findAll();

		foreach ($dataEmployee as $item) {
			$totalEmployee++;
			if ($item['status'] == getOptionValue($employeeModule, 'status', 'resigned')) {
				$formerEmployee++;
				continue;
			}

			$currentEmployee++;

			if (isset($arr_gender[$item['gender']])) {
				$_dataGender[$item['gender']]++;
				$dataGender['empty'] = false;
			}

			if (isset($arr_office[$item['office']])) {
				$_dataOffice[$item['office']]++;
				$dataOffice['empty'] = false;
			}

			if (isset($arr_department[$item['department_id']])) {
				$_dataDepartment[$item['department_id']]++;
				$dataDepartment['empty'] = false;
			}

			if (isset($arr_job_title[$item['job_title_id']])) {
				$_dataJobTitle[$item['job_title_id']]++;
				$dataJobTitle['empty'] = false;
			}
		}

		$dataGender['series'] = array_values($_dataGender);
		$dataOffice['series'] = array_values($_dataOffice);
		$dataDepartment['series'] = array_values($_dataDepartment);
		$dataJobTitle['series'] = array_values($_dataJobTitle);

		$out['totalEmployee'] = $totalEmployee;
		$out['currentEmployee'] = $currentEmployee;
		$out['formerEmployee'] = $formerEmployee;
		$out['dataGender'] = $dataGender;
		$out['dataOffice'] = $dataOffice;
		$out['dataDepartment'] = $dataDepartment;
		$out['dataJobTitle'] = $dataJobTitle;

		return $this->respond($out);
	}

	public function employee_filter_get()
	{
		helper("app_select_option");
		$getParams = $this->request->getGet();
		$type = $getParams['type'];
		$filter = $getParams['filter'];

		$employeeModules = \Config\Services::modules("employees");
		$employeeModel = $employeeModules->model;
		$employeeModule = $employeeModules->getModule();
		if (!empty($filter['gender'])) {
			$employeeModel->where('gender', $filter['gender']);
		}
		if (!empty($filter['office'])) {
			$employeeModel->where('office', $filter['office']);
		}
		if (!empty($filter['department_id'])) {
			$employeeModel->where('department_id', $filter['department_id']);
		}
		if (!empty($filter['job_title_id'])) {
			$employeeModel->where('job_title_id', $filter['job_title_id']);
		}
		if (!empty($filter['employee_type'])) {
			$employeeModel->where('employee_type', $filter['employee_type']);
		}
		$dataEmployee = $employeeModel->where('status <>', getOptionValue($employeeModule, 'status', 'resigned'))->select("id, gender, office, department_id, job_title_id, status")->asArray()->findAll();

		$out = [
			'series' => [],
			'labels' => []
		];

		if ($type == 'gender') {
			$dataGender = ['empty' => true];
			$_dataGender = [];

			$genderModules = \Config\Services::modules("gender");
			$genderModel = $genderModules->model;
			$dataGender_db = $genderModel->select("id as value, name as label")->asArray()->findAll();
			$arr_gender = [];
			foreach ($dataGender_db as $item) {
				$arr_gender[$item['value']] = $item['label'];
				$_dataGender[$item['value']] = 0;
				$dataGender['labels'][] = $item['label'];
			}

			foreach ($dataEmployee as $item) {
				if (isset($arr_gender[$item['gender']])) {
					$_dataGender[$item['gender']]++;
					$dataGender['empty'] = false;
				}
			}

			$dataGender['series'] = array_values($_dataGender);
			$out = $dataGender;
		}

		if ($type == 'office') {
			$dataOffice = ['empty' => true];
			$_dataOffice = [];

			$officeModules = \Config\Services::modules("offices");
			$officeModel = $officeModules->model;
			$dataOffice_db = $officeModel->select("id as value, name as label")->asArray()->findAll();
			$arr_office = [];
			foreach ($dataOffice_db as $item) {
				$arr_office[$item['value']] = $item['label'];
				$_dataOffice[$item['value']] = 0;
				$dataOffice['labels'][] = $item['label'];
			}

			foreach ($dataEmployee as $item) {
				if (isset($arr_office[$item['office']])) {
					$_dataOffice[$item['office']]++;
					$dataOffice['empty'] = false;
				}
			}

			$dataOffice['series'] = array_values($_dataOffice);
			$out = $dataOffice;
		}

		if ($type == 'department') {
			$dataDepartment = ['empty' => true];
			$_dataDepartment = [];

			$departmentModules = \Config\Services::modules("departments");
			$departmentModel = $departmentModules->model;
			$dataDepartment_db = $departmentModel->select("id as value, name as label")->asArray()->findAll();
			$arr_department = [];
			foreach ($dataDepartment_db as $item) {
				$arr_department[$item['value']] = $item['label'];
				$_dataDepartment[$item['value']] = 0;
				$dataDepartment['labels'][] = $item['label'];
			}

			foreach ($dataEmployee as $item) {
				if (isset($arr_department[$item['department_id']])) {
					$_dataDepartment[$item['department_id']]++;
					$dataDepartment['empty'] = false;
				}
			}

			$dataDepartment['series'] = array_values($_dataDepartment);
			$out = $dataDepartment;
		}

		if ($type == 'job_title') {
			$dataJobTitle = ['empty' => true];
			$_dataJobTitle = [];

			$jobTitleModules = \Config\Services::modules("job_titles");
			$jobTitleModel = $jobTitleModules->model;
			$dataJobTitle_db = $jobTitleModel->select("id as value, name as label")->asArray()->findAll();
			$arr_job_title = [];
			foreach ($dataJobTitle_db as $item) {
				$arr_job_title[$item['value']] = $item['label'];
				$_dataJobTitle[$item['value']] = 0;
				$dataJobTitle['labels'][] = $item['label'];
			}

			foreach ($dataEmployee as $item) {
				if (isset($arr_job_title[$item['job_title_id']])) {
					$_dataJobTitle[$item['job_title_id']]++;
					$dataJobTitle['empty'] = false;
				}
			}

			$dataJobTitle['series'] = array_values($_dataJobTitle);
			$out = $dataJobTitle;
		}

		return $this->respond($out);
	}
}