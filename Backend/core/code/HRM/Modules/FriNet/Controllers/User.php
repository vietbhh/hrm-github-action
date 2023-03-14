<?php

namespace HRM\Modules\FriNet\Controllers;

use App\Controllers\ErpController;

class User extends ErpController
{
	public function get_user_get($identity)
	{
		$modules = \Config\Services::modules("employees");
		$model = $modules->model;
		$whereKey = 'id';
		if (!is_numeric($identity)) {
			$whereKey = 'username';
		}
		$data = $model->asArray()->where($whereKey, $identity)->first();
		if (!$data) {
			return $this->failNotFound(NOT_FOUND);
		}

		return $this->respond(handleDataBeforeReturn($modules, $data));
	}

}