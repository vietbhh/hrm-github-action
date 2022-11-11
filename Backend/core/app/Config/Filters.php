<?php namespace Config;

use App\Filters\CorsFilter;
use App\Filters\LoginFilter;
use App\Filters\PermissionFilter;
use App\Filters\RoleFilter;
use CodeIgniter\Config\BaseConfig;

class Filters extends BaseConfig
{
	// Makes reading things below nicer,
	// and simpler to change out script that's used.
	public $aliases = [
		'csrf' => \CodeIgniter\Filters\CSRF::class,
		'toolbar' => \CodeIgniter\Filters\DebugToolbar::class,
		'honeypot' => \CodeIgniter\Filters\Honeypot::class,
		'cors' => CorsFilter::class,
		'login' => LoginFilter::class,
		'role' => RoleFilter::class,
		'permission' => PermissionFilter::class
	];

	// Always applied before every request
	public $globals = [
		'before' => [
			'cors',
			'login' => ['except' => ['auth/*', 'download/public/*', 'download/logo/*','lib/download/*']]
			//'honeypot'
			// 'csrf',
		],
		'after' => [
			//'toolbar',
			//'honeypot'
		],
	];

	// Works on all of a particular HTTP method
	// (GET, POST, etc) as BEFORE filters only
	//     like: 'post' => ['CSRF', 'throttle'],
	public $methods = [];

	// List filter aliases and any before/after uri patterns
	// that they should run on, like:
	//    'isLoggedIn' => ['before' => ['account/*', 'profiles/*']],
	public $filters = [];

	public function __construct()
	{
		$codeFilters = new \CODE\Filters();
		$clientFilters = new \CLIENT\Config\Filters();
		$this->globals['before']['login']['except'] = array_merge($this->globals['before']['login']['except'], $codeFilters->getPublicRoute(), $clientFilters->getPublicRoute());
	}

}
