<?php namespace Halo\Modules;

/***
 * Name: Settings
 * Author: Matthew Gatner
 * Contact: mgatner@tattersoftware.com
 * Created: 2019-04-07
 *
 * Description:  Lightweight settings management for CodeIgniter 4
 *
 * Requirements:
 *    >= PHP 7.2
 *    >= CodeIgniter 4.0
 *    Preconfigured, autoloaded Database
 *    `settings` and `settings_users` tables (run migrations)
 *
 * Configuration:
 *    Use Config/Settings.php to override default behavior
 *    Run migrations to update database tables:
 *        > php spark migrate:latest -all
 *
 * Description:
 * Settings exist at three tiered levels: Session, User, Global
 *    Global settings cannot be overriden by users
 *    User settings automatically write back to the database to persist between sessions
 *    Session settings only last as long as a session
 * Gets return NULL for missing/unmatched settings
 * Sets use NULL to remove values
 * @package CodeIgniter4-Settings
 * @author Matthew Gatner
 * @link https://github.com/tattersoftware/codeigniter4-settings
 *
 ***/

use App\Libraries\Dump\Mysqldump;
use App\Models\AppOptionModel;
use CodeIgniter\Model;
use Config\Database;
use Halo\Modules\Entities\Module;
use Halo\Modules\Exceptions\ModulesException;
use Halo\Modules\Models\EmptyModel;
use Halo\Modules\Models\MetaModel;
use Halo\Modules\Models\ModuleModel;
use Halo\Modules\Models\RouteModel;
use Tatter\Permits\Models\PermitModel;

/*** CLASS ***/
class ModulesManager
{

	protected $config;
	/**
	 * The model for fetching module.
	 *
	 * @var ModuleModel
	 */
	protected Model $moduleModel;
	/**
	 * The model for fetching route.
	 *
	 * @var RouteModel
	 */
	protected Model $routeModel;
	/**
	 * The model for fetching meta.
	 *
	 * @var MetaModel
	 */
	protected Model $metaModel;

	/**
	 * Current module model
	 */
	public Model $model;
	public string $module;
	public $moduleData;

	protected $route;
	protected $permits;
	//Declare default fields for database
	protected $defaultFields;
	//Declare default fields for erp app
	protected $defaultMetasFields;
	//Declare properties for each type of field
	protected $fieldTypeDef;
	//Declare filter properties for each field type
	protected $fieldTypeFilterDef;
	protected $bannedMetaWords;
	protected $systemModules;
	protected $forge;

	/**
	 * Stores dependencies
	 *
	 * @param $module
	 * @param ModuleModel $model
	 */
	public function __construct($module, ModuleModel $model, RouteModel $routeModel, MetaModel $metaModel)
	{
		$this->moduleModel = $model;
		$this->routeModel = $routeModel;
		$this->metaModel = $metaModel;
		$this->forge = \Config\Database::forge();

		//load config
		$config_base = json_decode(file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . "Config" . DIRECTORY_SEPARATOR . "config_base.json"), true);

		$config_system_modules = json_decode(file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . "Config" . DIRECTORY_SEPARATOR . "config_system_modules.json"), true);

		$this->config = $config_base;
		$this->route = $config_base['route'];
		$this->permits = $config_base['permits'];
		$this->defaultFields = $config_base['defaultFields'];
		$this->defaultMetasFields = $config_base['defaultMetasFields'];
		$this->fieldTypeDef = $config_base['fieldTypeDef'];
		$this->fieldTypeFilterDef = $config_base['fieldTypeFilterDef'];
		$this->bannedMetaWords = $config_base['bannedMetaWords'];
		$this->systemModules = $config_system_modules;

		if (!empty($module)) {
			$this->setModule($module);
		}
	}


	public function getModuleTablePrefix(): string
	{
		return $this->config['moduleTablePrefix'];
	}

	public function getRouteModuleNameVar(): string
	{
		return $this->config['routeModuleNameVar'];
	}

	public function getMetaFieldsAllowOptionSelection(): array
	{
		return $this->config['metaFieldsAllowOptionSelection'];
	}

	public function getMetaFieldsAllowModuleSelectionNoPaginate(): array
	{
		return $this->config['metaFieldsAllowModuleSelectionNoPaginate'];
	}

	public function getMetaFieldsAllowModuleSelectionPaginate(): array
	{
		return $this->config['metaFieldsAllowModuleSelectionPaginate'];
	}

	public function getMetaFieldsAllowModuleSelection(): array
	{
		return array_merge($this->getMetaFieldsAllowModuleSelectionNoPaginate(), $this->getMetaFieldsAllowModuleSelectionPaginate());
	}

	public function getUploadField(): array
	{
		return $this->config['metaFieldsUpload'];
	}

	public function getFieldTypeDef(): array
	{
		return $this->fieldTypeDef;
	}

	public function getFieldTypeFilterDef(): array
	{
		return $this->fieldTypeFilterDef;
	}

	public function getDefaultFields(): array
	{
		return $this->defaultFields;
	}

	public function getDefaultMetasFields(): array
	{
		return $this->defaultMetasFields;
	}

	public function getDefaultMetasFieldAttributes(): array
	{
		return $this->config['defaultMetaAttr'];
	}

	public function getSystemModule(): array
	{
		return $this->systemModules;
	}

	/**
	 * Checks for a logged in user
	 *
	 * @return int The user ID, 0 for "not logged in", -1 for CLI
	 */
	protected function getUserId(): int
	{
		if (is_cli()) {
			return -1;
		}
		if (!function_exists('logged_in')) {
			helper('auth');
		}
		$userId = user_id() ?? 0;
		return $userId ?? 0;

	}

	/**
	 * Tries to cache a Setting
	 *
	 * @param string $key
	 * @param mixed $content
	 *
	 * @return mixed
	 */
	protected function cache($key, $content)
	{
		if ($content === null) {
			return cache()->delete($key);
		}

		if ($duration = $this->config['cacheDuration']) {
			cache()->save($key, $content, $duration);
		}

		return $content;
	}

	/**
	 * Fetches all module list
	 *
	 *
	 * @return array
	 *
	 */
	public function listModules($forceUpdateCache = false): array
	{
		if (!$forceUpdateCache && $modules = cache("modules")) {
			$result = $modules;
		} else {
			$result = $this->moduleModel->findAll();
			$this->cache("modules", $result);
		}

		$modules_users = $this->moduleModel->getModuleUserOptions();
		foreach ($result as $item) {
			$item->user_options = (empty($modules_users[$item->id])) ? [] : $modules_users[$item->id];
		}
		return $result;
	}

	public function updateModuleUserOptions($data, $name = null): array
	{
		$name = empty($name) ? $this->module : $name;
		$module = $this->getModule($name);
		$this->moduleModel->saveModuleUserOptions($module->id, $data);
		return $this->listModules(true);
	}

	public function setModule($name): ?object
	{
		$this->moduleData = $this->getModule($name);
		$this->module = $name;
		$model = new EmptyModel();
		$model->setTable($this->moduleData->tableName);
		$this->model = $model;
		return $this->moduleData;
	}

	public function getModuleModel($name = null): EmptyModel
	{
		$name = empty($name) ? $this->module : $name;
		$moduleInfo = $this->getModule($name);
		$model = new EmptyModel();
		$model->setTable($moduleInfo->tableName);
		return $model;
	}

	protected function handleTableNamePrefix($tableName): string
	{
		if (strpos($tableName, $this->config['moduleTablePrefix']) === 0) {
			return $tableName;
		} else {
			return $this->config['moduleTablePrefix'] . $tableName;
		}
	}

	public function moduleExists($type = 'name', $name)
	{
		$key = ($type === 'table') ? 'tableName' : 'name';
		if ($type === 'table') $name = $this->handleTableNamePrefix($name);
		$db = Database::connect();

		if ($type === 'table' && $db->tableExists($name)) {
			return true;
		}
		return $this->moduleModel->where($key, $name)->first();
	}

	/**
	 * Fetches the setting template from the settings table and handles errors
	 *
	 * @param string||int $identify
	 *
	 * @return object|null
	 *
	 * @throws ModulesException
	 */
	public function getModule($identify = null, $forceUpdateCache = false): ?object
	{
		$identify = ($identify) ? $identify : $this->module;
		if (empty($identify)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingName();
			}
		}
		// Check the cache
		if (!$forceUpdateCache) {
			if ($module = cache("module-{$identify}")) {
				return $module;
			}
		}

		// Query the database
		$module = $this->moduleModel->getModule($identify);

		if (!empty($module)) {
			if (!empty($module->options)) {
				$module->options = json_decode($module->options, true);
			}
			$module->user_options = (isset($module->id) && is_numeric($module->id)) ? $this->moduleModel->getModuleUserOptions($module->id) : [];
		}
		//check if it's system module
		$systemModule = $this->getSystemModule();
		if (!empty($systemModule[$identify])) {
			$module = (object)$systemModule[$identify];
		}

		if (!$module) {
			throw ModulesException::forUnmatchedName($identify);
		}
		$this->cache("module-{$module->name}", $module);
		return $module;
	}

	/**
	 * getDetailModule using to get all public information of a module
	 */
	public function getModuleConfig($name): array
	{
		$name = empty($name) ? $this->module : $name;
		$module = array(
			'module' => [],
			'metas' => [],
			'optionsModules' => [],
			'filters' => [],
			'options' => []
		);
		$data = $this->getModule($name);
		helper('app_select_option');
		$module['options'] = getAppSelectOptions($data);
		$module['module'] = $data;


		try {
			$module['metas'] = $this->getMetas();
			$moduleOptions = [];
			$metaFieldsModuleSelectionNoPaginate = $this->getMetaFieldsAllowModuleSelectionNoPaginate();
			foreach ($module['metas'] as $key => $item) {
				if (!empty($item->field_select_field_show) && !empty($item->field_select_module) && in_array($item->field_type, $metaFieldsModuleSelectionNoPaginate)) {
					if (!isset($moduleOptions[$item->field_select_module])) $moduleOptions[$item->field_select_module] = [];
					if (!in_array($item->field_select_field_show, $moduleOptions[$item->field_select_module]))
						$moduleOptions[$item->field_select_module][] = $item->field_select_field_show;
				}
				$module['metas'][$key] = handleMetasBeforeReturn($this, $item, $name);
			}
			$optionsArray = [];
			foreach ($moduleOptions as $moduleName => $moduleShowKey) {
				$moduleInfo = $this->getModule($moduleName);
				$moduleModel = new EmptyModel();
				$moduleModel->setTable($moduleInfo->tableName)->asArray()->select(array_merge($moduleShowKey, ['id']));
				//todo maybe need handle permissions of linked module
				$moduleData = $moduleModel->findAll();

				foreach ($moduleData as $dataItem) {
					foreach ($moduleShowKey as $key) {
						$optionsArray[$moduleName][$key][] = [
							'value' => $dataItem['id'],
							'label' => $dataItem[$key],
						];
					}
				}
			}
			$module['optionsModules'] = $optionsArray;
			$module['filters'] = [
				'defaultFields' => $this->getDefaultMetasFields(),
				'type' => $this->getFieldTypeFilterDef()
			];
		} catch (ModulesException $e) {
			throw ModulesException::forFailedToAction('[unable_to_get_module]' . $e->getMessage());
		}
		return $module;
	}

	/**
	 * getDetailModule using in manage module function
	 */
	public function getDetailModule($name = null): array
	{
		$name = empty($name) ? $this->module : $name;
		$response = array();
		$metas = $this->getMetas($name, true);
		foreach ($metas as $key => $item) {
			if ($item->field_options_values && !is_array($item->field_options_values)) $metas[$key]->field_options_values = json_decode($item->field_options_values, true);
		}
		$response['metas'] = $metas;

		$routes = $this->getRoutes($name);

		foreach ($routes as $key => $item) {
			$routes[$key] = [
				'id' => $item->id,
				'module' => $item->module,
				'componentPath' => $item->componentPath,
				'redirectPath' => $item->redirectPath,
				'permitAction' => $item->permitAction,
				'permitResource' => $item->permitResource,
				'isPublic' => filter_var($item->isPublic, FILTER_VALIDATE_BOOLEAN),
				'routePath' => $item->routePath,
				'enable' => filter_var($item->enable, FILTER_VALIDATE_BOOLEAN),
				'order' => $item->order,
				'default' => filter_var($item->default, FILTER_VALIDATE_BOOLEAN),
				'meta' => empty($item->meta) ? new \stdClass() : $item->meta
			];
		}
		$response['customRoutes'] = $routes;
		$authorize = \Config\Services::authorization();
		$groups = $authorize->groups();
		$groupsPermits = [];
		$permitsService = \Config\Services::permits();
		$permits = $this->getPermits($name);
		if ($permits) {
			foreach ($permits as $key => $item) {
				$permitName = implode('.', array_slice(explode(".", $item->name), 2));
				$permits[$key] = [
					'id' => $item->id,
					'name' => $permitName,
					'description' => $item->description,
					'module' => $item->module,
					'route' => $item->route,
					'default' => filter_var($item->default, FILTER_VALIDATE_BOOLEAN)
				];
				foreach ($groups as $group) {
					$groupsPermits[$group->id][$permitName] = $permitsService->hasGroupPermit($group->id, $item->name);
				}
			}
		}
		$response['permits'] = $permits;
		$response['groupsPermits'] = $groupsPermits;
		return $response;
	}

	public function _createModule($data)
	{
		$module = new Module();
		$module->fill($data);
		$moduleId = $this->moduleModel->save($module);
		$this->module = $data['name'];

		////////HANDLE DATABASE///////////////
		if ($data['type'] === 'default') {

			//     {$stringFields}
			$arrayDefaultFields = [];
			foreach ($this->defaultFields['fields'] as $key => $field) {
				if ($field['type'] === 'json') $field['type'] = 'longtext';
				$arrayDefaultFields[$key] = $field;
			}

			$this->forge->addField($arrayDefaultFields);
			//     {$stringMetasFields}
			$arrayMetasForeignKeys = $metasFields = [];
			foreach ($data['metas'] as $field) {
				if (empty($field['field'])) {
					if ($this->config['silent']) {
						continue;
					} else {
						throw ModulesException::forMissingParams('field_name');
					}
				}
				$fieldType = ($field['field_type']) ? $field['field_type'] : 'other';
				$metasFields[$field['field']] = $this->fieldTypeDef[$fieldType];
				if ($metasFields[$field['field']]['type'] === 'json') $metasFields[$field['field']]['type'] = 'longtext';
				if (in_array($fieldType, $this->getMetaFieldsAllowOptionSelection()) && $this->config['foreignKeyForMetaFieldsAllowOption']) {
					$arrayMetasForeignKeys[$field['field']] = ['refTable' => 'app_options', 'refField' => 'id', 'onDelete' => 'SET NULL', 'onUpdate' => 'NO ACTION'];
				}
			}
			$this->forge->addField($metasFields);


			//		{$stringKeys}
			foreach ($this->defaultFields['keys'] as $key => $keyData) {
				if ($keyData['primary'] || $keyData['unique']) $this->forge->addKey($key, true);
			}
			//		{$stringForeignKeys}
			foreach (array_merge($this->defaultFields['foreignKeys'], $arrayMetasForeignKeys) as $key => $keyData) {
				$this->forge->addForeignKey($key, $keyData['refTable'], $keyData['refField'], ($keyData['onUpdate']) ? $keyData['onUpdate'] : false, ($keyData['onDelete']) ? $keyData['onDelete'] : false);
			}
			//       {$stringCreateTable}
			$this->forge->createTable($data['tableName'], true);
		}
		////////HANDLE DATABASE///////////////


		//HANDLE METAS FIELDS
		if ($data['type'] === 'default' && !empty($data['metas'])) {
			foreach ($data['metas'] as $field) {
				$this->saveMeta($field);
			}
		}
		//END METAS FIELDS

		//HANDLE ROUTE
		if (!empty(array_filter($data['customRoutes']))) {
			foreach ($data['customRoutes'] as $index => $route) {
				//add custom route
				$route['order'] = $index;
				$this->saveRoute($route);
			}
		}
		//END HANDLE ROUTE

		//HANDLE PERMISSION
		if (!empty($data['permits'])) {
			foreach ($data['permits'] as $index => $permits) {
				$permits['name'] = 'modules.' . $data['name'] . '.' . $permits['name'];
				//$permits['default'] = ($permits['default'] && filter_var($permits['default'], FILTER_VALIDATE_BOOLEAN));
				$this->savePermit($permits);
			}
		}
		$authorize = \Config\Services::authorization();

		if (!empty($data['groupsPermits'])) {
			foreach ($data['groupsPermits'] as $groupId => $groupPermits) {
				foreach ($groupPermits as $permitName => $value) {
					if (!filter_var($value, FILTER_VALIDATE_BOOLEAN)) continue;
					$permitsName = 'modules.' . $data['name'] . '.' . $permitName;
					$authorize->addPermissionToGroup($permitsName, $groupId);
				}

			}
		}
		//END HANDLE PERMISSION

		//UPDATE CACHE
		$this->listModules(true);
		return $this->getModule($data['name'], true);

	}

	public function createModule($data)
	{
		if (empty($data['name'])) {
			throw ModulesException::forMissingName();
		}
		$this->module = $data['name'];
		if ($data['type'] === 'default' && empty($data['tableName'])) {
			throw ModulesException::forMissingTableName();
		}
		$data['tableName'] = $this->handleTableNamePrefix($data['tableName']);

		if (!$this->config['usingMigrate']) {
			return $this->_createModule($data);
		}

		$homePath = APPPATH;
		$fileName = date('Y-m-d-his') . '_create_' . $data['tableName'] . '_tables.php';
		$path = $homePath . '/Database/Migrations/Auto/' . $fileName;
		$className = 'Create_' . $data['tableName'] . 'Tables_' . time();
		$stringData = var_export($data, true);
		$template = <<<EOD
<?php namespace App\Database\Migrations\Auto;
use CodeIgniter\Database\Migration;
class {$className} extends Migration
{
	public function up()
	{
        /*
         * {$data['tableName']}
         */
         \$module = \Config\Services::modules();
         \$module->_createModule({$stringData});
         
	}
	
	public function down()
    {
		// drop constraints first to prevent errors
		\$module = \Config\Services::modules();
		\$module->_deleteModule('{$data['name']}',true);
    }
}
EOD;
		helper('filesystem');
		if (!write_file($path, $template)) {
			throw ModulesException::forUnableToMakeMigration();
		}
		$migrate = \Config\Services::migrations();
		try {
			$migrate->force($path, 'App');
		} catch (\Throwable $e) {
			throw ModulesException::forUnableToMakeTable($e->getMessage());
		}
		return true;

	}

	protected function preUpdateMetas($oldMetas, $newMetas): array
	{
		$dataOldMetas = $dataNewMetas = $needCreate = $needUpdate = $dropForeignKeys = $addForeignKeys = $dropIndexes = array();

		foreach ($oldMetas as $key => $item) {
			$dataOldMetas[$item->field] = $item;
		}
		$metaPosition = 1;
		foreach ($newMetas as $key => $item) {
			if (in_array($item['field'], $this->bannedMetaWords)) {
				continue;
			}
			$item['field_form_order'] = $metaPosition;
			$item['field_table_order'] = $metaPosition;
			$item['field_quick_view_order'] = $metaPosition;
			$item['field_detail_order'] = $metaPosition;
			$item['field_filter_order'] = $metaPosition;
			if (isset($item['module'])) unset($item['module']);
			$dataNewMetas[$key] = $item;

			$fieldType = ($item['field_type']) ? $item['field_type'] : 'other';
			if (empty($item['id']) || !isset($dataOldMetas[$item['field']])) {
				$needCreate[$item['field']] = $this->fieldTypeDef[$fieldType];
				if ($needCreate[$item['field']]['type'] === 'json') $needCreate[$item['field']]['type'] = 'longtext';
				//Add foreign if new type is option
				if (in_array($fieldType, $this->getMetaFieldsAllowOptionSelection()) && $this->config['foreignKeyForMetaFieldsAllowOption']) {
					$addForeignKeys[$item['field']] = ['refTable' => 'app_options', 'refField' => 'id', 'onDelete' => 'SET NULL', 'onUpdate' => 'NO ACTION'];
				}
			} else {
				$oldItem = $dataOldMetas[$item['field']];
				if ($fieldType !== $oldItem->field_type) {
					$needUpdate[$oldItem->field] = $this->fieldTypeDef[$fieldType];
					if ($needUpdate[$oldItem->field]['type'] === 'json') $needUpdate[$oldItem->field]['type'] = 'longtext';
				}
				if ($item['field'] !== $oldItem->field) {
					$needUpdate[$oldItem->field] = $this->fieldTypeDef[$fieldType];
					if ($needUpdate[$oldItem->field]['type'] === 'json') $needUpdate[$oldItem->field]['type'] = 'longtext';
					$needUpdate[$oldItem->field]['name'] = $item['field'];

				}
				if ($fieldType !== $oldItem->field_type || $item['field'] !== $oldItem->field) {
					//Drop foreign if old type is option
					if (in_array($oldItem->field_type, $this->getMetaFieldsAllowOptionSelection()) && $this->config['foreignKeyForMetaFieldsAllowOption']) {
						$dropForeignKeys[] = $oldItem->field;

						if (!in_array($fieldType, $this->getMetaFieldsAllowOptionSelection())) {
							$dropIndexes[] = $oldItem->field;
						}

					}
					//Add foreign if new type is option
					if (in_array($fieldType, $this->getMetaFieldsAllowOptionSelection()) && $this->config['foreignKeyForMetaFieldsAllowOption']) {
						$addForeignKeys[$item['field']] = ['refTable' => 'app_options', 'refField' => 'id', 'onDelete' => 'SET NULL', 'onUpdate' => 'NO ACTION'];
					}

				}

				unset($dataOldMetas[$item['field']]);
			}
			$metaPosition++;
		}

		foreach ($dataOldMetas as $item) {
			if (in_array($item->field_type, $this->getMetaFieldsAllowOptionSelection()) && $this->config['foreignKeyForMetaFieldsAllowOption']) {
				$dropForeignKeys[] = $item->field;
			}
		}

		return array(
			'data' => $dataNewMetas,
			'create' => $needCreate,
			'update' => $needUpdate,
			'delete' => $dataOldMetas,
			'dropForeignKeys' => $dropForeignKeys,
			'addForeignKeys' => $addForeignKeys,
			'dropIndexes' => $dropIndexes
		);
	}

	protected function preUpdateRoutes($oldRoutes, $newRoutes): array
	{
		$dataOldRoutes = $dataNewRoutes = $needDelete = array();
		foreach ($oldRoutes as $key => $item) {
			$dataOldRoutes[$item->id] = $item->id;
		}
		$routePosition = 0;
		foreach ($newRoutes as $key => $item) {
			$item['order'] = $routePosition;
			if (isset($item['module'])) unset($item['module']);
			$dataNewRoutes[$key] = $item;
			if (!empty($item['id'])) unset($dataOldRoutes[$item['id']]);
		}
		return array(
			'data' => $dataNewRoutes,
			'delete' => $dataOldRoutes
		);
	}

	protected function preUpdatePermits($oldPermits, $newPermits): array
	{
		$dataOldPermits = $dataNewPermits = $needDelete = array();
		foreach ($oldPermits as $key => $item) {
			$dataOldPermits[$item->id] = $item->id;
		}


		foreach ($newPermits as $key => $item) {
			if (isset($item['module'])) unset($item['module']);
			$dataNewPermits[] = $item;
			if (!empty($item['id'])) unset($dataOldPermits[$item['id']]);
		}
		return array(
			'data' => $dataNewPermits,
			'delete' => $dataOldPermits
		);

	}

	protected function preRollbackUpdateData($id)
	{
		$module = $this->moduleModel->asArray()->getModule($id);
		$name = $module['name'];
		$data = $this->getDetailModule($name, ['routes' => ['skipDefault' => true]]);
		$module = array_merge($module, $data);
		foreach ($module['metas'] as $key => $item) {
			$module['metas'][$key] = (array)$item;
		}
		return $module;
	}

	public function _updateModule($data, $id = null)
	{
		$data['tableName'] = $this->handleTableNamePrefix($data['tableName']);
		$currentModule = $this->getModule($id);
		$currentName = $currentModule->name;
		$currentTableName = $currentModule->tableName;
		$this->module = $currentName;
		$currentModule->fill($data);
		////////HANDLE METAS FIELDS///////////////
		////// Preparing meta data //////
		$currentMetas = $this->getMetas($currentName, true);
		$metas = $this->preUpdateMetas($currentMetas, $data['metas']);
		$dropCol = $deleteMetaIds = [];
		foreach ($metas['delete'] as $item) {
			$dropCol[] = $item->field;
			$deleteMetaIds[] = $item->id;
		}
		/* Delete meta fields */
		if (!empty($deleteMetaIds)) {
			$this->deleteMeta($deleteMetaIds);
		}
		/* Save others (new and update) */
		if ($data['type'] === 'default' && !empty($metas['data'])) {
			foreach ($metas['data'] as $field) {
				$this->saveMeta($field);
			}
		}
		$this->getMetas($currentName, true);
		$this->getAllMetas(true);
		////////END HANDLE METAS FIELDS///////////////

		////////HANDLE ROUTES DATA///////////////
		//Preparing route data ////
		$currentRoutes = $this->getRoutes($currentName, true);
		$routes = $this->preUpdateRoutes($currentRoutes, $data['customRoutes']);
		/* Delete routes */
		if (!empty($routes['delete'])) {
			$this->deleteRoute($routes['delete']);
		}
		/* Save others (new and update position) */
		if (!empty($routes['data'])) {
			foreach ($routes['data'] as $index => $route) {
				$route['default'] = empty($route['default']) ? 'false' : 'true';
				$route['order'] = $index;
				$this->saveRoute($route);
			}
		}
		$this->getRoutes($currentName, true);
		////////END HANDLE ROUTES DATA///////////////


		////////HANDLE PERMITS///////////////
		$currentPermits = $this->getPermits($currentName);
		$permits = $this->preUpdatePermits($currentPermits, $data['permits']);

		/* Delete permits */
		if (!empty($permits['delete'])) {
			$this->deletePermits($permits['delete']);
		}
		/* Save others (new) */
		if (!empty($permits['data'])) {
			foreach ($permits['data'] as $index => $permits) {
				$permits['name'] = 'modules.' . $data['name'] . '.' . $permits['name'];
				$this->savePermit($permits);
			}
		}
		$authorize = \Config\Services::authorization();
		if (!empty($data['groupsPermits'])) {
			foreach ($data['groupsPermits'] as $groupId => $groupPermits) {
				foreach ($groupPermits as $permitName => $value) {
					$permitsName = 'modules.' . $data['name'] . '.' . $permitName;
					if (!filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
						$authorize->removePermissionFromGroup($permitsName, $groupId);
					} else {
						$authorize->addPermissionToGroup($permitsName, $groupId);
					}
				}
			}
		}

		////////END HANDLE PERMITS///////////////


		////////HANDLE DATABASE///////////////
		if ($data['type'] === 'default') {

			$db = \Config\Database::connect();
			$dropOldForeignKeys = $newForeignKeys = [];
			if ($currentName !== $data['name']) {
				$currentForeignKeys = $db->getForeignKeyData($currentTableName);
				foreach ($currentForeignKeys as $foreignKey) {
					if (in_array($foreignKey->column_name, $metas['dropForeignKeys'])) continue; //skip if this column will be drop
					$dropOldForeignKeys[] = $foreignKey->column_name;
					$newForeignKeys[$foreignKey->column_name] = ['refTable' => $foreignKey->foreign_table_name, 'refField' => $foreignKey->foreign_column_name, 'onDelete' => 'NO ACTION', 'onUpdate' => 'NO ACTION'];
				}
			}

			//Backup Database before update//
			if ($currentName !== $data['name'] || !empty($metas['dropForeignKeys']) || !empty($dropCol) || !empty($metas['create']) || !empty($metas['update']) || !empty($metas['addForeignKeys']) || !empty($newForeignKeys) || !empty($metas['dropIndexes'])) {
				$fileName = date('Y-m-d-his') . '_[before]_UPDATE_' . $data['tableName'] . '_tables.sql';
				$this->backupSql(APPPATH . '/Database/Backup/' . $fileName, ['include-tables' => [$currentTableName]]);
			}

			//{$stringDropForeignKeys}
			$metas['dropForeignKeys'] = array_merge($metas['dropForeignKeys'], $dropOldForeignKeys); //Merge with drop key because rename table


			if (!empty($metas['dropForeignKeys'])) {
				foreach ($metas['dropForeignKeys'] as $key) {
					$nameKey = $currentTableName . '_' . $key . '_foreign';
					$this->forge->dropForeignKey($currentTableName, $nameKey);
				}
			}
			//{$dropColString}
			if (!empty($dropCol)) {
				$dropCols = implode(',', $dropCol);
				$this->forge->dropColumn($currentTableName, $dropCols);
			}
			//{$renameTableString}
			if ($currentName !== $data['name']) {
				$this->forge->renameTable($currentTableName, $data['tableName']);
			}
			//{$addColString}
			if (!empty($metas['create'])) {
				$this->forge->addColumn($data['tableName'], $metas['create']);
			}

			//{$updateColString}
			if (!empty($metas['update'])) {
				$this->forge->modifyColumn($data['tableName'], $metas['update']);
			}
			//{$stringForeignKeys}
			$metas['addForeignKeys'] = array_merge($metas['addForeignKeys'], $newForeignKeys); //Merge with key need to rename because rename table
			if (!empty($metas['addForeignKeys'])) {
				$this->_processUpdateForeignKeys($data['tableName'], $metas['addForeignKeys'], $db);
			}
			//{$dropIndexesString} /* Drop indexes because column change type from field allow options to field not allow options */
			if (!empty($metas['dropIndexes'])) {
				$dropSql = '';
				foreach ($metas['dropIndexes'] as $indexItem) {
					$dropSql .= "DROP INDEX " . $db->escapeIdentifiers($data['tableName'] . '_' . $indexItem . '_foreign') . ",";
				}
				$dropSql = rtrim($dropSql, ',');
				$db->query('ALTER TABLE' . $data['tableName'] . ' ' . $dropSql);
			}

		}
		////////END HANDLE DATABASE///////////////
		try {
			$this->moduleModel->save($currentModule);
		} catch (\Exception $e) {
		}
		//UPDATE CACHE
		return $this->getModule($data['name'], true);
	}

	public function updateModule($data, $id = null)
	{
		if ($data['type'] === 'default' && empty($data['tableName'])) {
			throw ModulesException::forMissingTableName();
		}

		if (!$this->config['usingMigrate']) {
			return $this->_updateModule($data, $id);
		}

		$rollBackData = $this->preRollbackUpdateData($id);
		$homePath = APPPATH;
		$fileName = date('Y-m-d-his') . '_update_' . $data['tableName'] . '_tables.php';
		$path = $homePath . '/Database/Migrations/Auto/' . $fileName;
		$className = 'Update_' . $data['tableName'] . 'Tables_' . time();
		$stringData = var_export($data, true);
		$stringRollBackData = var_export($rollBackData, true);
		$template = <<<EOD
<?php namespace App\Database\Migrations\Auto;
use CodeIgniter\Database\Migration;
class {$className} extends Migration
{
	public function up()
	{
        /*
         * {$data['tableName']}
         */
          \$this->db->disableForeignKeyChecks();
		 \$module = \Config\Services::modules();
         \$module->_updateModule({$stringData},'{$rollBackData['name']}');
          \$this->db->enableForeignKeyChecks();
        
	}
	public function down(){
			 \$this->db->disableForeignKeyChecks();
		 \$module = \Config\Services::modules();
         \$module->_updateModule({$stringRollBackData},'{$data['name']}');
          \$this->db->enableForeignKeyChecks();
	
	}
}
EOD;


		helper('filesystem');
		if (!write_file($path, $template)) {
			throw ModulesException::forUnableToMakeMigration();
		}

		$migrate = \Config\Services::migrations();
		try {
			return $migrate->force($path, 'App');
		} catch (\Throwable $e) {
			throw ModulesException::forUnableToMakeTable($e->getMessage());
		}


	}

	public function _deleteModule($moduleId, $permanent = false)
	{

		$moduleIdList = (is_array($moduleId)) ? $moduleId : [$moduleId];

		$deleteId = [];
		$moduleData = [];
		foreach ($moduleIdList as $item) {
			$module = $this->getModule($item);
			$deleteId[] = $module->id;
			$moduleData[] = $module;
		}
		if ($permanent) {
			foreach ($moduleData as $module) {
				if (!empty($module->tableName)) {
					$fileName = date('Y-m-d-his') . '_[before]_DELETE_' . $module->tableName . '_tables.sql';
					$this->backupSql(APPPATH . '/Database/Backup/' . $fileName, ['include-tables' => [$module->tableName]]);
					$this->forge->dropTable($module->tableName, true);
					//clear cache
					$this->cache("module-{$module->name}", null);
				}
			}
		}
		$result = $this->moduleModel->delete($deleteId, $permanent);
		//Update cache module
		$this->listModules(true);
		return $result;
	}

	public function deleteModule($moduleId, $permanent = false)
	{
		if (empty($moduleId)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('module_id');
			}
		}

		if (!$this->config['usingMigrate']) {
			return $this->_deleteModule($moduleId, $permanent);
		}
		$moduleInfo = (is_array($moduleId)) ? 'multi_' . $this->getModule($moduleId[0])->tableName : $this->getModule($moduleId)->tableName;
		$homePath = APPPATH;
		$fileName = date('Y-m-d-his') . '_delete_' . $moduleInfo . '_tables.php';
		$path = $homePath . '/Database/Migrations/Auto/' . $fileName;
		$className = 'Delete_' . $moduleInfo . 'Tables_' . time();
		$stringData = var_export($moduleId, true);
		$template = <<<EOD
<?php namespace App\Database\Migrations\Auto;
use CodeIgniter\Database\Migration;
class {$className} extends Migration
{
	public function up()
	{
        /*
         * {$moduleInfo}
         */
        \$module = \Config\Services::modules();
         \$module->_deleteModule({$stringData},{$permanent});
	}
	
	public function down()
    {
		
    }
}
EOD;
		helper('filesystem');
		if (!write_file($path, $template)) {
			throw ModulesException::forUnableToMakeMigration();
		}
		$migrate = \Config\Services::migrations();
		try {
			$migrate->force($path, 'App');
		} catch (\Throwable $e) {
			throw ModulesException::forUnableToMakeTable($e->getMessage());
		}
		return true;


	}

	public function getDefaultRoutes(): array
	{
		return $this->route;
	}

	public function getRoutes($name = null, $forceUpdateCache = false)
	{
		$name = ($name) ? $name : $this->module;
		if (empty($name)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingName();
			}
		}
		$module = $this->getModule($name);
		//Get original module meta
		//Check the cache
		$routes = cache("module-routes-{$name}");
		if (!$routes || $forceUpdateCache) {
			// Query the database
			$routes = $this->routeModel->getModuleRoutes($module->id);
			foreach ($routes as $key => $value) {
				$routes[$key]->meta = empty($value->meta) ? new \stdClass() : json_decode(str_replace("'", '"', $value->meta), true);
				$routes[$key]->isPublic = filter_var($value->isPublic, FILTER_VALIDATE_BOOLEAN);
				$routes[$key]->enable = filter_var($value->enable, FILTER_VALIDATE_BOOLEAN);
				$routes[$key]->default = filter_var($value->default, FILTER_VALIDATE_BOOLEAN);
				foreach ($module->getAttributes() as $k => $v) {
					if (in_array($k, ['id', 'tableName'])) continue;
					$routes[$key]->$k = $v;
				}
			}
			$this->cache("module-routes-{$name}", $routes);
		}
		return $routes;
	}

	public function saveRoute($routeData, $name = null): ?bool
	{
		$name = ($name) ? $name : $this->module;
		if (empty($name)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('module_name');
			}
		}
		if (empty($routeData)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('route_data');
			}
		}
		$module = $this->getModule($name);
		$exist = $this->routeModel->isRoutePathExists($module->id, $routeData['routePath']);
		if (!isset($routeData['id']) && $exist) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forExistsData('route_path');
			}
		}
		if (!isset($routeData['module'])) $routeData['module'] = $module->id;

		try {
			helper('db');
			if (!empty($routeData['id'])) {
				if ($exist) {
					$routeData['id'] = $exist->id;
				} else {
					unset($routeData['id']);
				}
			}
			if (empty($routeData['meta'])) {
				$routeData['meta'] = '{}';
			} else {
				if (!is_string($routeData['meta'])) $routeData['meta'] = json_encode($routeData['meta']);
			}


			$this->routeModel->save(boolFieldInsert($this->routeModel, $routeData));
			//START UPDATE CACHE ROUTES
			$this->getRoutes($name, true);
			//END UPDATE CACHE ROUTES
			return true;
		} catch (\ReflectionException $e) {
			throw ModulesException::forFailedToAction('_save_route_' . $e->getMessage());
		}
	}

	public function deleteRoute($routeId, $name = null): ?bool
	{
		$name = ($name) ? $name : $this->module;
		if (empty($name)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingName();
			}
		}
		if (empty($routeId)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('route_id');
			}
		}
		if ($this->routeModel->delete($routeId)) {
			//START UPDATE CACHE ROUTES
			$this->getRoutes($name, true);
			//END UPDATE CACHE ROUTES
			return true;
		} else {
			throw ModulesException::forFailedToAction('_delete_route');
		}
		//todo Delete route - finish but not testing yet
	}

	public function getDefaultPermits(): array
	{
		return $this->permits;
	}

	public function getPermits($name = null): ?array
	{
		$name = ($name) ? $name : $this->module;
		if (empty($name)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingName();
			}
		}
		$module = $this->getModule($name);
		$permitModel = new PermitModel();
		return $permitModel->where('module', $module->id)->findAll();
		//todo Get permission module function - finish but not testing yet
	}

	public function savePermit($permitData, $name = null): ?bool
	{
		$name = ($name) ? $name : $this->module;
		if (empty($name)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('module_name');
			}
		}
		if (empty($permitData)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('permit_data');
			}
		}
		$module = $this->getModule($name);
		$permitModel = new PermitModel();
		$exist = $permitModel->where(['module' => $module->id, 'name' => $permitData['name']])->first();
		if (!isset($permitData['id']) && $exist) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forExistsData('module_permit');
			}
		}
		if (!isset($permitData['module'])) $permitData['module'] = $module->id;


		try {
			helper('db');
			if (!empty($permitData['id'])) {
				if ($exist) {
					$permitData['id'] = $exist->id;
				} else {
					unset($permitData['id']);
				}
			}

			$permitModel->save(boolFieldInsert($permitModel, $permitData));
			return true;
		} catch (\ReflectionException $e) {
			throw ModulesException::forFailedToAction('_add_permit');
		}

	}

	public function deletePermits($permitId)
	{
		if (empty($permitId)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('permit_id');
			}
		}
		$permitModel = new PermitModel();
		return $permitModel->delete($permitId);
		//todo Delete permission module function - finish but not testing with have cache case
	}

	private function metasReturn($data, $sort, $userMetas): array
	{
		if ($userMetas) {
			foreach ($userMetas as $metaItem) {
				foreach ($metaItem as $key => $value) {
					if (in_array($key, ['id', 'module_id', 'module_meta_id', 'user_id'])) continue;
					if (is_null($value)) continue; //skip if it null
					$data[$metaItem->module_meta_id]->$key = $value;
				}
			}
		}
		$result = array();
		helper('db');
		helper('common');
		$fields = getTableFields('modules_metas', '', true);
		$fields = arrayKey($fields, 'name', '', true);
		if (is_array($data)) {
			foreach ($data as $index => $item) {
				foreach ($item as $key => $value) {
					if (isset($fields[$key]) && $fields[$key]['type'] === 'tinyint' && $fields[$key]['max_length'] === 1) $item->$key = filter_var($value, FILTER_VALIDATE_BOOLEAN);
				}
				$item->field_options = (empty($item->field_options)) ? [] : json_decode($item->field_options, true);
				$item->field_options_values = (empty($item->field_options_values)) ? [] : json_decode($item->field_options_values, true);

				$result[] = $item;
			}
		} else {
			foreach ($data as $key => $value) {
				if (isset($fields[$key]) && $fields[$key]['type'] === 'tinyint' && $fields[$key]['max_length'] === 1) $data->$key = filter_var($value, FILTER_VALIDATE_BOOLEAN);
				$data->field_options = (empty($data->field_options)) ? [] : json_decode($data->field_options, true);
				$data->field_options_values = (empty($data->field_options_values)) ? [] : json_decode($data->field_options_values, true);
			}

			$result = $data;
		}
		$resultSort = array_column($result, $sort);
		array_multisort($resultSort, SORT_ASC, $result);
		return $result;
	}

	public function getAllMetas($forceUpdateCache = false, $sort = 'field_table_order'): array
	{
		// Check the cache
		$metas = cache("module-all-metas");
		if (!$metas || $forceUpdateCache) {
			// Query the database
			$metas = $this->metaModel->getModuleMetas();
			$this->cache("module-all-metas", $metas);
		}

		//Get user custom module meta
		//check the cache
		$userMeta = $this->getAllMetasUser($forceUpdateCache);
		return $this->metasReturn($metas, $sort, $userMeta);
	}

	public function getAllMetasUser($forceUpdateCache = false)
	{
		$userId = $this->getUserId();
		$userMeta = cache("module-custom-metas-{$userId}");
		if (!$userMeta || $forceUpdateCache) {
			$userMeta = $this->metaModel->getModuleMetasUser(null, $userId);
			$this->cache("module-custom-metas-{$userId}", $userMeta);
		}
		return $userMeta;
	}

	public function getMetas($identify = null, $forceUpdateCache = false, $sort = 'field_table_order'): ?array
	{
		$identify = ($identify) ? $identify : $this->module;
		if (empty($identify)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingName();
			}
		}
		$module = $this->getModule($identify);
		if ($module->system) {
			//return field from system module
			$metas = [];
			foreach ($module->metas as $item) {
				$metas[] = (object)$item;
			}
			return $metas;
		} else {
			//Get original module meta
			// Check the cache
			$metas = cache("module-metas-{$module->name}");
			if (!$metas || $forceUpdateCache) {
				// Query the database
				$metas = $this->metaModel->getModuleMetas($module->id);
				$this->cache("module-metas-{$module->name}", $metas);
			}
			//Get user custom module meta
			//check the cache
			$userId = $this->getUserId();
			$userMeta = cache("module-metas-{$module->name}-{$userId}");
			if (!$userMeta || $forceUpdateCache) {
				$userMeta = $this->metaModel->getModuleMetasUser($module->id, $userId);
				$this->cache("module-metas-{$module->name}-{$userId}", $userMeta);
			}
			return $this->metasReturn($metas, $sort, $userMeta);
		}
	}

	protected function handleAppOption($table, $field, $metaId, $data): array
	{
		$appOptionModel = new AppOptionModel();

		$default = ($data['default']) ? $data['default'] : '';
		$options = ($data['values']) ? $data['values'] : [];
		$returnData = [];
		$currentOption = $appOptionModel->where(['table' => $table, 'meta_id' => $metaId, 'field' => $field])->findAll();
		$arrayCurrentOptionId = [];
		foreach ($currentOption as $item) {
			$arrayCurrentOptionId[$item->id] = $item->id;
		}
		foreach ($options as $key => $item) {
			if (empty($item['name'])) continue;
			$item['order'] = $key;
			if (empty($item['id'])) {
				$data = ['table' => $table, 'meta_id' => $metaId, 'field' => $field, 'value' => $item['name']];
				if ($exist = $appOptionModel->where($data)->first()) {
					$data['default'] = ($item['name'] == $default) ? 1 : 0;
					$data['order'] = $item['order'];
					$item['id'] = $exist->id;
					$appOptionModel->update($exist->id, $data);
				} else {
					$data['default'] = ($item['name'] == $default) ? 1 : 0;
					$data['order'] = $item['order'];
					$item['id'] = $appOptionModel->insert($data);
				}
			} else {
				$data = ['table' => $table, 'meta_id' => $metaId, 'field' => $field, 'value' => $item['name'], 'default' => ($item['name'] == $default) ? 1 : 0, 'order' => $item['order']];
				$appOptionModel->update($item['id'], $data);
			}
			unset($item['chosen']);
			unset($item['selected']);
			$returnData[] = $item;
			unset($arrayCurrentOptionId[$item['id']]);
		}
		foreach ($arrayCurrentOptionId as $item) {
			$appOptionModel->delete($item);
		}
		return [
			'default' => $default,
			'values' => $returnData
		];
	}

	public function saveMeta($data, $name = null): ?bool
	{
		$name = ($name) ? $name : $this->module;
		if (empty($name)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingName();
			}
		}

		if (empty($data)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('metas_data');
			}
		}

		if (!empty($data['module'])) {
			if (!$this->moduleModel->find($data['module'])) return true;
		}
		$module = $this->getModule($name);
		$exist = $this->metaModel->isMetaFieldExists($module->id, $data['field']);

		if (!isset($data['id']) && $exist) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forExistsData('field_name');
			}
		}
		if (!isset($data['module'])) $data['module'] = $module->id;

		try {
			//HANDLE APP OPTIONS AND SAVE META FIELD
			$field_options_values = $data['field_options_values'];
			$data['field_options_values'] = json_encode($data['field_options_values']);
			$data['field_options'] = empty($data['field_options']) ? '{}' : (is_array($data['field_options']) ? json_encode($data['field_options']) : $data['field_options']);
			helper('db');
			$data = boolFieldInsert($this->metaModel, $data);
			if (!empty($data['id'])) {
				if ($exist) {
					$data['id'] = $exist->id;
				} else {
					unset($data['id']);
				}
			}
			$this->metaModel->save($data);
			if (isset($field_options_values['values']) && !empty(array_filter($field_options_values['values']))) {
				$data['id'] = (empty($data['id'])) ? $this->metaModel->getInsertID() : $data['id'];
				$data['field_options_values'] = $this->handleAppOption($module->tableName, $data['field'], $data['id'], $field_options_values);
				$data['field_options_values'] = json_encode($data['field_options_values']);
				$this->metaModel->save($data);
			}
			//START UPDATE CACHE
			$this->getMetas($name, true);
			//END UPDATE CACHE
			return true;
		} catch (\Exception $e) {
			throw ModulesException::forFailedToAction('_save_field_' . $data['field'] . '_' . $e->getMessage());
		}

	}

	public function deleteMeta($metaId)
	{
		if (empty($metaId)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingParams('meta_id');
			}
		}
		return $this->metaModel->delete($metaId);
	}

	public function updateMetasUser($data, $name = null): bool
	{
		$name = ($name) ?: $this->module;
		if (!empty($data)) {
			foreach ($data as $item) {
				$this->metaModel->updateModuleMetasUser($item);
			}
			$this->getAllMetasUser(true);
			$this->getMetas($name, true);
		}
		return true;
	}

	public function getLinkedModule($name = null): ?array
	{
		$name = ($name) ?: $this->module;
		if (empty($name)) {
			if ($this->config['silent']) {
				return null;
			} else {
				throw ModulesException::forMissingName();
			}
		}
		$liked_fields = $this->metaModel->where(['field_select_module' => $name])->whereIn('field_type', $this->getMetaFieldsAllowModuleSelection())->asArray()->findAll();
		$result = [];
		foreach ($liked_fields as $field) {
			$linkModule = $this->getModule($field['module']);
			$result[$linkModule->name][$field['field']] = $field['field_select_field_show'];
		}
		return $result;
	}


	/**
	 * Process foreign keys
	 *
	 * @param string $table Table name
	 * @param $foreignKeys
	 * @param $db
	 * @return string
	 */
	protected function _processUpdateForeignKeys(string $table, $foreignKeys, $db)
	{
		$sql = "";
		$allowActions = [
			'CASCADE',
			'SET NULL',
			'NO ACTION',
			'RESTRICT',
			'SET DEFAULT',
		];

		if ($foreignKeys !== []) {
			foreach ($foreignKeys as $field => $fkey) {
				$nameIndex = $table . '_' . $field . '_foreign';

				$sql .= ",ADD CONSTRAINT " . $db->escapeIdentifiers($nameIndex)
					. ' FOREIGN KEY(' . $db->escapeIdentifiers($field) . ') REFERENCES ' . $db->escapeIdentifiers($db->DBPrefix . $fkey['refTable']) . ' (' . $db->escapeIdentifiers($fkey['refField']) . ')';

				if ($fkey['onDelete'] !== false && in_array($fkey['onDelete'], $allowActions, true)) {
					$sql .= ' ON DELETE ' . $fkey['onDelete'];
				}

				if ($fkey['onUpdate'] !== false && in_array($fkey['onUpdate'], $allowActions, true)) {
					$sql .= ' ON UPDATE ' . $fkey['onUpdate'];
				}
			}
		}
		$sql = ltrim($sql, ",");
		return $result = $db->query("ALTER TABLE " . $db->escapeIdentifiers($table) . " " . $sql);
	}

	protected function backupSql($path, $setting = array()): ?string
	{
		try {
			$dump = new Mysqldump('mysql:host=' . $_ENV['database.default.hostname'] . ';dbname=' . $_ENV['database.default.database'], $_ENV['database.default.username'], $_ENV['database.default.password'], $setting);
			return $dump->start($path);
		} catch (\Exception $e) {
			return $e->getMessage();
		}
	}

	/**
	 * @throws \Exception
	 *
	 */
	public function saveRecord($data, $filesList = [], $multiple = false, $options = [
		'handleDataBeforeSave' => true,
		'handleDataBeforeSaveFn' => false,
		'customBeforeHandleDataFn' => false,
		'customAfterHandleDataFn' => false,
		'triggerAfter' => false,
		'checkPermits' => true,
		'customPermits' => [],
		'validate' => true,
		'fastUpdate' => false
	])
	{
		if (empty($data)) throw new \Exception(MISSING_REQUIRED, 400);
		$handleDataBeforeSave = $options['handleDataBeforeSave'] ?? true;
		$handleDataBeforeSaveFn = $options['handleDataBeforeSaveFn'] ?? true;
		$customBeforeHandleDataFn = $options['customBeforeHandleDataFn'] ?? false;
		$customAfterHandleDataFn = $options['customAfterHandleDataFn'] ?? false;
		$triggerAfter = $options['triggerAfter'] ?? false;
		$checkPermits = $options['checkPermits'] ?? true;
		$customPermits = $options['customPermits'] ?? [];
		$validate = $options['validate'] ?? true;
		$fastUpdate = $options['fastUpdate'] ?? false;

		$model = $this->model;
		$name = $this->moduleData->name;
		$fn = 'save';
		$fnCustomPermits = empty($moduleOpt[$fn]['custom_permits']) ? false : $moduleOpt[$fn]['custom_permits'];
		if ($checkPermits) {
			if ($this->moduleData->system) {
				if (!hasPermission($name . '.manage')) throw new \Exception(MISSING_ACCESS_PERMISSION, 401);
			} else {
				$customPer = true;
				if ($fnCustomPermits) {
					foreach ($fnCustomPermits as $item) {
						if (!hasPermission($item)) {
							$customPer = false;
						}
					}
				}
				if (!mayAdd($name) && ($fnCustomPermits && !$customPer)) throw new \Exception(MISSING_ADD_PERMISSION, 401);
				if (isset($data['id'])) {
					if (!mayUpdateResource($this->moduleData->name, $data['id']) && ($fnCustomPermits && !$customPer)) throw new \Exception(MISSING_UPDATE_PERMISSION, 401);
				}
			}
		}
		if (!empty($customPermits)) {
			$customPer = true;
			foreach ($customPermits as $item) {
				if (!hasPermission($item)) {
					$customPer = false;
				}
			}
			if (!$customPer) throw new \Exception(MISSING_PERMISSION, 401);
		}

		if ($multiple === false) {
			$data = [$data];
		}
		$insertResult = [];


		foreach ($data as $rowKey => $row) {
			if (empty($row)) continue;
			$filesData = [];
			if ($multiple && !empty($filesList)) {
				$filesData = $filesList[$rowKey] ?? [];
			} else {
				$filesData = $filesList;
			}
			if ($customBeforeHandleDataFn && is_callable($customBeforeHandleDataFn)) {
				$row = $customBeforeHandleDataFn($row, $rowKey);
			}
			//$fields = ($fastUpdate) ? array_keys($data) : [];
			$fields = array_merge(array_keys($row), array_keys($filesData));
			if (!empty($row['filesWillDelete']['other'])) {
				$fields = array_merge($fields, array_keys($row['filesWillDelete']['other']));
			}
			$fields = array_unique($fields);
			$dataHandle = $handleDataBeforeSave ? handleDataBeforeSave($this, $row, $filesData, $fields, $handleDataBeforeSaveFn) : $row;
			if ($customAfterHandleDataFn && is_callable($customAfterHandleDataFn)) {
				$dataHandle = $customAfterHandleDataFn($dataHandle);
			}
			$saveData = $dataHandle['data'];
			$uploadFieldsArray = $dataHandle['uploadFieldsArray'];

			if ($validate) {
				$validation = \Config\Services::validation();
				if (!empty($dataHandle['validate']) && !$fastUpdate) {
					if (!$validation->reset()->setRules($dataHandle['validate'])->run($saveData)) {
						throw new \Exception(json_encode($validation->getErrors()), 400);
					}
				}
			}
			$model->setAllowedFields($dataHandle['fieldsArray']);
			try {
				$model->save($saveData);

			} catch (\ReflectionException $e) {
				throw new \Exception(FAILED_SAVE . '_' . $e->getMessage());
			}

			if (!isset($saveData['id'])) $saveData['id'] = $model->getInsertID();
			$id = $saveData['id'];

			helper('filesystem');
			if (!empty($saveData['filesWillDelete'])) {
				$storePath = getModuleUploadPath($name, $id);
				if (!empty($saveData['filesWillDelete']['data'])) {
					$storeFolderPath = $storePath . 'data/';
					foreach ($saveData['filesWillDelete']['data'] as $fileName) {
						$deletePath = $storeFolderPath . $fileName;
						if (is_file($deletePath)) {
							unlink($deletePath);
						}
					}
				}

				if (!empty($saveData['filesWillDelete']['other'])) {
					$storeFolderPath = $storePath . 'other/';
					foreach ($saveData['filesWillDelete']['other'] as $fieldName => $fileFields) {
						if (empty($fileFields)) continue;
						foreach ($fileFields as $files) {
							$files = $files['file'];
							$deletePath = $storeFolderPath . $files['fileName'];
							if (is_file($deletePath) && unlink($deletePath)) {
								if (!empty($uploadFieldsArray[$fieldName])) {
									if ($uploadFieldsArray[$fieldName]->field_type == 'upload_multiple' && !empty($saveData[$fieldName])) {
										$arrayFiles = json_decode($saveData[$fieldName], true);
										if (($key = array_search($files['fileName'], $arrayFiles)) !== false) {
											unset($arrayFiles[$key]);
										}
										$saveData[$fieldName] = json_encode(array_values($arrayFiles));
									} else {
										$saveData[$fieldName] = '';
									}
								}
							}
						}
					}
				}
			}
			if ($filesData) {
				foreach ($filesData as $key => $files) {
					if (empty($files)) continue;
					if (!is_array($files)) $files = [$files];
					foreach ($files as $position => $file) {
						if (empty($uploadFieldsArray[$key]) && is_array($file) && !isset($file['data'])) continue;
						if (empty($uploadFieldsArray[$key])) $file = $file['data'];
						if (!$file->hasMoved() && $file->isValid()) {
							$subPath = (!empty($uploadFieldsArray[$key])) ? 'other' : 'data';
							$storePath = getModuleUploadPath($name, $id) . $subPath . '/';
							if ($key === 'filesDataWillUpdate') {
								$fileName = $saveData[$key][$position]['name'];
								$removeOldFilePath = $storePath . $fileName;
								if (is_file($removeOldFilePath)) {
									unlink($removeOldFilePath);
								}
								$fileName = safeFileName($fileName);
								$file->move($storePath, $fileName);
							} else {
								$fileName = safeFileName($file->getName());
								$file->move($storePath, $fileName);
								if (!empty($uploadFieldsArray[$key])) {
									if ($uploadFieldsArray[$key]->field_type == 'upload_multiple') {
										$arrayFiles = isset($saveData[$key]) ? json_decode($saveData[$key], true) : [];
										$arrayFiles[] = $file->getName();
										$saveData[$key] = json_encode($arrayFiles);


									} else if ($uploadFieldsArray[$key]->field_type == 'upload_image' && (!isset($uploadFieldsArray[$key]->field_options['compressImage']) || $uploadFieldsArray[$key]->field_options['compressImage'] === true)) {
										$currentFileName = pathinfo($storePath . $fileName, PATHINFO_FILENAME);
										$image = \Config\Services::image();
										$webpPath = $currentFileName . '.' . 'webp';
										$image->withFile($storePath . $fileName);
										if (isset($uploadFieldsArray[$key]->field_options['cropImage']) && !empty($uploadFieldsArray[$key]->field_options['cropImage']['width']) && !empty($uploadFieldsArray[$key]->field_options['cropImage']['height'])) {
											$maintainRatio = $uploadFieldsArray[$key]->field_options['cropImage']['maintainRatio'] ?? false;
											$masterDim = $uploadFieldsArray[$key]->field_options['cropImage']['masterDim'] ?? 'auto';
											$image->resize($uploadFieldsArray[$key]->field_options['cropImage']['width'], $uploadFieldsArray[$key]->field_options['cropImage']['height'], $maintainRatio, $masterDim);
										}
										$image->withResource()->convert(IMAGETYPE_WEBP)->save($storePath . $webpPath, 80);
										unlink($storePath . $fileName);
										$saveData[$key] = $webpPath;
									} else {
										$saveData[$key] = $fileName;
									}
								}
							} //end check file update
						}
					}
				}
			}
			if ($filesData || !empty($saveData['filesWillDelete']['other'])) {
				try {
					$model->setAllowedFields($dataHandle['fieldsArray'])->save($saveData);
				} catch (\ReflectionException $e) {
					throw new \Exception(FAILED_SAVE . '_' . $e->getMessage());
				}
			}
			$insertResult[] = $id;
			if ($triggerAfter && is_callable($triggerAfter)) {
				$triggerAfter($row, $id);
			}
		}
		return count($insertResult) === 1 ? $insertResult[0] : $insertResult;
	}

}