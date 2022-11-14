<?php

namespace HRM\Modules\Payrolls\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Import extends ErpController
{
	public function export_template_get()
	{
		$getPara = $this->request->getGet();
		$type = $getPara['type'];
		if (empty($type) || ($type != 'salary' && $type != 'recurring')) {
			$this->failForbidden(MISSING_ACCESS_PERMISSION);
		}

		/*alphabet A to Z*/
		$arr_alphabet = [];
		foreach (range('A', 'D') as $columnId) {
			$arr_alphabet[] = $columnId;
		}

		/*fake data*/
		$arr_data_fake = [];
		$arr_column = [];
		if ($type == 'salary') {
			$arr_column = ['Username', "Amount", "Valid from", "Valid to"];

			$arr_data_fake[] = [
				"A" => "anv1",
				"B" => 5000,
				"C" => "01/06/2022",
				"D" => "31/12/2022"
			];
			$arr_data_fake[] = [
				"A" => "anv2",
				"B" => 6000,
				"C" => "01/06/2021",
				"D" => "31/12/2022"
			];
		}
		if ($type == 'recurring') {
			$arr_column = ['Username', "Payment name", "Valid from", "Valid to"];

			$arr_data_fake[] = [
				"A" => "anv1",
				"B" => "Parking",
				"C" => "01/06/2022",
				"D" => "31/12/2022"
			];
			$arr_data_fake[] = [
				"A" => "anv2",
				"B" => "Taxi",
				"C" => "01/06/2021",
				"D" => "31/12/2022"
			];
		}

		/*clone sheet from template*/
		$path_template = COREPATH . 'assets/template/Payroll_Template.xlsx';
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

		/*sheet Employee list (Template)*/
		$sheet = $spreadsheet->createSheet();
		if ($type == 'salary') {
			$sheet->setTitle("Fixed salary");
		}
		if ($type == 'recurring') {
			$sheet->setTitle("Recurring payments");
		}

		$i = 1;
		$sheet->getStyle("A$i:C$i")->applyFromArray($styleArray);
		foreach ($arr_column as $j => $item) {
			$sheet->setCellValue($arr_alphabet[$j] . $i, $item);
		}

		foreach ($arr_data_fake as $item) {
			$i++;
			$sheet->getStyle("A$i:D$i")->getNumberFormat()->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
			if ($type == 'salary') {
				$sheet->getStyle("B$i")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
			}
			$sheet->setCellValue("A$i", $item['A']);
			$sheet->setCellValue("B$i", $item['B']);
			$sheet->setCellValue("C$i", $item['C']);
			$sheet->setCellValue("D$i", $item['D']);
		}

		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setWidth(20);
		}

		/*export excel*/
		$writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		$writer->save('php://output');

		exit;
	}

	public function preview_post()
	{
		$modules = \Config\Services::modules();
		$data = $this->request->getPost();
		$import_type = $data['import_type'];
		$header = $data['header'];
		$body = $data['body'];
		$dataMapFields = $data['dataMapFields'];
		$metas = $data['metas'];

		foreach ($metas as $key => $item) {
			$metas[$key]['value'] = $dataMapFields[$item['field']] ?? "";
		}

		$arr_data = [];
		$arr_created = [];
		$arr_duplicated = [];
		$arr_duplicated_ = [];
		$arr_skipped = [];

		foreach ($body as $key => $item) {
			$key = $key + 2;
			$arr = array();
			$arr['row'] = $key;
			foreach ($metas as $item_field) {
				$value = $item[$item_field['value']] ?? "";
				if ($item_field['field_type'] == 'Date') {
					$arr[$item_field['field'] . "_date"] = "";
					$date = explode("/", $value);
					if (!empty($date) && isset($date[2])) {
						$arr[$item_field['field'] . "_date"] = "$date[2]-$date[1]-$date[0]";
					}
				}
				$arr[$item_field['field']] = $value;
			}
			$arr_data[$key] = $arr;
		}

		foreach ($arr_data as $key => $item) {
			if (empty($item['Username']) || empty($item['Valid from_date']) || ($import_type == 'salary' && empty($item['Amount'])) || ($import_type == 'recurring' && empty($item['Payment name']))) {
				unset($arr_data[$key]);

				$skip_count = 0;
				$skip_error = [];
				if (empty($item['Username'])) {
					$skip_count++;
					$skip_error[] = [
						'field' => 'Username',
						'uploaded_file_header' => $dataMapFields['Username'] ?? "",
						'value' => null,
						'description' => 'invalid_value'
					];
				}
				if ($import_type == 'salary' && empty($item['Amount'])) {
					$skip_count++;
					$skip_error[] = [
						'field' => 'Amount',
						'uploaded_file_header' => $dataMapFields['Amount'] ?? "",
						'value' => null,
						'description' => 'invalid_value'
					];
				}
				if ($import_type == 'recurring' && empty($item['Payment name'])) {
					$skip_count++;
					$skip_error[] = [
						'field' => 'Payment name',
						'uploaded_file_header' => $dataMapFields['Payment name'] ?? "",
						'value' => null,
						'description' => 'invalid_value'
					];
				}
				if (empty($item['Valid from_date'])) {
					$skip_count++;
					$skip_error[] = [
						'field' => 'Valid from',
						'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
						'value' => null,
						'description' => 'invalid_value'
					];
				}
				$skip_header = [
					'row' => $item['row'],
					'error' => $skip_count,
					'username' => $item['Username']
				];
				$arr_skipped[] = [
					'header' => $skip_header,
					'table_error' => $skip_error
				];
			}
		}


		foreach ($arr_data as $row => $item) {
			$modules->setModule("employees");
			$model = $modules->model;
			$check_username_db = $model->where('username', $item['Username'])->select('id, join_date')->first();
			if (!$check_username_db) {
				$arr_skipped[] = [
					'header' => [
						'row' => $row,
						'error' => 1,
						'username' => $item['Username']
					],
					'table_error' => [
						[
							'field' => 'Username',
							'uploaded_file_header' => $dataMapFields['Username'] ?? "",
							'value' => $item['Username'],
							'description' => 'invalid_username'
						]
					]
				];

				unset($arr_data[$row]);
				continue;
			}

			if (strtotime($item['Valid from_date']) < strtotime($check_username_db->join_date)) {
				$arr_skipped[] = [
					'header' => [
						'row' => $row,
						'error' => 1,
						'username' => $item['Username']
					],
					'table_error' => [
						[
							'field' => 'Valid from',
							'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
							'value' => $item['Valid from'],
							'description' => 'date_join_date'
						]
					]
				];

				unset($arr_data[$row]);
				continue;
			}

			$employee_id = $check_username_db->id;
			$arr_data[$row]['employee_id'] = $employee_id;
			if ($import_type == 'salary') {
				// salary
				$modules->setModule("employee_salary");
				$model = $modules->model;
				$salary_check_dup = $model->where('employee', $employee_id)->where('date_from', $item['Valid from_date'])->first();
				if ($salary_check_dup) {
					$check_duplicate = false;
					$salary_check_dup_next = $model->where('employee', $employee_id)->where('id >', $salary_check_dup->id)->first();
					if ($salary_check_dup_next) {
						if (!empty($item['Valid to_date']) && strtotime($item['Valid to_date']) < strtotime($salary_check_dup_next->date_from)) {
							$check_duplicate = true;
						}
					} else {
						if (empty($salary_check_dup->date_to) || $salary_check_dup->date_to == '0000-00-00') {
							$check_duplicate = true;
						} else {
							if (!empty($item['Valid to_date']) && strtotime($item['Valid to_date']) <= strtotime($salary_check_dup->date_to)) {
								$check_duplicate = true;
							}
						}
					}
					if ($check_duplicate) {
						$arr_duplicated_[$item['Username']]['db_' . $salary_check_dup->id] = [
							'type' => 'db',
							'amount' => "Amount: " . round($salary_check_dup->salary, 2),
							'date' => "Date: " . date('d/m/Y', strtotime($salary_check_dup->date_from)) . " - " . date('d/m/Y', strtotime($salary_check_dup->date_to))
						];

						$arr_duplicated_[$item['Username']][$row] = [
							'type' => 'excel',
							'amount' => "Amount: " . $item['Amount'],
							'date' => "Date: " . $item['Valid from'] . " - " . $item['Valid to']
						];

						continue;
					}
				}

				$salary_db = $model->where('employee', $employee_id)
					->orderBy('id', 'desc')
					->select("id, date_from, date_to")
					->first();
				if ($salary_db) {
					$date_from = $salary_db->date_from;
					$date_to = $salary_db->date_to == '0000-00-00' ? "" : $salary_db->date_to;
					$skip_count = 0;
					$skip_error = [];
					if (empty($date_to)) {
						if (strtotime($item['Valid from_date']) <= strtotime($date_from)) {
							$skip_count++;
							$skip_error[] = [
								'field' => 'Valid from',
								'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
								'value' => $item['Valid from'],
								'description' => 'from_date_start_end_date'
							];
						}
						if (!empty($item['Valid to_date']) && strtotime($item['Valid to_date']) <= strtotime($date_from)) {
							$skip_count++;
							$skip_error[] = [
								'field' => 'Valid to',
								'uploaded_file_header' => $dataMapFields['Valid to'] ?? "",
								'value' => $item['Valid to'],
								'description' => 'to_date_start_end_date'
							];
						}
					} else {
						if (strtotime($item['Valid from_date']) <= strtotime($date_to)) {
							$skip_count++;
							$skip_error[] = [
								'field' => 'Valid from',
								'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
								'value' => $item['Valid from'],
								'description' => 'from_date_start_end_date'
							];
						}
						if (!empty($item['Valid to_date']) && strtotime($item['Valid to_date']) <= strtotime($date_to)) {
							$skip_count++;
							$skip_error[] = [
								'field' => 'Valid to',
								'uploaded_file_header' => $dataMapFields['Valid to'] ?? "",
								'value' => $item['Valid to'],
								'description' => 'to_date_start_end_date'
							];
						}
					}

					if ($skip_count > 0) {
						$skip_header = [
							'row' => $item['row'],
							'error' => $skip_count,
							'username' => $item['Username']
						];
						$arr_skipped[] = [
							'header' => $skip_header,
							'table_error' => $skip_error
						];

						unset($arr_data[$row]);
						continue;
					}
				}

				$arr_created[] = [
					'key' => $row,
					'row' => $row,
					'username' => $item['Username'],
					'amount' => $item['Amount'],
					'valid_from' => $item['Valid from'],
					'valid_to' => $item['Valid to']
				];
			} else {
				// recurring
				$modules->setModule("recurring");
				$model = $modules->model;
				$check_valid_recurring = $model->where('name', $item['Payment name'])->select("id, valid_from, valid_to, repeat_type")->asArray()->first();
				$check_valid_recurring = handleDataBeforeReturn($modules, $check_valid_recurring);
				if (!$check_valid_recurring) {
					$arr_skipped[] = [
						'header' => [
							'row' => $row,
							'error' => 1,
							'username' => $item['Username']
						],
						'table_error' => [
							[
								'field' => 'Payment name',
								'uploaded_file_header' => $dataMapFields['Payment name'] ?? "",
								'value' => $item['Payment name'],
								'description' => 'invalid_payment_name'
							]
						]
					];

					unset($arr_data[$row]);
					continue;
				}

				$recurring_type = $check_valid_recurring['repeat_type']['name_option'] ?? "";
				if (empty($recurring_type)) {
					$arr_skipped[] = [
						'header' => [
							'row' => $row,
							'error' => 1,
							'username' => $item['Username']
						],
						'table_error' => [
							[
								'field' => 'Payment name',
								'uploaded_file_header' => $dataMapFields['Payment name'] ?? "",
								'value' => $item['Payment name'],
								'description' => 'invalid_payment_repeat_type'
							]
						]
					];

					unset($arr_data[$row]);
					continue;
				}

				$recurring_valid_from = $check_valid_recurring['valid_from'];
				$recurring_valid_to = $check_valid_recurring['valid_to'] == '0000-00-00' ? "" : $check_valid_recurring['valid_to'];
				$skip_count = 0;
				$skip_error = [];
				if (strtotime($item['Valid from_date']) < strtotime($recurring_valid_from)) {
					$skip_count++;
					$skip_error[] = [
						'field' => 'Valid from',
						'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
						'value' => $item['Valid from'],
						'description' => 'recurring_error_date_range'
					];
				}
				if (!empty($recurring_valid_to) && !empty($item['Valid to_date']) && strtotime($recurring_valid_to) < strtotime($item['Valid to_date'])) {
					$skip_count++;
					$skip_error[] = [
						'field' => 'Valid to',
						'uploaded_file_header' => $dataMapFields['Valid to'] ?? "",
						'value' => $item['Valid to'],
						'description' => 'recurring_error_date_range'
					];
				}

				if ($skip_count > 0) {
					$skip_header = [
						'row' => $item['row'],
						'error' => $skip_count,
						'username' => $item['Username']
					];
					$arr_skipped[] = [
						'header' => $skip_header,
						'table_error' => $skip_error
					];

					unset($arr_data[$row]);
					continue;
				}

				if ($recurring_type == 'week') {
					$skip_count = 0;
					$skip_error = [];
					$week = date('W', strtotime($item['Valid from_date']));
					$year = date('Y', strtotime($item['Valid from_date']));
					$newDate = new \DateTime();
					$newDate->setISODate($year, $week);
					$date_first_of_week = $newDate->format("Y-m-d");

					$week = date('W', strtotime($item['Valid to_date']));
					$year = date('Y', strtotime($item['Valid to_date']));
					$newDate = new \DateTime();
					$newDate->setISODate($year, $week);
					$date_lat_of_week = $newDate->format("Y-m-d");
					$date_lat_of_week = date('Y-m-d', strtotime($date_lat_of_week . "+6 days"));
					if (strtotime($date_first_of_week) != strtotime($item['Valid from_date'])) {
						$skip_count++;
						$skip_error[] = [
							'field' => 'Valid from',
							'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
							'value' => $item['Valid from'],
							'description' => 'recurring_error_week_start'
						];
					}
					if (strtotime($date_lat_of_week) != strtotime($item['Valid to_date'])) {
						$skip_count++;
						$skip_error[] = [
							'field' => 'Valid to',
							'uploaded_file_header' => $dataMapFields['Valid to'] ?? "",
							'value' => $item['Valid to'],
							'description' => 'recurring_error_week_end'
						];
					}
					if ($skip_count > 0) {
						$skip_header = [
							'row' => $item['row'],
							'error' => $skip_count,
							'username' => $item['Username']
						];
						$arr_skipped[] = [
							'header' => $skip_header,
							'table_error' => $skip_error
						];

						unset($arr_data[$row]);
						continue;
					}
				}

				if ($recurring_type == 'month') {
					$skip_count = 0;
					$skip_error = [];
					$date_first_of_month = date('Y-m-01', strtotime($item['Valid from_date']));
					$date_lat_of_month = date('Y-m-t', strtotime($item['Valid to_date']));
					if (strtotime($date_first_of_month) != strtotime($item['Valid from_date'])) {
						$skip_count++;
						$skip_error[] = [
							'field' => 'Valid from',
							'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
							'value' => $item['Valid from'],
							'description' => 'recurring_error_month_start'
						];
					}
					if (strtotime($date_lat_of_month) != strtotime($item['Valid to_date'])) {
						$skip_count++;
						$skip_error[] = [
							'field' => 'Valid to',
							'uploaded_file_header' => $dataMapFields['Valid to'] ?? "",
							'value' => $item['Valid to'],
							'description' => 'recurring_error_month_end'
						];
					}
					if ($skip_count > 0) {
						$skip_header = [
							'row' => $item['row'],
							'error' => $skip_count,
							'username' => $item['Username']
						];
						$arr_skipped[] = [
							'header' => $skip_header,
							'table_error' => $skip_error
						];

						unset($arr_data[$row]);
						continue;
					}
				}

				if ($recurring_type == 'year') {
					$skip_count = 0;
					$skip_error = [];
					$date_first_of_year = date('Y-01-01', strtotime($item['Valid from_date']));
					$date_lat_of_year = date('Y-12-31', strtotime($item['Valid to_date']));
					if (strtotime($date_first_of_year) != strtotime($item['Valid from_date'])) {
						$skip_count++;
						$skip_error[] = [
							'field' => 'Valid from',
							'uploaded_file_header' => $dataMapFields['Valid from'] ?? "",
							'value' => $item['Valid from'],
							'description' => 'recurring_error_year_start'
						];
					}
					if (strtotime($date_lat_of_year) != strtotime($item['Valid to_date'])) {
						$skip_count++;
						$skip_error[] = [
							'field' => 'Valid to',
							'uploaded_file_header' => $dataMapFields['Valid to'] ?? "",
							'value' => $item['Valid to'],
							'description' => 'recurring_error_year_end'
						];
					}
					if ($skip_count > 0) {
						$skip_header = [
							'row' => $item['row'],
							'error' => $skip_count,
							'username' => $item['Username']
						];
						$arr_skipped[] = [
							'header' => $skip_header,
							'table_error' => $skip_error
						];

						unset($arr_data[$row]);
						continue;
					}
				}

				$recurring_id = $check_valid_recurring['id'];
				$arr_data[$row]['recurring_id'] = $recurring_id;
				$modules->setModule("employee_recurring");
				$model = $modules->model;
				$recurring_check_dup = $model->where('recurring', $recurring_id)->where('employee', $employee_id)->first();
				if ($recurring_check_dup) {
					$arr_duplicated_[$item['Username'] . " - " . $item['Payment name']]['db_' . $recurring_check_dup->id] = [
						'type' => 'db',
						'amount' => "Payment name: " . $item['Payment name'],
						'date' => "Date: " . date('d/m/Y', strtotime($recurring_check_dup->valid_from)) . " - " . date('d/m/Y', strtotime($recurring_check_dup->valid_to))
					];

					$arr_duplicated_[$item['Username'] . " - " . $item['Payment name']][$row] = [
						'type' => 'excel',
						'amount' => "Payment name: " . $item['Payment name'],
						'date' => "Date: " . $item['Valid from'] . " - " . $item['Valid to']
					];

					continue;
				}

				$arr_created[] = [
					'key' => $row,
					'row' => $row,
					'username' => $item['Username'],
					'amount' => $item['Payment name'],
					'valid_from' => $item['Valid from'],
					'valid_to' => $item['Valid to']
				];
			}
		}

		foreach ($arr_duplicated_ as $username => $item_username) {
			$arr = [
				'title' => "Username",
				'value' => $username,
				'table' => []
			];
			foreach ($item_username as $row => $item) {
				$arr['table'][] = [
					'type' => $item['type'],
					'row' => $row,
					'amount' => $item['amount'],
					'date' => $item['date']
				];
			}

			$arr_duplicated[] = $arr;
		}


		$result['record_created'] = count($arr_created);
		$result['created'] = $arr_created;
		$result['record_duplicated'] = count($arr_duplicated);
		$result['duplicated'] = $arr_duplicated;
		$result['record_skipped'] = count($arr_skipped);
		$result['skipped'] = $arr_skipped;
		$result['arr_data'] = $arr_data;

		return json_encode($result);
	}

	public function import_post()
	{
		$modules = \Config\Services::modules();
		$data = $this->request->getPost();
		if ($data['record_created'] == 0 && $data['record_duplicated'] == 0) {
			return $this->failNotFound(NOT_FOUND);
		}

		$data_created = $data['data_created'];
		$record_duplicated = $data['record_duplicated'];
		$data_duplicated = $data['data_duplicated'];
		$arr_data = $data['arr_data'];
		$import_type = $data['import_type'];
		$arr_data_insert = [];

		if (!empty($data_created)) {
			foreach ($data_created as $item) {
				if (isset($item['row'])) {
					$arr_data_insert[$item['row']] = $arr_data[$item['row']];
				}
			}
		}

		// duplicate
		$arr_data_update = [];
		if ($record_duplicated > 0) {
			for ($i = 0; $i < $record_duplicated; $i++) {
				$row = $data['duplicated_' . $i];
				if (strpos($row, "db") === false) {
					$arr_data_update[$row] = $arr_data[$row];
					$arr_data_update[$row]['id_db'] = isset($data_duplicated[$i]['table'][0]['row']) ? explode("_", $data_duplicated[$i]['table'][0]['row'])[1] : 0;
				}
			}
		}

		if ($import_type == 'salary') {
			$allowedFields = ["salary", "employee", "date_from", "date_to", "owner", "created_by", "updated_by"];
			$data_insert = [];
			foreach ($arr_data_insert as $item) {
				$data_insert[] = [
					'salary' => $item['Amount'],
					'employee' => $item['employee_id'],
					'date_from' => $item['Valid from_date'],
					'date_to' => $item['Valid to_date'],
					'owner' => user_id(),
					'created_by' => user_id()
				];
			}

			$data_update = [];
			foreach ($arr_data_update as $item) {
				$data_update[] = [
					'id' => $item['id_db'],
					'salary' => $item['Amount'],
					'date_from' => $item['Valid from_date'],
					'date_to' => $item['Valid to_date'],
					'updated_by' => user_id()
				];
			}

			$modules->setModule("employee_salary");
		} else {
			$allowedFields = ["recurring", "employee", "valid_from", "valid_to", "owner", "created_by", "updated_by"];
			$data_insert = [];
			foreach ($arr_data_insert as $item) {
				$data_insert[] = [
					'recurring' => $item['recurring_id'],
					'employee' => $item['employee_id'],
					'valid_from' => $item['Valid from_date'],
					'valid_to' => $item['Valid to_date'],
					'owner' => user_id(),
					'created_by' => user_id()
				];
			}

			$data_update = [];
			foreach ($arr_data_update as $item) {
				$data_update[] = [
					'id' => $item['id_db'],
					'recurring' => $item['recurring_id'],
					'valid_from' => $item['Valid from_date'],
					'valid_to' => $item['Valid to_date'],
					'updated_by' => user_id()
				];
			}

			$modules->setModule("employee_recurring");
		}
		$model = $modules->model;
		try {
			$model->setAllowedFields($allowedFields);
			if (!empty($data_insert)) {
				$model->insertBatch($data_insert);
			}
			if (!empty($data_update)) {
				$model->updateBatch($data_update, 'id');
			}
		} catch (\ReflectionException $e) {
			return $this->fail(FAILED_SAVE);
		}

		return $this->respond(ACTION_SUCCESS);
	}
}