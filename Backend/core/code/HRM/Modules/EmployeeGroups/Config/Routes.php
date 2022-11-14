<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for EmployeeGroups ***/
$routes->get('employee-groups', 'EmployeeGroups::index_get',['namespace' => 'HRM\Modules\EmployeeGroups\Controllers']);
$routes->get('employee-groups/index', 'EmployeeGroups::index_get',['namespace' => 'HRM\Modules\EmployeeGroups\Controllers']);
$routes->post('employee-groups/preview-employee', 'EmployeeGroups::preview_employee_post',['namespace' => 'HRM\Modules\EmployeeGroups\Controllers']);
$routes->post('employee-groups/edit-employee-group/(:any)', 'EmployeeGroups::edit_employee_group_post/$1',['namespace' => 'HRM\Modules\EmployeeGroups\Controllers']);
$routes->get('employee-groups/get-group-info/(:any)', 'EmployeeGroups::get_group_info_get/$1',['namespace' => 'HRM\Modules\EmployeeGroups\Controllers']);
