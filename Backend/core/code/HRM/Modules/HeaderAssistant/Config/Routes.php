<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for HeaderAssistant ***/
$routes->get('header-assistant/get-header-assistant', 'HeaderAssistant::get_header_assistant_get',['namespace' => 'HRM\Modules\HeaderAssistant\Controllers']);
$routes->get('header-assistant/get-weather', 'HeaderAssistant::get_weather_get',['namespace' => 'HRM\Modules\HeaderAssistant\Controllers']);
$routes->get('header-assistant/get-header-assistant-all', 'HeaderAssistant::get_header_assistant_all_get',['namespace' => 'HRM\Modules\HeaderAssistant\Controllers']);
$routes->post('header-assistant/save-header-assistant', 'HeaderAssistant::save_header_assistant_post',['namespace' => 'HRM\Modules\HeaderAssistant\Controllers']);
$routes->get('header-assistant/get-delete-header-assistant/(:any)', 'HeaderAssistant::get_delete_header_assistant_get/$1',['namespace' => 'HRM\Modules\HeaderAssistant\Controllers']);
$routes->get('header-assistant/get-data-header-assistant/(:any)', 'HeaderAssistant::get_data_header_assistant_get/$1',['namespace' => 'HRM\Modules\HeaderAssistant\Controllers']);
