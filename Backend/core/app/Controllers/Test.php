<?php

namespace App\Controllers;


use App\Models\UserModel;

class Test extends ErpController
{

	public function index_get(): \CodeIgniter\HTTP\Response
	{

		$notification = \Config\Services::notifications();
		$data = ['title' => 'test', 'content' => 'Test cai', 'link' => '', 'image' => '', 'type' => 'other'];
		try {
			$notification->pushNotification($data, [1], false);
		} catch (\Exception $e) {
			echo "<pre>";
			print_r($e);
			echo "</pre>";
		}
		exit;
		return $this->respond([]);
	}
}
