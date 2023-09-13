<?php

namespace HRM\Config;

class Filters
{
	/*
	 * DECLARE PUBLIC ROUTER HERE
	 * ['download/*']
	 * */
	public array $public_router = ['news/image', '/time-off/request-time-off', '/time-off/get-mail-request', 'attendances-time-machine/*', 'attendances-time-machine', 'careers', 'careers/*'];

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