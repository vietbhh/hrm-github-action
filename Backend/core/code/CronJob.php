<?php

namespace CODE;

use Daycry\CronJob\Scheduler;

class CronJob
{
	public function run(Scheduler $schedule)
	{
		$namespaces = CODE_AUTOLOAD;
		foreach ($namespaces as $key => $item) {
			$class = '\\' . $key . '\Config\CronJob';
			if (class_exists($class)) {
				$cronjob = new $class();
				$cronjob->run($schedule);
			}
		}
	}
}

?>