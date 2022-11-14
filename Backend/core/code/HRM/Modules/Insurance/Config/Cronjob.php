<?php

namespace HRM\Modules\Insurance\Config;

use HRM\Modules\Insurance\Controllers\Insurance;

class Cronjob
{
	public function handle_create_close_insurance()
	{
		$datetoday = date('Y-m-d');
		$date_first_month = date('Y-m-01');
		if ($datetoday == $date_first_month) {
			$modules = \Config\Services::modules("insurance");
			$insuranceModel = $modules->model;
			$check_create = $insuranceModel->where("('$datetoday' between date_from and date_to) or '$datetoday' < date_from")->first();
			if (!$check_create) {
				$insuranceController = new Insurance();
				$insuranceController->CreateNewInsurance();
			}
		}

		$date_last_month = date('Y-m-t');
		if ($datetoday == $date_last_month) {
			$modules = \Config\Services::modules("insurance");
			$insuranceModel = $modules->model;
			$check_data = $insuranceModel->where("'$datetoday' between date_from and date_to")->first();
			if ($check_data) {
				$insuranceController = new Insurance();
				$insuranceController->CloseInsurance($check_data->id);
			}
		}
	}
}