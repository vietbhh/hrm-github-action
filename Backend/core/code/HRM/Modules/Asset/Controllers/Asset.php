<?php 
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : asset
*/
namespace HRM\Modules\Asset\Controllers;
use App\Controllers\ErpController;
class Asset extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}
}