<?php

namespace HRM\Modules\Reports\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class TimeOffBalance extends ErpController
{
    public function load_time_off_balance_get()
    {
        $modules = \Config\Services::modules();
        $filter = $this->request->getGet();

        $listTimeOffBalance = $this->_getListTimeOffBalance($modules, $filter);

        return $this->respond([
            'results' => $listTimeOffBalance
        ]);
    }

    public function export_time_off_balance_get()
    {
        $modules = \Config\Services::modules();
        $filter = $this->request->getGet();

        $listTimeOffBalance = $this->_getListTimeOffBalance($modules, $filter);

        $arrAlphabet = [];
		foreach (range('A', 'H') as $columnId) {
			$arrAlphabet[] = $columnId;
		}

        $spreadsheet = new Spreadsheet();
		$sheet = $spreadsheet->getActiveSheet();

        $row = 1;
        $sheet->setCellValue("A$row", "Employee Name");
		$sheet->setCellValue("B$row", "Department");
		$sheet->setCellValue("C$row", "Office");
		$sheet->setCellValue("D$row", "Type");
		$sheet->setCellValue("E$row", "Entitlement");
		$sheet->setCellValue("F$row", "Carry Over");
		$sheet->setCellValue("G$row", "Requested");
		$sheet->setCellValue("H$row", "Balance");

        $row += 1;
        foreach ($listTimeOffBalance as $rowTimeOffBalance) {
            $sheet->setCellValue("A$row", $rowTimeOffBalance['full_name']);
			$sheet->setCellValue("B$row", $rowTimeOffBalance['department_name']);
			$sheet->setCellValue("C$row", $rowTimeOffBalance['office_name'] ?? "-");
			$sheet->setCellValue("D$row", $rowTimeOffBalance['type_name'] ?? "-");
			$sheet->setCellValue("E$row", $rowTimeOffBalance['entitlement'] ?? 0);
			$sheet->setCellValue("F$row", $rowTimeOffBalance['carryover'] ?? 0);
			$sheet->setCellValue("G$row", $rowTimeOffBalance['requested'] ?? 0);
			$sheet->setCellValue("H$row", $rowTimeOffBalance['balance'] ?? 0);

            $row++;
        }

        foreach ($arrAlphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

        $writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		$writer->save('php://output');

		exit;
    }

    // ** support function 
    private function _getListTimeOffBalance($modules, $filter)
    {
        $modules->setModule('time_off_balances');
        $model = $modules->model;

        $type = isset($filter['type']) ? $filter['type'] : "";
        $departmentId = isset($filter['department_id']) ? $filter['department_id'] : "";
        $office = isset($filter['office']) ? $filter['office'] : "";
        $employeeStatus = isset($filter['employeeStatus']) ? $filter['employeeStatus'] : "";


        $builderTimeOffBalance = $model
            ->asArray()
            ->select([
                'm_time_off_balances.id',
                'm_time_off_balances.entitlement',
                'm_time_off_balances.carryover',
                'm_time_off_balances.requested',
                'm_time_off_balances.balance',
                'm_time_off_types.name as type_name',
                'm_employees.full_name',
                'm_employees.avatar',
                'departments.name AS department_name',
                'offices.name AS office_name'
            ])
            ->join('m_time_off_types', 'm_time_off_types.id = m_time_off_balances.type', 'inner')
            ->join('m_employees', 'm_employees.id = m_time_off_balances.employee', 'inner')
            ->join('departments', 'departments.id = m_employees.department_id', 'inner')
            ->join('offices', 'offices.id = m_employees.office', 'inner');

        if (!empty($type) && $type != 'null') {
            $builderTimeOffBalance->where('m_time_off_types.id', $type);
        }
        if (!empty($departmentId) && $departmentId != 'null') {
            $builderTimeOffBalance->where('m_employees.department_id', $departmentId);
        }
        if (!empty($office) && $office != 'null') {
            $builderTimeOffBalance->where('m_employees.office', $office);
        }
        if (!empty($employeeStatus) && $employeeStatus != 'null') {
            $builderTimeOffBalance->where('m_employees.status', $employeeStatus);
        }
        return  handleDataBeforeReturn($modules, $builderTimeOffBalance->orderBy('m_employees.id', 'DESC')->findAll(), true);
    }
}
