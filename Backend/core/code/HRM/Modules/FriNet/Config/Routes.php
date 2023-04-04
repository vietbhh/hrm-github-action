<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Introduction ***/
$routes->get('fri-net-introduction/get-setting-member', 'Introduction::get_setting_member_get',['namespace' => 'HRM\Modules\FriNet\Controllers']);

	/*** Route for SettingMember ***/
$routes->get('fri-net-setting-member/get-metas', 'SettingMember::get_metas_get',['namespace' => 'HRM\Modules\FriNet\Controllers']);
$routes->post('fri-net-setting-member/show-hide-info', 'SettingMember::show_hide_info_post',['namespace' => 'HRM\Modules\FriNet\Controllers']);

	/*** Route for User ***/
$routes->get('fri-net-user/get-user/(:any)', 'User::get_user_get/$1',['namespace' => 'HRM\Modules\FriNet\Controllers']);
$routes->post('fri-net-user/save-cover-image', 'User::save_cover_image_post',['namespace' => 'HRM\Modules\FriNet\Controllers']);
