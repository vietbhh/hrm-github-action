<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for ContractType ***/
$routes->get('contract-type', 'ContractType::index_get',['namespace' => 'HRM\Modules\ContractType\Controllers']);
$routes->get('contract-type/index', 'ContractType::index_get',['namespace' => 'HRM\Modules\ContractType\Controllers']);
$routes->post('contract-type/create-contract-type', 'ContractType::create_contract_type_post',['namespace' => 'HRM\Modules\ContractType\Controllers']);
$routes->get('contract-type/load-contract-type', 'ContractType::load_contract_type_get',['namespace' => 'HRM\Modules\ContractType\Controllers']);
$routes->post('contract-type/update-contract-type/(:any)', 'ContractType::update_contract_type_post/$1',['namespace' => 'HRM\Modules\ContractType\Controllers']);
$routes->post('contract-type/delete-contract-type/(:any)', 'ContractType::delete_contract_type_post/$1',['namespace' => 'HRM\Modules\ContractType\Controllers']);
