<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Careers ***/
$routes->get('careers', 'Careers::index_get',['namespace' => 'HRM\Modules\Careers\Controllers']);
$routes->get('careers/index', 'Careers::index_get',['namespace' => 'HRM\Modules\Careers\Controllers']);
$routes->get('careers/info', 'Careers::info_get',['namespace' => 'HRM\Modules\Careers\Controllers']);
$routes->post('careers/apply', 'Careers::apply_post',['namespace' => 'HRM\Modules\Careers\Controllers']);
