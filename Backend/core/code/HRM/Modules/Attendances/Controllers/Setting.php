<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : attendance
* Controller name : Attendance
* Time created : 24/05/2022 15:55:37
*/

namespace HRM\Modules\Attendances\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Attendances\Models\AttendanceDetailModel;
use HRM\Modules\Attendances\Models\AttendancesModel;
use HRM\Modules\Attendances\Models\AttendanceSettingModel;
use HRM\Modules\Employees\Models\EmployeesModel;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use Tatter\Settings\Models\SettingModel;

class Setting extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function info_attendance_get($id)
	{
		$modules = \Config\Services::modules('attendance_setting');
		$model = $modules->model;
		$checkInfo = $model->where('offices', $id)->first();
		$data = [];
		if (!$checkInfo) {
			$checkInfo['webapp'] = 0;
			$checkInfo['geofencing'] = 0;
			$checkInfo['clock_outside'] = 0;
		} else {
			$data = handleDataBeforeReturn($modules, $checkInfo);
			$data->google_places = json_decode($data->google_places, true);
		}
		return $this->respond($data);
	}

	public function info_general_get()
	{
		// preference
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$modules->setModule('employees');
		$model = $modules->model;
		$employees = $model->where('status', getOptionValue('employees', 'status', 'active'))->findAll();
		$arrEmployees = [];
		foreach ($employees as $val) :
			$arrEmployees[] = array(
				'value' => $val->id,
				'full_name' => $val->full_name,
				'email' => $val->email,
				'label' => $val->full_name . ' - ' . $val->email,
			);
		endforeach;
		$arrIDPersonCharge = json_decode(preference('attendance_person_in_charge'), true);
		$modules->setModule('users');
		$modelUser = $modules->model;
		$personCharge = $modelUser->whereIn('id', $arrIDPersonCharge)->findAll();
		$arrPersonCharge = [];

		foreach ($personCharge as $val) :
			$arrPersonCharge[] = array(
				'value' => $val->id,
				'full_name' => $val->full_name,
				'email' => $val->email,
				'label' => $val->full_name . ' @' . $val->username,
				'avatar' => $val->avatar,
				'username' => $val->username,
			);
		endforeach;
		$info['person_charge'] = $arrPersonCharge;
		$info['employees'] = $arrEmployees;
		$info['attendance_approval_cycle'] = preference('attendance_approval_cycle');
		$info['attendance_approval_cycle_num'] = preference('attendance_approval_cycle_num');
		$info['attendance_managers_notifications_day'] = preference('attendance_managers_notifications_day');
		$info['attendance_start_date'] = preference('attendance_start_date');
		$info['attendance_repeat_on'] = preference('attendance_repeat_on');
		$info['attendance_allow_overtime'] = preference('attendance_allow_overtime');
		$info['attendance_auto_mail_notification'] = preference('attendance_auto_mail_notification');
		return $this->respond($info);
	}

	public function general_save_post()
	{
		$getPost = $this->request->getPost();

		if (isset($getPost['data']['attendance_approval_cycle'])) {
			preference('attendance_approval_cycle', $getPost['data']['attendance_approval_cycle'], true);
		}
		if (isset($getPost['data']['attendance_approval_cycle_num'])) {
			preference('attendance_approval_cycle_num', $getPost['data']['attendance_approval_cycle_num'], true);
		}
		if (isset($getPost['data']['attendance_person_in_charge']) && count($getPost['data']['attendance_person_in_charge']) > 0) {
			preference('attendance_person_in_charge', json_encode($getPost['data']['attendance_person_in_charge']), true);
		}
		if (isset($getPost['data']['attendance_start_date'])) {
			preference('attendance_start_date', $getPost['data']['attendance_start_date'], true);
		}
		if (isset($getPost['data']['repeat_on']) && count($getPost['data']['repeat_on']) > 0) {
			preference('attendance_repeat_on', json_encode($getPost['data']['repeat_on']), true);
		}
		if (isset($getPost['data']['attendance_allow_overtime'])) {
			preference('attendance_allow_overtime', $getPost['data']['attendance_allow_overtime'], true);
		}
		if (isset($getPost['data']['attendance_auto_mail_notification'])) {
			preference('attendance_auto_mail_notification', $getPost['data']['attendance_auto_mail_notification'], true);
		}
		return $this->respond('action_success');
	}

	public function loadData_get()
	{
		$modules = \Config\Services::modules('offices');
		$model = $modules->model;
		$listOffices = $model->select('*,offices.id as offices_id')->join('m_attendance_setting', 'offices.id = m_attendance_setting.offices', 'left')->where('is_active', 1)->findAll();
		$modules->setModule('attendance_setting');
		$data = handleDataBeforeReturn($modules, $listOffices, true);
		return $this->respond($data);
	}

	public function time_machine_get()
	{
		$dataGet = $this->request->getGet();
		$modules = \Config\Services::modules();
		// ID Attendance
		$modelAttendance = new AttendancesModel();
		$infoAttendance = $modelAttendance->first();
		$idAttendance = $infoAttendance['id'];

		$modelAttendanceSetting = new AttendanceSettingModel();
		$listOffices = $modelAttendanceSetting->asArray()->findAll();
		$infoOffices = '';
		foreach ($listOffices as $val) {
			$arrID = json_decode($val['id_devices'], true);
			$found_key = array_search($dataGet['SN'], array_column($arrID, 'value'));
			if ($found_key == '') {
				continue;
			}
			$infoOffices = $val;
		}
		$idOffices = 0;
		if ($infoOffices) $idOffices = $infoOffices['offices'];
		if (!$idOffices) return;
		$datag = json_encode($dataGet);

		$postdata = file_get_contents("php://input");

		// ALL LOG
		$allLog = json_decode(file_get_contents(WRITEPATH . "uploads/all_time_machine_log.json"), true);
		array_push($allLog, $datag);
		$newLog = json_encode($allLog);
		// END SAVE ALL LOG
		file_put_contents(WRITEPATH . "uploads/all_time_machine_log.json", $newLog);
		if (isset($dataGet['option']) and $dataGet['option'] == 'all') {
?>
			GET OPTION FROM: <?php echo $dataGet['SN']; ?>
			Stamp=9999
			OpStamp=9999
			ErrorDelay=60
			Delay=30
			TransTimes=00:00;14:05
			TransInterval=1
			TransFlag=111111111111
			Realtime=1
			TimeZone=7
			ADMSSyncTime=0
			<?php
			exit;
		}
		if (isset($_GET['table']) and $_GET['table'] == 'ATTLOG') {

			helper('app_select_option');
			$model = new EmployeesModel();
			$listDatapost = explode('<br />', nl2br($postdata));

			$arrJson = [];
			foreach ($listDatapost as $eachdata) {
				//$postdata = '1	2021-07-23 08:00:25	0	1		0	0	';
				$data = explode('	', $eachdata);

				if (!$data[0]) continue;
				$id = $data[0];
				$giocham = explode(' ', $data[1])[1];
				$ngayChamCong = explode(' ', $data[1])[0];
				$arrJson[] = ['id' => $id * 1, 'time' => $ngayChamCong . ' ' . $giocham];
				// get Employee
				$infoEmployees = $model->asArray()->where('id_time_machine', $id)->first();
				if (!$infoEmployees) continue;
				$idWorkSchedule = $infoEmployees['work_schedule'];
				$modelWorkSchedule = new WorkScheduleModel();
				$infoWorkSchedule = $modelWorkSchedule->findFormat($idWorkSchedule);
				$dateCheck = $ngayChamCong;
				// Check Detail attendance
				$attendance_detailsModel = new AttendanceDetailModel();
				$existAttendance = $attendance_detailsModel->asArray()->where('employee', $infoEmployees['id'])->where('date', $dateCheck)->first();
				$attendance_detail = 0;
				if ($existAttendance) $attendance_detail = $existAttendance['id'];
				// START
				$numOfWeek = date("w", strtotime($dateCheck));
				$workSchedule = $infoWorkSchedule['day'][$numOfWeek];
				$dataInsert['office_id'] = $idOffices;
				$dataInsert['employee'] = $infoEmployees['id'];
				$dataInsert['work_schedule_today'] = $workSchedule;
				$dataInsert['clockDay'] = $ngayChamCong;
				$dataInsert['clockTime'] = $ngayChamCong . ' ' . $giocham;
				$dataInsert['attendance_detail'] = $attendance_detail;
				$dataInsert['clock_location_type'] = 571;
				$dataInsert['clock_location'] = 'In Time Machine';
				$dataInsert['clock_in_location_type'] = getOptionValue('attendance_details', 'clock_in_location_type', 'inside');
				$dataInsert['clock_out_location_type'] = getOptionValue('attendance_details', 'clock_out_location_type', 'inside');
				$dataInsert['attendance_id'] = $idAttendance;
				$dataInsert['note'] = 'From time machine';
				$dataInsert['type'] = getOptionValue('attendance_logs', 'type', 'attendance');
				$dataInsert['users_id'] = $infoEmployees['users_id'];
				$insertMachine = $this->insertTimeMachine($dataInsert);
			}
			$oldLog = json_decode(file_get_contents(WRITEPATH . "uploads/time_machine_log.json"), true);
			$allLog = json_encode(array_merge($oldLog, $arrJson));
			file_put_contents(WRITEPATH . "uploads/time_machine_log.json", $allLog);
			?>Ok
<?php
			exit;
		}
	}

	private function employeeByIdTimeMachine($idTimeMachine)
	{
		$modules = \Config\Services::modules('employees');
		$model = $modules->model;
		$info = $model->asArray()->where('id_time_machine', $idTimeMachine)->first();

		return $info;
	}

	private function insertTimeMachine($data)
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$validation = \Config\Services::validation();
		$postData = $data;
		$officeId = $postData['office_id'];
		unset($postData['office_id']);
		$workScheduleToday = $postData['work_schedule_today'];
		unset($postData['work_schedule_today']);
		$userId = $postData['users_id'];
		unset($postData['users_id']);

		$clock_type = getOptionValue('attendance_logs', 'clock_type', 'clockout');
		if ($postData['attendance_detail'] == 0) {
			$additionalData = $postData['clockDay'];
			$additionalData['work_schedule_today'] = json_encode($workScheduleToday);
			$postData['attendance_detail'] = $this->_handleInsertNewAttendanceToday($modules, $postData['attendance_id'], $userId, $additionalData);
			$clock_type = getOptionValue('attendance_logs', 'clock_type', 'clockin');
		}

		if (empty($postData['attendance_detail'])) {
			return $this->fail(FAILED_SAVE);
		}

		$postData['clock_type'] = $clock_type;
		$clockDay = $postData['clockDay'];
		$clockTime = $postData['clockTime'];
		//update attendance detail
		$UPDATE = $this->updateAttendanceDetail($officeId, $clockDay, $clockTime, $postData, $userId, $workScheduleToday);

		return $this->respond(ACTION_SUCCESS);
	}

	private function updateAttendanceDetail($officeId, $clockDay, $clockTime, $postData, $userId, $workScheduleToday)
	{

		$modules = \Config\Services::modules();
		$modules->setModule('time_off_holidays');
		$model = $modules->model;
		$infoHolidayToDay = $model->asArray()
			->where('office_id', $officeId)
			->where('from_date <=', $clockDay)
			->where('to_date >=', $clockDay)
			->first();

		// get time off
		$modules->setModule('time_off_requests');
		$model = $modules->model;
		$infoTimeOffToDay = $model->asArray()
			->where('created_by', $userId)
			->where('status', getOptionValue('time_off_requests', 'status', 'approved'))
			->where('date_from <= ', $clockDay)
			->where('date_to >= ', $clockDay)
			->first();

		$modules->setModule('attendance_details');
		$model = $modules->model;
		$infoAttendanceDetail = $model->asArray()->find($postData['attendance_detail']);

		//calculate paid time, overtime
		[$loggedTime, $paidTime, $overtime] = $this->_calculatePaidTimeAndOvertime($infoAttendanceDetail, $workScheduleToday, $infoTimeOffToDay, $infoHolidayToDay, $postData, $clockTime);

		$dataUpdateAttendanceDetail = [
			'id' => $postData['attendance_detail'],
			'logged_time' => $loggedTime,
			'paid_time' => $paidTime,
			'overtime' => $overtime
		];
		if ($postData['clock_type'] == getOptionValue("attendance_logs", "clock_type", "clockin")) {
			if (empty($infoAttendanceDetail['clock_in'])) {
				$dataUpdateAttendanceDetail['clock_in'] = $clockTime;
				$dataUpdateAttendanceDetail['clock_in_location'] = $postData['clock_location'];
				$dataUpdateAttendanceDetail['clock_in_location_type'] = $this->_convertLocationTypeClockIn($postData['clock_location_type']);
			}
			$dataUpdateAttendanceDetail['is_clock_in_attendance'] = true;
			$dataUpdateAttendanceDetail['last_clock_in'] = $clockTime;
		} else {
			$dataUpdateAttendanceDetail['clock_out_location'] = $postData['clock_location'];
			$dataUpdateAttendanceDetail['clock_out_location_type'] = $this->_convertLocationTypeClockOut($postData['clock_location_type']);
			$dataUpdateAttendanceDetail['clock_out'] = $clockTime;
			$dataUpdateAttendanceDetail['is_clock_in_attendance'] = false;
		}

		$dataHandleAttendanceDetail = handleDataBeforeSave($modules, $dataUpdateAttendanceDetail);
		$model->setAllowedFields(array_keys($dataUpdateAttendanceDetail));
		try {
			$model->save($dataHandleAttendanceDetail['data']);
			\CodeIgniter\Events\Events::trigger('attendance_on_update_total_log', intval($postData['attendance_detail']));
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
	}

	private function _calculatePaidTimeAndOvertime($infoAttendanceDetail, $workScheduleToday, $infoTimeOffToDay, $infoHolidayToDay, $postData, $clockTime)
	{
		helper('app_select_option');
		$loggedTime = $infoAttendanceDetail['logged_time'];
		$paidTime = $paidTimeTemp = $infoAttendanceDetail['paid_time'];
		$overtime = $infoAttendanceDetail['overtime'];

		$clockType = $postData['clock_type'];
		$clockInOption = getOptionValue('attendance_logs', 'clock_type', 'clockin');
		$clockOutOption = getOptionValue('attendance_logs', 'clock_type', 'clockout');
		$timeFrom = date('Y-m-d') . ' ' . $workScheduleToday['time_from'] . ':00';
		$timeTo = date('Y-m-d') . ' ' . $workScheduleToday['time_to'] . ':00';
		$endTime = $infoAttendanceDetail['date'] . ' 23:59:59';
		if ($clockType === $clockOutOption) {
			if ($workScheduleToday['working_day'] && !$infoHolidayToDay) {
				$breakTimeFrom = '';
				$breakTimeTo = '';
				if ($workScheduleToday['break_time']) {
					$breakTimeFrom = date('Y-m-d') . ' ' . $workScheduleToday['br_time_from'] . ':00';
					$breakTimeTo = date('Y-m-d') . ' ' . $workScheduleToday['br_time_to'] . ':00';
				}

				$clockIn = $clockInPaid = $clockInOT = $infoAttendanceDetail['last_clock_in'];
				$clockOut = $clockOutPaid = $clockOutOT = $clockTime;

				if (strtotime($clockIn) > strtotime($endTime) || strtotime($clockOut) > strtotime($endTime)) {
					return [$loggedTime, $paidTime, $overtime];
				}

				$totalWorkTime = $workScheduleToday['total'];
				if ($infoTimeOffToDay) {
					$totalDayTimeOff = $infoTimeOffToDay['total_day'] > 1 ? 1 : $infoTimeOffToDay['total_day'];
					$totalWorkTime = $totalWorkTime - ($totalWorkTime * $totalDayTimeOff);
				}
				$totalWorkTimeSeconds = $totalWorkTime * 3600;

				// logged time = time log - break time
				if (($breakTimeFrom != '' && $breakTimeTo != '')
					&& strtotime($clockIn) >= strtotime($breakTimeFrom)
					&& strtotime($clockIn) <= strtotime($breakTimeTo)
				) {
					$clockIn = $clockInPaid = $breakTimeTo;
				}

				if (($breakTimeFrom != '' && $breakTimeTo != '')
					&& strtotime($clockOut) >= strtotime($breakTimeFrom)
					&& strtotime($clockOut) <= strtotime($breakTimeTo)
				) {
					$clockOut = $clockOutPaid = $breakTimeFrom;
				}

				if (strtotime($clockOut) < strtotime($clockIn)) {
					return [$loggedTime, $paidTime, $overtime];
				}
				$loggedTime += strtotime($clockOut) - strtotime($clockIn);

				// paid time = $timeFrom < logged time < $timeTo
				if (strtotime($clockInPaid) <= strtotime($timeTo) && strtotime($clockOutPaid) <= strtotime($timeTo)) {
					if (strtotime($clockInPaid) <= strtotime($timeFrom)) {
						$clockInPaid = $timeFrom;
					}

					$paidTimeTemp += strtotime($clockOutPaid) - strtotime($clockInPaid);

					if ($paidTimeTemp < $totalWorkTimeSeconds) {
						$paidTime = $paidTimeTemp;
					} else {
						$paidTime = $totalWorkTimeSeconds;
						$overtime += $paidTimeTemp - $totalWorkTimeSeconds;
					}
				}

				if (strtotime($clockInOT) > strtotime($timeTo) && strtotime($clockOutOT) > strtotime($timeTo)) {
					$overtime += strtotime($clockOutOT) - strtotime($clockInOT);
				}
			} else {
				$clockInOT = $infoAttendanceDetail['last_clock_in'];
				$clockOutOT = $clockTime;
				if (strtotime($clockInOT) < strtotime($endTime) && strtotime($clockOutOT) < strtotime($endTime)) {
					$overtime += strtotime($clockInOT) - strtotime($clockInOT);
				}
			}
		} else {
			return [$loggedTime, $paidTime, $overtime];
		}

		return [$loggedTime, $paidTime, $overtime];
	}

	private function _convertLocationTypeClockIn($type)
	{
		helper('app_select_option');
		if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'outside')) {
			return getOptionValue('attendance_details', 'clock_in_location_type', 'outside');
		} else if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'inside')) {
			return getOptionValue('attendance_details', 'clock_in_location_type', 'inside');
		}
		return getOptionValue('attendance_details', 'clock_in_location_type', 'na');
	}

	private function _convertLocationTypeClockOut($type)
	{
		helper('app_select_option');
		if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'outside')) {
			return getOptionValue('attendance_details', 'clock_out_location_type', 'outside');
		} else if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'inside')) {
			return getOptionValue('attendance_details', 'clock_out_location_type', 'inside');
		}
		return getOptionValue('attendance_details', 'clock_out_location_type', 'na');
	}

	private function _handleInsertNewAttendanceToday($modules, $attendanceId, $employeeId, $date, $additionalData = [])
	{
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		return handleInsertNewAttendanceToday($modules, $attendanceId, $employeeId, $additionalData, $date);
	}
}
