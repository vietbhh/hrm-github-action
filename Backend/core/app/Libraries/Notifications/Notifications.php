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
		$this->model->save($content);
		return $this->model->insertID;
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
		])
			->asArray()
			->findAll();
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

	public function pushNotification($params, $arrIdUser, $addToNotification = false)
	{
		$title = $params['title'];
		$content = $params['content'];
		$link =  $params['link'];
		$image = isset($params['img']) ? $params['img'] : '';

		try {
			$userModel = new UserModel();
			$listUser = $userModel->asArray()->whereIn('id', $arrIdUser)->findAll();
			$newNotification = [];
			if ($addToNotification) {
				$arrDataAdd = $params;
				unset($arrDataAdd['img']);
				$arrDataAdd['recipient_id'] = json_encode($arrIdUser);
				$arrDataAdd['type'] = 'system';
				$arrDataAdd['sender_id'] = user_id();
				$arrDataAdd['read_by'] = json_encode([]);
				$id = $this->add($arrDataAdd);
				$newNotification = $this->handleNotificationData($this->detail($id), false);
			}
			
			foreach ($listUser as $rowUser) {
				$deviceTokens = $rowUser['device_token'];
				if ($deviceTokens) {
					$deviceTokens = json_decode($deviceTokens, true);
					foreach ($deviceTokens as $deviceToken) {
						$token = $deviceToken['token'];
						$data = [
							"notification" => [
								"body"  => $content,
								"title" => $title,
								"image" => $image
							],
							"priority" =>  "high",
							"data" => [
								"info" => [
									"title"  => $title,
									"link"   => $link,
									"image"  => $image
								],
								"add_notification" => $addToNotification,
								"notification_info" => $newNotification
							],
							"to" => $token
						];

						$ch = curl_init();

						curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
						curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
						curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
						curl_setopt($ch, CURLOPT_POST, 1);

						$headers = array();
						$headers[] = 'Content-Type: application/json';
						$headers[] = 'Authorization: key='.$_ENV['firebase_server_key'];
						curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

						$result = curl_exec($ch);
						curl_close($ch);
					}
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

	// ** support function
	private function _getDataNotification($data, $userId, $arrUser)
	{
		$data['sender_id'] = isset($arrUser[$data['sender_id']]) ? $arrUser[$data['sender_id']] : [];
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
