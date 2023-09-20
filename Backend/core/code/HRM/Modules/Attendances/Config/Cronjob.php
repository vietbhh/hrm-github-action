<?php

namespace HRM\Modules\Attendances\Config;

use HRM\Modules\Employees\Models\EmployeesModel;

class Cronjob
{
	// ** cronjob send mail notifications the end of the attendance cycle
	public function send_mail_notification_attendance()
	{
		$attendanceAutoMailNotification = filter_var(preference('attendance_auto_mail_notification'), FILTER_VALIDATE_BOOLEAN);
		if (!$attendanceAutoMailNotification) {
			return false;
		}

		$datetoday = date('Y-m-d');
		$attendanceModules = \Config\Services::modules("attendances");
		$attendanceModel = $attendanceModules->model;
		$attendance_db = $attendanceModel->where("'$datetoday' between date_from and date_to")->asArray()->first();
		if ($attendance_db) {
			$date_to = $attendance_db['date_to'];

			// check send all employee
			if (strtotime($datetoday) == strtotime($date_to)) {
				$employeeModel = new EmployeesModel();
				$employeeModel->exceptResigned();
				$data_employee_db = $employeeModel->select("id, full_name, email")->asArray()->findAll();
				\CodeIgniter\Events\Events::trigger('send_mail_notification_employee', $data_employee_db);

				return true;
			}

			// check send manager
			$day_notification = preference("attendance_managers_notifications_day") + 1;
			$date_check = date('Y-m-d', strtotime($date_to . " -$day_notification day"));
			if (strtotime($datetoday) == strtotime($date_check)) {
				$person_in_charge = json_decode(preference("attendance_person_in_charge"), true);
				$employeeModel = new EmployeesModel();
				$data_employee_manager_db = $employeeModel->whereIn("id", $person_in_charge)->select("id, full_name, email")->exceptResigned()->asArray()->findAll();
				\CodeIgniter\Events\Events::trigger('send_mail_notification_manager', $data_employee_manager_db);

				return true;
			}
		}

		return true;
	}

	// ** cronjob add new record to m_attendances if today is not exist in m_attendance (start a new schedule)
	public function create_new_attendance_schedule()
	{
		$attendanceService = \HRM\Modules\Attendances\Libraries\Attendances\Config\Services::attendance();
		$attendanceService->createNewAttendanceSchedule();
	}

	// ** cronjob to recalculate all data in m_attendances
	public function recalculate_attendance()
	{
		$attendanceService = \HRM\Modules\Attendances\Libraries\Attendances\Config\Services::attendance();
		$attendanceService->recalculateAttendance();
	}
}
