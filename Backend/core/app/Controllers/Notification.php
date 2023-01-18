<?php

namespace App\Controllers;


use App\Libraries\Calendars\Config\Calendars;
use App\Libraries\Calendars\Models\CalendarModel;
use App\Libraries\Notifications\Notifications;
use App\Models\UserModel;

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
}
