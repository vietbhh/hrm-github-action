<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Checklist ***/
$routes->get('checklist', 'Checklist::index_get',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->get('checklist/index', 'Checklist::index_get',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->get('checklist/load-template', 'Checklist::load_template_get',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/add', 'Checklist::add_post',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/update/(:any)', 'Checklist::update_post/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->delete('checklist/delete/(:any)', 'Checklist::delete_delete/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->get('checklist/detail/(:any)', 'Checklist::detail_get/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/add-task/(:any)', 'Checklist::add_task_post/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/update-task/(:any)', 'Checklist::update_task_post/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->delete('checklist/delete-task/(:any)', 'Checklist::delete_task_delete/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->get('checklist/load-checklist', 'Checklist::load_checklist_get',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/assign-checklist', 'Checklist::assign_checklist_post',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/complete-checklist-detail', 'Checklist::complete_checklist_detail_post',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/revert-checklist-detail', 'Checklist::revert_checklist_detail_post',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/update-checklist-detail/(:any)', 'Checklist::update_checklist_detail_post/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/complete-checklist/(:any)', 'Checklist::complete_checklist_post/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->post('checklist/update-checklist/(:any)', 'Checklist::update_checklist_post/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->get('checklist/get-list-todo', 'Checklist::get_list_todo_get',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->delete('checklist/delete-checklist-detail/(:any)/(:any)', 'Checklist::delete_checklist_detail_delete/$1/$2',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->get('checklist/get-checklist-employee-info/(:any)', 'Checklist::get_checklist_employee_info_get/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->get('checklist/get-checklist-detail-info/(:any)', 'Checklist::get_checklist_detail_info_get/$1',['namespace' => 'HRM\Modules\Checklist\Controllers']);
$routes->add('checklist/complete-multi-checklist-detail', 'Checklist::complete_multi_checklist_detail',['namespace' => 'HRM\Modules\Checklist\Controllers']);
