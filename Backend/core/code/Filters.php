<?php

namespace CODE;

class Filters
{
	public function getFilterConfig(): array
	{
		$aliases = [];
		$globals = [];
		$methods = [];
		$filters = [];
		foreach (CODE_AUTOLOAD as $key => $item) {
			$class = '\\' . $key . '\Config\Filters';
			if (class_exists($class)) {
				$filter = new $class();
				$filterConfig = $filter->getFilterConfig();
				$aliases = array_merge_deep([$aliases, $filterConfig['aliases']]);
				$globals = array_merge_deep([$globals, $filterConfig['globals']]);
				$methods = array_merge_deep([$methods, $filterConfig['methods']]);
				$filters = array_merge_deep([$filters, $filterConfig['filters']]);
			}
		}

		return [
			'aliases' => $aliases,
			'globals' => $globals,
			'methods' => $methods,
			'filters' => $filters
		];
	}
}

?>