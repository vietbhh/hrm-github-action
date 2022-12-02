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

	public function save_widget_lock_post()
	{
		$getParam = $this->request->getPost();
		$data = filter_var($getParam['data'], FILTER_VALIDATE_BOOLEAN);
		preference("widget_dnd", $data);
		return $this->respond($data);
	}

}