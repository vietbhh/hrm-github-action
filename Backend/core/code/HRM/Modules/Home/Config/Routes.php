<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Home ***/
$routes->get('home', 'Home::index_get',['namespace' => 'HRM\Modules\Home\Controllers']);
$routes->get('home/index', 'Home::index_get',['namespace' => 'HRM\Modules\Home\Controllers']);
