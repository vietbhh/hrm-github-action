<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : asset
*/

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;

class Asset extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
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
				if ($val) {
					$model->where($key, $val);
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
		$list = $model->findAll();
		$data['asset_list'] = handleDataBeforeReturn($modules, $list, true);
		return $this->respond($data);
	}

	public function update_status_post()
	{
		helper(['app_select_option', 'filesystem']);
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$filesData = $this->request->getFiles();

		$historyModel = $modules->model;

		$dataHandle = handleDataBeforeSave($modules, $postData, $filesData);

		$uploadFieldsArray = $dataHandle['uploadFieldsArray'];
		$dataSave = $dataHandle['data'];
		$historyModel->setAllowedFields($dataHandle['fieldsArray']);
		$historyModel->save($dataSave);
		$id = $historyModel->getInsertID();

		$dataSave['id'] = $id;
		/// files
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
						$storePath = getModuleUploadPath('asset_history', $id, false) . $subPath . '/';
						if ($key === 'filesDataWillUpdate') {
							$fileName = $dataSave[$key][$position]['name'];
							$removeOldFilePath = $storePath . $fileName;
							$removeOldFilePathForDownload = $storePath . $fileName;
							$uploadService->removeFile($removeOldFilePathForDownload);
							$fileName = safeFileName($fileName);
							$uploadService->uploadFile($storePath, [$file], false, $fileName);
						} else {
							$fileName = safeFileName($file->getName());
							// upload to asset
							if ($key === 'history_image') {
								$pathAsset = '/modules/asset_lists/' . $dataSave['asset_code'] . '/other/';
								$uploadService->uploadFile($pathAsset, [$file], false, $fileName);
								$modules->setModule('asset_lists');
								$model = $modules->model;
								$model->setAllowedFields(['recent_image', 'asset_status']);
								$model->save(['recent_image' => $fileName, 'asset_status' => $dataSave['status_change'], 'id' => $dataSave['asset_code']]);
							}

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
				$modules->setModule('asset_history');
				$historyModel = $modules->model;
				$historyModel->setAllowedFields(array_keys($dataSave));
				$historyModel->save($dataSave);
				return $this->respond(ACTION_SUCCESS);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE . '_' . $e->getMessage());
			}
		}
	}

	public function hand_over_post()
	{
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$historyModel = $modules->model;

		$dataHandle = handleDataBeforeSave($modules, $postData);
		$dataSave = $dataHandle['data'];
		$historyModel->setAllowedFields($dataHandle['fieldsArray']);
		$historyModel->save($dataSave);

		$modules->setModule('asset_lists');
		$assetModel = $modules->model;
		$assetModel->setAllowedFields(['owner']);
		$assetModel->save(['owner' => $postData['owner_change'], 'id' => $postData['asset_code']]);
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
		$dataReturn['history'] = handleDataBeforeReturn($modules, $history, true);
		return $this->respond($dataReturn);
	}
}