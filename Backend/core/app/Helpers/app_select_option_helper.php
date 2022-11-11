<?php

use App\Models\AppOptionModel;

if (!function_exists('getAppSelectOptions')) {
	function getAppSelectOptions($module, $field = null)
	{
		if (gettype($module) !== 'object') {
			$modules = \Config\Services::modules($module);
			$module = $modules->getModule();
		}
		$name = $module->name;
		$tableName = $module->tableName;
		$key = 'app-select-options-' . $name;
		//Try load data from cache,if not load it from database
		if (!$data = cache($key)) {
			$data = loadDbAppSelectOptions($tableName, $field, $name);
			cache()->save($key, $data, 500);
		}
		if ($field) {
			$data = $data[$tableName][$field];
		}
		return $data;
	}
}

if (!function_exists('loadAppSelectOptions')) {
	function loadDbAppSelectOptions($table, $field = null, $name = ''): array
	{
		$model = new AppOptionModel();
		$data = $model->getMetaFieldOptions($table, $field);
		$selectData = array();
		foreach ($data as $item) {
			$label = ($name) ? 'modules.' . $name . '.app_options.' . $item->field . '.' . $item->value : $item->value;
			$selectData[$item->field][] = [
				'value' => $item->id,
				'label' => $label,
				'icon' => $item->icon,
				'name_option' => $item->value
			];
		}
		return $selectData;
	}
}

if (!function_exists('getOptionValue')) {
	function getOptionValue($module, $field, $nameOption)
	{
		$listOption = getAppSelectOptions($module);
		$value = '';
		if (isset($listOption[$field])) {
			$listOptionByField = $listOption[$field];
			foreach ($listOptionByField as $row) {
				if ($nameOption == $row['name_option']) {
					$value = $row['value'];
					break 1;
				}
			}
		}
		return $value;
	}
}

if (!function_exists('getOptionByValue')) {
	function getOptionByValue($module, $field, $value)
	{
		$listOption = getAppSelectOptions($module);
		$label = '';
		if (isset($listOption[$field])) {
			$listOptionByField = $listOption[$field];
			foreach ($listOptionByField as $row) {
				if ($value == $row['value']) {
					$label = $row;
					break 1;
				}
			}
		}
		return $label;
	}
}

?>
