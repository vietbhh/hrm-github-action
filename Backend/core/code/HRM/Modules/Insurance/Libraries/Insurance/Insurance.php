<?php

namespace HRM\Modules\Insurance\Libraries\Insurance;

use Exception;
use HRM\Modules\Employees\Models\EmployeesModel;

class Insurance
{
    public function getInsurance($dataInsurance, $insuranceId, $getPara = [])
    {
        if ($dataInsurance['closed'] == 0) {
            $date_from = $dataInsurance['date_from'];
            $date_to = $dataInsurance['date_to'];
            return $this->getTableInsurance($date_from, $date_to, $getPara);
        } else {
            return $this->handleDataClosed($insuranceId, $getPara);
        }
    }
    public function getTableInsurance($date_from, $date_to, $getPara = [], $getAllData = false)
    {
        $selectEmployees = ['id', 'full_name', 'username', 'avatar', 'work_schedule', 'office'];
        $employeeModel = new EmployeesModel();
        if ($getAllData) {
            $recordsTotal = $employeeModel->exceptResigned()->countAllResults(false);
            $dataEmployee = $employeeModel->exceptResigned()->asArray()->select($selectEmployees)->findAll();
        } else {
            if (!empty($getPara['searchVal'])) {
                $searchVal = $getPara['searchVal'];
                $employeeModel->where("full_name like '%$searchVal%'");
            }

            if (isset($getPara['pagination'])) {
                $page = $getPara['pagination']['current'];
                $length = $getPara['pagination']['pageSize'];
                $start = ($page - 1) * $length;
                $recordsTotal = $employeeModel->exceptResigned()->countAllResults(false);
                $dataEmployee = $employeeModel->exceptResigned()->asArray()->select($selectEmployees)->findAll($length, $start);
            } else {
                $recordsTotal = $employeeModel->exceptResigned()->countAllResults(false);
                $dataEmployee = $employeeModel->exceptResigned()->asArray()->select($selectEmployees)->findAll();
            }
        }

        $data = $this->handleDataNotClosed($date_from, $date_to, $dataEmployee);

        $out['total'] = $recordsTotal;
        $out['data_table'] = $data;

        return $out;
    }

    public function handleDataNotClosed($date_from, $date_to, $dataEmployee)
    {
        helper("app_select_option");
        helper("HRM\Modules\Attendances\Helpers\attendance");
        $modulesContract = \Config\Services::modules("contracts");
        $contractModel = $modulesContract->model;
        $modulesAttendance = \Config\Services::modules("attendance_details");
        $attendanceModel = $modulesAttendance->model;
        $attendanceModule = $modulesAttendance->getModule();
        $begin = new \DateTime($date_from);
        $end = new \DateTime($date_to);
        $listAttendanceDetailAllDate = [];
        for ($i = $end; $i >= $begin; $i->modify('-1 day')) {
            $date = $i->format('Y-m-d');
            $arr['a'] = $date;
            $listAttendanceDetailAllDate[$date] = $arr;
        }
        $data = [];
        foreach ($dataEmployee as $item) {

            $employee_id = $item['id'];
            $data_contract = $contractModel->select(["insurance_salary"])->where("employee", $employee_id)->where("contract_date_start <= '$date_to' and contract_date_end >= '$date_from'")->orderBy('id', 'desc')->first();
            $insurance_salary = 0;
            if ($data_contract) $insurance_salary = $data_contract->insurance_salary;
            $company_pays = 21.5 * $insurance_salary / 100;
            $employee_pays = 10.5 * $insurance_salary / 100;

            // check working day
            $attendanceModel->where("employee", $employee_id);
            $attendanceModel->where("date between '$date_from' and '$date_to'");
            $attendanceModel->groupStart();
            $attendanceModel->orWhere("status", getOptionValue($attendanceModule, "status", "approved"));
            $attendanceModel->orWhere("status", getOptionValue($attendanceModule, "status", "pending"));
            $attendanceModel->groupEnd();
            $data_attendance_db = $attendanceModel->asArray()->findAll();
            $listAttendanceDetailAll = $listAttendanceDetailAllDate;
            foreach ($data_attendance_db as $row) {
                if (isset($row['date'])) {
                    $date = date('Y-m-d', strtotime($row['date']));
                    if (isset($listAttendanceDetailAll[$date])) {
                        $listAttendanceDetailAll[$date] = array_merge($listAttendanceDetailAll[$date], $row);
                    }
                }
            }
            if (empty($item['work_schedule']) || $item['work_schedule'] == '[]') {
                $insurance_status = 0;
            } else {
                $result = getAttendanceDetail($listAttendanceDetailAll, $item, $date_from, $date_to, [], [], [], ['totalWorkingDay', 'totalNonWorkingDay']);
                if (!$result) {
                    $insurance_status = 0;
                } else {
                    if ($result['totalNonWorkingDay'] > 14) {
                        $insurance_status = 0;
                    } else {
                        $insurance_status = 1;
                    }
                }
            }

            $arr = $item;
            $arr['insurance_salary'] = $insurance_salary;
            $arr['company_pays'] = $company_pays;
            $arr['employee_pays'] = $employee_pays;
            $arr['insurance_status'] = $insurance_status;
            $data[] = $arr;
        }

        return $data;
    }

    public function handleDataClosed($insuranceId, $getPara = [], $employeeId = 0)
    {
        $selectData = ['m_employees.id as id', 'm_employees.full_name as full_name', 'm_employees.username as username', 'm_employees.avatar as avatar', 'm_insurance_detail.insurance_salary as insurance_salary', 'm_insurance_detail.employee_pays as employee_pays', 'm_insurance_detail.company_pays as company_pays', 'm_insurance_detail.insurance_status as insurance_status'];
        $modulesInsuranceDetail = \Config\Services::modules("insurance_detail");
        $insuranceDetailModel = $modulesInsuranceDetail->model;
        $insuranceDetailModel->join("m_employees", "m_employees.id = m_insurance_detail.employee")->where('m_employees.status !=', 16)->where("m_insurance_detail.insurance", $insuranceId);
        if (!empty($getPara)) {
            if (!empty($getPara['searchVal'])) {
                $searchVal = $getPara['searchVal'];
                $insuranceDetailModel->where("m_employees.full_name like '%$searchVal%'");
            }
            $page = $getPara['pagination']['current'];
            $length = $getPara['pagination']['pageSize'];
            $start = ($page - 1) * $length;
            $recordsTotal = $insuranceDetailModel->countAllResults(false);
            $data = $insuranceDetailModel->asArray()->select($selectData)->findAll($length, $start);
        } else {
            $recordsTotal = 1;
            $data = $insuranceDetailModel->where("employee", $employeeId)->asArray()->select($selectData)->first();
        }

        $out['total'] = $recordsTotal;
        $out['data_table'] = $data;

        return $out;
    }
}
