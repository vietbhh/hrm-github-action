<?php
if (!function_exists('isSuperpower')) {
	/**
	 * @param $name
	 * @return bool
	 */
	function isSuperpower(): bool
	{
		return has_permission('sys.superpower');
	}
}


if (!function_exists('hasPermission')) {
	/**
	 * @param $name
	 * @return bool
	 */
	function hasPermission($name): bool
	{
		if (isSuperpower()) return true;
		if ($name == 'app.login') return true;
		return has_permission($name);
	}
}

if (!function_exists('isSuper')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function isSuper($module): bool
	{
		if (isSuperpower()) return true;
		$permitName = 'modules.' . $module . '.manage';
		return has_permission($permitName);
	}
}

if (!function_exists('hasModulePermit')) {
	/**
	 * @param $module
	 * @param $permit
	 * @return bool
	 */
	function hasModulePermit($module, $permit): bool
	{
		if (isSuper($module)) return true;
		$permitName = 'modules.' . $module . '.' . $permit;
		return has_permission($permitName);
	}
}


if (!function_exists('mayAccess')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayAccess($module): bool
	{
		if (isSuper($module)) return true;
		return hasModulePermit($module, 'access');
	}
}


if (!function_exists('mayList')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayList($module): bool
	{
		if (mayListAll($module)) return true;
		return hasModulePermit($module, 'list');
	}
}

if (!function_exists('mayListAll')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayListAll($module): bool
	{
		if (isSuper($module)) return true;
		return hasModulePermit($module, 'listAll');
	}
}

if (!function_exists('mayAdd')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayAdd($module): bool
	{
		if (isSuper($module)) return true;
		return hasModulePermit($module, 'add');
	}

}

if (!function_exists('mayUpdate')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayUpdate($module): bool
	{
		if (mayUpdateAll($module)) return true;
		return hasModulePermit($module, 'update');
	}

}

if (!function_exists('mayUpdateAll')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayUpdateAll($module): bool
	{
		if (isSuper($module)) return true;
		return hasModulePermit($module, 'updateAll');
	}
}

if (!function_exists('mayDelete')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayDelete($module): bool
	{
		if (mayDeleteAll($module)) return true;
		return hasModulePermit($module, 'delete');
	}
}

if (!function_exists('mayDeleteAll')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayDeleteAll($module): bool
	{
		if (isSuper($module)) return true;
		return hasModulePermit($module, 'deleteAll');
	}
}

if (!function_exists('mayExport')) {
	/**
	 * @param $module
	 * @return bool
	 */
	function mayExport($module): bool
	{
		if (isSuper($module)) return true;
		return hasModulePermit($module, 'export');
	}
}

if (!function_exists('getResource')) {
	/**
	 * @param $module
	 * @param $id
	 * @param array $field
	 * @return array|object
	 */
	function getResource($module, $id, $field = [])
	{
		$module = \Config\Services::modules($module);
		$model = $module->model;
		$defaultField = ['id', 'owner', 'view_permissions', 'update_permissions'];
		return $model->select(array_merge($defaultField, $field))->asArray()->find($id);
	}
}


if (!function_exists('isOwner')) {
	/**
	 * @param $module
	 * @param $id
	 * @return bool
	 */
	function isOwner($module, $id): bool
	{
		$record = getResource($module, $id);
		if (!$record) return false;
		return $record['owner'] == user_id();
	}
}


if (!function_exists('mayAccessResource')) {
	/**
	 * @param $module
	 * @param $id
	 * @return bool
	 */
	function mayAccessResource($module, $id): bool
	{
		if (mayListAll($module)) return true;
		$record = getResource($module, $id);
		if (!$record) return false;
		if ($record['owner'] == user_id()) return true;
		$viewPer = (!empty($record['view_permissions'])) ? json_decode($record['view_permissions'], true) : [];
		return in_array(user_id(), $viewPer);
	}
}

if (!function_exists('mayUpdateResource')) {
	/**
	 * @param $module
	 * @param $id
	 * @return bool
	 */
	function mayUpdateResource($module, $id): bool
	{
		if (mayUpdateAll($module)) return true;
		$record = getResource($module, $id);
		if (!$record) return false;
		if ($record['owner'] == user_id()) return true;
		$updatePer = (!empty($record['update_permissions'])) ? json_decode($record['update_permissions'], true) : [];
		return in_array(user_id(), $updatePer);
	}
}


if (!function_exists('mayDeleteResource')) {
	/**
	 * @param $module
	 * @param $id
	 * @return bool
	 */
	function mayDeleteResource($module, $id): bool
	{
		if (mayDeleteAll($module)) return true;
		return isOwner($module, $id);
	}
}