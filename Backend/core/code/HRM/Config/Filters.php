<?php

namespace HRM\Config;

use Daycry\CronJob\Scheduler;

class Filters
{
	/*
	 * DECLARE PUBLIC ROUTER HERE
	 * ['download/*']
	 * */
	public array $public_router = ['news/image', '/time-off/request-time-off', '/time-off/get-mail-request', 'attendances-time-machine/*', 'attendances-time-machine', 'careers', 'careers/*'];
}

?>