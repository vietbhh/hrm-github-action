<?php namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

/**
 * Update an HMVC routes
 *
 * @package App\Commands
 * @author Mufid Jamaluddin <https://github.com/MufidJamaluddin/Codeigniter4-HMVC>
 */
class RouteUpdate extends BaseCommand
{
	/**
	 * The group the command is lumped under
	 * when listing commands.
	 *
	 * @var string
	 */
	protected $group = 'Development';

	/**
	 * The Command's name
	 *
	 * @var string
	 */
	protected $name = 'route:update';

	/**
	 * the Command's short description
	 *
	 * @var string
	 */
	protected $description = 'Update CodeIgniter HMVC routes for app/Modules folder';

	/**
	 * the Command's usage
	 *
	 * @var string
	 */
	protected $usage = 'route:update [Options]';

	/**
	 * the Command's Arguments
	 *
	 * @var array
	 */
	protected $arguments = [];

	/**
	 * the Command's Options
	 *
	 * @var array
	 */
	protected $options = [
		'-p' => 'Path scan module to update route from the root ',
		'-n' => 'Set module namespace (default App\Modules)',
		'-i' => 'Set route with /index path without parameter (true/false, default true)',
		'-m' => 'Set route one module name to be create/update (app/Modules/YourModuleName)',
		'-f' => 'Set module folder inside app path (default Modules)',
		'-s' => 'Set route for single controller',
	];

	/**
	 * Namespace Name of Route
	 */
	protected $namespace_name;


	/**
	 * Path to scan
	 */
	protected $path;

	/**
	 * Module folder (default /Modules)
	 */
	protected $module_folder;

	/**
	 * Create route with /index path (without parameter) or no (default no)
	 */
	protected $with_index;


	protected $single_controller;

	/**
	 * Run route:update CLI
	 */
	public function run(array $params)
	{
		helper('inflector');

		$path = $params['-p'] ?? CLI::getOption('p');
		$this->path = realpath(COREPATH . '..' . DS . $path) . DS ?? APPPATH;
		$namespace_name = $params['-n'] ?? CLI::getOption('n');
		$this->namespace_name = $namespace_name ?? 'App\Modules';

		$withIndex = $params['-i'] ?? CLI::getOption('i');
		$this->with_index = $withIndex == 'false' ? false : true;

		$module = $params['-m'] ?? CLI::getOption('m');

		$module_folder = $params['-f'] ?? CLI::getOption('f');
		$this->module_folder = $module_folder ?? 'Modules';

		$single_controller = $params['-s'] ?? CLI::getOption('s');
		$this->single_controller = $single_controller ?? false;

		try {
			if ($module) {
				if ($single_controller) $this->make_route_file_single($module);
				else $this->make_route_file($module);
			} else {
				$module_folders = array_filter(glob($this->path . $this->module_folder . '/*', GLOB_BRACE), 'is_dir');
				foreach ($module_folders as $module) {

					$module = basename($module);
					if ($single_controller) $this->make_route_file_single($module);
					else $this->make_route_file($module);
				}
			}
			$module = $module ?? '';
			CLI::write("\nModule $module routes has successfully been created.\n");
		} catch (Exception $e) {
			CLI::error($e);
		}
	}

	protected function decamelize($string): string
	{
		return strtolower(preg_replace(['/([a-z\d])([A-Z])/', '/([^_])([A-Z][a-z])/'], '$1_$2', $string));
	}

	/**
	 * Make route file of specific module
	 */
	protected function make_route_file($module)
	{
		$module = basename($module);

		CLI::write("\nCreate route for $module");

		$group_name = strtolower($module);

		$path = $this->path . "$this->module_folder/$module/Config/Routes.php";

		$module_route_config = fopen($path, "w") or die("Unable to create routes file for $module module!");

		$controllers = glob($this->path . "$this->module_folder/$module/Controllers/*.php", GLOB_BRACE);
		$time = date('d/m/Y H:i:s');
		$configuration_template = "<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset(\$routes))
{ 
    \$routes = \Config\Services::routes(true);
}

\$routes->group('$group_name', ['namespace' => '$this->namespace_name\\$module\Controllers'], function(\$subroutes){
";
		foreach ($controllers as $controller) {
			$controller = pathinfo($controller, PATHINFO_FILENAME);
			if ($controller != 'BaseController') {
				$class_name = "$this->namespace_name\\$module\Controllers\\$controller";

				CLI::write("Configurate $class_name");

				$controller_path = strtolower(str_replace('_', '-', $this->decamelize($controller)));

				$controller_info = new \ReflectionClass($class_name);

				$class_methods = $controller_info->getMethods(\ReflectionMethod::IS_PUBLIC);

				$configuration_template .= "\n\t/*** Route for $controller ***/\n";

				foreach ($class_methods as $key => $method) {
					if (strpos($method->name, '__') === false) {
						if ($method->name == 'initController')
							continue;
						if (in_array($method->class, ['App\Controllers\ErpController', 'CodeIgniter\RESTful\ResourceController', 'CodeIgniter\RESTful\BaseResource'])) continue;

						$method_name_array = explode('_', $method->name);
						$http_method = end($method_name_array);
						if (in_array($http_method, array('get', 'post', 'put', 'delete'))) {
							array_pop($method_name_array);
							$method_name = implode('-', $method_name_array);
						} else {
							$method_name = implode('-', $method_name_array);
							$http_method = 'add';
						}


						if ($method_name == 'index' && $method->getNumberOfRequiredParameters() == 0) {
							$configuration_template .= "\t\$subroutes->$http_method('$controller_path', '$controller::$method->name');\n";
							if (!$this->with_index && $method->getNumberOfParameters() == 0) continue;
						}

						$uri_addons = str_replace('_', '-', $this->decamelize($method_name));
						$param_addons = $method->name;
						$method_parameters = $method->getParameters();

						foreach ($method_parameters as $key => $item_parameter) {


							if ($item_parameter->getType()) {

								$arg_name = $item_parameter->getType()->getName();
							} else {
								$arg_name = 'string';
							}

							switch ($arg_name) {
								case 'int':
									$uri_addons .= '/(:num)';
									break;

								default:
									if ($http_method == 'delete') {
										$uri_addons .= '/(:any)';
									} else {
										$uri_addons .= '/(:alphanum)';
									}
									break;
							}

							$param_addons .= '/$' . ($key + 1);
						}

						$configuration_template .= "\t\$subroutes->add('$controller_path/$uri_addons', '$controller::$param_addons');\n";
					}
				}

			}
		}

		$configuration_template .= "
});";

		fwrite($module_route_config, $configuration_template);
		fclose($module_route_config);
	}


	/**
	 * Make route file single module without group
	 */
	protected function make_route_file_single($module)
	{
		$module = basename($module);

		CLI::write("\nCreate route for $module");
		$path = $this->path . "$this->module_folder/$module/Config/Routes.php";
		$module_route_config = fopen($path, "w") or die("Unable to create routes file for $module module!");

		$controllers = glob($this->path . "$this->module_folder/$module/Controllers/*.php", GLOB_BRACE);
		$configuration_template = "<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
*/
if(!isset(\$routes))
{ 
    \$routes = \Config\Services::routes(true);
}
";
		foreach ($controllers as $controller) {
			$controller = pathinfo($controller, PATHINFO_FILENAME);
			if ($controller != 'BaseController') {
				$class_name = "$this->namespace_name\\$this->module_folder\\$module\Controllers\\$controller";
				CLI::write("Configurate $class_name");
				$controller_path = strtolower(str_replace('_', '-', $this->decamelize($controller)));
				if (strtolower($module) !== strtolower($controller)) {
					$controller_path = strtolower(str_replace('_', '-', $this->decamelize($module . '_' . $controller)));
				}
				$controller_info = new \ReflectionClass($class_name);
				$class_methods = $controller_info->getMethods(\ReflectionMethod::IS_PUBLIC);
				$configuration_template .= "\n\t/*** Route for $controller ***/\n";
				foreach ($class_methods as $key => $method) {
					if (strpos($method->name, '__') === false) {
						if ($method->name == 'initController')
							continue;
						if (in_array($method->class, ['App\Controllers\ErpController', 'CodeIgniter\RESTful\ResourceController', 'CodeIgniter\RESTful\BaseResource'])) continue;

						if (strpos($method->getDocComment(), '_skip_auto_route_') !== false) continue;
						$method_name_array = explode('_', $method->name);
						$http_method = end($method_name_array);
						if (in_array($http_method, array('get', 'post', 'put', 'delete'))) {
							array_pop($method_name_array);
							$method_name = implode('-', $method_name_array);
						} else {
							$method_name = implode('-', $method_name_array);
							$http_method = 'add';
						}

						$uri_addons = str_replace('_', '-', $this->decamelize($method_name));
						$uri_index_addons = '';
						$param_addons = $method->name;
						$method_parameters = $method->getParameters();

						if (count($method_parameters) === 1 && $method_parameters[0]->name === 'ANY') {
							$optional = $method_parameters[0]->isDefaultValueAvailable() ? '?' : '';
							$uri_addons .= '/' . $optional . '(:any)' . $optional;
							$uri_index_addons .= '/' . $optional . '(:any)' . $optional;
							$param_addons .= '/$1';
						} else {
							foreach ($method_parameters as $key => $item_parameter) {
								if ($item_parameter->getType()) {
									$arg_name = $item_parameter->getType()->getName();
								} else {
									$arg_name = 'string';
								}
								$optional = $item_parameter->isDefaultValueAvailable() ? '?' : '';
								switch ($arg_name) {
									case 'int':
										$uri_addons .= '/' . $optional . '(:num)' . $optional;
										$uri_index_addons .= '/' . $optional . '(:num)' . $optional;
										break;
									default:
										if ($http_method == 'delete') {
											$uri_addons .= '/' . $optional . '(:any)' . $optional;
											$uri_index_addons .= '/' . $optional . '(:any)' . $optional;
										} else {
											$uriKey = '(:any)';
											$uri_addons .= '/' . $optional . $uriKey . $optional;
											$uri_index_addons .= '/' . $optional . $uriKey . $optional;
										}
										break;
								}

								$param_addons .= '/$' . ($key + 1);
							}
						}
						if ($method_name == 'index' && $method->getNumberOfRequiredParameters() == 0) {
							$n = strtolower($controller_path . $uri_index_addons);
							$configuration_template .= "\$routes->$http_method('$n', '$controller::$param_addons',['namespace' => '$this->namespace_name\\$this->module_folder\\$module\Controllers']);\n";
							if (!$this->with_index && $method->getNumberOfParameters() == 0) continue;
						}

						$n = strtolower($controller_path . '/' . $uri_addons);
						$configuration_template .= "\$routes->$http_method('$n', '$controller::$param_addons',['namespace' => '$this->namespace_name\\$this->module_folder\\$module\Controllers']);\n";
					}
				}

			}
		}

		fwrite($module_route_config, $configuration_template);
		fclose($module_route_config);
	}
}