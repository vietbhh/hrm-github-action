<?php namespace Config;

use App\Filters\CorsFilter;
use App\Filters\JWTLoginFilter;
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
		'jwtLogin' => JWTLoginFilter::class,
		'role' => RoleFilter::class,
		'permission' => PermissionFilter::class
	];

	// Always applied before every request
	public $globals = [
		'before' => [
			'cors',
			'jwtLogin' => ['except' => ['auth/*', 'header-assistant/*', 'download/public/*', 'download/logo/*', 'download/avatar', 'download/avatar/*', 'lib/download/*']]
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
		helper('common');
		$codeFiltersClass = new \CODE\Filters();
		$codeFiltersConfig = $codeFiltersClass->getFilterConfig();
		$clientFiltersClass = new \CLIENT\Config\Filters();
		$clientFiltersConfig = $clientFiltersClass->getFilterConfig();

		$this->aliases = array_unique(array_merge_deep([$this->aliases, $codeFiltersConfig['aliases'], $clientFiltersConfig['aliases']]));
		$this->globals = array_merge_deep([$this->globals, $codeFiltersConfig['globals'], $clientFiltersConfig['globals']]);
		$this->methods = array_merge_deep([$this->methods, $codeFiltersConfig['methods'], $clientFiltersConfig['methods']]);
		$this->filters = array_merge_deep([$this->filters, $codeFiltersConfig['filters'], $clientFiltersConfig['filters']]);
	}

}
