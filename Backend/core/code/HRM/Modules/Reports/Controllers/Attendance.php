<?php

namespace HRM\Modules\Reports\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use HRM\Modules\Employees\Models\EmployeesModel;
use DateTime;

class Attendance extends ErpController
{
    public function load_attendance_get()
    {
        $modules = \Config\Services::modules();
        $params = $this->request->getGet();

        return $this->respond([
            'results' => $this->_getListAttendance($modules, $params)
        ]);
    }

    public function export_attendance_get()
    {
        $modules = \Config\Services::modules();
        $params = $this->request->getGet();
        $listAttendance = $this->_getListAttendance($modules, $params);

        $arrAlphabet = [];
        foreach (range('A', 'I') as $columnId) {
            $arrAlphabet[] = $columnId;
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $row = 1;
        $sheet->setCellValue("A$row", "Employee Name");
        $sheet->setCellValue("B$row", "Email Address");
        $sheet->setCellValue("C$row", "Office");
        $sheet->setCellValue("D$row", "Department");
        $sheet->setCellValue("E$row", "Employee Type");
        $sheet->setCellValue("F$row", "Paid Days Off");
        $sheet->setCellValue("G$row", "Unpaid Days Off");
        $sheet->setCellValue("H$row", "Working Days");
        $sheet->setCellValue("I$row", "Actual Working Days");

        $row += 1;
        foreach ($listAttendance as $rowTimeOffBalance) {
            $sheet->setCellValue("A$row", $rowTimeOffBalance['full_name']);
            $sheet->setCellValue("B$row", $rowTimeOffBalance['email']);
            $sheet->setCellValue("C$row", $rowTimeOffBalance['office'] ?? "-");
            $sheet->setCellValue("D$row", $rowTimeOffBalance['department'] ?? "-");
            $sheet->setCellValue("E$row", $rowTimeOffBalance['employee_type'] ?? 0);
            $sheet->setCellValue("F$row", $rowTimeOffBalance['paid_day_off'] ?? 0);
            $sheet->setCellValue("G$row", $rowTimeOffBalance['unpaid_day_off'] ?? 0);
            $sheet->setCellValue("H$row", $rowTimeOffBalance['working_day'] ?? 0);
            $sheet->setCellValue("I$row", ($rowTimeOffBalance['working_day'] - $rowTimeOffBalance['unpaid_day_off']) == 0 ? ($rowTimeOffBalance['working_day'] - $rowTimeOffBalance['unpaid_day_off']) :  0);

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
    private function _getListAttendance($modules, $filter)
    {
        helper('app_select_option');
        $modules->setModule('employees');
        $fromDate = $filter['from_date'];
        $toDate = $filter['to_date'];
        $department = $filter['department_id'];
        $office = $filter['office'];
        $searchText = $filter['search_text'];

        $results = [];

        if (strtotime($fromDate) > strtotime($toDate)) {
            return $results;
        }

        // get list employee
        $modelEmployee = new EmployeesModel();
        $builderEmployee = $modelEmployee
            ->asArray()
            ->exceptResigned()
            ->select([
                'm_employees.id',
                'm_employees.full_name',
                'm_employees.username',
                'm_employees.email',
                'm_employees.avatar',
                'm_work_schedules.id AS work_schedule_id',
                'm_work_schedules.standard_hours',
                'm_work_schedules.monday',
                'm_work_schedules.tuesday',
                'm_work_schedules.wednesday',
                'm_work_schedules.thursday',
                'm_work_schedules.friday',
                'm_work_schedules.saturday',
                'm_work_schedules.sunday',
                'departments.name as department_name',
                'offices.name as office_name',
                'm_employee_types.name as employee_type_name'
            ])
            ->join('m_work_schedules', 'm_work_schedules.id = m_employees.work_schedule', 'inner')
            ->join('departments', 'departments.id = m_employees.department_id', 'left')
            ->join('offices', 'offices.id = m_employees.office', 'left')
            ->join('m_employee_types', 'm_employee_types.id = m_employees.employee_type', 'left');

        if (!empty($department) && $department != 'null') {
            $builderEmployee->where('m_employees.department_id', $department);
        }

        if (!empty($office) && $office != 'null') {
            $builderEmployee->where('office', $office);
        }

        if (!empty($searchText) && strlen(trim($searchText)) != 0) {
            $builderEmployee
                ->groupStart()
                ->like('m_employees.full_name', $searchText, 'both')
                ->orLike('m_employees.username', $searchText, 'both')
                ->orLike('m_employees.email', $searchText, 'both')
                ->groupEnd();
        }

        $listEmployeeQuery = $builderEmployee->findAll();
        $listEmployee = handleDataBeforeReturn($modules, $listEmployeeQuery, true);

        if (count($listEmployee) > 0) {
            $arrIdEmployee = array_column($listEmployee, 'id');
            $arrDate = [
                1 => 'monday',
                2 =>  'tuesday',
                3 => 'wednesday',
                4 => 'thursday',
                5 => 'friday',
                6 => 'saturday',
                0 => 'sunday',
            ];
            foreach ($listEmployee as $key => $row) {
                $begin = new DateTime($fromDate);
                $end   = new DateTime($toDate);
                $results[$row['id']][] = $row;
                $arrayPush = [
                    'id' => $row['id'],
                    'full_name' => $row['full_name'],
                    'email' => $row['email'],
                    'username' => $row['username'],
                    'avatar' => $row['avatar'],
                    'department' => $row['department_name'],
                    'office' => $row['office_name'],
                    'employee_type' => $row['employee_type_name'],
                    'paid_day_off' => 0,
                    'unpaid_day_off' => 0,
                    'working_day' => 0,
                    'time_off' => [],
                    'work_schedule' => []
                ];


                if (!isset($results['id'])) {
                    $results[$row['id']] = $arrayPush;
                }

                // calculate working day
                $parts = explode(':', $row['standard_hours']);
                $standardHour = $parts[0] + floor(($parts[1] / 60) * 100) / 100;
                for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
                    $weekDay = $i->format('w');
                    $infoWorkSchedule = json_decode($row[$arrDate[$weekDay]], true);
                    if (!isset($results[$row['id']]['work_schedule'][$weekDay])) {
                        $results[$row['id']]['work_schedule'][$weekDay] = $infoWorkSchedule;
                    }
                    if ($infoWorkSchedule['working_day'] == 1) {
                        $workingDay = ($infoWorkSchedule['total'] == $standardHour) ? 1 : ($infoWorkSchedule['total'] / $standardHour);
                        $results[$row['id']]['working_day'] += $workingDay;
                    }
                }
            }

            // calculate time off
            $modules->setModule('time_off_requests');
            $modelTimeOffRequest = $modules->model;

            $builderTimeOfRequest = $modelTimeOffRequest
                ->asArray()
                ->select([
                    'm_time_off_requests.id AS time_off_request_id',
                    'm_time_off_requests.total_day AS time_off_total_day',
                    'm_time_off_requests.status AS time_off_status',
                    'm_time_off_requests.date_from',
                    'm_time_off_requests.time_from',
                    'm_time_off_requests.date_to',
                    'm_time_off_requests.time_to',
                    'm_time_off_requests.owner',
                    'm_time_off_types.name as time_off_type_name',
                    'm_time_off_types.paid'
                ])
                ->join('m_time_off_types', 'm_time_off_types.id = m_time_off_requests.type', 'inner')
                ->where('m_time_off_requests.date_from <=', $toDate)
                ->where('m_time_off_requests.date_to >=', $fromDate)
                ->whereIn('m_time_off_requests.owner', $arrIdEmployee);

            $listTimeOffRequest = $builderTimeOfRequest->findAll();
            foreach ($listTimeOffRequest as $rowTimeOffRequest) {
                $employeeId = $rowTimeOffRequest['owner'];
                $dateFromTimeOff = $rowTimeOffRequest['date_from'];
                $dateToTimeOff = $rowTimeOffRequest['date_to'];


                $totalDay = 0;
                if (strtotime($dateFromTimeOff) == strtotime($dateToTimeOff)) {
                    $totalDay = $rowTimeOffRequest['time_off_total_day'];
                    if ($rowTimeOffRequest['paid'] == 1) {
                        $results[$employeeId]['paid_day_off'] += $rowTimeOffRequest['time_off_total_day'];
                    } else {
                        $results[$employeeId]['unpaid_day_off'] += $rowTimeOffRequest['time_off_total_day'];
                    }
                } else {
                    $begin = new DateTime($dateFromTimeOff);
                    $end   = new DateTime($dateToTimeOff);
                    for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
                        $date = $i->format('Y-m-d');
                        if (strtotime($date) < strtotime($fromDate)) {
                            continue;
                        }

                        $totalDay += 1;
                        if ($rowTimeOffRequest['paid'] == 1) {
                            $results[$employeeId]['paid_day_off'] += 1;
                        } else {
                            $results[$employeeId]['unpaid_day_off'] += 1;
                        }

                        if (strtotime($date) > strtotime($toDate)) {
                            break;
                        }
                    }
                }
                $results[$employeeId]['time_off'][] = [
                    'id' => $rowTimeOffRequest['time_off_request_id'],
                    'type_name' => $rowTimeOffRequest['time_off_type_name'],
                    'time_off_total_day' => $totalDay,
                    'status' => getOptionByValue('time_off_requests', 'status', $rowTimeOffRequest['time_off_status']),
                    'date_from' => date('d M Y', strtotime($rowTimeOffRequest['date_from'])),
                    'time_from' => $rowTimeOffRequest['time_from'],
                    'date_to' => date('d M Y', strtotime($rowTimeOffRequest['date_to'])),
                    'time_to' => $rowTimeOffRequest['time_to']
                ];
            }
        }

        return array_values($results);
    }
}
