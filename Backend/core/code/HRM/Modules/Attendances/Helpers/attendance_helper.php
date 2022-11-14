<?php

use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use HRM\Modules\Employees\Models\EmployeesModel;


function getAttendanceDetail($listAttendanceDetail, $currentEmployee, $fromDate, $toDate, $arrFilter = array(), $arrWorkingDay = array(), $listTimeOffRequest = array(), $arrReturnKey = [])
{
	helper('app_select_option');
	$modules = \Config\Services::modules();
	//get employee schedule
	if (empty($arrWorkingDay)) {
		$modules->setModule('work_schedules');
		$model = new WorkScheduleModel();
		$workingDay = $model->findFormat($currentEmployee['work_schedule']);
		if (empty($workingDay)) {
			return false;
		}
		$effectiveDate = $workingDay['effective'];
		$arrWorkingDay = $workingDay['day'];
	} else {
		$effectiveDate = $arrWorkingDay['effective'];
		$arrWorkingDay = $arrWorkingDay['day'];
	}

	//get holiday
	$modules->setModule('time_off_holidays');
	$model = $modules->model;
	$listHoliday = $model->asArray()->where('from_date <=', $toDate)->where('to_date >= ', $fromDate)->where('office_id', $currentEmployee['office'])->findAll();
	foreach ($listHoliday as $rowHoliday) {
		if (strtotime($rowHoliday['from_date']) == strtotime($rowHoliday['to_date'])) {
			$arrTimeOff[$rowHoliday['from_date']] = [
				'type' => 'holiday',
				'name' => $rowHoliday['name']
			];
		} else {
			$begin = new DateTime($rowHoliday['from_date']);
			$end = new DateTime($rowHoliday['to_date']);
			for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
				$arrTimeOff[$i->format('Y-m-d')] = [
					'type' => 'holiday',
					'name' => $rowHoliday['name']
				];
			}
		}
	}

	//get time off
	if (empty($listTimeOffRequest)) {
		$modules->setModule('time_off_requests');
		$model = $modules->model;
		$listTimeOffRequest = $model->asArray()
			->where('created_by', $currentEmployee['id'])
			->where('status', getOptionValue('time_off_requests', 'status', 'approved'))
			->where('date_from <= ', $toDate)
			->where('date_to >= ', $fromDate)
			->findAll();
	}

	foreach ($listTimeOffRequest as $rowTimeOffRequest) {
		if (strtotime($rowTimeOffRequest['date_from']) == strtotime($rowTimeOffRequest['date_to'])) {
			$arrTimeOff[$rowTimeOffRequest['date_from']] = [
				'type' => 'time_off',
				'time_from' => $rowTimeOffRequest['time_from'],
				'time_to' => $rowTimeOffRequest['time_to'],
				'total_day' => $rowTimeOffRequest['total_day'],
				'is_full_day' => false
			];
		} else {
			$begin = new DateTime($rowTimeOffRequest['date_from']);
			$end = new DateTime($rowTimeOffRequest['date_to']);
			for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
				$arrTimeOff[$i->format('Y-m-d')] = [
					'type' => 'time_off',
					'time_from' => $rowTimeOffRequest['time_from'],
					'time_to' => $rowTimeOffRequest['time_to'],
					'total_day' => $rowTimeOffRequest['total_day'],
					'is_full_day' => true
				];
			}
		}
	}

	// interleaved work schedule
	$endDate = array_key_first($listAttendanceDetail);
	$arrInterleaved = getInterleaved($effectiveDate, $arrWorkingDay, $endDate);

	$result['total_time'] = [
		'work_schedule' => 0,
		'logged_time' => 0,
		'paid_time' => 0,
		'deficit' => 0,
		'overtime' => 0,
		'overtime_regular' => 0,
		'overtime_non_working_day' => 0,
		'overtime_holiday' => 0
	];
	$listAttendanceDetailFilter = [];
	$totalWorkingDay = 0;
	$totalNonWorkingDay = 0;
	if (count($listAttendanceDetail) > 0) {
		$totalPaidTimeWorkingDay = 0;
		$index = 0;
		foreach ($listAttendanceDetail as $key => $row) {
			$arrayPush = $row;
			$weekDay = date('w', strtotime($key));
			$infoWorkingDay = isset($arrWorkingDay[$weekDay]) ? $arrWorkingDay[$weekDay] : [];
			$infoTimeOff = isset($arrTimeOff[$key]) ? $arrTimeOff[$key] : [];

			// filter non working day, time off, holiday
			$allowPush = false;
			$isValidStatus = true;
			$isValidLocation = true;
			$isValidRecord = true;
			if (count($arrFilter) > 0) {
				$statusFilter = $arrFilter['status'];
				if (!empty($statusFilter)) {
					$isValidStatus = false;
					if (isset($row['status']['value']) && $row['status']['value'] == $statusFilter) {
						$isValidStatus = true;
					}
				}

				$recordFilter = $arrFilter['record'];
				if ($recordFilter !== '' && $recordFilter !== 'all') {
					$isValidLocation = false;

					if ($recordFilter == 'non_working_days') {
						if (count($infoTimeOff) > 0) {
							$isValidLocation = true;
						}
						if (!isset($infoWorkingDay['working_day']) || !$infoWorkingDay['working_day']) {
							$isValidLocation = true;
						}
					} elseif ($recordFilter == 'missing') {
						$isValidLocation = false;
						if (!isset($row['clock_in']) || !isset($row['clock_out'])) {
							$isValidLocation = true;
						} else if (isset($row['clock_in']) && empty($row['clock_in'])) {
							$isValidLocation = true;
						} else if (isset($row['clock_out']) && empty($row['clock_out'])) {
							$isValidLocation = true;
						}
					} else if ($recordFilter == 'edit_paid_time') {
						$isValidLocation = false;
						if (isset($row['is_edit_paid_time']) && $row['is_edit_paid_time'] == 1) {
							$isValidLocation = true;
						}
					} else if ($recordFilter == 'edit_overtime') {
						$isValidLocation = false;
						if (isset($row['is_edit_overtime']) && $row['is_edit_overtime'] == 1) {
							$isValidLocation = true;
						}
					}
				}

				$locationFilter = $arrFilter['location'];
				if (!empty($locationFilter) && $locationFilter != 'all') {
					$isValidRecord = false;
					if (
						(isset($row['clock_in_location_type']['value']) && isset($row['clock_out_location_type']['value']))
						&& ($row['clock_in_location_type']['value'] == $locationFilter
							|| $row['clock_out_location_type']['value'] == convertLocationTypeClockOutFromClockIn($locationFilter))
					) {
						$isValidRecord = true;
					}
				}
			}

			if ($isValidStatus && $isValidLocation && $isValidRecord) {
				$allowPush = true;
			}

			$arrayPush['work_schedule'] = $infoWorkingDay;

			$isHoliday = false;
			if (count($infoTimeOff) > 0) {
				if ($infoTimeOff['type'] == 'holiday') {
					$isHoliday = true;
					$arrayPush['work_schedule']['total'] = 0;
				} else if ($infoTimeOff['type'] == 'time_off' && $infoTimeOff['is_full_day']) {
					$arrayPush['work_schedule']['total'] = 0;
				} else if ($infoTimeOff['type'] == 'time_off' && !$infoTimeOff['is_full_day']) {
					$arrayPush['work_schedule']['total'] = $arrayPush['work_schedule']['total'] - ($arrayPush['work_schedule']['total'] * $infoTimeOff['total_day']);
				}
			}

			$arrayPush['time_off'] = $infoTimeOff;

			if (in_array($key, $arrInterleaved)) {
				$arrayPush['work_schedule']['working_day'] = false;
			}

			$isNonWorkingDay = false;
			if (isset($arrayPush['work_schedule']['working_day']) && !$arrayPush['work_schedule']['working_day']) {
				$isNonWorkingDay = true;
				$arrayPush['work_schedule']['total'] = 0;
			}

			// except expire key
			if ($allowPush) {
				if (count($row) > 1) {
					$arrayPush['date'] = date('Y-m-d', strtotime($arrayPush['date']));
					$ot_regular = 0;
					$ot_non_working_day = 0;
					$ot_holiday = 0;

					if ($isHoliday) {
						$ot_holiday += $arrayPush['overtime'];
					}

					if ($isNonWorkingDay && $ot_holiday == 0) {
						$ot_non_working_day += $arrayPush['overtime'];
					}

					if ($ot_holiday == 0 && $ot_non_working_day == 0) {
						$ot_regular += $arrayPush['overtime'];
					}

					$totalPaidTimeWorkingDay += $arrayPush['paid_time'];
					$arrayPush['deficit'] = $arrayPush['work_schedule']['total'] - $arrayPush['paid_time'];
					$result['total_time']['logged_time'] += $arrayPush['logged_time'];
					$result['total_time']['paid_time'] += $arrayPush['paid_time'];
					$result['total_time']['overtime'] += $arrayPush['overtime'];
					$result['total_time']['overtime_regular'] += $ot_regular;
					$result['total_time']['overtime_non_working_day'] += $ot_non_working_day;
					$result['total_time']['overtime_holiday'] += $ot_holiday;
					if (!$isNonWorkingDay) {
						$totalWorkingDay++;
					}
				} else {
					$arrayPush['id'] = 'empty_attendance_' . $index;
					$arrayPush['date'] = $key;
					$arrayPush['clock_in'] = null;
					$arrayPush['clock_in_location_type'] = null;
					$arrayPush['clock_out'] = null;
					$arrayPush['clock_out_location_type'] = null;
					$arrayPush['logged_time'] = 0;
					$arrayPush['paid_time'] = 0;
					$arrayPush['overtime'] = 0;
					$arrayPush['status'] = null;
					if (!$isNonWorkingDay) {
						$totalNonWorkingDay++;
					}
				}
				$result['total_time']['work_schedule'] += $arrayPush['work_schedule']['total'];
				$listAttendanceDetailFilter[] = $arrayPush;
				$index++;
			}
		}
		$result['total_time']['deficit'] = ($result['total_time']['work_schedule'] * 3600) - $totalPaidTimeWorkingDay;
	}

	if (!empty($arrReturnKey)) {
		$return = [
			'total_time' => $result['total_time'],
			'list_attendance_detail' => $listAttendanceDetailFilter,
			'totalWorkingDay' => $totalWorkingDay,
			'totalNonWorkingDay' => $totalNonWorkingDay,
		];

		return array_intersect_key($return, array_flip($arrReturnKey));
	} else {
		return [
			'total_time' => $result['total_time'],
			'list_attendance_detail' => $listAttendanceDetailFilter,
			'totalWorkingDay' => $totalWorkingDay,
			'totalNonWorkingDay' => $totalNonWorkingDay,
		];
	}
}

function convertLocationTypeClockOutFromClockIn($type)
{
	helper('app_select_option');
	if ($type == getOptionValue('attendance_details', 'clock_in_location_type', 'outside')) {
		return getOptionValue('attendance_details', 'clock_out_location_type', 'outside');
	} else if ($type == getOptionValue('attendance_details', 'clock_in_location_type', 'inside')) {
		return getOptionValue('attendance_details', 'clock_out_location_type', 'inside');
	}
	return getOptionValue('attendance_details', 'clock_out_location_type', 'na');
}

function handleInsertNewAttendanceToday($modules, $attendanceId, $employeeId, $additionalData = [], $date = '')
{
	helper('app_select_option');
	$modules->setModule('attendance_details');
	$model = $modules->model;
	if (!$date) $date = date('Y-m-d');
	$dataInsert = [
		'attendance' => $attendanceId,
		'name' => strtotime(date('Y-m-d')) . '_' . $attendanceId . '_' . $employeeId,
		'employee' => $employeeId,
		'date' => $date,
		'status' => getOptionValue('attendance_details', 'status', 'pending')
	];
	$dataInsert = array_merge($dataInsert, $additionalData);
	$dataHandleAttendanceDetail = handleDataBeforeSave($modules, $dataInsert);
	$model->setAllowedFields(array_keys($dataInsert));
	try {
		$model->save($dataHandleAttendanceDetail['data']);
	} catch (\ReflectionException $e) {
		return 0;
	}

	return $model->getInsertID();
}

function calculateTimeAttendance($infoAttendanceDetail, $workScheduleToday, $infoTimeOffToDay, $infoHolidayToDay, $postData, $clockTime)
{
	helper('app_select_option');

	$allowOvertime = preference('attendance_allow_overtime') == "true";

	$loggedTime = $infoAttendanceDetail['logged_time'];
	$paidTime = $paidTimeTemp = $infoAttendanceDetail['paid_time'];
	$overtime = $infoAttendanceDetail['overtime'];

	$clockType = $postData['clock_type'];
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
					$overtime += $allowOvertime ? $paidTimeTemp - $totalWorkTimeSeconds : 0;
				}
			}

			if ($allowOvertime && strtotime($clockInOT) >= strtotime($timeTo) && strtotime($clockOutOT) > strtotime($timeTo)) {
				$overtime += strtotime($clockOutOT) - strtotime($clockInOT);
			}
		} else if ($allowOvertime) {
			$clockInOT = $infoAttendanceDetail['last_clock_in'];
			$clockOutOT = $clockTime;
			if (strtotime($clockInOT) < strtotime($endTime) && strtotime($clockOutOT) < strtotime($endTime)) {
				$overtime += strtotime($clockOutOT) - strtotime($clockInOT);
			}
		}
	}

	return [$loggedTime, $paidTime, $overtime];
}

function calculateTimeAttendanceDoorIntegrate($infoAttendanceDetail, $workScheduleToday, $infoTimeOffToDay, $infoHolidayToDay, $clockTime)
{
	helper('app_select_option');

	$firstClockIn = isset($infoAttendanceDetail['clock_in']) ? $infoAttendanceDetail['clock_in'] : '';
	if ($firstClockIn == '') {
		return false;
	}

	$allowOvertime = preference('attendance_allow_overtime') == "true";

	$endTime = $infoAttendanceDetail['date'] . ' 23:59:59';
	$loggedTime = empty($infoAttendanceDetail['logged_time']) ? 0 : $infoAttendanceDetail['logged_time'];
	$paidTime  = empty($infoAttendanceDetail['paid_time']) ? 0 : $infoAttendanceDetail['paid_time'];
	$overtime = empty($infoAttendanceDetail['overtime']) ? 0 : $infoAttendanceDetail['overtime'];

	$clockIn = $clockInPaid = $firstClockIn;
	$clockOut = $clockOutPaid =  $clockOutOT = $clockTime;

	if ($workScheduleToday['working_day'] && !$infoHolidayToDay) {
		$clockInOT = $infoAttendanceDetail['last_clock_in'];
		$breakTimeFrom = '';
		$breakTimeTo = '';
		if ($workScheduleToday['break_time']) {
			$breakTimeFrom = date('Y-m-d') . ' ' . $workScheduleToday['br_time_from'] . ':00';
			$breakTimeTo = date('Y-m-d') . ' ' . $workScheduleToday['br_time_to'] . ':00';
		}
		$timeFrom = date('Y-m-d') . ' ' . $workScheduleToday['time_from'] . ':00';
		$timeTo = date('Y-m-d') . ' ' . $workScheduleToday['time_to'] . ':00';

		$totalWorkTime = $workScheduleToday['total'];
		if ($infoTimeOffToDay) {
			$totalDayTimeOff = $infoTimeOffToDay['total_day'] > 1 ? 1 : $infoTimeOffToDay['total_day'];
			$totalWorkTime = $totalWorkTime - ($totalWorkTime * $totalDayTimeOff);
		}
		$totalWorkTimeSeconds = $totalWorkTime * 3600;

		if (strtotime($clockIn) > strtotime($endTime) || strtotime($clockOut) > strtotime($endTime)) {
			return [$loggedTime, $paidTime, $overtime];
		}

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

		$loggedTime = strtotime($clockOut) - strtotime($clockIn);
		if (($breakTimeFrom != '' && $breakTimeTo != '') && strtotime($clockIn) <= strtotime($breakTimeFrom) && strtotime($clockOut) > strtotime($breakTimeTo)) {
			$loggedTime -= (strtotime($breakTimeTo) - strtotime($breakTimeFrom));
		}
		$overtime = 0;
		$paidTime = 0;

		if (strtotime($clockInPaid) <= strtotime($timeFrom)) {
			$clockInPaid = $timeFrom;
		}

		if (strtotime($clockOutPaid) <= strtotime($timeFrom)) {
			$clockOutPaid = $timeFrom;
		}

		if (strtotime($clockOutPaid) >= strtotime($timeTo)) {
			$clockOutPaid = $timeTo;
		}

		$paidTimeTemp = strtotime($clockOutPaid) - strtotime($clockInPaid);

		if ($paidTimeTemp < $totalWorkTimeSeconds) {
			$paidTime = $paidTimeTemp;
		} else {
			$paidTime = $totalWorkTimeSeconds;
			$overtime += $allowOvertime ? $paidTimeTemp - $totalWorkTimeSeconds : 0;
		}

		if (strtotime($clockOutOT) >= strtotime($timeTo)) {
			if ($allowOvertime) {
				$overtime += strtotime($clockOutOT) - strtotime($timeTo);
			}
		}

	} else if ($allowOvertime) {
		$clockInOT = $firstClockIn;
		if (strtotime($clockInOT) < strtotime($endTime) && strtotime($clockOutOT) < strtotime($endTime)) {
			$overtime = strtotime($clockOutOT) - strtotime($clockInOT);
		}
	}

	return [$loggedTime, $paidTime, $overtime];
}

function getHoliday($modules, $officeId, $day)
{
	$modules->setModule('time_off_holidays');
	$model = $modules->model;
	return $model->asArray()
		->where('office_id', $officeId)
		->where('from_date <=', $day)
		->where('to_date >=', $day)
		->first();
}

function getTimeOff($modules, $userId, $day)
{
	helper('app_select_option');

	$modules->setModule('time_off_requests');
	$model = $modules->model;
	return $model->asArray()
		->where('created_by', $userId)
		->where('status', getOptionValue('time_off_requests', 'status', 'approved'))
		->where('date_from <= ', $day)
		->where('date_to >= ', $day)
		->first();
}

function checkAttendancePermission($employeeId)
{
	$currentUserId = user_id();
	if ($employeeId === $currentUserId) {
		return true;
	}

	if (hasModulePermit("attendances", 'accessEmployeeAttendance')) {
		return true;
	}

	if (hasModulePermit("attendances", 'accessTeamAttendance')) {
		$listEmployeeAccessible = getListEmployeeAccessible($currentUserId);
		if (isset($listEmployeeAccessible[$employeeId])) {
			return true;
		}

		return false;
	}

	return false;
}

function getListEmployeeAttendance($arrEmployeeId)
{
	if (hasModulePermit("attendances", 'accessEmployeeAttendance')) {
		return $arrEmployeeId;
	}

	$result = [];
	if (hasModulePermit("attendances", 'accessTeamAttendance')) {
		$listEmployeeAccessible = getListEmployeeAccessible(user_id());

		foreach ($arrEmployeeId as $employeeId) {
			if (isset($listEmployeeAccessible[$employeeId])) {
				$result[] = $employeeId;
			}
		}
	}

	return $result;
}

function getListEmployeeAccessible($userId)
{
	helper('HRM\Modules\Employees\Helpers\employee_helper');
	$employeeModel = new EmployeesModel();
	$employeeModel->exceptResigned();
	return getEmployeesByRank($userId, "subordinate", $employeeModel);
}

function getInterleaved($effectiveDate, $arrWorkingDay, $endDate)
{
	$arrInterleaved = [];
	$dayOfWeekEffectiveDate = date('w', strtotime($effectiveDate));
	foreach ($arrWorkingDay as $keyWorkingDay => $rowWorkingDay) {
		$isInterleaved = isset($rowWorkingDay['is_interleaved']) ? $rowWorkingDay['is_interleaved'] : false;
		if ($isInterleaved) {
			$workingOnNextWeekdayFromEffectiveDate = $rowWorkingDay['working_on_next_weekday_from_effective_date'];
			$interleavedEveryWeekNumber = intval($rowWorkingDay['interleaved_every_week_number']);
			$startDateInterleaved = '';
			$dayOfWeek = $keyWorkingDay;

			if ($dayOfWeekEffectiveDate == $dayOfWeek) {
				$startDateInterleaved = $effectiveDate;
			} elseif ($dayOfWeekEffectiveDate < $dayOfWeek) {
				$startDateInterleaved = date('Y-m-d', strtotime('+' . ($dayOfWeek - $dayOfWeekEffectiveDate) . ' days', strtotime($effectiveDate)));
			} elseif ($dayOfWeekEffectiveDate > $dayOfWeek) {
				$daysRemain = 7 - $dayOfWeekEffectiveDate + $dayOfWeek;
				$startDateInterleaved = date('Y-m-d', strtotime('+' . $daysRemain . ' days', strtotime($effectiveDate)));
			}

			if (!empty($endDate) && $startDateInterleaved != '') {
				$begin = new DateTime($startDateInterleaved);
				$end = new DateTime($endDate);

				$dayNumber = 1;
				$weekNumber = 0;
				for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
					$date = $i->format("Y-m-d");
					if ($dayNumber == 1 || $date == date('Y-m-d', strtotime('+' . ($weekNumber * 7) . ' days', strtotime($startDateInterleaved)))) {

						$isOddSchedule = true;
						if ($weekNumber > $interleavedEveryWeekNumber) {
							$isOddSchedule = ceil($weekNumber / $interleavedEveryWeekNumber) % 2 ? true : false;
						} else {
							$isOddSchedule = true;
						}

						if ($isOddSchedule) {
							if (!$workingOnNextWeekdayFromEffectiveDate) {
								$arrInterleaved[] = $date;
							}
						} else {
							if ($workingOnNextWeekdayFromEffectiveDate) {
								$arrInterleaved[] = $date;
							}
						}

						$weekNumber++;
					}

					$dayNumber++;
				}
			}
		}
	}

	return $arrInterleaved;
}
