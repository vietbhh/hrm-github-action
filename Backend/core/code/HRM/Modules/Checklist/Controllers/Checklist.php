<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : checklist
* Controller name : Checklist
* Time created : 04/04/2022 15:00:40
*/

namespace HRM\Modules\Checklist\Controllers;

use App\Controllers\ErpController;
use Exception;
use HRM\Modules\Employees\Models\EmployeesModel;
use stdClass;

class Checklist extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function load_template_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_template');

		if (!mayList('checklist_template')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$data = $this->request->getGet();
		$model = $modules->model;
		$result = loadDataWrapper($modules, $model, $data, false);
		$result['results'] = handleDataBeforeReturn($modules, $result['results'], true);
		return $this->respond($result);
	}

	public function add_post()
	{
		$validation = \Config\Services::validation();
		$settings = \Config\Services::settings();
		$modules = \Config\Services::modules();


		if (!mayAdd('checklist_template')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$getPost = $this->_handlePostData($this->request->getPost());
		$idDuplicate = isset($getPost['id']) ? $getPost['id'] : 0;
		$isDuplicate = isset($getPost['isDuplicate']) ? $getPost['isDuplicate'] : false;
		unset($getPost['id']);
		unset($getPost['isDuplicate']);
		$modules->setModule('checklist_template');
		$model = $modules->model;
		$dataHandleChecklist = handleDataBeforeSave($modules, $getPost);

		if (!empty($dataHandleChecklist['validate'])) {
			if (!$validation->reset()->setRules($dataHandleChecklist['validate'])->run($dataHandleChecklist['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandleChecklist['fieldsArray']);


		$saveChecklist = $dataHandleChecklist['data'];

		try {
			$model->save($saveChecklist);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
		$id = $model->getInsertID();
		if ($isDuplicate) {
			$modules->setModule('checklist_template_detail');
			$model = $modules->model;
			$listChecklistTemplateDetail = $model->asArray()->where('checklist_template_id', $idDuplicate)->findAll();
			foreach ($listChecklistTemplateDetail as $rowChecklistTemplateDetail) {
				$saveDataDetail = $rowChecklistTemplateDetail;
				$saveDataDetail['checklist_template_id'] = $id;
				unset($saveDataDetail['id']);
				$model->setAllowedFields(array_keys($saveDataDetail));
				try {
					$model->save($saveDataDetail);
				} catch (\ReflectionException $e) {
					return $this->fail(FAILED_SAVE);
				}
			}
		}

		return $this->respondCreated($id);
	}

	public function update_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		if (!mayUpdateResource('checklist_template', $id)) {
			return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		}

		$getPost = $this->_handlePostData($this->request->getPost());
		$getPost['id'] = $id;
		$modules->setModule('checklist_template');
		$model = $modules->model;
		$dataHandleChecklist = handleDataBeforeSave($modules, $getPost);

		if (!empty($dataHandleChecklist['validate'])) {
			if (!$validation->reset()->setRules($dataHandleChecklist['validate'])->run($dataHandleChecklist['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		$model->setAllowedFields($dataHandleChecklist['fieldsArray']);
		$saveChecklist = $dataHandleChecklist['data'];
		try {
			$model->save($saveChecklist);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function delete_delete($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_template');

		if (!mayDelete('documents')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$model = $modules->model;
		try {
			$model->delete($id);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_DELETE);
		}

		return $this->respondDeleted($id);
	}

	public function detail_get($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_template');
		$modelChecklist = $modules->model;
		$dataChecklist = $modelChecklist->find($id);

		$modules->setModule('checklist_template_detail');
		$modelChecklistDetail = $modules->model;
		$data = $this->request->getGet();
		$result = loadDataWrapper($modules, $modelChecklistDetail, $data, false);

		$dataChecklistDetail = $modelChecklistDetail->where('checklist_template_id', $id)->findAll();
		$result['results']['data']['checklist'] = $dataChecklist;
		$result['results']['data']['checklistDetail'] = handleDataBeforeReturn($modules, $dataChecklistDetail, true);

		return $this->respond($result);
	}

	public function add_task_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		if (!mayAdd('checklist_template_detail')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$modules->setModule('checklist_template_detail');
		$model = $modules->model;
		$getPost = $this->_handleTaskData($this->request->getPost());
		$getPost['checklist_template_id'] = $id;
		$dataHandleChecklistDetail = handleDataBeforeSave($modules, $getPost);


		if (!empty($dataHandleChecklistDetail['validate'])) {
			if (!$validation->reset()->setRules($dataHandleChecklistDetail['validate'])->run($dataHandleChecklistDetail['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandleChecklistDetail['fieldsArray']);
		$saveChecklistDetail = $dataHandleChecklistDetail['data'];

		try {
			$model->save($saveChecklistDetail);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
		$id = $model->getInsertID();

		return $this->respondCreated($id);
	}

	public function update_task_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		if (!mayUpdateResource('checklist_template_detail', $id)) {
			return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		}

		$getPost = $this->_handleTaskData($this->request->getPost());
		$getPost['id'] = $id;
		$modules->setModule('checklist_template_detail');
		$model = $modules->model;
		$dataHandleTask = handleDataBeforeSave($modules, $getPost);
		if (!empty($dataHandleTask['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTask['validate'])->run($dataHandleTask['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		$model->setAllowedFields($dataHandleTask['fieldsArray']);
		$saveTask = $dataHandleTask['data'];
		try {
			$model->save($saveTask);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function delete_task_delete($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_template_detail');
		$model = $modules->model;
		$model->delete($id);

		return $this->respondDeleted($id);
	}

	public function load_checklist_get()
	{
		$modules = \Config\Services::modules();
		$params = $this->request->getGet();
		$searchText = $params['filters']['search_text'];
		unset($params['filters']['search_text']);
		if ($params['filters']['status'] != 'undefined') {
			$params['filters']['m_checklist.status'] = $params['filters']['status'];
		}
		unset($params['filters']['status']);
		$modules->setModule('checklist');
		$modelChecklist = $modules->model;
		if ($searchText != '') {
			$modelChecklist->select(
				'm_checklist.id, 
				m_checklist.name, 
				m_checklist.employee_id, 
				m_checklist.status, 
				m_checklist.type, 
				m_checklist.hr_in_charge, 
				m_checklist.checklist_template_id, 
				m_checklist.task_number, 
				m_checklist.complete_task'
			);
			$modelChecklist->join('m_checklist_detail', 'm_checklist_detail.checklist_id = m_checklist.id')
				->like('m_checklist_detail.task_name', $searchText)
				->groupBy('m_checklist.id');
		}
		$result = loadDataWrapper($modules, $modelChecklist, $params, false);
		$arrChecklistId = array_column($result['results'], 'id');
		$result['results'] = handleDataBeforeReturn($modules, $result['results'], true);
		//get assigned employee
		$modules->setModule('checklist');
		$modelChecklist = $modules->model;
		$listChecklist  = $modelChecklist->asArray()->findAll();
		$arrAssignedEmployee = array_column($listChecklist, 'employee_id');
		$modules->setModule('employees');
		$modelEmployee =  new EmployeesModel();
		$listEmployee = $modelEmployee->exceptResigned()->where('status', $this->_convertEmployeeStatus($params['filters']['type']))->findAll();
		$result['resultsAdditional']['employee']['list'] = handleDataBeforeReturn($modules, $listEmployee, true);
		$result['resultsAdditional']['employee']['number'] = count($listEmployee);
		$result['resultsAdditional']['assignedEmployee'] = $arrAssignedEmployee;

		if (count($arrChecklistId) > 0) {
			$modules->setModule('checklist_detail');
			$modelChecklistDetail = $modules->model;
			$listChecklistDetail = handleDataBeforeReturn($modules, $modelChecklistDetail->whereIn('checklist_id', $arrChecklistId)->findAll(), true);
		} else {
			$listChecklistDetail = [];
		}

		$result['resultsAdditional']['checklistDetail'] = $listChecklistDetail;


		return $this->respond($result);
	}

	public function assign_checklist_post()
	{
		helper('app_select_option');
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		if (!mayAdd('checklist')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$postData = $this->request->getPost();
		$modules->setModule('checklist_template');
		$modelCheckListTemplate = $modules->model;
		$infoChecklistTemplate = $modelCheckListTemplate->find($postData['checklist_template_id']);
		if (is_null($infoChecklistTemplate)) {
			return $this->fail(FAILED_SAVE);
		}

		$modules->setModule('checklist_template_detail');
		$modelChecklistTemplateDetail = $modules->model;
		$listChecklistTemplateDetail = $modelChecklistTemplateDetail->asArray()->select(
			[
				"task_name",
				"task_type",
				"assignee",
				"due_date_day",
				"due_date_type",
				"description",
				"task_type_content",
				"employee_id"
			]
		)
			->where('checklist_template_id', $infoChecklistTemplate->id)
			->findAll();
		$isExistLineManager = false;
		foreach ($listChecklistTemplateDetail as $row) {
			if ($row['assignee'] == getOptionValue('checklist_template_detail', 'assignee', 'linemanager')) {
				$isExistLineManager = true;
				break;
			}
		}

		if ($isExistLineManager && empty($postData['employee']['line_manager'])) {
			return $this->failNotFound();
		}

		$modules->setModule('checklist');
		$modelChecklist = $modules->model;
		$dataChecklist =  $this->_handleChecklistData($postData);
		$dataChecklist['name'] = $infoChecklistTemplate->name;
		$dataChecklist = handleDataBeforeSave($modules, $dataChecklist);

		if (!empty($dataChecklist['validate'])) {
			if (!$validation->reset()->setRules($dataChecklist['validate'])->run($dataChecklist['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}

		$modelChecklist->setAllowedFields($dataChecklist['fieldsArray']);
		$saveChecklist = $dataChecklist['data'];
		$saveChecklist['task_number'] = count($listChecklistTemplateDetail);
		$saveChecklist['complete_task'] = 0;
		$saveChecklist['status'] = getOptionValue('checklist', 'status', 'inprogress');
		try {
			$modelChecklist->save($saveChecklist);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		$idChecklist = $modelChecklist->getInsertID();
		$checklistDetailData = $this->_handleInsertChecklistDetail($modules, $validation, $postData, $idChecklist, $listChecklistTemplateDetail);

		//send mail
		if ($infoChecklistTemplate->type == getOptionValue('checklist_template', 'type', 'onboarding')) {
			$this->_handleSendMailAssignChecklist($modules, $idChecklist, $checklistDetailData);
		} else if ($infoChecklistTemplate->type == getOptionValue('checklist_template', 'type', 'offboarding')) {
			$this->_handleSendMailOffBoardingChecklist($modules, $idChecklist, $checklistDetailData);
		}
	}

	public function complete_checklist_detail_post()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_detail');

		if (!mayUpdate('checklist_detail')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$postData = $this->request->getPost();
		$postFile = $this->request->getFiles();

		//complete task
		$model = $modules->model;

		$dataUpdateChecklistDetail = [
			'id' => $postData['additional_checklist_detail_id'],
			'status' => getOptionValue('checklist_detail', 'status', 'completed'),
			'complete_date' => date('Y-m-d')
		];
		if ($postData['additional_task_type'] == getOptionValue("checklist_detail", "task_type", "employeeinformation")) {
			$infoChecklistDetail = $model->asArray()->find($postData['additional_checklist_detail_id']);
			$taskTypeContent = json_decode($infoChecklistDetail['task_type_content'], true);
			foreach ($taskTypeContent as $key => $row) {
				if (isset($postData[$row['field']])) {
					$taskTypeContent[$key]['dataContent'] = $postData[$row['field']];
				}
			}
			$dataUpdateChecklistDetail['task_type_content'] = json_encode($taskTypeContent);
		} else if ($postData['additional_task_type'] == getOptionValue("checklist_detail", "task_type", "fileupload")) {
			$paths = $this->_uploadChecklistDetailFile($postData['additional_checklist_detail_id'], $postFile);
			$dataUpdateChecklistDetail['file_upload'] = json_encode($paths);
		}
		$model->setAllowedFields(array_keys($dataUpdateChecklistDetail));
		try {
			$model->save($dataUpdateChecklistDetail);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		//update checklist complete task
		$modules->setModule('checklist');
		$modelChecklist = $modules->model;
		$infoChecklist = $modelChecklist->asArray()->find($postData['additional_checklist_id']);
		$dataUpdateChecklist = [
			'id' => $postData['additional_checklist_id'],
			'complete_task' => intval($infoChecklist['complete_task']) + 1
		];
		$modelChecklist->setAllowedFields(array_keys($dataUpdateChecklist));
		try {
			$modelChecklist->save($dataUpdateChecklist);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respond($this->_getChecklistForReturn($modules, $postData['additional_checklist_id'], $postData['additional_checklist_detail_id']));
	}

	public function revert_checklist_detail_post()
	{
		helper('app_select_option');
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		$modules->setModule('checklist_detail');

		if (!mayUpdate('checklist_detail')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$postData = $this->request->getPost();

		//revert task
		$model = $modules->model;
		$dataUpdateChecklistDetail = [
			'id' => $postData['checklist_detail_id'],
			'status' => getOptionValue("checklist_detail", "status", "inprogress")
		];
		$infoChecklistDetail = $model->asArray()->find($postData['checklist_detail_id']);

		if ($postData['task_type'] == getOptionValue('checklist_detail', 'task_type', 'employeeinformation')) {
			$taskTypeContent = json_decode($infoChecklistDetail['task_type_content'], true);
			foreach ($taskTypeContent as $key => $row) {
				$taskTypeContent[$key]['dataContent'] = '';
			}
			$dataUpdateChecklistDetail['task_type_content'] = json_encode($taskTypeContent);
		} else {
			$listFile = json_decode($infoChecklistDetail['file_upload'], true);
			$this->_handleRemoveChecklistDetailFile($postData['checklist_detail_id'], $listFile);
			$dataUpdateChecklistDetail['file_upload'] = json_encode([]);
		}
		$model->setAllowedFields(array_keys($dataUpdateChecklistDetail));
		try {
			$model->save($dataUpdateChecklistDetail);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		//update checklist complete task
		$modules->setModule('checklist');
		$modelChecklist = $modules->model;
		$infoChecklist = $modelChecklist->asArray()->find($postData['checklist_id']);
		$dataUpdateChecklist = [
			'id' => $postData['checklist_id'],
			'complete_task' => intval($infoChecklist['complete_task']) - 1,
			'status' => getOptionValue("checklist", "status", "inprogress")
		];

		$modelChecklist->setAllowedFields(array_keys($dataUpdateChecklist));
		try {
			$modelChecklist->save($dataUpdateChecklist);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respond($this->_getChecklistForReturn($modules, $postData['checklist_id'], $postData['checklist_detail_id']));
	}

	public function update_checklist_detail_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();
		if (!mayUpdate('checklist_detail')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$postData = $this->_handleTaskData($this->request->getPost());
		$dueDate = $postData['due_date'];
		$postData['id'] = $id;

		$modules->setModule('checklist_detail');
		$model = $modules->model;
		$dataHandleTask = handleDataBeforeSave($modules, $postData, array_keys($postData), array_keys($postData));
		if (!empty($dataHandleTask['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTask['validate'])->run($dataHandleTask['data'])) {
				throw new Exception(json_encode($validation->getErrors()));
			}
		}
		unset($dataHandleTask['fieldsArray']['checklist_id']);
		unset($dataHandleTask['fieldsArray']['status']);

		$model->setAllowedFields($dataHandleTask['fieldsArray']);
		$saveTask = $dataHandleTask['data'];
		try {
			$model->save($saveTask);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		if (strtotime($dueDate) > strtotime('+1 days')) {
			$infoChecklist = $model->asArray()->select(['checklist_id'])->find($id);
			$modules->setModule('checklist');
			$model = $modules->model;

			$model->setAllowedFields(['id', 'send_mail']);
			$model->save([
				'id' => $infoChecklist['checklist_id'],
				'send_mail' => 0
			]);
		}

		return $this->respond($this->_getChecklistForReturn($modules, 0, $id));
	}

	public function complete_checklist_post($id)
	{
		helper('app_select_option');
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		if (!mayUpdate('checklist')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$postData = $this->request->getPost();

		$modules->setModule('checklist');
		$modelChecklist = $modules->model;

		if (isset($postData['complete_checklist_detail']) && $postData['complete_checklist_detail'] == true) {
			$modules->setModule('checklist_detail');
			$modelChecklistDetail = $modules->model;
			$listChecklistDetail = $modelChecklistDetail->asArray()->where('checklist_id', $id)->findAll();
			foreach ($listChecklistDetail as $rowChecklistDetail) {
				$rowChecklistDetail = $rowChecklistDetail;
				$dataUpdateChecklistDetail = [
					'id' => $rowChecklistDetail['id'],
					'status' => getOptionValue('checklist_detail', 'status', 'completed')
				];
				$modelChecklistDetail->setAllowedFields(array_keys($dataUpdateChecklistDetail));
				try {
					$modelChecklistDetail->save($dataUpdateChecklistDetail);
				} catch (\ReflectionException $e) {
					return $this->fail(FAILED_SAVE);
				}
			}
		}

		$infoChecklist = $modelChecklist->asArray()->find($id);
		$dataUpdateChecklist = [
			'id' => $id,
			'status' => getOptionValue('checklist', 'status', 'completed'),
			'complete_task' => $infoChecklist['task_number']
		];

		$modelChecklist->setAllowedFields(array_keys($dataUpdateChecklist));
		try {
			$modelChecklist->save($dataUpdateChecklist);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated($id);
	}

	public function update_checklist_post($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules();

		if (!mayUpdate('checklist')) {
			return $this->failForbidden(MISSING_ADD_PERMISSION);
		}

		$postData = $this->request->getPost();
		$modules->setModule('checklist_template');
		$modelCheckListTemplate = $modules->model;
		$infoChecklistTemplate = $modelCheckListTemplate->find($postData['checklist_template_id']);
		if (is_null($infoChecklistTemplate)) {
			return $this->fail(FAILED_SAVE);
		}
		$modules->setModule('checklist_template_detail');
		$modelChecklistTemplateDetail = $modules->model;
		$listChecklistTemplateDetail = $modelChecklistTemplateDetail
			->asArray()
			->select(["task_name", "task_type", "assignee", "due_date_day", "due_date_type", "description", "task_type_content", "employee_id"])
			->where('checklist_template_id', $infoChecklistTemplate->id)
			->findAll();
		$modules->setModule('checklist');
		$modelChecklist = $modules->model;
		$infoCheckListBeforeUpdate = handleDataBeforeReturn($modules, $modelChecklist->asArray()->find($id));
		$dataChecklist =  $this->_handleChecklistData($postData);
		$dataChecklist['id'] = $id;
		$dataChecklist['name'] = $infoChecklistTemplate->name;
		$dataChecklist = handleDataBeforeSave($modules, $dataChecklist);

		if (!empty($dataChecklist['validate'])) {
			if (!$validation->reset()->setRules($dataChecklist['validate'])->run($dataChecklist['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}

		$modelChecklist->setAllowedFields($dataChecklist['fieldsArray']);
		$saveChecklist = $dataChecklist['data'];
		$saveChecklist['task_number'] = count($listChecklistTemplateDetail);
		$saveChecklist['complete_task'] = 0;
		try {
			$modelChecklist->save($saveChecklist);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		//delete checklist detail
		$modules->setModule('checklist_detail');
		$modelChecklistDetail = $modules->model;
		try {
			$modelChecklistDetail->where('checklist_id', $id)->delete();
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_DELETE);
		}
		$checklistDetailData = $this->_handleInsertChecklistDetail($modules, $validation, $postData, $id, $listChecklistTemplateDetail);

		//send mail
		$this->_handleSendMailAssignChecklist($modules, $id, $checklistDetailData);
		$this->_handleSendMailUpdateChecklist($modules, $infoCheckListBeforeUpdate, $saveChecklist);

		return $this->respondCreated($id);
	}

	public function get_list_todo_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_detail');

		if (!mayList('checklist_detail')) return $this->failForbidden(MISSING_LIST_PERMISSION);
		$data = $this->request->getGet();
		$currentUser = user();
		$userId = $currentUser->id;
		$model = $modules->model;
		$model->where('assignee', $userId);
		if (!empty($data['filters']['status'])) {
			$model->where('status', $data['filters']['status']);
		}
		$model->like('task_name', $data['filters']['task_name']);
		$result = loadDataWrapper($modules, $model, [], false);
		$result['results'] = handleDataBeforeReturn($modules, $result['results'], true);
		$arrChecklistId = array_unique(array_column(array_column($result['results'], 'checklist_id'), 'value'));

		//get list checklist
		$listChecklist = [];
		if ($arrChecklistId) {
			$modules->setModule('checklist');
			$modelChecklist = $modules->model;
			$listChecklist = handleDataBeforeReturn($modules, $modelChecklist->whereIn('id', $arrChecklistId)->findAll(), true);
		}
		$result['additionalData']['checklist'] =  $listChecklist;
		return $this->respond($result);
	}

	public function delete_checklist_detail_delete($checklistId, $checklistDetailId)
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();

		if (!mayDelete('checklist_detail')) {
			return $this->failForbidden(MISSING_DELETE_PERMISSION);
		}

		//delete checklist detail
		$modules->setModule('checklist_detail');
		$model = $modules->model;
		$infoChecklistDetail = $model->select(['id', 'checklist_id', 'status', 'task_type', 'file_upload'])->asArray()->find($checklistDetailId);
		try {
			$model->delete($checklistDetailId);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_DELETE);
		}

		if ($infoChecklistDetail['task_type'] == getOptionValue('checklist_detail', 'task_type', 'fileupload')) {
			$listFile = json_decode($infoChecklistDetail['file_upload']);
			$this->_handleRemoveChecklistDetailFile($checklistDetailId, $listFile);
		}

		//update checklist
		$modules->setModule('checklist');
		$model = $modules->model;
		$infoChecklist = $model->select(['id', 'task_number', 'complete_task'])->asArray()->find($checklistId);
		$dataUpdate = [
			'id' => $infoChecklistDetail['checklist_id'],
			'task_number' => $infoChecklist['task_number'] - 1
		];
		if ($infoChecklistDetail['status'] == getOptionValue('checklist_detail', 'status', 'completed')) {
			$dataUpdate['complete_task'] = $infoChecklist['complete_task'] - 1;
		}
		$model->setAllowedFields(array_keys($dataUpdate));
		$model->save($dataUpdate);

		$returnData = $this->_getChecklistForReturn($modules, $checklistId, 0);
		return $this->respond($returnData);
	}

	public function get_checklist_employee_info_get($id)
	{
		$modules = \Config\Services::modules();
		$modules->setModule('employees');
		$model = $modules->model;

		$infoEmployee = $model->find($id);

		return $this->respond([
			'info_employee' => handleDataBeforeReturn($modules, $infoEmployee)
		]);
	}

	public function get_checklist_detail_info_get($id)
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_detail');
		$model = $modules->model;

		$infoChecklistDetail = $model->asArray()->find($id);
		$infoChecklistDetailHandle = handleDataBeforeReturn($modules, $infoChecklistDetail);
		$taskType = $infoChecklistDetail['task_type'];
		$taskTypeContent = $infoChecklistDetail['task_type_content'];

		$modules->setModule('employees');
		$arrFieldValue = [];
		if ($taskType == getOptionValue('checklist_detail', 'task_type', 'employeeinformation')) {
			$taskTypeContent = json_decode($taskTypeContent, true);
			foreach ($taskTypeContent as  $row) {
				$arrFieldValue[$row['field']] = isset($row['dataContent']) ? $row['dataContent'] : "";
			}
		}
		$arrFieldValue = handleDataBeforeReturn($modules, $arrFieldValue);
		return $this->respond([
			'checklist_detail_info' => $infoChecklistDetailHandle,
			'list_field_value' => $arrFieldValue
		]);
	}

	public function complete_multi_checklist_detail()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$modules->setModule('checklist_detail');
		$model = $modules->model;

		$postData = $this->request->getPost();
		$arrChecklist = $postData['checklist'];
		foreach ($arrChecklist as $rowChecklistDetail) {
			$rowChecklistDetail = $rowChecklistDetail;
			$dataUpdateChecklistDetail = [
				'id' => $rowChecklistDetail['id'],
				'status' => getOptionValue('checklist_detail', 'status', 'completed')
			];
			$model->setAllowedFields(array_keys($dataUpdateChecklistDetail));
			try {
				$model->save($dataUpdateChecklistDetail);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
		}

		return $this->respond(ACTION_SUCCESS);
	}

	// ** support function
	private function _handleInsertChecklistDetail($modules, $validation, $postData, $idChecklist, $listChecklistTemplateDetail)
	{
		$modules->setModule('checklist_detail');
		$modelChecklistDetail = $modules->model;
		$arrDataChecklistDetail = [];
		foreach ($listChecklistTemplateDetail as $checklistTemplateDetail) {
			$dataChecklistDetail = $this->_handleChecklistDetailData($checklistTemplateDetail, [
				'join_date' => $postData['employee']['join_date'],
				'employee_id' => $postData['employee']['id'],
				'hr_in_charge' => $postData['hr_in_charge'],
				'line_manager' => $postData['employee']['line_manager']
			]);
			$dataChecklistDetail['checklist_id'] = $idChecklist;
			$arrDataChecklistDetail[] = $dataChecklistDetail;
			$dataChecklistDetail = handleDataBeforeSave($modules, $dataChecklistDetail);
			$modelChecklistDetail->setAllowedFields($dataChecklistDetail['fieldsArray']);
			$saveChecklistDetail = $dataChecklistDetail['data'];
			try {
				//$modelChecklistDetail->save($saveChecklistDetail);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
		}

		return $arrDataChecklistDetail;
	}

	private function _handlePostData($data)
	{
		$data['type'] = (isset($data['type']) && is_array($data['type'])) ? reset($data['type']) : $data['type'];
		return $data;
	}

	private function _handleTaskData($data)
	{
		helper('app_select_option');
		if ($data['task_type'] == getOptionValue('checklist_template_detail', 'task_type', 'employeeinformation') || $data['task_type'] == getOptionValue('checklist_detail', 'task_type', 'employeeinformation')) {
			$data['task_type_content'] = $data['chosenEmployeeField'];
			unset($data['chosenEmployeeField']);
		}
		return $data;
	}

	private function _convertEmployeeStatus($type)
	{
		helper('app_select_option');
		switch ($type) {
			case getOptionValue('checklist', 'type', 'onboarding'):
				return getOptionValue('employees', 'status', 'onboarding');
				break;
			case getOptionValue('checklist', 'type', 'offboarding'):
				return getOptionValue('employees', 'status', 'offboarding');
				break;
			default:
				return 0;
				break;
		}
	}

	private function _handleChecklistData($data)
	{
		$data['employee_id'] = isset($data['employee']) ? $data['employee']['id'] : 0;
		unset($data['employee']);
		return $data;
	}

	private function _convertTaskTypeOption($taskType)
	{
		helper('app_select_option');
		switch ($taskType) {
			case getOptionValue('checklist_template_detail', 'task_type', 'checkbox'):
				return getOptionValue('checklist_detail', 'task_type', 'checkbox');
				break;
			case getOptionValue('checklist_template_detail', 'task_type', 'fileupload'):
				return getOptionValue('checklist_detail', 'task_type', 'fileupload');
				break;
			case getOptionValue('checklist_template_detail', 'task_type', 'employeeinformation'):
				return getOptionValue('checklist_detail', 'task_type', 'employeeinformation');
				break;
			default:
				return 0;
				break;
		}
	}

	private function _handleChecklistDetailData($data, $params = [])
	{
		helper('app_select_option');
		$employeeId = $params['employee_id'];
		$dueDate = $params['join_date'];
		$hr = $params['hr_in_charge'];
		$dueDateType = $data['due_date_type'];
		$lineManager = $params['line_manager'];
		if ($dueDateType == getOptionValue('checklist_template_detail', 'due_date_type', 'after')) {
			$method = '+';
		} elseif ($dueDateType == getOptionValue('checklist_template_detail', 'due_date_type', 'before')) {
			$method = '-';
		}
		$dueDate = modifyDate($dueDate, $data['due_date_day'], $method);
		$data['due_date'] = $dueDate;
		$assigneeType = '';
		switch ($data['assignee']) {
			case getOptionValue('checklist_template_detail', 'assignee', 'employee'):
				$data['assignee'] = $employeeId;
				break;
			case getOptionValue('checklist_template_detail', 'assignee', 'hrincharge'):
				$data['assignee'] = $hr;
				break;
			case getOptionValue('checklist_template_detail', 'assignee', 'linemanager'):
				$data['assignee'] = $lineManager;
				break;
			case getOptionValue('checklist_template_detail', 'assignee', 'specificemployee'):
				$data['assignee'] = $data['employee_id'];
				break;
			default:
				$data['assignee'] = [];
				break;
		}
		$data['task_type'] = $this->_convertTaskTypeOption($data['task_type']);
		$data['status'] = getOptionValue('checklist_detail', 'status', 'inprogress');
		unset($data['due_date_type']);
		unset($data['due_date_day']);
		return $data;
	}

	private function _uploadChecklistDetailFile($id, $filesData)
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$storePath = getModuleUploadPath('checklist_detail', $id, false) . 'data/';
		$paths = $uploadService->uploadFile($storePath, $filesData);

		return $paths;
	}

	private function _getChecklistForReturn($modules, $checklistId = 0, $checklistDetailId = 0)
	{
		if (!empty($checklistId)) {
			$modules->setModule('checklist');
			$model = $modules->model;
			$infoChecklist = handleDataBeforeReturn($modules, $model->asArray()->find($checklistId));
		} else {
			$infoChecklist = new stdClass();
		}

		if (!empty($checklistDetailId)) {
			$modules->setModule('checklist_detail');
			$model = $modules->model;
			$infoChecklistDetail = handleDataBeforeReturn($modules, $model->asArray()->find($checklistDetailId));
		} else {
			$infoChecklistDetail = new stdClass();
		}

		return [
			'info_checklist' => $infoChecklist,
			'info_checklist_detail' => $infoChecklistDetail
		];
	}

	private function _handleRemoveChecklistDetailFile($checklistDetailId, $listFile)
	{
		if ($listFile) {
			foreach ($listFile as $key => $filesData) {
				$storePath = getModuleUploadPath('checklist_detail', $checklistDetailId) . 'data/';
				$removePath = $storePath . $filesData['filename'];
				if (is_file($removePath)) {
					unlink($removePath);
				}
			}
		}
	}

	private function _handleSendMailAssignChecklist($modules, $checklistId, $checklistDetailData)
	{
		$modules->setModule('checklist');
		$model = $modules->model;

		$infoChecklist = handleDataBeforeReturn($modules, $model
			->asArray()
			->select([
				'id',
				'type',
				'employee_id'
			])
			->find($checklistId));

		$modules->setModule('checklist_detail');
		$dataSendMail = [
			'checklist' =>  $infoChecklist,
			'checklist_detail' => handleDataBeforeReturn($modules, $checklistDetailData, true)
		];

		\CodeIgniter\Events\Events::trigger('send_mail_assign_checklist', $dataSendMail);
	}

	private function _handleSendMailUpdateChecklist($modules, $infoCheckListBeforeUpdate, $newChecklistData)
	{
		if ($infoCheckListBeforeUpdate['checklist_template_id'] != $newChecklistData['checklist_template_id']) {
			$modules->setModule('checklist');
			$newChecklistData = handleDataBeforeReturn($modules, $newChecklistData);

			$dataSendMail = [
				'updated_by' => user()->full_name,
				'receiver_id' => $infoCheckListBeforeUpdate['hr_in_charge']['value'],
				'receiver_email' => $infoCheckListBeforeUpdate['hr_in_charge']['email'],
				'receiver_name' => $infoCheckListBeforeUpdate['hr_in_charge']['full_name'],
				'type' => $newChecklistData['type']['name_option'],
				'employee_name' => $infoCheckListBeforeUpdate['employee_id']['label'],
				'template_name_from' => $infoCheckListBeforeUpdate['checklist_template_id']['label'],
				'template_name_to' => $newChecklistData['checklist_template_id']['label'],
			];

			\CodeIgniter\Events\Events::trigger('send_mail_update_checklist', $dataSendMail);
		}
	}

	private function _handleSendMailOffBoardingChecklist($modules, $checklistId, $checklistDetailData)
	{
		$modules->setModule('checklist');
		$model = $modules->model;

		$infoChecklist = handleDataBeforeReturn($modules, $model
			->asArray()
			->select([
				'id',
				'type',
				'employee_id'
			])
			->find($checklistId));

		$modules->setModule('checklist_detail');
		$dataSendMail = [
			'checklist' =>  $infoChecklist,
			'checklist_detail' => handleDataBeforeReturn($modules, $checklistDetailData, true)
		];

		\CodeIgniter\Events\Events::trigger('send_mail_off_boarding_checklist', $dataSendMail);
	}
}
