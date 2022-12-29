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
}