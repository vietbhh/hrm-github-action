<?php

namespace App\Controllers\Dashboard;

use App\Controllers\ErpController;

class Dashboard extends ErpController
{
	public function __construct()
	{

	}

	public function get_dashboard_get()
	{
		return $this->respond(ACTION_SUCCESS);
	}

	public function update_loading_dashboard_get()
	{
		return $this->respond(ACTION_SUCCESS);
	}

	public function save_widget_post()
	{
		$getParam = $this->request->getPost();
		$data = json_decode($getParam['data'], true);
		preference("dashboard_widget", $data);
		return $this->respond($data);
	}

}