<?php

namespace App\Libraries\NodeServer;

class NodeServer
{
	public \CodeIgniter\HTTP\CURLRequest $node;

	public function __construct($options = [])
	{
		$defaultOptions = [
			'baseURI' => $_ENV['app.nodeApiUrl'],
			'timeout' => 3,
		];
		$connectOption = array_merge($defaultOptions, $options);
		$this->node = \Config\Services::curlrequest($connectOption);
	}

	//public function get()
}