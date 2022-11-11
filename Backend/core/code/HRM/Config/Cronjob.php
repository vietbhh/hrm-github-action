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
		//Write cronjob here
	}
}

?>