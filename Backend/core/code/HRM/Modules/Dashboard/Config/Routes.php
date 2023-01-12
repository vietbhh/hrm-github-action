<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Dashboard ***/
$routes->get('dashboard', 'Dashboard::index_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/index', 'Dashboard::index_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-dashboard', 'Dashboard::get_dashboard_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-dob', 'Dashboard::get_dob_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-data-attendance', 'Dashboard::get_data_attendance_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-data-off', 'Dashboard::get_data_off_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-data-my-time-off', 'Dashboard::get_data_my_time_off_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-data-pending-approval', 'Dashboard::get_data_pending_approval_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-data-check-list', 'Dashboard::get_data_check_list_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->post('dashboard/save-widget', 'Dashboard::save_widget_post',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/update-loading-dashboard', 'Dashboard::update_loading_dashboard_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-department', 'Dashboard::get_department_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-attendance-setting', 'Dashboard::get_attendance_setting_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->get('dashboard/get-attendance-today', 'Dashboard::get_attendance_today_get',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
$routes->add('dashboard/update-view-department', 'Dashboard::update_view_department',['namespace' => 'HRM\Modules\Dashboard\Controllers']);
