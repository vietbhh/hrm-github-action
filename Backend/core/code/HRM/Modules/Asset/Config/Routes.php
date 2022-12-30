<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Asset ***/
$routes->get('asset', 'Asset::index_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/get-asset-template', 'ImportAsset::get_asset_template_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/get-mapping-fields', 'ImportAsset::get_mapping_fields_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/get-import-data', 'ImportAsset::get_import_data_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/import-asset', 'ImportAsset::import_asset_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
