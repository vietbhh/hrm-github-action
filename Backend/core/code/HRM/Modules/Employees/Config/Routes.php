<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Employee ***/
$routes->add('employees-employee/-handle-set-employee-contract-active/(:any)/(:any)/(:any)/?(:any)?', 'Employee::_handleSetEmployeeContractActive/$1/$2/$3/$4',['namespace' => 'HRM\Modules\Employees\Controllers']);

	/*** Route for Employees ***/
$routes->get('employees/get/(:any)', 'Employees::get_get/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/add', 'Employees::add_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update/(:any)', 'Employees::update_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/offboard/(:any)', 'Employees::offboard_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/cancel-offboard/(:any)', 'Employees::cancel_offboard_get/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/load', 'Employees::load_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->delete('employees/delete/(:any)', 'Employees::delete_delete/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('employees/avatar/(:any)', 'Employees::avatar/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/load-users', 'Employees::load_users_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/documents/(:any)', 'Employees::documents_get/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/documents/(:any)', 'Employees::documents_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->delete('employees/documents/(:any)/(:any)', 'Employees::documents_delete/$1/$2',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/related/(:any)/(:any)/?(:any)?', 'Employees::related_get/$1/$2/$3',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/related/(:any)/(:any)', 'Employees::related_post/$1/$2',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->delete('employees/related/(:any)/(:any)/(:any)', 'Employees::related_delete/$1/$2/$3',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/rehire/(:any)', 'Employees::rehire_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/org-chart/?(:any)?', 'Employees::org_chart_get/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('employees/invite/(:any)', 'Employees::invite/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/export-excel', 'Employees::export_excel_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/preview', 'Employees::preview_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/import', 'Employees::import_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/payroll/(:any)', 'Employees::payroll_get/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/payroll-by-year', 'Employees::payroll_by_year_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/add-recurring', 'Employees::add_recurring_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update-recurring', 'Employees::update_recurring_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/info-recurring/(:any)', 'Employees::info_recurring_get/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/add-employee-view', 'Employees::add_employee_view_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update-employee-view', 'Employees::update_employee_view_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/delete-employee-view', 'Employees::delete_employee_view_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update-employee-view-name', 'Employees::update_employee_view_name_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/set-active-employee-view', 'Employees::set_active_employee_view_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/get-setting-column-table', 'Employees::get_setting_column_table_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/save-setting-column-table', 'Employees::save_setting_column_table_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update-employee-user-metas', 'Employees::update_employee_user_metas_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/in-department', 'Employees::in_department_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/load-approve-post', 'Employees::load_approve_post_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/save-setting-approve-feed', 'Employees::save_setting_approve_feed_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/add-custom-field', 'Employees::add_custom_field_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/load-tab-content', 'Employees::load_tab_content_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/load-custom-field-detail/(:any)', 'Employees::load_custom_field_detail_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update-custom-field/(:any)', 'Employees::update_custom_field_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/delete-custom-field/(:any)', 'Employees::delete_custom_field_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/load-auto-generate-code', 'Employees::load_auto_generate_code_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update-auto-generate-code/(:any)', 'Employees::update_auto_generate_code_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees/update-employee-status/(:any)', 'Employees::update_employee_status_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees/get-over-view-employee', 'Employees::get_over_view_employee_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('employees/-handle-set-employee-contract-active/(:any)/(:any)/(:any)/?(:any)?', 'Employees::_handleSetEmployeeContractActive/$1/$2/$3/$4',['namespace' => 'HRM\Modules\Employees\Controllers']);

	/*** Route for Profiles ***/
$routes->add('employees-profiles/setting/(:any)', 'Profiles::setting/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('employees-profiles/change-pwd', 'Profiles::changePwd',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('employees-profiles/validate-current-pwd', 'Profiles::validateCurrentPwd',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-profiles/profile', 'Profiles::profile_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-profiles/update', 'Profiles::update_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('employees-profiles/avatar', 'Profiles::avatar',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-profiles/documents', 'Profiles::documents_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-profiles/documents', 'Profiles::documents_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->delete('employees-profiles/documents/(:any)', 'Profiles::documents_delete/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-profiles/related/(:any)/?(:any)?', 'Profiles::related_get/$1/$2',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-profiles/related/(:any)', 'Profiles::related_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->delete('employees-profiles/related/(:any)/(:any)', 'Profiles::related_delete/$1/$2',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-profiles/create-google-access-token', 'Profiles::create_google_access_token_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-profiles/get-user-access-token', 'Profiles::get_user_access_token_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-profiles/get-google-account-info', 'Profiles::get_google_account_info_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-profiles/sign-out-google', 'Profiles::sign_out_google_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-profiles/get-user-info', 'Profiles::get_user_info_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-profiles/update-sync-status', 'Profiles::update_sync_status_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('employees-profiles/-handle-set-employee-contract-active/(:any)/(:any)/(:any)/?(:any)?', 'Profiles::_handleSetEmployeeContractActive/$1/$2/$3/$4',['namespace' => 'HRM\Modules\Employees\Controllers']);

	/*** Route for Settings ***/
$routes->post('employees-settings/create-employee-type', 'Settings::create_employee_type_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-settings/load-employee-type', 'Settings::load_employee_type_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-settings/update-employee-type/(:any)', 'Settings::update_employee_type_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-settings/delete-employee-type/(:any)', 'Settings::delete_employee_type_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-settings/create-contract-type', 'Settings::create_contract_type_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('employees-settings/load-contract-type', 'Settings::load_contract_type_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-settings/update-contract-type/(:any)', 'Settings::update_contract_type_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('employees-settings/delete-contract-type/(:any)', 'Settings::delete_contract_type_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);

$routes->post('employees-by-department-id', 'Employees::getUserByDepartmentId',['namespace' => 'HRM\Modules\Employees\Controllers']);
