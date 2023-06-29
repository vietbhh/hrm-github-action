<?php

namespace App\Controllers;


use App\Libraries\Calendars\Config\Calendars;
use App\Libraries\Calendars\Models\CalendarModel;
use App\Libraries\Notifications\Notifications;
use App\Models\UserModel;
use App\Libraries\Notifications\Models\NotificationModel;

class Notification extends ErpController
{
	private $notification;

	public function __construct()
	{
		$this->notification = \Config\Services::notifications();
	}

	public function load_get()
	{
		$dataGet = $this->request->getGet();
		$perPage = $dataGet['per_page'] ?? preference('perPage');
		$page = $dataGet['page'] ?? 1;
		$data = $this->notification->list($perPage, $page);
		return $this->respond([
			'results' => $data,
			'number_notification' => $this->notification->getUnreadNotificationNumber()
		]);
	}

	public function read_get()
	{
		$dataGet = $this->request->getGet();
		$page = $dataGet['page'] ?? 1;
		$perPage = $dataGet['per_page'] ?? preference('perPage');
		$listNotification = $this->notification->list($perPage, $page, []);
		$arrId = [];
		$userId = user_id();

		foreach ($listNotification as $key => $rowNotification) {
			if (!$rowNotification['seen']) {
				$arrId[] = $rowNotification['id'];
			}
		}

		if (count($arrId) > 0) {
			$this->notification->read($arrId, false);
		}

		return $this->respond([
			'list_notification_seen' => $arrId,
			'number_notification_seen' => count($arrId)
		]);
	}

	/*public function test_post($id)
	{
		$model = new NotificationModel();

		$postData = $this->request->getPost();
		$index = isset($postData['index']) ? $postData['index'] : null;
		$status = isset($postData['status']) ? $postData['status'] : null;

		if ($index == null || $status == null) {
			return $this->fail(MISSING_REQUIRED);
		}

		$info = $model->asArray()->where('id', $id)->first();
		$action = $info['actions'] != null ? json_decode($info['actions'], true) : [];
		$currentAction = $action[$index];
		$currentAction['status'] = $status;
		$currentAction['message'] = '<b className="text-danger">test bold</b> {{auth.authentication}}';
		$action[$index] = $currentAction;

		try {
			$model->setAllowedFields([
				'id',
				'actions'
			]);
			$model->save([
				'id' => $id,
				'actions' => json_encode(array_values($action))
			]);

			return $this->respond([
				'notification_info' => $currentAction
			]);
		} catch (\Exception $err) {
			return $this->fail(FAILED_SAVE);
		}
	}*/
}
