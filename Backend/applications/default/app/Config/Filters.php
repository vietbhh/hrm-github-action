<?php

namespace CLIENT\Config;
use App\Models\AppModel;

class Filters
{
	public function getFilterConfig(): array
	{
		$config = [
			'aliases' => [],
			'globals' => [
				'before' => ['jwtLogin' => ['except' => $this->getPublicRoute()]]
			],
			'methods' => [],
			'filters' => []
		];
		return $config;
	}

	/**
	 * return a array with public route
	 */
	public function getPublicRoute(): array
	{
		//handle logic here or return array of public routes
		return [];
	}
}

?>