<?php

namespace App\Controllers;

use App\Models\AppModel;

class App extends ErpController
{
	/*
	 * Get information of module
	 * */
	public function module_get($name)
	{
		if (empty($name)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		if (!mayAccess($name)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$module = array(
			'module' => [],
			'metas' => [],
			'optionsModules' => [],
			'filters' => [],
			'options' => []
		);
		$modules = \Config\Services::modules($name);
		$module = $modules->getModuleConfig($name);
		return $this->respond($module);
	}

	/*
	 * Handle permission before call model
	 * */
	protected function handleModelPermission($model)
	{
		//Todo handle view permission here
		return $model;
	}

	/*
	 * Handle export data api
	 * */
	protected function handleExportData($data)
	{
		return $data;
	}

	/*
	 * $name : module name
	 * $type : all - return a list include paginate data |
	 *         last - return only detail of last record without paginate data |
	 *         first - return only detail of first record without paginate data
	 * */
	public function load_get($name, $type = 'all')
	{
		$time_start = microtime(true);
		if (empty($name)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		$module = \Config\Services::modules($name);
		$moduleOpt = $module->moduleData->options['default']['fn'] ?? [];
		$fn = 'load';
		$fnStt = !isset($moduleOpt[$fn]['stt']) ? true : $moduleOpt[$fn]['stt'];
		$fnCustomPermits = empty($moduleOpt[$fn]['custom_permits']) ? false : $moduleOpt[$fn]['custom_permits'];
		if (!$fnStt) return $this->failForbidden(DEFAULT_SAVE_API_DISABLE);

		$customPer = true;
		if ($fnCustomPermits) {
			foreach ($fnCustomPermits as $item) {
				if (!hasPermission($item)) {
					$customPer = false;
				}
			}
		}

		if (!mayList($name) && !$module->moduleData->system && ($fnCustomPermits && !$customPer)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		$model = $module->model;
		$model = $this->handleModelPermission($model);
		$data = $this->request->getGet();

		if ($type === 'first') {
			$list = loadData($model, $data);
			$result = array_shift($list['result']);
		} elseif ($type === 'last') $result = end($result['result']);
		else $result = loadDataWrapper($module, $model, $data);
		return $this->respond($result);
	}

	/*
	 * Get detail of a record id from specific module
	 * */
	public function detail_get($name, $id)
	{
		if (empty($name)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		$module = \Config\Services::modules($name);
		$moduleOpt = $module->moduleData->options['default']['fn'] ?? [];
		$fn = 'detail';
		$fnStt = !isset($moduleOpt[$fn]['stt']) ? true : $moduleOpt[$fn]['stt'];
		$fnCustomPermits = empty($moduleOpt[$fn]['custom_permits']) ? false : $moduleOpt[$fn]['custom_permits'];
		if (!$fnStt) return $this->failForbidden(DEFAULT_DETAIL_API_DISABLE);
		if ($module->moduleData->system) {
			if (!hasPermission($name . '.manage')) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		} else {
			$customPer = true;
			if ($fnCustomPermits) {
				foreach ($fnCustomPermits as $item) {
					if (!hasPermission($item)) {
						$customPer = false;
					}
				}
			}
			if (!mayAccessResource($name, $id) && ($fnCustomPermits && !$customPer)) return $this->failForbidden(MISSING_ACCESS_PERMISSION);
		}

		$model = $module->model;
		$data = $model->find($id);
		$data = handleDataBeforeReturn($module, $data);
		helper('filesystem');
		$uploadFolderPath = WRITEPATH . $_ENV['data_folder'];
		$storePath = '/' . $_ENV['data_folder_module'] . '/' . $name . '/' . $id . '/data/';
		$fileList = directory_map($uploadFolderPath . $storePath);
		$files = [];
		foreach ($fileList as $item) {
			$files[] = getFilesProps($item, $storePath);
		}
		usort($files, function ($a, $b) {
			return $a['fileMT'] <=> $b['fileMT'];
		});
		return $this->respond([
			'data' => $data,
			'files_upload_module' => $files
		]);
	}

	/*
	 * Handle save data
	 * */
	public function save_post($name)
	{
		$module = \Config\Services::modules($name);
		$filesData = $this->request->getFiles();
		$data = $this->request->getPost();
		$fastUpdate = $this->request->getGet('fastUpdate');
		try {
			$id = $module->saveRecord($data, $filesData, false, ['fastUpdate' => $fastUpdate]);
		} catch (\Exception $e) {
			return $this->fail($e->getMessage(), $e->getCode(), $e->getCode());
		}
		return $this->respondCreated($id);
	}

	public function validate_post($name)
	{
		$module = \Config\Services::modules($name);
		if (!mayAdd($name) && !$module->moduleData->system) return $this->failForbidden(MISSING_ADD_PERMISSION);
		$data = $this->request->getPost();
		if (empty($data['data'])) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		$model = $module->model;
		$multiple = empty($data['multiple']) ? false : $data['multiple'];
		if (empty($data['fields'])) {
			if ($multiple) {
				$fieldValidate = empty($data['data']) ? [] : array_keys($data['data'][0]);
			} else {
				$fieldValidate = array_keys($data['data']);
			}
		} else {
			$fieldValidate = $data['fields'];
		}
		$result = validator($module, $data['data'], $multiple, array_unique($fieldValidate));
		return $this->respond($result ?: true);
	}

	public function linked_get($name)
	{
		$module = \Config\Services::modules($name);
		$linked = $module->getLinkedModule();
		return $this->respond($linked);
	}

	/*
	 * Api for handle new option create
	 */
	public function create_option($module)
	{
		$module = \Config\Services::modules($module);
		$model = $module->model;
		$validation = \Config\Services::validation();
		$data = $this->request->getPost();

		$dataHandle = handleDataBeforeSave($module, $data);
		$saveData = $dataHandle['data'];
		if (!empty($dataHandle['validate'])) {
			if (!$validation->reset()->setRules($dataHandle['validate'])->withRequest($this->request)->run()) {
				return $this->failValidationErrors($validation->getErrors());
			}
		}
		$model->setAllowedFields($dataHandle['fieldsArray']);
		try {
			$model->save($saveData);
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE . '_' . $e->getMessage());
		}
		return $this->respond($model->getInsertID());
	}

	public function import_post($name)
	{
		$module = \Config\Services::modules($name);
		$moduleOpt = $module->moduleData->options['default']['fn'] ?? [];
		$fn = 'import';
		$fnStt = !isset($moduleOpt[$fn]['stt']) ? true : $moduleOpt[$fn]['stt'];
		$fnCustomPermits = empty($moduleOpt[$fn]['custom_permits']) ? false : $moduleOpt[$fn]['custom_permits'];
		if (!$fnStt) return $this->failForbidden(DEFAULT_IMPORT_API_DISABLE);

		if ($module->moduleData->system) {
			if (!hasPermission($name . '.manage')) return $this->failForbidden(MISSING_IMPORT_PERMISSION);
		} else {
			$customPer = true;
			if ($fnCustomPermits) {
				foreach ($fnCustomPermits as $item) {
					if (!hasPermission($item)) {
						$customPer = false;
					}
				}
			}
			if (!mayAdd($name) && ($fnCustomPermits && !$customPer)) return $this->failForbidden(MISSING_IMPORT_PERMISSION);
		}

		$data = $this->request->getPost();
		if (empty($data['data'])) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		$model = new AppModel();
		if (isset($data['format']) && $data['format'] == true) {
			if (!empty($data['formatModule'])) {
				foreach ($data['formatModule'] as $item) {
					$formatModule = $module->getModule($item);
					if (!empty($formatModule->tableName)) {
						$model->setTable($formatModule->tableName)->emptyTable();
					}
				}
			}
			$module->model->emptyTable();
		}
		$validation = \Config\Services::validation();
		$batchData = $validateErrors = $fieldInsert = [];
		foreach ($data['data'] as $rowNumber => $item) {
			$item = array_merge($item, $data['permissions']);
			$formatInsertData = handleDataBeforeSave($module, $item, null);
			$fieldInsert = $formatInsertData['fieldsArray'];
			if ($validation->reset()->setRules($formatInsertData['validate'])->run($formatInsertData['data'])) {
				$batchData[] = array_merge($formatInsertData['data'], ['created_by' => user_id()]);
			} else {
				$validateErrors[$rowNumber] = $validation->getErrors();
			}
		}
		if (!empty($validateErrors)) {
			return $this->fail($validateErrors);
		}
		try {
			$result = 0;
			if (!empty($batchData)) {
				$result = $module->model->setAllowedFields(array_merge($fieldInsert, ['created_by']))->insertBatch($batchData);
			}
			return $this->respondCreated($result);
		} catch (\Exception $e) {
			return $this->failValidationErrors($e->getMessage());
		}
	}

	public function delete_delete($name, $ids)
	{
		$module = \Config\Services::modules($name);
		$moduleOpt = $module->moduleData->options['default']['fn'] ?? [];
		$fn = 'delete';
		$fnStt = !isset($moduleOpt[$fn]['stt']) ? true : $moduleOpt[$fn]['stt'];
		$fnCustomPermits = empty($moduleOpt[$fn]['custom_permits']) ? false : $moduleOpt[$fn]['custom_permits'];
		if (!$fnStt) return $this->failForbidden(DEFAULT_DELETE_API_DISABLE);
		$ids = explode(',', $ids);
		if ($module->moduleData->system) {
			if (!hasPermission($name . '.manage')) return $this->failForbidden(MISSING_DELETE_PERMISSION);
		} else {
			$customPer = true;
			if ($fnCustomPermits) {
				foreach ($fnCustomPermits as $item) {
					if (!hasPermission($item)) {
						$customPer = false;
					}
				}
			}
			foreach ($ids as $id) {
				if (!mayDeleteResource($name, $id) && ($fnCustomPermits && !$customPer)) return $this->failForbidden(MISSING_DELETE_PERMISSION . '_' . $id);
			}
		}
		$module->model->delete($ids);
		return $this->respondDeleted($ids);
	}

	public function update_user_metas($name)
	{
		$module = \Config\Services::modules($name);
		$data = $this->request->getPost('data');
		if (empty($data)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}
		$module->updateMetasUser($data);
		return $this->respond(true);
	}

	public function setting($name)
	{
		$module = \Config\Services::modules($name);
		$moduleDisplay = $this->request->getPost('modules');
		$defaultFields = $this->request->getPost('default');
		$dragColumn = $this->request->getPost('dragColumn') ?? false;
		$resizeColumnWidth = $this->request->getPost('resizeColumnWidth') ?? false;
		if (empty($moduleDisplay) || empty($defaultFields)) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}

		$array = [];
		foreach ($moduleDisplay as $key => $item) {
			$array[] = [
				'module_id' => $module->moduleData->id,
				'module_meta_id' => $key,
				'field_table_show' => filter_var($item, FILTER_VALIDATE_BOOLEAN),
			];
		}
		if (!empty($array)) {
			$module->updateMetasUser($array);
		}
		$options = [
			'table' => [
				'dragColumn' => filter_var($dragColumn, FILTER_VALIDATE_BOOLEAN),
				'resizeColumnWidth' => filter_var($resizeColumnWidth, FILTER_VALIDATE_BOOLEAN),
			]
		];
		foreach ($defaultFields as $key => $item) {
			$options['table']['metas'][$key]['field_table_show'] = $item;
		}
		if (!empty($options)) {
			$module->updateModuleUserOptions($options);
		}
		helper('app_helper');
		$moduleData = modulesConstructs();
		return $this->respond($moduleData);
	}

	public function users_get()
	{
		$module = \Config\Services::modules('users');
		$genderOptions = getEnumValues('users', 'gender', true);
		foreach ($genderOptions as $key => $item) {
			$genderOptions[$key]['label'] = 'modules.users.app_options.gender.' . $item['label'];
		}
		$userMetas = $module->getMetas();

		$result = [
			'module' => $module,
			'metas' => $userMetas,
			'options' => [
				'gender' => $genderOptions
			]
		];
		return $this->respond($result);
	}
}