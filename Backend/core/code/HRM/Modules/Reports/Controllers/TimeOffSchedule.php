<?php

namespace HRM\Modules\Reports\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use HRM\Modules\Employees\Models\EmployeesModel;
use DateTime;

class TimeOffSchedule extends ErpController
{
    public function load_time_off_schedule_get()
    {
        $modules = \Config\Services::modules('employees');
        $params = $this->request->getGet();

        return $this->respond([
            'results' => $this->_getTimeOffSchedule($modules, $params)
        ]);
    }

    public function export_time_off_schedule_get()
    {
        $modules = \Config\Services::modules('employees');
        $params = $this->request->getGet();

        $listTimeOffSchedule = $this->_getTimeOffSchedule($modules, $params);

        $arrAlphabet = [];
        foreach (range('A', 'J') as $columnId) {
            $arrAlphabet[] = $columnId;
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $row = 1;
        $sheet->setCellValue("A$row", "Employee Name");
        $sheet->setCellValue("B$row", "Email Address");
        $sheet->setCellValue("C$row", "Job Title");
        $sheet->setCellValue("D$row", "From");
        $sheet->setCellValue("E$row", "To");
        $sheet->setCellValue("F$row", "Type");
        $sheet->setCellValue("G$row", "Status");
        $sheet->setCellValue("H$row", "Note");
        $sheet->setCellValue("I$row", "Employee Status");
        $sheet->setCellValue("J$row", "Employment Type");

        $row += 1;
        foreach ($listTimeOffSchedule as $rowTimeOffSchedule) {
            $sheet->setCellValue("A$row", $rowTimeOffSchedule['full_name'] ?? '-');
            $sheet->setCellValue("B$row", $rowTimeOffSchedule['email'] ?? '-');
            $sheet->setCellValue("C$row", $rowTimeOffSchedule['job_title_name'] ?? '-');
            $sheet->setCellValue("D$row", $rowTimeOffSchedule['date_from'] ?? '-');
            $sheet->setCellValue("E$row", $rowTimeOffSchedule['date_to'] ?? '-');
            $sheet->setCellValue("F$row", $rowTimeOffSchedule['type_name'] ?? '-');
            $sheet->setCellValue("G$row", $rowTimeOffSchedule['time_off_request_status']['name_option'] ?? '-');
            $sheet->setCellValue("H$row", $rowTimeOffSchedule['note'] ?? '-');
            $sheet->setCellValue("I$row", $rowTimeOffSchedule['status']['name_option'] ?? '-');
            $sheet->setCellValue("J$row", $rowTimeOffSchedule['employee_type_name'] ?? '-');

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
    private function _getTimeOffSchedule($modules, $filter)
    {
        helper('app_select_option');
        $modelEmployee = new EmployeesModel();

        $fromDate = $filter['from_date'];
        $toDate = $filter['to_date'];
        $type = $filter['type'];
        $status = $filter['status'];
        $employeeStatus = $filter['employee_status'];
        $EmployeeType = $filter['employee_type'];
        $department = $filter['department_id'];
        $jobTitleId = $filter['job_title_id'];

        if (strtotime($fromDate) > strtotime($toDate)) {
            return [];
        }

        $builder = $modelEmployee
            ->asArray()
            ->exceptResigned()
            ->select([
                'm_employees.id',
                'm_employees.full_name',
                'm_employees.username',
                'm_employees.email',
                'm_employees.avatar',
                'm_employees.status',
                'm_time_off_types.name as type_name',
                'job_titles.name as job_title_name',
                'm_time_off_requests.note',
                'm_time_off_requests.date_from',
                'm_time_off_requests.date_to',
                'm_time_off_requests.status as time_off_request_status',
                'm_employee_types.name as employee_type_name'
            ])
            ->join('m_time_off_requests', 'm_time_off_requests.owner = m_employees.id', 'inner')
            ->join('departments', 'departments.id = m_employees.department_id')
            ->join('job_titles', 'job_titles.id = m_employees.job_title_id', 'left')
            ->join('m_employee_types', 'm_employee_types.id = m_employees.employee_type', 'left')
            ->join('m_time_off_types', 'm_time_off_types.id = m_time_off_requests.type', 'inner')
            ->where('m_time_off_requests.date_from <=', $toDate)
            ->where('m_time_off_requests.date_to >=', $fromDate);

        if (!empty($type) && $type != 'null') {
            $builder->where('m_time_off_requests.type', $type);
        }

        if (!empty($status) && $status != 'null') {
            $builder->where('m_time_off_requests.status', $status);
        }

        if (!empty($department) && $department != 'null') {
            $builder->where('m_employees.department_id', $department);
        }

        if (!empty($EmployeeType) && $EmployeeType != 'null') {
            $builder->where('m_employees.employee_type', $EmployeeType);
        }

        if (!empty($employeeStatus) && $employeeStatus != 'null') {
            $builder->where('m_employees.status', $employeeStatus);
        }

        if (!empty($jobTitleId) && $jobTitleId != 'null') {
            $builder->where('m_employees.job_title_id', $jobTitleId);
        }

        $listQuery = $builder->findAll();
        $list = handleDataBeforeReturn($modules, $listQuery, true);


        foreach ($list as $key => $row) {
            $list[$key]['time_off_request_status'] = getOptionByValue('time_off_requests', 'status', $row['time_off_request_status']);
            $list[$key]['date_from'] = date('d M Y', strtotime($row['date_from']));
            $list[$key]['date_to'] = date('d M Y', strtotime($row['date_to']));
        }

        return $list;
    }
}
