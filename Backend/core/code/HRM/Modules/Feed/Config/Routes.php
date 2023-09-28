<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Feed ***/
$routes->get('feed/get-initial-event', 'Feed::get_initial_event_get',['namespace' => 'HRM\Modules\Feed\Controllers']);
$routes->post('feed/posts-setting', 'Feed::posts_setting_post',['namespace' => 'HRM\Modules\Feed\Controllers']);
