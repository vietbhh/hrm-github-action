<?php

use App\Models\AppModel;
use App\Models\UserModel;
use CodeIgniter\Files\File;
use CodeIgniter\Model;

if (!function_exists('getDb')) {
	function getDb(): \CodeIgniter\Database\BaseConnection
	{
		return \Config\Database::connect();
	}
}

if (!function_exists('getLastQuery')) {
	function getLastQuery()
	{
		$db = \Config\Database::connect();
		return $db->getLastQuery();
	}
}

if (!function_exists('handleJsonQuery')) {
	function handleJsonQueryString($key, $value, $compare = '=', $parseInt = true): string
	{
		$str = "";
		$compareStr = ($compare == '=') ? ' NOT ' : ' ';
		if (is_array($value)) {
			foreach ($value as $keyIndex => $item) {
				$compareValue = $parseInt ? (int)$item : '"' . $item . '"';
				$str .= "JSON_SEARCH(" . $key . ",'one'," . $compareValue . ") IS" . $compareStr . "NULL";
				if ($keyIndex < count($value) - 1) $str .= ' OR ';
			}
		} else {
			$compareValue = $parseInt ? (int)$value : '"' . $value . '"';
			$str .= "JSON_SEARCH(" . $key . ",'one'," . $compareValue . ") IS" . $compareStr . "NULL";
		}
		return $str;
	}
}


if (!function_exists('handleModuleTableFilters')) {
	function handleModuleTableFilters(Model $model, $filters = array()): Model
	{

		if (!empty($filters)) {
			$modules = \Config\Services::modules();
			$fieldTypeDef = $modules->getFieldTypeDef();
			foreach ($filters as $filter) {
				$whereKey = $filter['field'];
				if ($filter['field_type'] == 'switch') {
					$filter['value'] = (filter_var($filter['value'], FILTER_VALIDATE_BOOLEAN)) ? 1 : 0;
				}
				$isJson = $fieldTypeDef[$filter['field_type']]['type'] == 'json';
				//handle filter between
				switch ($filter['operator']) {
					case '=':
						if ($isJson) {
							if (is_array($filter['value'])) $model->where(handleJsonQueryString($whereKey, $filter['value']));
							else $model->where($whereKey, handleJsonQueryString($whereKey, $filter['value']));
						} else {
							if (is_array($filter['value'])) $model->whereIn($whereKey, $filter['value']);
							else $model->where($whereKey, $filter['value']);
						}
						break;
					case '!=':
						if ($isJson) {
							if (is_array($filter['value'])) $model->where(handleJsonQueryString($whereKey, $filter['value'], '!='));
							else $model->where($whereKey, handleJsonQueryString($whereKey, $filter['value'], '!='));
						} else {
							if (is_array($filter['value'])) $model->whereNotIn($whereKey, $filter['value'], '!=');
							else $model->where($whereKey . ' ' . $filter['operator'], $filter['value']);
						}

						break;
					case '>':
					case '<':
					case '>=':
					case '<=':
						$model->where($whereKey . ' ' . $filter['operator'], $filter['value']);
						break;
					case 'between':
						$model->where($whereKey . ' >=', $filter['value']['from']);
						$model->where($whereKey . ' <=', $filter['value']['to']);
						break;
					case 'contains':
						$model->like($whereKey, $filter['value']);
						break;
					case '!contains':
						$model->notLike($whereKey, $filter['value']);
						break;
					case 'startswith':
						$model->like($whereKey, $filter['value'], 'after');
						break;
					case '!startswith':
						$model->notLike($whereKey, $filter['value'], 'after');
						break;
					case 'endswith':
						$model->like($whereKey, $filter['value'], 'before');
						break;
					case '!endswith':
						$model->notLike($whereKey, $filter['value'], 'before');
						break;
					default:
						break;
				}
				//handle filter small
			}
		}
		return $model;
	}
}

if (!function_exists('loadDataWrapper')) {
	function loadDataWrapper($modules, $model, $data, $handleDataBeforeReturn = true, $metas = null, $textSearchField = []): array
	{
		$time_start = microtime(true);
		$module = $modules->getModule();
		if (empty($metas)) {
			$metas = $modules->getMetas();
		}
		$allowSearchText = ['text', 'textarea'];
		foreach ($metas as $field) {
			if (!$module->system && $field->field_enable && $field->field_table_show && in_array($field->field_type, $allowSearchText)) $textSearchField[] = $field->field;
			else  $textSearchField[] = $field->field;
		}
		$result = loadData($model, $data, $textSearchField);

		if ($handleDataBeforeReturn) $result['results'] = handleDataBeforeReturn($modules, $result['results'], true);
		$result['executeTime'] = (microtime(true) - $time_start);
		return $result;
	}
}

if (!function_exists('loadData')) {
	function loadData(Model $model, $data, $textFieldFilter = []): array
	{
		$data['length'] = $data['perPage'] ?? preference('perPage');
		$isLoadOptions = (isset($data['isLoadOptions']) && !empty($data['isLoadOptions'])) ? $data['isLoadOptions'] : false;
		$defaultOptions = (isset($data['defaultOptions']) && !empty($data['defaultOptions'])) ? $data['defaultOptions'] : [];
		$optionImgKey = (isset($data['optionImgKey']) && !empty($data['optionImgKey'])) ? $data['optionImgKey'] : false;
		$orderType = $data['orderType'] ?? 'DESC';
		$orderCol = $data['orderCol'] ?? 'id';
		$search = $data['search'] ?? '';
		$isPaginate = !((isset($data['isPaginate']) && !(filter_var($data['isPaginate'], FILTER_VALIDATE_BOOLEAN))));
		if (!empty($data['tableFilters'])) $model = handleModuleTableFilters($model, $data['tableFilters']);
		$query = $model->orderBy($orderCol, $orderType);
		$builder = $query->builder();

		if ($isLoadOptions) {
			if (!in_array($isLoadOptions, $textFieldFilter)) $textFieldFilter[] = $isLoadOptions;
			if (!empty($defaultOptions)) {
				if (!is_array($defaultOptions)) $defaultOptions = explode(',', $defaultOptions);
				$builder = $builder->orWhereIn('id', $defaultOptions);
			}
		}

		if ($search && $textFieldFilter) {
			$builder = $builder->groupStart();
			foreach ($textFieldFilter as $item) {
				$builder = $builder->orLike('LOWER(' . $item . ')', strtolower($search));
			}
			$builder = $builder->groupEnd();
		}

		if (!empty($data['filters'])) $data['filters'] = array_filter($data['filters']);

		if (isset($data['filters']) && !empty($data['filters'])) {
			$query = $builder->where($data['filters']);
		}
		$result['recordsTotal'] = $query->countAllResults(false);

		$page = (isset($data['page'])) ? $data['page'] : 1;
		$length = (isset($data['length'])) ? $data['length'] : 0;
		if (isset($data['page'])) {
			$start = ($page - 1) * $length;
		} else {
			$start = (isset($data['start'])) ? $data['start'] : 0;
		}
		if (!$isPaginate) {
			$start = $length = 0;
		}

		if ($isLoadOptions) {
			$selectFields = ['id as value', $isLoadOptions . ' as label'];
			if ($optionImgKey) $selectFields[] = $optionImgKey . ' as icon';
			$query = $query->select($selectFields);
		}
		$result['results'] = $query->asArray()->findAll($length, $start);
		//$db = \Config\Database::connect();
		//$result['commands'] = (string)$db->getLastQuery();
		$result['recordsFiltered'] = count($result['results']);
		$result['hasMore'] = !(($start + $length) >= $result['recordsTotal'] || !$isPaginate);
		$result['page'] = ($length > 0) ? round($start / $length) + 1 : 1;
		$result['start'] = $start;
		return $result;
	}
}
if (!function_exists('getTableFields')) {
	function getTableFields($model, $all = false, $fieldData = false, $needField = false)
	{
		$db = \Config\Database::connect();
		if (gettype($model) == 'string') {
			$fields = ($fieldData) ? $db->getFieldData($model) : $db->getFieldNames($model);
		} else {
			$fields = ($fieldData) ? $db->getFieldData($model->table) : $db->getFieldNames($model->table);
		}
		$results = $fields;
		if (!$all) {
			$results = [];
			foreach ($fields as $item) {
				if (in_array(($fieldData) ? $item->name : $item, ['id', 'created_by', 'updated_by', 'created_at', 'updated_at', 'deleted_at'])) continue;
				if (!$needField || in_array($item->name, $needField)) {
					$results[] = $item;
				}

			}
		}
		return $results;
	}
}

if (!function_exists('isFieldExist')) {
	function isFieldExist($model, $field): bool
	{
		$db = \Config\Database::connect();
		if (gettype($model) == 'string') {
			$fields = $db->fieldExists($model, $field);
		} else {
			$fields = $db->fieldExists($model->table, $field);
		}
		return $fields;
	}
}

if (!function_exists('fillInsertData')) {
	function fillInsertData($fields, $data): array
	{
		$insertData = [];
		foreach ($data as $key => $val) {
			if (!in_array($key, $fields)) continue;
			$insertData[$key] = $val;
		}
		return $insertData;
	}
}

if (!function_exists('getEnumValues')) {
	function getEnumValues($table, $field, $returnSelect = false): array
	{
		$db = \Config\Database::connect();
		preg_match_all("/'(.*?)'/", $db->query("SHOW COLUMNS FROM {$table} LIKE '{$field}'")->getRow()->Type, $matches);
		$data = $matches[1];
		if ($returnSelect) {
			$data = [];
			foreach ($matches[1] as $item) {
				$data[] = [
					'value' => $item,
					'label' => $item
				];
			}
		}
		return $data;
	}
}

if (!function_exists('boolFieldInsert')) {
	function boolFieldInsert($model, $data): array
	{
		$table = (gettype($model) == 'string') ? $model : $model->table;
		helper('common');
		$fields = getTableFields($table, true, true);
		$fields = arrayKey($fields, 'name', '', true);

		foreach ($data as $key => $item) {

			if (isset($fields[$key]) && $fields[$key]['type'] === 'tinyint' && $fields[$key]['max_length'] === 1) {
				if (is_array($data)) $data[$key] = (filter_var($item, FILTER_VALIDATE_BOOLEAN)) ? 1 : 0;
				else $data->$key = ($item === true) ? 1 : 0;
			}
		}

		return $data;
	}
}


function validator($modules, $data, $multiple = false, $fieldValidate = []): array
{
	if (gettype($modules) !== 'object') {
		$modules = \Config\Services::modules($modules);
	}
	$validation = \Config\Services::validation();
	$arrayData = $multiple ? $data : [$data];
	$validateErrors = [];
	foreach ($arrayData as $rowNumber => $item) {
		$formatInsertData = handleDataBeforeSave($modules, $item, null, $fieldValidate);
		if (!$validation->reset()->setRules($formatInsertData['validate'])->run($formatInsertData['data'])) {
			if ($multiple) $validateErrors[$rowNumber] = $validation->getErrors();
			else $validateErrors = $validation->getErrors();
		}
	}
	return $validateErrors;
}


if (!function_exists('handleDefaultValueBeforeSave')) {
	function handleDefaultValueBeforeSave($fieldData, $fieldDef)
	{
		$defaultValue = $fieldData->field_default_value;
		$data = (isset($defaultValue) && !empty($defaultValue)) ? $defaultValue : '';
		if ($fieldDef['type'] == 'tinyint' && isset($defaultValue) && !empty($defaultValue)) {
			$data = (filter_var($defaultValue, FILTER_VALIDATE_BOOLEAN)) ? 1 : 0;
		}
		return $data;
	}
}
if (!function_exists('handleDataBeforeSave')) {
	function handleDataBeforeSave($modules, $dataHandle, $filesRequest = [], $fieldValidate = [], $triggerAfterHandle = false): array
	{
		if (gettype($modules) !== 'object') {
			$modules = \Config\Services::modules($modules);
		}
		$data = $dataHandle;
		$module = $modules->moduleData;
		$fieldTypeDef = $modules->getFieldTypeDef();
		$defaultFields = $modules->getDefaultFields();
		$result = [
			'fieldsArray' => [],
			'uploadFieldsArray' => [],
			'data' => $data,
			'validate' => []
		];
		//Fields
		$fields = $modules->getMetas();
		$fieldsArray = $uploadFieldsArray = $validate = [];
		///If update,get old data - using to load current data of file upload
		if (!empty($data['id'])) {
			$currentData = $modules->model->asArray()->find($data['id']);
		}

		foreach ($fields as $item) {
			if (!empty($fieldValidate) && !in_array($item->field, $fieldValidate)) {
				continue;
			}
			$rawDataItem = $data[$item->field] ?? '';
			$fieldsArray[] = $item->field;
			$validateString = '';

			if (in_array($item->field_type, $modules->getUploadField())) {
				$uploadFieldsArray[$item->field] = $item;
				if (empty($data['id'])) {
					if ($item->field_form_require && (empty($filesRequest[$item->field]))) $validateString .= 'required|';
				} else {
					if (empty($currentData[$item->field])) {
						if ($item->field_form_require && empty($filesRequest[$item->field])) $validateString .= 'required|';
					} else {
						$data[$item->field] = $currentData[$item->field];
					}
				}
			} else {
				if ($item->field_form_require) $validateString .= 'required|';
				if ($item->field_form_unique) {
					$validateString .= 'is_unique[' . $module->tableName . '.' . $item->field;
					if (!empty($data['id'])) {
						$validateString .= ',id,' . $data['id'];
					}
					$validateString .= ']|';
				}
			}

			if (!empty($item->field_validate_rules)) $validateString .= $item->field_validate_rules;
			if (!empty($validateString)) $validate[$item->field] = rtrim($validateString, '|');
			//Handle data
			if ($fieldTypeDef[$item->field_type]['type'] == 'json') {
				if (!isset($data[$item->field])) $data[$item->field] = [];
				if (is_array($data[$item->field])) $data[$item->field] = json_encode(array_filter($data[$item->field]), JSON_NUMERIC_CHECK);
			}
			if ($fieldTypeDef[$item->field_type]['type'] == 'tinyint' && isset($data[$item->field]) && !empty($data[$item->field])) {
				$data[$item->field] = (filter_var($data[$item->field], FILTER_VALIDATE_BOOLEAN)) ? "1" : "0";
			}
			if ($fieldTypeDef[$item->field_type]['type'] == 'int' && isset($data[$item->field]) && !empty($data[$item->field])) $data[$item->field] = removeComma($data[$item->field]);
			if ($fieldTypeDef[$item->field_type]['type'] == 'decimal' && isset($data[$item->field]) && !empty($data[$item->field])) $data[$item->field] = removeComma($data[$item->field]);
			if ($fieldTypeDef[$item->field_type]['type'] == 'date' && isset($data[$item->field]) && !empty($data[$item->field])) $data[$item->field] = date('Y-m-d', strtotime($data[$item->field]));
			if ($fieldTypeDef[$item->field_type]['type'] == 'datetime' && isset($data[$item->field]) && !empty($data[$item->field])) $data[$item->field] = date('Y-m-d H:i:s', strtotime($data[$item->field]));
			if ($fieldTypeDef[$item->field_type]['type'] == 'time' && isset($data[$item->field]) && !empty($data[$item->field])) $data[$item->field] = date('H:i:s', strtotime($data[$item->field]));

			//Handle default value
			if (isset($data[$item->field]) && ($data[$item->field] === "" || $data[$item->field] === null || $data[$item->field] == '[]') && !empty($item->field_default_value)) {
				$data[$item->field] = handleDefaultValueBeforeSave($item, $fieldTypeDef[$item->field_type]);
			}

			if (isset($data[$item->field]) && $triggerAfterHandle && is_callable($triggerAfterHandle)) {
				$data[$item->field] = $triggerAfterHandle($item->field, $rawDataItem, $data[$item->field], $item, $data);
			}
		}
		$removeFields = ['id', 'created_by', 'created_at'];
		foreach ($defaultFields['fields'] as $fieldName => $fieldData) {
			if (!in_array($fieldName, $removeFields)) $fieldsArray[] = $fieldName;
			if (isset($data[$fieldName]) && $fieldData['type'] == 'json') {
				if (!isset($data[$fieldName])) $data[$fieldName] = [];
				if (is_array($data[$fieldName])) $data[$fieldName] = json_encode(array_filter($data[$fieldName]), JSON_NUMERIC_CHECK);
			}
		}

		$result['fieldsArray'] = $fieldsArray;
		$result['uploadFieldsArray'] = $uploadFieldsArray;
		$result['data'] = $data;
		$result['validate'] = $validate;

		return $result;
	}
}
if (!function_exists('getFileProps')) {
	function getFilesProps($filePath, $storePath = ''): array
	{
		$storeFilePath = WRITEPATH . $_ENV['data_folder'] . $storePath;


		$result = [];
		if (is_array($filePath)) {
			foreach ($filePath as $item) {
				try {
					$file = new File($storeFilePath . $item);
					$result[] = [
						'fileName' => $file->getBasename(),
						'fileMT' => $file->getMTime(),
						'size' => $file->getSize(),
						'type' => $file->getMimeType(),
						'ext' => $file->guessExtension(),
						'url' => $storePath . $item
					];

				} catch (\Exception $e) {
				}
			}
		} else {
			try {
				$file = new File($storeFilePath . $filePath, true);
				$result = [
					'fileName' => $file->getBasename(),
					'fileMT' => $file->getMTime(),
					'size' => $file->getSize(),
					'type' => $file->getMimeType(),
					'ext' => $file->guessExtension(),
					'url' => $storePath . $filePath
				];
			} catch (\Exception $e) {

			}
		}
		return $result;
	}
}
if (!function_exists('getModuleFieldFiles')) {
	function getModuleFieldFiles($module, $id, $fileNames): array
	{
		$storePath = '/' . $_ENV['data_folder_module'] . '/' . $module . '/' . $id . '/other/';
		return getFilesProps($fileNames, $storePath);
	}
}


function handleReturnMetasField($type, $data)
{
	switch ($type) {
		case 'tinyint' :
			return filter_var($data, FILTER_VALIDATE_BOOLEAN);
			break;
		case 'date' :
			return (empty($data) || empty((int)$data) || $data == '0000-00-00') ? '' : date('Y-m-d', strtotime($data));
			break;
		case 'datetime':
			return (empty($data) || empty((int)$data)) ? '' : date('Y-m-d H:i:s', strtotime($data));
			break;
		case 'time':
			return (empty($data) || empty((int)$data)) ? '' : date('H:i:s', strtotime($data));
			break;
		case 'json' :
			return empty($data) ? [] : json_decode($data, true);
			break;
		default :
			return $data;
	}
}

function handleSelectOptionField($data, $options)
{
	if (is_array($data)) {
		$newArray = [];
		foreach ($data as $optItem) {
			if (!is_numeric(array_search($optItem, array_column($options, 'value')))) continue;
			$val = $options[array_search($optItem, array_column($options, 'value'))];
			$newArray[] = $val;
		}
		return $newArray;
	} else {
		if (!is_numeric(array_search($data, array_column($options, 'value')))) return null;
		return $options[array_search($data, array_column($options, 'value'))];
	}
}

function handleModuleOptionField($data, $moduleModel)
{
	if (!empty($data)) {
		if (is_array($data)) {
			$moduleSelectData = $moduleModel->find($data);
			$moduleSelectData = arrayKey($moduleSelectData, 'value');
			$newArray = [];
			foreach ($data as $optItem) {
				if (empty($moduleSelectData[$optItem])) continue;
				$newArray[] = $moduleSelectData[$optItem];
			}
			return $newArray;
		} else {
			return $moduleModel->find($data);
		}
	}
	return null;
}

function handleDefaultUserField($data, $userList)
{
	if (is_array($data)) {
		$newArray = [];
		foreach ($data as $optItem) {
			if (empty($userList[$optItem])) continue;
			$newArray[] = $userList[$optItem];
		}
		return $newArray;
	} else {
		if (empty($userList[$data])) return null;
		return $userList[$data];
	}
}

if (!function_exists('handleDataBeforeReturn')) {
	function handleDataBeforeReturn($modules, $data, $multiData = false, $triggerAfterHandle = false)
	{
		if (gettype($modules) !== 'object') {
			$moduleName = $modules;
			$modules = \Config\Services::modules($moduleName);
			$modules->setModule($moduleName);
		}
		$userModules = ['users', 'employees'];
		$module = $modules->moduleData;
		$moduleName = $module->name;
		$fieldTypeDef = $modules->getFieldTypeDef();
		$defaultFields = $modules->getDefaultFields();
		$uploadFields = $modules->getUploadField();
		$selectOptionFields = $modules->getMetaFieldsAllowOptionSelection();
		$moduleOptionFields = $modules->getMetaFieldsAllowModuleSelection();
		$fields = $modules->getMetas();
		$arrayData = ($multiData) ? $data : [$data];
		helper('app_select_option');
		$options = getAppSelectOptions($module);
		$defaultUserFields = ['owner', 'created_by', 'updated_by', 'view_permissions', 'update_permissions'];
		$userModel = new UserModel();
		foreach ($arrayData as $key => $dataItem) {
			$userArray = [];
			$rawDataItem = $dataItem;
			foreach ($defaultUserFields as $item) {
				if (is_array($dataItem) && isset($dataItem[$item]) && !empty($dataItem[$item])) {
					$userArray = array_merge($userArray, is_numeric($dataItem[$item]) ? [$dataItem[$item]] : (empty($dataItem[$item]) ? [] : json_decode($dataItem[$item], true)));
				}
				if (is_object($dataItem) && isset($dataItem->$item) && !empty($dataItem->$item)) {
					$userArray = array_merge($userArray, is_numeric($dataItem->$item) ? [$dataItem->$item] : (empty($dataItem->$item) ? [] : json_decode($dataItem->$item, true)));
				}
			}
			$dataUser = [];
			if (!empty($userArray)) {
				$dataUser = $userModel->select(['id as value', 'username as label'])->asArray()->find(array_unique($userArray));
				$dataUser = arrayKey($dataUser, 'value');
			}
			if (is_array($dataItem)) {
				foreach ($fields as $item) {
					if (isset($dataItem[$item->field])) {
						$dataItem[$item->field] = handleReturnMetasField($fieldTypeDef[$item->field_type]['type'], $dataItem[$item->field]);
						if (in_array($item->field_type, $uploadFields) && !empty($dataItem['id'])) {
							$storePath = '/' . $_ENV['data_folder_module'] . '/' . $moduleName . '/' . $dataItem['id'] . '/other/';
							$dataItem[$item->field] = getFilesProps($dataItem[$item->field], $storePath);
						}

						if (in_array($item->field_type, $selectOptionFields)) {
							$dataItem[$item->field] = handleSelectOptionField($dataItem[$item->field], $options[$item->field]);
						}
						if (in_array($item->field_type, $moduleOptionFields) && !empty($item->field_select_module) && !empty($item->field_select_field_show)) {
							$optFields = ['id as value', $item->field_select_field_show . ' as label'];
							if (in_array($item->field_select_module, $userModules)) {
								$optFields = array_merge($optFields, USER_SELECT_FIELDS);
							}
							$selectModule = $modules->getModule($item->field_select_module);
							$moduleSelectModel = new AppModel();
							$moduleSelectModel->setTable($selectModule->tableName)->resetQuery()->select($optFields)->asArray();
							$dataItem[$item->field] = handleModuleOptionField($dataItem[$item->field], $moduleSelectModel);
						}
					}
				}
				foreach ($defaultFields['fields'] as $fieldName => $fieldData) {
					if (isset($dataItem[$fieldName]) && $fieldData['type'] == 'json') {
						$dataItem[$fieldName] = empty($dataItem[$fieldName]) ? [] : json_decode($dataItem[$fieldName], true);
					}
					if (isset($dataItem[$fieldName]) && $fieldData['type'] == 'datetime') {
						$dataItem[$fieldName] = date('Y-m-d H:i:s', strtotime($dataItem[$fieldName]));
					}
					if (isset($dataItem[$fieldName]) && ($fieldData['type'] === 'int' || $fieldData['type'] === 'json') && $fieldName != 'id') {
						$dataItem[$fieldName] = handleDefaultUserField($dataItem[$fieldName], $dataUser);
					}

				}

			} else {
				foreach ($fields as $item) {
					$name = $item->field;
					if (isset($dataItem->$name)) {
						$dataItem->$name = handleReturnMetasField($fieldTypeDef[$item->field_type]['type'], $dataItem->$name);
						if (in_array($item->field_type, $uploadFields) && !empty($dataItem->id)) {
							$dataItem->$name = getModuleFieldFiles($moduleName, $dataItem->id, $dataItem->$name);
						}
						if (in_array($item->field_type, $selectOptionFields)) {
							$dataItem->$name = handleSelectOptionField($dataItem->$name, $options[$item->field]);
						}
						if (in_array($item->field_type, $moduleOptionFields) && !empty($item->field_select_module) && !empty($item->field_select_field_show)) {
							$selectModule = $modules->getModule($item->field_select_module);
							$moduleSelectModel = new AppModel();
							$optFields = ['id as value', $item->field_select_field_show . ' as label'];
							if (in_array($item->field_select_module, $userModules)) {
								$optFields = array_merge($optFields, USER_SELECT_FIELDS);
							}
							$moduleSelectModel->setTable($selectModule->tableName)->resetQuery()->select($optFields)->asArray();
							$dataItem->$name = handleModuleOptionField($dataItem->$name, $moduleSelectModel);
						}
					}
				}

				foreach ($defaultFields['fields'] as $fieldName => $fieldData) {


					if (isset($dataItem->$fieldName) && $fieldData['type'] == 'json') {
						$dataItem->$fieldName = empty($dataItem->$fieldName) ? [] : json_decode($dataItem->$fieldName, true);
					}
					if (isset($dataItem->$fieldName) && $fieldData['type'] == 'datetime') {
						$dataItem->$fieldName = date('Y-m-d H:i:s', strtotime($dataItem->$fieldName));
					}
					if (isset($dataItem->$fieldName) && ($fieldData['type'] === 'int' || $fieldData['type'] === 'json') && $fieldName != 'id') {
						$dataItem->$fieldName = handleDefaultUserField($dataItem->$fieldName, $dataUser);
					}
				}
			}
			if ($triggerAfterHandle && is_callable($triggerAfterHandle)) {
				$dataItem = $triggerAfterHandle($rawDataItem, $dataItem);
			}
			$arrayData[$key] = $dataItem;
		}

		return ($multiData) ? $arrayData : $arrayData[0];
	}
}
