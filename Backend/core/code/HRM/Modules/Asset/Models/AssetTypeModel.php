<?php

namespace HRM\Modules\Asset\Models;

use HRM\Modules\Asset\Models\AssetModel;
use HRM\Modules\Asset\Models\AssetListModel;

class AssetTypeModel extends AssetModel
{
	protected $table = 'm_asset_types';
	protected $primaryKey = 'id';
	protected $useAutoIncrement = true;
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = [
		'asset_type_code',
		'asset_type_name',
		'asset_type_group',
		'asset_type_descriptions',
		'asset_type_auto_increment_list',
		'asset_type_display'
	];
	protected $createdField = 'created_at';
	protected $updatedField = 'updated_at';
	protected $deletedField = 'deleted_at';

	private $assetListModel;

	public function __construct()
	{
		parent::__construct();

		$this->assetListModel = new AssetListModel();
	}

	public function createAssetType($data)
	{
		$code = isset($data['asset_type_code']) ? $data['asset_type_code'] : '';
		$name = isset($data['asset_type_name']) ? $data['asset_type_name'] : '';

		$data['asset_type_display'] = implode(' - ', [$code, $name]);

		$this->insert($data);

		return $this->getInsertID();
	}

	public function updateAssetType($id, $updateData, $updateAssetListCode = false)
	{
		if (empty($id)) {
			return false;
		}

		$infoAssetGroup = $this->asArray()->find($id);

		if (!$infoAssetGroup) {
			return false;
		}

		$oldAssetTypeCode = $infoAssetGroup['asset_type_code'];

		// ** update asset group
		$code = isset($updateData['asset_type_code']) ? $updateData['asset_type_code'] : '';
		$name = isset($updateData['asset_type_name']) ? $updateData['asset_type_name'] : '';
		$updateData['asset_type_display'] = implode(' - ', [$code, $name]);
		$this->update($id, $updateData);

		if (!$updateAssetListCode) {
			return $id;
		}


		$newAssetTypeCode = isset($updateData['asset_type_code']) ? $updateData['asset_type_code'] : '';

		// ** update asset list code
		$listAssetList = $this->assetListModel->asArray()
			->select([
				'm_asset_lists.id',
				'm_asset_lists.asset_code'
			])
			->join('m_asset_types', 'm_asset_types.id = m_asset_lists.asset_type')
			->where('m_asset_types.id', $id)
			->findAll();

		$dataUpdateAssetList = [];
		foreach ($listAssetList as $rowAssetList) {
			$dataUpdateAssetList[] = [
				'id' => $rowAssetList['id'],
				'asset_code' => $this->getNewAssetListCode($oldAssetTypeCode, $newAssetTypeCode, $rowAssetList['asset_code'], 1)
			];
		}

		if (count($dataUpdateAssetList) > 0) {
			$this->assetListModel->updateBatch($dataUpdateAssetList, 'id');
		}
	}

	public function getList($params = [])
	{
		$builder = $this->asArray()
			->select([
				'id',
				'asset_type_code',
				'asset_type_name',
				'asset_type_group',
				'asset_type_descriptions'
			]);

		$page = isset($params['page']) ? $params['page'] : 1;
		$limit = isset($params['limit']) ? $params['limit'] : 30;
		$start = ($page - 1) * $limit;
		$text = (isset($params['text']) && strlen(trim($params['text'])) > 0) ? $params['text'] : '';
		$group = $params['asset_type_group'] ?? "";
		if ($text != '') {
			$builder->groupStart()
				->like('asset_type_code', $text, 'after')
				->orLike('asset_type_name', $text, 'after')
				->groupEnd();
		}
		
		if (!empty($group)) {
			$builder->where('asset_type_group', $group);
		}

		$totalRecord = $builder->countAllResults(false);
		$listData = $builder->orderBy('id', 'DESC')->findAll($limit, $start);

		return [
			'total' => $totalRecord,
			'data' => $listData
		];
	}

	public function deleteAssetType($id)
	{
		//  ** delete asset type
		$this->delete($id);

		//  ** delete asset list
		$this->assetListModel
			->where('asset_type', $id)
			->delete();
	}
}
