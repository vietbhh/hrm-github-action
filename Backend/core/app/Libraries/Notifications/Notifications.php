<?php

namespace App\Libraries\Notifications;


use App\Libraries\Notifications\Models\NotificationModel;
use App\Libraries\Notifications\Models\NotificationMongoModel;
use App\Models\UserModel;
use App\Config\MongoDatabaseConnector;
use App\Models\SettingModel;

class Notifications
{
	protected $model;
	protected $mongoModel;
	protected $notificationDB;

	public function __construct()
	{
		$this->model = new NotificationModel();
		$this->mongoModel = new NotificationMongoModel();

		$settingModel = new SettingModel();
		$infoSetting = $settingModel->asArray()->where('key', 'notification_db')->first();
		$this->notificationDB = isset($infoSetting['value'])  && $infoSetting['value'] !== null ? $infoSetting['value'] : 'mysql';
	}

	/**
	 * @throws \ReflectionException
	 */
	public function add($content = [])
	{
		if ($this->notificationDB == 'mongo') {
			return $this->mongoModel->addNotification($content);
		} else {
			return $this->model->insert($content);
		}
	}

	public function seen($id, $all = false)
	{
		if (!is_array($id)) $id = [$id];
		if ($this->notificationDB == 'mongo') {
			try {
				if ($all) {
					$listNotification = $this->mongoModel->listNotification(0, 0, true);
					foreach ($listNotification as $row) {
						$this->mongoModel->seenNotification($row);
					}

					return true;
				}

				$listNotification = $this->mongoModel->listNotification(0, 0, true, $id);

				foreach ($listNotification as $row) {
					$this->mongoModel->seenNotification($row);
				}

				return true;
			} catch (\Exception $e) {
				return false;
			}
		} else {
			if ($all) {
				$notifications = $this->model->listNotification(0, 0, true);
				foreach ($notifications as $val) {
					$this->model->markAsRead($val);
				}
				return true;
			}

			$listNotification = $this->model->whereIn('id', $id)->findAll();

			foreach ($listNotification as $val) {
				$this->model->markAsRead($val);
			}
			return true;
		}
	}

	public function read($id, $all = false): bool
	{
		if (!is_array($id)) $id = [$id];
		if ($this->notificationDB == 'mongo') {
			try {
				if ($all) {
					$listNotification = $this->mongoModel->listNotification(0, 0, true, []);
					foreach ($listNotification as $row) {
						$this->mongoModel->markAsRead($row);
					}

					return true;
				}

				$condition =  [
					"_id" => [
						'$in' => $id
					]
				];

				$listNotification = $this->mongoModel->listNotification(0, 0, false, []);
				foreach ($listNotification as $row) {
					$this->mongoModel->markAsRead($row);
				}

				return true;
			} catch (\Exception $e) {
				return false;
			}
		} else {
			if ($all) {
				$notifications = $this->model->listNotification(0, 0, true);
				foreach ($notifications as $val) {
					$this->model->markAsRead($val);
				}
				return true;
			}

			$listNotification = $this->model->whereIn('id', $id)->findAll();

			foreach ($listNotification as $val) {
				$this->model->markAsRead($val);
			}
			return true;
		}
	}

	public function readNotificationById($id)
	{
		try {
			if ($this->notificationDB == 'mongo') {
				$notificationInfo = $this->mongoModel->getNotificationById($id);
				if (count($notificationInfo) > 0) {
					$notificationInfo['_id'] = (string)$notificationInfo['_id'];
					$this->mongoModel->markAsRead($notificationInfo);
				}
			} else {
				$notificationInfo = $this->model->getNotificationById($id);
				if (count($notificationInfo) > 0) {
					$this->model->markAsRead($notificationInfo);
				}
			}

			return [
				'list_notification_read' => [$id],
				'number_notification_read' => 1
			];
		} catch (\Exception $err) {
			return false;
		}
	}

	public function readAllNotification()
	{
		try {
			$userId = user_id();
			$arrId = [];

			if ($this->notificationDB == 'mongo') {
				$listNotification = $this->mongoModel->listNotification(0, 0, false, [], [
					'read_by' => [
						'$ne' => (string)$userId
					]
				]);

				foreach ($listNotification as $rowNotification) {
					$data = $rowNotification;
					$data['_id'] = (string)$rowNotification['_id'];
					$arrId[] = $data['_id'];
					$this->mongoModel->markAsRead($data);
				}
			} else {
				$listNotification = $this->model->listNotification(0, 0, false, true);

				foreach ($listNotification as $row) {
					$arrId[] = $row['id'];
					$this->model->markAsRead($row);
				}
			}

			return [
				'list_notification_read' => $arrId,
				'number_notification_read' => count($arrId)
			];
		} catch (\Exception $err) {
			return false;
		}
	}


	public function getUnreadNotificationNumber()
	{
		if ($this->notificationDB == 'mongo') {
			return $this->mongoModel->getUnreadNotificationNumber();
		} else {
			return $this->model->getUnreadNotificationNumber();
		}
	}


	public function list($perPage = 10, $page = 1, $removeFields = ['recipient_id', 'read_by']): array
	{
		$listNotification = [];
		if ($this->notificationDB == 'mongo') {
			$listNotification = $this->mongoModel->listNotification($perPage, $page);
		} else {
			$listNotification = $this->model->listNotification($perPage, $page);
		}
		return $this->_handleNotificationData($listNotification, $removeFields);
	}


	/*
	 * $receivers, $payload = ['title' => '', 'body' => '', 'link' => '', 'badge' => '', 'icon' => '', 'type' => 'other', 'data' => []], $data = [], $saveToDb = true
	 * */
	public function sendNotification($receivers, $payload = ['title' => '', 'body' => '', 'link' => '', 'badge' => '', 'icon' => '', 'type' => 'other', 'data' => []], $data = [], $saveToDb = true)
	{
		$isSocketEnable = preference('sockets');
		if ($isSocketEnable) {
			$nodeServer = \Config\Services::nodeServer();
			$result = $nodeServer->node->post('/notification/send', [
				'json' => [
					'receivers' => $receivers,
					'payload' => $payload,
					'data' => $data,
					'saveToDb' => $saveToDb
				]
			]);
			return true;
		} else {
			return $this->_sendNotification($receivers, $payload, $data, $saveToDb);
		}
	}

	public function removeNotificationById($id)
	{
		if (empty($id) || $id == 'undefined') {
			return false;
		}

		if ($this->notificationDB == 'mongo') {
			$result = $this->mongoModel->removeNotification($id);
		} else {
			$result = $this->model->removeNotification($id);
		}

		return $result;
	}

	// ** support function
	private function _getDataNotification($data, $arrUser, $removeFields = [])
	{
		$data['sender_id'] = $arrUser[$data['sender_id']] ?? [];
		$data['seen'] = false;
		$data['read'] = false;
		$userId = $this->notificationDB == 'mongodb' ? (string)user_id() : user_id();
		if (!empty($data['seen_by']) || !empty($data['read_by'])) {
			$data['seen_by'] = is_array($data['seen_by']) ? $data['seen_by'] : json_decode($data['seen_by'], true);
			$data['read_by'] = is_array($data['read_by']) ? $data['read_by'] : json_decode($data['read_by'], true);
			if (in_array($userId, $data['seen_by'])) $data['seen'] = true;
			if (in_array($userId, $data['read_by'])) $data['read'] = true;
		} else {
			$data['read_by'] = [];
			$data['seen_by'] = [];
		}

		foreach ($removeFields as $field) {
			if (isset($data[$field])) unset($data[$field]);
		}

		return $data;
	}

	private function _handleNotificationData($data, $removeFields = []): array
	{
		$userModel = new UserModel();
		$arrUser = $userModel->getListUsers();
		$result = [];
		foreach ($data as $key => $val) {
			$dataPush = $this->_getDataNotification($val, $arrUser, $removeFields);
			$result[] = $dataPush;
		}
		return $result;
	}

	private function _sendNotification($receivers, $payload = ['title' => '', 'body' => '', 'link' => '', 'badge' => '', 'icon' => '', 'type' => 'other', 'data' => []], $data = [], $saveToDb = true)
	{
		$title = $payload['title'];
		$body = $payload['body'];
		$link = $payload['link'];
		$type = empty($payload['type']) ? "other" : $payload['type'];
		$badge = $payload['badge'] ?? "";
		$icon = empty($payload['icon']) ? getDefaultFridayLogo() : $payload['icon'];
		$icon = is_numeric($icon) ? getAvatarUrl($icon) : $icon;
		try {
			$userModel = new UserModel();
			$userModel->select(['id', 'username', 'device_token'])->asArray();
			if (is_numeric($receivers)) $userModel->where('id', $receivers);
			else $userModel->whereIn('id', $receivers);
			$listUser = $userModel->onlyActived()->findAll();
			if ($saveToDb) {
				$saveNotificationData = [
					'sender_id' => user_id() ?? 0,
					'recipient_id' => json_encode($receivers),
					'type' => $type,
					'title' => $title,
					'body' => $body,
					'link' => $link,
					'icon' => $icon,
					'seen_by' => json_encode([]),
					'read_by' => json_encode([])
				];

				if ($this->notificationDB == 'mongo') {
					if (!is_array($receivers)) {
						$receivers = [$receivers];
					}
					$saveNotificationData['recipient_id'] = $receivers;
					$saveNotificationData['seen_by'] = [];
					$saveNotificationData['read_by'] = [];
				}

				$id = $this->add($saveNotificationData);
			}



			$client = new FirebaseCM\Client();

			$client->setApiKey($_ENV['firebase_server_key']);
			$client->injectGuzzleHttpClient(new \GuzzleHttp\Client());

			$message = new FirebaseCM\Message();

			$message->setPriority('high');

			$notification = new FirebaseCM\Notification($title, $body);
			if (!empty($badge)) $notification->setBadge($badge);
			if (!empty($link)) $notification->setClickAction($link);
			if (!empty($icon)) $notification->setIcon($icon);
			$data['isSave'] = $saveToDb ? "true" : "false";
			$data['emitKey'] = "app_notification";
			$data['sender_id'] = user_id() ?? 0;
			$message->setNotification($notification)->setData($data);

			$listAllReceiverToken = $listAllReceiverId = $listUserById = [];
			foreach ($listUser as $rowUser) {
				$recipients = $rowUser['device_token'] ?? [];
				$recipients = json_decode($recipients, true);
				$listUserById[$rowUser['id']] = $recipients;
				foreach ($recipients as $recipient) {
					$listAllReceiverToken[] = $recipient;
					$listAllReceiverId[] = $rowUser['id'];
					$message->addRecipient(new FirebaseCM\Recipient\Device($recipient));
				}
			}
			$response = $client->send($message);
			$responseData = $response->getBody()->getContents();
			if (!empty($responseData)) {
				$deleteErrorToken = [];
				$responseData = json_decode($responseData, true);
				if (!empty($responseData['results'])) {
					foreach ($responseData["results"] as $i => $result) {
						if (isset($result["error"])) {
							$deleteErrorToken[$listAllReceiverId[$i]][] = $listAllReceiverToken[$i];
						}
					}
				}
				//Update database
				foreach ($deleteErrorToken as $userId => $errorTokens) {
					$newTokenList = array_values(array_diff($listUserById[$userId], $errorTokens));
					$dataSave = [
						'id' => $userId,
						'device_token' => json_encode($newTokenList)
					];
					$userModel->setAllowedFields(array_keys($dataSave));
					$userModel->save($dataSave);
				}
			}
			return true;
		} catch (\Exception $e) {
			return [
				'success' => false,
				'error' => $e
			];
		}
	}
}
