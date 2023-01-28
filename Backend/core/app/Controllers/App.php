<?php

namespace App\Controllers;

use App\Models\AppModel;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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

	public function linked_get($n1ame)
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

	public function export_template_get($module)
	{
		try {
			$modules = \Config\Services::modules($module);
			$metas = $modules->getMetas();

			$arrImportColumn = $this->_getImportColumn($metas);
			$arrSelectModuleData = $this->_getSelectModuleData($arrImportColumn);

			$arrAlphabet = range('A', 'Z');

			$path_template = COREPATH . 'assets/templates/Module_Template.xlsx';
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

			// ** create header Module template sheet
			$sheet = $spreadsheet->createSheet();
			$sheet->setTitle($this->_handleFieldName($module) . " (Template)");
			$startRow = 1;
			$arrDefaultData = [];
			foreach ($arrImportColumn as $key => $row) {
				$sheet->getStyle($arrAlphabet[$key] . $startRow . ':' . $arrAlphabet[$key] . '300')->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
				$sheet->getStyle($arrAlphabet[$key] . $startRow)->applyFromArray($styleArray);
				$sheet->setCellValue($arrAlphabet[$key] . $startRow, $row['field']);

				$arrDefaultData[$row['field']] = $this->_handleFieldName($row['field']);
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

					if (isset($arrDefaultData[$key])) {
						$arrDefaultData[$key] = $moduleData[0]['label'];
					}
				} else {
					$startCol++;
				}
			}

			foreach ($arrAlphabet as $columnId) {
				$sheet->getColumnDimension($columnId)->setAutoSize(true);
			}

			// ** fill data module
			$sheet = $spreadsheet->setActiveSheetIndex(1);
			$startRow = 2;
			$startRowOrigin += 1;
			foreach ($arrImportColumn as $keyColumn => $rowColumn) {
				$value = isset($arrDefaultData[$rowColumn['field']]) ? $arrDefaultData[$rowColumn['field']] : '';
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

			//** export excel
			$writer = new Xlsx($spreadsheet);
			$name = "Module_Template_" . date("Ymd") . "_" . rand() . ".xlsx";
			header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
			$writer->save('php://output');

			exit;
		} catch (\Exception $err) {
			return $this->fail($err->getMessage());
		}
	}

	public function get_mapping_fields_post($module)
	{
		$modules = \Config\Services::modules($module);
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

	public function get_import_data_post($module)
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
							$arrError['error'] = 'not_exist';
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
		if (empty($data['import_data'])) {
			return $this->failValidationErrors(MISSING_REQUIRED);
		}

		$model = new AppModel();
		$isFormatData = isset($data['format']) ? filter_var($data['format'], FILTER_VALIDATE_BOOLEAN) : false;
		if ($isFormatData) {
			$linked = $module->getLinkedModule();
			if (!empty($linked)) {
				foreach ($linked as $key => $item) {
					$formatModule = $module->getModule($key);
					if (!empty($formatModule->tableName)) {
						$model->setTable($formatModule->tableName)->emptyTable();
					}
				}
			}
			$module->model->emptyTable();
		}

		$validation = \Config\Services::validation();

		$importData = $data['import_data'];
		$listFieldImport = $data['list_field_import'];
		// ** get select module data
		$arrSelectModuleData = $this->_getSelectModuleData($listFieldImport);

		$batchData = $validateErrors = $fieldInsert = [];
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

			if (count($dataInsert) == 0) {
				continue;
			}

			$formatInsertData = handleDataBeforeSave($module, $dataInsert, null);
			$fieldInsert = $formatInsertData['fieldsArray'];

			if ($validation->reset()->setRules($formatInsertData['validate'])->run($formatInsertData['data'])) {
				$batchData[] = array_merge($formatInsertData['data'], ['created_by' => user_id()]);
			} else {
				$validateErrors[$key] = $validation->getErrors();
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

	// ** support function
	private function _getImportColumn($metas, $additionalField = [])
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

		if (count($additionalField) > 0) {
			$result = array_merge($result, $additionalField);
		}

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
