<?php

namespace FRIDAY\Config;

class Filters
{
	/*
	 * DECLARE PUBLIC ROUTER HERE
	 * ['download/*']
	 * */
	public array $public_router = [];

	/*
	 * DECLARE CONFIG FILTER HERE
	 * */
	public function getFilterConfig(): array
	{
		return [
			'aliases' => [],
			'globals' => [
				'before' => ['jwtLogin' => ['except' => $this->public_router]]
			],
			'methods' => [],
			'filters' => []
		];
	}
}

?>