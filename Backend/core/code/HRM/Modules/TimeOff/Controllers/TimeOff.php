<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : timeoff
* Controller name : TimeOff
* Time created : 16/05/2022 11:43:43
*/

namespace HRM\Modules\Timeoff\Controllers;

use App\Controllers\ErpController;
use DateTime;
use DateTimeZone;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Google\Service\Calendar as Google_Service_Calendar;
use Google\Service\Calendar\Event as Google_Service_Calendar_Event;

class TimeOff extends ErpController
{
	public function __construct()
	{
		helper('app_select_option');
	}

	public function get_balance_get()
	{
		$user = user();
		$user_id = $user->id;
		$user_group = $user->group_id;
		$result = $this->getTimeOffCarousel($user_id, $user_group);

		return $this->respond($result);
	}

	public function get_my_requests_get()
	{
		$moduleName = 'time_off_requests';
		$modules = \Config\Services::modules($moduleName);
		$getPara = $this->request->getGet();
		$timeoffModel = $modules->model;
		$user_id = user()->id;

		$timeoffModel->where("created_by", $user_id);
		$timeoffModel = $this->filterRequest($timeoffModel, $getPara);
		$recordsTotal = $timeoffModel->countAllResults(false);

		$page = $getPara['pagination']['current'];
		$length = $getPara['pagination']['pageSize'];
		$start = ($page - 1) * $length;

		$sort = $this->sortRequest($getPara);
		$sort_field = $sort['sort_field'];
		$sort_order = $sort['sort_order'];

		$data = $timeoffModel->select('*')->orderBy($sort_field, $sort_order)->orderBy("id", "desc")->findAll($length, $start);

		$out['total'] = $recordsTotal;
		$out['data'] = $this->_handleDataTimeOffWithApprover(handleDataBeforeReturn($modules, $data, true));

		return $this->respond($out);
	}

	public function delete_file_get($id)
	{
		$moduleName = 'time_off_requests';
		$modules = \Config\Services::modules($moduleName);
		$timeoffModel = $modules->model;
		$data = $timeoffModel->where('id', $id)->first();
		if (empty($data)) {
			return $this->failNotFound(NOT_FOUND);
		}
		$save['id'] = $id;
		$save['attachment'] = "";
		$timeoffModel->setAllowedFields(["attachment"]);
		$timeoffModel->save($save);

		if (!empty($data->attachment)) {
			if (file_exists(getModuleUploadPath($moduleName, $id) . "other/" . $data->attachment)) {
				unlink(getModuleUploadPath($moduleName, $id) . "other/" . $data->attachment);
			}
		}

		return $this->respondUpdated($id);
	}

	public function change_file_post()
	{
		$moduleName = 'time_off_requests';
		$modules = \Config\Services::modules($moduleName);
		$timeoffModel = $modules->model;
		$getPara = $this->request->getPost();
		$file = $this->request->getFiles()['file'];
		$id = $getPara['id'];
		$data = $timeoffModel->where('id', $id)->first();
		if (empty($data)) {
			return $this->failNotFound(NOT_FOUND);
		}
		if (!empty($data->attachment)) {
			if (file_exists(getModuleUploadPath($moduleName, $id) . "other/" . $data->attachment)) {
				unlink(getModuleUploadPath($moduleName, $id) . "other/" . $data->attachment);
			}
		}
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$storePath = getModuleUploadPath($moduleName, $id, false) . "other/";
		$result = $uploadService->uploadFile($storePath, [$file]);
		if (!empty($result)) {
			$timeoffModel->setAllowedFields(["attachment"]);
			$timeoffModel->save(['id' => $id, 'attachment' => $result['arr_upload_file'][0]['filename']]);
		}

		return $this->respondUpdated($id);
	}

	public function get_mytime_off_config_get()
	{
		$modules = \Config\Services::modules();
		$user = user();
		$user_id = $user->id;
		$user_group = $user->group_id;

		$data_type = $this->getTimeOffType($user_id, $user_group);

		$moduleName = 'employees';
		$modules->setModule($moduleName);
		$employees_model = $modules->model;
		$data_linemanager = $employees_model->where("id", $user_id)->select("line_manager")->first();
		$result_linemanager = handleDataBeforeReturn($moduleName, $data_linemanager);

		$moduleName = 'time_off_holidays';
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;
		$year = date('Y');
		$year_from = $year - 1;
		$year_to = $year + 1;
		$office = user()->office;
		$data_holiday = [];
		if (!empty($office)) {
			$data_holiday_ = $timeoffModel->where("$year_from <= year and year <= $year_to", null)->where("office_id", $office)->select("name, from_date, to_date")->findAll();
			foreach ($data_holiday_ as $item) {
				if (!empty($item->from_date) && !empty($item->to_date)) {
					$begin = new \DateTime($item->from_date);
					$end = new \DateTime($item->to_date);

					for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
						$data_holiday[] = $i->format("Y-m-d");
					}
				}
			}
		}

		$moduleName = 'employees';
		$modules->setModule($moduleName);
		$employees_model = $modules->model;
		$work_schedule_id = $employees_model->find($user_id)->work_schedule;
		$workScheduleModel = new WorkScheduleModel();
		$data_work = $workScheduleModel->findFormat($work_schedule_id);
		$moduleName = 'work_schedules';
		$modules->setModule($moduleName);
		$data_work = handleDataBeforeReturn($modules, $data_work);

		$out['data_type'] = $data_type;
		$out['data_linemanager'] = $result_linemanager;
		$out['holiday'] = $data_holiday;
		$out['work_schedule']['effective_date'] = $data_work['effective'];
		$out['work_schedule']['day'] = $data_work['day'];
		$out['work_schedule']['schedule_type'] = $data_work['type']['name_option'] ?? "";

		return $this->respond($out);
	}

	public function get_duration_allow_get($type)
	{
		$moduleName = 'time_off_policies';
		$modules = \Config\Services::modules();
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;
		$data = $timeoffModel->where("type", $type)->select("duration_allowed")->first();
		$duration_allow = handleDataBeforeReturn($moduleName, $data);

		// days remaining
		$user = user();
		$user_id = $user->id;
		$modules->setModule("time_off_balances");
		$balencesModel = $modules->model;
		$data_balances = $balencesModel->where("employee", $user_id)->where("type", $type)->select("balance, carryover_balance, entitlement")->first();
		$modules->setModule("time_off_policies");
		$timeoffPoliciesModel = $modules->model;
		$data_policies = $timeoffPoliciesModel->where('type', $type)->select("advanced_leave")->first();
		$advance_leave = 0;
		if ($data_policies) {
			$advance_leave = $data_policies->advanced_leave;
		}

		$day_balance = 0;
		$day_carryover_balance = 0;
		$day_advance_leave = 0;
		if ($data_balances) {
			$day_balance = $data_balances->balance;
			$day_carryover_balance = $data_balances->carryover_balance;
			if ($advance_leave == 1) {
				if ($data_balances->balance < 0) {
					$day_advance_leave = $data_balances->entitlement + $data_balances->balance;
				} else {
					$day_advance_leave = $data_balances->entitlement;
				}
			}
		}
		$request_carryover_balance = 0;
		$day_remaining = $day_advance_leave;
		if ($day_balance > 0) {
			$day_remaining = $day_balance;
		}
		if ($day_carryover_balance > 0) {
			$day_remaining = $day_carryover_balance;
			$request_carryover_balance = 1;
		}

		$out['duration_allow'] = $duration_allow;
		$out['day_remaining'] = round($day_remaining, 3);
		$out['day_balance'] = round($day_balance, 3);
		$out['day_carryover_balance'] = round($day_carryover_balance, 3);
		$out['day_advance_leave'] = round($day_advance_leave, 3);
		$out['advance_leave'] = $advance_leave;
		$out['request_carryover_balance'] = $request_carryover_balance;
		return $this->respond($out);
	}

	public function submit_request_post()
	{
		$getPara = $this->request->getPost();
		$file = $this->request->getFiles();
		$validation = \Config\Services::validation();
		$moduleName = 'time_off_requests';
		$modules = \Config\Services::modules();
		$modules->setModule($moduleName);
		$module = $modules->getModule();
		$timeOffModel = $modules->model;
		$dataHandleTimeoff = handleDataBeforeSave($modules, $getPara, $file);

		if (!empty($dataHandleTimeoff['validate'])) {
			if (!$validation->reset()->setRules($dataHandleTimeoff['validate'])->run($dataHandleTimeoff['data'])) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}

		$timeOffModel->setAllowedFields($dataHandleTimeoff['fieldsArray']);
		$dataHandleTimeoff['data']['status'] = 511;

		if ($dataHandleTimeoff['data']['radio'] == 'single') {
			if ($dataHandleTimeoff['data']['duration_allowed'] == 'hourly') {
				$dataHandleTimeoff['data']['date_from'] = $dataHandleTimeoff['data']['date_to'] = date("Y-m-d", strtotime($dataHandleTimeoff['data']['single_date_hourly']));
				$dataHandleTimeoff['data']['time_from'] = date('H:i', strtotime($dataHandleTimeoff['data']['single_timefrom_hourly']));
				$dataHandleTimeoff['data']['time_to'] = date('H:i', strtotime($dataHandleTimeoff['data']['single_timeto_hourly']));
			}

			if ($dataHandleTimeoff['data']['duration_allowed'] == 'halfday') {
				$dataHandleTimeoff['data']['date_from'] = $dataHandleTimeoff['data']['date_to'] = date("Y-m-d", strtotime($dataHandleTimeoff['data']['single_date_halfday']));
			}

			if ($dataHandleTimeoff['data']['duration_allowed'] == 'morningafternoon') {
				$dataHandleTimeoff['data']['date_from'] = $dataHandleTimeoff['data']['date_to'] = date("Y-m-d", strtotime($dataHandleTimeoff['data']['single_date_morningafternoon']));
			}
		}

		if ($dataHandleTimeoff['data']['radio'] == 'multiple') {
			$dataHandleTimeoff['data']['date_from'] = isset($dataHandleTimeoff['data']['multiple_date_from']) ? date("Y-m-d", strtotime($dataHandleTimeoff['data']['multiple_date_from'])) : "";
			$dataHandleTimeoff['data']['date_to'] = isset($dataHandleTimeoff['data']['multiple_date_to']) ? date("Y-m-d", strtotime($dataHandleTimeoff['data']['multiple_date_to'])) : "";
		}

		if ($dataHandleTimeoff['data']['total_day'] >= 1) {
			$dataHandleTimeoff['data']['is_full_day'] = 1;
		}
		$save = $dataHandleTimeoff['data'];

		// check duplicate
		$user_id = user()->id;
		$timeOffModel_check = $modules->model;
		$timeOffModel_check->where("created_by", $user_id);
		$timeOffModel_check->groupStart();
		$timeOffModel_check->orWhere("status", getOptionValue($module, "status", "pending"));
		$timeOffModel_check->orWhere("status", getOptionValue($module, "status", "approved"));
		$timeOffModel_check->groupEnd();
		if ($save['radio'] == 'single') {
			$date = $save['date_from'];
			$timeOffModel_check->where("date_from <= '$date' and '$date' <= date_to", null, false);
			$data_check = $timeOffModel_check->asArray()->findAll();
			if (!empty($data_check)) {
				foreach ($data_check as $item_check) {
					if (($item_check['time_from'] <= $save['time_from'] && $save['time_from'] < $item_check['time_to']) || ($item_check['time_from'] <= $save['time_to'] && $save['time_to'] < $item_check['time_to'])) {
						return $this->respond("error");
					}
				}
			}
		}

		if ($save['radio'] == 'multiple') {
			$datefrom = $save['date_from'];
			$dateto = $save['date_to'];
			$timeOffModel_check->groupStart();
			$timeOffModel_check->orWhere("(date_from <= '$datefrom' and '$datefrom' <= date_to)", null, false);
			$timeOffModel_check->orWhere("('$datefrom' <= date_from  and  date_to <= '$dateto')", null, false);
			$timeOffModel_check->orWhere("(date_from <= '$dateto' and '$dateto' <= date_to)", null, false);
			$timeOffModel_check->groupEnd();
			$data_check = $timeOffModel_check->select("id")->first();
			if (!empty($data_check)) {
				return $this->respond("error");
			}
		}

		$arr_approver = [];
		$arr_approver_id = [];
		if (!empty($save['line_manager'])) {
			$arr_approver[] = ['id' => $save['line_manager'], 'status' => 'pending', 'line_manager' => true];
			$arr_approver_id[] = $save['line_manager'];
		}
		if (!empty($getPara['approver_request'])) {
			foreach ($getPara['approver_request'] as $item) {
				$arr_approver[] = ['id' => $item, 'status' => 'pending'];
				$arr_approver_id[] = $item;
			}
		}
		$save['approver'] = json_encode($arr_approver);
		$save['approver_id'] = json_encode($arr_approver_id);

		try {
			$timeOffModel->save($save);
			$id = $timeOffModel->getInsertID();

			// file
			if (isset($file['attachment'][0])) {
				$uploadService = \App\Libraries\Upload\Config\Services::upload();
				$storePath = getModuleUploadPath($moduleName, $id, false) . "other/";
				$result = $uploadService->uploadFile($storePath, $file['attachment']);
				if (!empty($result)) {
					$timeOffModel->save(['id' => $id, 'attachment' => $result['arr_upload_file'][0]['filename']]);
				}
			}

			$type = $save['type'];
			$total_day = $save['total_day'];
			// balance
			$request_carryover_balance = $save['request_carryover_balance'];
			$modules->setModule("time_off_balances");
			$balanceModel = $modules->model;
			$data_balance_check = $balanceModel->where("employee", $user_id)->where("type", $type)->select("id, requested, balance, carryover_balance")->first();
			if (!empty($data_balance_check)) {
				$id_balance = $data_balance_check->id;
				$requested = $data_balance_check->requested;
				$balance = $data_balance_check->balance;
				$saveDataBalance['id'] = $id_balance;
				$saveDataBalance['requested'] = $requested + $total_day;
				if ($request_carryover_balance == 1) {
					$saveDataBalance['carryover_balance'] = $data_balance_check->carryover_balance - $total_day;
				} else {
					$saveDataBalance['balance'] = $balance - $total_day;
				}
				$balanceModel->setAllowedFields(["requested", "balance", "carryover_balance"]);
				$balanceModel->save($saveDataBalance);
			}

			// balance_event
			$date = $save['date_from'];
			$modules->setModule("time_off_balance_events");
			$balanceModelEvent = $modules->model;
			$module = $modules->getModule();
			$saveDataBalanceEvent['event'] = getOptionValue($module, "event", "take_time_off");
			$saveDataBalanceEvent['type'] = $type;
			$saveDataBalanceEvent['date'] = $date;
			$saveDataBalanceEvent['changed_by'] = $saveDataBalanceEvent['employee'] = $user_id;
			$saveDataBalanceEvent['change'] = $total_day * -1;
			$balanceModelEvent->setAllowedFields(["event", "type", "date", "changed_by", "change", "employee"]);
			$balanceModelEvent->save($saveDataBalanceEvent);

			//send mail
			$line_manager = $save['line_manager'];
			$moduleName = "time_off_types";
			$modules->setModule($moduleName);
			$type_model = $modules->model;
			$type_data = $type_model->find($save['type']);
			if ($type_data) {
				$type_name = $type_data->name;
			}
			if (!empty($line_manager)) {
				$moduleName = "employees";
				$modules->setModule($moduleName);
				$employees_model = $modules->model;
				$data_linemanager = $employees_model->find($line_manager);
				if (!empty($data_linemanager->email)) {
					$actual_link = $_ENV["app.siteURL"];
					$mail_date = "";
					if ($save['radio'] == 'single') {
						if ($save['duration_allowed'] == 'hourly') {
							$mail_time_from = $save['time_from'];
							$mail_time_to = $save['time_to'];
							$date_from = $save['date_from'];
						} else {
							$mail_time_from = $getPara['time_from'];
							$mail_time_to = $getPara['time_to'];
							$date_from = $save['date_from'];
						}
						$mail_date = $mail_time_from . " - " . $mail_time_to . " " . date('d/m/Y', strtotime($date_from));
					}
					if ($save['radio'] == 'multiple') {
						$mail_datefrom = date('d/m/Y', strtotime($save['date_from']));
						$mail_dateto = date('d/m/Y', strtotime($save['date_to']));
						$mail_date = $mail_datefrom . " - " . $mail_dateto;
					}

					$mail_link_team = "$actual_link/time-off/approval-time-off";
					$data_token = [
						"id" => $id,
						"id_send" => $user_id,
						"line_manager" => $line_manager
					];
					$data_token = json_encode($data_token);
					$token = $this->cryption('encrypt', $data_token);
					$mail_link_request_approve = "$actual_link/time-off/request-time-off?action=approve&token=$token";
					$mail_link_request_reject = "$actual_link/time-off/request-time-off?action=reject&token=$token";
					$mail_email = $data_linemanager->email;
					$mail_name = $data_linemanager->full_name;
					$mail_type = $type_name;
					$mail_total = $save['total_day'];
					$mail_node = $save['note'];
					$mail_name_send = user()->full_name;

					$mailSubject = "$mail_name_send submitted a time off request";
					$mailTo = $mail_email;

					$params = [
						'mail_date' => $mail_date,
						'mail_link_team' => $mail_link_team,
						'mail_link_request_approve' => $mail_link_request_approve,
						'mail_link_request_reject' => $mail_link_request_reject,
						'mail_name' => $mail_name,
						'mail_type' => $mail_type,
						'mail_total' => $mail_total,
						'mail_node' => $mail_node,
						'mail_name_send' => $mail_name_send,
						'mailSubject' => $mailSubject,
						'mailTo' => $mailTo,

					];
					\CodeIgniter\Events\Events::trigger('time_off_on_request', $params);
				}
			}

			// handle create event google calendar
			$resultGoogleCalendar = $this->_handleCreateEventGoogleCalendar($dataHandleTimeoff['data']);
			if (!empty($resultGoogleCalendar->id)) {
				$arrUpdateData = [
					'id' => $id,
					'google_calendar_event_id' => $resultGoogleCalendar->id
				];
				$timeOffModel->setAllowedFields(array_keys($arrUpdateData));
				$timeOffModel->save($arrUpdateData);
			}

			return $this->respondCreated($id);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}
	}

	public function get_delete_approver_get()
	{
		$getPara = $this->request->getGet();
		$idRequest = $getPara['idRequest'];
		$idApprover = $getPara['idApprover'];
		$modules = \Config\Services::modules("time_off_requests");
		$model = $modules->model;
		$dataRequest = $model->asArray()->select("approver")->find($idRequest);
		if (empty($dataRequest)) return $this->failNotFound(NOT_FOUND);
		if (!empty($dataRequest['approver']) && $dataRequest['approver'] != '[]') {
			$approver = json_decode($dataRequest['approver'], true);
			foreach ($approver as $key => $item) {
				if ($item['id'] == $idApprover) {
					unset($approver[$key]);
					break;
				}
			}
			$approver_id = [];
			foreach ($approver as $item) {
				$approver_id[] = $item['id'];
			}

			try {
				$model->setAllowedFields(["approver", "approver_id"]);
				$model->save(['id' => $idRequest, 'approver' => json_encode($approver), 'approver_id' => json_encode($approver_id)]);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE);
			}
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_add_approver_get()
	{
		$getPara = $this->request->getGet();
		$id_add_approver = $getPara['id_add_approver'];
		$approver_request = $getPara['approver_request'];
		$modules = \Config\Services::modules("time_off_requests");
		$model = $modules->model;
		$dataRequest = $model->asArray()->select("approver, approver_id")->find($id_add_approver);
		if (empty($dataRequest)) return $this->failNotFound(NOT_FOUND);
		if (!empty($dataRequest['approver']) && $dataRequest['approver'] != '[]') {
			$approver = json_decode($dataRequest['approver'], true);
		} else {
			$approver = [];
		}
		foreach ($approver_request as $id) {
			$check_dup = false;
			foreach ($approver as $item) {
				if ($id == $item['id']) {
					$check_dup = true;
					break;
				}
			}
			if (!$check_dup) {
				$approver[] = ['id' => $id, 'status' => 'pending'];
			}
		}
		$approver_id = [];
		foreach ($approver as $item) {
			$approver_id[] = $item['id'];
		}

		try {
			$model->setAllowedFields(["approver", "approver_id"]);
			$model->save(['id' => $id_add_approver, 'approver' => json_encode($approver), 'approver_id' => json_encode($approver_id)]);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function get_mail_request_get()
	{
		$modules = \Config\Services::modules();
		$getPara = $this->request->getGet();

		if (isset($getPara['token']) && isset($getPara['action'])) {
			$token = $getPara['token'];
			$action = $getPara['action'];
			if ($action != "approve" && $action != "reject") {
				$out['fail'] = true;
				$out['error'] = "error";
				$out['mess'] = "error action";
				return $this->respond($out);
			}

			$data = $this->cryption('decrypt', $token);
			$data = json_decode($data);

			if (!isset($data->id) || !isset($data->line_manager) || !isset($data->id_send)) {
				$out['fail'] = true;
				$out['error'] = "error";
				$out['mess'] = "error data token";
				return $this->respond($out);
			} else {
				$id = $data->id;
				$line_manager = $data->line_manager;
				$id_send = $data->id_send;

				$moduleName = 'employees';
				$modules->setModule($moduleName);
				$employeeModel = $modules->model;
				$data_employee = $employeeModel->find($line_manager);

				$moduleName = 'time_off_requests';
				$modules->setModule($moduleName);
				$timeoffModel = $modules->model;
				$module = $modules->getModule();
				$data_timeoff = $timeoffModel->find($id);

				if (!empty($data_timeoff) && !empty($data_employee)) {
					if ($data_timeoff->status != getOptionValue($module, "status", "pending")) {
						$out['fail'] = true;
						$out['error'] = "updated";
						$out['mess'] = "error updated";
						return $this->respond($out);
					} else {
						if ($action == 'approve') {
							if (!empty($data_timeoff->approver) && $data_timeoff->approver != '[]') {
								$approver = json_decode($data_timeoff->approver, true);
								$count_approver = 0;
								$count_approved = 0;
								foreach ($approver as $key => $item) {
									$count_approver++;
									if ($item['status'] == 'approved') {
										$count_approved++;
									}
									if ($item['id'] == $line_manager) {
										$approver[$key]['status'] = "approved";
										$count_approved++;
									}
								}
								$save['approver'] = json_encode($approver);
								if ($count_approver == $count_approved) {
									$save['status'] = getOptionValue($module, "status", "approved");
								}
							}
						}

						if ($action == 'reject') {
							$save['status'] = getOptionValue($module, "status", "rejected");
						}

						$save['id'] = $id;
						//$save['status'] = $status;
						$save['action_by'] = $line_manager;
						$save['action_at'] = date("Y-m-d H:i:s");

						$timeoffModel->setAllowedFields(["status", "action_by", "action_at", "approver"]);
						$timeoffModel->save($save);

						if ($action == 'reject') {
							$type = $data_timeoff->type;
							$total_day = $data_timeoff->total_day;
							// balance
							$modules->setModule("time_off_balances");
							$balanceModel = $modules->model;
							$data_balance_check = $balanceModel->where("employee", $id_send)->where("type", $type)->select("id, requested, balance")->first();
							if (!empty($data_balance_check)) {
								$id_banlance = $data_balance_check->id;
								$requested = $data_balance_check->requested;
								$balance = $data_balance_check->balance;
								$saveDataBalance['id'] = $id_banlance;
								$saveDataBalance['requested'] = $requested - $total_day;
								$saveDataBalance['balance'] = $balance + $total_day;
								$balanceModel->setAllowedFields(["requested", "balance"]);
								$balanceModel->save($saveDataBalance);
							}

							// balance_event
							$date = $data_timeoff->date_from;
							$modules->setModule("time_off_balance_events");
							$balanceModelEvent = $modules->model;
							$balanceModelEvent->where("employee", $id_send)->where("type", $type)->where("date", $date)->delete();
						}

						// send mail
						if ($data_timeoff->time_from == '00:00:00') {
							$mail_datefrom = date('d/m/Y', strtotime($data_timeoff->date_from));
							$mail_dateto = date('d/m/Y', strtotime($data_timeoff->date_to));
							$mail_date = "from $mail_datefrom to $mail_dateto";
						} else {
							$date = date('d/m/Y', strtotime($data_timeoff->date_from));
							$day = round($data_timeoff->total_day, 3);
							$mail_date = "for $day days on $date";
						}

						$actual_link = $_ENV["app.siteURL"];
						$mail_link_team = "$actual_link/time-off/my-time-off";

						$moduleName = 'employees';
						$modules->setModule($moduleName);
						$employeeModel = $modules->model;
						$data_employee_request = $employeeModel->find($data_timeoff->created_by);
						$mail_to = $data_employee_request->email;
						$mail_name = $data_employee_request->full_name;
						$mail_name_send = $data_employee->full_name;
						$action_status = $action == 'reject' ? "Rejected" : "Approved";
						$mailSubject = "Time Off Request $action_status";

						$bcc = [];
						/*if (!empty($data_timeoff->notify) && $data_timeoff->notify != '[]') {
							$noti = json_decode($data_timeoff->notify, true);
							$data_noti = $employeeModel->whereIn('id', $noti)->findAll();
							foreach ($data_noti as $item_noti) {
								$bcc[] = $item_noti->email;
							}
						}*/

						$params = [
							'status' => $action_status,
							'mail_name' => $mail_name,
							'mail_name_send' => $mail_name_send,
							'mail_date' => $mail_date,
							'mail_link_team' => $mail_link_team,
							'mailSubject' => $mailSubject,
							'mail_to' => $mail_to,
							'bcc' => $bcc
						];
						\CodeIgniter\Events\Events::trigger('time_off_on_mail_notification', $params);

						$out['fail'] = false;
						$out['error'] = "";
						$out['mess'] = "success";
						return $this->respond($out);
					}
				} else {
					$out['fail'] = true;
					$out['error'] = "error";
					$out['mess'] = "error data query";
					return $this->respond($out);
				}
			}
		}

		$out['fail'] = true;
		$out['error'] = "error";
		$out['mess'] = "error params";
		return $this->respond($out);
	}

	public function get_balance_history_get()
	{
		$getPara = $this->request->getGet();
		$user_id = user()->id;

		$out = $this->getTimeOffBalanceHistory($user_id, $getPara);

		return $this->respond($out);
	}

	public function get_cancel_get()
	{
		$getPara = $this->request->getGet();
		$id = $getPara['id'];
		$action_type = $getPara['type'];

		return $this->CancelRequest($id, $action_type);
	}

	public function get_reject_get()
	{
		$getPara = $this->request->getGet();
		$id = $getPara['id'];
		$action_type = $getPara['type'];

		return $this->RejectRequest($id, $action_type);
	}

	public function get_approve_get()
	{
		$getPara = $this->request->getGet();
		$id = $getPara['id'];
		$action_type = $getPara['type'];

		return $this->ApproveRequest($id, $action_type);
	}

	public function get_team_time_off_get()
	{
		if (!hasModulePermit("time_off", 'accessTeamTimeOff')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$modules = \Config\Services::modules();
		$getPara = $this->request->getGet();
		$user_id = user()->id;
		$moduleName = 'employees';
		$modules->setModule($moduleName);
		$employeeModel = $modules->model;
		helper('HRM\Modules\Employees\Helpers\employee_helper');
		$data_rank = getEmployeesByRank($user_id, "subordinate", $employeeModel);
		unset($data_rank[$user_id]);
		$key_data_rank = array_keys($data_rank);
		$key_data_rank[] = 0;

		$moduleName = 'time_off_requests';
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;
		$timeoffModel->whereIn("created_by", $key_data_rank);

		return $this->respond($this->_handleGetDataTable('team', $getPara, $timeoffModel, '', $data_rank));
	}

	public function get_approval_time_off_get()
	{
		if (!hasModulePermit("time_off", 'accessApprovalTimeOff')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);

		$modules = \Config\Services::modules();
		$getPara = $this->request->getGet();
		$user_id = user()->id;
		$moduleName = 'time_off_requests';
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;
		$timeoffModel->where(handleJsonQueryString("approver_id", $user_id));

		return $this->respond($this->_handleGetDataTable('approval', $getPara, $timeoffModel));
	}

	public function get_employee_time_off_request_get()
	{
		if (!hasModulePermit("time_off", 'accessEmployeeTimeOff')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);

		$getPara = $this->request->getGet();

		return $this->respond($this->getEmployeeTimeOffRequestTable($getPara));
	}

	public function get_employee_time_off_carousel_get()
	{
		$getPara = $this->request->getGet();
		$user_id = $getPara['id_user_select'];
		$modules = \Config\Services::modules();
		$modules->setModule("employees");
		$employeeModel = $modules->model;
		$data_employee = $employeeModel->find($user_id);
		if (empty($data_employee)) {
			return $this->failNotFound(NOT_FOUND);
		}
		$user_group = $data_employee->group_id;
		$result = $this->getTimeOffCarousel($user_id, $user_group);

		return $this->respond($result);
	}

	public function get_employee_time_off_balance_history_get()
	{
		$getPara = $this->request->getGet();
		$user_id = $getPara['id_user_select'];

		$out = $this->getTimeOffBalanceHistory($user_id, $getPara);

		return $this->respond($out);
	}

	public function get_employee_time_off_add_adjustment_config_get()
	{
		$getPara = $this->request->getGet();
		$user_id = $getPara['id_user_select'];
		$modules = \Config\Services::modules();
		$modules->setModule("employees");
		$employeeModel = $modules->model;
		$data_employee = $employeeModel->find($user_id);
		if (empty($data_employee)) {
			return $this->failNotFound(NOT_FOUND);
		}
		$user_group = $data_employee->group_id;
		$data_type = $this->getTimeOffType($user_id, $user_group);

		$data_employee_['avatar'] = $data_employee->avatar;
		$data_employee_['full_name'] = $data_employee->full_name;

		$out['data_type'] = $data_type;
		$out['data_employee'] = $data_employee_;

		return $this->respond($out);
	}

	public function get_employee_time_off_change_type_get()
	{
		$getPara = $this->request->getGet();
		$user_id = $getPara['id_user_select'];
		$type = $getPara['type'];
		$modules = \Config\Services::modules();
		$modules->setModule("time_off_balances");
		$balencesModel = $modules->model;
		$data_balances = $balencesModel->where("employee", $user_id)->where("type", $type)->select("balance, carryover_balance")->first();
		$balance = 0;
		$carry_over_balance = 0;
		if ($data_balances) {
			$balance = round($data_balances->balance, 3);
			$carry_over_balance = round($data_balances->carryover_balance, 3);
		}

		return $this->respond(['balance' => $balance, "carry_over_balance" => $carry_over_balance]);
	}

	public function employee_time_off_submit_adjustment_post()
	{
		$getPara = $this->request->getPost();
		$user_id = $getPara['id_user_select'];
		$type = $getPara['type'];
		$adjustment = $getPara['adjustment'];
		$total_day = $getPara['total_day'];

		$modules = \Config\Services::modules();
		$moduleName = 'time_off_balances';
		$modules->setModule($moduleName);
		$balanceModel = $modules->model;
		$data_balance = $balanceModel->where("employee", $user_id)->where("type", $type)->first();
		if ($data_balance) {
			$save_balance['id'] = $data_balance->id;
			$save_balance['balance'] = ($adjustment == 'add') ? ($data_balance->balance + $total_day) : ($data_balance->balance - $total_day);
			$balanceModel->setAllowedFields(["balance"]);
			$balanceModel->save($save_balance);
		}

		$moduleName = 'time_off_balance_events';
		$modules->setModule($moduleName);
		$module = $modules->getModule();
		$balanceEventModel = $modules->model;
		if ($adjustment == 'add') {
			$balance = $total_day;
		} else {
			$balance = $total_day * -1;
		}
		$save_balance_event['date'] = date("Y-m-d");
		$save_balance_event['event'] = getOptionValue($module, "event", "balanceadjustment");
		$save_balance_event['type'] = $type;
		$save_balance_event['changed_by'] = user()->id;
		$save_balance_event['change'] = $balance;
		$save_balance_event['employee'] = $user_id;
		$balanceEventModel->setAllowedFields(["date", "event", "type", "changed_by", "change", "employee"]);
		$balanceEventModel->save($save_balance_event);

		return $this->respond($user_id);
	}

	public function export_excel_get()
	{
		$getPara = $this->request->getGet();

		$data = $this->getEmployeeTimeOffRequestTable($getPara, 'export_excel');
		$data_table = $data['data'];

		/*alphabet A to F*/
		$arr_alphabet = [];
		foreach (range('A', 'F') as $columnId) {
			$arr_alphabet[] = $columnId;
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
		$sheet->getStyle("A$i:F$i")->applyFromArray($styleArray);
		$sheet->setCellValue("A$i", "Name");
		$sheet->setCellValue("B$i", "From");
		$sheet->setCellValue("C$i", "To");
		$sheet->setCellValue("D$i", "Total");
		$sheet->setCellValue("E$i", "Type");
		$sheet->setCellValue("F$i", "Status");

		$i = 2;
		foreach ($data_table as $item) {
			$sheet->getStyle("B$i:C$i")->getNumberFormat()->setFormatCode('dd-mmm-yyyy');
			$sheet->getStyle("B$i:C$i")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
			$sheet->setCellValue("A$i", $item->employee['full_name'] ?? "-");
			$sheet->setCellValue("B$i", date('d/m/Y', strtotime($item->date_from)));
			$sheet->setCellValue("C$i", date('d/m/Y', strtotime($item->date_to)));
			$sheet->setCellValue("D$i", $item->total_day);
			$sheet->setCellValue("E$i", $item->type['label'] ?? "-");
			$sheet->setCellValue("F$i", isset($item->status['name_option']) ? strtoupper($item->status['name_option']) : "-");

			$i++;
		}

		foreach ($arr_alphabet as $columnId) {
			if ($columnId == 'A') {
				$sheet->getColumnDimension($columnId)->setWidth(30);
				continue;
			}
			$sheet->getColumnDimension($columnId)->setWidth(20);
		}

		/*export excel*/
		$writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		$writer->save('php://output');

		exit;
	}

	public function load_current_user_get()
	{
		$googleService = \App\Libraries\Google\Config\Services::google();
		$result = $googleService->getInfoUserSyncedGoogle();

		return $this->respond($result);
	}

	public function create_google_access_token_post()
	{
		$modules = \Config\Services::modules();

		$googleService = \App\Libraries\Google\Config\Services::google();
		$googleClient = $googleService->client();

		$data = $this->request->getPost();

		$redirectUri = 'http://localhost:3000';
		$googleClient->setRedirectUri($redirectUri);
		$token = $googleClient->fetchAccessTokenWithAuthCode($data['code']);
		// save access token to user
		$result = $googleService->handleInsertToken($modules, $token);
		if ($result != true) {
			return $this->fail($result);
		}

		// sync calendar greater or equal today
		$modules->setModule('time_off_requests');
		$modelTimeOffRequest = $modules->model;
		$listTimeOffRequest = $modelTimeOffRequest
			->asArray()
			->select([
				'id',
				'date_from',
				'time_from',
				'date_to',
				'time_to',
				'note'
			])
			->where('date_from >=', date('Y-m-d'))
			->findAll();
		if (count($listTimeOffRequest) > 0) {
			$arrUpdate = [];
			$googleClient->setAccessToken($token['access_token']);
			$services = new Google_Service_Calendar($googleClient);
			foreach ($listTimeOffRequest as $rowTimeOffRequest) {
				$resultGoogleCalendar = $this->_handleCreateEventGoogleCalendar($rowTimeOffRequest, $services);
				if (!empty($resultGoogleCalendar->id)) {
					$arrUpdate[] = [
						'id' => $rowTimeOffRequest['id'],
						'google_calendar_event_id' => $resultGoogleCalendar->id
					];
				}
			}

			if (count($arrUpdate) > 0) {
				$modules->setModule('time_off_requests');
				$model = $modules->model;

				$model->setAllowedFields([
					'id',
					'google_calendar_event_id'
				]);
				$model->updateBatch($arrUpdate, 'id');
			}
		}

		return $this->respond(ACTION_SUCCESS);
	}

	public function toggle_sync_google_calendar_post()
	{
		$modules = \Config\Services::modules('users');
		$model = $modules->model;

		$currentUser = user();
		$googleLinked = json_decode($currentUser->google_linked, true);

		$googleLinked['sync_calendar_status'] = ($googleLinked['sync_calendar_status'] == 1) ? 0 : 1;

		$arrUpdateData = [
			'id' => $currentUser->id,
			'google_linked' => json_encode($googleLinked)
		];

		$model->setAllowedFields(array_keys($arrUpdateData));
		$model->save($arrUpdateData);

		return $this->respond([
			'sync_calendar_status' => $googleLinked['sync_calendar_status']
		]);
	}

	/** support function */
	private function getTimeOffCarousel($user_id, $user_group)
	{
		$modules = \Config\Services::modules();
		$modules->setModule("time_off_balances");
		$balencesModel = $modules->model;
		$data_balances = $balencesModel->where("employee", $user_id)->select("type,entitlement,requested,balance,carryover,carryover_balance")->findAll();

		$modules->setModule("time_off_types");
		$typeModel = $modules->model;
		$typeModel->where("m_time_off_types.active", 1);
		$typeModel->groupStart();
		$typeModel->where("JSON_SEARCH(m_time_off_policies.eligibility_employee, 'all', '{$user_id}', null, '$[*]') IS NOT NULL");
		if (!empty($user_group)) {
			$typeModel->orWhere("m_time_off_policies.group_id", $user_group);
		}
		$typeModel->groupEnd();
		$data_type = $typeModel->select("m_time_off_types.paid, m_time_off_policies.type, m_time_off_policies.accrual_frequency, m_time_off_policies.prorate_accrual, m_time_off_policies.maximum_carry_over, m_time_off_policies.carry_over_expiration_month, m_time_off_policies.carry_over_expiration_date, m_time_off_policies.advanced_leave")->join('m_time_off_policies', 'm_time_off_policies.type = m_time_off_types.id')->orderBy("m_time_off_policies.type")->findAll();
		$modules->setModule("time_off_policies");
		$data_type = handleDataBeforeReturn($modules, $data_type, true);

		$data_type_out = [];
		$data_type_detail_out = [];
		foreach ($data_type as $item) {
			$data_type_out[$item->type['value']]['type'] = $item->type['value'];
			$data_type_out[$item->type['value']]['name'] = $item->type['label'];
			$data_type_out[$item->type['value']]['balance'] = 0;

			$data_type_detail_out[$item->type['value']]['name'] = $item->type['label'];
			$data_type_detail_out[$item->type['value']]['paid'] = $item->paid;
			$data_type_detail_out[$item->type['value']]['accrual_frequency'] = isset($item->accrual_frequency['label']) ? $item->accrual_frequency['label'] : "";
			$data_type_detail_out[$item->type['value']]['prorate_accrual'] = $item->prorate_accrual ? 1 : 0;
			$data_type_detail_out[$item->type['value']]['maximum_carry_over'] = $item->maximum_carry_over;
			$data_type_detail_out[$item->type['value']]['carry_over_expiration_month'] = $item->carry_over_expiration_month;
			$data_type_detail_out[$item->type['value']]['carry_over_expiration_date'] = $item->carry_over_expiration_date;
			$data_type_detail_out[$item->type['value']]['advanced_leave'] = $item->advanced_leave ? 1 : 0;

			if (empty($data_type_detail_out[$item->type['value']]['entitlement'])) $data_type_detail_out[$item->type['value']]['entitlement'] = 0;
			if (empty($data_type_detail_out[$item->type['value']]['carryover'])) $data_type_detail_out[$item->type['value']]['carryover'] = 0;
			if (empty($data_type_detail_out[$item->type['value']]['requested'])) $data_type_detail_out[$item->type['value']]['requested'] = 0;
			if (empty($data_type_detail_out[$item->type['value']]['carryover_balance'])) $data_type_detail_out[$item->type['value']]['carryover_balance'] = 0;
			if (empty($data_type_detail_out[$item->type['value']]['balance'])) $data_type_detail_out[$item->type['value']]['balance'] = 0;
		}

		foreach ($data_balances as $item) {
			if (isset($data_type_out[$item->type])) {
				$data_type_out[$item->type]['balance'] = round($item->balance, 3) + round($item->carryover_balance, 3);
			}

			$data_type_detail_out[$item->type]['entitlement'] = round($item->entitlement, 3);
			$data_type_detail_out[$item->type]['carryover'] = round($item->carryover, 3);
			$data_type_detail_out[$item->type]['requested'] = round($item->requested, 3);
			$data_type_detail_out[$item->type]['carryover_balance'] = round($item->carryover_balance, 3);
			$data_type_detail_out[$item->type]['balance'] = round($item->balance, 3);
		}

		$arr_type = [];
		foreach ($data_type_out as $item) {
			$arr_type[] = $item;
		}
		$count_type = count($arr_type);
		$count_type_2 = ceil($count_type / 4);

		$arr_type_out = [];
		for ($i = 1; $i <= $count_type_2; $i++) {
			$start = ($i - 1) * 4;
			$end = $start + 4;
			for ($j = $start; $j < $end; $j++) {
				if (isset($arr_type[$j])) {
					$arr_type_out[$i][] = $arr_type[$j];
				}
			}
		}

		$result['data_type'] = $arr_type_out;
		$result['data_type_detail'] = $data_type_detail_out;

		return $result;
	}

	private function filterRequest($timeoffModel, $getPara)
	{
		if (!empty($getPara['filter_type'])) {
			$timeoffModel->where("type", $getPara['filter_type']);
		}
		if (!empty($getPara['filter_status'])) {
			$timeoffModel->where("status", $getPara['filter_status']);
		}
		if (!empty($getPara['filter_datefrom']) && !empty($getPara['filter_dateto'])) {
			$datefrom = $getPara['filter_datefrom'];
			$dateto = $getPara['filter_dateto'];
			$timeoffModel->groupStart();
			$timeoffModel->orWhere("(date_from <= '$datefrom' and '$datefrom' <= date_to)", null, false);
			$timeoffModel->orWhere("('$datefrom' <= date_from  and  date_to <= '$dateto')", null, false);
			$timeoffModel->orWhere("(date_from <= '$dateto' and '$dateto' <= date_to)", null, false);
			$timeoffModel->groupEnd();
		}

		return $timeoffModel;
	}

	private function sortRequest($getPara)
	{
		$sort_field = "date_from";
		$sort_order = "desc";
		if (!empty($getPara['sorter']['order']) && $getPara['sorter']['order'] != 'undefined') {
			$sort_field_get = $getPara['sorter']['field'];
			if ($sort_field_get == "from") {
				$sort_field = "date_from";
			} elseif ($sort_field_get == "to") {
				$sort_field = "date_to";
			} elseif ($sort_field_get == "total") {
				$sort_field = "total_day";
			} elseif ($sort_field_get == "type") {
				$sort_field = "type";
			} elseif ($sort_field_get == "status") {
				$sort_field = "status";
			}
			if ($getPara['sorter']['order'] == 'ascend') {
				$sort_order = "asc";
			} else {
				$sort_order = "desc";
			}
		}

		return ['sort_field' => $sort_field, 'sort_order' => $sort_order];
	}

	private function getTimeOffType($user_id, $user_group)
	{
		$modules = \Config\Services::modules();
		$moduleName = 'time_off_types';
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;

		$timeoffModel->where("m_time_off_types.active", 1);
		$timeoffModel->groupStart();
		$timeoffModel->where("JSON_SEARCH(m_time_off_policies.eligibility_employee, 'all', '{$user_id}', null, '$[*]') IS NOT NULL");
		if (!empty($user_group)) {
			$timeoffModel->orWhere("m_time_off_policies.group_id", $user_group);
		}
		$timeoffModel->groupEnd();
		$data_type = $timeoffModel->select("m_time_off_types.id as value, m_time_off_types.name as label")->join('m_time_off_policies', 'm_time_off_policies.type = m_time_off_types.id')->orderBy("m_time_off_types.id", "desc")->findAll();

		return $data_type;
	}

	private function getTimeOffBalanceHistory($user_id, $getPara)
	{
		$moduleName = 'time_off_balance_events';
		$modules = \Config\Services::modules($moduleName);
		$timeoffModel = $modules->model;

		$timeoffModel->where("employee", $user_id);
		if (!empty($getPara['filter_type'])) {
			$timeoffModel->where("type", $getPara['filter_type']);
		}
		if (!empty($getPara['filter_datefrom']) && !empty($getPara['filter_dateto'])) {
			$datefrom = $getPara['filter_datefrom'];
			$dateto = $getPara['filter_dateto'];
			$timeoffModel->where("date >= '$datefrom'", null, false);
			$timeoffModel->where("date <= '$dateto'", null, false);
		}
		$recordsTotal = $timeoffModel->countAllResults(false);

		$page = $getPara['pagination_balance']['current'];
		$length = $getPara['pagination_balance']['pageSize'];
		$start = ($page - 1) * $length;

		$data = $timeoffModel->select('*')->orderBy("date", "desc")->orderBy("id", "desc")->findAll($length, $start);
		$data = handleDataBeforeReturn($modules, $data, true);

		$out['total'] = $recordsTotal;
		$out['data'] = $data;

		return $out;
	}

	private function cryption($type, $data, $ciphering = "AES-256-CTR", $encryption_key = 'support@friday.vn', $options = 0, $encryption_iv = '1234567891011121')
	{
		$out = '';
		if ($type == 'encrypt') {
			$out = openssl_encrypt(
				$data,
				$ciphering,
				$encryption_key,
				$options,
				$encryption_iv
			);
		}
		if ($type == 'decrypt') {
			$out = openssl_decrypt(
				$data,
				$ciphering,
				$encryption_key,
				$options,
				$encryption_iv
			);
		}

		return $out;
	}

	private function CancelRequest($id, $action_type)
	{
		if ($action_type != 'team' && $action_type != 'employee' && $action_type != 'request' && $action_type != 'approval') {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		if ($action_type == 'employee' && !hasModulePermit("time_off", 'accessEmployeeTimeOff')) {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		if ($action_type == 'approval' && !hasModulePermit("time_off", 'accessApprovalTimeOff')) {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}

		$modules = \Config\Services::modules();
		$moduleName = 'time_off_requests';
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;
		$module = $modules->getModule();
		$user_id = user()->id;
		$data = $timeoffModel->find($id);
		$googleCalendarEventId = $data->google_calendar_event_id;
		if (empty($data)) {
			return $this->failNotFound(NOT_FOUND);
		}
		if ($action_type == 'request' && $data->created_by != $user_id) {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		if ($action_type == 'team') {
			$moduleName = 'employees';
			$modules->setModule($moduleName);
			$employeeModel = $modules->model;
			helper('HRM\Modules\Employees\Helpers\employee_helper');
			$data_rank = getEmployeesByRank($user_id, "subordinate", $employeeModel);
			unset($data_rank[$user_id]);
			$arr_rank = array_keys($data_rank);
			$arr_rank[] = 0;
			if (!in_array($data->created_by, $arr_rank) || !hasModulePermit("time_off", 'accessTeamTimeOff')) {
				return $this->failNotFound(MISSING_UPDATE_PERMISSION);
			}
		}

		$save['id'] = $id;
		$save['status'] = getOptionValue($module, "status", "cancelled");
		$save['action_by'] = $user_id;
		$save['action_at'] = date("Y-m-d H:i:s");
		$save['google_calendar_event_id'] = "";
		$timeoffModel->setAllowedFields(["status", "action_by", "action_at", "google_calendar_event_id"]);
		$timeoffModel->save($save);

		$type = $data->type;
		$total_day = $data->total_day;
		$user_request = $data->created_by;
		// balance
		$modules->setModule("time_off_balances");
		$balanceModel = $modules->model;
		$data_balance_check = $balanceModel->where("employee", $user_request)->where("type", $type)->select("id, requested, balance, carryover_balance")->first();
		if (!empty($data_balance_check)) {
			$request_carryover_balance = $data->request_carryover_balance;
			$id_balance = $data_balance_check->id;
			$requested = $data_balance_check->requested;
			$balance = $data_balance_check->balance;
			$saveDataBalance['id'] = $id_balance;
			$saveDataBalance['requested'] = $requested - $total_day;
			if ($request_carryover_balance == 1) {
				$saveDataBalance['carryover_balance'] = $data_balance_check->carryover_balance + $total_day;
			} else {
				$saveDataBalance['balance'] = $balance + $total_day;
			}
			$balanceModel->setAllowedFields(["requested", "balance", "carryover_balance"]);
			$balanceModel->save($saveDataBalance);
		}

		// balance_event
		$date = $data->date_from;
		$modules->setModule("time_off_balance_events");
		$balanceModelEvent = $modules->model;
		$balanceModelEvent->where("employee", $user_request)->where("type", $type)->where("date", $date)->delete();

		// send mail
		if ($action_type == 'team' || $action_type == 'employee' || $action_type == 'approval') {
			if ($data->time_from == '00:00:00') {
				$mail_datefrom = date('d/m/Y', strtotime($data->date_from));
				$mail_dateto = date('d/m/Y', strtotime($data->date_to));
				$mail_date = "from $mail_datefrom to $mail_dateto";
			} else {
				$date = date('d/m/Y', strtotime($data->date_from));
				$day = round($data->total_day, 3);
				$mail_date = "for $day days on $date";
			}

			$actual_link = $_ENV["app.siteURL"];
			$mail_link_team = "$actual_link/time-off/my-time-off";

			$moduleName = 'employees';
			$modules->setModule($moduleName);
			$employeeModel = $modules->model;
			$data_employee = $employeeModel->find($data->created_by);
			$mail_to = $data_employee->email;
			$mail_name = $data_employee->full_name;
			$mail_name_send = user()->full_name;
			$mailSubject = "Time Off Request Cancelled";

			$bcc = [];
			/*if (!empty($data->notify) && $data->notify != '[]') {
				$noti = json_decode($data->notify, true);
				$data_noti = $employeeModel->whereIn('id', $noti)->findAll();
				foreach ($data_noti as $item_noti) {
					$bcc[] = $item_noti->email;
				}
			}*/

			$params = [
				'status' => "Cancelled",
				'mail_name' => $mail_name,
				'mail_name_send' => $mail_name_send,
				'mail_date' => $mail_date,
				'mail_link_team' => $mail_link_team,
				'mailSubject' => $mailSubject,
				'mail_to' => $mail_to,
				'bcc' => $bcc
			];
			\CodeIgniter\Events\Events::trigger('time_off_on_mail_notification', $params);
		}

		// delete google calendar event
		if (!empty($googleCalendarEventId)) {
			$this->_handleDeleteEventGoogleCalendar($googleCalendarEventId);
		}

		return $this->respondUpdated($id);
	}

	private function RejectRequest($id, $action_type)
	{
		if ($action_type != 'team' && $action_type != 'employee' && $action_type != 'approval') {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		if ($action_type == 'employee' && !hasModulePermit("time_off", 'accessEmployeeTimeOff')) {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		if ($action_type == 'approval' && !hasModulePermit("time_off", 'accessApprovalTimeOff')) {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}

		$moduleName = 'time_off_requests';
		$modules = \Config\Services::modules($moduleName);
		$timeoffModel = $modules->model;
		$module = $modules->getModule();
		$user_id = user()->id;
		$data = $timeoffModel->find($id);
		$googleCalendarEventId = $data->google_calendar_event_id;
		if (empty($data)) {
			return $this->failNotFound(NOT_FOUND);
		}
		if ($action_type == 'team') {
			$moduleName = 'employees';
			$modules->setModule($moduleName);
			$employeeModel = $modules->model;
			helper('HRM\Modules\Employees\Helpers\employee_helper');
			$data_rank = getEmployeesByRank($user_id, "subordinate", $employeeModel);
			unset($data_rank[$user_id]);
			$arr_rank = array_keys($data_rank);
			$arr_rank[] = 0;
			if (!in_array($data->created_by, $arr_rank) || !hasModulePermit("time_off", 'accessTeamTimeOff')) {
				return $this->failNotFound(MISSING_UPDATE_PERMISSION);
			}
		}

		$save['id'] = $id;
		$save['status'] = getOptionValue($module, "status", "rejected");
		$save['action_by'] = $user_id;
		$save['action_at'] = date("Y-m-d H:i:s");
		$save['google_calendar_event_id'] = "";
		$timeoffModel->setAllowedFields(["status", "action_by", "action_at", "google_calendar_event_id"]);
		$timeoffModel->save($save);

		$type = $data->type;
		$total_day = $data->total_day;
		$user_request = $data->created_by;
		// balance
		$modules->setModule("time_off_balances");
		$balanceModel = $modules->model;
		$data_balance_check = $balanceModel->where("employee", $user_request)->where("type", $type)->select("id, requested, balance, carryover_balance")->first();
		if (!empty($data_balance_check)) {
			$request_carryover_balance = $data->request_carryover_balance;
			$id_balance = $data_balance_check->id;
			$requested = $data_balance_check->requested;
			$balance = $data_balance_check->balance;
			$saveDataBalance['id'] = $id_balance;
			$saveDataBalance['requested'] = $requested - $total_day;
			if ($request_carryover_balance == 1) {
				$saveDataBalance['carryover_balance'] = $data_balance_check->carryover_balance + $total_day;
			} else {
				$saveDataBalance['balance'] = $balance + $total_day;
			}
			$balanceModel->setAllowedFields(["requested", "balance", "carryover_balance"]);
			$balanceModel->save($saveDataBalance);
		}

		// balance_event
		$date = $data->date_from;
		$modules->setModule("time_off_balance_events");
		$balanceModelEvent = $modules->model;
		$balanceModelEvent->where("employee", $user_request)->where("type", $type)->where("date", $date)->delete();

		// send mail
		if ($action_type == 'team' || $action_type == 'employee' || $action_type == 'approval') {
			if ($data->time_from == '00:00:00') {
				$mail_datefrom = date('d/m/Y', strtotime($data->date_from));
				$mail_dateto = date('d/m/Y', strtotime($data->date_to));
				$mail_date = "from $mail_datefrom to $mail_dateto";
			} else {
				$date = date('d/m/Y', strtotime($data->date_from));
				$day = round($data->total_day, 3);
				$mail_date = "for $day days on $date";
			}

			$actual_link = $_ENV["app.siteURL"];
			$mail_link_team = "$actual_link/time-off/my-time-off";

			$moduleName = 'employees';
			$modules->setModule($moduleName);
			$employeeModel = $modules->model;
			$data_employee = $employeeModel->find($data->created_by);
			$mail_to = $data_employee->email;
			$mail_name = $data_employee->full_name;
			$mail_name_send = user()->full_name;
			$mailSubject = "Time Off Request Rejected";

			$bcc = [];
			/*if (!empty($data->notify) && $data->notify != '[]') {
				$noti = json_decode($data->notify, true);
				$data_noti = $employeeModel->whereIn('id', $noti)->findAll();
				foreach ($data_noti as $item_noti) {
					$bcc[] = $item_noti->email;
				}
			}*/

			$params = [
				'status' => "Rejected",
				'mail_name' => $mail_name,
				'mail_name_send' => $mail_name_send,
				'mail_date' => $mail_date,
				'mail_link_team' => $mail_link_team,
				'mailSubject' => $mailSubject,
				'mail_to' => $mail_to,
				'bcc' => $bcc
			];
			\CodeIgniter\Events\Events::trigger('time_off_on_mail_notification', $params);
		}

		// delete google calendar event
		if (!empty($googleCalendarEventId)) {
			$this->_handleDeleteEventGoogleCalendar($googleCalendarEventId);
		}

		return $this->respondUpdated($id);
	}

	private function ApproveRequest($id, $action_type)
	{
		if ($action_type != 'team' && $action_type != 'employee' && $action_type != 'approval') {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		if ($action_type == 'employee' && !hasModulePermit("time_off", 'accessEmployeeTimeOff')) {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		if ($action_type == 'approval' && !hasModulePermit("time_off", 'accessApprovalTimeOff')) {
			return $this->failNotFound(MISSING_UPDATE_PERMISSION);
		}
		$moduleName = 'time_off_requests';
		$modules = \Config\Services::modules();
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;
		$module = $modules->getModule();
		$user_id = user()->id;
		$data = $timeoffModel->find($id);
		$googleCalendarEventId = $data->google_calendar_event_id;
		if (empty($data)) {
			return $this->failNotFound(NOT_FOUND);
		}
		if ($action_type == 'team') {
			$moduleName = 'employees';
			$modules->setModule($moduleName);
			$employeeModel = $modules->model;
			helper('HRM\Modules\Employees\Helpers\employee_helper');
			$data_rank = getEmployeesByRank($user_id, "subordinate", $employeeModel);
			unset($data_rank[$user_id]);
			$arr_rank = array_keys($data_rank);
			$arr_rank[] = 0;
			if (!in_array($data->created_by, $arr_rank) || !hasModulePermit("time_off", 'accessTeamTimeOff')) {
				return $this->failNotFound(MISSING_UPDATE_PERMISSION);
			}
		}
		if (!empty($data->approver) && $data->approver != '[]') {
			$approver = json_decode($data->approver, true);
			$count_approver = 0;
			$count_approved = 0;
			foreach ($approver as $key => $item) {
				$count_approver++;
				if ($item['status'] == 'approved') {
					$count_approved++;
				}
				if ($item['id'] == $user_id) {
					$approver[$key]['status'] = "approved";
					$count_approved++;
				}
			}
			$save['approver'] = json_encode($approver);
			if ($count_approver == $count_approved) {
				$save['status'] = getOptionValue($module, "status", "approved");
			}
		}

		$save['id'] = $id;
		//$save['action_by'] = $user_id;
		//$save['action_at'] = date("Y-m-d H:i:s");
		$timeoffModel->setAllowedFields(["status", "action_by", "action_at", "approver"]);
		$timeoffModel->save($save);

		// send mail
		if ($action_type == 'team' || $action_type == 'employee' || $action_type == 'approval') {
			if ($data->time_from == '00:00:00') {
				$mail_datefrom = date('d/m/Y', strtotime($data->date_from));
				$mail_dateto = date('d/m/Y', strtotime($data->date_to));
				$mail_date = "from $mail_datefrom to $mail_dateto";
			} else {
				$date = date('d/m/Y', strtotime($data->date_from));
				$day = round($data->total_day, 3);
				$mail_date = "for $day days on $date";
			}

			$actual_link = $_ENV["app.siteURL"];
			$mail_link_team = "$actual_link/time-off/my-time-off";

			$moduleName = 'employees';
			$modules->setModule($moduleName);
			$employeeModel = $modules->model;
			$data_employee = $employeeModel->find($data->created_by);
			$mail_to = $data_employee->email;
			$mail_name = $data_employee->full_name;
			$mail_name_send = user()->full_name;
			$mailSubject = "Time Off Request Approved";

			$bcc = [];
			/*if (!empty($data->notify) && $data->notify != '[]') {
				$noti = json_decode($data->notify, true);
				$data_noti = $employeeModel->whereIn('id', $noti)->findAll();
				foreach ($data_noti as $item_noti) {
					$bcc[] = $item_noti->email;
				}
			}*/

			$params = [
				'status' => "Approved",
				'mail_name' => $mail_name,
				'mail_name_send' => $mail_name_send,
				'mail_date' => $mail_date,
				'mail_link_team' => $mail_link_team,
				'mailSubject' => $mailSubject,
				'mail_to' => $mail_to,
				'bcc' => $bcc
			];
			\CodeIgniter\Events\Events::trigger('time_off_on_mail_notification', $params);
		}

		if (!empty($googleCalendarEventId)) {
			$googleService = \App\Libraries\Google\Config\Services::google();
			$calendarService = $googleService->calendar();
			$calendarService->handleUpdateEventColorIdGoogleCalendar($googleCalendarEventId, 2);
		}

		return $this->respondUpdated($id);
	}

	private function getEmployeeTimeOffRequestTable($getPara, $request_type = '')
	{
		$modules = \Config\Services::modules();
		$id_user_select = $getPara['id_user_select'];
		$moduleName = 'time_off_requests';
		$modules->setModule($moduleName);
		$timeoffModel = $modules->model;
		if (!empty($id_user_select)) {
			$timeoffModel->where("created_by", $id_user_select);
		}

		return $this->_handleGetDataTable('employee', $getPara, $timeoffModel, $request_type);
	}

	private function _handleGetDataTable($action_type, $getPara, $timeoffModel, $request_type = '', $data_rank = [])
	{
		$modules = \Config\Services::modules();
		$timeoffModel = $this->filterRequest($timeoffModel, $getPara);
		$recordsTotal = $timeoffModel->countAllResults(false);

		$page = $getPara['pagination']['current'];
		$length = $getPara['pagination']['pageSize'];
		$start = ($page - 1) * $length;

		$sort = $this->sortRequest($getPara);
		$sort_field = $sort['sort_field'];
		$sort_order = $sort['sort_order'];

		$timeoffModel->select('*')->orderBy($sort_field, $sort_order)->orderBy("id", "desc");
		if ($action_type == 'employee' && $request_type == 'export_excel') {
			$data = $timeoffModel->findAll();
		} else {
			$data = $timeoffModel->findAll($length, $start);
		}
		if ($action_type == 'employee' || $action_type == 'approval') {
			$arr_id_employee = [0];
			foreach ($data as $item) {
				$arr_id_employee[$item->created_by] = $item->created_by;
			}
			$moduleName = 'employees';
			$modules->setModule($moduleName);
			$employeeModel = $modules->model;
			$data_employee_db = $employeeModel->whereIn("id", $arr_id_employee)->select("id, full_name, avatar")->asArray()->findAll();
			$data_employee = [];
			foreach ($data_employee_db as $item) {
				$data_employee[$item['id']]['full_name'] = $item['full_name'];
				$data_employee[$item['id']]['avatar'] = $item['avatar'];
			}
		} else {
			$data_employee = $data_rank;
		}

		$moduleName = 'time_off_requests';
		$modules->setModule($moduleName);
		$data = handleDataBeforeReturn($modules, $data, true, function ($item) use ($data_employee) {
			$item->employee['full_name'] = $data_employee[$item->created_by['value']]['full_name'];
			$item->employee['avatar'] = $data_employee[$item->created_by['value']]['avatar'];
			return $item;
		});

		$out['total'] = $recordsTotal;
		$out['data'] = $this->_handleDataTimeOffWithApprover($data);

		return $out;
	}

	private function _handleCreateEventGoogleCalendar($arrData, $services = false)
	{

		$googleService = \App\Libraries\Google\Config\Services::google();
		$calendarService = $googleService->calendar();

		$arrEventData = $arrData;
		$arrEventData['title'] = 'Time Off';

		return $calendarService->handleAddEvent($arrEventData, $services);
	}

	private function _handleDeleteEventGoogleCalendar($eventId)
	{
		$googleService = \App\Libraries\Google\Config\Services::google();
		$calendarService = $googleService->calendar();

		return $calendarService->handleDeleteEventGoogleCalendar($eventId);
	}

	private function _handleDataTimeOffWithApprover($data)
	{
		$modules = \Config\Services::modules('employees');
		$employeeModel = $modules->model;
		foreach ($data as $key => $item) {
			if (!empty($item->approver) && $item->approver != '[]') {
				$approver = json_decode($item->approver, true);
				$approver_new = [];
				foreach ($approver as $value) {
					$dataEmployee = $employeeModel->select("id as value, username as label, email, avatar as icon, full_name, job_title_id")->asArray()->find($value['id']);
					if ($dataEmployee) {
						$dataEmployee = handleDataBeforeReturn($modules, $dataEmployee);
						$dataEmployee['status'] = $value['status'];
						if (isset($value['line_manager'])) {
							$dataEmployee['line_manager'] = $value['line_manager'];
						}
						$approver_new[] = $dataEmployee;
					}
				}
				$item->approver = $approver_new;
			} else {
				$item->approver = null;
			}
		}

		return $data;
	}
}
