<?php

namespace App\Controllers;


use App\Models\UserModel;

class Test extends ErpController
{

	public function index_get(): \CodeIgniter\HTTP\Response
	{

		$notification = \Config\Services::notifications();
		$payload = ['title' => 'test', 'body' => 'Test cai 23', 'link' => '/dashboard', 'icon' => getAvatarUrl('avatars/1/1_avatar.webp'), 'type' => 'other'];
		try {
			$notification->sendNotification(1, $payload, []);
		} catch (\Exception $e) {
			echo "<pre>";
			print_r($e);
			echo "</pre>";
		}
		exit;
		return $this->respond([]);
	}
}
