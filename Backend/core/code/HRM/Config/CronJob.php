<?php

namespace HRM\Config;

use Daycry\CronJob\Scheduler;

class CronJob
{
	/*  Usage
	 * 	$schedule->call(function () {
	 *  $employee = new \HRM\Modules\Employees\Config\Cronjob();
	 *  $employee->auto_resigned();
	 *  })->daily()->named('auto_resigned_employee_2');
	 *   https://github.com/daycry/cronjob
	 * */
	public function run(Scheduler $schedule)
	{
		$schedule->call(function () {
			$employee = new \HRM\Modules\Employees\Config\Cronjob();
			$employee->auto_resigned();
		})->daily()->named('auto_resigned_employee');

		// ** time off cronjob
		$schedule->call(function () {
			$timeOff = new \HRM\Modules\TimeOff\Config\Cronjob();
			$timeOff->calculate_employee_balance();
		})->daily()->named('auto_calculate_employee_balance');

		$schedule->call(function () {
			$timeOff = new \HRM\Modules\TimeOff\Config\Cronjob();
			$timeOff->expire_carryover_balance();
		})->yearly()->named('expire_carryover_balance');

		// ** payroll cronjob
		$schedule->call(function () {
			$payroll = new \HRM\Modules\Payrolls\Config\Cronjob();
			$payroll->create_new_payroll_schedule();
		})->daily()->named('auto_create_new_payroll_schedule');

		$schedule->call(function () {
			$payroll = new \HRM\Modules\Payrolls\Config\Cronjob();
			$payroll->handle_cut_off_date();
		})->daily()->named('auto_handle_cut_off_date');

		$schedule->call(function () {
			$payroll = new \HRM\Modules\Payrolls\Config\Cronjob();
			$payroll->send_mail_review_payroll();
		})->daily()->named('auto_send_mail_review_payroll');

		// ** attendance cronjob
		$schedule->call(function () {
			$attendance = new \HRM\Modules\Attendances\Config\Cronjob();
			$attendance->create_new_attendance_schedule();
		})->daily()->named('create_new_attendance_schedule');

		$schedule->call(function () {
			$attendance = new \HRM\Modules\Attendances\Config\Cronjob();
			$attendance->recalculate_attendance();
		})->daily()->named('auto_recalculate_attendance');

		$schedule->call(function () {
			$attendance = new \HRM\Modules\Attendances\Config\Cronjob();
			$attendance->send_mail_notification_attendance();
		})->daily()->named('send_mail_notification_attendance');

		$schedule->call(function () {
			$employee = new \HRM\Modules\Employees\Config\Cronjob();
			$employee->auto_active_contract();
		})->daily()->named('auto_active_contract');

		// ** checklist cronjob
		$schedule->call(function () {
			$checklist = new \HRM\Modules\Checklist\Config\Cronjob();
			$checklist->send_mail_off_track_checklist();
		})->daily()->named('send_mail_off_track_checklist');

		/** cronjob insurance */
		$schedule->call(function () {
			$insurance = new \HRM\Modules\Insurance\Config\Cronjob();
			$insurance->handle_create_close_insurance();
		})->daily()->named('handle_create_close_insurance');

		//Write cronjob here
		$schedule->call(function () {
			$nodeServer = \Config\Services::nodeServer();
			$nodeServer->node->get('/send-mail-pending');
		})->named('auto_send_mail_pending');
	}
}
