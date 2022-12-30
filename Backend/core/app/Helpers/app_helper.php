<?php

use App\Models\AppModel;
use App\Models\SettingModel;

if (!function_exists('cache_clear_regex')) {
	function cache_clear_regex($regex): bool
	{
		$listCache = cache()->getCacheInfo();
		foreach ($listCache as $cacheId => $cacheItem) {
			if (preg_match($regex, $cacheId)) {
				cache()->delete($cacheId);
			}
		}
		return true;
	}
}


if (!function_exists('dataInit')) {
	function dataInit(): array
	{
		helper('preferences');
		$data['unit'] = unitInit();
		$settingModel = new SettingModel();
		$listSettings = $settingModel->getDefaultSettings();
		foreach ($listSettings as $item) {
			if ($item->secret == 1) continue;
			$keyName = ($item->class === 'Preferences') ? $item->key : $item->class . '.' . $item->key;
			$value = preference($keyName);

			if (isset($item->config->type) && $item->config->type === 'json' && $item->type === 'string' && is_string($value)) {
				$value = json_decode($value, true);
			}
			$data['settings'][$keyName] = $value;
		}
		return $data;
	}
}


if (!function_exists('modulesList')) {
	function modulesList()
	{
		$moduleManager = service('modules');
		return $moduleManager->listModules();
	}
}

if (!function_exists('unitInit')) {
	function unitInit(): array
	{
		$model = new AppModel();
		if (!$provinces = cache('countries')) {
			$provinces = $model->setTable('countries')->resetQuery()->findAll();
			cache()->save('countries', $provinces, getenv('default_cache_time'));
		}
		$data['countries'] = $provinces;

		$model = new AppModel();
		if (!$provinces = cache('provinces')) {
			$provinces = $model->setTable('provinces')->resetQuery()->findAll();
			cache()->save('provinces', $provinces, getenv('default_cache_time'));
		}
		$data['provinces'] = $provinces;

		$model = new AppModel();
		if (!$districts = cache('districts')) {
			$districts = $model->setTable('districts')->resetQuery()->findAll();
			cache()->save('districts', $districts, getenv('default_cache_time'));
		}
		$data['districts'] = $districts;
		$model = new AppModel();
		if (!$wards = cache('wards')) {
			$wards = $model->setTable('wards')->resetQuery()->findAll();
			cache()->save('wards', $wards, getenv('default_cache_time'));
		}
		$data['wards'] = $wards;
		return $data;
	}
}

if (!function_exists('handleMetasBeforeReturn')) {
	function handleMetasBeforeReturn($modules, $item, $moduleName)
	{
		$dateFields = ['time' => 'H:i', 'date' => 'Y-m-d', 'datetime' => 'Y-m-d H:i:s'];
		$metaFieldsAllowModuleSelectionPaginate = $modules->getMetaFieldsAllowModuleSelectionPaginate();
		$moduleSelectModel = new AppModel();
		if (!empty($item->field_select_field_show) && !empty($item->field_select_module)) {
			if (in_array($item->field_type, $metaFieldsAllowModuleSelectionPaginate) && !empty($item->field_default_value) && !empty($item->field_select_module) && !empty($item->field_select_field_show)) {
				$selectModule = $modules->getModule($item->field_select_module);
				$moduleSelectModel->setTable($selectModule->tableName)->select(['id as value', $item->field_select_field_show . ' as label'])->asArray();
				$defaultOptions = explode(',', $item->field_default_value);
				$item->field_default_value = handleModuleOptionField($defaultOptions, $moduleSelectModel);
			}
		}
		if (isset($dateFields[$item->field_type]) && !empty($item->field_default_value)) {
			$item->field_default_value = date($dateFields[$item->field_type], strtotime($item->field_default_value));
		}
		$item->moduleName = $moduleName;
		$item->module = (int)$item->module;
		$item->id = (int)$item->id;
		return $item;

	}
}


if (!function_exists('modulesConstructs')) {
	function modulesConstructs(): array
	{
		$data = [];
		$moduleManager = \Config\Services::modules();
		$modules = $moduleManager->listModules();
		helper('app_select_option');
		$moduleId = [];
		$moduleOptions = [];

		$metaFieldsModuleSelectionNoPaginate = $moduleManager->getMetaFieldsAllowModuleSelectionNoPaginate();
		//$metaFieldsModuleSelectionPaginate = $moduleManager->getMetaFieldsAllowModuleSelectionPaginate();
		//HANDLE GET SYSTEM MODULES
		$systemModule = $moduleManager->getSystemModule();
		foreach ($systemModule as $moduleName => $item) {
			$data[$moduleName]['config'] = $item;
			$data[$moduleName]['metas'] = $item['metas'];
			$data[$moduleName]['options'] = [];

			if (!empty($item['metas'])) {
				foreach ($item['metas'] as $key => $metaItem) {
					$loadOptionModulePaginate = $metaItem['field_options']['form']['loadPaginate'] ?? true;
					if (!empty($metaItem['field_select_field_show']) && !empty($metaItem['field_select_module']) && (in_array($metaItem['field_type'], $metaFieldsModuleSelectionNoPaginate) || !$loadOptionModulePaginate)) {
						if (!isset($moduleOptions[$metaItem['field_select_module']])) $moduleOptions[$metaItem['field_select_module']] = [];
						if (!in_array($metaItem['field_select_field_show'], $moduleOptions[$metaItem['field_select_module']]))
							$moduleOptions[$metaItem['field_select_module']][] = $metaItem['field_select_field_show'];
					}
				}
			}
		}

		//HANDLE GET CUSTOM MODULES
		foreach ($modules as $item) {
			$item->options = json_decode($item->options, true);
			$data[$item->name]['config'] = $item;
			$moduleId[$item->id] = $item->name;
			$data[$item->name]['options'] = getAppSelectOptions($item);
		}
		$metas = $moduleManager->getAllMetas();


		foreach ($metas as $key => $item) {
			$loadOptionModulePaginate = $item->field_options['form']['loadPaginate'] ?? true;
			if (!empty($item->field_select_field_show) && !empty($item->field_select_module) && (in_array($item->field_type, $metaFieldsModuleSelectionNoPaginate) || !$loadOptionModulePaginate)) {
				if (!isset($moduleOptions[$item->field_select_module])) $moduleOptions[$item->field_select_module] = [];
				if (!in_array($item->field_select_field_show, $moduleOptions[$item->field_select_module]))
					$moduleOptions[$item->field_select_module][] = $item->field_select_field_show;
			}
			$data[$moduleId[$item->module]]['metas'][$item->field] = handleMetasBeforeReturn($moduleManager, $item, $data[$moduleId[$item->module]]['config']->name);
		}

		$optionsArray = [];
		foreach ($moduleOptions as $moduleName => $moduleShowKey) {
			$moduleInfo = $data[$moduleName]['config'];
			$tlbName = is_array($moduleInfo) ? $moduleInfo['tableName'] : $moduleInfo->tableName;
			$moduleModel = new AppModel();
			$keySelect = count($moduleShowKey) > 1 ? array_merge($moduleShowKey, ['id']) : $moduleShowKey[0] . ' as label,id as value';
			$moduleModel->setTable($tlbName)->asArray()->select($keySelect);
			//todo maybe need handle permissions of linked module
			$moduleData = $moduleModel->findAll();
			if (count($moduleShowKey) > 1) {
				foreach ($moduleData as $dataItem) {
					foreach ($moduleShowKey as $key) {
						$optionsArray[$moduleName][$key][] = [
							'value' => $dataItem['id'],
							'label' => $dataItem[$key],
						];
					}
				}
			} else {
				$optionsArray[$moduleName][$moduleShowKey[0]] = $moduleData;
			}
		}

		$userModule = $moduleManager->getModule('users');
		$userMetas = $userModule->metas;
		unset($userModule->metas);
		$data['users']['config'] = $userModule;
		$data['users']['metas'] = $userMetas;
		$response['optionsModules'] = $optionsArray;
		$response['modules'] = $data;
		$response['filters'] = [
			'defaultFields' => $moduleManager->getDefaultMetasFields(),
			'type' => $moduleManager->getFieldTypeFilterDef()
		];
		return $response;
	}
}

if (!function_exists('_uploadSettingFile')) {
	/**
	 * @throws Exception
	 */
	function _uploadSettingFile($file): ?string
	{
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		if (!$file->isValid()) {
			throw new Exception($file->getErrorString() . '(' . $file->getError() . ')');
		}
		if ($file->isValid() && !$file->hasMoved()) {
			$path = '/setting/' . date('Y') . '/' . date('m') . '/';
			$filesUpload = [$file];
			$uploadService->uploadFile($path, $filesUpload);
			$filePath = '/setting/' . date('Y') . '/' . date('m') . '/' . safeFileName($file->getName());
			return $filePath;
		}
		return null;
	}
}

if (!function_exists('decamelize')) {
	function decamelize($string): string
	{
		return strtolower(preg_replace(['/([a-z\d])([A-Z])/', '/([^_])([A-Z][a-z])/'], '$1_$2', $string));
	}
}

if (!function_exists('getDefaultFridayLogo')) {
	function getDefaultFridayLogo($type = 'icon'): string
	{
		$logoName = 'friday.png';
		if ($type === 'text') $logoName = 'friday_text.png';
		return $_ENV['app.siteURL'] . '/assets/images/' . $logoName;
	}
}

?>