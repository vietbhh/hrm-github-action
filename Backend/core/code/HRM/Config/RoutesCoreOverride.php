<?php
if (!isset($routes)) {
	$routes = \Config\Services::routes(true);
}

$routes->get('calendar/load', 'Calendar::load_get', ['namespace' => 'HRM\Controllers']);
$routes->get('calendar/get-event-detail/(:alphanum)', 'Calendar::get_event_detail_get/$1', ['namespace' => 'HRM\Controllers']);
$routes->get('calendar/load-calendar-tag', 'Calendar::load_calendar_tag_get', ['namespace' => 'HRM\Controllers']);

$routes->add('user/setting/(:alphanum)', 'Profiles::setting/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('user/change-pwd', 'Profiles::changePwd',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('user/validate-current-pwd', 'Profiles::validateCurrentPwd',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('user/profile', 'Profiles::profile_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('user/update', 'Profiles::update_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->add('user/avatar', 'Profiles::avatar',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('user/documents', 'Profiles::documents_get',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('user/documents', 'Profiles::documents_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->delete('user/documents/(:any)', 'Profiles::documents_delete/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('user/related/(:any)/?(:alphanum)?', 'Profiles::related_get/$1/$2',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('user/related/(:any)', 'Profiles::related_post/$1',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->delete('user/related/(:any)/(:any)', 'Profiles::related_delete/$1/$2',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('user/create-google-access-token', 'Profiles::create_google_access_token_post',['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('user/get-user-access-token', 'Profiles::get_user_access_token_get', ['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('user/get-google-account-info', 'Profiles::get_google_account_info_get', ['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('user/sign-out-google', 'Profiles::sign_out_google_post', ['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('user/get-user-info', 'Profiles::get_user_info_get', ['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->post('user/update-sync-status', 'Profiles::update_sync_status_post', ['namespace' => 'HRM\Modules\Employees\Controllers']);
$routes->get('search/get_data_user', 'Search::get_data_employee_search_get', ['namespace' => 'HRM\Controllers']);
$routes->add('attendances-time-machine/(:any)', 'TimeMachine::index/$1',['namespace' => 'HRM\Modules\Attendances\Controllers']);

/*** Route for HeaderAssistant ***/
$routes->get('header-assistant/get-header-assistant', 'HeaderAssistant::get_header_assistant_get',['namespace' => 'HRM\Modules\HeaderAssistant\Controllers']);