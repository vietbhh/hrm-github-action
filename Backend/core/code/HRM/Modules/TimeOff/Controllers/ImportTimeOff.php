<?php

namespace HRM\Modules\Timeoff\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Employees\Models\EmployeesModel;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ImportTimeOff extends ErpController
{
    public function get_sample_file_import_get()
    {
        $getData = $this->request->getGet();
        $type =  $getData['type'];
        if (empty($type)) {
            return $this->failValidationErrors([]);
        }

        $arrAlphabet = range('A', 'Z');

        $arrCol = $this->_getImportFields($type);
        if ($type == 'set_new_balance') {
            $defaultData = [
                [
                    'john1511@gmail.com',
                    'Annual',
                    '12',
                    ''
                ],
                [
                    'jane0108@gmail.com',
                    'Annual',
                    '14',
                    ''
                ]
            ];
        } else if ($type == 'adjust_existing_balance') {
            $defaultData = [
                [
                    'john1511@gmail.com',
                    'Annual',
                    '3',
                    '25/06/2022',
                    ''
                ],
                [
                    'jane0108@gmail.com',
                    'Annual',
                    '-2.5',
                    '23/06/2022',
                    ''
                ]
            ];
        }

        $pathTemplate = COREPATH . 'assets/template/TimeOff_Template.xlsx';
        $reader = new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
        $reader->setLoadSheetsOnly(["Instruction"]);
        $spreadsheet = $reader->load($pathTemplate);
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

        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle("Template");

        // header
        $row = 1;
        foreach ($arrCol as $keyCol => $rowCol) {
            $sheet->getStyle($arrAlphabet[$keyCol] . $row)->applyFromArray($styleArray);
            $sheet->setCellValue($arrAlphabet[$keyCol] . $row, $rowCol['name']);
        }

        // body
        $row += 1;
        $sheet = $spreadsheet->setActiveSheetIndex(1);
        for ($i = 0; $i < count($defaultData); $i++) {
            foreach ($arrCol as $keyCol => $rowCol) {
                $value = isset($defaultData[$i][$keyCol]) ? $defaultData[$i][$keyCol] : '';
                $sheet->setCellValue($arrAlphabet[$keyCol] . $row, $value);
            }
            $row += 1;
        }

        foreach ($arrAlphabet as $row) {
            $sheet->getColumnDimension($row)->setAutoSize(true);
        }

        // export excel
        $writer = new Xlsx($spreadsheet);
        $name = "time_off_Balance_Template" . date("Ymd") . "_" . rand() . ".xlsx";
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . urlencode($name) . '"');
        $writer->save('php://output');

        exit();
    }

    public function get_fields_import_post()
    {
        $postData = $this->request->getPost();
        $type =  $postData['type'];
        $arrHeader = $postData['file_content']['header'];
        if (empty($type) || empty($arrHeader)) {
            return $this->failValidationErrors([]);
        }


        $arrCol = $this->_getImportFields($type);
        foreach ($arrCol as $keyCol => $rowCol) {
            $arrCol[$keyCol]['header'] = isset($arrHeader[$keyCol]) ? $arrHeader[$keyCol] : '';
        }

        $arrFieldSelect = [];
        foreach ($arrHeader as $keyHeader => $rowHeader) {
            $arrFieldSelect[] = [
                'name' => $rowHeader,
                'header' => $rowHeader
            ];
        }

        $result = [
            'arr_col' =>  $arrCol,
            'arr_field_select' => $arrFieldSelect
        ];
        return $this->respond($result);
    }

    public function get_import_data_post()
    {
        $modules = \Config\Services::modules();
        $postData = $this->request->getPost();

        $listField = $postData['list_field'];
        $header = $postData['file_upload_content']['header'];
        $body = $postData['file_upload_content']['body'];

        $recordReadyToCreate = [];
        $recordDuplicate = [];
        $recordSkip = [];
        $unMappedField = [];

        // get employee email
        $employeeModel = new EmployeesModel();
        $listEmployeeEmail = $employeeModel->asArray()->select(['email'])->exceptResigned()->findAll();
        $listEmployeeEmail = array_column($listEmployeeEmail, 'email');

        // get timeoff type
        $modules->setModule('time_off_types');
        $model = $modules->model;
        $listType = $model->asArray()->select(['name'])->findAll();
        $listType = array_column($listType, 'name');

        // get timeoff balance
        $modules->setModule('time_off_balances');
        $model = $modules->model;
        $listBalance = $model->asArray()
            ->select([
                'm_employees.email AS employee_email',
                'm_time_off_types.name as type_name',
            ])
            ->join('m_employees', 'm_employees.id = m_time_off_balances.employee', 'inner')
            ->join('m_time_off_types', 'm_time_off_types.id = m_time_off_balances.type', 'inner')
            ->findAll();

        // get unmapped field
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
            $allowPush = true;
            $dataPush = $row;
            $dataPush['key'] = $key;
            foreach ($header as $keyHeader => $rowHeader) {
                if (!isset($listField[$keyHeader])) {
                    continue;
                }
                $fieldInfo = $listField[$keyHeader];

                // get skip record
                if (
                    !isset($row[$fieldInfo['header']])
                    || ($fieldInfo['required'] == true && $this->_isEmptyString($row[$fieldInfo['header']]))
                ) {
                    $arrError = $fieldInfo;
                    if (!isset($recordSkip[$key])) {
                        $recordSkip[$key] = [
                            'email' => $row[$listField[0]['header']],
                            'arr_error' => []
                        ];
                    }

                    $arrError['value'] = "";
                    $arrError['error'] = 'required_field';
                    $recordSkip[$key]['arr_error'][] = $arrError;
                    $allowPush = false;
                    continue;
                }

                if ($fieldInfo['field'] == 'employee') {
                    $employeeEmail = isset($row[$fieldInfo['header']]) ? trim($row[$fieldInfo['header']]) : '';
                    $arrError = $fieldInfo;
                    if (!in_array($employeeEmail, $listEmployeeEmail)) {
                        $arrError['value'] = $employeeEmail;
                        $arrError['error'] = 'email_not_exist';
                        if (!isset($recordSkip[$key])) {
                            $recordSkip[$key] = [
                                'email' => $row[$listField[0]['header']],
                                'arr_error' => []
                            ];
                        }
                        $recordSkip[$key]['arr_error'][] = $arrError;
                        $allowPush = false;
                        continue;
                    } else {
                        $type = $row[$listField[1]['header']];
                        $checkPushSkip = true;
                        foreach ($listBalance as  $rowBalance) {
                            if ($rowBalance['employee_email'] == $employeeEmail && $rowBalance['type_name'] == $type) {
                                $checkPushSkip = false;
                                break;
                            }
                        }

                        if ($checkPushSkip) {
                            $arrError['value'] = $type;
                            $arrError['error'] = 'employee_does_not_have_type';
                            if (!isset($recordSkip[$key])) {
                                $recordSkip[$key] = [
                                    'email' => $row[$listField[0]['header']],
                                    'arr_error' => []
                                ];
                            }
                            $recordSkip[$key]['arr_error'][] = $arrError;
                            $allowPush = false;
                            continue;
                        }
                    }
                }

                if ($fieldInfo['field'] == 'type') {
                    $timeoffType = isset($row[$fieldInfo['header']]) ? trim($row[$fieldInfo['header']]) : '';
                    if (!in_array($timeoffType, $listType)) {
                        $arrError = $fieldInfo;
                        $arrError['value'] = $timeoffType;
                        $arrError['error'] = 'time_off_type_not_exist';
                        if (!isset($recordSkip[$key])) {
                            $recordSkip[$key] = [
                                'email' => $row[$listField[0]['name']],
                                'arr_error' => []
                            ];
                        }
                        $recordSkip[$key]['arr_error'][] = $arrError;
                        $allowPush = false;
                        continue;
                    }
                }
            }

            if ($allowPush) {
                // get duplicate record
                foreach ($body as $keyBody => $rowBody) {
                    if (
                        ($row[$listField[0]['name']] == $rowBody[$listField[0]['name']]
                            && $row[$listField[1]['name']] == $rowBody[$listField[1]['name']])
                        && $key != $keyBody
                    ) {
                        $keyDuplicate = $row[$listField[0]['name']] . ' - ' . $row[$listField[1]['name']];
                        if (!isset($recordDuplicate[$keyDuplicate])) {
                            $recordDuplicate[$keyDuplicate] = [
                                'email' => $row[$listField[0]['name']],
                                'type' => $row[$listField[1]['name']],
                                'duplicate_data' => []
                            ];
                        }
                        $dataDuplicatePush = $rowBody;
                        $dataDuplicatePush['key'] = $keyBody;
                        $dataDuplicatePush['row'] = $keyBody + 2;
                        $dataPush['duplicate'] = true;
                        $dataPush['chosen'] = false;
                        $dataPush['key_duplicate'] = array_search($keyDuplicate, array_keys($recordDuplicate));
                        $recordDuplicate[$keyDuplicate]['duplicate_data'][] = $dataDuplicatePush;
                    }
                }

                $recordReadyToCreate[] = $dataPush;
            }
        }

        $result = [
            'record_ready_to_create' => $recordReadyToCreate,
            'record_duplicate' => array_values($recordDuplicate),
            'record_skip' => $recordSkip,
            'unmapped_field' => $unMappedField
        ];

        return $this->respond($result);
    }

    public function import_time_off_post()
    {
        helper('app_select_option');
        $modules = \Config\Services::modules();
        $postData = $this->request->getPost();
        $importType = $postData['import_type'];
        $importData = $postData['import_data'];

        $listFieldImport = $postData['list_field_import'];
        $employeeEmailField = $listFieldImport[0]['header'];
        $typeNameField = $listFieldImport[1]['header'];
        $balanceField = $listFieldImport[2]['header'];
        if ($importType == 'adjust_existing_balance') {
            $dateField = $listFieldImport[3]['header'];
        }
        $userId = user_id();

        $modules->setModule('time_off_balances');
        $model = $modules->model;
        $listBalance = $model->asArray()
            ->select([
                'm_time_off_balances.id AS balance_id',
                'm_time_off_balances.balance AS balance',
                'm_employees.id AS employee_id',
                'm_employees.email AS employee_email',
                'm_time_off_types.id as type_id',
                'm_time_off_types.name as type_name',
            ])
            ->join('m_employees', 'm_employees.id = m_time_off_balances.employee', 'inner')
            ->join('m_time_off_types', 'm_time_off_types.id = m_time_off_balances.type', 'inner')
            ->findAll();

        // insert timeoff balance event
        $modules->setModule('time_off_balance_events');
        $model = $modules->model;

        $arrDataUpdateTimeOffBalance = [];
        foreach ($importData as $row) {
            if ($row) {
                $typeId = 0;
                $timeOffBalance = 0;
                $employeeId = 0;
                $balanceId = 0;
                foreach ($listBalance as $rowBalance) {
                    if (
                        $rowBalance['employee_email'] == $row[$employeeEmailField]
                        && $rowBalance['type_name'] == $row[$typeNameField]
                    ) {
                        $balanceId =  $rowBalance['balance_id'];
                        $typeId =  $rowBalance['type_id'];
                        $timeOffBalance =  $rowBalance['balance'];
                        $employeeId =  $rowBalance['employee_id'];
                        break;
                    }
                }

                if (empty($balanceId)) {
                    continue;
                }

                $balance = $row[$balanceField];
                $newBalance = 0;
                $dataInsertTimeOffEvent = [
                    'event' => getOptionValue('time_off_balance_events', 'event', 'import'),
                    'employee' => $employeeId,
                    'type' => $typeId,
                    'changed_by' => $userId
                ];

                $allowInsert = true;
                if ($importType == 'set_new_balance') {
                    $date = date('Y-m-d');
                    if ($balance == $timeOffBalance) {
                        $allowInsert = false;
                    } else {
                        $change = $balance - $timeOffBalance;
                        $newBalance = $balance;
                    }
                } else if ($importType == 'adjust_existing_balance') {
                    $date = date('Y-m-d', strtotime($row[$dateField]));
                    $change = $balance;
                    $newBalance = $timeOffBalance + $balance;
                }

                if ($allowInsert) {
                    $dataInsertTimeOffEvent['date'] = $date;
                    $dataInsertTimeOffEvent['change'] = $change;

                    $model->setAllowedFields(array_keys($dataInsertTimeOffEvent));
                    $model->save($dataInsertTimeOffEvent);

                    $arrDataUpdateTimeOffBalance[] = [
                        'id' => $balanceId,
                        'balance' => $newBalance
                    ];
                }
            }
        }

        if (count($arrDataUpdateTimeOffBalance) > 0) {
            $modules->setModule('time_off_balances');
            $model = $modules->model;

            foreach ($arrDataUpdateTimeOffBalance as $key => $row) {
                $model->setAllowedFields(array_keys($row));
                $model->save($row);
            }
        }

        return $this->respond(ACTION_SUCCESS);
    }

    // ** support function
    private function _getImportFields($type)
    {
        if ($type == 'set_new_balance') {
            return [
                [
                    'field' => 'employee',
                    'name' => 'Employee email',
                    'type' => 'Dropdown',
                    'required' => true
                ],
                [
                    'field' => 'type',
                    'name' => 'Time Off Type',
                    'type' => 'Dropdown',
                    'required' => true
                ],
                [
                    'field' => 'balance',
                    'name' => 'New Balance (days)',
                    'type' => 'Number',
                    'required' => true
                ]
            ];
        } else if ($type == 'adjust_existing_balance') {
            return [
                [
                    'field' => 'employee',
                    'name' => 'Employee email',
                    'type' => 'Dropdown',
                    'required' => true
                ],
                [
                    'field' => 'type',
                    'name' => 'Time Off Type',
                    'type' => 'Dropdown',
                    'required' => true
                ],
                [
                    'field' => 'adjust_amount',
                    'name' => 'Adjustment Amount (days)',
                    'type' => 'Date',
                    'required' => true
                ],
                [
                    'field' => 'effective_date',
                    'name' => 'Effective Date',
                    'type' => 'Number',
                    'required' => true
                ]
            ];
        }
    }

    private function _isEmptyString($str)
    {
        if (empty($str) || strlen(trim($str)) == 0) {
            return true;
        }

        return false;
    }
}
