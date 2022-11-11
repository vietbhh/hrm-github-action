<?php namespace Halo\Modules\Config;

use Halo\Modules\Models\MetaModel;
use Halo\Modules\Models\ModuleModel;
use Halo\Modules\Config\Module as ModulesConfig;
use Halo\Modules\Models\RouteModel;
use Halo\Modules\ModulesManager;

require_once APPPATH . 'Config/Services.php';

class Services extends \CodeIgniter\Config\BaseService
{
	/**
	 * @param string|null $module
	 * @param ModulesConfig|null $config
	 * @param ModuleModel|null $moduleModel
	 * @param RouteModel|null $routeModel
	 * @param MetaModel|null $metaModel
	 * @param bool $getShared
	 * @return ModulesManager
	 */
	public static function modules($module = '', ModulesConfig $config = null, ModuleModel $moduleModel = null, RouteModel $routeModel = null, MetaModel $metaModel = null, bool $getShared = true): ModulesManager
	{
		if ($getShared) {
			return static::getSharedInstance('modules', $module, $config, $moduleModel, $routeModel, $metaModel);
		}
		return new ModulesManager(
			$module,
			$config ?? config('Module'),
			$moduleModel ?? model(ModuleModel::class),
			$routeModel ?? model(RouteModel::class),
			$metaModel ?? model(MetaModel::class)
		);
	}
}
