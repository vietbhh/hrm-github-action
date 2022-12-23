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

	public function pushNotification($data = ['title' => '', 'content' => '', 'link' => '', 'image' => '', 'type' => 'other'], $receiver, $saveToDb = true)
	{
		$title = $data['title'];
		$content = $data['content'];
		$link = $data['link'];
		$image = $data['image'] ?? '';
		$type = $data['type'] ?? "other";

		try {
			$userModel = new UserModel();
			$listUser = $userModel->select(['id', 'username', 'device_token'])->asArray()->whereIn('id', $receiver)->findAll();
			$newNotification = [];
			if ($saveToDb) {
				$saveNotificationData = [
					'sender_id' => user_id() ?? 0,
					'recipient_id' => json_encode($receiver),
					'type' => $type,
					'title' => $title,
					'content' => $content,
					'link' => $link,
					'image' => $image,
					'read_by' => json_encode([])
				];
				$id = $this->add($saveNotificationData);
			}

			$client = new FirebaseCM\Client();

			$client->setApiKey($_ENV['firebase_server_key']);
			$client->injectGuzzleHttpClient(new \GuzzleHttp\Client());

			$message = new FirebaseCM\Message();

			$message->setPriority('high');
			$message->setNotification(new FirebaseCM\Notification('some title', 'some body'))->setData(['key' => 'value']);


			foreach ($listUser as $rowUser) {
				$recipients = $rowUser['device_token'] ?? [];
				$recipients = json_decode($recipients, true);
				foreach ($recipients as $recipient) {
					$message->addRecipient(new FirebaseCM\Recipient\Device($recipient));
				}
			}
			$response = $client->send($message);
			$responseData = $response->getBody()->getContents();
			if (!empty($responseData)) {
				$responseData = json_decode($responseData, true);
				if (!empty($responseData['results'])) {
					foreach ($responseData["results"] as $i => $result) {
						if (isset($result["error"])) {
							echo "<pre>";
							print_r($recipients[$i]);
							echo "</pre>";

						}
					}
				}
				echo "<pre>";
				print_r($responseData);
				echo "</pre>";

			}


			return true;
		} catch (\Exception $e) {
			return [
				'success' => false,
				'error' => $e
			];
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
