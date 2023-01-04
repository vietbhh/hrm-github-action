<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : asset
*/

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Asset\Models\AssetGroupModel;

class AssetGroup extends ErpController
{
    public function create_post()
    {
        $validation = \Config\Services::validation();
        $modules = \Config\Services::modules('asset_groups');
        $model = new AssetGroupModel();

        $postData = $this->request->getPost();
        $dataHandle = handleDataBeforeSave($modules, $postData);
        if (!empty($dataHandle['validate'])) {
            if (!$validation->reset()->setRules($dataHandle['validate'])->run($dataHandle['data'])) {
                return $this->failValidationErrors($validation->getErrors());
            }
        }

        try {
            $model->createAssetGroup($dataHandle['data']);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }

        return $this->respond(ACTION_SUCCESS);
    }

    public function get_data_asset_group_get()
    {
        $modules = \Config\Services::modules('asset_groups');
        $model = new AssetGroupModel();

        $params = $this->request->getGet();
        unset($params['get']);

        $listAssetGroup = $model->getList($params);

        return $this->respond([
            'results' => handleDataBeforeReturn($modules, $listAssetGroup, true)
        ]);
    }

    public function update_post($id)
    {
        $validation = \Config\Services::validation();
        $modules = \Config\Services::modules('asset_groups');
        $model = new AssetGroupModel();

        $postData = $this->request->getPost();
        $acceptChangeAssetCode = $postData['accept_change_asset_code'];
        unset($postData['accept_change_asset_code']);
        $dataHandle = handleDataBeforeSave($modules, $postData);
        if (!empty($dataHandle['validate'])) {
            if (!$validation->reset()->setRules($dataHandle['validate'])->run($dataHandle['data'])) {
                return $this->failValidationErrors($validation->getErrors());
            }
        }

        try {
            $model->updateAssetGroup($id, $dataHandle['data'], $acceptChangeAssetCode);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }

        return $this->respond(ACTION_SUCCESS);
    }

    public function delete_post($id)
    {
        $model = new AssetGroupModel();
        $model->deleteAssetGroup($id);

        try {
            return $this->respond(ACTION_SUCCESS);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }
}
