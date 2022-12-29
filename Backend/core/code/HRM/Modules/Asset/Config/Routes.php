<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Asset ***/
$routes->get('asset', 'Asset::index_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/index', 'Asset::index_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/load-data', 'Asset::load_data_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
