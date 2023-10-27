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
	protected $notificationDB;

	public function __construct()
	{
		$this->notification = \Config\Services::notifications();
		$this->notificationDB = 'mongo';
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

	public function seen_get()
	{
		$dataGet = $this->request->getGet();
		$page = $dataGet['page'] ?? 1;
		$perPage = $dataGet['per_page'] ?? preference('perPage');
		$listNotification = $this->notification->list($perPage, $page, []);
		$arrId = [];
		$userId = user_id();

		$keyId = $this->notificationDB == 'mongo' ? '_id' : 'id';
		foreach ($listNotification as $key => $rowNotification) {
			if (!$rowNotification['seen']) {
				$arrId[] = $rowNotification[$keyId];
			}
		}

		if (count($arrId) > 0) {
			$this->notification->seen($arrId, false);
		}

		return $this->respond([
			'list_notification_seen' => $arrId,
			'number_notification_seen' => count($arrId)
		]);
	}

	public function read_post($id)
	{
		if ($id == 'all') {
			$result = $this->notification->readAllNotification();
		} else {
			$result = $this->notification->readNotificationById($id);
		}

		if (!$result) {
			return $this->fail('fail_read');
		}

		return $this->respond($result);
	}

	public function remove_post($id)
	{
		$result = $this->notification->removeNotificationById($id);

		if (!$result) {
			return $this->fail('fail_remove');
		}

		return $this->respond([
			'notification_remove' => $id
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
