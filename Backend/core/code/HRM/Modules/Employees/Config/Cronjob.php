<?php

namespace HRM\Modules\Employees\Config;

use App\Models\UserModel;
use HRM\Modules\Employees\Controllers\Employee;
use HRM\Modules\Employees\Models\EmployeesModel;

class Cronjob
{
	public function auto_resigned()
	{
		helper('app_select_option');
		$module = \Config\Services::modules();
		$module->setModule('employees');

		$model = $module->model;


		$listEmployee = $model->asArray()->where([
			'status' => getOptionValue('employees', 'status', 'offboarding'),
			'last_working_date <=' => date('Y-m-d')
		])->findAll();
		$arrayId = [];
		foreach ($listEmployee as $item) {
			$arrayId[] = $item['id'];
		}

		if (!empty($arrayId)) {
			$employeeModel = new EmployeesModel();
			$employeeModel->resign($arrayId);
		}
	}

	public function auto_active_contract()
	{
		$date_today = date('Y-m-d');
		$employeeModel = new EmployeesModel();
		$dataEmployees = $employeeModel->exceptResigned()->select(['id'])->asArray()->findAll();
		$modulesContract = \Config\Services::modules("contracts");
		$contractModel = $modulesContract->model;
		$employeeController = new Employee();
		foreach ($dataEmployees as $itemEmployee) {
			$idEmployee = $itemEmployee['id'];
			$checkContract = $contractModel->where('employee', $idEmployee)->where('contract_date_start <=', $date_today)->orderBy('contract_date_start', 'desc')->asArray()->first();
			if (!empty($checkContract) && $checkContract['active'] != 1) {
				$employeeController->_handleSetEmployeeContractActive($idEmployee, $checkContract['id'], $checkContract);
			}
		}
	}
}

?>