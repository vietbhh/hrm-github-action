<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Test ***/
$routes->post('test/done-test', 'Test::done_test_post',['namespace' => 'HRM\Modules\Test\Controllers']);
$routes->get('test/detail/(:any)', 'Test::detail_get/$1',['namespace' => 'HRM\Modules\Test\Controllers']);
$routes->post('test/import', 'Test::import_post',['namespace' => 'HRM\Modules\Test\Controllers']);
$routes->delete('test/delete/(:any)', 'Test::delete_delete/$1',['namespace' => 'HRM\Modules\Test\Controllers']);
$routes->get('test/load-data-test', 'Test::loadDataTest_get',['namespace' => 'HRM\Modules\Test\Controllers']);
