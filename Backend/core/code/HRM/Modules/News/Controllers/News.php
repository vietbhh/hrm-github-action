<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : news
* Controller name : News
* Time created : 20/04/2022 11:34:47
*/

namespace HRM\Modules\News\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Employees\Models\EmployeesModel;

class News extends ErpController
{
	private function getModelNews($getPara)
	{
		helper('app_select_option');
		$moduleName = 'news';
		$module = \Config\Services::modules($moduleName);
		$newsModel = $module->model;
		$isManage = isSuper($moduleName);
		$user_id = user()->id;
		if (!$isManage) {
			$newsModel->groupStart();
			$newsModel->where("JSON_SEARCH(employee, 'all', '{$user_id}', null, '$[*]') IS NOT NULL");
			$newsModel->orWhere("employee IS NULL");
			$newsModel->orWhere("employee", "[]");
			$newsModel->orWhere("employee", "");
			$newsModel->groupEnd();
		}
		if (isset($getPara['filters']['status'])) {
			if ($getPara['filters']['status'] == 1) {
				$getPara['filters']['status'] = getOptionValue("news", "status", "published");
			}
			$newsModel->where("status", $getPara['filters']['status']);
		}

		if (isset($getPara['filters']['created_at_from']) || isset($getPara['filters']['created_at_to'])) {
			if (!empty($getPara['filters']['created_at_from'])) {
				$minvalue = $getPara['filters']['created_at_from'] . " 00:00:00";
				$newsModel->where("created_at >= '$minvalue'", null, false);
			}
			if (!empty($getPara['filters']['created_at_to'])) {
				$maxvalue = $getPara['filters']['created_at_to'] . " 23:59:59";
				$newsModel->where("created_at <= '$maxvalue'", null, false);
			}
		}

		if (isset($getPara['search']) && !empty($getPara['search'])) {
			$newsModel->like('title ', $getPara['search']);
		}

		return $newsModel;
	}

	public function load_news_get()
	{
		$getPara = $this->request->getGet();
		$moduleName = 'news';
		$module = \Config\Services::modules($moduleName);
		$datetoday = date('Y-m-d');

		// dashboard
		if (filter_var($getPara['checkAnnouncements'], FILTER_VALIDATE_BOOLEAN)) {
			$length = (isset($getPara['perPage'])) ? $getPara['perPage'] : 0;
			$data_important = $this->getModelNews($getPara)->where('important', 1)->where('important_end_date >=', $datetoday)->orderBy('id', 'desc')->findAll($length, 0);
			$data_new = $this->getModelNews($getPara)->where("(important = 0 or important_end_date < '$datetoday' or important_end_date is null or important_end_date = '')")->orderBy('id', 'desc')->findAll(2, 0);

			$dataArr['data_important'] = $data_important;
			$dataArr['data_new'] = $data_new;
			return $this->respond($dataArr);
		} else {
			$dataImportant = $this->getModelNews($getPara)->where('important', 1)->where('important_end_date >=', $datetoday)->orderBy('id', 'desc')->findAll();
			$dataNew = $this->getModelNews($getPara)->where("(important = 0 or important_end_date < '$datetoday' or important_end_date is null or important_end_date = '')")->orderBy('id', 'desc')->findAll();
			$data = array_merge($dataImportant, $dataNew);
			$recordsTotal = count($data);
			$page = (isset($getPara['page'])) ? $getPara['page'] : 1;
			$length = (isset($getPara['perPage'])) ? $getPara['perPage'] : 0;
			if (isset($getPara['page'])) {
				$start = ($page - 1) * $length;
			} else {
				$start = (isset($data['start'])) ? $data['start'] : 0;
			}
			$end_record = ($start - 1) + $length;
			$recordsTotalPage = $length * $page;
			$dem = -1;
			foreach ($data as $key => $item) {
				$dem++;
				if ($dem < $start || $end_record < $dem) {
					unset($data[$key]);
				}
			}
			$data = array_values($data);

			if ($recordsTotalPage < $recordsTotal) {
				$hasMore = true;
			} else {
				$hasMore = false;
			}

			$dataArr['results'] = handleDataBeforeReturn($module, $data, true);
			$dataArr['recordsTotal'] = $recordsTotal;
			$dataArr['page'] = $page;
			$dataArr['hasMore'] = $hasMore;
			return $this->respond($dataArr);
		}
	}

	public function add_news_post()
	{
		helper('app_select_option');
		$moduleName = 'news';
		$validation = \Config\Services::validation();
		$module = \Config\Services::modules();
		$getPara = $this->request->getPost();
		$module->setModule($moduleName);
		$newsModel = $module->model;
		$dataHandleNews = handleDataBeforeSave($module, $getPara);

		if (!empty($dataHandleNews['validate'])) {
			if (!$validation->reset()->setRules($dataHandleNews['validate'])->run($dataHandleNews['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$newsModel->setAllowedFields($dataHandleNews['fieldsArray']);

		if ($getPara['status'] == 1) {
			$status = getOptionValue("news", "status", "published");
		} else {
			$status = getOptionValue("news", "status", "draft");
		}

		$dataHandleNews['data']['status'] = $status;
		$saveEmployee = $dataHandleNews['data'];

		try {
			$newsModel->save($saveEmployee);
			$id = $newsModel->getInsertID();

			return $this->respondCreated($id);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
	}

	public function get_employees_by_department_get()
	{
		$moduleName = 'employees';
		$module = \Config\Services::modules($moduleName);
		$getPara = $this->request->getGet();

		$employeesModel = new EmployeesModel();
		if (!mayList($moduleName)) {
			return $this->failForbidden(MISSING_LIST_PERMISSION);
		}

		if (empty($getPara['department'])) {
			return $this->respond([]);
		}

		$employeesModel->whereIn("department_id", $getPara['department']);
		$data = $employeesModel->select(['id as value', 'avatar as icon', 'full_name', 'email', 'username as label'])->exceptResigned()->findAll();

		return $this->respond(handleDataBeforeReturn($module, $data, true));
	}

	public function upload_image_post()
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$image = $this->request->getFiles()['data'];
		$data['link'] = 'null';
		if ($image) {
			if ($image->isValid()) {
				$newName = $image->getRandomName();
				$storePath = '/modules/news/images/';
				$uploadService->uploadFile($storePath, [$image]);
				$data['link'] = $_ENV['app.baseURL'] . '/news/image?name=modules/news/images/' . $newName;
			}
		}
		return json_encode($data);
	}

	public function image_get()
	{
		// name=modules/articles/ID/other/name
		$path = $this->request->getVar('name');
		$filepath = WRITEPATH . 'uploads/' . $path;

		if (empty($path) || !file_exists($filepath) || !is_readable($filepath)) {
			$customDefault = WRITEPATH . 'uploads/default/img-not-found.png';
			if (empty($customDefault) || !file_exists($customDefault) || !is_readable($customDefault)) {
				$filepath = COREPATH . 'assets/images/default/img-not-found.png';
			} else {
				$filepath = $customDefault;
			}
		}

		header('Access-Control-Allow-Origin: *');
		header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
		$method = $_SERVER['REQUEST_METHOD'];
		if ($method == "OPTIONS") {
			die();
		}

		http_response_code(200);
		header('Content-Length: ' . filesize($filepath));
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		$fileinfo = pathinfo($filepath);
		header('Content-Type: ' . finfo_file($finfo, $filepath));
		finfo_close($finfo);
		header('Content-Disposition: attachment; filename="' . basename($fileinfo['basename']) . '"'); // feel free to change the suggested filename
		ob_clean();
		flush();
		readfile($filepath);
	}

	public function delete_news_get($id)
	{
		if (!mayDelete("news")) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$module = \Config\Services::modules("news");
		$model = $module->model;
		$model->where('id', $id)->delete();
		$module = \Config\Services::modules("new_comments");
		$model = $module->model;
		$model->where('new_id', $id)->delete();

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_news_detail_get($id)
	{
		$moduleName = "news";
		$module = \Config\Services::modules($moduleName);
		$model = $module->model;
		$newData = $model->asArray()->find($id);
		if (!$newData) return $this->failNotFound(NOT_FOUND);
		$data = handleDataBeforeReturn($module, $newData);
		$newComments = $this->getNewComments($data['id'], 1);
		$data['newComments'] = $newComments;
		return $this->respond($data);
	}

	public function save_comment_post()
	{
		$module = \Config\Services::modules("new_comments");
		$getParam = $this->request->getPost();
		$comment = $getParam['comment'];
		$id = $getParam['id'];
		$model = $module->model;
		$model->setAllowedFields(["new_id", "comment"]);

		try {
			$model->save(["new_id" => $id, "comment" => $comment]);
			$results = $this->getNewComments($id, 1);
			$results['total_comment'] = $this->updateTotalComment($id);
			return $this->respond($results);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
	}

	public function load_more_comments_get()
	{
		$getParam = $this->request->getGet();
		$id = $getParam['id'];
		$page = $getParam['page'] + 1;
		$results = $this->getNewComments($id, $page);

		return $this->respond($results);
	}

	public function edit_comment_post()
	{
		$getParam = $this->request->getPost();
		$comment = $getParam['comment'];
		$id = $getParam['id'];
		$moduleName = "new_comments";
		$module = \Config\Services::modules($moduleName);
		$model = $module->model;
		$newCommentData = $model->asArray()->find($id);
		if (!$newCommentData) return $this->failNotFound(NOT_FOUND);
		if ($newCommentData['owner'] != user_id()) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$model->setAllowedFields(["comment"]);

		try {
			$model->save(["id" => $id, "comment" => $comment]);
			return $this->respond(ACTION_SUCCESS);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
	}

	public function delete_comment_get($id)
	{
		$moduleName = "new_comments";
		$module = \Config\Services::modules($moduleName);
		$model = $module->model;
		$newCommentData = $model->asArray()->find($id);
		if (!$newCommentData) return $this->failNotFound(NOT_FOUND);
		if (!mayDelete($moduleName) && $newCommentData['owner'] != 2) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$model->where('id', $id)->delete();
		$newId = $newCommentData['new_id'];
		$results = $this->getNewComments($newId, 1);
		$results['total_comment'] = $this->updateTotalComment($newId);
		return $this->respond($results);
	}

	private function getNewComments($newId, $page)
	{
		$module = \Config\Services::modules("new_comments");
		$model = $module->model;
		$recordsTotal = $model->where('new_id', $newId)->countAllResults(false);

		$length = 10;
		$start = ($page - 1) * $length;
		$recordsTotalPage = $length * $page;
		$data = $model->select('m_new_comments.id as id, m_new_comments.comment as comment, m_new_comments.owner as owner, m_employees.avatar as avatar, m_employees.full_name as full_name')->join('m_employees', 'm_employees.id = m_new_comments.owner')->where('new_id', $newId)->orderBy('id', 'desc')->findAll($length, $start);

		if ($recordsTotalPage < $recordsTotal) {
			$hasMore = true;
		} else {
			$hasMore = false;
		}
		$dataArr['results'] = $data;
		$dataArr['recordsTotal'] = $recordsTotal;
		$dataArr['page'] = $page;
		$dataArr['hasMore'] = $hasMore;

		return $dataArr;
	}

	private function updateTotalComment($newId)
	{
		$module = \Config\Services::modules("new_comments");
		$model = $module->model;
		$total_comment = $model->where('new_id', $newId)->countAllResults();
		$module = \Config\Services::modules("news");
		$model = $module->model;
		$model->setAllowedFields(["total_comment"]);
		$model->save(["id" => $newId, "total_comment" => $total_comment]);

		return $total_comment;
	}
}
