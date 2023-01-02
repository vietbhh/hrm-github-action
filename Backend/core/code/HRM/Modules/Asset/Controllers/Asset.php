<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : asset
*/

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Asset\Models\AssetListModel;

class Asset extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function add_post()
	{
		helper(['app_select_option']);
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$postData = $this->request->getPost();
		$filesData = $this->request->getFiles();
		$dataHandle = handleDataBeforeSave('asset_lists', $postData, $filesData);
		$uploadFieldsArray = $dataHandle['uploadFieldsArray'];
		$dataSave = $dataHandle['data'];

		$assetListModel = new AssetListModel();
		if (isset($postData['id'])) {
			$assetListModel->save($dataSave);
		}
		$id = isset($postData['id']) ? $postData['id'] : $assetListModel->insertAssetList($dataSave);

		// history
		if (!isset($postData['id'])) {
			$history['asset_code'] = $id;
			$history['type'] = getOptionValue('asset_history', 'type', 'warehouse');
			$history['owner_current'] = $postData['owner'];
			$assetListModel->insertHistory($history);
		}
		if ($filesData) {
			foreach ($filesData as $key => $files) {
				if (empty($files)) continue;
				if (!is_array($files)) $files = [$files];
				foreach ($files as $position => $file) {
					if (!$file->isValid()) {
						return $this->failValidationErrors($file->getErrorString() . '(' . $file->getError() . ')');
					}
					if (!$file->hasMoved()) {
						$subPath = (!empty($uploadFieldsArray[$key])) ? 'other' : 'data';
						$storePath = getModuleUploadPath('asset_lists', $id, false) . $subPath . '/';
						if ($key === 'filesDataWillUpdate') {
							$fileName = $dataSave[$key][$position]['name'];
							$removeOldFilePath = $storePath . $fileName;
							$removeOldFilePathForDownload = $storePath . $fileName;
							$uploadService->removeFile($removeOldFilePathForDownload);
							$fileName = safeFileName($fileName);
							$uploadService->uploadFile($storePath, [$file], false, $fileName);
						} else {
							$fileName = safeFileName($file->getName());
							$uploadService->uploadFile($storePath, [$file], false, $fileName);
							if (!empty($uploadFieldsArray[$key])) {
								if ($uploadFieldsArray[$key]->field_type == 'upload_multiple') {
									$arrayFiles = isset($dataSave[$key]) ? json_decode($dataSave[$key], true) : [];
									$arrayFiles[] = $fileName;
									$dataSave[$key] = json_encode($arrayFiles);
								} else {
									$dataSave[$key] = $fileName;
								}
							}
						} //end check file update
					}
				}
			}

			try {
				$dataSave['id'] = $id;
				$assetListModel->save($dataSave);
				return $this->respond(ACTION_SUCCESS);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE . '_' . $e->getMessage());
			}
		}
	}

	public function load_data_get()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules('asset_lists');
		$getPara = $this->request->getGet();
		$model = $modules->model;
		$data['assetTotal'] = $model->countAllResults();
		$data['assetThisMonth'] = $model->where('MONTH(date_created)', date("m"))->where('YEAR(date_created)', date("Y"))->countAllResults(true);

		if (isset($getPara['filters'])) {


			foreach ($getPara['filters'] as $key => $val) {
				if ($key === 'owner') {
					if ($val) {
						$model->where('m_asset_lists.owner', $val);
					}
				} else {
					if ($val) {
						$model->where($key, $val);
					}
				}
			}
		}

		if (isset($getPara['search']) && $getPara['search']) {
			$model->groupStart();
			$model->like('asset_code', $getPara['search']);
			$model->orLike('asset_name', $getPara['search']);
			$model->orLike('asset_properties', $getPara['search']);
			$model->orLike('asset_descriptions', $getPara['search']);
			$model->orLike('asset_notes', $getPara['search']);
			$model->groupEnd();
		}
		$data['recordsTotal'] = $model->countAllResults(false);
		$list = $model->select('*,m_asset_lists.id as id,m_asset_lists.owner as owner')
			->join('m_asset_types', 'm_asset_types.id = m_asset_lists.asset_type', 'left')
			->join('m_asset_groups', 'm_asset_groups.id = m_asset_types.asset_type_group', 'left')->orderBy('date_created', 'DESC')->asArray()->findAll($getPara['perPage'], $getPara['page'] * $getPara['perPage'] - $getPara['perPage']);
		$data['asset_list'] = handleDataBeforeReturn($modules, $list, true);
		$data['page'] = $getPara['page'];
		return $this->respond($data);
	}

	public function update_status_post()
	{
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$filesData = $this->request->getFiles();

		$dataHandle = handleDataBeforeSave($modules, $postData, $filesData);
		$dataSave = $dataHandle['data'];
		$assetListModel = new AssetListModel();

		$insertHis = $assetListModel->insertHistory($dataSave, $filesData);
		echo "<pre>";
		print_r($insertHis);
		echo "</pre>";

		return $this->respond(ACTION_SUCCESS);
	}

	public function hand_over_post()
	{
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$assetListModel = new AssetListModel();
		$dataHandle = handleDataBeforeSave($modules, $postData);
		$dataSave = $dataHandle['data'];

		$assetListModel->insertHistory($dataSave);
		$assetListModel->save(['owner' => $postData['owner_change'], 'id' => $postData['asset_code']]);
		return $this->respond(ACTION_SUCCESS);
	}

	public function error_post()
	{
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$assetListModel = new AssetListModel();
		$dataHandle = handleDataBeforeSave($modules, $postData);
		$dataSave = $dataHandle['data'];

		$assetListModel->insertHistory($dataSave);
		$assetListModel->save(['asset_status' => $postData['status_change'], 'id' => $postData['asset_code']]);
		return $this->respond(ACTION_SUCCESS);
	}

	public function load_history_get()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules('asset_history');
		$getPara = $this->request->getGet();
		$model = $modules->model;
		if (!isset($getPara['page'])) {
			$getPara['page'] = 1;
		}
		if (!isset($getPara['limit'])) {
			$getPara['limit'] = 5;
		}
		$dataReturn['page'] = $getPara['page'];
		$model->where('asset_code', $getPara['asset_code']);
		$dataReturn['recordsTotal'] = $model->countAllResults(false);

		$history = $model->orderBy('created_at', 'desc')->findAll($getPara['limit'] * $getPara['page'], 0);
		$dataReturn['history'] = handleDataBeforeReturn('asset_history', $history, true);
		return $this->respond($dataReturn);
	}
}