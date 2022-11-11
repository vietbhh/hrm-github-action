<?php namespace Halo\Modules\Models;

use CodeIgniter\Model;

class RouteModel extends Model
{
	protected $table = 'modules_routes';
	protected $primaryKey = 'id';
	protected $returnType = 'object';
	protected $useSoftDeletes = false;
	protected $allowedFields = ['module', 'componentPath', 'routePath', 'redirectPath', 'permitAction', 'permitResource', 'isPublic', 'enable', 'order', 'default', 'meta'];
	protected $useTimestamps = false;
	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;
	protected $selectFields = [];

	public function isRoutePathExists($moduleId, $routePath)
	{
		$routes = false;
		if ($moduleId) {
			$routes = $this->where(['module' => $moduleId, 'routePath' => $routePath])->first();
		}
		return $routes;
	}

	public function getModuleRoutes($moduleId): array
	{
		$routes = array();
		if ($moduleId) {
			$routes = $this->where('module', $moduleId)->orderBy('order', 'ASC')->findAll();
		}
		return $routes;
	}
}

?>
