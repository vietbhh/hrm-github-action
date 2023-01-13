<?php

namespace App\Libraries\NodeServer;

class NodeServer
{
	public \CodeIgniter\HTTP\CURLRequest $node;

	public function __construct($options = [])
	{
		$defaultOptions = [
			'baseURI' => $_ENV['app.nodeApiUrl'],
			'timeout' => 3
		];
		$authenticate = \Config\Services::authentication();
		$token = $authenticate->token();
		if ($token) {
			$defaultOptions['headers']['Authorization'] = 'Bearer ' . $token;
		}
		$connectOption = array_merge($defaultOptions, $options);
		$this->node = \Config\Services::curlrequest($connectOption);
	}

	//public function get()
}