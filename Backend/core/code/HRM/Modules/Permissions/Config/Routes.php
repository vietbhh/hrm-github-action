<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Permissions ***/
$routes->get('permissions/get-detail/(:any)', 'Permissions::get_detail_get/$1',['namespace' => 'HRM\Modules\Permissions\Controllers']);
$routes->post('permissions/save', 'Permissions::save_post',['namespace' => 'HRM\Modules\Permissions\Controllers']);
