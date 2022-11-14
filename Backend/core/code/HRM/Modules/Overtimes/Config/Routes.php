<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Overtimes ***/
$routes->get('overtimes', 'Overtimes::index_get',['namespace' => 'HRM\Modules\Overtimes\Controllers']);
$routes->get('overtimes/index', 'Overtimes::index_get',['namespace' => 'HRM\Modules\Overtimes\Controllers']);
$routes->post('overtimes/create-overtime', 'Overtimes::create_overtime_post',['namespace' => 'HRM\Modules\Overtimes\Controllers']);
$routes->get('overtimes/get-overtime', 'Overtimes::get_overtime_get',['namespace' => 'HRM\Modules\Overtimes\Controllers']);
$routes->post('overtimes/action-overtime/(:any)', 'Overtimes::action_overtime_post/$1',['namespace' => 'HRM\Modules\Overtimes\Controllers']);
$routes->get('overtimes/get-overtime-request', 'Overtimes::get_overtime_request_get',['namespace' => 'HRM\Modules\Overtimes\Controllers']);
$routes->post('overtimes/update-overtime/(:any)', 'Overtimes::update_overtime_post/$1',['namespace' => 'HRM\Modules\Overtimes\Controllers']);
