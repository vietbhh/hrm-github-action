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

class App extends ErpController
{
	public function index_get()
	{
		$settingModel = new \App\Models\SettingModel();
		$settings = service('settings');
		$data = [];
		$listSettings = $settingModel->asArray()->getDefaultSettings();

		foreach ($listSettings as $key => $item) {
			if (empty($item['config'])) continue;
			if (!empty($item['config']['tab'])) {
				$itemData = $item['config'];
				$itemData['id'] = $item['id'];
				$itemData['fieldKey'] = ($item['class'] === 'Preferences') ? $item['key'] : $item['class'] . '__' . $item['key'];
				$itemData['summary'] = $item['summary'];
				$keyName = ($item['class'] === 'Preferences') ? 'Preferences.' . $item['key'] : $item['class'] . '.' . $item['key'];
				$itemData['value'] = $settings->get($keyName);
				$itemData['classSetting'] = $item['class'];
				if (in_array($itemData['type'], ['upload_one', 'upload_multiple'])) {
					$itemData['value'] = getFilesProps($itemData['value']);
				}

				$data[$item['config']['tab']][] = $itemData;
			}
		}
		$tabsName = array_keys($data);
		$tabs = [];
		$tabsData = [];
		foreach ($tabsName as $item) {
			$arrayTabName = explode('__', $item);
			$tabs[] = [
				'order' => $arrayTabName[0],
				'name' => $arrayTabName[1],
				'icon' => $arrayTabName[2],
				'key' => $item,
			];
			$tabFields = $data[$item];
			usort($tabFields, function ($item1, $item2) {
				return $item1['order'] <=> $item2['order'];
			});
			$tabsData[$item] = $tabFields;
		}
		usort($tabs, function ($item1, $item2) {
			return $item1['order'] <=> $item2['order'];
		});
		return $this->respond([
			'tabs' => $tabs,
			'tabsData' => $tabsData
		]);
	}

	public function update_post()
	{
		$settings = service('settings');
		$postData = $this->request->getPost();
		$filesData = $this->request->getFiles();
		$keySkip = ['filesWillDelete'];
		foreach ($postData as $key => $value) {
			if (in_array($key, $keySkip)) continue;
			if (strpos($key, '__') !== false) {
				$keyUpdate = str_replace('__', '.', $key);
			} else {
				$keyUpdate = 'Preferences.' . $key;
			}
			if ($value === "true" || $value === "false") $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
			$settings->set($keyUpdate, $value);
		}
		if (!empty($postData['filesWillDelete'])) {
			foreach ($postData['filesWillDelete'] as $key => $item) {
				if (empty($item)) continue;
				if (strpos($key, '__') !== false) {
					$keyUpdate = str_replace('__', '.', $key);
				} else {
					$keyUpdate = 'Preferences.' . $key;
				}
				$currentValue = $settings->get($keyUpdate);
				$newValue = array_filter($currentValue, function ($e) use ($item) {
					return (!in_array($e, $item));
				});
				foreach ($item as $delPath) {
					$fileDel = WRITEPATH . 'uploads' . $delPath;
					if (is_file($fileDel)) unlink($fileDel);
				}
				$settings->set($keyUpdate, $newValue);
			}
		}

		$paths = [];
		if ($filesData) {

			$settingModel = new \App\Models\SettingModel();
			$listSettings = $settingModel->asArray()->getDefaultSettings();
			$fieldSettings = [];
			foreach ($listSettings as $item) {
				if (empty($item['config'])) continue;
				if (!empty($item['config']['tab'])) {
					$keyName = ($item['class'] === 'Preferences') ? 'Preferences.' . $item['key'] : $item['class'] . '.' . $item['key'];
					$fieldSettings[$keyName] = $item['config'];
				}
			}

			foreach ($filesData as $key => $listFiles) {
				$fileArray = [];
				if (is_array($listFiles)) {
					foreach ($listFiles as $files) {
						try {
							$fileArray[] = _uploadSettingFile($files);
						} catch (\Exception $e) {
							return $this->failValidationErrors($e->getMessage());
						}
					}
				} else {
					try {
						$fileArray = _uploadSettingFile($listFiles);
					} catch (\Exception $e) {
						return $this->failValidationErrors($e->getMessage());
					}
				}
				if (strpos($key, '__') !== false) {
					$keyUpdate = str_replace('__', '.', $key);
				} else {
					$keyUpdate = 'Preferences.' . $key;
				}
				if ($fieldSettings[$keyUpdate]['type'] === 'upload_image') {
					$fileArray = reset($fileArray);
				}
				$settings->set($keyUpdate, $fileArray);
			}
		}
		return $this->respond($paths, 200, ACTION_SUCCESS);
	}

}