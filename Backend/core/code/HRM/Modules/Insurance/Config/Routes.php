<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Insurance ***/
$routes->get('insurance/get-config', 'Insurance::get_config_get',['namespace' => 'HRM\Modules\Insurance\Controllers']);
$routes->get('insurance/get-table', 'Insurance::get_table_get',['namespace' => 'HRM\Modules\Insurance\Controllers']);
$routes->get('insurance/get-close-insurance/(:any)', 'Insurance::get_close_insurance_get/$1',['namespace' => 'HRM\Modules\Insurance\Controllers']);
$routes->add('insurance/create-new-insurance', 'Insurance::CreateNewInsurance',['namespace' => 'HRM\Modules\Insurance\Controllers']);
$routes->add('insurance/close-insurance/(:any)', 'Insurance::CloseInsurance/$1',['namespace' => 'HRM\Modules\Insurance\Controllers']);
$routes->get('insurance/get-table-profile', 'Insurance::get_table_profile_get',['namespace' => 'HRM\Modules\Insurance\Controllers']);
