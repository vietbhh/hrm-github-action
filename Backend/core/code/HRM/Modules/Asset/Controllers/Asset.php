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
			'results' => $listAssetList
		]);
	}
}
