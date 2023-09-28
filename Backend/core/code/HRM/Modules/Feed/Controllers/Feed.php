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

	public function posts_setting_post()
	{
		helper("preference");
		$data = $this->request->getPost();
		if (isset($data['feed_post_approve'])) {
			preference('feed_post_approve', $data['feed_post_approve'], true);
		}

		if (isset($data['feed_post_type_allow'])) {
			$feed_post_type_allowData = preference('feed_post_type_allow') ? preference('feed_post_type_allow') : [];
			foreach ($data['feed_post_type_allow'] as $key => $val):
				if ($val === true || $val === 'true') {
					if (!in_array($key, $feed_post_type_allowData)) {
						$feed_post_type_allowData[] = $key;
					}
				} else {
					$key = array_search($key, $feed_post_type_allowData);
					if ($key >= 0) {
						unset($feed_post_type_allowData[$key]);
					}
				}
			endforeach;
			preference('feed_post_type_allow', $feed_post_type_allowData, true);
		}
		return $this->respond(1);
	}
}