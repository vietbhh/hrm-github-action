<?php

use CodeIgniter\Events\Events;

/*
 * --------------------------------------------------------------------
 * Application Events
 * --------------------------------------------------------------------
 * Events allow you to tap into the execution of the program without
 * modifying or extending core files. This file provides a central
 * location to define your events, though they can always be added
 * at run-time, also, if needed.
 *
 * You create code that can execute by subscribing to events with
 * the 'on()' method. This accepts any form of callable, including
 * Closures, that will be executed when the event is triggered.
 *
 * Example:
 *      Events::on('create', [$myInstance, 'myMethod']);
 */

/*Events::on('test123', function () {

});*/

Events::on('time_off_on_request', function ($params) {
	$event = new \HRM\Modules\TimeOff\Config\Events();
	$event->SendMailRequest($params);
});

Events::on('time_off_on_mail_notification', function ($params) {
	$event = new \HRM\Modules\TimeOff\Config\Events();
	$event->SendMailRequestNotification($params);
});

Events::on('attendance_on_update_total_log', function ($params) {
	$event = new \HRM\Modules\Attendances\Config\Events();
	$event->updateTotalLog($params);
});

Events::on('send_mail_notification_manager', function ($params) {
	$event = new \HRM\Modules\Attendances\Config\Events();
	$event->sendMailNotificationManager($params);
});

Events::on('send_mail_notification_employee', function ($params) {
	$event = new \HRM\Modules\Attendances\Config\Events();
	$event->sendMailNotificationEmployee($params);
});

Events::on('send_payslip', function ($params) {
	$event = new \HRM\Modules\Payrolls\Config\Events();
	$event->sendPayslip($params);
});

Events::on('after_insert_employee_event', function ($params) {
	$event = new \HRM\Modules\Employees\Config\Events();
	$event->afterInsertEmployeeEvent($params);

});

Events::on('on_update_employee_event', function ($params) {
	$event = new \HRM\Modules\Employees\Config\Events();
	$event->onUpdateEmployeeEvent($params);
});

Events::on('send_mail_assign_checklist', function ($data) {
	$event = new \HRM\Modules\Checklist\Config\Events();
	$event->sendMailAssignChecklist($data);
});

Events::on('send_mail_update_checklist', function ($data) {
	$event = new \HRM\Modules\Checklist\Config\Events();
	$event->sendMailUpdateChecklist($data);
});

Events::on('send_mail_off_track_checklist', function ($data) {
	$event = new \HRM\Modules\Checklist\Config\Events();
	$event->sendMailOffTrack($data);
});

Events::on('send_mail_off_boarding_checklist', function ($data) {
	$event = new \HRM\Modules\Checklist\Config\Events();
	$event->sendMailOffBoarding($data);
});

Events::on('update_line_manager_employee', function ($data) {
	$event = new \HRM\Modules\Employees\Config\Events();
	$event->updateLineManager($data);
});

?>