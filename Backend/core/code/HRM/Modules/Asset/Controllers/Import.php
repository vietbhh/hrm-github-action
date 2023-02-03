<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : asset
*/

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use HRM\Modules\Asset\Models\AssetListModel;

class Import extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function get_asset_template_get()
	{
		$modules = \Config\Services::modules('asset_lists');
		$metas = $modules->getMetas();

		$arrImportColumn = $this->_getImportColumn($metas);
		$arrSelectModuleData = $this->_getSelectModuleData($arrImportColumn);

		$arrAlphabet = range('A', 'Z');

		$path_template = COREPATH . 'assets/template/Asset_Template.xlsx';
		$reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
		$reader->setLoadSheetsOnly(["Instructions"]);
		$spreadsheet = $reader->load($path_template);
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


		// ** create header Access template sheet
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Asset list (Template)");
		$startRow = 1;
		foreach ($arrImportColumn as $key => $row) {
			$sheet->getStyle($arrAlphabet[$key] . $startRow . ':' . $arrAlphabet[$key] . '300')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
			$sheet->getStyle($arrAlphabet[$key] . $startRow)->applyFromArray($styleArray);
			$sheet->setCellValue($arrAlphabet[$key] . $startRow, $row['field']);
		}

		foreach ($arrAlphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		// ** create header and data Master Data sheet
		$sheet = $spreadsheet->createSheet();
		$sheet->setTitle("Master Data");
		$startRowOrigin = $startRow = 1;
		$startCol = 0;

		foreach ($arrSelectModuleData as $key => $row) {
			$sheet->getStyle($arrAlphabet[$startCol] . $startRow)->applyFromArray($styleArray);
			$sheet->setCellValue($arrAlphabet[$startCol] . $startRow, $row['name']);

			$moduleData = $row['data'];
			if (count($moduleData) > 0) {
				$startRow += 1;
				foreach ($moduleData as $keyData => $rowData) {
					$sheet->setCellValue($arrAlphabet[$startCol] . $startRow, $rowData['label']);

					$startRow++;

					if ($keyData + 1 == $row['length']) {
						$startRow = $startRowOrigin;
						$startCol++;
					}
				}
			} else {
				$startCol++;
			}
		}

		foreach ($arrAlphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		// ** fill data Asset
		$sheet = $spreadsheet->setActiveSheetIndex(1);
		$defaultData = [
			[
				'code_computer',
				'Asus',
				'Core i5, RAM 16GB, SSD 256, Win11 Home 64bit, 15.6 inches',
				'',
				'',
				'25/06/2022',
				'25/06/2024',
				'',
				'',
				''
			],
			[
				'code_computer',
				'Dell',
				'Core i7, RAM 16GB, SSD 256, Win11 Home 64bit, 15.6 inches',
				'',
				'',
				'01/06/2022',
				'01/06/2024',
				'',
				'',
				''
			]
		];

		$startRow = 2;
		$startRowOrigin += 1;
		foreach ($defaultData as $keyData => $rowData) {
			foreach ($arrImportColumn as $keyColumn => $rowColumn) {
				$value = isset($rowData[$keyColumn]) ? $rowData[$keyColumn] : '';
				if ($rowColumn['type'] == 'select_module' || $rowColumn['type'] == 'select_option') {
					$infoSelectModule = $arrSelectModuleData[$rowColumn['field']];
					$this->_getSelectColumnData(
						$sheet,
						$arrAlphabet,
						$keyColumn,
						$startRow,
						$infoSelectModule['start_col'],
						$startRowOrigin,
						$startRowOrigin + ($infoSelectModule['length'] - 1)
					);
				}

				$sheet->setCellValue($arrAlphabet[$keyColumn] . $startRow, $value);
			}

			$startRow++;
		}

		//** export excel
		$writer = new Xlsx($spreadsheet);
		$name = "Access_Template_" . date("Ymd") . "_" . rand() . ".xlsx";
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
		$writer->save('php://output');

		exit;
	}

	public function get_mapping_fields_post()
	{
		$modules = \Config\Services::modules('asset_lists');
		$metas = $modules->getMetas();

		$postData = $this->request->getPost();
		$arrHeader = $postData['file_content']['header'];
		if (empty($arrHeader)) {
			return $this->failValidationErrors([]);
		}

		$arrCol = $this->_getImportColumn($metas);
		foreach ($arrCol as $keyCol => $rowCol) {
			$arrCol[$keyCol]['header'] = isset($arrHeader[$keyCol]) ? $arrHeader[$keyCol] : '';
		}

		$arrFieldSelect = [];
		foreach ($arrHeader as $keyHeader => $rowHeader) {
			if (!isset($arrCol[$keyHeader]['field'])) {
				continue;
			}

			$arrFieldSelect[] = [
				'field' => $arrCol[$keyHeader]['field'],
				'header' => $rowHeader
			];
		}

		$result = [
			'arr_col' => $arrCol,
			'arr_field_select' => $arrFieldSelect
		];

		return $this->respond($result);
	}

	public function get_import_data_post()
	{
		$postData = $this->request->getPost();

		$listField = $postData['list_field'];
		$header = $postData['file_upload_content']['header'];
		$body = $postData['file_upload_content']['body'];

		$recordReadyToCreate = [];
		$recordSkip = [];
		$unMappedField = [];

		// ** get select module data
		$arrSelectModuleData = $this->_getSelectModuleData($listField);

		// ** get unmapped field
		foreach ($listField as $key => $row) {
			$allowPush = false;
			if (!isset($row['header'])) {
				$allowPush = true;
			} else if (empty($row['header'])) {
				$allowPush = true;
			}

			if ($allowPush) {
				$unMappedField[] = $row;
			}
		}

		foreach ($body as $key => $row) {
			$dataPush = $row;
			$dataPush['key'] = $key;

			foreach ($header as $keyHeader => $rowHeader) {
				$arrFieldImport = $this->_getFieldImportFromHeader($listField, $rowHeader);
				if (count($arrFieldImport) == 0) {
					continue;
				}

				foreach ($arrFieldImport as $fieldInfo) {
					// ** get skip record
					if (
						$fieldInfo['required'] == 'true'
						&& (!isset($row[$fieldInfo['header']]) || $this->_isEmptyString($row[$fieldInfo['header']]))
					) {
						$arrError = $fieldInfo;
						if (!isset($recordSkip[$key])) {
							$recordSkip[$key] = [
								'header' => $fieldInfo['header'],
								'field' => $fieldInfo['field'],
								'arr_error' => []
							];
						}

						$arrError['value'] = "";
						$arrError['error'] = 'required_field';
						$recordSkip[$key]['arr_error'][] = $arrError;

						continue 3;
					}

					// ** error select value
					if ($fieldInfo['type'] == 'select_module') {
						$dataSelectModule = isset($arrSelectModuleData[$fieldInfo['field']]) ? $arrSelectModuleData[$fieldInfo['field']]['data'] : [];
						$valueSelect = isset($row[$fieldInfo['header']]) ? trim($row[$fieldInfo['header']]) : '';
						$listLabel = array_column($dataSelectModule, 'label');

						if (!in_array($valueSelect, $listLabel)) {
							$arrError = $fieldInfo;
							$arrError['value'] = $valueSelect;
							$arrError['error'] = $fieldInfo['field_select_module'] . '_not_exist';
							if (!isset($recordSkip[$key])) {
								$recordSkip[$key] = [
									'header' => $fieldInfo['header'],
									'field' => $fieldInfo['field'],
									'arr_error' => []
								];
							}
							$recordSkip[$key]['arr_error'][] = $arrError;

							continue 3;
						}
					}

					// ** empty required field
					if ($fieldInfo['required'] == 'true' && $this->_isEmptyString($row[$fieldInfo['header']])) {
						$arrError = $fieldInfo;
						$arrError['value'] = $valueSelect;
						$arrError['error'] = 'required_field';
						if (!isset($recordSkip[$key])) {
							$recordSkip[$key] = [
								'header' => $fieldInfo['header'],
								'field' => $fieldInfo['field'],
								'arr_error' => []
							];
						}
						$recordSkip[$key]['arr_error'][] = $arrError;

						continue 3;
					}
				}
			}

			$recordReadyToCreate[] = $dataPush;
		}

		$result = [
			'record_ready_to_create' => $recordReadyToCreate,
			'record_skip' => $recordSkip,
			'unmapped_field' => $unMappedField
		];

		return $this->respond($result);
	}

	public function import_asset_post()
	{
		helper('app_select_option');
		$model = new AssetListModel();

		$postData = $this->request->getPost();
		$importData = $postData['import_data'];
		$listFieldImport = $postData['list_field_import'];

		// ** get select module data
		$arrSelectModuleData = $this->_getSelectModuleData($listFieldImport);

		foreach ($importData as $key => $row) {
			$dataInsert = [];
			foreach ($listFieldImport as $rowListFieldImport) {
				if (isset($row[$rowListFieldImport['header']])) {
					$value = $valueOrigin = $row[$rowListFieldImport['header']];
					if ($rowListFieldImport['type'] == 'date') {
						$date = explode("/", $value);
						if (!empty($date) && isset($date[2])) {
							$value = "$date[2]-$date[1]-$date[0]";
						}
						$value = date('Y-m-d', strtotime($value));
					} else if ($rowListFieldImport['type'] == 'select_module' || $rowListFieldImport['type'] == 'select_option') {
						$value = 0;
						if (isset($arrSelectModuleData[$rowListFieldImport['header']])) {
							$dataSelect = $arrSelectModuleData[$rowListFieldImport['header']]['data'];
							foreach ($dataSelect as $rowDataSelect) {
								if ($rowDataSelect['label'] == $valueOrigin) {
									$value = $rowDataSelect['id'];
									break;
								}
							}
						}
					}

					$dataInsert[$rowListFieldImport['field']] = $value;
				}
			}

			// ** insert
			$model->insertAssetList($dataInsert);
		}
	}

	// ** support function
	private function _getImportColumn(&$metas)
	{
		$result = [];

		foreach ($metas as $key => $row) {
			$importable = isset($row->field_options['import']) ? $row->field_options['import'] : true;
			if (!$importable) {
				continue;
			}

			$pushData = [
				'field' => $row->field,
				'name' => $this->_handleFieldName($row->field, $row->field_form_require),
				'type' => $row->field_type,
				'required' => $row->field_form_require
			];

			if ($row->field_type == 'select_module') {
				$pushData['field_select_module'] = $row->field_select_module;
				$pushData['field_select_field_show'] = $row->field_select_field_show;
			} elseif ($row->field_type == 'select_option') {
				$fieldOptionValue = isset($row->field_options_values['values']) ? $row->field_options_values['values'] : [];
				foreach ($fieldOptionValue as $keyOptionValue => $rowOptionValue) {
					$pushData['field_options_values'][] = [
						'id' => $rowOptionValue['id'],
						'label' => $rowOptionValue['name']
					];
				}
			}

			$result[] = $pushData;
		}

		// ** owner column
		$result[] = [
			'field' => 'owner',
			'name' => 'Owner',
			'type' => 'select_module',
			'required' => true,
			'field_select_module' => 'users',
			'field_select_field_show' => 'username'
		];

		return $result;
	}

	private function _getSelectModuleData($arrImportColumn)
	{
		$result = [];

		$keySelectModule = 0;
		foreach ($arrImportColumn as $keyColumn => $rowColumn) {
			if ($rowColumn['type'] == 'select_module') {
				$modules = \Config\Services::modules($rowColumn['field_select_module']);
				$model = $modules->model;

				$listData = $model->asArray()
					->select(['id', $rowColumn['field_select_field_show'] . ' as label'])
					->findAll();

				$result[$rowColumn['field']] = [
					'name' => $this->_handleFieldName($rowColumn['field_select_module']),
					'data' => $listData,
					'start_col' => $keySelectModule,
					'length' => count($listData)
				];

				$keySelectModule++;
			} elseif ($rowColumn['type'] == 'select_option') {
				$result[$rowColumn['field']] = [
					'name' => $this->_handleFieldName($rowColumn['field']),
					'data' => $rowColumn['field_options_values'],
					'start_col' => $keySelectModule,
					'length' => count($rowColumn['field_options_values'])
				];

				$keySelectModule++;
			}
		}

		return $result;
	}

	private function _handleFieldName($name, $required = false)
	{
		$arrName = explode('_', $name);
		$arrName = array_map('ucfirst', $arrName);

		if ($required) {
			return implode(' ', $arrName) . ' *';
		}

		return implode(' ', $arrName);
	}

	private function _getSelectColumnData($sheet, $arrAlphabet, $startCol, $startRow, $startColSelect, $startRowSelect, $endRowSelect)
	{
		$validation = $sheet->getCell($arrAlphabet[$startCol] . $startRow)
			->getDataValidation();
		$validation->setSqref($arrAlphabet[$startCol] . $startRow . ':' . $arrAlphabet[$startCol] . '300');
		$validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
		$validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
		$validation->setAllowBlank(false);
		$validation->setShowInputMessage(true);
		$validation->setShowErrorMessage(true);
		$validation->setShowDropDown(true);
		$validation->setErrorTitle('Input error');
		$validation->setError('Value is not in list.');
		$validation->setFormula1('\'Master Data\'!$' . $arrAlphabet[$startColSelect] . '$' . $startRowSelect . ':$' . $arrAlphabet[$startColSelect] . '$' . $endRowSelect);

		return $validation;
	}

	private function _isEmptyString($str)
	{
		if (empty($str) || strlen(trim($str)) == 0) {
			return true;
		}

		return false;
	}

	private function _getFieldImportFromHeader($listField, $header)
	{
		$result = [];

		foreach ($listField as $rowField) {
			if (isset($rowField['header']) && $header == $rowField['header']) {
				$result[] = $rowField;
			}
		}

		return $result;
	}
}
