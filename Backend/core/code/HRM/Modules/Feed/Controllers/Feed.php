<?php

namespace HRM\Modules\Feed\Controllers;

use App\Controllers\ErpController;

class Feed extends ErpController
{
	public function get_initial_event_get()
	{
		$modules = \Config\Services::modules("departments");
		$model = $modules->model;
		$dataDepartment = $model->asArray()->findAll();

		$modules = \Config\Services::modules("meeting_room");
		$model = $modules->model;
		$dataMeetingRoom = $model->select(["id as value", "name as label", "location"])->asArray()->findAll();

		$result = [
			'dataDepartment' => $dataDepartment,
			'dataMeetingRoom' => $dataMeetingRoom,
		];
		return $this->respond($result);
	}
}