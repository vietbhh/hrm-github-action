<?php

namespace App\Libraries\NodeServer;

class NodeServer
{
	public \CodeIgniter\HTTP\CURLRequest $node;

	public function __construct($options = [])
	{
		echo "<pre>";
		print_r(session());
		echo "</pre>";
		$authenticate = \Config\Services::authentication();
		$token = $authenticate->token;
		$defaultOptions = [
			'baseURI' => $_ENV['app.nodeApiUrl'],
			'timeout' => 3,
			'headers' => [
				'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiaWF0IjoxNjcyMzU0NzcxLCJleHAiOjE2NzI0MDg3NzF9.-F6broJfkaW89POGpJiQetICs6Pu4nL0wUGYMk0c0GI'
			]
		];
		$connectOption = array_merge($defaultOptions, $options);
		$this->node = \Config\Services::curlrequest($connectOption);
	}

	//public function get()
}