<?php namespace Halo\Modules\Config;

use Halo\Modules\Models\MetaModel;
use Halo\Modules\Models\ModuleModel;
use Halo\Modules\Models\RouteModel;
use Halo\Modules\ModulesManager;

require_once APPPATH . 'Config/Services.php';

class Services extends \CodeIgniter\Config\BaseService
{
	/**
	 * @param string|null $module
	 * @param ModuleModel|null $moduleModel
	 * @param RouteModel|null $routeModel
	 * @param MetaModel|null $metaModel
	 * @param bool $getShared
	 * @return ModulesManager
	 */
	public static function modules($module = '', ModuleModel $moduleModel = null, RouteModel $routeModel = null, MetaModel $metaModel = null, bool $getShared = true): ModulesManager
	{
		if ($getShared) {
			return static::getSharedInstance('modules', $module, $moduleModel, $routeModel, $metaModel);
		}
		return new ModulesManager(
			$module,
			$moduleModel ?? model(ModuleModel::class),
			$routeModel ?? model(RouteModel::class),
			$metaModel ?? model(MetaModel::class)
		);
	}
}
