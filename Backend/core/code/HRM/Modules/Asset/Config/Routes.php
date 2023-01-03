<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if (!isset($routes)) {
    $routes = \Config\Services::routes(true);
}

	/*** Route for Asset ***/
$routes->get('asset', 'Asset::index_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/index', 'Asset::index_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/add', 'Asset::add_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/load-data', 'Asset::load_data_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/update-status', 'Asset::update_status_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/hand-over', 'Asset::hand_over_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/error', 'Asset::error_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/load-history', 'Asset::load_history_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/detail-by-code', 'Asset::detail_by_code_get',['namespace' => 'HRM\Modules\Asset\Controllers']);

	/*** Route for ImportAsset ***/
$routes->get('asset-import-asset', 'ImportAsset::index_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-import-asset/index', 'ImportAsset::index_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-import-asset/get-asset-template', 'ImportAsset::get_asset_template_get',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-import-asset/get-mapping-fields', 'ImportAsset::get_mapping_fields_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-import-asset/get-import-data', 'ImportAsset::get_import_data_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-import-asset/import-asset', 'ImportAsset::import_asset_post',['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/get-data-asset-list', 'Asset::get_data_asset_list_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
