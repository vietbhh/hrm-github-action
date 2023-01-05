<?php
if (!function_exists('getAssetStatus')) {
	function getAssetStatus($code)
	{
		$modules = \Config\Services::modules('asset_status');
		$model = $modules->model;
		$info = $model->asArray()->where('status_code', $code)->first();
		$id = null;

		if ($info) {
			$id = $info['id'];
		}
		return $id;
	}
}