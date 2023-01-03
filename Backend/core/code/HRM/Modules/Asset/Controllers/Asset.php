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

	public function get_data_asset_list_get()
	{
		$getData = $this->request->getGet();
		$text = $getData['text'];
		$assetTypeGroup = $getData['asset_type_group'];
		$assetType = $getData['asset_type'];
		$assetStatus = $getData['asset_status'];
		$owner = $getData['owner'];

		$modules = \Config\Services::modules('asset_lists');
		$model = new AssetListModel();

		$builder = $model->asArray()->select([
			'm_asset_lists.id',
			'm_asset_lists.asset_code',
			'm_asset_lists.asset_name',
			'm_asset_lists.asset_type',
			'm_asset_lists.recent_image',
			'm_asset_brands.brand_name ',
			'm_asset_status.status_name',
			'm_asset_types.asset_type_code',
			'm_asset_groups.asset_group_code'
		])
			->join('m_asset_types', 'm_asset_types.id = m_asset_lists.asset_type')
			->join('m_asset_groups', 'm_asset_groups.id = m_asset_types.asset_type_group')
			->join('m_asset_status', 'm_asset_status.id = m_asset_lists.asset_status', 'left')
			->join('m_asset_brands', 'm_asset_brands.id = m_asset_lists.asset_brand', 'left');

		if (strlen(trim($text)) > 0) {
			$builder->groupStart()
				->like('asset_code', $text, 'after')
				->orLike('asset_name', $text, 'after')
				->groupEnd();
		}

		if (!empty($assetTypeGroup)) {
			$builder->where('m_asset_types.asset_type_group', $assetTypeGroup);
		}

		if (!empty($assetType)) {
			$builder->where('m_asset_lists.asset_type', $assetType);
		}

		if (!empty($assetStatus)) {
			$builder->where('m_asset_lists.asset_status', $assetStatus);
		}

		if (!empty($owner)) {
			$builder->where('m_asset_lists.owner', $owner);
		}

		$listAssetList = $builder->orderBy('m_asset_lists.id', 'DESC')->findAll();

		return $this->respond([
			'results' => handleDataBeforeReturn($modules, $listAssetList, true)
		]);
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
		$data['assetEli_liq'] = $model->join('m_asset_status', 'm_asset_status.id = m_asset_lists.asset_status')->where('m_asset_status.status_code', 'eliminate')->orWhere('m_asset_status.status_code', 'liquidated')->countAllResults(true);
		$data['assetRe_bro'] = $model->join('m_asset_status', 'm_asset_status.id = m_asset_lists.asset_status')->where('m_asset_status.status_code', 'repair')->orWhere('m_asset_status.status_code', 'broken')->countAllResults(true);

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

	public function detail_by_code_get()
	{
		$modules = \Config\Services::modules('asset_lists');
		$model = $modules->model;
		$getGet = $this->request->getGet();
		if (!isset($getGet['code']) || !$getGet['code']) {
			return $this->fail(null);
		}
		$code = $getGet['code'];
		$info = $model->asArray()->where('asset_code', $code)->first();
		if(!$info){
			return $this->fail(null);
		}
		$befoReturn = handleDataBeforeReturn('asset_lists', $info);
		return $this->respond($befoReturn);
	}
}
