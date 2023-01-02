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

        return $idAssetList;
    }
}
