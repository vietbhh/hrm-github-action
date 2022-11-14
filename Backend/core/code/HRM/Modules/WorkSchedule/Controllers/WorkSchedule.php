<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : workschedule
* Controller name : WorkSchedule
* Time created : 19/05/2022 19:04:33
*/

namespace HRM\Modules\Workschedule\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;

class WorkSchedule extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function loaddata_get()
	{
		$moduleName = 'work_schedules';
		$postData = $this->request->getGet();
		$module = \Config\Services::modules($moduleName);
		if (!mayList($moduleName)) {
			return $this->failForbidden(MISSING_LIST_PERMISSION);
		}

		$model = new WorkScheduleModel();
		$list = $model->findAllFormat($postData);

		$data = handleDataBeforeReturn($module, $list, true);
		return $this->respond($data);
	}

	public function info_get($id)
	{
		$modules = \Config\Services::modules('work_schedules');
		$model = new WorkScheduleModel();
		$info = $model->findFormat($id);
		$dataHandle = handleDataBeforeReturn($modules, $info);
		return $this->respond($dataHandle);
	}


	public function convertJsonBoolean($data)
	{

		$data['working_day'] = filter_var($data['working_day'], FILTER_VALIDATE_BOOLEAN);
		$data['break_time'] = filter_var($data['break_time'], FILTER_VALIDATE_BOOLEAN);
		$data['is_interleaved'] = isset($data['is_interleaved']) ? filter_var($data['is_interleaved'], FILTER_VALIDATE_BOOLEAN) : [];
		// ** fix value = 1, waiting for update
		$data['interleaved_every_week_number'] = 1;
		$data['working_on_next_weekday_from_effective_date'] = isset($data['working_on_next_weekday_from_effective_date']) ? filter_var($data['working_on_next_weekday_from_effective_date'], FILTER_VALIDATE_BOOLEAN) : [];
		return json_encode($data);
	}

	public function save_post()
	{

		$postData = $this->request->getPost('data');
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules('work_schedules');
		if (!mayAdd('schedules')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}
		$schedulesModel = $modules->model;

		$postData['monday'] = $this->convertJsonBoolean($postData['monday']);
		$postData['tuesday'] = $this->convertJsonBoolean($postData['tuesday']);
		$postData['wednesday'] = $this->convertJsonBoolean($postData['wednesday']);
		$postData['thursday'] = $this->convertJsonBoolean($postData['thursday']);
		$postData['friday'] = $this->convertJsonBoolean($postData['friday']);
		$postData['saturday'] = $this->convertJsonBoolean($postData['saturday']);
		$postData['sunday'] = $this->convertJsonBoolean($postData['sunday']);

		$dataHandle = handleDataBeforeSave($modules, $postData);
		$schedulesModel->setAllowedFields($dataHandle['fieldsArray']);
		if (!empty($dataHandle['validate'])) {
			if (!$validation->reset()->setRules($dataHandle['validate'])->run($dataHandle['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$schedulesModel->save($dataHandle['data']);
		return $this->respond(ACTION_SUCCESS);
	}

	public function setdefault_post()
	{
		$postData = $this->request->getPost('data');
		$modules = \Config\Services::modules('work_schedules');
		$model = $modules->model;
		$model->setAllowedFields(['default']);
		$model->where('id !=', $postData['id'])->set(['default' => false])->update();
		$data = [
			'id' => $postData['id'],
			'default' => true
		];
		$model->save($data);
		return $this->respond(ACTION_SUCCESS);


	}

	public function delete_post()
	{
		$postData = $this->request->getPost();
		$idDelete = $postData['id'];

		$modules = \Config\Services::modules('work_schedules');
		$model = $modules->model;
		$default = $model->asArray()->where('default', true)->first();
		$model->delete($idDelete);

		$modules->setModule('employees');
		$modelEmployee = $modules->model;
		$modelEmployee->setAllowedFields(['work_schedule']);
		$modelEmployee->where('work_schedule', $idDelete)->set('work_schedule', $default['id'])->update();
		return $this->respond(ACTION_SUCCESS);
	}
}