<?php
/*
* Copyright (C) 2020 @tunv
* Controller create by CLI - ERP
* Module name : TimeMachine
* Controller name : TimeMachine
* Time created : 24/05/2022 15:55:37
*/

namespace HRM\Modules\Attendances\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Attendances\Models\AttendanceDetailModel;
use HRM\Modules\Attendances\Models\AttendancesModel;
use HRM\Modules\Attendances\Models\AttendanceSettingModel;
use HRM\Modules\Employees\Models\EmployeesModel;
use HRM\Modules\TimeOff\Models\TimeOffHolidaysModel;
use HRM\Modules\TimeOff\Models\TimeOffRequestsModel;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use Tatter\Settings\Models\SettingModel;

class TimeMachine extends ErpController
{
	public function index()
	{
		helper('filesystem');
		helper('HRM\Modules\Attendances\Helpers\attendance_helper');
		$dataGet = $this->request->getGet();
		$postdata = file_get_contents("php://input");
		$dataGet['rawData'] = ($postdata);
		$dataGet['time'] = date("Y/m/d H:i");
		$logSave = preference('attendance_save_log');

		$modelAttendanceSetting = new AttendanceSettingModel();
		$listOffices = $modelAttendanceSetting->asArray()->findAll();

		$infoOffices = '';
		foreach ($listOffices as $val) {
			$arrID = json_decode($val['id_devices'], true);
			$found_key = in_array($dataGet['SN'], $arrID);
			if ($found_key) {
				$infoOffices = $val;
			} else {
				continue;
			}
		}

		if (!$infoOffices) return 'fail';
		$CheckTimeMachine = $infoOffices['time_machine'];
		if (!$CheckTimeMachine) {
			return 'fail';
		}
		// ALL LOG JSON
		if ($logSave) {
			if (!is_dir(WRITEPATH . 'uploads/modules/timemachine')) {
				mkdir(WRITEPATH . 'uploads/modules/timemachine', 0777, true);
				write_file(WRITEPATH . 'uploads/modules/timemachine/all_time_machine_log.json', '[]');
			}
			$allLog = json_decode(file_get_contents(WRITEPATH . "uploads/modules/timemachine/all_time_machine_log.json"), true);
			$allLog[] = $dataGet;
			file_put_contents(WRITEPATH . "uploads/modules/timemachine/all_time_machine_log.json", json_encode($allLog));
			// END SAVE LOG
		}

		$idOffices = 0;
		if ($infoOffices) $idOffices = $infoOffices['offices'];
		if (!$idOffices) return;


		if (isset($dataGet['options']) and $dataGet['options'] == 'all') {
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
			ADMSSyncTime=1
			<?php
			exit;
		}

		if (isset($_GET['table']) and $_GET['table'] == 'ATTLOG') {
			helper('app_select_option');
			$model = new EmployeesModel();
			$listDatapost = explode('<br />', nl2br($postdata));

			foreach ($listDatapost as $eachdata) {
				//DATA RAW  = '1	2021-07-23 08:00:25	0	1		0	0	';
				$data = explode('	', $eachdata);
				if (!$data[0]) continue;
				$id = $data[0];

				if (!isset($data[1])) {
					if ($logSave) {
						if (!is_file(WRITEPATH . 'uploads/modules/timemachine/time_machine_errors_log.json')) {
							write_file(WRITEPATH . 'uploads/modules/timemachine/time_machine_errors_log.json', '[]');
						}
						$dataError['idcc'] = $id;
						$dataError['raw'] = $data;
						$dataError['time'] = date("Y-m-d H:i:s");
						$dataError['error'] = '!isset$data[1]';
						$errors = json_decode(file_get_contents(WRITEPATH . "uploads/modules/timemachine/time_machine_errors_log.json"), true);
						$errors[] = $dataError;
						file_put_contents(WRITEPATH . "uploads/modules/timemachine/time_machine_errors_log.json", json_encode($errors));
					}
					continue;
				}

				$giocham = explode(' ', $data[1])[1];
				$ngayChamCong = explode(' ', $data[1])[0];
				// ID Attendance
				$modelAttendance = new AttendancesModel();
				$infoAttendance = $modelAttendance->where('date_from <= ', $ngayChamCong)->where('date_to >= ', $ngayChamCong)->first();
				$idAttendance = $infoAttendance['id'];

				// get info Employee
				$infoEmployees = $model->asArray()->where('id_time_machine', $id)->first();
				if (!$infoEmployees) continue;

				$idWorkSchedule = $infoEmployees['work_schedule'];
				$modelWorkSchedule = new WorkScheduleModel();
				$infoWorkSchedule = $modelWorkSchedule->findFormat($idWorkSchedule);

				// interleaved
				$dateCheck = $ngayChamCong;
				$numOfWeek = date("w", strtotime($dateCheck));
				$workSchedule = $infoWorkSchedule['day'][$numOfWeek];
				$arrInterleavedDate = getInterleaved($infoWorkSchedule['effective'], $infoWorkSchedule['day'], date('Y-m-d'));

				if (in_array($ngayChamCong, $arrInterleavedDate)) {
					$workSchedule['working_day'] = false;
				}

				// Check Detail attendance
				$attendance_detailsModel = new AttendanceDetailModel();
				$existAttendance = $attendance_detailsModel->asArray()->where('employee', $infoEmployees['id'])->where('date', $dateCheck)->first();
				$attendance_detail = 0;
				if ($existAttendance) {
					$attendance_detail = $existAttendance['id'];
				}

				// START
				$dataInsert['office_id'] = $idOffices;
				$dataInsert['employee'] = $infoEmployees['id'];
				$dataInsert['work_schedule_today'] = $workSchedule;
				$dataInsert['clockDay'] = $ngayChamCong;
				$dataInsert['clockTime'] = $ngayChamCong . ' ' . $giocham;
				$dataInsert['attendance_detail'] = $attendance_detail;
				$dataInsert['clock_location_type'] = getOptionValue('attendance_logs', 'clock_location_type', 'inside');
				$dataInsert['clock_location'] = 'In Time Machine';
				$dataInsert['attendance_id'] = $idAttendance;
				$dataInsert['note'] = 'From time machine';
				$dataInsert['type'] = getOptionValue('attendance_logs', 'type', 'attendance');
				$dataInsert['users_id'] = $infoEmployees['users_id'];
				$dataInsert['id_mcc'] = $id;
				$dataInsert['data'] = $data;
				$this->insertTimeMachine($dataInsert, $infoOffices);
			}
			?>OK<?php
				exit;
			}
			if (isset($_GET['table']) and $_GET['table'] == 'OPERLOG') {
				?>OK<?php
					exit;
				}
				if (isset($_GET['table']) and $_GET['table'] == 'BIODATA') {
					?>OK<?php
						exit;
					}
				}

				private function insertTimeMachine($data, $infoOffices)
				{
					helper(['app_select_option', 'HRM\Modules\Attendances\Helpers\attendance_helper']);
					$isDoorIntegrate = $infoOffices['attendance_door_integrate'];
					$modules = \Config\Services::modules();
					$validation = \Config\Services::validation();
					$postData = $data;
					$officeId = $postData['office_id'];
					unset($postData['office_id']);
					$workScheduleToday = $postData['work_schedule_today'];

					unset($postData['work_schedule_today']);
					$userId = $postData['users_id'];
					unset($postData['users_id']);

					if ($postData['attendance_detail'] == 0) {
						//$additionalData = $postData['clockDay'];
						$additionalData = [
							'work_schedule_today' => json_encode($workScheduleToday)
						];
						
						$postData['attendance_detail'] = handleInsertNewAttendanceToday($modules, $postData['attendance_id'], $userId, $additionalData);
					}

					if (empty($postData['attendance_detail'])) {
						return $this->fail(FAILED_SAVE);
					}

					$clockDay = $postData['clockDay'];
					$clockTime = $postData['clockTime'];


					// Attendance Logs
					$modules->setModule('attendance_logs');
					$model = $modules->model;
					// Clock Type
					$countLog = $model->asArray()
						->where('type', getOptionValue('attendance_logs', 'type', 'attendance'))
						->where('DATE(clock)', $postData['clockDay'])
						->where('employee', $userId)
						->findAll();
					$clock_type = getOptionValue('attendance_logs', 'clock_type', 'clockin');
					if (!$isDoorIntegrate) {
						if (count($countLog) % 2) $clock_type = getOptionValue('attendance_logs', 'clock_type', 'clockout');
					} else {
						if (count($countLog) >= 1) $clock_type = getOptionValue('attendance_logs', 'clock_type', 'clockout');
					}
					$postData['clock_type'] = $clock_type;


					$dataHandleAttendanceLog = handleDataBeforeSave($modules, $postData);
					if (!empty($dataHandleAttendanceLog['validate'])) {
						if (!$validation->reset()->setRules($dataHandleAttendanceLog['validate'])->run($dataHandleAttendanceLog['data'])) {
							return $this->failValidationErrors($validation->getErrors());
						}
					}
					$dataHandleAttendanceLog['fieldsArray'][] = 'created_by';
					$model->setAllowedFields($dataHandleAttendanceLog['fieldsArray']);
					$saveAttendanceLog = $dataHandleAttendanceLog['data'];
					$saveAttendanceLog['clock'] = $clockTime;
					$saveAttendanceLog['employee'] = $userId;
					$saveAttendanceLog['owner'] = 1;
					$saveAttendanceLog['created_by'] = 1;
					try {
						$model->save($saveAttendanceLog);
					} catch (\ReflectionException $e) {
						return $this->fail(FAILED_SAVE);
					}

					//update attendance detail
					$infoHolidayToDay = getHoliday($modules, $officeId, $clockDay);
					$infoTimeOffToDay = getTimeOff($modules, $userId, $clockDay);

					$modules->setModule('attendance_details');
					$attendance_detailsModel = $modules->model;
					$infoAttendanceDetail = $attendance_detailsModel->asArray()->find($postData['attendance_detail']);
					//calculate paid time, overtime
					if ($isDoorIntegrate) {
						[$loggedTime, $paidTime, $overtime] = calculateTimeAttendanceDoorIntegrate($infoAttendanceDetail, $workScheduleToday, $infoTimeOffToDay, $infoHolidayToDay, $clockTime);
					} else {
						[$loggedTime, $paidTime, $overtime] = calculateTimeAttendance($infoAttendanceDetail, $workScheduleToday, $infoTimeOffToDay, $infoHolidayToDay, $postData, $clockTime);
					}
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
							$dataUpdateAttendanceDetail['clock_in_location_type'] = getOptionValue("attendance_details", "clock_in_location_type", "inside");
						}
						$dataUpdateAttendanceDetail['is_clock_in_attendance'] = true;
						$dataUpdateAttendanceDetail['last_clock_in'] = $clockTime;
					} else {
						$dataUpdateAttendanceDetail['clock_out_location'] = $postData['clock_location'];
						$dataUpdateAttendanceDetail['clock_out_location_type'] = getOptionValue("attendance_details", "clock_out_location_type", "inside");
						$dataUpdateAttendanceDetail['clock_out'] = $clockTime;
						$dataUpdateAttendanceDetail['is_clock_in_attendance'] = false;
					}
					$dataHandleAttendanceDetail = handleDataBeforeSave($modules, $dataUpdateAttendanceDetail);
					$attendance_detailsModel->setAllowedFields(array_keys($dataUpdateAttendanceDetail));
					try {
						$attendance_detailsModel->save($dataHandleAttendanceDetail['data']);
						\CodeIgniter\Events\Events::trigger('attendance_on_update_total_log', intval($postData['attendance_detail']));
					} catch (\ReflectionException $e) {
						return $this->fail(FAILED_SAVE);
					}
				}
			}
