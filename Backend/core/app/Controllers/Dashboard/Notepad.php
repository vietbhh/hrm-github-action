<?php

namespace App\Controllers\Dashboard;

use App\Controllers\ErpController;
use App\Models\AppModel;

class Notepad extends ErpController
{
	protected $model;

	public function __construct()
	{
		$this->model = new AppModel();
		$this->model->setTable("notepad");
	}

	public function save_post()
	{
		$getPost = $this->request->getPost();
		$dataSave = [
			"user_id" => user_id(),
			"title" => $getPost['title'],
			"content" => $getPost['content']
		];
		if (!empty($getPost['id'])) {
			$dataSave['id'] = $getPost['id'];
			$this->model->where("user_id", user_id());
		}
		try {
			$this->model->setAllowedFields(["user_id", "title", "content"]);
			$this->model->save($dataSave);
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_all_get()
	{
		$dataPin = $this->model->where("user_id", user_id())->where("pin", 1)->orderBy("id", "desc")->findAll();
		$dataUnPin = $this->model->where("user_id", user_id())->where("pin", 0)->orderBy("id", "desc")->findAll();

		return $this->respond(["dataPin" => $dataPin, "dataUnPin" => $dataUnPin]);
	}

	public function get_get($id)
	{
		$data = $this->model->where("user_id", user_id())->where("id", $id)->first();
		return $this->respond($data);
	}

	public function pin_get($id)
	{
		try {
			$this->model->setAllowedFields(["pin"]);
			$this->model->save(["user_id" => user_id(), "id" => $id, "pin" => 1]);
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function un_pin_get($id)
	{
		try {
			$this->model->setAllowedFields(["pin"]);
			$this->model->save(["user_id" => user_id(), "id" => $id, "pin" => 0]);
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function delete_get($id)
	{
		try {
			$this->model->where("user_id", user_id())->where("id", $id)->delete();
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function delete_multiple_post()
	{
		$arrId = $this->request->getPost()['arrId'];
		try {
			$this->model->where("user_id", user_id())->whereIn("id", $arrId)->delete();
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}
}