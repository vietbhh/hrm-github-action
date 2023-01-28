<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : asset
*/

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Asset\Models\AssetListModel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Asset extends ErpController
{

	public function index_get()
	{
		return $this->respond([]);
	}

	public function get_data_asset_list_get()
	{
		$getData = $this->request->getGet();
		$text = $getData['text'];
		$assetTypeGroup = $getData['asset_type_group'];
		$assetType = $getData['asset_type'];
		$assetStatus = $getData['asset_status'];
		$owner = $getData['owner'];

		$modules = \Config\Services::modules('asset_lists');
		$model = new AssetListModel();

		$builder = $model->asArray()->select([
			'm_asset_lists.id',
			'm_asset_lists.asset_code',
			'm_asset_lists.asset_name',
			'm_asset_lists.asset_type',
			'm_asset_lists.recent_image',
			'm_asset_brands.brand_name ',
			'm_asset_status.status_name',
			'm_asset_types.asset_type_code',
			'm_asset_groups.asset_group_code'
		])
			->join('m_asset_types', 'm_asset_types.id = m_asset_lists.asset_type')
			->join('m_asset_groups', 'm_asset_groups.id = m_asset_types.asset_type_group')
			->join('m_asset_status', 'm_asset_status.id = m_asset_lists.asset_status', 'left')
			->join('m_asset_brands', 'm_asset_brands.id = m_asset_lists.asset_brand', 'left');

		if (strlen(trim($text)) > 0) {
			$builder->groupStart()
				->like('asset_code', $text, 'after')
				->orLike('asset_name', $text, 'after')
				->groupEnd();
		}

		if (!empty($assetTypeGroup)) {
			$builder->where('m_asset_types.asset_type_group', $assetTypeGroup);
		}

		if (!empty($assetType)) {
			$builder->where('m_asset_lists.asset_type', $assetType);
		}

		if (!empty($assetStatus)) {
			$builder->where('m_asset_lists.asset_status', $assetStatus);
		}

		if (!empty($owner)) {
			$builder->where('m_asset_lists.owner', $owner);
		}

		$listAssetList = $builder->orderBy('m_asset_lists.id', 'DESC')->findAll();

		return $this->respond([
			'results' => handleDataBeforeReturn($modules, $listAssetList, true)
		]);
	}

	public function add_post()
	{

		helper(['app_select_option']);
		helper('HRM\Modules\Asset\Helpers\asset_helper');
		$uploadService = \App\Libraries\Upload\Config\Services::upload();
		$postData = $this->request->getPost();
		$filesData = $this->request->getFiles();

		if (!isset($postData['id'])) {
			$postData['asset_status'] = getAssetStatus('normal');
		}

		$dataHandle = handleDataBeforeSave('asset_lists', $postData, $filesData);
		$uploadFieldsArray = $dataHandle['uploadFieldsArray'];
		$dataSave = $dataHandle['data'];

		$assetListModel = new AssetListModel();
		if (isset($postData['id'])) {
			$assetListModel->save($dataSave);
		}


		$id = isset($postData['id']) ? $postData['id'] : $assetListModel->insertAssetList($dataSave);


		if ($filesData) {
			foreach ($filesData as $key => $files) {
				if (empty($files)) continue;
				if (!is_array($files)) $files = [$files];
				foreach ($files as $position => $file) {
					if (!$file->isValid()) {
						return $this->failValidationErrors($file->getErrorString() . '(' . $file->getError() . ')');
					}
					if (!$file->hasMoved()) {
						$subPath = (!empty($uploadFieldsArray[$key])) ? 'other' : 'data';
						$storePath = getModuleUploadPath('asset_lists', $id, false) . $subPath . '/';
						if ($key === 'filesDataWillUpdate') {
							$fileName = $dataSave[$key][$position]['name'];
							$removeOldFilePath = $storePath . $fileName;
							$removeOldFilePathForDownload = $storePath . $fileName;
							$uploadService->removeFile($removeOldFilePathForDownload);
							$fileName = safeFileName($fileName);
							$uploadService->uploadFile($storePath, [$file], false, $fileName);
						} else {
							$fileName = safeFileName($file->getName());
							$uploadService->uploadFile($storePath, [$file], false, $fileName);
							if (!empty($uploadFieldsArray[$key])) {
								if ($uploadFieldsArray[$key]->field_type == 'upload_multiple') {
									$arrayFiles = isset($dataSave[$key]) ? json_decode($dataSave[$key], true) : [];
									$arrayFiles[] = $fileName;
									$dataSave[$key] = json_encode($arrayFiles);
								} else {
									$dataSave[$key] = $fileName;
								}
							}
						} //end check file update
					}
				}
			}

			try {
				$dataSave['id'] = $id;
				$assetListModel->save($dataSave);
				return $this->respond(ACTION_SUCCESS);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE . '_' . $e->getMessage());
			}
		}
	}

	public function load_data_get()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules('asset_lists');
		$getPara = $this->request->getGet();
		$model = $modules->model;
		$data['assetTotal'] = $model->countAllResults();
		$data['assetThisMonth'] = $model->where('MONTH(date_created)', date("m"))->where('YEAR(date_created)', date("Y"))->countAllResults(true);
		$data['assetEli_liq'] = $model->join('m_asset_status', 'm_asset_status.id = m_asset_lists.asset_status')->where('m_asset_status.status_code', 'eliminate')->orWhere('m_asset_status.status_code', 'liquidated')->countAllResults(true);
		$data['assetRe_bro'] = $model->join('m_asset_status', 'm_asset_status.id = m_asset_lists.asset_status')->where('m_asset_status.status_code', 'repair')->orWhere('m_asset_status.status_code', 'broken')->countAllResults(true);

		if (isset($getPara['filters'])) {
			foreach ($getPara['filters'] as $key => $val) {
				if ($key === 'owner') {
					if ($val) {
						$model->where('m_asset_lists.owner', $val);
					}
				} elseif ($key === 'asset_group' && $val) {
					$model->where('m_asset_types.asset_type_group', $val);
				} else {
					if ($val) {
						$model->where($key, $val);
					}
				}
			}
		}

		if (isset($getPara['search']) && $getPara['search']) {
			$model->groupStart();
			$model->like('asset_code', $getPara['search']);
			$model->orLike('asset_name', $getPara['search']);
			$model->orLike('asset_properties', $getPara['search']);
			$model->orLike('asset_descriptions', $getPara['search']);
			$model->orLike('asset_notes', $getPara['search']);
			$model->groupEnd();
		}

		$model->select('*,m_asset_lists.id as id,m_asset_lists.owner as owner')
			->join('m_asset_types', 'm_asset_types.id = m_asset_lists.asset_type', 'left')
			->join('m_asset_groups', 'm_asset_groups.id = m_asset_types.asset_type_group', 'left');

		$data['recordsTotal'] = $model->countAllResults(false);

		$assetList = $model->asArray()->orderBy('date_created', 'DESC')->findAll($getPara['perPage'], $getPara['page'] * $getPara['perPage'] - $getPara['perPage']);
		$data['asset_list'] = handleDataBeforeReturn($modules, $assetList, true);
		$data['page'] = $getPara['page'];
		return $this->respond($data);
	}

	public function update_status_post()
	{
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$filesData = $this->request->getFiles();

		$dataHandle = handleDataBeforeSave($modules, $postData, $filesData);
		$dataSave = $dataHandle['data'];
		$assetListModel = new AssetListModel();

		$insertHis = $assetListModel->insertHistory($dataSave, $filesData);

		return $this->respond(ACTION_SUCCESS);
	}

	public function hand_over_post()
	{
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$assetListModel = new AssetListModel();
		$dataHandle = handleDataBeforeSave($modules, $postData);
		$dataSave = $dataHandle['data'];

		$assetListModel->insertHistory($dataSave);
		$assetListModel->save(['owner' => $postData['owner_change'], 'id' => $postData['asset_code']]);
		return $this->respond(ACTION_SUCCESS);
	}

	public function error_post()
	{
		$modules = \Config\Services::modules('asset_history');
		$postData = $this->request->getPost();
		$assetListModel = new AssetListModel();
		$dataHandle = handleDataBeforeSave($modules, $postData);
		$dataSave = $dataHandle['data'];

		$assetListModel->insertHistory($dataSave);
		$assetListModel->save(['asset_status' => $postData['status_change'], 'id' => $postData['asset_code']]);
		return $this->respond(ACTION_SUCCESS);
	}

	public function load_history_get()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules('asset_history');
		$getPara = $this->request->getGet();
		$model = $modules->model;
		if (!isset($getPara['page'])) {
			$getPara['page'] = 1;
		}
		if (!isset($getPara['limit'])) {
			$getPara['limit'] = 5;
		}
		$dataReturn['page'] = $getPara['page'];
		$model->where('asset_code', $getPara['asset_code']);
		$dataReturn['recordsTotal'] = $model->countAllResults(false);

		$history = $model->orderBy('created_at', 'desc')->findAll($getPara['limit'] * $getPara['page'], 0);
		$dataReturn['history'] = handleDataBeforeReturn('asset_history', $history, true);
		return $this->respond($dataReturn);
	}

	public function detail_by_code_get()
	{
		$modules = \Config\Services::modules('asset_lists');
		$model = $modules->model;
		$getGet = $this->request->getGet();
		if (!isset($getGet['code']) || !$getGet['code']) {
			return $this->fail(null);
		}
		$code = $getGet['code'];
		$info = $model->asArray()->where('asset_code', $code)->first();
		if (!$info) {
			return $this->fail(null);
		}
		$befoReturn = handleDataBeforeReturn('asset_lists', $info);
		return $this->respond($befoReturn);
	}

	public function export_excel_get()
	{

		$modules = \Config\Services::modules('asset_lists');
		$getPara = $this->request->getGet();
		$model = $modules->model;

		if (isset($getPara['filters'])) {
			foreach ($getPara['filters'] as $key => $val) {
				if ($key === 'owner') {
					if ($val) {
						$model->where('m_asset_lists.owner', $val);
					}
				} elseif ($key === 'asset_group' && $val) {
					$model->where('m_asset_types.asset_type_group', $val);
				} else {
					if ($val) {
						$model->where($key, $val);
					}
				}
			}
		}

		if (isset($getPara['search']) && $getPara['search']) {
			$model->groupStart();
			$model->like('asset_code', $getPara['search']);
			$model->orLike('asset_name', $getPara['search']);
			$model->orLike('asset_properties', $getPara['search']);
			$model->orLike('asset_descriptions', $getPara['search']);
			$model->orLike('asset_notes', $getPara['search']);
			$model->groupEnd();
		}

		$model->select('*,m_asset_lists.id as id,m_asset_lists.owner as owner')
			->join('m_asset_types', 'm_asset_types.id = m_asset_lists.asset_type', 'left')
			->join('m_asset_groups', 'm_asset_groups.id = m_asset_types.asset_type_group', 'left');

		$assetList = $model->asArray()->findAll();
		$assetList = handleDataBeforeReturn($modules, $assetList, true);

		//$data = $this->getEmployeeTimeOffRequestTable($getPara, 'export_excel');
		$data_table = $assetList;

		/*alphabet A to F*/
		$arr_alphabet = [];
		foreach (range('A', 'F') as $columnId) {
			$arr_alphabet[] = $columnId;
		}

		$spreadsheet = new Spreadsheet();
		$sheet = $spreadsheet->getActiveSheet();

		$styleArray = [
			'fill' => [
				'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
				'startColor' => [
					'argb' => 'A9D08E',
				],
				'endColor' => [
					'argb' => 'A9D08E',
				],
			],
		];

		$i = 1;
		$sheet->getStyle("A$i:I$i")->applyFromArray($styleArray);
		$sheet->setCellValue("A$i", "Name");
		$sheet->setCellValue("B$i", "Group");
		$sheet->setCellValue("C$i", "Code");
		$sheet->setCellValue("D$i", "Type");
		$sheet->setCellValue("E$i", "Brand");
		$sheet->setCellValue("F$i", "Created");
		$sheet->setCellValue("G$i", "Warranty expires");
		$sheet->setCellValue("H$i", "Status");
		$sheet->setCellValue("I$i", "Owner");

		$i = 2;
		foreach ($data_table as $item) {
			$sheet->getStyle("F$i:G$i")->getNumberFormat()->setFormatCode('dd-mmm-yyyy');
			//$sheet->getStyle("B$i:C$i")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
			$sheet->setCellValue("A$i", $item['asset_name'] ?? "-");
			$sheet->setCellValue("B$i", $item['asset_group_name'] ?? "-");
			$sheet->setCellValue("C$i", $item['asset_code'] ?? "-");
			$sheet->setCellValue("D$i", $item['asset_type'] ? $item['asset_type']['label'] : "-");
			$sheet->setCellValue("E$i", $item['asset_brand'] ? $item['asset_brand']['label'] : "-");
			$sheet->setCellValue("F$i", date('d/m/Y', strtotime($item['date_created'])));
			$sheet->setCellValue("G$i", date('d/m/Y', strtotime($item['asset_warranty_expires'])));
			$sheet->setCellValue("H$i", $item['asset_status'] ? $item['asset_status']['label'] : "-");
			$sheet->setCellValue("I$i", $item['owner']['label']);
			$i++;
		}

		foreach ($arr_alphabet as $columnId) {
			if ($columnId == 'A') {
				$sheet->getColumnDimension($columnId)->setWidth(30);
				continue;
			}
			$sheet->getColumnDimension($columnId)->setWidth(20);
		}

		/*export excel*/
		$writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		$writer->save('php://output');

		exit;
	}
}
