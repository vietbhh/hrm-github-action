<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for ImportTimeOff ***/
$routes->get('time-off-import-time-off/get-sample-file-import', 'ImportTimeOff::get_sample_file_import_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-import-time-off/get-fields-import', 'ImportTimeOff::get_fields_import_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-import-time-off/get-import-data', 'ImportTimeOff::get_import_data_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-import-time-off/import-time-off', 'ImportTimeOff::import_time_off_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);

	/*** Route for Setting ***/
$routes->get('time-off-setting', 'Setting::index_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off-setting/index', 'Setting::index_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off-setting/get-type-and-policy', 'Setting::get_type_and_policy_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/add-type-and-policy-time-off', 'Setting::add_type_and_policy_time_off_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/update-type/(:any)', 'Setting::update_type_post/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/update-policy-time-off/(:any)', 'Setting::update_policy_time_off_post/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/assign-eligibility/(:any)', 'Setting::assign_eligibility_post/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/update-eligibility/(:any)', 'Setting::update_eligibility_post/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->delete('time-off-setting/time-off-type/(:any)', 'Setting::time_off_type_delete/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off-setting/load-list-employee-eligibility-change', 'Setting::load_list_employee_eligibility_change_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off-setting/get-holiday', 'Setting::get_holiday_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/add-holiday', 'Setting::add_holiday_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/update-holiday/(:any)', 'Setting::update_holiday_post/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->delete('time-off-setting/remove-holiday/(:any)', 'Setting::remove_holiday_delete/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off-setting/add-holiday-country', 'Setting::add_holiday_country_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off-setting/load-employee-select', 'Setting::load_employee_select_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off-setting/get-detail-policy/(:any)', 'Setting::get_detail_policy_get/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);

	/*** Route for TimeOff ***/
$routes->get('time-off/get-balance', 'TimeOff::get_balance_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-my-requests', 'TimeOff::get_my_requests_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/delete-file/(:any)', 'TimeOff::delete_file_get/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off/change-file', 'TimeOff::change_file_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-mytime-off-config', 'TimeOff::get_mytime_off_config_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-duration-allow/(:any)', 'TimeOff::get_duration_allow_get/$1',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off/submit-request', 'TimeOff::submit_request_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-delete-approver', 'TimeOff::get_delete_approver_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-add-approver', 'TimeOff::get_add_approver_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-mail-request', 'TimeOff::get_mail_request_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-balance-history', 'TimeOff::get_balance_history_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-cancel', 'TimeOff::get_cancel_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-reject', 'TimeOff::get_reject_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-approve', 'TimeOff::get_approve_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-team-time-off', 'TimeOff::get_team_time_off_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-approval-time-off', 'TimeOff::get_approval_time_off_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-employee-time-off-request', 'TimeOff::get_employee_time_off_request_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-employee-time-off-carousel', 'TimeOff::get_employee_time_off_carousel_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-employee-time-off-balance-history', 'TimeOff::get_employee_time_off_balance_history_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-employee-time-off-add-adjustment-config', 'TimeOff::get_employee_time_off_add_adjustment_config_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/get-employee-time-off-change-type', 'TimeOff::get_employee_time_off_change_type_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off/employee-time-off-submit-adjustment', 'TimeOff::employee_time_off_submit_adjustment_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/export-excel', 'TimeOff::export_excel_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->get('time-off/load-current-user', 'TimeOff::load_current_user_get',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off/create-google-access-token', 'TimeOff::create_google_access_token_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
$routes->post('time-off/toggle-sync-google-calendar', 'TimeOff::toggle_sync_google_calendar_post',['namespace' => 'HRM\Modules\TimeOff\Controllers']);
