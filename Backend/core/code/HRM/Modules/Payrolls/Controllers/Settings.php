<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : payrolls
* Controller name : Payrolls
* Time created : 02/06/2022 09:39:25
*/

namespace HRM\Modules\Payrolls\Controllers;

use App\Controllers\ErpController;

class Settings extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function save_general_post()
	{
		$getPost = $this->request->getPost();
		if (!hasModulePermit('payrolls', 'accessPayrollsSetting')) return $this->failForbidden(MISSING_UPDATE_PERMISSION);
		if (isset($getPost['data']['payroll_setting_currency'])) {
			preference('payroll_setting_currency', $getPost['data']['payroll_setting_currency'], true);
		}
		if (isset($getPost['data']['payroll_setting_calculate_monthly'])) {
			preference('payroll_setting_calculate_monthly', $getPost['data']['payroll_setting_calculate_monthly'], true);
		}
		if (isset($getPost['data']['payroll_auto_send_mail_review'])) {
			preference('payroll_auto_send_mail_review', $getPost['data']['payroll_auto_send_mail_review'], true);
		}
		return $this->respond(ACTION_SUCCESS);
	}

	public function last_payroll_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule('attendances');
		$model = $modules->model;
		$today = date('Y-m-d');
		$info = $model->where('date_from <=', $today)->where('date_to >=', $today)->first();
		if (!$info) {
			$info = $model->orderBy('date_to', 'DESC')->first();
		}
		$data['last_attendances_date'] = $info->date_to;
		return $this->respond($data);

	}

	public function delete_paycycle_post()
	{

		$getPost = $this->request->getPost();
		$idDelete = $getPost['id'];
		$modules = \Config\Services::modules();
		$modules->setModule('employees');
		$modelEmployees = $modules->model;
		$findAll = $modelEmployees->where('pay_cycle', $idDelete)->findAll();
		if (count($findAll) > 0) {
			return $this->fail(count($findAll));
		}
		$modules->setModule('pay_cycles');
		$payCycleModel = $modules->model;
		$payCycleModel->delete($idDelete);
		return $this->respond(ACTION_SUCCESS);

	}
}