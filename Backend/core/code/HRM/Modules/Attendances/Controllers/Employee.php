<?php

namespace HRM\Modules\Attendances\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Employees\Models\EmployeesModel;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Employee extends ErpController
{
	public function get_config_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule("attendances");
		$attendanceModel = $modules->model;
		$data_attendances = $attendanceModel->select("id as value, name as label")->orderBy("id", "desc")->findAll();

		$out['data_attendances'] = $data_attendances;

		return $this->respond($out);
	}

	public function get_table_attendance_get()
	{
		$getPara = $this->request->getGet();
		if (empty($getPara['filter']['attendance'])) {
			$out['data_table'] = [];

			return $out;
		}
		$out = $this->getTableAttendance($getPara);

		return $this->respond($out);
	}

	private function getTableAttendance($getPara, $request_type = '')
	{
		helper("app_select_option");
		$type = $getPara['type'];
		if ($type != 'team' && $type != 'employee') {
			return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		}
		if ($type == 'team') {
			if (!hasModulePermit("attendances", 'accessTeamAttendance')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		}
		if ($type == 'employee') {
			if (!hasModulePermit("attendances", 'accessEmployeeAttendance')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		}

		$page = $getPara['pagination']['current'];
		$length = $getPara['pagination']['pageSize'];
		$start_record = ($page - 1) * $length;
		$end_record = ($start_record - 1) + $length;
		$attendance_get = $getPara['filter']['attendance'];
		$status_get = $getPara['filter']['status'];
		$record_get = $getPara['filter']['record'];
		$searchVal_get = $getPara['searchVal'];

		$datetoday = date('Y-m-d');
		$modules = \Config\Services::modules();
		$modules->setModule("attendances");
		$attendanceModel = $modules->model;
		$data_attendances = $attendanceModel->select('date_from, date_to')->find($attendance_get);
		$date_from = $data_attendances->date_from;
		$date_to = $data_attendances->date_to;
		if ($date_to > $datetoday) {
			$date_to = $datetoday;
		}
		$begin = new \DateTime($date_from);
		$end = new \DateTime($date_to);
		$arr_date = [];
		for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
			$arr_date[] = $i->format("Y-m-d");
		}

		$user_id = user()->id;
		$modules->setModule("employees");
		$employeeModel = new EmployeesModel();
		$employeeModel->exceptResigned();
		$data_employee = [];
		if ($type == 'team') {
			helper('HRM\Modules\Employees\Helpers\employee_helper');
			$data_employee = getEmployeesByRank($user_id, "subordinate", $employeeModel);
			unset($data_employee[$user_id]);
		}
		if ($type == 'employee') {
			$data_employee_db = $employeeModel->asObject()->findAll();
			foreach ($data_employee_db as $item) {
				$key = $item->id;
				$data_employee[$key]['id'] = $item->id;
				$data_employee[$key]['username'] = $item->username;
				$data_employee[$key]['full_name'] = $item->full_name;
				$data_employee[$key]['email'] = $item->email;
				$data_employee[$key]['avatar'] = $item->avatar;
				$data_employee[$key]['work_schedule'] = $item->work_schedule;
				$data_employee[$key]['office'] = $item->office;
				$data_employee[$key]['employee_type'] = $item->employee_type;
			}
		}

		if (!empty($searchVal_get)) {
			foreach ($data_employee as $key => $item) {
				if (strpos(strtolower($item['full_name']), strtolower($searchVal_get)) === false) {
					unset($data_employee[$key]);
				}
			}
		}

		$modules->setModule("employee_types");
		$employeeTypeModel = $modules->model;
		$dataEmployeeType_db = $employeeTypeModel->select("id, name")->asArray()->findAll();
		$arr_employee_type = [];
		foreach ($dataEmployeeType_db as $item) {
			$arr_employee_type[$item['id']] = $item['name'];
		}

		$data_table = [];
		$data_id_work_schedule = [];
		$data_id_office = [];
		foreach ($data_employee as $key => $item) {
			$data_table[$key]['full_name'] = $item['full_name'];
			$data_table[$key]['employee_type'] = $arr_employee_type[$item['employee_type']] ?? "";

			$data_table[$key]['employee']['value'] = $item['id'];
			$data_table[$key]['employee']['label'] = $item['username'];
			$data_table[$key]['employee']['full_name'] = $item['full_name'];
			$data_table[$key]['employee']['email'] = $item['email'];
			$data_table[$key]['employee']['icon'] = $item['avatar'];
			$data_table[$key]['employee']['office'] = $item['office'];

			$data_table[$key]['status']['approved']['count'] = 0;
			$data_table[$key]['status']['approved']['label'] = 'approve';
			$data_table[$key]['status']['pending']['count'] = 0;
			$data_table[$key]['status']['pending']['label'] = 'pending';
			$data_table[$key]['status']['rejected']['count'] = 0;
			$data_table[$key]['status']['rejected']['label'] = 'rejected';
			$data_table[$key]['status']['confirm']['count'] = 0;
			$data_table[$key]['status']['confirm']['label'] = 'confirm';
			$data_table[$key]['status']['total']['count'] = 0;
			$data_table[$key]['status']['total']['label'] = 'total';
			if (!empty($item['work_schedule']) && $item['work_schedule'] != '[]') {
				$data_id_work_schedule[$item['work_schedule']] = $item['work_schedule'];
			}

			if (!empty($item['office'])) {
				$data_id_office[$item['office']] = $item['office'];
			}
		}

		$key_data_rank = array_keys($data_employee);
		$key_data_rank[] = 0;

		// filter holiday / leave
		$data_holiday = [];
		// holiday
		$data_id_office[] = 0;
		$modules->setModule("time_off_holidays");
		$holidayModel = $modules->model;
		$holidayModel->whereIn("office_id", $data_id_office);
		$holidayModel->groupStart();
		$holidayModel->orWhere("(from_date <= '$date_from' and '$date_from' <= to_date)");
		$holidayModel->orWhere("('$date_from' <= from_date  and  to_date <= '$date_to')");
		$holidayModel->orWhere("(from_date <= '$date_to' and '$date_to' <= to_date)");
		$holidayModel->groupEnd();
		$data_holiday_db = $holidayModel->findAll();
		foreach ($data_holiday_db as $item) {
			$begin_holiday = new \DateTime($item->from_date);
			$end_holiday = new \DateTime($item->to_date);
			for ($i = $begin_holiday; $i <= $end_holiday; $i->modify('+1 day')) {
				$data_holiday[$i->format("Y-m-d")] = $i->format("Y-m-d");
			}
		}

		$data_leave = [];
		// leave
		$modules->setModule("time_off_requests");
		$timeOffModel = $modules->model;
		$module = $modules->getModule();
		$timeOffModel->whereIn('owner', $key_data_rank)->where("status", getOptionValue($module, "status", "approved"))->where('is_full_day', 1);
		$timeOffModel->groupStart();
		$timeOffModel->orWhere("(date_from <= '$date_from' and '$date_from' <= date_to)");
		$timeOffModel->orWhere("('$date_from' <= date_from  and  date_to <= '$date_to')");
		$timeOffModel->orWhere("(date_from <= '$date_to' and '$date_to' <= date_to)");
		$timeOffModel->groupEnd();
		$data_time_off_db = $timeOffModel->findAll();
		foreach ($data_time_off_db as $item) {
			$begin_timeoff = new \DateTime($item->date_from);
			$end_timeoff = new \DateTime($item->date_to);
			for ($i = $begin_timeoff; $i <= $end_timeoff; $i->modify('+1 day')) {
				$data_leave[$item->owner][$i->format("Y-m-d")] = $i->format("Y-m-d");
			}
		}

		$workScheduleModel = new WorkScheduleModel();
		$arr_work_schedule = [];
		foreach ($data_id_work_schedule as $id_work_schedule) {
			$work_schedule = $workScheduleModel->findFormat($id_work_schedule);
			if (!empty($work_schedule)) {
				$arr_work_schedule[$id_work_schedule] = $work_schedule['day'];
			}
		}

		foreach ($data_employee as $key => $item) {
			$employee_work_schedule = isset($arr_work_schedule[$item['work_schedule']]) ? $arr_work_schedule[$item['work_schedule']] : [];
			if (!empty($employee_work_schedule)) {
				$time_work = 0;
				foreach ($arr_date as $date) {
					$day = date('w', strtotime($date));
					$work = $employee_work_schedule[$day];
					$working_day = $work['working_day'];
					$total = $work['total'];
					// check false working day
					if ($working_day == true) {
						$time_work += $total * 60;
					}
					$data_table[$key]['date'][$date]['date'] = $date;
					$data_table[$key]['date'][$date]['working_day'] = $working_day;
				}

				$data_table[$key]['time_work'] = $time_work;
			}
		}

		$modules->setModule("attendance_details");
		$attendanceDetailModel = $modules->model;
		$module = $modules->getModule();
		$option_value = getAppSelectOptions($module);
		$option_value_status = $option_value['status'];
		$arr_option_status_value_name = [];
		foreach ($option_value_status as $item) {
			$arr_option_status_value_name[$item['value']] = $item['name_option'];
		}
		$data_attendance_details = $attendanceDetailModel->where('attendance', $attendance_get)
			->whereIn('employee', $key_data_rank)
			->where("date >= '$date_from'")
			->where("date <= '$date_to'")
			->select("employee, date, status, paid_time, overtime, clock_in, clock_out, is_edit_paid_time, is_edit_overtime, confirm")->findAll();

		foreach ($data_attendance_details as $item) {
			$employee = $item->employee;
			$date = $item->date;
			$status = isset($arr_option_status_value_name[$item->status]) ? $arr_option_status_value_name[$item->status] : "";
			$paid_time = $item->paid_time / 60;
			$overtime = $item->overtime / 60;

			if (empty($data_table[$employee]['paid_time'])) $data_table[$employee]['paid_time'] = 0;
			$data_table[$employee]['paid_time'] += $paid_time;
			if (empty($data_table[$employee]['overtime'])) $data_table[$employee]['overtime'] = 0;
			$data_table[$employee]['overtime'] += $overtime;

			if (empty($data_table[$employee]['status'][$status]['count'])) $data_table[$employee]['status'][$status]['count'] = 0;
			$data_table[$employee]['status'][$status]['count']++;
			$data_table[$employee]['status'][$status]['label'] = $status;

			if ($item->confirm == 1) {
				$data_table[$employee]['status']['confirm']['count']++;
			}

			if ($item->status == getOptionValue($module, "status", "approved") || $item->status == getOptionValue($module, "status", "rejected")) {
				$data_table[$employee]['status']['total']['count']++;
			}

			if (empty($data_table[$employee]['date'][$date]['paid_time'])) $data_table[$employee]['date'][$date]['paid_time'] = 0;
			$data_table[$employee]['date'][$date]['paid_time'] += $paid_time;
			$data_table[$employee]['date'][$date]['status'] = $status;

			if (empty($item->clock_in) || empty($item->clock_out)) {
				$data_table[$employee]['missing_clock'] = 1;
			}

			if ($item->is_edit_paid_time == 1) {
				$data_table[$employee]['edit_paid_time'] = 1;
			}

			if ($item->is_edit_overtime == 1) {
				$data_table[$employee]['edit_ot'] = 1;
			}

			// check holiday/leave/working day
			// check false working day
			if (isset($data_table[$employee]['date'][$date]['working_day']) && $data_table[$employee]['date'][$date]['working_day'] == false && $data_table[$employee]['date'][$date]['paid_time'] > 0) {
				$data_table[$employee]['clocking'] = 1;
			}
			if (isset($data_holiday[$date]) && $data_table[$employee]['date'][$date]['paid_time'] > 0) {
				$data_table[$employee]['date'][$date]['holiday'] = true;
				$data_table[$employee]['clocking'] = 1;
			}
			if (isset($data_leave[$employee][$date]) && $data_table[$employee]['date'][$date]['paid_time'] > 0) {
				$data_table[$employee]['date'][$date]['leave'] = true;
				$data_table[$employee]['clocking'] = 1;
			}
		}

		if ($status_get != 'all_status' || $record_get != 'all_records') {
			foreach ($data_table as $key => $item) {
				if ($status_get != 'all_status') {
					if (!isset($item['status'][$arr_option_status_value_name[$status_get]]) || $item['status'][$arr_option_status_value_name[$status_get]]['count'] == 0) {
						unset($data_table[$key]);
					}
				}

				if ($record_get != 'all_records') {
					if ($record_get == 'missing_clock') {
						if (!isset($item['missing_clock'])) {
							unset($data_table[$key]);
						}
					}

					if ($record_get == 'edit_paid_time') {
						if (!isset($item['edit_paid_time'])) {
							unset($data_table[$key]);
						}
					}

					if ($record_get == 'edit_ot') {
						if (!isset($item['edit_ot'])) {
							unset($data_table[$key]);
						}
					}

					if ($record_get == 'clocking') {
						if (!isset($item['clocking'])) {
							unset($data_table[$key]);
						}
					}
				}
			}
		}

		$total_record = count($data_table);
		if ($request_type != 'export_excel') {
			$dem = -1;
			foreach ($data_table as $key => $item) {
				$dem++;
				if ($dem < $start_record || $end_record < $dem) {
					unset($data_table[$key]);
				}
			}
		}

		$out['data_table'] = $data_table;
		$out['arr_date'] = $arr_date;
		$out['date_from'] = $date_from;
		$out['date_to'] = $date_to;
		$out['total'] = $total_record;

		return $out;
	}

	private function insertLog($status, $attendance, $employee_id, $arr_date, $note)
	{
		try {
			$modules = \Config\Services::modules();
			$modules->setModule("attendance_details");
			$module = $modules->getModule();
			$attendanceDetailModel = $modules->model;
			if ($status == 'confirmed') {
				$attendanceDetailModel->groupStart();
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "approved"));
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "rejected"));
				$attendanceDetailModel->groupEnd();
			} elseif ($status == 'reverted') {
				$attendanceDetailModel->where("confirm", 0);
				$attendanceDetailModel->groupStart();
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "approved"));
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "rejected"));
				$attendanceDetailModel->groupEnd();
			} else {
				$attendanceDetailModel->where("status", getOptionValue($module, "status", "pending"));
				$attendanceDetailModel->where("confirm", 0);
			}
			$data_update = $attendanceDetailModel->where("attendance", $attendance)
				->whereIn("employee", $employee_id)
				->whereIn("date", $arr_date)
				->select("id, total_log")
				->findAll();

			$db = \Config\Database::connect();
			$builder = $db->table('m_attendance_logs');
			$data = [];
			$data_log_count = [];
			$user_id = user()->id;
			foreach ($data_update as $item) {
				$arr = [
					'attendance_detail' => $item->id,
					'employee' => $user_id,
					'type' => getOptionValue("attendance_logs", "type", $status),
					'clock' => date('Y-m-d H:i:s'),
					'note' => $note,
					'owner' => $user_id,
					'created_by' => $user_id,
					'updated_by' => $user_id,
					'created_at' => date('Y-m-d H:i:s'),
					'updated_at' => date('Y-m-d H:i:s')
				];
				$data[] = $arr;

				$data_log_count[$item->id]['total_log'] = $item->total_log;
			}
			if (!empty($data)) {
				$builder->insertBatch($data);

				$data_update_detail = [];
				foreach ($data_log_count as $detail_id => $item) {
					$arr = [
						'id' => $detail_id,
						'total_log' => $item['total_log'] + 1
					];
					$data_update_detail[] = $arr;
				}
				\CodeIgniter\Events\Events::trigger('attendance_on_update_total_log', $data_update_detail);
			}

			return true;
		} catch (\ReflectionException $e) {
			return false;
		}
	}

	private function updateAttendanceStatus($status, $attendance, $employee_id, $arr_date, $note)
	{
		helper("app_select_option");
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		if (!is_array($employee_id)) $employee_id = [$employee_id];
		if (!is_array($arr_date)) $arr_date = [$arr_date];
		$employee_id = getListEmployeeAttendance($employee_id);
		if (count($employee_id) == 0) {
			return false;
		}

		try {
			$this->insertLog($status, $attendance, $employee_id, $arr_date, $note);
			$modules = \Config\Services::modules();
			$modules->setModule("attendance_details");
			$module = $modules->getModule();
			$attendanceDetailModel = $modules->model;
			$attendanceDetailModel->setAllowedFields(["status", "note", "confirm"]);

			if ($status == 'confirmed') {
				$attendanceDetailModel->set("confirm", 1);
				$attendanceDetailModel->where("confirm", 0);
				$attendanceDetailModel->groupStart();
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "approved"));
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "rejected"));
				$attendanceDetailModel->groupEnd();
			} elseif ($status == 'reverted') {
				$attendanceDetailModel->set("status", getOptionValue($module, "status", "pending"));
				$attendanceDetailModel->where("confirm", 0);
				$attendanceDetailModel->groupStart();
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "approved"));
				$attendanceDetailModel->orWhere("status", getOptionValue($module, "status", "rejected"));
				$attendanceDetailModel->groupEnd();
			} else {
				$attendanceDetailModel->set("status", getOptionValue($module, "status", $status));
				$attendanceDetailModel->where("status", getOptionValue($module, "status", "pending"));
				$attendanceDetailModel->where("confirm", 0);
			}

			$attendanceDetailModel->where("attendance", $attendance)
				->whereIn("employee", $employee_id)
				->whereIn("date", $arr_date)
				->set("note", $note);
			$attendanceDetailModel->update();
		} catch (\ReflectionException $e) {
			return false;
		}

		return true;
	}

	public function post_save_employee_attendance_post()
	{
		$getPara = $this->request->getPost();
		$attendance_id = $getPara['attendance_id'];
		$arr_date = $getPara['arr_date'];
		$action_employee_id = $getPara['action_employee_id'];
		$action_status = $getPara['action_status'];
		$note = $getPara['note'];
		$submit_type = $getPara['submit_type'];
		$checked_employee_id = $getPara['checked_employee_id'];
		$checked_employee_id_approve_reject = $getPara['checked_employee_id_approve_reject'];
		$checked_employee_id_confirm_revert = $getPara['checked_employee_id_confirm_revert'];

		if ($submit_type != 'record' && $submit_type != 'checkbox') {
			return $this->fail(FAILED_SAVE);
		}

		if ($submit_type == 'record') {
			$this->updateAttendanceStatus($action_status, $attendance_id, $action_employee_id, $arr_date, $note);
		}
		if ($submit_type == 'checkbox') {
			if ($action_status == "confirmed" || $action_status == "reverted") {
				$this->updateAttendanceStatus($action_status, $attendance_id, $checked_employee_id_confirm_revert, $arr_date, $note);
			} else {
				$this->updateAttendanceStatus($action_status, $attendance_id, $checked_employee_id_approve_reject, $arr_date, $note);
			}
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function export_excel_get()
	{
		helper("app_select_option");
		$getPara = $this->request->getGet();

		$data = $this->getTableAttendance($getPara, 'export_excel');
		$data_table = $data['data_table'];
		$arr_date = $data['arr_date'];

		/*alphabet A to AZ*/
		$arr_alphabet = [];
		for ($k = -1; $k <= 0; $k++) {
			$alphabet_ = $arr_alphabet[$k] ?? "";
			foreach (range('A', 'Z') as $columnId) {
				$arr_alphabet[] = $alphabet_ . $columnId;
			}
		}

		$spreadsheet = new Spreadsheet();
		$sheet = $spreadsheet->getActiveSheet();

		$styleArray = [
			'fill' => [
				'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
				'startColor' => [
					'argb' => 'A9D08E',
				],
				'endColor' => [
					'argb' => 'A9D08E',
				],
			],
		];

		$i = 1;
		$sheet->setCellValue("A$i", "Emp.Name");
		$sheet->setCellValue("B$i", "Emp.Type");
		$sheet->setCellValue("C$i", "Paid Time / Work Schedule");
		$sheet->setCellValue("D$i", "Overtime");
		$sheet->setCellValue("E$i", "Status");
		$j = 5;
		foreach ($arr_date as $date) {
			$sheet->getStyle("A$i:$arr_alphabet[$j]$i")->applyFromArray($styleArray);
			$sheet->getStyle("$arr_alphabet[$j]$i")->getNumberFormat()->setFormatCode('d-mmm');
			$sheet->getStyle("$arr_alphabet[$j]$i")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
			$sheet->setCellValue("$arr_alphabet[$j]$i", date('d/m/Y', strtotime($date)));
			$j++;
		}

		$i = 2;
		foreach ($data_table as $item) {
			$sheet->setCellValue("A$i", $item['full_name']);
			$sheet->setCellValue("B$i", $item['employee_type']['name_option'] ?? "-");
			$sheet->setCellValue("C$i", $this->minsToStr($item['paid_time'] ?? 0, true) . " / " . $this->minsToStr($item['time_work'] ?? 0, true));
			$sheet->setCellValue("D$i", $this->minsToStr($item['overtime'] ?? 0));
			$sheet->setCellValue("E$i", $this->renderStatus($item['status']));
			$j = 5;
			foreach ($arr_date as $date) {
				$sheet->setCellValue("$arr_alphabet[$j]$i", $this->minsToStr($item['date'][$date]['paid_time'] ?? ""));
				$j++;
			}

			$i++;
		}

		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*export excel*/
		$writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		$writer->save('php://output');

		exit;
	}

	private function minsToStr($min, $empty = false)
	{
		if (empty($min)) {
			if ($empty) {
				return "0h";
			}
			return "-";
		}

		$hour = floor($min / 60);
		$time = floor($min % 60) == 0 ? "" : floor($min % 60);
		$minute = "00" . $time;
		$minute = substr($minute, -2);

		return $hour . "h " . $minute . "m";
	}

	private function renderStatus($status)
	{
		return $status['pending']['count'] . " " . $status['pending']['label'] . " / " . $status['approved']['count'] . " " . $status['approved']['label'] . " / " . $status['rejected']['count'] . " " . $status['rejected']['label'];
	}
}
