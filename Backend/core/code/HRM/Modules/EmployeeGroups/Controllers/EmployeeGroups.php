<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : employeegroups
*/

namespace HRM\Modules\Employeegroups\Controllers;

use App\Controllers\ErpController;
use App\Controllers\Settings\Modules;
use HRM\Modules\Employees\Models\EmployeesModel;

class EmployeeGroups extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function preview_employee_post()
	{
		$postData = $this->request->getPost();
		$arrMeetAllCondition = $postData['meet_all'];
		$arrMeetAnyCondition = $postData['meet_any'];
		$arrExceptEmployee = $postData['except_employee'];
		$model = new EmployeesModel();
		$listEmployeeGroup = $this->_getListEmployeeGroup($model, $arrMeetAllCondition, $arrMeetAnyCondition, $arrExceptEmployee);

		return $this->respond(['list_employee' => $listEmployeeGroup]);
	}

	public function edit_employee_group_post($id)
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$validation = \Config\Services::validation();
		$employeeGroupService = \HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups\Config\Services::employeeGroups();

		if (!mayUpdate('groups')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$postData = $this->request->getPost();
		$type = $postData['type'];
		$condition = $postData['condition'];
		$autoAddRemoveEmployee = $postData['auto_add_remove_employee'];

		$modules->setModule("groups");
		$model = $modules->model;
		$dataUpdateGroup = [
			'id' => $id,
			'name' => $postData['name'],
			'description' => $postData['description']
		];
		$dataHandleGroup = handleDataBeforeSave($modules, $dataUpdateGroup, [], array_keys($dataUpdateGroup));

		if (!empty($dataHandleGroup['validate'])) {
			if (!$validation->reset()->setRules($dataHandleGroup['validate'])->run($dataHandleGroup['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields(array_keys($dataUpdateGroup));
		$saveGroup = $dataHandleGroup['data'];
		try {
			$model->save($saveGroup);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		$modules->setModule('employee_groups');
		$modelEmployeeGroup = $modules->model;

		//delete employee group
		$modelEmployeeGroup->where('group', $id)->delete();

		//add mew employee group
		if ($type == 'match_criteria') {
			$arrMeetAllCondition = $condition['meet_all'];
			$arrMeetAnyCondition = $condition['meet_any'];
			$arrExceptEmployee = $condition['except_employee'];
			$modelEmployee = new EmployeesModel();
			$listEmployee = $this->_getListEmployeeGroup($modelEmployee, $arrMeetAllCondition, $arrMeetAnyCondition, $arrExceptEmployee);
			if (!$employeeGroupService->_checkIsEmptyArray($listEmployee)) {
				foreach ($listEmployee as $rowEmployee) {
					$dataInsert = [
						'employee' =>  $rowEmployee['id'],
						'group' => $id
					];
					$modelEmployeeGroup->setAllowedFields(array_keys($dataInsert));
					$modelEmployeeGroup->save($dataInsert);
				}
			}
		} else if ($type == 'specific_employee') {
			$listEmployee = $postData['list_employee'];
			if (!$employeeGroupService->_checkIsEmptyArray($listEmployee)) {
				foreach ($listEmployee as $rowEmployee) {
					$dataInsert = [
						'employee' =>  $rowEmployee,
						'group' => $id
					];
					$modelEmployeeGroup->setAllowedFields(array_keys($dataInsert));
					$modelEmployeeGroup->save($dataInsert);
				}
			}
		}

		//update or create setting group
		$modules->setModule('setting_groups');
		$model = $modules->model;

		$infoSettingGroup = $model->asArray()->where('group', $id)->first();
		if ($type == 'match_criteria') {
			$conditionSave = [
				'meet_all' => $condition['meet_all'],
				'meet_any' => $condition['meet_any'],
				'except_employee' => $condition['except_employee']
			];
		} else if ($type == 'specific_employee') {
			$conditionSave = [
				'specific_employee' => $condition['specificEmployee']
			];
		}

		$dataSettingGroup = [
			'group' => $id,
			'type' => getOptionValue("setting_groups", "type", $type),
			'condition' => json_encode($conditionSave),
			'auto_add_remove_employee' => $autoAddRemoveEmployee ? 1 : 0
		];
		if ($infoSettingGroup) {
			$dataSettingGroup['id'] = $infoSettingGroup['id'];
		}

		$model->setAllowedFields(array_keys($dataSettingGroup));
		$model->save($dataSettingGroup);

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_group_info_get($id)
	{
		$modules = \Config\Services::modules();
		$employeeGroupService = \HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups\Config\Services::employeeGroups();

		$modules->setModule('groups');
		$model = $modules->model;
		$infoGroup =  handleDataBeforeReturn($modules, $model->asArray()->find($id));

		//get group setting
		$modules->setModule('setting_groups');
		$model = $modules->model;
		$infoSetting = handleDataBeforeReturn($modules, $model->asArray()->where('group', $id)->first());

		//get employee groups
		$modules->setModule('employee_groups');
		$model = $modules->model;
		$listEmployeeGroup = $model
			->asArray()
			->select(['employee'])
			->where('group', $id)
			->findAll();
		$arrEmployeeId = array_column($listEmployeeGroup, 'employee');

		//get list employee
		$modules->setModule('employees');
		$model = $modules->model;
		$listEmployee = $model
			->asArray()
			->select([
				'id',
				'full_name',
				'avatar',
				'email'
			])
			->findAll();
		$listEmployeeGroup = [];
		foreach ($listEmployee as $key => $row) {
			if (in_array($row['id'], $arrEmployeeId)) {
				$listEmployeeGroup[] = $row;
			}
		}

		if ($infoSetting > 0) {
			$arrCondition = json_decode($infoSetting['condition'], true);
			if ($arrCondition > 0) {
				if (isset($arrCondition['meet_all']) && !$employeeGroupService->_checkIsEmptyArray($arrCondition['meet_all'])) {
					$arrCondition['meet_all'] = $this->_getValueConditionArray($modules, $arrCondition['meet_all']);
				}

				if (isset($arrCondition['meet_any']) && !$employeeGroupService->_checkIsEmptyArray($arrCondition['meet_any'])) {
					$arrCondition['meet_any'] = $this->_getValueConditionArray($modules, $arrCondition['meet_any']);
				}

				if (isset($arrCondition['except_employee']) && !$employeeGroupService->_checkIsEmptyArray($arrCondition['except_employee'])) {
					$arrCondition['except_employee'] = $this->_getInfoEmployeeConditionArray($arrCondition['except_employee'], $listEmployee);
				} else {
					$arrCondition['except_employee'] = [];
				}

				if (isset($arrCondition['specific_employee']) && !$employeeGroupService->_checkIsEmptyArray($arrCondition['specific_employee'])) {
					$arrCondition['specific_employee'] = $this->_getInfoEmployeeConditionArray($arrCondition['specific_employee'], $listEmployee);
				} else {
					$arrCondition['specific_employee'] = [];
				}
				$infoSetting['condition'] = json_encode($arrCondition);
			}
		}
		$result = [
			'group' => $infoGroup,
			'setting' =>  $infoSetting,
			'list_employee_group' => $listEmployeeGroup
		];

		return $this->respond($result);
	}

	// ** support function
	private function _getInfoEmployeeConditionArray($array, $listEmployee)
	{
		foreach ($array as $key => $row) {
			foreach ($listEmployee as $rowEmployee) {
				if ($row == $rowEmployee['id']) {
					$array[$key] = $rowEmployee;
					continue 2;
				}
			}
		}
		return $array;
	}

	private function _getValueConditionArray($modules, $array)
	{
		$arrFieldData = [];
		foreach ($array as $key => $row) {
			$value = handleDataBeforeReturn($modules, [
				$row['field']['field'] => $row['value']
			]);
			$arrPush = $row;
			$arrPush['value'] = $value[$row['field']['field']];
			$arrFieldData[] = $arrPush;
		}

		return $arrFieldData;
	}

	private function _getListEmployeeGroup($modelEmployee, $arrMeetAllCondition, $arrMeetAnyCondition, $arrExceptEmployee)
	{
		$employeeGroupService = \HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups\Config\Services::employeeGroups();
		if ($employeeGroupService->_checkIsEmptyCondition($arrMeetAllCondition) && $employeeGroupService->_checkIsEmptyCondition($arrMeetAnyCondition) && $employeeGroupService->_checkIsEmptyArray($arrExceptEmployee)) {
			return [];
		}

		$builder = $modelEmployee
			->exceptResigned()
			->select([
				'id',
				'full_name',
				'avatar',
				'email'
			]);

		$builder = $employeeGroupService->_getBuilderCondition($builder, $arrMeetAllCondition, $arrMeetAnyCondition);
		$listEmployee = $builder->findAll();
		if (!$employeeGroupService->_checkIsEmptyArray($arrExceptEmployee)) {
			foreach ($arrExceptEmployee as $rowExceptEmployee) {
				foreach ($listEmployee as $keyEmployee => $rowEmployee) {
					if ($rowEmployee['id'] === $rowExceptEmployee) {
						unset($listEmployee[$keyEmployee]);
					}
				}
			}
			$listEmployee = array_values($listEmployee);
		}

		return $listEmployee;
	}
}
