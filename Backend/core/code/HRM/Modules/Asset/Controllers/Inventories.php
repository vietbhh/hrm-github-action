<?php

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Asset\Models\AssetListModel;

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
		$moduleName = "asset_inventories";
		$modules = \Config\Services::modules($moduleName);
		$model = $modules->model;
		return $this->respond($model->asArray()->find($id));
	}

	public function get_list_inventory_detail_get()
	{
		$getPara = $this->request->getGet();
		$page = (isset($getPara['page'])) ? $getPara['page'] : 1;
		$length = (isset($getPara['perPage'])) ? $getPara['perPage'] : 0;
		$start = ($page - 1) * $length;
		$moduleName = "asset_inventories_detail";
		$modules = \Config\Services::modules($moduleName);
		$model = $modules->model;
		$recordsTotal = $model->countAllResults(false);
		$data = $model->asArray()->join("m_asset_lists", "m_asset_lists.id = m_asset_inventories_detail.asset_code")->select(["m_asset_inventories_detail.*", "m_asset_lists.asset_name as asset_name"])->orderBy('m_asset_inventories_detail.id', 'desc')->findAll($length, $start);

		$result['results'] = handleDataBeforeReturn($modules, $data, true);
		$result['recordsTotal'] = $recordsTotal;
		return $this->respond($result);
	}

	public function get_asset_detail_get()
	{
		$getPara = $this->request->getGet();
		$asset_code = $getPara['asset_code'];
		$moduleName = "asset_lists";
		$modules = \Config\Services::modules($moduleName);
		$model = $modules->model;
		$data = $model->where("asset_code", $asset_code)->first();
		if (empty($data)) {
			return $this->failNotFound();
		}
		return $this->respond(handleDataBeforeReturn($modules, $data));
	}

	public function save_inventory_detail_post()
	{
		$getPara = $this->request->getPost();
		$idInventory = $getPara['idInventory'];
		$idAsset = $getPara['idAsset'];
		$current_status = $getPara['current_status'];
		$notes = $getPara['notes'];
		$file = $this->request->getFiles();
		$modulesStatus = \Config\Services::modules("asset_status");
		$modelStatus = $modulesStatus->model;
		$statusQuery = $modelStatus->asArray()->where("status_name", $current_status)->first();
		if ($statusQuery) {
			$status = $statusQuery['id'];
		} else {
			$status = 0;
		}
		$modulesDetail = \Config\Services::modules("asset_inventories_detail");
		$modelDetail = $modulesDetail->model;
		$modelDetail->setAllowedFields(["inventory", "asset_code", "current_status", "notes", "recent_image"]);
		$dataSaveDetail = [
			"inventory" => $idInventory,
			"asset_code" => $idAsset,
			"current_status" => $status,
			"notes" => $notes
		];
		$modelDetail->save($dataSaveDetail);
		$idDetail = $modelDetail->getInsertID();

		// update status asset
		$modulesAsset = \Config\Services::modules("asset_lists");
		$modelAsset = $modulesAsset->model;
		$modelAsset->setAllowedFields(["asset_status", "recent_image"]);
		$dataAsset = $modelAsset->find($idAsset);
		if ($dataAsset) {
			$dataSaveAsset = [
				"id" => $idAsset,
				"asset_status" => $status,
			];
			$modelAsset->save($dataSaveAsset);
		}

		helper('app_select_option');
		$assetListModel = new AssetListModel();
		$filesData = ['history_image' => $file['recent_image']];
		$dataHistory = [
			"asset_code" => $idAsset,
			"type" => getOptionValue('asset_history', 'type', 'inventory'),
			"owner_current" => $dataAsset ? $dataAsset->owner : "",
			"owner_change" => $dataAsset ? $dataAsset->owner : "",
			"status_current" => $dataAsset ? $dataAsset->asset_status : 0,
			"status_change" => $status,
			"notes" => $notes,
		];
		$dataReturnHistory = $assetListModel->insertHistory($dataHistory, $filesData);

		if (!empty($file)) {
			$uploadService = \App\Libraries\Upload\Config\Services::upload();
			$storePath = getModuleUploadPath('asset_lists', $idAsset, false) . 'other/';
			$pathAsset = getModuleUploadPath('asset_inventories_detail', $idDetail, false) . 'other/';
			$uploadService->copyFile($storePath, $pathAsset, $dataReturnHistory['history_image']);
			$modelDetail->save([
				"id" => $idDetail,
				"recent_image" => $dataReturnHistory['history_image'],
			]);
		}

		return $this->respond(ACTION_SUCCESS);
	}
}