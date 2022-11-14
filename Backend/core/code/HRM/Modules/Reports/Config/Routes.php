<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset($routes))
{ 
    $routes = \Config\Services::routes(true);
}

	/*** Route for Attendance ***/
$routes->get('reports-attendance/load-attendance', 'Attendance::load_attendance_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-attendance/export-attendance', 'Attendance::export_attendance_get',['namespace' => 'HRM\Modules\Reports\Controllers']);

	/*** Route for Employee ***/
$routes->get('reports-employee/get-employee', 'Employee::get_employee_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-employee/employee-filter', 'Employee::employee_filter_get',['namespace' => 'HRM\Modules\Reports\Controllers']);

	/*** Route for EmployeeTurnoverRate ***/
$routes->get('reports-employee-turnover-rate/get-employee-turnover-rate', 'EmployeeTurnoverRate::get_employee_turnover_rate_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-employee-turnover-rate/export-excel', 'EmployeeTurnoverRate::export_excel_get',['namespace' => 'HRM\Modules\Reports\Controllers']);

	/*** Route for Offboarding ***/
$routes->get('reports-offboarding/get-offboarding', 'Offboarding::get_offboarding_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-offboarding/export-excel', 'Offboarding::export_excel_get',['namespace' => 'HRM\Modules\Reports\Controllers']);

	/*** Route for Onboarding ***/
$routes->get('reports-onboarding/get-onboarding', 'Onboarding::get_onboarding_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-onboarding/export-excel', 'Onboarding::export_excel_get',['namespace' => 'HRM\Modules\Reports\Controllers']);

	/*** Route for Recruitment ***/
$routes->get('reports-recruitment/load-recruitment', 'Recruitment::load_recruitment_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-recruitment/export-recruitment', 'Recruitment::export_recruitment_get',['namespace' => 'HRM\Modules\Reports\Controllers']);

	/*** Route for TimeOffBalance ***/
$routes->get('reports-time-off-balance/load-time-off-balance', 'TimeOffBalance::load_time_off_balance_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-time-off-balance/export-time-off-balance', 'TimeOffBalance::export_time_off_balance_get',['namespace' => 'HRM\Modules\Reports\Controllers']);

	/*** Route for TimeOffSchedule ***/
$routes->get('reports-time-off-schedule/load-time-off-schedule', 'TimeOffSchedule::load_time_off_schedule_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
$routes->get('reports-time-off-schedule/export-time-off-schedule', 'TimeOffSchedule::export_time_off_schedule_get',['namespace' => 'HRM\Modules\Reports\Controllers']);
