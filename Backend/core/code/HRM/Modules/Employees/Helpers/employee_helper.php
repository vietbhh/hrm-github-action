<?php
if (!function_exists('_getRecursiveRank')) {
	function _getRecursiveRank($data, $parent = 0, $type = 'subordinate', $return = array(), $directOnly = false)
	{
		$compareKey = $type == 'superior' ? 'id' : 'line_manager';
		$parentKey = $type == 'superior' ? 'line_manager' : 'id';

		foreach ($data as $key => $item) {
			if (!is_numeric($item[$parentKey])) $item[$parentKey] = 0;
			if ($item['id'] == $parent) $return[$item['id']] = $item;
			if ((int)$item[$compareKey] == (int)$parent) {
				$child = $directOnly ? [] : _getRecursiveRank($data, $item[$parentKey], $type, $return);
				if (!empty($child)) {
					$return = $return + $child;
				}
				$return[$item['id']] = $item;
			}
		}
		return $return;
	}
}
if (!function_exists('getEmployeesByRank')) {
	/*
	 * $type : subordinate | superior | other | subordinate-superior | subordinate-other | superior-other
	 */
	function getEmployeesByRank($userId = 0, $type = 'subordinate', $model = null, $directOnly = false): array
	{
		$data = array();
		if (empty($model)) {
			$module = \Config\Services::modules('employees');
			$model = $module->model;
			$model = $model->select(['id', 'email', 'username', 'full_name', 'avatar', 'dob', 'line_manager']);
		}
		if (is_array($model)) {
			$result = $model;
		} else {
			$result = $model->asArray()->findAll();
		}

		if (!empty($userId)) {
			$userId = is_array($userId) ? $userId : [$userId];
		}
		$subordinate = array();
		foreach ($result as $item) {
			if (!empty($userId) && !in_array($item['id'], $userId)) continue;
			$subordinate = $subordinate + _getRecursiveRank($result, $item['id'], 'subordinate', array(), $directOnly);
		}
		$superior = array();
		foreach ($result as $item) {
			if (!empty($userId) && !in_array($item['id'], $userId)) continue;
			$superior = $superior + _getRecursiveRank($result, $item['id'], 'superior', array(), $directOnly);
		}
		$other = $result;
		foreach ($other as $key => $item) {
			if (isset($subordinate[$item['id']]) || isset($superior[$item['id']])) {
				unset($other[$key]);
			}
		}
		switch ($type) {
			case 'subordinate' :
				$data = $subordinate;
				break;
			case 'superior' :
				$data = $superior;
				break;
			case 'other' :
				$data = $other;
				break;
			case 'subordinate-superior':
				$data = $superior + $subordinate;
				break;
			case 'subordinate-other':
				$data = $subordinate + $other;
				break;
			case 'superior-other':
				$data = $superior + $other;
				break;
		}
		return $data;
	}
}