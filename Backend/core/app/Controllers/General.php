<?php

namespace App\Controllers;


use HRM\Modules\Employees\Models\EmployeesModel;

class General extends ErpController
{
	public function unit_get()
	{
		$data = unitInit();
		return $this->respond($data);
	}

	public function load_users_get()
	{
		$module = \Config\Services::modules('users');
		$model = $module->model->select(['id', 'email', 'phone', 'username', 'full_name']);

		$data = $this->request->getGet();
		$isLoadOptions = (isset($data['isLoadOptions']) && !empty($data['isLoadOptions'])) ? $data['isLoadOptions'] : false;

		if ($isLoadOptions) {
			$model = $model->select(['id as value', $isLoadOptions . ' as label', 'avatar as icon']);
		} else {
			$model = $model->select(['avatar']);
		}
		if (isset($data['exceptSelf']) && $data['exceptSelf']) {
			$model = $model->where('id !=', user_id());
		}
		if (isset($data['excepts']) && !empty($data['excepts'])) {
			$model = $model->whereNotIn('id', $data['excepts']);
		}
		$result = loadData($model, $data, ['email', 'username', 'full_name', 'phone']);

		$module->setModule('users');
		if (!$isLoadOptions) {
			$result['results'] = handleDataBeforeReturn($module, $result['results'], true, function ($rawItem, $item) {
				$item['avatar'] = $rawItem['avatar'];
				return $item;
			});
		}

		if (isset($data['withModules'])) { // ** withModules: string
			$arrModules = explode(',', $data['withModules']);
			foreach ($arrModules as $rowModule) {
				$modulesAdditional = \Config\Services::modules($rowModule);
				$modelAdditional = $modulesAdditional->model;

				$listData = $modelAdditional->asArray()
					->select(['id', 'name'])
					->findAll();
				foreach ($listData as $keyData => $rowData) {
					$listData[$keyData]['value'] = $rowModule . '_' . $rowData['id'];
					$listData[$keyData]['key_id'] = $rowModule . '_' . $rowData['id'];
					$listData[$keyData]['with_modules_option_type'] = $rowModule;
				}
				$result['results'] = array_merge($result['results'], handleDataBeforeReturn($modulesAdditional, $listData, true));
			}
		}

		return $this->respond($result);
	}
}
