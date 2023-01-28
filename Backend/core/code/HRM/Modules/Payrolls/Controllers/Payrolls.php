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
use HRM\Modules\Payrolls\Config\Cronjob;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Payrolls extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function get_config_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule("payrolls");
		$payrollModel = $modules->model;
		// check create new payroll
		$datetoday = date('Y-m-d');
		$check_create = $payrollModel->where("('$datetoday' between date_from and date_to) or '$datetoday' < date_from")->first();
		if (!$check_create) {
			try {
				$cronjob = new Cronjob();
				$cronjob->create_new_payroll_schedule();
			} catch (\Exception $e) {
				//return $e->getMessage();
			}
		}

		// get list payroll
		$data_payrolls = $payrollModel->select("id as value, name as label")->orderBy("id", "desc")->findAll();

		$out['data_payrolls'] = $data_payrolls;

		return $this->respond($out);
	}

	public function get_payroll_table_get()
	{
		if (!hasModulePermit("payrolls", 'accessEmployeePayroll')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);

		$getPara = $this->request->getGet();
		$payroll = $getPara['filter']['payroll'];
		$type = $getPara['filter']['type'];
		$searchVal = $getPara['searchVal'];

		$payrollsService = \HRM\Modules\Payrolls\Libraries\Payrolls\Config\Services::payrolls();

		$out = $payrollsService->getTablePayroll($payroll, $type, $searchVal);

		return $this->respond($out);
	}

	public function get_payroll_detail_get()
	{
		$getPara = $this->request->getGet();
		$payroll = $getPara['payroll'];
		$employee = $getPara['employee_id'];
		$date_from = $getPara['date_from'];
		$date_to = $getPara['date_to'];
		$closed = $getPara['closed'];
		$request_type = $getPara['request_type'];
		if ($request_type == 'profile') {
			$modules = \Config\Services::modules();
			$modules->setModule("payrolls");
			$payrollModel = $modules->model;
			$payroll_db = $payrollModel->find($payroll);

			$date_from = $payroll_db->date_from;
			$date_to = $payroll_db->date_to;
			$closed = $payroll_db->closed;

			$modules->setModule("pay_cycles");
			$model = $modules->model;
			$setting = $model->asArray()->first();
			$setting = handleDataBeforeReturn($modules, $setting);

			$payrollsService = \HRM\Modules\Payrolls\Libraries\Payrolls\Config\Services::payrolls();

			$result_getOffCycle = $payrollsService->getDateOffCycle($modules, $payroll, $date_from, $date_to, $setting);
			if (!empty($result_getOffCycle['date_to_new'])) {
				$date_to = $result_getOffCycle['date_to_new'];
			}
		}

		$out = $this->getPayrollDetail($payroll, $employee, $date_from, $date_to, $closed);

		return $this->respond($out);
	}

	public function edit_one_off_post()
	{
		$data = $this->request->getPost();
		$row = $data['row'];
		$key = $row['key'];
		$payroll = $data['payroll'];
		$employee_id = $data['employee_id'];

		$modules = \Config\Services::modules();
		$modules->setModule("payroll_details");
		$model = $modules->model;
		$payroll_db = $model->where("payroll", $payroll)->where("employee", $employee_id)->select("id, detail_one_off")->first();
		$save['payroll'] = $payroll;
		$save['employee'] = $employee_id;
		$oneOff = [];
		if ($payroll_db) {
			$save['id'] = $payroll_db->id;
			$oneOff = json_decode($payroll_db->detail_one_off, true);
			if (!empty($oneOff)) {
				foreach ($oneOff as $key_db => $item) {
					if ($item['key'] == $key) {
						$key = $key_db;
						break;
					}
				}
				$oneOff[$key] = $row;
				$oneOff = array_values($oneOff);
			} else {
				$oneOff[] = $row;
			}
		} else {
			$oneOff[] = $row;
		}
		$save['detail_one_off'] = json_encode($oneOff);

		$model->setAllowedFields(["id", "payroll", "employee", "detail_one_off"]);

		try {
			$model->save($save);
			$one_off = 0;
			$detail_one_off = json_decode($save['detail_one_off'], true);
			if (!empty($detail_one_off)) {
				foreach ($detail_one_off as $item) {
					if (is_numeric($item[3])) {
						$one_off += $item[3];
					}
				}
			}
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond($one_off);
	}

	public function delete_one_off_post()
	{
		$data = $this->request->getPost();
		$detail_one_off = $data['detail_one_off'];
		if (isset($detail_one_off[0]) && empty($detail_one_off[0])) {
			$detail_one_off = [];
		}
		$payroll = $data['payroll'];
		$employee_id = $data['employee_id'];
		$modules = \Config\Services::modules();
		$modules->setModule("payroll_details");
		$model = $modules->model;
		$payroll_db = $model->where("payroll", $payroll)->where("employee", $employee_id)->select("id, detail_one_off")->first();
		if ($payroll_db) {
			$model->setAllowedFields(["detail_one_off"]);
			$save['id'] = $payroll_db->id;
			$save['detail_one_off'] = json_encode($detail_one_off);
			$one_off = 0;
			if (!empty($detail_one_off)) {
				foreach ($detail_one_off as $item) {
					if (is_numeric($item[3])) {
						$one_off += $item[3];
					}
				}
			}
			try {
				$model->save($save);
			} catch (\Exception $e) {
				return $this->failServerError($e->getMessage());
			}
		} else {
			$one_off = 0;
		}

		return $this->respond($one_off);
	}

	public function edit_overtime_post()
	{
		$data = $this->request->getPost();
		$newData = $data['newData'];
		$row = $data['row'];
		$payroll = $data['payroll'];
		$employee_id = $data['employee_id'];

		$modules = \Config\Services::modules();
		$modules->setModule("payroll_details");
		$model = $modules->model;
		$payroll_db = $model->where("payroll", $payroll)->where("employee", $employee_id)->select("id, detail_overtime")->first();
		$save['payroll'] = $payroll;
		$save['employee'] = $employee_id;
		$overtime = [];
		if ($payroll_db) {
			$save['id'] = $payroll_db->id;
			$overtime = json_decode($payroll_db->detail_overtime, true);
			if (!empty($overtime)) {
				$key = -1;
				foreach ($overtime as $key_db => $item) {
					if (isset($item[2]) && $item[2] == $row[2]) {
						$key = $key_db;
						break;
					}
				}
				if ($key < 0) {
					$overtime[] = $row;
				} else {
					$overtime[$key] = $row;
					$overtime = array_values($overtime);
				}
			} else {
				$overtime[] = $row;
			}
		} else {
			$overtime[] = $row;
		}
		$save['detail_overtime'] = json_encode($overtime);

		$model->setAllowedFields(["id", "payroll", "employee", "detail_overtime"]);

		try {
			$model->save($save);
			$overtime_amount = 0;
			foreach ($newData as $item) {
				if ($item['type'] != $row[2]) {
					$overtime_amount += $item['amount'];
				}
			}
			$overtime_amount += $row[3];
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond($overtime_amount);
	}

	public function edit_off_cycle_offset_overtime_post()
	{
		$data = $this->request->getPost();
		$newData = $data['newData'];
		$row = $data['row'];
		if (isset($row[2]) && isset($row[2][1])) {
			$row[2] = $row[2][1];
		}
		$payroll = $data['payroll'];
		$employee_id = $data['employee_id'];
		$type = $data['overtime_type'];

		$modules = \Config\Services::modules();
		$modules->setModule("payroll_details");
		$model = $modules->model;
		$payroll_db = $model->where("payroll", $payroll)->where("employee", $employee_id)->select("id, detail_off_cycle_overtime, detail_offset_overtime")->first();
		$save['payroll'] = $payroll;
		$save['employee'] = $employee_id;
		$overtime = [];
		if ($payroll_db) {
			$save['id'] = $payroll_db->id;
			if ($type == 'overtime_off_cycle') {
				$overtime = json_decode($payroll_db->detail_off_cycle_overtime, true);
			} elseif ($type == 'overtime_offset') {
				$overtime = json_decode($payroll_db->detail_offset_overtime, true);
			}
			if (!empty($overtime)) {
				$key = -1;
				foreach ($overtime as $key_db => $item) {
					if (isset($item[2]) && $item[2] == $row[2]) {
						$key = $key_db;
						break;
					}
				}
				if ($key < 0) {
					$overtime[] = $row;
				} else {
					$overtime[$key] = $row;
					$overtime = array_values($overtime);
				}
			} else {
				$overtime[] = $row;
			}
		} else {
			$overtime[] = $row;
		}

		if ($type == 'overtime_off_cycle') {
			$save['detail_off_cycle_overtime'] = json_encode($overtime);
		} elseif ($type == 'overtime_offset') {
			$save['detail_offset_overtime'] = json_encode($overtime);
		}

		$model->setAllowedFields(["id", "payroll", "employee", "detail_off_cycle_overtime", "detail_offset_overtime"]);

		try {
			$model->save($save);
			$overtime_amount = 0;
			foreach ($newData as $item) {
				if ($item['type'] == 'overtime') {
					if (isset($item[2][1]) && $item[2][1] != $row[2]) {
						$overtime_amount += $item[3];
					}
				}
				if ($item['type'] == 'recurring') {
					$overtime_amount += $item[3];
				}
				if ($item['type'] == 'time_off') {
					$overtime_amount -= $item[3];
				}
				if ($item['type'] == 'deficit') {
					$overtime_amount -= $item[3];
				}
			}
			$overtime_amount += $row[3];
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond($overtime_amount);
	}

	public function close_payroll_get($payroll)
	{
		return $this->closePayroll($payroll);
	}

	public function closePayroll($payroll, $cronjob = false)
	{
		$modules = \Config\Services::modules();
		$modules->setModule("payrolls");
		$payrollModel = $modules->model;
		$payroll_db = $payrollModel->find($payroll);
		if (!$payroll_db) {
			if ($cronjob) {
				return 'false 1';
			}
			return $this->failNotFound(NOT_FOUND);
		}
		if ($payroll_db->closed == 1) {
			if ($cronjob) {
				return 'false 2';
			}
			return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		}
		$date_from = $payroll_db->date_from;
		$date_to = $payroll_db->date_to;
		$closed = $payroll_db->closed;

		$payrollsService = \HRM\Modules\Payrolls\Libraries\Payrolls\Config\Services::payrolls();

		$payroll_table = $payrollsService->getTablePayroll($payroll);
		$data_table = $payroll_table['data_table'];
		$data_total = $payroll_table['data_total'];

		$modules->setModule("pay_cycles");
		$model = $modules->model;
		$setting = $model->asArray()->first();
		$setting = handleDataBeforeReturn($modules, $setting);

		$result_getOffCycle = $payrollsService->getDateOffCycle($modules, $payroll, $date_from, $date_to, $setting);
		$date_from_cycle_offset = $result_getOffCycle['date_from_cycle_offset'];
		$date_to_cycle_offset = $result_getOffCycle['date_to_cycle_offset'];
		if (!empty($result_getOffCycle['date_to_new'])) {
			$date_to = $result_getOffCycle['date_to_new'];
		}
		$modules->setModule("payroll_details");
		$model = $modules->model;
		$model->setAllowedFields(["payroll", "employee", "is_salary", "total_comp", "salary", "actual", "recurring", "one_off", "offset", "ot", "off_cycle", "unpaid", "deficit", "detail_one_off", "detail_overtime", "detail_recurring", "detail_time_off", "detail_deficit", "detail_attendance", "detail_carry_over_of_overtime", "detail_dependents", "data_employee", "data_contracts", "attendance", "dependents", "detail_offset", "detail_off_cycle"]);
		foreach ($data_table as $employee => $item) {
			$payroll_detail = $this->getPayrollDetail($payroll, $employee, $date_from, $date_to, $closed);
			$data_overtime = [];
			foreach ($payroll_detail['data_overtime'] as $item_overtime) {
				$data_overtime[] = [
					1 => $item_overtime['overtime'],
					2 => $item_overtime['type'],
					3 => $item_overtime['amount']
				];
			}

			$save_detail = [
				'id' => $payroll_detail['id_payroll_detail'],
				'payroll' => $payroll,
				'employee' => $employee,
				'is_salary' => $item['is_salary'] ? 1 : 0,
				'total_comp' => $item['total_comp'],
				'salary' => $item['salary'],
				'actual' => $item['actual'],
				'recurring' => $item['recurring'],
				'one_off' => $item['one_off'],
				'offset' => $item['offset'],
				'ot' => $item['ot'],
				'off_cycle' => $item['off_cycle'],
				'unpaid' => $item['unpaid'],
				'deficit' => $item['deficit'],
				'detail_overtime' => json_encode($data_overtime),
				'detail_recurring' => json_encode($payroll_detail['data_recurring']),
				'detail_time_off' => json_encode($payroll_detail['data_time_off']),
				'detail_deficit' => json_encode($payroll_detail['data_deficit']),
				'detail_attendance' => json_encode($payroll_detail['data_attendance']),
				'detail_carry_over_of_overtime' => json_encode($payroll_detail['data_carry_over_of_overtime']),
				'detail_dependents' => json_encode($payroll_detail['data_dependents']),
				'detail_offset' => json_encode($payroll_detail['data_offset']),
				'detail_off_cycle' => json_encode($payroll_detail['data_off_cycle']),
				'data_employee' => json_encode(empty($payroll_detail['data_employee']) ? [] : $payroll_detail['data_employee']),
				'data_contracts' => json_encode(empty($payroll_detail['data_contracts']) ? [] : $payroll_detail['data_contracts']),
				'attendance' => $payroll_detail['attendance'],
				'dependents' => $payroll_detail['dependents'],
			];
			try {
				$model->save($save_detail);
			} catch (\Exception $e) {
				if ($cronjob) {
					return 'false 3';
				}
				return $this->failServerError($e->getMessage());
			}
		}

		$save_payroll = [
			'id' => $payroll,
			'closed' => 1,
			'total_comp' => $data_total['total_comp'],
			'salary' => $data_total['salary'],
			'actual' => $data_total['actual'],
			'recurring' => $data_total['recurring'],
			'one_off' => $data_total['one_off'],
			'offset' => $data_total['offset'],
			'ot' => $data_total['ot'],
			'off_cycle' => $data_total['off_cycle'],
			'unpaid' => $data_total['unpaid'],
			'deficit' => $data_total['deficit'],
			'date_from_offset' => $date_from_cycle_offset,
			'date_to_offset' => $date_to_cycle_offset,
		];

		try {
			$modules->setModule("payrolls");
			$payrollModel = $modules->model;
			$payrollModel->setAllowedFields(["closed", "total_comp", "salary", "actual", "recurring", "one_off", "offset", "ot", "off_cycle", "unpaid", "deficit", "date_from_offset", "date_to_offset"]);
			$payrollModel->save($save_payroll);
		} catch (\Exception $e) {
			if ($cronjob) {
				return 'false 4';
			}
			return $this->failServerError($e->getMessage());
		}

		if ($cronjob) {
			return 'true';
		}
		return $this->respond(ACTION_SUCCESS);
	}

	public function export_excel_get($payroll)
	{
		// data
		$currency = preference('payroll_setting_currency');
		$modules = \Config\Services::modules();

		$modules->setModule("employees");
		$module = $modules->getModule();
		helper("app_select_option");
		$option_value = getAppSelectOptions($module);
		$option_value_status = $option_value['status'];
		$arr_option_status_value_name = [];
		foreach ($option_value_status as $item) {
			$arr_option_status_value_name[$item['value']] = $item['name_option'];
		}

		$modules->setModule("job_titles");
		$model = $modules->model;
		$data_select = $model->select(["name", "id"])->findAll();
		$arr_option_job = [];
		foreach ($data_select as $item) {
			$arr_option_job[$item->id] = $item->name;
		}

		$modules->setModule("payrolls");
		$payrollModel = $modules->model;
		$payroll_db = $payrollModel->find($payroll);
		$date_from = $payroll_db->date_from;
		$date_to = $payroll_db->date_to;
		$closed = $payroll_db->closed;

		$payrollsService = \HRM\Modules\Payrolls\Libraries\Payrolls\Config\Services::payrolls();

		$payroll_table = $payrollsService->getTablePayroll($payroll);
		$data_table = $payroll_table['data_table'];

		/*alphabet A to AZ*/
		$arr_alphabet = [];
		for ($k = -1; $k <= 0; $k++) {
			$alphabet_ = $arr_alphabet[$k] ?? "";
			foreach (range('A', 'Z') as $columnId) {
				$arr_alphabet[] = $alphabet_ . $columnId;
			}
		}

		$styleBold = [
			'font' => [
				'bold' => true
			]
		];

		$spreadsheet = new Spreadsheet();
		$sheet = $spreadsheet->getActiveSheet();

		$i = 1;
		$sheet->getStyle("A$i:Y$i")->applyFromArray($styleBold);
		$sheet->setCellValue("A$i", "Employee Name");
		$sheet->setCellValue("B$i", "Email");
		$sheet->setCellValue("C$i", "Employee Status");
		$sheet->setCellValue("D$i", "Employment Type");
		$sheet->setCellValue("E$i", "Job Title");
		$sheet->setCellValue("F$i", "Join Date");
		$sheet->setCellValue("G$i", "Contract end date");
		$sheet->setCellValue("H$i", "Last Working Date");
		$sheet->setCellValue("I$i", "Pay Note");
		$sheet->setCellValue("J$i", "Currency");
		$sheet->setCellValue("K$i", "Account name");
		$sheet->setCellValue("L$i", "Account number");
		$sheet->setCellValue("M$i", "Bank Name");
		$sheet->setCellValue("N$i", "Bank Address");
		$sheet->setCellValue("O$i", "Total Compensation");
		$sheet->setCellValue("P$i", "Salary");
		$sheet->setCellValue("Q$i", "Actual");
		$sheet->setCellValue("R$i", "Recurring");
		$sheet->setCellValue("S$i", "One Off");
		$sheet->setCellValue("T$i", "Offset");
		$sheet->setCellValue("U$i", "OT");
		$sheet->setCellValue("V$i", "Off Cycle");
		$sheet->setCellValue("W$i", "Unpaid");
		$sheet->setCellValue("X$i", "Deficit");

		foreach ($data_table as $employee => $item) {
			$i++;

			$modules->setModule("employees");
			$employeeModel = $modules->model;
			$data_employee = $employeeModel->asArray()->select("employee_type")->find($employee);
			$data_employee = handleDataBeforeReturn($modules, $data_employee);

			$modules->setModule("contracts");
			$contractModel = $modules->model;
			$data_contracts = $contractModel->where('employee', $employee)->where("active", 1)->select("contract_date_end")->asArray()->first();
			$data_contracts = handleDataBeforeReturn($modules, $data_contracts);

			$sheet->getStyle("A$i:Y$i")->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
			$sheet->getStyle("O$i:X$i")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
			$sheet->setCellValue("A$i", $item['employee_name']);
			$sheet->setCellValue("B$i", $item['email']);
			$sheet->setCellValue("C$i", $arr_option_status_value_name[$item['status']] ?? "");
			$sheet->setCellValue("D$i", $data_employee['employee_type']['label'] ?? "");
			$sheet->setCellValue("E$i", $arr_option_job[$item['job_title_id']] ?? "");
			$sheet->setCellValue("F$i", empty($item['join_date']) || $item['join_date'] == '0000-00-00' ? "" : date("d/m/Y", strtotime($item['join_date'])));
			$sheet->setCellValue("G$i", empty($data_contracts['contract_date_end']) || $data_contracts['contract_date_end'] == '0000-00-00' ? "" : date("d/m/Y", strtotime($data_contracts['contract_date_end'])));
			$sheet->setCellValue("H$i", empty($item['last_working_date']) || $item['last_working_date'] == '0000-00-00' ? "" : date("d/m/Y", strtotime($item['last_working_date'])));
			$sheet->setCellValue("I$i", $item['is_salary'] ? "" : "NEED SETUP");
			$sheet->setCellValue("J$i", $currency);
			$sheet->setCellValue("K$i", $item['bank_owner']);
			$sheet->setCellValue("L$i", $item['bank_number']);
			$sheet->setCellValue("M$i", $item['bank_name']);
			$sheet->setCellValue("N$i", $item['bank_address']);
			$sheet->setCellValue("O$i", $item['total_comp']);
			$sheet->setCellValue("P$i", $item['salary']);
			$sheet->setCellValue("Q$i", $item['actual']);
			$sheet->setCellValue("R$i", $item['recurring']);
			$sheet->setCellValue("S$i", $item['one_off']);
			$sheet->setCellValue("T$i", $item['offset']);
			$sheet->setCellValue("U$i", $item['ot']);
			$sheet->setCellValue("V$i", $item['off_cycle']);
			$sheet->setCellValue("W$i", $item['unpaid']);
			$sheet->setCellValue("X$i", $item['deficit']);
		}

		foreach (range('A', 'X') as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*export excel*/
		$writer = new Xlsx($spreadsheet);
		$name = "Payroll.xlsx";
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
		$writer->save('php://output');

		exit;
	}

	public function send_payslip_post()
	{
		$data = $this->request->getPost();
		try {
			\CodeIgniter\Events\Events::trigger('send_payslip', $data['data']);
		} catch (\Exception $e) {
			return $this->failServerError($e->getMessage());
		}

		return $this->respond(ACTION_SUCCESS);
	}

	private function getPayrollDetailCycle($modules, $employee, $data_employee, $currentEmployee, $work_schedule, $arr_overtime, $amount_per_min, $amount_overtime, $date_from, $date_to, $check_max_overtime)
	{
		$payrollsService = \HRM\Modules\Payrolls\Libraries\Payrolls\Config\Services::payrolls();
		//time off
		$arr_time_off = $payrollsService->getTimeOff($modules, $employee, $data_employee, $work_schedule, $date_from, $date_to)['arr_detail'];
		$time_off = round($arr_time_off['total_timeoff'] * 60 * $amount_per_min, 2);
		$data_time_off = [];
		foreach ($arr_time_off['arr_timeoff'] as $item) {
			$timeoff = $item['timeoff'] * 60;
			$data_time_off[] = [
				'time_off' => $timeoff,
				'type' => $item['name'],
				'amount' => round($timeoff * $amount_per_min, 2)
			];
		}

		// attendance - overtime
		$attendance = 0;
		$deficit = 0;
		$overtime = 0;
		$data_overtime = [];
		$data_carry_over_of_overtime = [];
		$data_deficit = [];
		$data_attendance = [];
		$arr_enough_working_hours = [];
		if (!empty($work_schedule)) {
			$resultAttendance = $payrollsService->getAttendance($modules, $employee, $currentEmployee, $work_schedule, $date_from, $date_to, $amount_per_min, $amount_overtime, $arr_overtime, $check_max_overtime)['arr_detail'];
			$attendance = $resultAttendance['attendance'];
			$deficit = $resultAttendance['deficit'];
			$overtime = $resultAttendance['overtime'];
			$data_overtime = $resultAttendance['data_overtime'];
			$data_carry_over_of_overtime = $resultAttendance['data_carry_over_of_overtime'];
			$data_deficit = $resultAttendance['data_deficit'];
			$arr_enough_working_hours[$employee] = $resultAttendance['arr_enough_working_hours'];
		}
		if (!empty($date_from) && !empty($date_to)) {
			$data_attendance[] = [
				'date_from' => $date_from,
				'date_to' => $date_to,
				'attendance' => $attendance
			];
		}

		// recurring
		$arr_recurring = $payrollsService->getRecurring($employee, $date_from, $date_to, $arr_enough_working_hours);
		$recurring = $arr_recurring[$employee]['total_amount'] ?? 0;
		$data_recurring = $arr_recurring[$employee]['data_recurring'] ?? [];

		$out['recurring'] = $recurring;
		$out['data_recurring'] = $data_recurring;
		$out['time_off'] = $time_off;
		$out['data_time_off'] = $data_time_off;
		$out['attendance'] = $attendance;
		$out['deficit'] = $deficit;
		$out['overtime'] = $overtime;
		$out['data_overtime'] = $data_overtime;
		$out['data_carry_over_of_overtime'] = $data_carry_over_of_overtime;
		$out['data_deficit'] = $data_deficit;
		$out['data_attendance'] = $data_attendance;

		return $out;
	}

	private function getPayrollDetail($payroll, $employee, $date_from, $date_to, $closed)
	{
		helper("app_select_option");
		helper("HRM\Modules\Attendances\Helpers\attendance");

		$modules = \Config\Services::modules();
		$total_comp = 0;
		$salary = 0;
		$recurring = 0;
		$data_recurring = [];
		$one_off = 0;
		$data_one_off = [];
		$count_one_off = 0;
		$offset = 0;
		$data_offset = [];
		$overtime = 0;
		$data_overtime = [];
		$time_off = 0;
		$data_time_off = [];
		$deficit = 0;
		$data_deficit = [];
		$attendance = 0;
		$data_attendance = [];
		$dependents = 0;
		$data_dependents = [];
		$data_carry_over_of_overtime = [];
		$id_payroll_detail = '';
		$data_employee = [];
		$data_contracts = [];
		$off_cycle = 0;
		$data_off_cycle = [];
		
		if ($closed == 0) {
			$modules->setModule("pay_cycles");
			$model = $modules->model;
			$setting = $model->asArray()->first();
			$setting = handleDataBeforeReturn($modules, $setting);

			$modules->setModule("employees");
			$employeeModel = $modules->model;
			$currentEmployee = $employeeModel->select("id, status, job_title_id, join_date, last_working_date, bank_owner, bank_number, bank_name, bank_address, work_schedule, office, username, employee_type")->asArray()->find($employee);
			$data_employee = handleDataBeforeReturn($modules, $currentEmployee);

			$modules->setModule("contracts");
			$contractModel = $modules->model;
			$data_contracts = $contractModel->where('employee', $employee)->where("active", 1)->select("contract_date_end")->asArray()->first();
			$data_contracts = handleDataBeforeReturn($modules, $data_contracts);

			$payrollsService = \HRM\Modules\Payrolls\Libraries\Payrolls\Config\Services::payrolls();

			// date off cycle
			$result_getOffCycle = $payrollsService->getDateOffCycle($modules, $payroll, $date_from, $date_to, $setting);
			$date_from_cycle = $result_getOffCycle['date_from_cycle'];
			$date_to_cycle = $result_getOffCycle['date_to_cycle'];
			$date_from_offset = $result_getOffCycle['date_from_offset'];
			$date_to_offset = $result_getOffCycle['date_to_offset'];

			// payroll_details
			$resultOneOff = $payrollsService->getOneOff($modules, $payroll, $employee)['arr_detail'];
			$id_payroll_detail = $resultOneOff['id_payroll_detail'] ?? '';
			$one_off = $resultOneOff['one_off'] ?? 0;
			$data_one_off = $resultOneOff['data_one_off'] ?? [];
			$count_one_off = $resultOneOff['count_one_off'] ?? 0;
			$arr_overtime = $resultOneOff['arr_overtime'] ?? [];
			$arr_off_cycle_overtime = $resultOneOff['arr_off_cycle_overtime'] ?? [];
			$arr_offset_overtime = $resultOneOff['arr_offset_overtime'] ?? [];

			// one-off
			if (empty($data_one_off)) $data_one_off = [];

			// work schedule
			$workScheduleModel = new WorkScheduleModel();
			$work_schedule = [];
			if (!empty($data_employee['work_schedule'])) {
				$work_schedule = $workScheduleModel->findFormat($data_employee['work_schedule']['value']);
			}

			// salary
			$resultSalary = $payrollsService->getSalary($modules, $date_from, $date_to, $employee, $data_employee, $date_from_cycle, $date_to_cycle, $date_from_offset, $date_to_offset, $work_schedule, $setting)['arr_detail'];
			$salary = $resultSalary['salary'];
			$amount_per_min = $amount_overtime = $resultSalary['amount_per_min'];
			$amount_per_min_offset = $amount_overtime_offset = $resultSalary['amount_per_min_offset'];
			$amount_per_min_off_cycle = $amount_overtime_off_cycle = $resultSalary['amount_per_min_off_cycle'];

			// dependents
			$modules->setModule("dependents");
			$dependentsModel = $modules->model;
			$data_dependents = $dependentsModel->where('employee', $employee)->select("fullname, phone, relationship, dob")->findAll();
			$data_dependents = handleDataBeforeReturn($modules, $data_dependents, true);
			$dependents = count($data_dependents);

			// cycle
			$resultPayrollDetailCycle = $this->getPayrollDetailCycle($modules, $employee, $data_employee, $currentEmployee, $work_schedule, $arr_overtime, $amount_per_min, $amount_overtime, $date_from, $date_to, true);
			$recurring = $resultPayrollDetailCycle['recurring'];
			$data_recurring = $resultPayrollDetailCycle['data_recurring'];
			$time_off = $resultPayrollDetailCycle['time_off'];
			$data_time_off = $resultPayrollDetailCycle['data_time_off'];
			$attendance = $resultPayrollDetailCycle['attendance'];
			$deficit = $resultPayrollDetailCycle['deficit'];
			$overtime = $resultPayrollDetailCycle['overtime'];
			$data_overtime = $resultPayrollDetailCycle['data_overtime'];
			$data_carry_over_of_overtime = $resultPayrollDetailCycle['data_carry_over_of_overtime'];
			$data_deficit = $resultPayrollDetailCycle['data_deficit'];
			$data_attendance = $resultPayrollDetailCycle['data_attendance'];

			// off cycle
			if (!empty($date_from_cycle) && !empty($date_to_cycle)) {
				$resultPayrollDetailCycle_off = $this->getPayrollDetailCycle($modules, $employee, $data_employee, $currentEmployee, $work_schedule, $arr_off_cycle_overtime, $amount_per_min_off_cycle, $amount_overtime_off_cycle, $date_from_cycle, $date_to_cycle, false);
				$off_cycle = $resultPayrollDetailCycle_off['recurring'] + $resultPayrollDetailCycle_off['overtime'] - $resultPayrollDetailCycle_off['time_off'] - $resultPayrollDetailCycle_off['deficit'];
				foreach ($resultPayrollDetailCycle_off['data_recurring'] as $item) {
					$data_off_cycle[] = [
						1 => $item['recurring'],
						2 => 'recurring',
						3 => $item['amount'],
						'type' => 'recurring'
					];
				}
				foreach ($resultPayrollDetailCycle_off['data_attendance'] as $item) {
					$data_off_cycle[] = [
						1 => [$item['date_from'], $item['date_to']],
						2 => 'attendance',
						3 => $item['attendance'],
						'type' => 'attendance'
					];
				}
				foreach ($resultPayrollDetailCycle_off['data_deficit'] as $item) {
					$data_off_cycle[] = [
						1 => $item['deficit'],
						2 => 'deficit',
						3 => $item['amount'],
						'type' => 'deficit'
					];
				}
				foreach ($resultPayrollDetailCycle_off['data_time_off'] as $item) {
					$data_off_cycle[] = [
						1 => $item['time_off'],
						2 => ['time_off', $item['type']],
						3 => $item['amount'],
						'type' => 'time_off'
					];
				}
				foreach ($resultPayrollDetailCycle_off['data_overtime'] as $item) {
					$data_off_cycle[] = [
						1 => $item['overtime'],
						2 => ['overtime', $item['type']],
						3 => $item['amount'],
						'type' => 'overtime'
					];
				}
			}

			// offset
			if (!empty($date_from_offset) && !empty($date_to_offset)) {
				$resultPayrollDetailCycle_offset = $this->getPayrollDetailCycle($modules, $employee, $data_employee, $currentEmployee, $work_schedule, $arr_offset_overtime, $amount_per_min_offset, $amount_overtime_offset, $date_from_offset, $date_to_offset, false);
				$offset = $resultPayrollDetailCycle_offset['recurring'] + $resultPayrollDetailCycle_offset['overtime'] - $resultPayrollDetailCycle_offset['time_off'] - $resultPayrollDetailCycle_offset['deficit'];
				foreach ($resultPayrollDetailCycle_offset['data_recurring'] as $item) {
					$data_offset[] = [
						1 => $item['recurring'],
						2 => 'recurring',
						3 => $item['amount'],
						'type' => 'recurring'
					];
				}
				foreach ($resultPayrollDetailCycle_offset['data_attendance'] as $item) {
					$data_offset[] = [
						1 => [$item['date_from'], $item['date_to']],
						2 => 'attendance',
						3 => $item['attendance'],
						'type' => 'attendance'
					];
				}
				foreach ($resultPayrollDetailCycle_offset['data_deficit'] as $item) {
					$data_offset[] = [
						1 => $item['deficit'],
						2 => 'deficit',
						3 => $item['amount'],
						'type' => 'deficit'
					];
				}
				foreach ($resultPayrollDetailCycle_offset['data_time_off'] as $item) {
					$data_offset[] = [
						1 => $item['time_off'],
						2 => ['time_off', $item['type']],
						3 => $item['amount'],
						'type' => 'time_off'
					];
				}
				foreach ($resultPayrollDetailCycle_offset['data_overtime'] as $item) {
					$data_offset[] = [
						1 => $item['overtime'],
						2 => ['overtime', $item['type']],
						3 => $item['amount'],
						'type' => 'overtime'
					];
				}
				// offset previous overtime
				$resultOffsetPreviousOvertime = $payrollsService->getOffsetCarryOverOfOvertime($modules, $payroll, $employee, $amount_overtime, $arr_offset_overtime)['arr_detail'];
				$offset += $resultOffsetPreviousOvertime['offset_previous_overtime'];
				foreach ($resultOffsetPreviousOvertime['offset_detail_previous_overtime'] as $item) {
					$data_offset[] = $item;
				}
			}

			$total_comp = $salary - $time_off - $deficit + $recurring + $one_off + $offset + $overtime + $off_cycle;
		} else {
			$modules->setModule("payroll_details");
			$model = $modules->model;
			$payrollDetail = $model->where("payroll", $payroll)->where("employee", $employee)->asArray()->first();
			if ($payrollDetail) {
				$id_payroll_detail = $payrollDetail['id'];
				$total_comp = $payrollDetail['total_comp'] * 1;
				$salary = $payrollDetail['salary'] * 1;
				$recurring = $payrollDetail['recurring'] * 1;
				$one_off = $payrollDetail['one_off'] * 1;
				$offset = $payrollDetail['offset'] * 1;
				$off_cycle = $payrollDetail['off_cycle'] * 1;
				$time_off = $payrollDetail['unpaid'] * 1;
				$overtime = $payrollDetail['ot'] * 1;
				$deficit = $payrollDetail['deficit'] * 1;
				$attendance = $payrollDetail['attendance'] * 1;
				$dependents = $payrollDetail['dependents'] * 1;

				$data_employee = json_decode($payrollDetail['data_employee'], true);
				$data_contracts = json_decode($payrollDetail['data_contracts'], true);
				$data_recurring = json_decode($payrollDetail['detail_recurring'], true);
				$data_one_off = json_decode($payrollDetail['detail_one_off'], true);
				$data_offset = json_decode($payrollDetail['detail_offset'], true);
				$data_off_cycle = json_decode($payrollDetail['detail_off_cycle'], true);
				$data_time_off = json_decode($payrollDetail['detail_time_off'], true);
				$data_overtime_db = json_decode($payrollDetail['detail_overtime'], true);
				foreach ($data_overtime_db as $item_overtime) {
					$data_overtime[] = [
						'type' => $item_overtime[2],
						'overtime' => $item_overtime[1],
						'amount' => $item_overtime[3],
					];
				}
				$data_deficit = json_decode($payrollDetail['detail_deficit'], true);
				$data_attendance = json_decode($payrollDetail['detail_attendance'], true);
				$data_dependents = json_decode($payrollDetail['detail_dependents'], true);
				$data_carry_over_of_overtime = json_decode($payrollDetail['detail_carry_over_of_overtime'], true);
			}
		}

		$out['id_payroll_detail'] = $id_payroll_detail;
		$out['data_employee'] = $data_employee;
		$out['data_contracts'] = $data_contracts;
		$out['total_comp'] = $total_comp;
		$out['salary'] = $salary;
		$out['recurring'] = $recurring;
		$out['data_recurring'] = $data_recurring;
		$out['one_off'] = $one_off;
		$out['data_one_off'] = $data_one_off;
		$out['count_one_off'] = $count_one_off;
		$out['offset'] = $offset;
		$out['data_offset'] = $data_offset;
		$out['time_off'] = $time_off;
		$out['data_time_off'] = $data_time_off;
		$out['overtime'] = $overtime;
		$out['data_overtime'] = $data_overtime;
		$out['deficit'] = $deficit;
		$out['data_deficit'] = $data_deficit;
		$out['attendance'] = $attendance;
		$out['data_attendance'] = $data_attendance;
		$out['dependents'] = $dependents;
		$out['data_dependents'] = $data_dependents;
		$out['data_carry_over_of_overtime'] = $data_carry_over_of_overtime;
		$out['off_cycle'] = $off_cycle;
		$out['data_off_cycle'] = $data_off_cycle;

		return $out;
	}

	private function is_decimal($number): bool
	{
		return floor($number) != $number;
	}
}
