<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : timeoff
* Controller name : Setting
* Time created : 09/05/2022 15:10:08
*/

namespace HRM\Modules\Timeoff\Controllers;

use App\Controllers\ErpController;
use DateTime;
use HRM\Modules\Employees\Models\EmployeesModel;

class Setting extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function get_type_and_policy_get()
	{
		$modules = \Config\Services::modules();
		if (!hasPermission('timeoffSettingAccess')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$data = $this->request->getGet();
		$result = [];

		//get list time off type
		$modules->setModule('time_off_types');
		$model = $modules->model;
		$builderType = $model;
		if ($data['status'] != 0) {
			$builderType->where('status', $data['status']);
		}
		if ($data['name'] != '') {
			$builderType->like('name', $data['name']);
		}

		$listType = $builderType->findAll();
		$arrIdType = array_column($listType, 'id');
		$result['list_type'] = handleDataBeforeReturn($modules, $listType, true);

		$listPolicy = [];
		if (count($arrIdType) > 0) {
			$modules->setModule('time_off_policies');
			$model = $modules->model;
			$listPolicy = handleDataBeforeReturn($modules, $model->whereIn('type', $arrIdType)->findAll(), true);
		}

		$result['list_policy'] = $listPolicy;

		return $this->respond($result);
	}

	public function add_type_and_policy_time_off_post()
	{
		$validation = \Config\Services::validation();
		$settings = \Config\Services::settings();
		$modules = \Config\Services::modules();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$getPost = $this->request->getPost();
		[$dataType, $dataPolicy] = $this->_handleTypeData($getPost);

		//save type
		$dataType['active'] = true;
		$modules->setModule('time_off_types');
		$model = $modules->model;
		$dataHandleTimeOffType = handleDataBeforeSave($modules, $dataType);
		if (!empty($dataHandleTimeOffType['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTimeOffType['validate'])->run($dataHandleTimeOffType['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$saveTimeOffType = $dataHandleTimeOffType['data'];
		$model->setAllowedFields($dataHandleTimeOffType['fieldsArray']);

		try {
			$model->save($saveTimeOffType);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
		$id = $model->getInsertID();

		//save policy
		$dataPolicy['type'] = $id;
		$modules->setModule('time_off_policies');
		$model = $modules->model;
		$dataHandleTimeOffPolicy = handleDataBeforeSave($modules, $dataPolicy);
		if (!empty($dataHandleTimeOffPolicy['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTimeOffPolicy['validate'])->run($dataHandleTimeOffPolicy['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$saveTimeOffPolicy = $dataHandleTimeOffPolicy['data'];
		$model->setAllowedFields($dataHandleTimeOffPolicy['fieldsArray']);

		try {
			$model->save($saveTimeOffPolicy);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}


		return $this->respondCreated($id);
	}

	public function update_type_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		}
		$getPost = $this->request->getPost();
		[$dataType] = $this->_handleTypeData($getPost);
		$dataType['id'] = $id;

		$modules->setModule('time_off_types');
		$model = $modules->model;
		$dataHandleTimeOffType = handleDataBeforeSave($modules, $dataType);

		if (!empty($dataHandleTimeOffType['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTimeOffType['validate'])->run($dataHandleTimeOffType['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandleTimeOffType['fieldsArray']);
		$saveTimeOffType = $dataHandleTimeOffType['data'];
		try {
			$model->save($saveTimeOffType);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function update_policy_time_off_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$timeOff = \HRM\Modules\TimeOff\Libraries\TimeOff\Config\Services::TimeOff();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		}
		$modules->setModule('time_off_policies');
		$model = $modules->model;
		$getPost = $this->request->getPost();
		$infoPolicy = $model->asArray()->find($id);
		$getPost['type'] = $infoPolicy['type'];
		if ($infoPolicy['duration_allowed'] == 496) {
			$getPost['duration_allowed'] = 496;
		}

		$getPost['id'] = $id;

		$dataHandleTimeOffPolicy = handleDataBeforeSave($modules, $getPost);

		if (!empty($dataHandleTimeOffPolicy['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTimeOffPolicy['validate'])->run($dataHandleTimeOffPolicy['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields(array_keys($getPost));
		$saveTimeOffPolicy = $dataHandleTimeOffPolicy['data'];
		try {
			$model->save($saveTimeOffPolicy);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		$listEmployeeEligibility = $this->_getListEmployeeEligibility($id);
		try {
			$timeOff->handleBalance($id, $listEmployeeEligibility);
			$timeOff->recalculateEntitlement($id);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function assign_eligibility_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$timeOff = \HRM\Modules\TimeOff\Libraries\TimeOff\Config\Services::TimeOff();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		}

		$modules->setModule('time_off_policies');
		$model = $modules->model;
		$getPost = $this->request->getPost();
		$listEmployeeAdd  = array_filter(array_unique($getPost['eligibility_employee']));
		$getPost['eligibility_employee'] = array_column($getPost['eligibility_employee'], "value");
		$getPost['id'] = $id;
		$dataHandleTimeOffPolicy = handleDataBeforeSave($modules, $getPost);
		$model->setAllowedFields(array_keys($getPost));
		$arrKeys = array_keys($getPost);
		$saveTimeOffPolicy =  $this->_handleDataAssignEligibility($dataHandleTimeOffPolicy['data'], $arrKeys);
		try {
			$model->save($saveTimeOffPolicy);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		//handle balance
		try {
			$timeOff->handleBalance($id, $listEmployeeAdd);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function update_eligibility_post($id)
	{
		helper('app_select_option');
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		$timeOff = \HRM\Modules\TimeOff\Libraries\TimeOff\Config\Services::TimeOff();


		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		}

		$modules->setModule('time_off_policies');
		$model = $modules->model;
		$getPost = $this->request->getPost();
		$listEmployeeAdd = $getPost['eligibility_employee'];
		$dataSaveTimeOffPolicy = [
			'eligibility_applicable' => $getPost['eligibility_applicable'],
			'eligibility_employee' => array_column($listEmployeeAdd, "value"),
		];
		if (isset($getPost['group_id'])) {
			$dataSaveTimeOffPolicy['group_id'] = $getPost['group_id'];
		}
		$dataSaveTimeOffPolicy['id'] = $id;
		$dataHandleTimeOffPolicy = handleDataBeforeSave($modules, $dataSaveTimeOffPolicy);
		$model->setAllowedFields(array_keys($dataSaveTimeOffPolicy));
		$arrKeys = array_keys($dataSaveTimeOffPolicy);
		$saveTimeOffPolicy =  $this->_handleDataAssignEligibility($dataHandleTimeOffPolicy['data'], $arrKeys);
		try {
			$model->save($saveTimeOffPolicy);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		//insert timeoff balance and timeoff balance event
		try {
			$timeOff->handleBalance($id, $listEmployeeAdd);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		//remove employee balance
		if ((isset($getPost['keep_balance'])) && $getPost['keep_balance'] == getOptionValue('time_off_policies', 'keep_balance', 'removebalance')) {
			$listEmployeeRemove = $getPost['eligibility_employee_remove'];
			try {
				$timeOff->handleDeleteBalance($modules, array_values($listEmployeeRemove, 'value'), $getPost['time_off_type'], true);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
		}

		return $this->respondCreated($id);
	}

	public function time_off_type_delete($id)
	{
		$modules = \Config\Services::modules();
		if (!mayDelete('time_off_types', $id)) {
			return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		}
		$modules->setModule('time_off_types');
		$model = $modules->model;
		$model->delete($id);

		//delete time_off_policies
		$modules->setModule('time_off_policies');
		$model = $modules->model;
		$model->where('type', $id)->delete();

		//delete time_off_balances
		$modules->setModule('time_off_balances');
		$model = $modules->model;
		$model->where('type', $id)->delete();

		//delete time_off_balance_events
		$modules->setModule('time_off_balance_events');
		$model = $modules->model;
		$model->where('type', $id)->delete();

		return $this->respondDeleted($id);
	}

	public function load_list_employee_eligibility_change_get()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		if (!mayList('employees')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$data = $this->request->getGet();
		$eligibilityApplicableParam = $data['eligibility_applicable'];
		$employeeGroupOption = getOptionValue('time_off_policies', 'eligibility_applicable', 'employeegroup');

		//list employee eligibility
		$modules->setModule('time_off_policies');
		$model = $modules->model;
		$infoPolicy = $model->asArray()->find($data['policy_id']);
		$assignDate = $infoPolicy['assign_date'];
		$assignDateJoinDate = getOptionValue('time_off_policies', 'assign_date', 'joindate');
		$assignDateProbationDate = getOptionValue('time_off_policies', 'assign_date', 'probationenddate');

		$eligibilityApplicable = isset($infoPolicy['eligibility_applicable']) ? $infoPolicy['eligibility_applicable'] : 0;
		$firstLoad = $data['first_load'];
		$listEmployeeRemain = [];

		$modules->setModule('employees');
		$model = new EmployeesModel();
		$builderEmployee = $model->asArray()->exceptResigned()->select([
			'm_employees.id',
			'm_employees.username',
			'm_employees.full_name',
			'm_employees.email',
			'm_employees.avatar as icon',
			'm_employees.join_date',
			'm_employees.probation_end_date'
		]);
		if ($eligibilityApplicableParam == $employeeGroupOption || $eligibilityApplicable == $employeeGroupOption) {
			$builderEmployee->join('m_employee_groups', 'm_employee_groups.employee = m_employees.id', 'inner');
		}
		$listEmployeeAll = $builderEmployee->groupBy('m_employees.id')->findAll();
		if ($firstLoad != 'undefined' && $firstLoad != 'false') {
			$arrEmployeeRemainId = json_decode($infoPolicy['eligibility_employee'], true);
			foreach ($listEmployeeAll as $row) {
				$arrayPush = $row;
				$arrayPush['value'] = $row['id'];
				if ($assignDate == $assignDateJoinDate && strtotime($row['join_date']) > strtotime(date('Y-m-d'))) {
					continue;
				} else if ($assignDate == $assignDateProbationDate && strtotime($row['probation_end_date']) > strtotime(date('Y-m-d'))) {
					continue;
				}
				if (in_array($row['id'], $arrEmployeeRemainId)) {
					$listEmployeeRemain[] = $arrayPush;
				}
			}
			$result['employee_add'] = [];
			$result['employee_remove'] = [];
			$result['employee_remain'] = $listEmployeeRemain;
			$result['employee_remove_from_remain'] = [];
			$result['employee_remove_from_add'] = [];
			return $this->respond($result);
		}

		$builderEmployeeGroup = $model->asArray()->exceptResigned()->select([
			'm_employees.id',
			'm_employees.username',
			'm_employees.full_name',
			'm_employees.email',
			'm_employees.avatar as icon',
			'm_employees.join_date',
			'm_employees.probation_end_date'
		]);
		if ($eligibilityApplicableParam == $employeeGroupOption || $eligibilityApplicable == $employeeGroupOption) {
			$builderEmployeeGroup->join('m_employee_groups', 'm_employee_groups.employee = m_employees.id', 'inner');
		}
		$isSpecificEmployee = false;
		if ($eligibilityApplicableParam == $employeeGroupOption) {
			if ($data['group_id'] != 'undefined') {
				$builderEmployeeGroup->where('m_employee_groups.group', $data['group_id']);
			} else if ($eligibilityApplicable == $employeeGroupOption) {
				$builderEmployeeGroup->where('m_employee_groups.group', $infoPolicy['group_id']);
			}
		} else if ($eligibilityApplicableParam == getOptionValue('time_off_policies', 'eligibility_applicable', 'specificemployees')) {
			$isSpecificEmployee = true;
			if ($eligibilityApplicable == $employeeGroupOption) {
				$builderEmployeeGroup->where('m_employee_groups.group', $infoPolicy['group_id']);
			}
		}

		if ($assignDate == $assignDateJoinDate) {
			$builderEmployeeGroup->where('join_date <', date('Y-m-d'))->where('join_date !=', '0000-00-00')->where('join_date is not null');
		} else if ($assignDate == $assignDateProbationDate) {
			$builderEmployeeGroup->where('probation_end_date <', date('Y-m-d'))->where('probation_end_date !=', '0000-00-00')->where('join_date is not null');
		}

		$listEmployeeGroup = $builderEmployeeGroup->groupBy('m_employees.id')->findAll();
		$listEmployeeAdd = [];
		$listEmployeeRemove = [];
		if (!empty($infoPolicy['eligibility_employee']) && count(json_decode($infoPolicy['eligibility_employee'], true)) > 0) {
			$arrEmployeeRemoveId = $arrEmployeeEligibility = json_decode($infoPolicy['eligibility_employee'], true);
			$arrIdEmployeeGroup = array_column($listEmployeeGroup, 'id');

			$arrEmployeeAddId = [];
			$arrEmployeeRemainId = [];
			foreach ($arrIdEmployeeGroup as $row) {
				$arrayPush = $row;
				if (!in_array($row, $arrEmployeeEligibility)) {
					$arrEmployeeAddId[] = $row;
				} else {
					if (($key = array_search($row, $arrEmployeeRemoveId)) !== false) {
						$arrEmployeeRemainId[] = $row;
						unset($arrEmployeeRemoveId[$key]);
					}
				}
			}
			foreach ($listEmployeeAll as $row) {
				$arrayPush = $row;
				$arrayPush['value'] = $row['id'];
				if (in_array($row['id'], $arrEmployeeAddId)) {
					$listEmployeeAdd[] = $arrayPush;
				}

				if (in_array($row['id'], $arrEmployeeRemoveId)) {
					$listEmployeeRemove[] = $arrayPush;
				}

				if (in_array($row['id'], $arrEmployeeRemainId)) {
					$listEmployeeRemain[] = $arrayPush;
				}
			}
		} else {
			$listEmployeeAdd = [];
			foreach ($listEmployeeGroup as $row) {
				$arrayPush = $row;
				$arrayPush['value'] = $row['id'];
				$listEmployeeAdd[] = $arrayPush;
			}
			$listEmployeeRemove = [];
			$listEmployeeRemain = [];
		}

		if ($isSpecificEmployee && count($infoPolicy) > 0) {
			$result['employee_remove'] = array_merge($listEmployeeAdd, $listEmployeeRemain);
			$result['employee_add'] = [];
			$result['employee_remain'] = [];
			$result['employee_remove_from_remain'] = $listEmployeeRemain;
			$result['employee_remove_from_add'] = $listEmployeeAdd;
		} else {
			$result['employee_add'] = $listEmployeeAdd;
			$result['employee_remove'] = $listEmployeeRemove;
			$result['employee_remain'] = $listEmployeeRemain;
			$result['employee_remove_from_remain'] = [];
			$result['employee_remove_from_add'] = [];
		}
		return $this->respond($result);
	}

	public function get_holiday_get()
	{
		$modules = \Config\Services::modules();
		if (!hasPermission('timeoffSettingAccess')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$data = $this->request->getGet();
		$filters['filters'] = $data;
		$modules->setModule('time_off_holidays');
		$model = $modules->model;
		$result = loadDataWrapper($modules, $model, $filters, false);
		$result['results'] = handleDataBeforeReturn($modules, $result['results'], true);
		return $this->respond($result);
	}

	public function add_holiday_post()
	{
		$validation = \Config\Services::validation();
		$settings = \Config\Services::settings();
		$modules = \Config\Services::modules();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$getPost = $this->request->getPost();
		$modules->setModule('time_off_holidays');
		$model = $modules->model;
		$dataHandleTimeOffHoliday = handleDataBeforeSave($modules, $getPost);
		if (!empty($dataHandleTimeOffHoliday['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTimeOffHoliday['validate'])->run($dataHandleTimeOffHoliday['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$saveTimeOffHoliday = $dataHandleTimeOffHoliday['data'];
		$model->setAllowedFields($dataHandleTimeOffHoliday['fieldsArray']);

		try {
			$model->save($saveTimeOffHoliday);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		$id = $model->getInsertID();

		return $this->respondCreated($id);
	}

	public function update_holiday_post($id)
	{
		$validation = \Config\Services::validation();
		$settings = \Config\Services::settings();
		$modules = \Config\Services::modules();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}
		$getPost = $this->request->getPost();
		$getPost['id'] = $id;
		$modules->setModule('time_off_holidays');
		$model = $modules->model;
		$dataHandleTimeOffHoliday = handleDataBeforeSave($modules, $getPost);
		if (!empty($dataHandleTimeOffHoliday['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTimeOffHoliday['validate'])->run($dataHandleTimeOffHoliday['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}

		$saveTimeOffHoliday = $dataHandleTimeOffHoliday['data'];
		$model->setAllowedFields($dataHandleTimeOffHoliday['fieldsArray']);

		try {
			$model->save($saveTimeOffHoliday);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function remove_holiday_delete($id)
	{
		$modules = \Config\Services::modules();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$modules->setModule('time_off_holidays');
		$model = $modules->model;
		$model->delete($id);

		return $this->respondDeleted($id);
	}

	public function add_holiday_country_post()
	{
		$validation = \Config\Services::validation();
		$settings = \Config\Services::settings();
		$modules = \Config\Services::modules();

		if (!hasPermission('timeoffSettingAccess')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$getPost = $this->request->getPost();
		$modules->setModule('time_off_holidays');
		$model = $modules->model;
		$idInserted = [];
		foreach ($getPost['data'] as $key => $row) {
			$dataSave = $row;
			$dataSave['from_date'] = $getPost['year'] . '-' . $row['from_date'];
			$dataSave['to_date'] = $getPost['year'] . '-' . $row['to_date'];
			$dataSave['office_id']  = $getPost['office_id'];
			$dataSave['year']  = $getPost['year'];
			$dataHandleTimeOffHoliday = handleDataBeforeSave($modules, $dataSave);
			if (!empty($dataHandleTimeOffHoliday['validate'])) {
				if (!$validation->reset()->setRules($dataHandleTimeOffHoliday['validate'])->run($dataHandleTimeOffHoliday['data'])) {
					return $this->failValidationErrors($validation->getErrors());
				}
			}
			$saveTimeOffHoliday = $dataHandleTimeOffHoliday['data'];
			$model->setAllowedFields($dataHandleTimeOffHoliday['fieldsArray']);

			try {
				$model->save($saveTimeOffHoliday);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
			$idInserted[] = $model->getInsertID();
		}

		return $this->respondCreated($idInserted);
	}

	public function load_employee_select_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule('employees');
		$model = new EmployeesModel();

		$data = $this->request->getGet();
		$model = $model->exceptResigned()->select(['username', 'email', 'avatar', 'full_name', 'join_date', 'probation_end_date']);

		if (isset($data['filters'])) {
			$filter = $data['filters'];
			unset($data['filters']);
			$assignDate = $filter['assign_date']['name_option'];
			
			if ($assignDate == 'joindate') {
				$model->where('join_date <', date('Y-m-d'))->where('join_date !=', '0000-00-00')->where("join_date is not null", null, false);
			} else if ($assignDate == 'probationenddate') {
				$model->where('probation_end_date <', date('Y-m-d'))->where('probation_end_date !=', '0000-00-00')->where("probation_end_date is not null", null, false);
			}
		}

		return $this->respond(loadDataWrapper($modules, $model, $data));
	}

	public function get_detail_policy_get($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('time_off_policies');
		$model = $modules->model;

		$infoPolicy = $model->asArray()->find($id);
		$result['data'] = handleDataBeforeReturn($modules, $infoPolicy);

		if ($infoPolicy) {
			$typeId = $infoPolicy['type'];
			$modules->setModule('time_off_types');
			$model = $modules->model;
			$infoType = $model->asArray()->select(['id', 'paid'])->find($typeId);
			$result['data']['paid_status'] = $infoType['paid'];
		} else {
			$result['data']['paid_status'] = false;
		}

		return $this->respond($result);
	}

	// ** support function
	private function _handleTypeData($getPost)
	{
		$dataType = [];
		$dataPolicy = [];
		foreach ($getPost as $key => $row) {
			if (strpos($key, "type_field_") !== false) {
				$dataType[str_replace("type_field_", "", $key)] = $row;
			} else {
				$dataPolicy[$key] = $row;
			}
		}
		return [$dataType, $dataPolicy];
	}

	private function _handleDataAssignEligibility($data, $arrKeys)
	{
		$newData =  array_filter($data, function ($key) use ($arrKeys) {
			return in_array($key, $arrKeys);
		}, ARRAY_FILTER_USE_KEY);
		return $newData;
	}

	private function _getListEmployeeEligibility($idPolicy)
	{
		if (empty($idPolicy)) {
			return [];
		}
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$modules->setModule('time_off_policies');
		$model = $modules->model;
		$infoPolicy = $model->asArray()->find($idPolicy);
		$eligibilityApplicable = $infoPolicy['eligibility_applicable'];
		if (empty($eligibilityApplicable)) {
			return [];
		}
		$result = [];
		$listEligibilityEmployee = json_decode($infoPolicy['eligibility_employee'], true);
		$assignDate = $infoPolicy['assign_date'];
		$employeeDate = ($assignDate == getOptionValue('time_off_policies', 'assign_date', 'joindate')) ? 'join_date' : 'probation_end_date';
		$currentDate = date('Y-m-d');
		//get list id employee
		$modules->setModule('employees');
		$model = new EmployeesModel();
		$builder = $model->asArray()->exceptResigned()->where($employeeDate . ' <', $currentDate)->where($employeeDate . ' !=', '0000-00-00')->where($employeeDate . ' is not null');
		if ($eligibilityApplicable == getOptionValue('time_off_policies', 'eligibility_applicable', 'specificemployees')) {
			$builder->whereIn('id', $listEligibilityEmployee);
		} else {
			if ($eligibilityApplicable == getOptionValue('time_off_policies', 'eligibility_applicable', 'employeegroup') && !empty($infoPolicy['group_id'])) {
				$builder->where('group_id', $infoPolicy['group_id']);
			}
		}
		$listEmployee = $builder->findAll();
		foreach ($listEmployee as $row) {
			$result[] = [
				'value' => $row['id'],
				'label' =>  $row['full_name'],
				'join_date' =>  $row['join_date'],
				'probation_date' =>  $row['probation_end_date']
			];
		}

		return $result;
	}
}
