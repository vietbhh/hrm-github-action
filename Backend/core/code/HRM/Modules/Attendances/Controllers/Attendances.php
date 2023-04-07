<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : attendance
* Controller name : Attendance
*/

namespace HRM\Modules\Attendances\Controllers;

use App\Controllers\ErpController;
use stdClass;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use DateTime;

class Attendances extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function load_my_attendance_get()
	{
		helper('app_select_option');
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		$modules = \Config\Services::modules();

		$this->_createNewAttendanceToday($modules);

		$employeeId = user_id();

		$modules->setModule('employees');
		$model = $modules->model;
		$currentEmployee = $model->asArray()->find($employeeId);

		//get employee schedule
		$modules->setModule('work_schedules');
		$model = new WorkScheduleModel();
		$arrWorkingDay = $model->findFormat($currentEmployee['work_schedule'])['day'];
		$employeeOffice = $currentEmployee['office'];
		$result['employee_office'] = $employeeOffice;

		//get attendance setting
		$modules->setModule('attendance_setting');
		$model = $modules->model;
		$infoAttendanceSetting = $model->asArray()->where('offices', $employeeOffice)->first();
		if ($infoAttendanceSetting) {
			$result['geofencing'] = $infoAttendanceSetting['geofencing'] == 1 ? true : false;
			$result['clock_outside'] = $infoAttendanceSetting['clock_outside'] == 1 ? true : false;
			$result['radius'] = $infoAttendanceSetting['radius'];
			$result['google_places'] = json_decode($infoAttendanceSetting['google_places'], true);
			$result['webapp'] = $infoAttendanceSetting['webapp'] == 1 ? true : false;
		} else {
			$result['geofencing'] = false;
			$result['clock_outside'] = false;
			$result['radius'] = 0;
			$result['google_places'] = [];
			$result['webapp'] = false;
		}

		//get info attendance
		$modules->setModule('attendances');
		$model = $modules->model;
		$infoAttendance = $model->where("date_from <=", date('Y-m-d'))->where("date_to >=", date('Y-m-d'))->first();
		$result['info_attendance'] = $infoAttendance;

		$modules->setModule('attendance_details');
		$model = $modules->model;
		$infoAttendanceToday = $model->asArray()->where('employee', $employeeId)->where('date', date('Y-m-d'))->first();

		$result['total_time_attendance'] = [
			'hours' => 0,
			'minutes' => 0,
			'seconds' => 0
		];

		$weekDay = date('w', strtotime(date("Y-m-d")));
		$infoWorkingDay = isset($arrWorkingDay[$weekDay]) ? $arrWorkingDay[$weekDay] : [];
		if ($infoAttendanceToday) {
			// get time off and holidays
			$infoHolidayToDay = getHoliday($modules, $employeeOffice, date('Y-m-d'));

			$infoAttendanceToday['work_schedule'] = $infoWorkingDay;
			$result['info_attendance_detail_today'] = handleDataBeforeReturn($modules, $infoAttendanceToday);
			if ($infoHolidayToDay) {
				$totalTime = $infoAttendanceToday['overtime'];
			} else {
				$totalTime = $infoAttendanceToday['logged_time'];
			}
			$isBreakTime = false;
			if (
				$infoWorkingDay['break_time']
				&& (strtotime(date('Y-m-d H:i:s')) >= strtotime(date('Y-m-d ' . $infoWorkingDay['br_time_from'] . ':00')) && strtotime(date('Y-m-d H:i:s')) <= strtotime(date('Y-m-d ' . $infoWorkingDay['br_time_to'] . ':00')))
			) {
				$isBreakTime = true;
			}
			if ($infoAttendanceToday['is_clock_in_attendance'] == true && !empty($infoAttendanceToday['last_clock_in']) && !$isBreakTime) {
				$timeRemain = strtotime(date('Y-m-d H:i:s')) - strtotime($infoAttendanceToday['last_clock_in']);
				$totalTime += $timeRemain;
			}
			$hours = floor($totalTime / 3600);
			$minutes = floor(($totalTime - ($hours * 3600)) / 60);
			$seconds = floor($totalTime - ($hours * 3600) - ($minutes * 60));
			$result['total_time_attendance'] = [
				'hours' => $hours,
				'minutes' => $minutes,
				'seconds' => $seconds
			];
		} else {
			$result['info_attendance_detail_today']['work_schedule'] = $infoWorkingDay;
		}
		$result['attendance_detail_expire_days'] = preference('attendance_detail_expire_days');
		return $this->respond($result);
	}

	public function load_employee_attendance_get()
	{
		helper('app_select_option');
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		$modules = \Config\Services::modules();

		$params = $this->request->getGet();
		$employeeId = !empty($params['employee_id']) ? $params['employee_id'] : user_id();
		$attendanceId = !empty($params['attendance_id']) ? $params['attendance_id'] : '';
		$status = !empty($params['status']) ? $params['status'] : '';
		$location = !empty($params['location']) ? $params['location'] : '';
		$record = !empty($params['records']) ? $params['records'] : '';
		$expireDay = preference('attendance_detail_expire_days');

		$result['list_attendance_detail'] = [];
		$result['total_time'] = [
			'work_schedule' => 0,
			'logged_time' => 0,
			'paid_time' => 0,
			'deficit' => 0,
			'overtime' => 0
		];
		if ($attendanceId === 0) {
			return $this->respond($result);
		}

		$modules->setModule('employees');
		$model = $modules->model;
		$currentEmployee = $model->asArray()->find($employeeId);
		$result['employee_office'] = $currentEmployee['office'];

		$modules->setModule('attendances');
		$model = $modules->model;
		$infoAttendance = $model->asArray()->find($attendanceId);
		if (!$infoAttendance) {
			return $this->failNotFound(NOT_FOUND);
		}
		$fromDateAttendance = $infoAttendance['date_from'];
		$toDateAttendance = (strtotime($infoAttendance['date_to']) > strtotime(date('Y-m-d'))) ?  date('Y-m-d') : $infoAttendance['date_to'];

		$begin = new DateTime($fromDateAttendance);
		$end = new DateTime($toDateAttendance);
		$listAttendanceDetailAll = [];
		for ($i = $end; $i >= $begin; $i->modify('-1 day')) {
			$date = $i->format('Y-m-d');
			$arrayPush['is_expire'] = (((strtotime(date('Y-m-d'))) - strtotime($date)) / (60 * 60 * 24) >= $expireDay) ? true : false;
			$listAttendanceDetailAll[$i->format('Y-m-d')] = $arrayPush;
		}

		//get attendance details
		$modules->setModule('attendance_details');
		$model = $modules->model;
		$builder = $model->asArray()->where('attendance', $attendanceId)
			->where('employee', $employeeId);

		$builder->orderBy('date DESC');
		$list = $builder->findAll();
		$listAttendanceDetail = handleDataBeforeReturn($modules, $list, true);
		foreach ($listAttendanceDetail as $row) {
			$date = date('Y-m-d', strtotime($row['date']));
			if (isset($listAttendanceDetailAll[$date])) {
				$listAttendanceDetailAll[$date] = array_merge($listAttendanceDetailAll[$date], $row);
			}
		}

		//get total time attendance
		$arrFilter = [
			'record' => $record,
			'status' => $status,
			'location' => $location

		];
		$result = getAttendanceDetail($listAttendanceDetailAll, $currentEmployee, $fromDateAttendance, $toDateAttendance, $arrFilter, [], [], [], [], true);
		$result['attendance_allow_overtime'] = preference('attendance_allow_overtime') === "true";
		return $this->respond($result);
	}

	public function add_attendance_log_post()
	{
		helper('app_select_option');
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		$modules = \Config\Services::modules();
		$validation = \Config\Services::validation();

		$postData = $this->request->getPost();
		$isBreakTime = $postData['is_break_time'];
		$officeId =  $postData['office_id'];
		unset($postData['is_break_time']);
		unset($postData['office_id']);
		unset($postData['is_new_attendance_today']);
		$workScheduleToday = $postData['work_schedule_today'];
		unset($postData['work_schedule_today']);

		$userId = user_id();

		// if attendance_detail = 0 => insert new attendance_detail
		if ($postData['attendance_detail'] == 0) {
			$additionalData = [
				'work_schedule_today' => json_encode($workScheduleToday)
			];
			$postData['attendance_detail'] = $this->_handleInsertNewAttendanceToday($modules, $postData['attendance_id'], $userId, $additionalData);
		}

		if (empty($postData['attendance_detail'])) {
			return $this->fail(FAILED_SAVE);
		}

		$modules->setModule('attendance_logs');
		$model = $modules->model;

		$dataHandleAttendanceLog = handleDataBeforeSave($modules, $postData);
		if (!empty($dataHandleAttendanceLog['validate'])) {
			if (!$validation->reset()->setRules($dataHandleAttendanceLog['validate'])->run($dataHandleAttendanceLog['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandleAttendanceLog['fieldsArray']);
		$saveAttendanceLog = $dataHandleAttendanceLog['data'];
		$clockDay = date('Y-m-d');
		$clockTime = date('Y-m-d H:i:s');
		$saveAttendanceLog['clock'] = $clockTime;
		$saveAttendanceLog['employee'] = $userId;
		try {
			$model->save($saveAttendanceLog);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
		$id = $model->getInsertID();

		//update attendance detail
		$infoHolidayToDay = getHoliday($modules, $officeId, $clockDay);

		// get time off
		$infoTimeOffToDay = getTimeOff($modules, $userId, $clockDay);

		$modules->setModule('attendance_details');
		$model = $modules->model;
		$infoAttendanceDetail = $model->asArray()->find($postData['attendance_detail']);

		//calculate paid time, overtime
		[$loggedTime, $paidTime, $overtime] = calculateTimeAttendance($infoAttendanceDetail, $workScheduleToday, $infoTimeOffToDay, $infoHolidayToDay, $postData, $clockTime);

		$dataUpdateAttendanceDetail = [
			'id' => $postData['attendance_detail'],
			'logged_time' => $loggedTime,
			'paid_time' => $paidTime,
			'overtime' =>  $overtime
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

		return $this->respondCreated($id);
	}

	public function edit_attendance_detail_paid_time_post($id)
	{
		helper('app_select_option');
		$postData = $this->request->getPost();

		// check permission
		$hasPermission = $this->_checkAttendancePermission($postData['employee']);
		if (!$hasPermission) {
			return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		}

		$modules = \Config\Services::modules();

		$employeeId = empty($postData['employee']) ?  user_id() : $postData['employee'];
		$attendanceDetailId = $id;
		$attendanceId = $postData['attendance_id'];

		// create or update attendance detail
		$newPaidTime = $postData['hours'] * 3600 + $postData['minutes'] * 60;
		if (empty($attendanceDetailId)) {
			$oldPaidTime = '0';
			$additionalData = [
				'date' => $postData['date'],
				'paid_time' => $newPaidTime,
				'is_edit_paid_time' => 1,
				'work_schedule_today' => $postData['work_schedule_today']
			];
			$attendanceDetailId = $this->_handleInsertNewAttendanceToday($modules, $attendanceId, $employeeId, $additionalData);
		} else {
			$modules->setModule('attendance_details');
			$model = $modules->model;
			$infoAttendanceDetail = $model->asArray()->find($attendanceDetailId);
			$oldPaidTime = $infoAttendanceDetail['paid_time'];
			$dataUpdate = [
				'id' => $attendanceDetailId,
				'paid_time' => $newPaidTime,
				'is_edit_paid_time' => 1
			];
			$model->setAllowedFields(array_keys($dataUpdate));
			try {
				$model->save($dataUpdate);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
		}

		if (empty($attendanceDetailId)) {
			return $this->fail(FAILED_SAVE);
		}

		//add attendance logs
		$modules->setModule('attendance_logs');
		$model = $modules->model;
		$dataAttendanceLog = [
			'attendance_detail' => $attendanceDetailId,
			'employee' => $employeeId,
			'type' => getOptionValue('attendance_logs', 'type', 'editpaidtime'),
			'note' => json_encode([
				'time_from' => $oldPaidTime,
				'time_to' => $newPaidTime,
				'message' => $postData['note']
			])
		];
		$model->setAllowedFields(array_keys($dataAttendanceLog));
		try {
			$model->save($dataAttendanceLog);
			\CodeIgniter\Events\Events::trigger('attendance_on_update_total_log', $attendanceDetailId);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		$modules->setModule('attendance_details');
		$model = $modules->model;
		$infoAttendanceUpdate = handleDataBeforeReturn($modules, $model->asArray()->find($attendanceDetailId));
		$infoAttendanceUpdate['work_schedule'] = isset($postData['attendance_detail']['work_schedule']) ? $postData['attendance_detail']['work_schedule'] : [];
		$infoAttendanceUpdate['time_off'] = (isset($postData['attendance_detail']['time_off']) && !$this->_checkIsEmptyArray($postData['attendance_detail']['time_off'])) ? $postData['attendance_detail']['time_off'] : new stdClass;

		return $this->respond([
			'info_attendance_detail' => $infoAttendanceUpdate
		]);
	}

	public function edit_attendance_detail_overtime_post($id)
	{
		helper('app_select_option');
		$postData = $this->request->getPost();

		// check permission
		$hasPermission = $this->_checkAttendancePermission($postData['employee']);
		if (!$hasPermission) {
			return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		}

		$modules = \Config\Services::modules();

		$employeeId = empty($postData['employee']) ?  user_id() : $postData['employee'];
		unset($postData['employee']);
		$attendanceDetailId = $id;
		$attendanceId = $postData['attendance_id'];
		unset($postData['attendance_id']);

		// create or update attendance detail
		$newOvertime = $postData['hours'] * 3600 + $postData['minutes'] * 60;
		if (empty($attendanceDetailId)) {
			$oldOvertime = '0';
			$additionalData = [
				'date' => $postData['date'],
				'overtime' => $newOvertime,
				'is_edit_overtime' => 1,
				'work_schedule_today' => $postData['work_schedule_today']
			];
			$attendanceDetailId = $this->_handleInsertNewAttendanceToday($modules, $attendanceId, $employeeId, $additionalData);
		} else {
			$modules->setModule('attendance_details');
			$model = $modules->model;
			$infoAttendanceDetail = $model->asArray()->find($attendanceDetailId);
			$oldOvertime = $infoAttendanceDetail['overtime'];
			$dataUpdate = [
				'id' => $attendanceDetailId,
				'overtime' => $newOvertime,
				'is_edit_overtime' => 1
			];
			$model->setAllowedFields(array_keys($dataUpdate));
			try {
				$model->save($dataUpdate);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
		}

		if (empty($attendanceDetailId)) {
			return $this->fail(FAILED_SAVE);
		}

		//add attendance logs
		$modules->setModule('attendance_logs');
		$model = $modules->model;
		$dataAttendanceLog = [
			'attendance_detail' => $attendanceDetailId,
			'employee' => $employeeId,
			'type' => getOptionValue('attendance_logs', 'type', 'editovertime'),
			'note' => json_encode([
				'time_from' => $oldOvertime,
				'time_to' => $newOvertime,
				'message' => $postData['note']
			])
		];
		$model->setAllowedFields(array_keys($dataAttendanceLog));
		try {
			$model->save($dataAttendanceLog);
			\CodeIgniter\Events\Events::trigger('attendance_on_update_total_log', $attendanceDetailId);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		$modules->setModule('attendance_details');
		$model = $modules->model;
		$infoAttendanceUpdate = handleDataBeforeReturn($modules, $model->asArray()->find($attendanceDetailId));
		$infoAttendanceUpdate['work_schedule'] = isset($postData['attendance_detail']['work_schedule']) ? $postData['attendance_detail']['work_schedule'] : [];
		$infoAttendanceUpdate['time_off'] = (isset($postData['attendance_detail']['time_off']) && !$this->_checkIsEmptyArray($postData['attendance_detail']['time_off'])) ? $postData['attendance_detail']['time_off'] : [];

		return $this->respond([
			'info_attendance_detail' => $infoAttendanceUpdate
		]);
	}

	public function load_attendance_detail_log_get()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();

		$params = $this->request->getGet();

		$modules->setModule('attendance_logs');
		$model = $modules->model;
		$listLog = $model->where('attendance_detail', $params['attendance_detail_id'])->findAll();
		$result = handleDataBeforeReturn($modules, $listLog, true);
		return $this->respond($result);
	}

	public function get_list_attendance_for_filter_get()
	{
		$modules = \Config\Services::modules();
		$modules->setModule('attendances');
		$model = $modules->model;

		$listAttendance = $model->select(['id', 'name', 'date_from', 'date_to'])->orderBy('date_from', 'DESC')->findAll();

		return $this->respond([
			'results' => $listAttendance
		]);
	}

	// ** support function
	private function _createNewAttendanceToday($modules)
	{
		$modules->setModule('attendances');
		$model = $modules->model;
		$infoAttendance = $model->select(['id'])->asArray()->where('date_to >=', date('Y-m-d'))->first();
		if (!$infoAttendance) {
			$attendanceService = \HRM\Modules\Attendances\Libraries\Attendances\Config\Services::attendance();
			$attendanceService->recalculateAttendance();
			$attendanceService->createNewAttendanceSchedule();
		}
	}

	private function _reCalculatePaidTimeAndOvertime($modules, $infoAttendanceDetail, $workScheduleToday)
	{
		helper('app_select_option');
		$loggedTime = 0;
		$paidTime = 0;
		$overtime = 0;

		$modules->setModule('attendance_logs');
		$model = $modules->model;
		$listAttendanceLog = $model
			->asArray()
			->where('attendance_detail', $infoAttendanceDetail['id'])
			->where('type', getOptionValue('attendance_logs', 'type', 'attendance'))
			->findAll();
		$clockInOption = getOptionValue('attendance_logs', 'clock_type', 'clockin');
		$timeFrom = date('Y-m-d') . ' ' . $workScheduleToday['time_from'] . ':00';
		$timeTo =  date('Y-m-d') . ' ' . $workScheduleToday['time_to'] . ':00';
		$endTime = $infoAttendanceDetail['date'] . ' 23:59:59';
		if ($workScheduleToday['working_day']) {
			$breakTimeFrom = '';
			$breakTimeTo = '';
			if ($workScheduleToday['break_time']) {
				$breakTimeFrom = date('Y-m-d') . ' ' . $workScheduleToday['br_time_from'] . ':00';
				$breakTimeTo = date('Y-m-d') . ' ' . $workScheduleToday['br_time_to'] . ':00';
			}
			foreach ($listAttendanceLog as $key => $row) {
				if ($row['clock_type'] == $clockInOption && isset($listAttendanceLog[$key + 1])) {
					$nextRow = $listAttendanceLog[$key + 1];
					$clockIn = $clockInPaid = $clockInOT =  $row['clock'];
					$clockOut = $clockOutPaid = $clockOutOT = $nextRow['clock'];
					if (strtotime($clockIn) > strtotime($endTime) || strtotime($clockOut) > strtotime($endTime)) {
						continue;
					}

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
						continue;
					}
					$loggedTime += strtotime($clockOut) - strtotime($clockIn);

					// paid time = $timeFrom < logged time < $timeTo
					if (strtotime($clockInPaid) <= strtotime($timeTo) && strtotime($clockOutPaid) <= strtotime($timeTo)) {
						if (strtotime($clockInPaid) <= strtotime($timeFrom)) {
							$clockInPaid = $timeFrom;
						}

						if (strtotime($clockOutPaid) >= strtotime($timeTo)) {
							$clockOutPaid = $timeTo;
						}
						$paidTime += strtotime($clockOutPaid) - strtotime($clockInPaid);
					}

					if (strtotime($clockInOT) > strtotime($timeTo) && strtotime($clockOutOT) > strtotime($timeTo)) {
						$overtime += strtotime($clockOutOT) - strtotime($clockInOT);
					}
				}
			}
		} else {
			foreach ($listAttendanceLog as $key => $row) {
				$row = $row;
				if ($row['clock_type'] == $clockInOption && isset($listAttendanceLog[$key + 1])) {
					$nextRow = $listAttendanceLog[$key + 1];
					$clockInOT =  $row['clock'];
					$clockOutOT = $nextRow['clock'];
					if (strtotime($clockInOT) > strtotime($endTime) || strtotime($clockOutOT) > strtotime($endTime)) {
						continue;
					}
					$overtime += strtotime($clockInOT) - strtotime($clockInOT);
				}
			}
		}
		return [$loggedTime, $paidTime, $overtime];
	}

	private function _convertLocationTypeClockIn($type)
	{
		helper('app_select_option');
		if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'outside')) {
			return  getOptionValue('attendance_details', 'clock_in_location_type', 'outside');
		} else if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'inside')) {
			return  getOptionValue('attendance_details', 'clock_in_location_type', 'inside');
		}
		return  getOptionValue('attendance_details', 'clock_in_location_type', 'na');
	}

	private function _convertLocationTypeClockOut($type)
	{
		helper('app_select_option');
		if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'outside')) {
			return  getOptionValue('attendance_details', 'clock_out_location_type', 'outside');
		} else if ($type == getOptionValue('attendance_logs', 'clock_location_type', 'inside')) {
			return  getOptionValue('attendance_details', 'clock_out_location_type', 'inside');
		}
		return  getOptionValue('attendance_details', 'clock_out_location_type', 'na');
	}

	private function _handleInsertNewAttendanceToday($modules, $attendanceId, $employeeId, $additionalData = [])
	{
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		return handleInsertNewAttendanceToday($modules, $attendanceId, $employeeId, $additionalData);
	}

	private function _checkIsEmptyArray($array)
	{
		$array = array_filter($array);
		return count($array) == 0;
	}

	private function _checkAttendancePermission($employeeId)
	{
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		return checkAttendancePermission($employeeId);
	}
}
