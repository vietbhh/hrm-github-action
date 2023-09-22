<?php

namespace App\Libraries\Notifications;


use App\Libraries\Notifications\Models\NotificationModel;
use App\Models\UserModel;

class Notifications
{
	protected $model;

	public function __construct()
	{
		$this->model = new NotificationModel();
	}

	/**
	 * @throws \ReflectionException
	 */
	public function add($content = [])
	{
		return $this->model->insert($content);
	}

	public function read($id, $all = false): bool
	{
		if ($all) {
			$notifications = $this->model->listNotification(0, 0, true);
			foreach ($notifications as $val) {
				$this->model->markAsRead($val);
			}
			return true;
		}
		if (!is_array($id)) $id = [$id];
		$listNotification = $this->model->whereIn('id', $id)->findAll();

		foreach ($listNotification as $val) {
			$this->model->markAsRead($val);
		}
		return true;
	}


	public function getUnreadNotificationNumber()
	{
		return $this->model->getUnreadNotificationNumber();
	}


	public function list($perPage = 10, $page = 1, $removeFields = ['recipient_id', 'read_by']): array
	{
		return $this->_handleNotificationData($this->model->listNotification($perPage, $page), $removeFields);
	}

	// ** support function
	private function _getDataNotification($data, $arrUser, $removeFields = [])
	{
		$data['sender_id'] = $arrUser[$data['sender_id']] ?? [];
		$data['seen'] = false;
		$userId = user_id();
		if (!empty($data['read_by'])) {
			$data['read_by'] = json_decode($data['read_by'], true);
			if (in_array($userId, $data['read_by'])) $data['seen'] = true;
		} else {
			$data['read_by'] = [];
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
					'read_by' => json_encode([])
				];
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
