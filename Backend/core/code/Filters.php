<?php

namespace CODE;

use Daycry\CronJob\Scheduler;

class Filters
{
	public function getPublicRoute()
	{
		$filters= [];
		foreach (CODE_AUTOLOAD as $key => $item) {
			$class = '\\' . $key . '\Config\Filters';
			if (class_exists($class)) {
				$filter = new $class();
				$filters = array_merge($filters,$filter->public_router);
			}
		}
		return $filters;
	}
}

?>