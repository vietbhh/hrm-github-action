<?php

namespace HRM\Modules\Asset\Models;

use App\Models\AppModel;

class AssetListModel extends AppModel
{
	protected $table = 'm_asset_lists';
	protected $primaryKey = 'id';
	protected $useAutoIncrement = true;
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = [
		'asset_code',
		'asset_name',
		'asset_type',
		'asset_brand',
		'asset_properties',
		'asset_descriptions',
		'asset_notes',
		'date_created',
		'asset_warranty_expires',
		'asset_status',
		'recent_image',
		'owner'
	];
	protected $createdField = 'created_at';
	protected $updatedField = 'updated_at';
	protected $deletedField = 'deleted_at';

	private $modelAssetType;
	private $modelAssetGroup;

	public function __construct()
	{
		parent::__construct();

		$modules = \Config\Services::modules('asset_types');
		$this->modelAssetType = $modules->model;

		$modules = \Config\Services::modules('asset_groups');
		$this->modelAssetGroup = $modules->model;
	}

	public function insertAssetList($data)
	{
		helper('app_select_option');
		$assetType = isset($data['asset_type']) ? $data['asset_type'] : 0;

		if (empty($assetType)) {
			return false;
		}

		$modelAssetType = $this->modelAssetType;

		$infoAssetType = $modelAssetType->select([
			'id',
			'asset_type_code',
			'asset_type_group',
			'asset_type_auto_increment_list'
		])
			->asArray()
			->find($assetType);

		if (!$infoAssetType) {
			return false;
		}

		$assetTypeCode = $infoAssetType['asset_type_code'];
		$assetTypeGroup = $infoAssetType['asset_type_group'];

		$modelAssetGroup = $this->modelAssetGroup;

		$infoAssetGroup = $modelAssetGroup->select(['asset_group_code'])
			->asArray()
			->find($assetTypeGroup);
		$assetGroupCode = $infoAssetGroup ? $infoAssetGroup['asset_group_code'] : '';

		$currentYear = date('y');
		$currentMonth = date('m');

		$timeCode = implode('.', [$currentYear, $currentMonth]);
		$textCode = implode('-', [$assetGroupCode, $assetTypeCode, $timeCode]);

		$listAssetTypeAutoIncrement = empty($infoAssetType['asset_type_auto_increment_list']) ? [] : json_decode($infoAssetType['asset_type_auto_increment_list'], true);

		$number = 1;
		if (isset($listAssetTypeAutoIncrement[$timeCode])) {
			$number = $listAssetTypeAutoIncrement[$timeCode] + 1;
		}
		$listAssetTypeAutoIncrement[$timeCode] = $number;

		$textCode .= '.' . $number;

		// ** insert asset list
		$data['asset_code'] = $textCode;
		$modules = \Config\Services::modules('asset_lists');
		$dataHandle = handleDataBeforeSave($modules, $data);
		$this->insert($dataHandle['data']);
		$idAssetList = $this->getInsertID();

		// ** update asset type auto increment list
		$dataUpdate = [
			'id' => $infoAssetType['id'],
			'asset_type_auto_increment_list' => json_encode($listAssetTypeAutoIncrement)
		];
		$modelAssetType->setAllowedFields(array_keys($dataUpdate));
		$modelAssetType->save($dataUpdate);

		// ** insert log
		$this->insertHistory([
			'asset_code' => $idAssetList,
			'type' => getOptionValue('asset_history', 'type', 'warehouse'),
			'owner_current' => isset($data['owner']) ? $data['owner'] : user_id()
		]);

		return $idAssetList;
	}

	public function insertHistory($data, $filesData = [])
	{
		helper(['app_select_option']);
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$modules = \Config\Services::modules('asset_history');
		$model = $modules->model;
		$model->setAllowedFields(array_keys($data));
		$model->save($data);
		$id = $model->getInsertID();
		if ($filesData) {
			foreach ($filesData as $key => $files) {
				if (empty($files)) continue;
				if (!is_array($files)) $files = [$files];
				foreach ($files as $position => $file) {
					if (!$file->isValid()) {
						return false;
					}
					if (!$file->hasMoved()) {
						$storePath = getModuleUploadPath('asset_history', $id, false) . 'other/';
						$fileName = safeFileName($file->getName());

						$result = $uploadService->uploadFile($storePath, [$file], false, $fileName, ['compressImage' => true]);
						$fileName = $result['last_uploaded']['filename'];
						// upload to asset
						if ($key === 'history_image') {
							$pathAsset = '/modules/asset_lists/' . $data['asset_code'] . '/other/';
							$uploadService->copyFile($storePath, $pathAsset, $fileName);
							$updateAsset['recent_image'] = $fileName;
							$updateAsset['asset_status'] = $data['status_change'];
							$updateAsset['id'] = $data['asset_code'];
							$this->save($updateAsset);
						}

						if ($key === 'history_files') {
							$arrayFiles = isset($data[$key]) ? json_decode($data[$key], true) : [];
							$arrayFiles[] = $fileName;
							$data[$key] = json_encode($arrayFiles);
						} else {
							$data[$key] = $fileName;
						}
					}
				}
			}

			try {
				$data['id'] = $id;
				$model->setAllowedFields(array_keys($data));
				$model->save($data);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE . '_' . $e->getMessage());
			}
		}
		return $data;
	}
}
