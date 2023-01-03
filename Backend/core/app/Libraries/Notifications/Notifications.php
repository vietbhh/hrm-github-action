<?php

namespace App\Libraries\Notifications;


use App\Libraries\Notifications\Models\NotificationModel;
use App\Models\UserModel;

class Notifications
{
	protected $model;
	protected $setting;

	public function __construct()
	{
		$this->model = new NotificationModel();
	}

	public function add($content = [])
	{
		return $this->model->insert($content);
	}

	public function detail($id)
	{
		$info = $this->model->find($id);
		if ($info['sender_id'] != user_id()) {
			$checkPermit = $this->model->checkPermit($id, user_id());
			if (!$checkPermit) return false;
		}
		return $info;
	}


	public function read($id = [], $all = false)
	{
		$listNotification = $this->model->find($id);
		if ($all) {
			$notifications = $this->model->listNoti(user_id());
			foreach ($notifications as $val) {
				$this->model->checkAndRead($val);
			}
			return;
		}

		foreach ($listNotification as $val) :
			$this->model->checkAndRead($val);
		endforeach;

		return;
	}

	public function list($user = null, $perPage = 10, $page = 1)
	{
		if (!$user) $user = user_id();
		return $this->model->listNoti($user, $perPage, $page);
	}

	public function getNotificationNumber($user = null)
	{
		if (!$user) $user = user_id();
		return $this->model->getNotificationNumber($user);
	}

	public function deleted($id = null)
	{
		$this->model->delete($id);
		return $id;
	}

	public function handleNotificationData($data, $isMultidimensionalArray = true)
	{
		$modules = \Config\Services::modules('users');
		$model = $modules->model;
		$listUser = $model->select([
			'id',
			'username',
			'full_name',
			'email',
			'avatar'
		])->asArray()->findAll();
		$arrUser = [];
		foreach ($listUser as $rowUser) {
			$arrUser[$rowUser['id']] = $rowUser;
		}
		$userId = user_id();
		if ($isMultidimensionalArray) {
			foreach ($data as $key => $val) {
				$dataPush = $this->_getDataNotification($val, $userId, $arrUser);
				$result[] = $dataPush;
			}

			return $result;
		}

		return $this->_getDataNotification($data, $userId, $arrUser);
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
			$listUser = $userModel->findAll();
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

	public function sendNotification(...$args)
	{
		$isSocketEnable = preference('sockets');
		if ($isSocketEnable) {
			$nodeServer = \Config\Services::nodeServer();
			$result = $nodeServer->node->get('/notification/send');
			echo "<pre>";
			print_r($nodeServer->node);
			echo "</pre>";

			echo "<pre>";
			print_r($result);
			echo "</pre>";

		} else {
			return $this->_sendNotification($args);
		}


	}


	// ** support function
	private function _getDataNotification($data, $userId, $arrUser)
	{
		$data['sender_id'] = $arrUser[$data['sender_id']] ?? [];
		$data['seen'] = false;
		if (!empty($data['read_by'])) {
			$a = array_search($userId, json_decode($data['read_by'], true));
			if ($a || $a === 0) {
				$data['seen'] = true;
			}
		}

		unset($data['recipient_id']);
		unset($data['read_by']);

		return $data;
	}
}
