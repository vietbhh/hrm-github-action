<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : asset
*/

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;

class Brand extends ErpController
{
    public function create_post()
    {
        $validation = \Config\Services::validation();
        $modules = \Config\Services::modules('asset_brands');
        $model = $modules->model;

        $postData = $this->request->getPost();
        $dataHandle = handleDataBeforeSave($modules, $postData);
        if (!empty($dataHandle['validate'])) {
            if (!$validation->reset()->setRules($dataHandle['validate'])->run($dataHandle['data'])) {
                return $this->failValidationErrors($validation->getErrors());
            }
        }

        try {
            $model->setAllowedFields($dataHandle['fieldsArray']);
            $model->save($dataHandle['data']);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }

        return $this->respond(ACTION_SUCCESS);
    }

    public function get_data_asset_brand_get()
    {
        $modules = \Config\Services::modules('asset_brands');
        $model = $modules->model;

        $params = $this->request->getGet();
        unset($params['get']);
        $builder = $model->asArray()
            ->select([
                'id',
                'brand_name',
                'description'
            ]);

        $page = isset($params['page']) ? $params['page'] : 1;
        $limit = isset($params['limit']) ? $params['limit'] : 30;
        $start = ($page - 1) * $limit;
        $text = (isset($params['text']) && strlen(trim($params['text'])) > 0) ? $params['text'] : '';
        if ($text != '') {
            $builder->groupStart()
                ->like('brand_name', $text, 'after')
                ->groupEnd();
        }

        $totalRecord = $builder->countAllResults(false);
        $listData = $builder->orderBy('id', 'DESC')->findAll($limit, $start);

        return $this->respond([
            'results' => handleDataBeforeReturn($modules, $listData, true),
            'total' => $totalRecord
        ]);
    }

    public function update_post($id)
    {
        $modules = \Config\Services::modules('asset_brands');
        $model = $modules->model;

        $postData = $this->request->getPost();

        try {
            $postData['id'] = $id;
            $model->setAllowedFields(array_keys($postData));
            $model->save($postData);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }

        return $this->respond(ACTION_SUCCESS);
    }

    public function delete_post($id)
    {
        $modules = \Config\Services::modules('asset_brands');
        $model = $modules->model;

        try {
            $model->delete($id);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }


        return $this->respond(ACTION_SUCCESS);
    }
}
