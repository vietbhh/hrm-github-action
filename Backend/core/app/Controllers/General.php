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
		if (!$isLoadOptions) {
			$result['results'] = handleDataBeforeReturn($module, $result['results'], true, function ($rawItem, $item) {
				$item['avatar'] = $rawItem['avatar'];
				return $item;
			});
		}
		return $this->respond($result);
	}

}

?>