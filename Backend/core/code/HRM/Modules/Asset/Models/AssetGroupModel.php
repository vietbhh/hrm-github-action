<?php

namespace HRM\Modules\Asset\Models;

use HRM\Modules\Asset\Models\AssetModel;
use HRM\Modules\Asset\Models\AssetListModel;
use HRM\Modules\Asset\Models\AssetTypeModel;

class AssetGroupModel extends AssetModel
{
    protected $table = 'm_asset_groups';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $allowedFields = [
        'asset_group_code',
        'asset_group_name',
        'asset_group_descriptions',
        'asset_group_display'
    ];
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    private $assetListModel;
    private $assetTypeModel;

    public function __construct()
    {
        parent::__construct();

        $this->assetListModel = new AssetListModel();
        $this->assetTypeModel = new AssetTypeModel();
    }

    public function createAssetGroup($data)
    {
        $code = isset($data['asset_group_code']) ? $data['asset_group_code'] : '';
        $name = isset($data['asset_group_name']) ? $data['asset_group_name'] : '';

        $data['asset_group_display'] = implode(' - ', [$code, $name]);

        $this->insert($data);

        return $this->getInsertID();
    }

    public function updateAssetGroup($id, $updateData, $updateAssetListCode = false)
    {
        if (empty($id)) {
            return false;
        }

        $infoAssetGroup = $this->asArray()->find($id);

        if (!$infoAssetGroup) {
            return false;
        }

        $oldAssetGroupCode = $infoAssetGroup['asset_group_code'];

        // ** update asset group
        $code = isset($updateData['asset_group_code']) ? $updateData['asset_group_code'] : '';
        $name = isset($updateData['asset_group_name']) ? $updateData['asset_group_name'] : '';
        $updateData['asset_group_display'] = implode(' - ', [$code, $name]);
        $this->update($id, $updateData);

        if (!$updateAssetListCode) {
            return $id;
        }

        $newAssetGroupCode = isset($updateData['asset_group_code']) ? $updateData['asset_group_code'] : '';

        // ** update asset list code
        $listAssetList = $this->assetListModel->asArray()
            ->select([
                'm_asset_lists.id',
                'm_asset_lists.asset_code'
            ])
            ->join('m_asset_types', 'm_asset_types.id = m_asset_lists.asset_type')
            ->join('m_asset_groups', 'm_asset_groups.id = m_asset_types.asset_type_group')
            ->where('m_asset_types.asset_type_group', $id)
            ->findAll();

        $dataUpdateAssetList = [];
        foreach ($listAssetList as $rowAssetList) {
            $dataUpdateAssetList[] = [
                'id' => $rowAssetList['id'],
                'asset_code' => $this->getNewAssetListCode($oldAssetGroupCode, $newAssetGroupCode, $rowAssetList['asset_code'], 0)
            ];
        }

        if (count($dataUpdateAssetList) > 0) {
            $this->assetListModel->updateBatch($dataUpdateAssetList, 'id');
        }
    }

    public function getList($params = [])
    {
        $builder = $this->asArray()
            ->select(['id', 'asset_group_code', 'asset_group_name', 'asset_group_descriptions']);

        $page = isset($params['page']) ? $params['page'] : 1;
        $limit = isset($params['limit']) ? $params['limit'] : 30;
        $start = ($page - 1) * $limit;
        $text = (isset($params['text']) && strlen(trim($params['text'])) > 0) ? $params['text'] : '';

        if ($text != '') {
            $builder->groupStart()
                ->like('asset_group_code', $text, 'after')
                ->orLike('asset_group_name', $text, 'after')
                ->groupEnd();
        }

        $totalRecord = $builder->countAllResults(false);
        $listData = $builder->orderBy('id', 'DESC')->findAll($limit, $start);

        return [
            'total' => $totalRecord,
            'data' => $listData
        ];
    }

    public function deleteAssetGroup($id)
    {
        // ** delete Asset Group
        $this->delete($id);

        // ** delete Asset Type
        $listAssetType = $this->assetTypeModel->select(['id'])->asArray()->where('asset_type_group', $id)->findAll();
        foreach ($listAssetType as $row) {
            $this->assetTypeModel->deleteAssetType($row['id']);
        }
    }
}
