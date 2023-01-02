<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Documents ***/
$routes->get('documents', 'Documents::index_get',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->get('documents/index', 'Documents::index_get',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->get('documents/document', 'Documents::document_get',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/save-document', 'Documents::save_document_post',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/update-document/(:any)', 'Documents::update_document_post/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->delete('documents/remove-document/(:any)', 'Documents::remove_document_delete/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->get('documents/download-document/(:any)', 'Documents::download_document_get/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/share-document/(:any)', 'Documents::share_document_post/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/update-share-status/(:any)', 'Documents::update_share_status_post/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->get('documents/document-detail/(:any)', 'Documents::document_detail_get/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/upload-file-document/(:any)', 'Documents::upload_file_document_post/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/replace-file-document/(:any)', 'Documents::replace_file_document_post/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/delete-file-document/(:any)', 'Documents::delete_file_document_post/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->post('documents/upload-file-from-google-drive/(:any)', 'Documents::upload_file_from_google_drive_post/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
$routes->get('documents/get-info-document/(:any)', 'Documents::get_info_document_get/$1',['namespace' => 'HRM\Modules\Documents\Controllers']);
