<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : overtimes
*/

namespace HRM\Modules\Overtimes\Controllers;

use App\Controllers\ErpController;

class Overtimes extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function create_overtime_post()
	{
		helper('app_select_option');
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules('overtimes');
		$model = $modules->model;

		$postData = $this->request->getPost();

		$dataHandle = handleDataBeforeSave($modules, $postData);
		if (!empty($dataHandle['validate'])) {
			if (!$validation->reset()->setRules($dataHandle['validate'])->run($dataHandle['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandle['fieldsArray']);
		$saveData = $dataHandle['data'];
		$saveData['status'] = getOptionValue('overtimes', 'status', 'pending');
		$saveData['total_time'] = (strtotime($saveData['to_time']) - strtotime($saveData['from_time']));
		try {
			$model->save($saveData);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_overtime_get()
	{
		$modules = \Config\Services::modules();
		$params = $this->request->getGet();
		$params['is_manage_overtime'] = true;
		$listOvertime = $this->_getListOvertime($modules, $params);

		return $this->respond([
			'results' => handleDataBeforeReturn($modules, $listOvertime, true)
		]);
	}

	public function action_overtime_post($id)
	{
		helper('app_select_option');
		$modules = \Config\Services::modules('overtimes');
		$model = $modules->model;
		$infoOvertime = $model->asArray()->find($id);

		$postData = $this->request->getPost();

		$dataUpdate = $postData;
		unset($dataUpdate['action_type']);

		$dataUpdate['id'] = $id;
		$dataUpdate['status'] = getOptionValue('overtimes', 'status', $postData['action_type']);
		$dataUpdate['action_by'] = user_id();
		$dataUpdate['action_at'] = date('Y-m-d H:i:s');

		$model->setAllowedFields(array_keys($dataUpdate));
		try {
			$model->save($dataUpdate);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		if ($postData['action_type'] === 'approved') {
			// add attendance detail
			$modules->setModule('attendances');
			$model = $modules->model;
			$dateAttendance = $infoOvertime['date'];
			$infoAttendance = $model->asArray()
				->where("date_from <=", $dateAttendance)
				->where("date_to >=", $dateAttendance)
				->first();
			$attendanceId = isset($infoAttendance['id']) ? $infoAttendance['id'] : 0;

			$modules->setModule('attendance_details');
			$model = $modules->model;
			$employees = json_decode($infoOvertime['employee'], true);
			foreach ($employees as $employee) {
				$dataAttendance = [
					'attendance' => $attendanceId,
					'name' => strtotime($dateAttendance) . '_' . $attendanceId . '_' . $employee,
					'employee' => $employee,
					'date' => $infoOvertime['date'],
					'overtime' => $infoOvertime['total_time']
				];

				$infoAttendanceEmployee = $model->asArray()
					->where('date', $infoOvertime['date'])
					->where('employee', $employee)
					->first();

				if ($infoAttendanceEmployee) {
					$dataAttendance['id'] = $infoAttendanceEmployee['id'];
					$dataAttendance['overtime'] =  $infoOvertime['total_time'] +  $infoAttendanceEmployee['overtime'];
				}

				$model->setAllowedFields(array_keys($dataAttendance));
				$model->save($dataAttendance);
			}
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_overtime_request_get()
	{
		$modules = \Config\Services::modules();
		$params = $this->request->getGet();
		$params['is_request_overtime'] = true;
		$listOvertime = $this->_getListOvertime($modules, $params);

		return $this->respond([
			'results' => handleDataBeforeReturn($modules, $listOvertime, true)
		]);
	}

	public function update_overtime_post($id)
	{
		helper('app_select_option');
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules('overtimes');
		$model = $modules->model;

		$postData = $this->request->getPost();
		$postData['id'] = $id;

		$dataHandle = handleDataBeforeSave($modules, $postData);
		if (!empty($dataHandle['validate'])) {
			if (!$validation->reset()->setRules($dataHandle['validate'])->run($dataHandle['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandle['fieldsArray']);
		$saveData = $dataHandle['data'];
		$saveData['status'] = getOptionValue('overtimes', 'status', 'pending');
		try {
			$model->save($saveData);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respond(ACTION_SUCCESS);
	}

	// ** support function
	private function _getListOvertime($modules, $params)
	{
		$modules->setModule('overtimes');
		$model = $modules->model;

		$currentUserId = user_id();
		$fromDate = isset($params['from_date']) ? $params['from_date'] : '';
		$toDate = isset($params['to_date']) ? $params['to_date'] : '';
		$status = isset($params['status']) ? $params['status'] : [];
		$isManageOvertime = isset($params['is_manage_overtime']) ? $params['is_manage_overtime'] : false;
		$isRequestOvertime = isset($params['is_request_overtime']) ? $params['is_request_overtime'] : false;

		$builder = $model->asArray();

		if ($fromDate != "" && $toDate == "") {
			$builder->where("date >=", $fromDate);
		} elseif ($fromDate == "" && $toDate != "") {
			$builder->where("date <=", $toDate);
		} elseif ($fromDate != "" && $toDate != "") {
			$builder->groupStart();
			$builder->where("date <=", $toDate);
			$builder->where("date >=", $fromDate);
			$builder->groupEnd();
		}

		if (count($status) > 0) {
			$builder->whereIn('status', $status);
		}

		if ($isManageOvertime) {
			$builder->where("JSON_SEARCH(send_to, 'all', '{$currentUserId}', null, '$[*]') IS NOT NULL ");
		}

		if ($isRequestOvertime) {
			$builder->groupStart();
			$builder->where("JSON_SEARCH(employee, 'all', '{$currentUserId}', null, '$[*]') IS NOT NULL ");
			$builder->orWhere("created_by", $currentUserId);
			$builder->groupEnd();
		}

		$page = $params['page']  - 1;
		$limit = $params['limit'];

		$res = $builder->findAll($limit, $page);
		return $res;
	}
}
