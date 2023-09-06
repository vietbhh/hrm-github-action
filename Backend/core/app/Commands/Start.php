<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class Start extends BaseCommand
{
	/**
	 * The Command's Group
	 *
	 * @var string
	 */
	protected $group = 'App';

	/**
	 * The Command's Name
	 *
	 * @var string
	 */
	protected $name = 'start';

	/**
	 * The Command's Description
	 *
	 * @var string
	 */
	protected $description = 'Start Server on Port 8085';

	/**
	 * The Command's Usage
	 *
	 * @var string
	 */
	protected $usage = 'command:name [arguments] [options]';

	/**
	 * The Command's Arguments
	 *
	 * @var array
	 */
	protected $arguments = [];

	/**
	 * The Command's Options
	 *
	 * @var array
	 */
	protected $options = [];

	/**
	 * Actually execute a command.
	 *
	 * @param array $params
	 */
	public function run(array $params)
	{
		$port = $_ENV['sparkRunningPort'] ?? 80;
		print_r($port);

		$_SERVER['argv'][2] = '--port';
		$_SERVER['argv'][3] = $port;
		$_SERVER['argc']    = 4;
		CLI::init();

		$this->call('serve');
	}
}
