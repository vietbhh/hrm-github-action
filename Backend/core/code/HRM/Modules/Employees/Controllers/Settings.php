<?php

namespace HRM\Modules\Employees\Controllers;

use App\Controllers\ErpController;

class Settings extends ErpController
{
    public function create_employee_type_post()
    {
        $modules = \Config\Services::modules('employee_types');
		$model = $modules->model;

		$postData = $this->request->getPost();
		$dataHandle = handleDataBeforeSave($modules, $postData);

		$model->setAllowedFields($dataHandle['fieldsArray']);

		try {
			$model->save($dataHandle['data']);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated(ACTION_SUCCESS);
    }

    public function load_employee_type_get()
	{
		$modules = \Config\Services::modules('employee_types');
		$model = $modules->model;

		$listContractType = $model->findAll();

		return $this->respond([
			'results' => handleDataBeforeReturn($modules, $listContractType)
		]);
	}

    public function update_employee_type_post($id)
	{
		$modules = \Config\Services::modules('employee_types');
		$model = $modules->model;

		$postData = $this->request->getPost();
		$postData['id'] = $id;
		$dataHandle = handleDataBeforeSave($modules, $postData);

		$model->setAllowedFields($dataHandle['fieldsArray']);

		try {
			$model->save($dataHandle['data']);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated(ACTION_SUCCESS);
	}

	public function delete_employee_type_post($id)
	{
		$modules = \Config\Services::modules('employee_types');
		$model = $modules->model;

		$model->delete($id);

		return $this->respondCreated(ACTION_SUCCESS); 
	}


    public function create_contract_type_post()
	{
		$modules = \Config\Services::modules('contract_type');
		$model = $modules->model;

		$postData = $this->request->getPost();
		$dataHandle = handleDataBeforeSave($modules, $postData);

		$model->setAllowedFields($dataHandle['fieldsArray']);

		try {
			$model->save($dataHandle['data']);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated(ACTION_SUCCESS);
	}

	public function load_contract_type_get()
	{
		$modules = \Config\Services::modules('contract_type');
		$model = $modules->model;

		$listContractType = $model->findAll();

		return $this->respond([
			'results' => handleDataBeforeReturn($modules, $listContractType)
		]);
	}

	public function update_contract_type_post($id)
	{
		$modules = \Config\Services::modules('contract_type');
		$model = $modules->model;

		$postData = $this->request->getPost();
		$postData['id'] = $id;
		$dataHandle = handleDataBeforeSave($modules, $postData);

		$model->setAllowedFields($dataHandle['fieldsArray']);

		try {
			$model->save($dataHandle['data']);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respondCreated(ACTION_SUCCESS);
	}

	public function delete_contract_type_post($id)
	{
		$modules = \Config\Services::modules('contract_type');
		$model = $modules->model;

		$model->delete($id);

		return $this->respondCreated(ACTION_SUCCESS); 
	}
}