<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Departments ***/
$routes->get('departments', 'Departments::index_get',['namespace' => 'HRM\Modules\Departments\Controllers']);
$routes->get('departments/index', 'Departments::index_get',['namespace' => 'HRM\Modules\Departments\Controllers']);
$routes->get('departments/load-data', 'Departments::loadData_get',['namespace' => 'HRM\Modules\Departments\Controllers']);
$routes->post('departments/add', 'Departments::add_post',['namespace' => 'HRM\Modules\Departments\Controllers']);
$routes->post('departments/update-employee', 'Departments::update_employee_post',['namespace' => 'HRM\Modules\Departments\Controllers']);
$routes->post('departments/update-parent', 'Departments::update_parent_post',['namespace' => 'HRM\Modules\Departments\Controllers']);
$routes->post('departments/delete-department', 'Departments::delete_department_post',['namespace' => 'HRM\Modules\Departments\Controllers']);
