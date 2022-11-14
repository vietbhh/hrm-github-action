<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for WorkSchedule ***/
$routes->get('work-schedule', 'WorkSchedule::index_get',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
$routes->get('work-schedule/index', 'WorkSchedule::index_get',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
$routes->get('work-schedule/loaddata', 'WorkSchedule::loaddata_get',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
$routes->get('work-schedule/info/(:any)', 'WorkSchedule::info_get/$1',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
$routes->add('work-schedule/convert-json-boolean/(:any)', 'WorkSchedule::convertJsonBoolean/$1',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
$routes->post('work-schedule/save', 'WorkSchedule::save_post',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
$routes->post('work-schedule/setdefault', 'WorkSchedule::setdefault_post',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
$routes->post('work-schedule/delete', 'WorkSchedule::delete_post',['namespace' => 'HRM\Modules\WorkSchedule\Controllers']);
