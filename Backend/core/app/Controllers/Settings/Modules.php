<?php

namespace App\Controllers\Settings;

use App\Controllers\ErpController;
use App\Libraries\Dump\Dump;
use Config\Services;

class Modules extends ErpController
{
	public function index_get()
	{
		$result = [];
		$modules = \Config\Services::modules();
		helper('db');
		$data = $modules->listModules();
		foreach ($data as $key => $item) {
			$data[$key]->metasFields = $item->getMetas();
			$data[$key]->sequenceNum = $key + 1;
		}
		$result['modules'] = $data;

		$systemModule = $modules->getSystemModule();

		$systemModuleArray = [];
		foreach ($systemModule as $key => $item) {
			$item['metasFields'] = $item['metas'];
			unset($item['metas']);
			$systemModuleArray[] = (object)$item;
		}
		$result['systemModules'] = $systemModuleArray;

		$result['config']['moduleTablePrefix'] = $modules->getModuleTablePrefix();
		$result['config']['routeModuleNameVar'] = $modules->getRouteModuleNameVar();
		$result['config']['metaFieldsAllowOptionSelection'] = $modules->getMetaFieldsAllowOptionSelection();
		$result['config']['metaFieldsAllowModuleSelection'] = $modules->getMetaFieldsAllowModuleSelection();
		$result['config']['fields']['modules']['type'] = getEnumValues('modules', 'type', true);
		$result['config']['fields']['modules']['layout'] = getEnumValues('modules', 'layout', true);
		$result['config']['fields']['modules']['fullWidth'] = getEnumValues('modules', 'fullWidth', true);
		$result['config']['fields']['modules_metas']['field_type'] = getEnumValues('modules_metas', 'field_type', true);
		$result['config']['fields']['modules_metas']['field_icon_type'] = getEnumValues('modules_metas', 'field_icon_type', true);
		$defaultRoutes = $modules->getDefaultRoutes();
		$result['config']['routes'] = [];
		foreach ($defaultRoutes as $moduleType => $routes) {
			$result['config']['routes'][$moduleType] = [];
			foreach ($routes as $routePath => $routeDescription) {
				$result['config']['routes'][$moduleType][] = [
					'routePath' => $routePath,
					'componentPath' => $routeDescription,
					'redirectPath' => '',
					'isPublic' => false,
					'default' => true,
				];
			}
		}

		$defaultPermits = $modules->getDefaultPermits();
		$result['permits'] = [];
		foreach ($defaultPermits as $permitName => $permitDescription) {
			$result['permits'][] = [
				'name' => $permitName,
				'description' => $permitDescription,
				'default' => true
			];
		}
		$authorize = \Config\Services::authorization();
		$result['groups'] = $authorize->groups();
		return $this->respond($result);
	}

	public function detail_get($module = null)
	{
		if (empty($module)) {
			return $this->failValidationErrors('missing_field_required');
		}
		$response = array();
		$modules = Services::modules($module);
		$response['module'] = $modules->getModule();
		$data = $modules->getDetailModule($response['module']->name);
		$response = array_merge($response, $data);
		return $this->respond($response);
	}

	public function checkExists_post()
	{
		$type = $this->request->getPost('type');
		$value = $this->request->getPost('value');
		if (empty($type) or empty($value)) {
			return $this->failValidationErrors('missing_field_required');
		}

		$modules = service('modules');
		if ($modules->moduleExists($type, $value)) {
			return $this->failResourceExists('exits');
		} else {
			return $this->respond(true);
		}
	}

	public function add_post()
	{
		$data = $this->request->getPost();
		$modules = service('modules');
		if ($modules->createModule($data)) {
			return $this->respondCreated(true);
		} else {
			return $this->fail('can_not_create_module');
		}
	}

	public function update_put($id = null)
	{
		$data = $this->request->getJSON(true);
		$modules = Services::modules();
		if ($modules->updateModule($data, $id)) {
			return $this->respondUpdated(true);
		} else {
			return $this->fail('can_not_update_module');
		}

	}

	public function delete_delete($permanent = null)
	{
		$data = $this->request->getJSON();
		if (empty($data)) {
			return $this->failValidationErrors('missing_field_required');
		}
		$modules = service('modules');
		return $modules->deleteModule($data, $permanent === 'true');
	}


	//--------------------------------------------------------------------

}