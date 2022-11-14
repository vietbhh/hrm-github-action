<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Attendances ***/
$routes->get('attendances', 'Attendances::index_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances/index', 'Attendances::index_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances/load-my-attendance', 'Attendances::load_my_attendance_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances/load-employee-attendance', 'Attendances::load_employee_attendance_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->post('attendances/add-attendance-log', 'Attendances::add_attendance_log_post',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->post('attendances/edit-attendance-detail-paid-time/(:any)', 'Attendances::edit_attendance_detail_paid_time_post/$1',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->post('attendances/edit-attendance-detail-overtime/(:any)', 'Attendances::edit_attendance_detail_overtime_post/$1',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances/load-attendance-detail-log', 'Attendances::load_attendance_detail_log_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances/get-list-attendance-for-filter', 'Attendances::get_list_attendance_for_filter_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);

	/*** Route for Employee ***/
$routes->get('attendances-employee/get-config', 'Employee::get_config_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances-employee/get-table-attendance', 'Employee::get_table_attendance_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->post('attendances-employee/post-save-employee-attendance', 'Employee::post_save_employee_attendance_post',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances-employee/export-excel', 'Employee::export_excel_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);

	/*** Route for Setting ***/
$routes->get('attendances-setting', 'Setting::index_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances-setting/index', 'Setting::index_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances-setting/info-attendance/(:any)', 'Setting::info_attendance_get/$1',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances-setting/info-general', 'Setting::info_general_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->post('attendances-setting/general-save', 'Setting::general_save_post',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances-setting/load-data', 'Setting::loadData_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->get('attendances-setting/time-machine', 'Setting::time_machine_get',['namespace' => 'HRM\Modules\Attendances\Controllers']);

	/*** Route for TimeMachine ***/
$routes->add('attendances-time-machine', 'TimeMachine::index',['namespace' => 'HRM\Modules\Attendances\Controllers']);
$routes->add('attendances-time-machine/index', 'TimeMachine::index',['namespace' => 'HRM\Modules\Attendances\Controllers']);
