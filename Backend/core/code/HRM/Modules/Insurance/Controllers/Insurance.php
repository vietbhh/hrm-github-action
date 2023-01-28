<?php

namespace HRM\Modules\Insurance\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Employees\Models\EmployeesModel;

class Insurance extends ErpController
{
	public function get_config_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule("insurance");
		$insuranceModel = $modules->model;
		// check create new insurance
		$datetoday = date('Y-m-d');
		$check_create = $insuranceModel->where("('$datetoday' between date_from and date_to) or '$datetoday' < date_from")->first();
		if (!$check_create) {
			try {
				$this->CreateNewInsurance();
			} catch (\Exception $e) {
				return $e->getMessage();
			}
		}

		// check close insurance
		$date_last_month = date("Y-m-d", strtotime("last day of previous month"));
		$check_close = $insuranceModel->where("'$date_last_month' between date_from and date_to")->first();
		if ($check_close && $check_close->closed != 1) {
			$this->CloseInsurance($check_close->id);
		}

		// get list insurance
		$data = $insuranceModel->select("id as value, name as label")->orderBy("id", "desc")->findAll();

		return $this->respond($data);
	}

	public function get_table_get()
	{
		if (!hasModulePermit("employees", 'manage')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$getPara = $this->request->getGet();
		$insuranceId = $getPara['filter']['insurance'];
		$modulesInsurance = \Config\Services::modules("insurance");
		$insuranceModel = $modulesInsurance->model;
		$dataInsurance = $insuranceModel->asArray()->find($insuranceId);
		if (!$dataInsurance) return $this->fail(NOT_FOUND);
		$insuranceService = \HRM\Modules\Insurance\Libraries\Insurance\Config\Services::insurance();
		$out = $insuranceService->getInsurance($dataInsurance, $insuranceId, $getPara);

		return $this->respond($out);
	}

	public function get_close_insurance_get($id)
	{
		if (!hasModulePermit("employees", 'manage')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$this->CloseInsurance($id);

		return $this->respond(ACTION_SUCCESS);
	}

	public function CreateNewInsurance()
	{
		$modules = \Config\Services::modules();
		$modules->setModule("insurance");
		$insuranceModel = $modules->model;
		$insuranceModel->setAllowedFields(["name", "date_from", "date_to"]);
		$date_from = date("Y-m-01");
		$date_to = date("Y-m-t");
		$insertData = [
			'name' => $this->_formatDateToLetter($date_from) . ' - ' . $this->_formatDateToLetter($date_to),
			'date_from' => $date_from,
			'date_to' => $date_to,
			"owner" => 1,
			"created_by" => 1
		];
		$insuranceModel->save($insertData);
	}

	public function CloseInsurance($id)
	{
		$modulesInsurance = \Config\Services::modules("insurance");
		$insuranceModel = $modulesInsurance->model;
		$checkData = $insuranceModel->find($id);
		if ($checkData && $checkData->closed != 1) {
			$insuranceService = \HRM\Modules\Insurance\Libraries\Insurance\Config\Services::insurance();
			$modulesInsuranceDetail = \Config\Services::modules("insurance_detail");
			$insuranceDetailModel = $modulesInsuranceDetail->model;
			$deleteInsuranceDetail = $insuranceDetailModel->where("insurance", $id)->delete();
			$insuranceDetailModel->setAllowedFields(["insurance", "employee", "insurance_salary", "employee_pays", "company_pays", "insurance_status"]);
			$dataInsurance = $insuranceService->getTableInsurance($checkData->date_from, $checkData->date_to, [], true)['data_table'];
			foreach ($dataInsurance as $item) {
				$insuranceDetailModel->save(
					[
						"insurance" => $id,
						"employee" => $item['id'],
						"insurance_salary" => $item['insurance_salary'],
						"employee_pays" => $item['employee_pays'],
						"company_pays" => $item['company_pays'],
						"insurance_status" => $item['insurance_status'],
						"owner" => 1,
						"created_by" => 1
					]
				);
			}

			$insuranceModel->setAllowedFields(["closed"]);
			$insuranceModel->save(["id" => $id, "closed" => 1]);
		}
	}

	public function get_table_profile_get()
	{
		$getPara = $this->request->getGet();
		$year = $getPara['year'];
		$employeeId = $getPara['employeeId'];
		$date_from_year = $year . "-01-01";
		$date_to_year = $year . "-12-31";
		$modulesInsurance = \Config\Services::modules("insurance");
		$insuranceModel = $modulesInsurance->model;
		$dataInsurance = $insuranceModel->asArray()->where("(date_from <= '$date_to_year' and date_to >= '$date_from_year')")->orderBy('id', 'desc')->findAll();
		$modulesEmployees = \Config\Services::modules("employees");
		$employeeModel = $modulesEmployees->model;
		$selectEmployees = ['id', 'full_name', 'username', 'avatar', 'work_schedule', 'office'];
		$data = [];
		foreach ($dataInsurance as $item) {
			$insuranceId = $item['id'];
			$closed = $item['closed'];
			$date_from = $item['date_from'];
			$date_to = $item['date_to'];
			$name = $item['name'];

			$insuranceService = \HRM\Modules\Insurance\Libraries\Insurance\Config\Services::insurance();

			if ($closed == 0) {
				$dataEmployee = $employeeModel->asArray()->where('id', $employeeId)->select($selectEmployees)->findAll();
				$result = $insuranceService->handleDataNotClosed($date_from, $date_to, $dataEmployee)[0];
			} else {
				$result = $insuranceService->handleDataClosed($insuranceId, [], $employeeId)['data_table'];
			}
			$result['period'] = $name;
			$data[] = $result;
		}

		return $this->respond($data);
	}

	/** support function */
	private function _formatDateToLetter($date)
	{
		return date('d M Y', strtotime($date));
	}
}
