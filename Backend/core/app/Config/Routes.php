<?php namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes(true);

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php')) {
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Auth');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(true);
$routes->set404Override();
$routes->setAutoRoute(false);
/**
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$homeRoute = getenv('homeRoute') ? getenv('homeRoute') : "Auth::login";
$homeNameSpace = getenv('homeNameSpace') ? getenv('homeNameSpace') : "App\Controllers";
// We get a performance increase by specifying the default
// route since we don't have to scan directories.
$routes->get('/', $homeRoute, ['namespace' => $homeNameSpace]);
$routes->get('auth/setting', 'Auth::setting');
$routes->post('auth/login', 'Auth::login');
$routes->post('auth/refresh-token', 'Auth::refreshToken');
$routes->get('auth/logout', 'Auth::logout');
$routes->post('auth/profile', 'Auth::profile');
$routes->post('auth/forgot', 'Auth::forgotPassword');
$routes->post('auth/reset', 'Auth::resetPassword');
$routes->post('auth/reset/validate', 'Auth::validateResetToken');
$routes->post('auth/active', 'Auth::activateAccount');
$routes->get('auth/active/validate', 'Auth::validateActiveToken');
$routes->get('auth/reactive', 'Auth::resendActivateAccount');


$routes->post('user/setting/(:alphanum)', 'User::setting/$1');
$routes->post('user/change-pwd', 'User::changePwd');
$routes->post('user/change-pwd/validate', 'User::validateCurrentPwd');

$routes->get('app/module/users', 'App::users_get');
$routes->get('app/module/([A-Za-z0-9\-\_]+)', 'App::module_get/$1');
$routes->get('module/([A-Za-z0-9\-\_]+)/?(:alpha)?', 'App::load_get/$1/$2');
$routes->get('module/([A-Za-z0-9\-\_]+)/linked', 'App::linked_get/$1');
$routes->get('module/([A-Za-z0-9\-\_]+)/(:num)', 'App::detail_get/$1/$2');
$routes->post('module/([A-Za-z0-9\-\_]+)/create-option', 'App::create_option/$1');
$routes->post('module/([A-Za-z0-9\-\_]+)/import', 'App::import_post/$1');
$routes->post('module/([A-Za-z0-9\-\_]+)/validate', 'App::validate_post/$1');
$routes->post('module/([A-Za-z0-9\-\_]+)/user-metas', 'App::update_user_metas/$1');
$routes->post('module/([A-Za-z0-9\-\_]+)/setting', 'App::setting/$1');
$routes->post('module/([A-Za-z0-9\-\_]+)', 'App::save_post/$1');
$routes->put('module/([A-Za-z0-9\-\_]+)/(:num)', 'App::update_put/$1/$2');
$routes->delete('module/([A-Za-z0-9\-\_]+)', 'App::delete_delete/$1');
$routes->delete('module/([A-Za-z0-9\-\_]+)/(:any)', 'App::delete_delete/$1/$2');

/*** Route for App Manage controller ***/

$routes->get('settings/app', 'App::index_get', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/app', 'App::update_post', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/general', 'General::index_get', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/general', 'General::update_post', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/mail/templates/?(:alphanum)?', 'Mail::templates_get/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/mail/templates', 'Mail::templates_post', ['namespace' => 'App\Controllers\Settings']);
$routes->delete('settings/mail/templates/(:alpha)', 'Mail::templates_delete/$1', ['namespace' => 'App\Controllers\Settings']);

$routes->get('settings/modules', 'Modules::index_get', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/modules/exist', 'Modules::checkExists_post', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/modules/(:any)', 'Modules::detail_get/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/modules/add', 'Modules::add_post', ['namespace' => 'App\Controllers\Settings']);
$routes->put('settings/modules/(:alphanum)', 'Modules::update_put/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->delete('settings/modules/delete/(:alpha)', 'Modules::delete_delete/$1/$2', ['namespace' => 'App\Controllers\Settings']);

$routes->get('settings/groups/load', 'Groups::load_get', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/groups/permissions', 'Groups::permissions_get', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/groups/duplicate/(:num)', 'Groups::duplicate_get/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/groups/detail/(:alphanum)', 'Groups::detail_get/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/groups/save', 'Groups::save_post', ['namespace' => 'App\Controllers\Settings']);

$routes->get('settings/users/load', 'Users::load_get', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/users/save', 'Users::save_post', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/users/(:num)/deactivate', 'Users::action_get/$1/deactivate', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/users/(:num)/activate', 'Users::action_get/$1/activate', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/users/invite/(:num)', 'Users::invite_get/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/users/change-pwd/(:num)', 'Users::changePwd_post/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->get('settings/users/detail/(:alphanum)', 'Users::detail_get/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->delete('settings/users/delete/(:alphanum)', 'Users::delete_delete/$1/$2', ['namespace' => 'App\Controllers\Settings']);

$routes->post('settings/groups/users/add', 'Groups::addUserToGroup_post', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/groups/users/remove/(:alphanum)', 'Groups::removeUserFromGroup_post', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/groups/permissions/add', 'Groups::addPerToGroup_post', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/groups/permissions/remove/(:alphanum)', 'Groups::removePerFromGroup_post', ['namespace' => 'App\Controllers\Settings']);
$routes->delete('settings/groups/delete/(:any)', 'Groups::delete_delete/$1', ['namespace' => 'App\Controllers\Settings']);
$routes->post('settings/groups/validate', 'Groups::validate_post', ['namespace' => 'App\Controllers\Settings']);


/**
 * --------------------------------------------------------------------
 * Custom Code Routing Override
 * --------------------------------------------------------------------
 */
if (file_exists(CODEPATH . 'RoutesCoreOverride.php')) {
	require_once(CODEPATH . 'RoutesCoreOverride.php');
}

$routes->get('download/file', 'Download::file');
$routes->get('download/image', 'Download::image');
$routes->get('download/avatar', 'Download::avatar');
$routes->get('download/public/(:alpha)', 'Download::publicDownload/$1');
$routes->get('download/logo/(:alpha)', 'Download::logoDownload/$1');

$routes->get('user/profile', 'User::profile_get');
$routes->post('user/update', 'User::update_post');
$routes->add('user/avatar', 'User::avatar');
$routes->get('user/get/(:alphanum)', 'User::get_get/$1');
$routes->post('user/save-device-token', 'User::save_device_token_post/$1');


/*** Route for Libs ***/
$routes->post('lib/upload', 'Lib::upload_post');
$routes->get('lib/download/(:alphanum)', 'Lib::download_get/$1');

/*** Route for General controller ***/
$routes->post('task/add', 'Task::add_post');
$routes->post('task/addtag', 'Task::addtag_post');
$routes->get('task/gettag', 'Task::gettag_get');
$routes->delete('task/delete/(:any)', 'Task::delete_delete/$1');
$routes->get('task/detail/(:alphanum)', 'Task::detail_get/$1');
$routes->get('task/list', 'Task::load_get/$1');

$routes->get('notification/load', 'Notification::load_get');
$routes->post('notification/seen', 'Notification::seen_post');
$routes->get('notification/seen-notification', 'Notification::seen_notification_get');
$routes->get('calendar/load', 'Calendar::load_get');
$routes->get('calendar/detail/(:alphanum)', 'Calendar::detail_get/$1');
$routes->get('calendar/detail/(:alphanum)', 'Calendar::detail_get/$1');
$routes->post('calendar/add', 'Calendar::add_post');
$routes->delete('calendar/delete/(:any)', 'Calendar::delete_delete/$1');
$routes->post('calendar/update/(:alphanum)', 'Calendar::update_post/$1');
$routes->get('calendar/load-calendar-tag', 'Calendar::load_calendar_tag_get');
$routes->delete('calendar/remove-calendar/(:alphanum)', 'Calendar::delete_delete/$1');
$routes->get('general/users', 'General::load_users_get');

/*** Route for Search ****/
$routes->get('search/get_data_user', 'Search::get_data_employee_search_get', ['namespace' => 'App\Controllers']);

/*** Route for Dashboard */
$routes->get('dashboard/get-dashboard', 'Dashboard::get_dashboard_get', ['namespace' => 'App\Controllers\Dashboard']);
$routes->get('dashboard/update-loading-dashboard', 'Dashboard::update_loading_dashboard_get', ['namespace' => 'App\Controllers\Dashboard']);
$routes->post('dashboard/save-widget', 'Dashboard::save_widget_post', ['namespace' => 'App\Controllers\Dashboard']);
$routes->post('dashboard/save-widget-lock', 'Dashboard::save_widget_lock_post', ['namespace' => 'App\Controllers\Dashboard']);
$routes->post('notepad/save', 'Notepad::save_post', ['namespace' => 'App\Controllers\Dashboard']);
$routes->get('notepad/get_all', 'Notepad::get_all_get', ['namespace' => 'App\Controllers\Dashboard']);
$routes->get('notepad/get/(:alphanum)', 'Notepad::get_get/$1', ['namespace' => 'App\Controllers\Dashboard']);
$routes->get('notepad/pin/(:alphanum)', 'Notepad::pin_get/$1', ['namespace' => 'App\Controllers\Dashboard']);
$routes->get('notepad/un_pin/(:alphanum)', 'Notepad::un_pin_get/$1', ['namespace' => 'App\Controllers\Dashboard']);
$routes->get('notepad/delete/(:alphanum)', 'Notepad::delete_get/$1', ['namespace' => 'App\Controllers\Dashboard']);
$routes->post('notepad/delete_multiple', 'Notepad::delete_multiple_post', ['namespace' => 'App\Controllers\Dashboard']);

/*** Route for HeaderAssistant */
$routes->get('header-assistant/get-header-assistant', 'HeaderAssistant::get_header_assistant_get', ['namespace' => 'App\Controllers']);
$routes->get('header-assistant/get-weather', 'HeaderAssistant::get_weather_get', ['namespace' => 'App\Controllers']);
$routes->get('header-assistant/get-all-header-assistant', 'HeaderAssistant::get_header_assistant_all_get', ['namespace' => 'App\Controllers']);
$routes->post('header-assistant/save-header-assistant', 'HeaderAssistant::save_header_assistant_post', ['namespace' => 'App\Controllers']);
$routes->get('header-assistant/get-delete-header-assistant/(:alphanum)', 'HeaderAssistant::get_delete_header_assistant_get/$1', ['namespace' => 'App\Controllers']);
$routes->get('header-assistant/get-data-header-assistant/(:alphanum)', 'HeaderAssistant::get_data_header_assistant_get/$1', ['namespace' => 'App\Controllers']);

/**
 * --------------------------------------------------------------------
 * Custom Code Routing
 * --------------------------------------------------------------------
 */
if (file_exists(CODEPATH . 'Routes.php')) {
	require_once(CODEPATH . 'Routes.php');
}


/**
 * --------------------------------------------------------------------
 * HMVC Routing
 * --------------------------------------------------------------------
 */

foreach (glob(APPPATH . 'Modules/*', GLOB_ONLYDIR) as $item_dir) {
	if (file_exists($item_dir . '/Config/Routes.php')) {
		require_once($item_dir . '/Config/Routes.php');
	}
}

/**
 * --------------------------------------------------------------------
 * CLIENT Routing
 * --------------------------------------------------------------------
 */

foreach (glob(CLIENTPATH . 'Modules/*', GLOB_ONLYDIR) as $item_dir) {
	if (file_exists($item_dir . '/Config/Routes.php')) {
		require_once($item_dir . '/Config/Routes.php');
	}
}

/**
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need to it be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */

if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php')) {
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
