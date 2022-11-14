<?php 
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : home
*/
namespace HRM\Modules\Home\Controllers;
use App\Controllers\ErpController;
class Home extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}
}