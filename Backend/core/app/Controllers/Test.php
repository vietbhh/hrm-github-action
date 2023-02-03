<?php

namespace App\Controllers;


use App\Models\UserModel;

class Test extends ErpController
{

	public function index_get(): \CodeIgniter\HTTP\Response
	{

		//$firestore = new FirestoreClient();
		$notification = \Config\Services::notifications();
		$payload = ['title' => 'test', 'body' => 'Test cai 23', 'link' => '/dashboard', 'icon' => getAvatarUrl('avatars/1/1_avatar.webp'), 'type' => 'other'];
		try {
			$notification->sendNotification(1, $payload);
		} catch (\Exception $e) {
			return $this->failForbidden($e->getMessage());
		}
		return $this->respond(true);
	}
}
