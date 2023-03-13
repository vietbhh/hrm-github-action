<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for SettingMember ***/
$routes->get('fri-net-setting-member/get-metas', 'SettingMember::get_metas_get',['namespace' => 'HRM\Modules\FriNet\Controllers']);
$routes->post('fri-net-setting-member/show-hide-info', 'SettingMember::show_hide_info_post',['namespace' => 'HRM\Modules\FriNet\Controllers']);
