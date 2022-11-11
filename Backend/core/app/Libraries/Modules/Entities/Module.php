<?php namespace Halo\Modules\Entities;

use CodeIgniter\Entity;
use Halo\Modules\Models\MetaModel;
use Halo\Modules\Models\RouteModel;

class Module extends Entity
{
	/**
	 * Per-user routes cache
	 * @var array
	 */
	protected $routes = [];

	/**
	 * Per-user metas cache
	 * @var array
	 */
	protected $metas = [];

	public function getAttributes()
	{
		return $this->attributes;
	}

	public function getRoutes(): array
	{
		$routeModel = new RouteModel();
		$routes = [];
		if ($this->id) {
			$routes = $routeModel->getModuleRoutes($this->id);
		}
		return $this->routes = $routes;
	}


	public function getMetas(): array
	{
		$metaModel = new MetaModel();
		$metas = [];
		if ($this->id) {
			$metas = $metaModel->getModuleMetas($this->id);
		}
		return $this->metas = $metas;
	}

}