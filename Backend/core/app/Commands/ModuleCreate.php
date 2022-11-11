<?php namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

/**
 * Update an HMVC routes
 *
 * @package App\Commands
 * @author Mufid Jamaluddin <https://github.com/MufidJamaluddin/Codeigniter4-HMVC>
 */
class ModuleCreate extends BaseCommand
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
	protected $name = 'module:create';

	/**
	 * the Command's short description
	 *
	 * @var string
	 */
	protected $description = 'Create module with route controller model';

	/**
	 * the Command's usage
	 *
	 * @var string
	 */
	protected $usage = 'module:create [Options]';

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
		'-p' => 'Set path of folder',
		'-n' => 'Set namespace',
		'-name' => 'Set module name',
		'-controller' => 'Set name of controller',
		'-model' => 'Set model of module',
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


	protected $module_name;
	protected $controller_name;
	protected $model_name;

	/**
	 * Run route:update CLI
	 */
	public function run(array $params)
	{
		helper('inflector');

		$path = $params['-p'] ?? CLI::getOption('p');
		$this->path = realpath(COREPATH . '..' . DS . $path) . DS ?? APPPATH;

		$namespace = $params['-n'] ?? CLI::getOption('n');
		$this->namespace_name = $namespace ?? 'App\Modules';

		$this->module_folder = 'Modules';
		$module_name = $params['-name'] ?? CLI::getOption('name');
		$this->module_name = $module_name ?? '';

		$controller_name = $params['-controller'] ?? CLI::getOption('controller');
		$this->controller_name = $controller_name ?? $module_name;

		$model_name = $params['-model'] ?? CLI::getOption('model');
		$this->model_name = $model_name ?? $module_name;

		try {
			if (empty($module_name)) {
				throw new \Exception("Module name not allow empty!");
			} else {
				$this->create_controller($module_name, $controller_name);
				//$this->create_model($module_name, $model_name);
				$this->create_route($module_name);
			}
			CLI::write("\nModule $module_name has successfully been created.\n");
		} catch (\Exception $e) {
			CLI::error($e);
		}
	}

	/**
	 * Make controller file of specific module
	 */
	protected function create_controller($module, $controller = '')
	{
		$module = basename($module);
		if (empty($controller)) $controller = $module;
		$controller = ucfirst($controller);
		$model = $controller . 'Model';
		CLI::write("\nCreate controller module $module");
		helper('date');
		$module_name = strtolower($module);
		$folder_module = ucfirst($module_name);
		$ds = DIRECTORY_SEPARATOR;
		$path = $this->path . "$this->module_folder" . $ds . "$module" . $ds . "Controllers";
		if (!is_dir($path)) {
			mkdir($path, 0755, true); // true for recursive create
		}
		$filePath = $path . $ds . "$controller.php";
		if (is_file($filePath)) {
			throw new \Exception("Controller exist!");
		}

		$module_route_config = fopen($filePath, "w") or die("Unable to create controller file for $module module!");
		$time = date('d/m/Y H:i:s');
		$configuration_template = "<?php 
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : $module_name
*/
namespace $this->namespace_name\\$this->module_folder\\$folder_module\Controllers;
use App\Controllers\ErpController;
class $controller extends ErpController
{
	public function index_get()
	{
		return \$this->respond([]);
	}
";
		$configuration_template .= "}";

		fwrite($module_route_config, $configuration_template);
		fclose($module_route_config);
	}


	/**
	 * Make controller file of specific module
	 */
	protected function create_model($module, $model = '')
	{
		$module = basename($module);
		if (empty($model)) $model = $module;
		$table = strtolower($model);
		$model = ucfirst($model) . 'Model';

		CLI::write("\nCreate model module $module");
		helper('date');
		$module_name = strtolower($module);
		$folder_module = ucfirst($module_name);
		$ds = DIRECTORY_SEPARATOR;
		$path = $this->path . "$this->module_folder" . $ds . "$module" . $ds . "Models";
		if (!is_dir($path)) {
			mkdir($path, 0755, true); // true for recursive create
		}
		$filePath = $path . $ds . "$model.php";
		if (is_file($filePath)) {
			throw new \Exception("Model name exist!");
		}

		$module_route_config = fopen($filePath, "w") or die("Unable to create model file for $module module!");
		$time = date('d/m/Y H:i:s');
		$configuration_template = "<?php 
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP FRIDAY
* Module name : $module_name
* Model name : $model
*/
namespace $this->namespace_name\\$this->module_folder\\$folder_module\Models;
use App\Models\AppModel;
class $model extends AppModel
{
	protected \$table = 'm_$table';
	protected \$primaryKey = 'id';
	protected \$returnType = 'array';
	protected \$allowedFields = [];
	protected \$protectFields = false;
	protected \$useTimestamps = true;
	protected \$validationRules = [];
	protected \$validationMessages = [];
	protected \$skipValidation = false;
	protected \$selectFields = [];
	
";
		$configuration_template .= "}";

		fwrite($module_route_config, $configuration_template);
		fclose($module_route_config);
	}


	/**
	 * Make route file
	 */
	protected function create_route($module)
	{
		$module = basename($module);

		CLI::write("\nCreate route for $module");
		$ds = DIRECTORY_SEPARATOR;
		$path = $this->path . "$this->module_folder" . $ds . "$module" . $ds . "Config";
		if (!is_dir($path)) {
			mkdir($path, 0755, true); // true for recursive create
		}
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
";
		foreach ($controllers as $controller) {
			$controller = pathinfo($controller, PATHINFO_FILENAME);
			if ($controller != 'BaseController') {
				$class_name = "$this->namespace_name\\$this->module_folder\\$module\Controllers\\$controller";
				CLI::write("Configurate $class_name");
				$controller_path = strtolower($controller);
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
							$configuration_template .= "\$routes->$http_method('$controller_path', '$controller::$method->name',['namespace' => '$this->namespace_name\\$this->module_folder\\$module\Controllers']);\n";
							if (!$this->with_index && $method->getNumberOfParameters() == 0) continue;
						}

						$uri_addons = $method_name;
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
									$uri_addons .= '/(:alphanum)';
									break;
							}

							$param_addons .= '/$' . ($key + 1);
						}

						$configuration_template .= "\$routes->$http_method('$controller_path/$uri_addons', '$controller::$param_addons',['namespace' => '$this->namespace_name\\$this->module_folder\\$module\Controllers']);\n";
					}
				}

			}
		}

		fwrite($module_route_config, $configuration_template);
		fclose($module_route_config);
	}
}