<?php

namespace App\Controllers;


use App\Libraries\Calendars\Config\Calendars;
use App\Libraries\Calendars\Models\CalendarModel;
use App\Libraries\Notifications\Notifications;
use App\Models\UserModel;

class Notification extends ErpController
{
	private $notification;
	private $setting;

	public function __construct()
	{
		$this->notification = \Config\Services::notifications();
		$this->setting = \Config\Services::settings();
	}

	public function load_get()
	{
		$dataGet = $this->request->getGet();
		$perPage = isset($dataGet['per_page']) ? $dataGet['per_page'] : preference('perPage');
		$page = isset($dataGet['page']) ? $dataGet['page'] : 1;
		$data = $this->notification->list(user_id(), $perPage, $page);
		$data = $this->notification->handleNotificationData($data, true);
		
		return $this->respond([
			'results' => $data,
			'number_notification' => $this->notification->getNotificationNumber(user_id())
		]);
	}

	public function seen_notification_get()
	{
		$dataGet = $this->request->getGet();
		$page = isset($dataGet['page']) ? $dataGet['page'] : 1;
		$perPage = isset($dataGet['per_page']) ? $dataGet['per_page'] : preference('perPage');
		$listNotification = $this->notification->list(user_id(), $perPage, $page);
		$arrId = [];
		$userId = user_id();
		foreach ($listNotification as $key => $rowNotification) {
			$checkSeen = array_search($userId, json_decode($rowNotification['read_by'], true));
			if (!$checkSeen && $checkSeen !== 0) {
				$arrId[] = $rowNotification['id'];
			}
		}

		$this->notification->pushNotification([
			'title' => 'gggg',
			'content' => 'sdaf dsafasdf',
			'link' => ''
		], [1]);

		if (count($arrId) > 0) {
			$this->notification->read($arrId, false);
		}

		return $this->respond([
			'list_notification_seen' => $arrId,
			'number_notification_seen' => count($arrId)
		]);
	}

	public function seen_post()
	{
		$posts = $this->request->getPost();
		$ids = $posts['id'];
		$all = isset($posts['all']) ? $posts['all'] : false;
		$this->notification->read($ids, $all);
		return $this->respond('success');
	}
}
