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
		if ($dataInsurance['closed'] == 0) {
			$date_from = $dataInsurance['date_from'];
			$date_to = $dataInsurance['date_to'];
			$out = $this->getTableInsurance($date_from, $date_to, $getPara);
		} else {
			$out = $this->handleDataClosed($insuranceId, $getPara);
		}

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
			$modulesInsuranceDetail = \Config\Services::modules("insurance_detail");
			$insuranceDetailModel = $modulesInsuranceDetail->model;
			$deleteInsuranceDetail = $insuranceDetailModel->where("insurance", $id)->delete();
			$insuranceDetailModel->setAllowedFields(["insurance", "employee", "insurance_salary", "employee_pays", "company_pays", "insurance_status"]);
			$dataInsurance = $this->getTableInsurance($checkData->date_from, $checkData->date_to, [], true)['data_table'];
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
		$dataInsurance = $insuranceModel->asArray()->where("(date_from <= '$date_to_year' and date_to >= '$date_from_year')")->orderBy('id','desc')->findAll();
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

			if ($closed == 0) {
				$dataEmployee = $employeeModel->asArray()->where('id', $employeeId)->select($selectEmployees)->findAll();
				$result = $this->handleDataNotClosed($date_from, $date_to, $dataEmployee)[0];
			} else {
				$result = $this->handleDataClosed($insuranceId, [], $employeeId)['data_table'];
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

	private function getTableInsurance($date_from, $date_to, $getPara = [], $getAllData = false)
	{
		$selectEmployees = ['id', 'full_name', 'username', 'avatar', 'work_schedule', 'office'];
		$employeeModel = new EmployeesModel();
		if ($getAllData) {
			$recordsTotal = $employeeModel->exceptResigned()->countAllResults(false);
			$dataEmployee = $employeeModel->exceptResigned()->asArray()->select($selectEmployees)->findAll();
		} else {
			if (!empty($getPara['searchVal'])) {
				$searchVal = $getPara['searchVal'];
				$employeeModel->where("full_name like '%$searchVal%'");
			}
			$page = $getPara['pagination']['current'];
			$length = $getPara['pagination']['pageSize'];
			$start = ($page - 1) * $length;
			$recordsTotal = $employeeModel->exceptResigned()->countAllResults(false);
			$dataEmployee = $employeeModel->exceptResigned()->asArray()->select($selectEmployees)->findAll($length, $start);
		}

		$data = $this->handleDataNotClosed($date_from, $date_to, $dataEmployee);

		$out['total'] = $recordsTotal;
		$out['data_table'] = $data;

		return $out;
	}

	private function handleDataNotClosed($date_from, $date_to, $dataEmployee)
	{
		helper("app_select_option");
		helper("HRM\Modules\Attendances\Helpers\attendance");
		$modulesContract = \Config\Services::modules("contracts");
		$contractModel = $modulesContract->model;
		$modulesAttendance = \Config\Services::modules("attendance_details");
		$attendanceModel = $modulesAttendance->model;
		$attendanceModule = $modulesAttendance->getModule();
		$begin = new \DateTime($date_from);
		$end = new \DateTime($date_to);
		$listAttendanceDetailAllDate = [];
		for ($i = $end; $i >= $begin; $i->modify('-1 day')) {
			$date = $i->format('Y-m-d');
			$arr['a'] = $date;
			$listAttendanceDetailAllDate[$date] = $arr;
		}
		$data = [];
		foreach ($dataEmployee as $item) {
			$employee_id = $item['id'];
			$data_contract = $contractModel->select(["insurance_salary"])->where("employee", $employee_id)->where("contract_date_start <= '$date_to' and contract_date_end >= '$date_from'")->orderBy('id', 'desc')->first();
			$insurance_salary = 0;
			if ($data_contract) $insurance_salary = $data_contract->insurance_salary;
			$company_pays = 21.5 * $insurance_salary / 100;
			$employee_pays = 10.5 * $insurance_salary / 100;

			// check working day
			$attendanceModel->where("employee", $employee_id);
			$attendanceModel->where("date between '$date_from' and '$date_to'");
			$attendanceModel->groupStart();
			$attendanceModel->orWhere("status", getOptionValue($attendanceModule, "status", "approved"));
			$attendanceModel->orWhere("status", getOptionValue($attendanceModule, "status", "pending"));
			$attendanceModel->groupEnd();
			$data_attendance_db = $attendanceModel->asArray()->findAll();
			$listAttendanceDetailAll = $listAttendanceDetailAllDate;
			foreach ($data_attendance_db as $row) {
				if (isset($row['date'])) {
					$date = date('Y-m-d', strtotime($row['date']));
					if (isset($listAttendanceDetailAll[$date])) {
						$listAttendanceDetailAll[$date] = array_merge($listAttendanceDetailAll[$date], $row);
					}
				}
			}
			if (empty($item['work_schedule']) || $item['work_schedule'] == '[]') {
				$insurance_status = 0;
			} else {
				$result = getAttendanceDetail($listAttendanceDetailAll, $item, $date_from, $date_to, [], [], [], ['totalWorkingDay', 'totalNonWorkingDay']);
				if (!$result) {
					$insurance_status = 0;
				} else {
					if ($result['totalNonWorkingDay'] > 14) {
						$insurance_status = 0;
					} else {
						$insurance_status = 1;
					}
				}
			}

			$arr = $item;
			$arr['insurance_salary'] = $insurance_salary;
			$arr['company_pays'] = $company_pays;
			$arr['employee_pays'] = $employee_pays;
			$arr['insurance_status'] = $insurance_status;
			$data[] = $arr;
		}

		return $data;
	}

	private function handleDataClosed($insuranceId, $getPara = [], $employeeId = 0)
	{
		$selectData = ['m_employees.id as id', 'm_employees.full_name as full_name', 'm_employees.username as username', 'm_employees.avatar as avatar', 'm_insurance_detail.insurance_salary as insurance_salary', 'm_insurance_detail.employee_pays as employee_pays', 'm_insurance_detail.company_pays as company_pays', 'm_insurance_detail.insurance_status as insurance_status'];
		$modulesInsuranceDetail = \Config\Services::modules("insurance_detail");
		$insuranceDetailModel = $modulesInsuranceDetail->model;
		$insuranceDetailModel->join("m_employees", "m_employees.id = m_insurance_detail.employee")->where('m_employees.status !=', 16)->where("m_insurance_detail.insurance", $insuranceId);
		if (!empty($getPara)) {
			if (!empty($getPara['searchVal'])) {
				$searchVal = $getPara['searchVal'];
				$insuranceDetailModel->where("m_employees.full_name like '%$searchVal%'");
			}
			$page = $getPara['pagination']['current'];
			$length = $getPara['pagination']['pageSize'];
			$start = ($page - 1) * $length;
			$recordsTotal = $insuranceDetailModel->countAllResults(false);
			$data = $insuranceDetailModel->asArray()->select($selectData)->findAll($length, $start);
		} else {
			$recordsTotal = 1;
			$data = $insuranceDetailModel->where("employee", $employeeId)->asArray()->select($selectData)->first();
		}

		$out['total'] = $recordsTotal;
		$out['data_table'] = $data;

		return $out;
	}
}