<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : setting
* Controller name : Setting
* Time created : 14/09/2020 20:24:20
*/

namespace App\Controllers\Settings;

use App\Controllers\ErpController;
use App\Models\SettingModel;

class General extends ErpController
{
	protected $allowSetting = ['app_name', 'website', 'address', 'phone', 'email', 'bio', 'logo_default', 'logo_white', 'logo_black', 'favicon'];

	public function index_get()
	{
		$settingModel = new SettingModel();
		$listSettings = $settingModel->getDefaultSettings();
		$settings = service('settings');
		foreach ($listSettings as $item) {
			if (!in_array($item->key, $this->allowSetting)) continue;
			$data[$item->key] = $settings->get('Preferences.' . $item->key);
		}
		return $this->respond($data, 200, 'data_fetch_success');
	}

	public function update_post()
	{
		$settings = service('settings');
		$postData = $this->request->getPost();
		$filesData = $this->request->getFiles();
		foreach ($postData as $key => $value) {
			if (!in_array($key, $this->allowSetting)) continue;
			$settings->set('Preferences.' . $key, $value);
		}
		$paths = [];
		if ($filesData) {
			foreach ($filesData as $key => $files) {
				if (!in_array($key, $this->allowSetting)) continue;
				try {
					$filePath = _uploadSettingFile($files);
				} catch (\Exception $e) {
					return $this->failValidationErrors($e->getMessage());
				}
				$settings->set('Preferences.' . $key, $filePath);
			}
		}
		return $this->respond($paths, 200, 'data_updated');
	}

}