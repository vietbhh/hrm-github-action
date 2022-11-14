<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Import ***/
$routes->get('payrolls-import/export-template', 'Import::export_template_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls-import/preview', 'Import::preview_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls-import/import', 'Import::import_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);

	/*** Route for Payrolls ***/
$routes->get('payrolls', 'Payrolls::index_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls/index', 'Payrolls::index_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls/get-config', 'Payrolls::get_config_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls/get-payroll-table', 'Payrolls::get_payroll_table_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls/get-payroll-detail', 'Payrolls::get_payroll_detail_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls/edit-one-off', 'Payrolls::edit_one_off_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls/delete-one-off', 'Payrolls::delete_one_off_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls/edit-overtime', 'Payrolls::edit_overtime_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls/edit-off-cycle-offset-overtime', 'Payrolls::edit_off_cycle_offset_overtime_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls/close-payroll/(:any)', 'Payrolls::close_payroll_get/$1',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->add('payrolls/close-payroll/(:any)/?(:any)?', 'Payrolls::closePayroll/$1/$2',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls/export-excel/(:any)', 'Payrolls::export_excel_get/$1',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls/send-payslip', 'Payrolls::send_payslip_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->add('payrolls/get-table-payroll/(:any)/?(:any)?/?(:any)?/?(:any)?', 'Payrolls::getTablePayroll/$1/$2/$3/$4',['namespace' => 'HRM\Modules\Payrolls\Controllers']);

	/*** Route for Settings ***/
$routes->get('payrolls-settings', 'Settings::index_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls-settings/index', 'Settings::index_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls-settings/save-general', 'Settings::save_general_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->get('payrolls-settings/last-payroll', 'Settings::last_payroll_get',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
$routes->post('payrolls-settings/delete-paycycle', 'Settings::delete_paycycle_post',['namespace' => 'HRM\Modules\Payrolls\Controllers']);
