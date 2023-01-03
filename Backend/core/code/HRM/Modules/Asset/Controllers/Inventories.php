<?php

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;

class Inventories extends ErpController
{
	public function add_new_inventory_post()
	{
		$getPara = $this->request->getPost();
		$inventory_name = $getPara['inventory_name'];
		$inventory_description = $getPara['inventory_description'];
		if (empty($inventory_name)) {
			return $this->failServerError("empty inventory name");
		}

		$moduleName = "asset_inventories";
		$modules = \Config\Services::modules($moduleName);
		$model = $modules->model;
		$model->setAllowedFields(["inventory_name", "inventory_description"]);
		$dataSave = ["inventory_name" => $inventory_name, "inventory_description" => $inventory_description];
		try {
			$model->save($dataSave);
			return $this->respond(ACTION_SUCCESS);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
	}

	public function get_list_inventory_get()
	{
		$getPara = $this->request->getGet();
		$page = (isset($getPara['currentPage'])) ? $getPara['currentPage'] : 1;
		$length = (isset($getPara['pageSize'])) ? $getPara['pageSize'] : 0;
		$start = ($page - 1) * $length;
		$moduleName = "asset_inventories";
		$modules = \Config\Services::modules($moduleName);
		$model = $modules->model;
		$recordsTotal = $model->countAllResults(false);
		$data = $model->asArray()->findAll($length, $start);

		$result['data'] = $data;
		$result['recordsTotal'] = $recordsTotal;
		return $this->respond($result);
	}

	public function get_inventory_get($id)
	{
		echo "<pre>";
		print_r($id);
		echo "</pre>";

	}
}