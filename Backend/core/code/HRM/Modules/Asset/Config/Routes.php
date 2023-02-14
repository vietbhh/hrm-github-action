<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if (!isset($routes)) {
	$routes = \Config\Services::routes(true);
}

/*** Route for Asset ***/
$routes->get('asset', 'Asset::index_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/index', 'Asset::index_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/get-data-asset-list', 'Asset::get_data_asset_list_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/add', 'Asset::add_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/load-data', 'Asset::load_data_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/update-status', 'Asset::update_status_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/hand-over', 'Asset::hand_over_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset/error', 'Asset::error_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/load-history', 'Asset::load_history_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/detail-by-code', 'Asset::detail_by_code_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset/export-excel', 'Asset::export_excel_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);

/*** Route for Group ***/
$routes->post('asset-group/create', 'Group::create_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-group/get-data-asset-group', 'Group::get_data_asset_group_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-group/update/(:any)', 'Group::update_post/$1', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-group/delete/(:any)', 'Group::delete_post/$1', ['namespace' => 'HRM\Modules\Asset\Controllers']);

/*** Route for Import ***/
$routes->get('asset-import', 'Import::index_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-import/index', 'Import::index_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-import/get-asset-template', 'Import::get_asset_template_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-import/get-mapping-fields', 'Import::get_mapping_fields_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-import/get-import-data', 'Import::get_import_data_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-import/import-asset', 'Import::import_asset_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);

/*** Route for Inventories ***/
$routes->post('asset-inventories/add-new-inventory', 'Inventories::add_new_inventory_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-inventories/get-list-inventory', 'Inventories::get_list_inventory_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-inventories/get-inventory/(:any)', 'Inventories::get_inventory_get/$1', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-inventories/get-list-inventory-detail', 'Inventories::get_list_inventory_detail_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-inventories/get-asset-detail', 'Inventories::get_asset_detail_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-inventories/save-inventory-detail', 'Inventories::save_inventory_detail_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);

/*** Route for Type ***/
$routes->post('asset-type/create', 'Type::create_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-type/get-data-asset-type', 'Type::get_data_asset_type_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-type/update/(:any)', 'Type::update_post/$1', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-type/delete/(:any)', 'Type::delete_post/$1', ['namespace' => 'HRM\Modules\Asset\Controllers']);


/*** Route for Brand ***/
$routes->post('asset-brand/create', 'Brand::create_post', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->get('asset-brand/get-data-asset-brand', 'Brand::get_data_asset_brand_get', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-brand/update/(:any)', 'Brand::update_post/$1', ['namespace' => 'HRM\Modules\Asset\Controllers']);
$routes->post('asset-brand/delete/(:any)', 'Brand::delete_post/$1', ['namespace' => 'HRM\Modules\Asset\Controllers']);
