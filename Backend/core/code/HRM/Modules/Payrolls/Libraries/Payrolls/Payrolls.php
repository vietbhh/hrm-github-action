<?php

namespace HRM\Modules\Payrolls\Libraries\Payrolls;

use HRM\Modules\Payrolls\Config\Cronjob;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;

class Payrolls
{
    public function getTablePayroll($payroll, $type = 'all_type', $searchVal = '', $employeeId = '')
    {
        helper("app_select_option");
        helper("HRM\Modules\Attendances\Helpers\attendance");
        $modules = \Config\Services::modules();
        $modules->setModule("payrolls");
        $payrollModel = $modules->model;
        $data_payroll = $payrollModel->find($payroll);
        $closed = $data_payroll->closed;
        $date_from = $data_payroll->date_from;
        $date_to = $data_payroll->date_to;

        $modules->setModule("pay_cycles");
        $model = $modules->model;
        $setting = $model->asArray()->first();
        $setting = handleDataBeforeReturn($modules, $setting);
        $repeatTypeCycle = $setting['repeat_every_type']['value'] ?? null;
        $cutOffDate = $setting['cut_off_date'] ?? null;

        $cronjobPayroll = new Cronjob();
        $dateCutOff = $cronjobPayroll->_getDateCutOff($repeatTypeCycle, $cutOffDate, $date_to);
        $dateCutOff = !empty($dateCutOff) ? date("d/m/Y", strtotime($dateCutOff)) : "";

        $total_row = 0;
        $data_table = [];
        if ($closed == 0) {
            $result_getOffCycle = $this->getDateOffCycle($modules, $payroll, $date_from, $date_to, $setting);
            $date_from_cycle = $result_getOffCycle['date_from_cycle'];
            $date_to_cycle = $result_getOffCycle['date_to_cycle'];
            $date_from_offset = $result_getOffCycle['date_from_offset'];
            $date_to_offset = $result_getOffCycle['date_to_offset'];
            if (!empty($result_getOffCycle['date_to_new'])) {
                $date_to = $result_getOffCycle['date_to_new'];
            }

            $modules->setModule("employees");
            $employeeModel = $modules->model;
            if (!empty($searchVal)) {
                $employeeModel->where("full_name like '%$searchVal%'");
            }
            if (!empty($employeeId)) {
                $employeeModel->where("id", $employeeId);
            }
            $employeeModel->where("(last_working_date between '$date_from' and '$date_to' or last_working_date > '$date_to' or last_working_date = '' or last_working_date is null or last_working_date = '0000-00-00')");
            $data_employee = $employeeModel->select("id, full_name, avatar, join_date, last_working_date, work_schedule, status, job_title_id, bank_owner, bank_number, bank_name, bank_address, email, office")->asArray()->findAll();
            $arr_id_employee = [0];
            $arr_id_work_schedule = [];
            $arr_employee = [];
            foreach ($data_employee as $item) {
                $total_row++;
                $arr = [
                    'id' => $item['id'],
                    'employee_name' => $item['full_name'],
                    'avatar' => $item['avatar'],
                    'join_date' => $item['join_date'],
                    'last_working_date' => $item['last_working_date'],
                    'status' => $item['status'],
                    'job_title_id' => $item['job_title_id'],
                    'bank_owner' => $item['bank_owner'],
                    'bank_number' => $item['bank_number'],
                    'bank_name' => $item['bank_name'],
                    'bank_address' => $item['bank_address'],
                    'email' => $item['email'],
                    'total_comp' => 0,
                    'is_edit' => false,
                    'salary' => 0,
                    'is_edit_salary' => false,
                    'actual' => 0,
                    'is_edit_actual' => false,
                    'recurring' => 0,
                    'is_edit_recurring' => false,
                    'one_off' => 0,
                    'is_edit_one_off' => false,
                    'offset' => 0,
                    'is_edit_offset' => false,
                    'ot' => 0,
                    'is_edit_ot' => false,
                    'off_cycle' => 0,
                    'is_edit_cycle' => false,
                    'unpaid' => 0,
                    'is_edit_unpaid' => false,
                    'is_salary' => false,
                    'deficit' => 0,
                    'is_edit_deficit' => false
                ];
                $data_table[$item['id']] = $arr;
                $arr_id_employee[] = $item['id'];
                if (!empty($item['work_schedule']) && $item['work_schedule'] != '[]') {
                    $arr_id_work_schedule[$item['work_schedule']] = $item['work_schedule'];
                }
                $arr_employee[$item['id']] = $item;
            }

            // one-off
            $arr_detail_overtime = [];
            $arr_off_cycle_overtime = [];
            $arr_offset_overtime = [];
            $resultOneOff = $this->getOneOff($modules, $payroll, $arr_id_employee)['arr_table'];
            foreach ($resultOneOff as $employee => $item) {
                $data_table[$employee]['one_off'] = $item['one_off'] ?? 0;
                $arr_detail_overtime[$employee] = $item['arr_detail_overtime'] ?? [];
                $arr_off_cycle_overtime[$employee] = $item['arr_detail_off_cycle_overtime'] ?? [];
                $arr_offset_overtime[$employee] = $item['arr_detail_offset_overtime'] ?? [];
            }

            // work schedule
            $workScheduleModel = new WorkScheduleModel();
            $arr_work_schedule = [];
            foreach ($arr_id_work_schedule as $id_work_schedule) {
                $work_schedule = $workScheduleModel->findFormat($id_work_schedule);
                if (!empty($work_schedule)) {
                    $arr_work_schedule[$id_work_schedule] = $work_schedule;
                }
            }

            $arr_amount_per_min = [];
            $arr_amount_overtime_per_min = [];
            $arr_amount_per_min_off_set = [];
            $arr_amount_overtime_per_min_off_set = [];
            $arr_amount_per_min_offcycle = [];
            $arr_amount_overtime_per_min_offcycle = [];

            // salary
            $resultSalary = $this->getSalary($modules, $date_from, $date_to, $arr_id_employee, $arr_employee, $date_from_cycle, $date_to_cycle, $date_from_offset, $date_to_offset, $arr_work_schedule, $setting)['arr_table'];
            foreach ($resultSalary as $employee => $item) {
                $data_table[$employee]['is_salary'] = $item['is_salary'] ?? false;
                $data_table[$employee]['salary'] = $item['salary'];
                $arr_amount_per_min[$employee] = $arr_amount_overtime_per_min[$employee] = $item['amount_per_min'];
                $arr_amount_per_min_off_set[$employee] = $arr_amount_overtime_per_min_off_set[$employee] = $item['amount_per_min_offset'];
                $arr_amount_per_min_offcycle[$employee] = $arr_amount_overtime_per_min_offcycle[$employee] = $item['amount_per_min_off_cycle'];
            }

            // cycle
            $resultPayrollCycle = $this->getPayrollCycle($modules, $date_from, $date_to, $arr_id_employee, $arr_employee, $arr_work_schedule, $arr_amount_per_min, $arr_amount_overtime_per_min, $arr_detail_overtime, true);
            foreach ($resultPayrollCycle as $employee => $item) {
                $data_table[$employee]['recurring'] = $item['recurring'] ?? 0;
                $data_table[$employee]['unpaid'] = $item['unpaid'] ?? 0;
                $data_table[$employee]['deficit'] = $item['deficit'] ?? 0;
                $data_table[$employee]['ot'] = $item['ot'] ?? 0;
            }

            // off cycle
            if (!empty($date_from_cycle) && !empty($date_to_cycle)) {
                $resultPayrollCycle_off = $this->getPayrollCycle($modules, $date_from_cycle, $date_to_cycle, $arr_id_employee, $arr_employee, $arr_work_schedule, $arr_amount_per_min_offcycle, $arr_amount_overtime_per_min_offcycle, $arr_off_cycle_overtime, false);
                foreach ($resultPayrollCycle_off as $employee => $item) {
                    $recurring = $item['recurring'] ?? 0;
                    $unpaid = $item['unpaid'] ?? 0;
                    $deficit = $item['deficit'] ?? 0;
                    $ot = $item['ot'] ?? 0;
                    $data_table[$employee]['off_cycle'] = $recurring + $ot - $unpaid - $deficit;
                }
            }

            // offset
            if (!empty($date_from_offset) && !empty($date_to_offset)) {
                $resultPayrollCycle_offset = $this->getPayrollCycle($modules, $date_from_offset, $date_to_offset, $arr_id_employee, $arr_employee, $arr_work_schedule, $arr_amount_per_min_off_set, $arr_amount_overtime_per_min_off_set, $arr_offset_overtime, false);
                foreach ($resultPayrollCycle_offset as $employee => $item) {
                    $recurring = $item['recurring'] ?? 0;
                    $unpaid = $item['unpaid'] ?? 0;
                    $deficit = $item['deficit'] ?? 0;
                    $ot = $item['ot'] ?? 0;
                    $data_table[$employee]['offset'] = $recurring + $ot - $unpaid - $deficit;
                }
            }
            // offset previous overtime
            $resultOffsetPreviousOvertime = $this->getOffsetCarryOverOfOvertime($modules, $payroll, $arr_id_employee, $arr_amount_overtime_per_min, $arr_offset_overtime)['arr_table'];
            foreach ($resultOffsetPreviousOvertime as $employee => $item) {
                $data_table[$employee]['offset'] += $item['offset_previous_overtime'];
            }

            $data_total = [
                'total_comp' => 0,
                'salary' => 0,
                'actual' => 0,
                'recurring' => 0,
                'one_off' => 0,
                'offset' => 0,
                'ot' => 0,
                'off_cycle' => 0,
                'unpaid' => 0,
                'deficit' => 0
            ];

            foreach ($data_table as $employee => $item) {
                $actual = $item['salary'] - $item['unpaid'] - $item['deficit'];
                $data_table[$employee]['actual'] = $actual;

                $total_comp = $actual + $item['recurring'] + $item['one_off'] + $item['offset'] + $item['ot'] + $item['off_cycle'];
                $data_table[$employee]['total_comp'] = $total_comp;

                $data_total['total_comp'] += $total_comp;
                $data_total['salary'] += $item['salary'];
                $data_total['actual'] += $actual;
                $data_total['recurring'] += $item['recurring'];
                $data_total['one_off'] += $item['one_off'];
                $data_total['offset'] += $item['offset'];
                $data_total['ot'] += $item['ot'];
                $data_total['off_cycle'] += $item['off_cycle'];
                $data_total['unpaid'] += $item['unpaid'];
                $data_total['deficit'] += $item['deficit'];
            }
        } else {
            $modules->setModule("payroll_details");
            $model = $modules->model;
            $model->join("m_employees", "m_employees.id = m_payroll_details.employee");
            $model->where('m_payroll_details.payroll', $payroll);
            if (!empty($searchVal)) {
                $model->where("m_employees.full_name like '%$searchVal%'");
            }
            if (!empty($employeeId)) {
                $model->where("m_employees.id", $employeeId);
            }
            $listDetail = $model->select("
			m_employees.id as employee_id, 
			m_employees.full_name as employee_full_name, 
			m_employees.avatar as employee_avatar, 
			m_employees.join_date as employee_join_date, 
			m_employees.last_working_date as employee_last_working_date, 
			m_employees.status as employee_status, 
			m_employees.job_title_id as employee_job_title_id, 
			m_employees.bank_owner as employee_bank_owner, 
			m_employees.bank_number as employee_bank_number, 
			m_employees.bank_name as employee_bank_name, 
			m_employees.bank_address as employee_bank_address, 
			m_employees.email as employee_email, 
			m_payroll_details.*
			")
                ->orderBy("m_employees.id")->asArray()->findAll();
            foreach ($listDetail as $item) {
                $total_row++;
                $arr = [
                    'id' => $item['employee_id'],
                    'employee_name' => $item['employee_full_name'],
                    'avatar' => $item['employee_avatar'],
                    'join_date' => $item['employee_join_date'],
                    'last_working_date' => $item['employee_last_working_date'],
                    'status' => $item['employee_status'],
                    'job_title_id' => $item['employee_job_title_id'],
                    'bank_owner' => $item['employee_bank_owner'],
                    'bank_number' => $item['employee_bank_number'],
                    'bank_name' => $item['employee_bank_name'],
                    'bank_address' => $item['employee_bank_address'],
                    'email' => $item['employee_email'],
                    'total_comp' => $item['total_comp'] * 1,
                    'is_edit' => false,
                    'salary' => $item['salary'] * 1,
                    'is_edit_salary' => false,
                    'actual' => $item['actual'] * 1,
                    'is_edit_actual' => false,
                    'recurring' => $item['recurring'] * 1,
                    'is_edit_recurring' => false,
                    'one_off' => $item['one_off'] * 1,
                    'is_edit_one_off' => false,
                    'offset' => $item['offset'] * 1,
                    'is_edit_offset' => false,
                    'ot' => $item['ot'] * 1,
                    'is_edit_ot' => false,
                    'off_cycle' => $item['off_cycle'] * 1,
                    'is_edit_cycle' => false,
                    'unpaid' => $item['unpaid'] * 1,
                    'is_edit_unpaid' => false,
                    'is_salary' => !($item['is_salary'] == 0),
                    'deficit' => $item['deficit'] * 1,
                    'is_edit_deficit' => false
                ];
                $data_table[$item['employee_id']] = $arr;
            }

            $data_total = [
                'total_comp' => $data_payroll->total_comp * 1,
                'salary' => $data_payroll->salary * 1,
                'actual' => $data_payroll->actual * 1,
                'recurring' => $data_payroll->recurring * 1,
                'one_off' => $data_payroll->one_off * 1,
                'offset' => $data_payroll->offset * 1,
                'ot' => $data_payroll->ot * 1,
                'off_cycle' => $data_payroll->off_cycle * 1,
                'unpaid' => $data_payroll->unpaid * 1,
                'deficit' => $data_payroll->deficit * 1
            ];
        }

        $out['date_from'] = $date_from;
        $out['date_to'] = $date_to;
        $out['total_row'] = $total_row;
        $out['data_table'] = $data_table;
        $out['data_total'] = $data_total;
        $out['dateCutOff'] = $dateCutOff;
        $out['closed'] = $closed;

        return $out;
    }

    public function getDateOffCycle($modules, $payroll_id, $date_from, $date_to, $setting)
    {
        $date_from_cycle = $date_to_cycle = $date_from_offset = $date_to_offset = $date_to_new = $date_from_cycle_offset = $date_to_cycle_offset = '';
        $modules->setModule("payrolls");
        $payrollModel = $modules->model;
        $data_payroll_previous = $payrollModel->select("id, date_from, date_to, date_from_offset, date_to_offset")->where("id <", $payroll_id)->orderBy("id", "desc")->first();
        if ($setting) {
            if ($data_payroll_previous) {
                $date_from_offset = $data_payroll_previous->date_from_offset;
                $date_to_offset = $data_payroll_previous->date_to_offset;
                $date_to_previous = $data_payroll_previous->date_to;
                $effective_from = $setting['effective'];
                if ($effective_from == $date_from) {
                    $day_cycle = (strtotime($effective_from) - strtotime($date_to_previous)) / (60 * 60 * 24);
                    if ($day_cycle >= 2) {
                        $date_from_cycle = date('Y-m-d', strtotime($date_to_previous . "+1 day"));
                        $date_to_cycle = date('Y-m-d', strtotime($effective_from . "-1 day"));
                    }
                }
            }

            $cut_off_date = $setting['cut_off_date'];
            $date_to_cycle_offset = $date_to;
            if (isset($setting['repeat_every_type']['name_option']) && $setting['repeat_every_type']['name_option'] == 'week') {
                $cut_off_date -= 1;
                $date_from_cycle_offset = date('Y-m-d', strtotime($date_to . "-$cut_off_date day"));
            }

            if (isset($setting['repeat_every_type']['name_option']) && $setting['repeat_every_type']['name_option'] == 'month') {
                if ($cut_off_date >= 20) {
                    $date_from_cycle_offset = date('Y-m-d', strtotime(date('Y-m-' . $cut_off_date, strtotime($date_to)) . "+1 day"));
                }
            }
        }
        if (!empty($date_from_cycle_offset) && $date_from_cycle_offset != '0000-00-00' && $date_from_cycle_offset != '1970-01-01') {
            $date_to_new = date('Y-m-d', strtotime($date_from_cycle_offset . "-1 day"));
        }

        $out['date_from_cycle'] = $date_from_cycle == '0000-00-00' || $date_from_cycle == '1970-01-01' ? '' : $date_from_cycle;
        $out['date_to_cycle'] = $date_to_cycle == '0000-00-00' || $date_to_cycle == '1970-01-01' ? '' : $date_to_cycle;
        $out['date_from_offset'] = $date_from_offset == '0000-00-00' || $date_from_offset == '1970-01-01' ? '' : $date_from_offset;
        $out['date_to_offset'] = $date_to_offset == '0000-00-00' || $date_to_offset == '1970-01-01' ? '' : $date_to_offset;
        $out['date_from_cycle_offset'] = $date_from_cycle_offset == '0000-00-00' || $date_from_cycle_offset == '1970-01-01' || empty($date_from_cycle_offset) ? null : $date_from_cycle_offset;
        $out['date_to_cycle_offset'] = $date_to_cycle_offset == '0000-00-00' || $date_to_cycle_offset == '1970-01-01' ? '' : $date_to_cycle_offset;
        $out['date_to_new'] = $date_to_new == '0000-00-00' || $date_to_new == '1970-01-01' ? '' : $date_to_new;

        return $out;
    }

    public function getOneOff($modules, $payroll_id, $employee_id)
    {
        $arr_table = [];
        $arr_detail = [];

        $modules->setModule("payroll_details");
        $model = $modules->model;
        if (is_array($employee_id)) {
            $payroll_deital_db = $model->where("payroll", $payroll_id)->whereIn("employee", $employee_id)->findAll();
        } else {
            $payroll_deital_db = $model->where("payroll", $payroll_id)->where("employee", $employee_id)->first();
        }
        if ($payroll_deital_db) {
            if (is_array($employee_id)) {
                foreach ($payroll_deital_db as $item) {
                    $employee = $item->employee;
                    $detail_one_off = json_decode($item->detail_one_off, true);
                    if (!empty($detail_one_off)) {
                        foreach ($detail_one_off as $item_one_off) {
                            if (is_numeric($item_one_off[3])) {
                                if (empty($arr_table[$employee]['one_off'])) $arr_table[$employee]['one_off'] = 0;
                                $arr_table[$employee]['one_off'] += $item_one_off[3];
                            }
                        }
                    }

                    $detail_overtime = json_decode($item->detail_overtime, true);
                    if (!empty($detail_overtime)) {
                        foreach ($detail_overtime as $item_overtime) {
                            if (!empty($item_overtime[2])) {
                                $arr_table[$employee]['arr_detail_overtime'][$item_overtime[2]] = $item_overtime[3];
                            }
                        }
                    }

                    $detail_off_cycle_overtime = json_decode($item->detail_off_cycle_overtime, true);
                    if (!empty($detail_off_cycle_overtime)) {
                        foreach ($detail_off_cycle_overtime as $item_overtime) {
                            if (!empty($item_overtime[2])) {
                                $arr_table[$employee]['arr_detail_off_cycle_overtime'][$item_overtime[2]] = $item_overtime[3];
                            }
                        }
                    }

                    $detail_offset_overtime = json_decode($item->detail_offset_overtime, true);
                    if (!empty($detail_offset_overtime)) {
                        foreach ($detail_offset_overtime as $item_overtime) {
                            if (!empty($item_overtime[2])) {
                                $arr_table[$employee]['arr_detail_offset_overtime'][$item_overtime[2]] = $item_overtime[3];
                            }
                        }
                    }
                }
            } else {
                $id_payroll_detail = $payroll_deital_db->id;
                // one-off
                $one_off = 0;
                $count_one_off = 0;
                $arr_overtime = [];
                $arr_off_cycle_overtime = [];
                $arr_offset_overtime = [];
                $data_one_off = json_decode($payroll_deital_db->detail_one_off, true);
                if (!empty($data_one_off)) {
                    $key_one_off = 0;
                    foreach ($data_one_off as $item) {
                        if (is_numeric($item[3])) {
                            $one_off += $item[3];
                        }

                        if ($item['key'] > $key_one_off) {
                            $key_one_off = $item['key'];
                        }
                    }
                    $count_one_off = $key_one_off + 1;
                }

                // overtime
                $detail_overtime = json_decode($payroll_deital_db->detail_overtime, true);
                if (!empty($detail_overtime)) {
                    foreach ($detail_overtime as $item) {
                        if (isset($item[2]) && !empty($item[2])) {
                            $arr_overtime[$item[2]] = $item[3];
                        }
                    }
                }

                // off cycle - overtime
                $detail_off_cycle_overtime = json_decode($payroll_deital_db->detail_off_cycle_overtime, true);
                if (!empty($detail_off_cycle_overtime)) {
                    foreach ($detail_off_cycle_overtime as $item) {
                        if (isset($item[2]) && !empty($item[2])) {
                            $arr_off_cycle_overtime[$item[2]] = $item[3];
                        }
                    }
                }

                // offset - overtime
                $detail_offset_overtime = json_decode($payroll_deital_db->detail_offset_overtime, true);
                if (!empty($detail_offset_overtime)) {
                    foreach ($detail_offset_overtime as $item) {
                        if (isset($item[2]) && !empty($item[2])) {
                            $arr_offset_overtime[$item[2]] = $item[3];
                        }
                    }
                }

                $arr_detail['id_payroll_detail'] = $id_payroll_detail;
                $arr_detail['one_off'] = $one_off;
                $arr_detail['data_one_off'] = $data_one_off;
                $arr_detail['count_one_off'] = $count_one_off;
                $arr_detail['arr_overtime'] = $arr_overtime;
                $arr_detail['arr_off_cycle_overtime'] = $arr_off_cycle_overtime;
                $arr_detail['arr_offset_overtime'] = $arr_offset_overtime;
            }
        }

        $out['arr_table'] = $arr_table;
        $out['arr_detail'] = $arr_detail;

        return $out;
    }

    public function getSalary($modules, $date_from, $date_to, $employee_id, $arr_employee, $date_from_cycle, $date_to_cycle, $date_from_offset, $date_to_offset, $arr_work_schedule, $setting)
    {
        $arr_table = [];
        $arr_detail = [
            'salary' => 0,
            'amount_per_min' => 0,
            'amount_per_min_offset' => 0,
            'amount_per_min_off_cycle' => 0
        ];

        $date_from_salary_query = date('Y-m-01', strtotime($date_from));
        if (!empty($date_from_cycle)) {
            $date_from_salary_query = date('Y-m-01', strtotime($date_from_cycle));
        }
        if (!empty($date_from_offset)) {
            $date_from_salary_query = date('Y-m-01', strtotime($date_from_offset));
        }

        $date_to_salary_query = date('Y-m-t', strtotime($date_to));
        $modules->setModule("employee_salary");
        $salaryModel = $modules->model;
        if (is_array($employee_id)) {
            $salaryModel->whereIn("employee", $employee_id);
        } else {
            $salaryModel->where("employee", $employee_id);
        }
        $salaryModel->groupStart();
        $salaryModel->orWhere("(date_from <= '$date_to_salary_query' and date_to >= '$date_from_salary_query')");
        $salaryModel->orWhere("(date_from <= '$date_from_salary_query' and (date_to = '' or date_to is null or date_to = '0000-00-00'))");
        $salaryModel->orWhere("(date_from between '$date_from_salary_query' and '$date_to_salary_query')");
        $salaryModel->groupEnd();
        $data_salary_db = $salaryModel->select("id, employee, salary, date_from, date_to")->orderBy('employee', 'asc')->orderBy('date_from', 'asc')->asArray()->findAll();
        if (is_array($employee_id)) {
            $data_salary = [];
            foreach ($data_salary_db as $item) {
                $data_salary[$item['employee']][] = $item;
            }
            foreach ($data_salary as $employee => $item) {
                $work_schedule = $arr_work_schedule[$arr_employee[$employee]['work_schedule']]['day'] ?? [];
                $join_date = $arr_employee[$employee]['join_date'];
                if (empty($join_date) || $join_date == '0000-00-00') {
                    continue;
                }
                $last_working_date = $arr_employee[$employee]['last_working_date'];

                // salary cycle
                $resultSalary = $this->calculateSalary($join_date, $last_working_date, $date_from, $date_to, $item, $work_schedule, $setting);
                $salary = $resultSalary['salary'];
                $amount_per_min = $resultSalary['amount_per_min'];

                // salary offset
                if (!empty($date_from_offset) && !empty($date_to_offset)) {
                    $resultSalary = $this->calculateSalary($join_date, $last_working_date, $date_from_offset, $date_to_offset, $item, $work_schedule, $setting);
                    $salary += $resultSalary['salary'];
                    $amount_per_min_offset = $resultSalary['amount_per_min'];
                }

                // salary off cycle
                if (!empty($date_from_cycle) && $date_to_cycle) {
                    $resultSalary = $this->calculateSalary($join_date, $last_working_date, $date_from_cycle, $date_to_cycle, $item, $work_schedule, $setting);
                    $salary += $resultSalary['salary'];
                    $amount_per_min_off_cycle = $resultSalary['amount_per_min'];
                }

                $arr_table[$employee]['is_salary'] = true;
                $arr_table[$employee]['salary'] = round($salary, 2);
                $arr_table[$employee]['amount_per_min'] = $amount_per_min;
                $arr_table[$employee]['amount_per_min_offset'] = $amount_per_min_offset ?? 0;
                $arr_table[$employee]['amount_per_min_off_cycle'] = $amount_per_min_off_cycle ?? 0;
            }
        } else {
            $join_date = $arr_employee['join_date'];
            $last_working_date = $arr_employee['last_working_date'];
            if (!empty($join_date) && $join_date != '0000-00-00') {
                $work_schedule = $arr_work_schedule['day'] ?? [];
                $data_salary = $data_salary_db;

                // salary cycle
                $resultSalary = $this->calculateSalary($join_date, $last_working_date, $date_from, $date_to, $data_salary, $work_schedule, $setting);
                $salary = $resultSalary['salary'];
                $amount_per_min = $resultSalary['amount_per_min'];

                // salary offset
                if (!empty($date_from_offset) && !empty($date_to_offset)) {
                    $resultSalary = $this->calculateSalary($join_date, $last_working_date, $date_from_offset, $date_to_offset, $data_salary, $work_schedule, $setting);
                    $salary += $resultSalary['salary'];
                    $amount_per_min_offset = $resultSalary['amount_per_min'];
                }

                // salary off_cycle
                if (!empty($date_from_cycle) && $date_to_cycle) {
                    $resultSalary = $this->calculateSalary($join_date, $last_working_date, $date_from_cycle, $date_to_cycle, $data_salary, $work_schedule, $setting);
                    $salary += $resultSalary['salary'];
                    $amount_per_min_off_cycle = $resultSalary['amount_per_min'];
                }

                $arr_detail['salary'] = round($salary, 2);
                $arr_detail['amount_per_min'] = $amount_per_min;
                $arr_detail['amount_per_min_offset'] = $amount_per_min_offset ?? 0;
                $arr_detail['amount_per_min_off_cycle'] = $amount_per_min_off_cycle ?? 0;
            }
        }

        $out['arr_table'] = $arr_table;
        $out['arr_detail'] = $arr_detail;

        return $out;
    }

    public function getOffsetCarryOverOfOvertime($modules, $payroll, $employee_id, $arr_amount_overtime_per_min, $arr_offset_overtime)
    {
        $arr_table = [];
        $arr_detail = [
            'offset_previous_overtime' => 0,
            'offset_detail_previous_overtime' => []
        ];
        $modules->setModule("payrolls");
        $model = $modules->model;
        $payrollPrevious = $model->where("id <", $payroll)->orderBy("id", "desc")->select("id")->first();
        if ($payrollPrevious) {
            $payrollIdPrevious = $payrollPrevious->id;
            $modules->setModule("payroll_details");
            $model = $modules->model;
            if (is_array($employee_id)) {
                $model->whereIn("employee", $employee_id);
            } else {
                $model->where("employee", $employee_id);
            }
            $payrollDetailPrevious = $model->where("payroll", $payrollIdPrevious)->select("detail_carry_over_of_overtime, employee")->asArray()->findAll();
            if ($payrollDetailPrevious) {
                if (is_array($employee_id)) {
                    foreach ($payrollDetailPrevious as $item_payroll_detail) {
                        $data_detail_carry_over_of_overtime = json_decode($item_payroll_detail['detail_carry_over_of_overtime'], true);
                        $employee = $item_payroll_detail['employee'];
                        $amount_overtime = $arr_amount_overtime_per_min[$employee] ?? 0;
                        if (!empty($data_detail_carry_over_of_overtime)) {
                            foreach ($data_detail_carry_over_of_overtime as $item) {
                                if (isset($item['type'])) {
                                    $amount = $arr_offset_overtime[$employee]['previous_' . $item['type']] ?? round($item['overtime'] * $amount_overtime, 2);
                                    if (empty($arr_table[$employee]['offset_previous_overtime'])) $arr_table[$employee]['offset_previous_overtime'] = 0;
                                    $arr_table[$employee]['offset_previous_overtime'] += $amount;
                                }
                            }
                        }
                    }
                } else {
                    foreach ($payrollDetailPrevious as $item_payroll_detail) {
                        $data_detail_carry_over_of_overtime = json_decode($item_payroll_detail['detail_carry_over_of_overtime'], true);
                        if (!empty($data_detail_carry_over_of_overtime)) {
                            $amount_overtime = $arr_amount_overtime_per_min;
                            foreach ($data_detail_carry_over_of_overtime as $item) {
                                if (isset($item['type'])) {
                                    $amount = $arr_offset_overtime['previous_' . $item['type']] ?? round($item['overtime'] * $amount_overtime, 2);
                                    $arr_detail['offset_previous_overtime'] += $amount;
                                    $arr_detail['offset_detail_previous_overtime'][] = [
                                        1 => $item['overtime'],
                                        2 => ['previous_overtime', 'previous_' . $item['type']],
                                        3 => $amount,
                                        'type' => 'overtime'
                                    ];
                                }
                            }
                        }
                    }
                }
            }
        }

        $out['arr_table'] = $arr_table;
        $out['arr_detail'] = $arr_detail;

        return $out;
    }

    public function getAttendance($modules, $employee_id, $arr_employee, $arr_work_schedule, $date_from, $date_to, $arr_amount_per_min, $arr_amount_overtime_per_min, $arr_detail_overtime, $check_max_overtime)
    {
        $arr_table = [];
        $arr_detail = [];

        // time off request
        $modules->setModule('time_off_requests');
        $TimeOffRequestModel = $modules->model;
        if (is_array($employee_id)) {
            $TimeOffRequestModel->whereIn("created_by", $employee_id);
        } else {
            $TimeOffRequestModel->where("created_by", $employee_id);
        }
        $listTimeOffRequest = $TimeOffRequestModel->where('status', getOptionValue('time_off_requests', 'status', 'approved'))
            ->where('date_from <= ', $date_to)
            ->where('date_to >= ', $date_from)
            ->asArray()->findAll();

        // holiday
        $modules->setModule('time_off_holidays');
        $model = $modules->model;
        if (is_array($employee_id)) {
            $arr_office[0] = 0;
            foreach ($arr_employee as $item) {
                $arr_office[$item['office']] = $item['office'];
            }
            $arr_office = array_values($arr_office);
            $listHoliday = $model->asArray()->where('from_date <=', $date_to)->where('to_date >= ', $date_from)->whereIn('office_id', $arr_office)->findAll();
        } else {
            $listHoliday = $model->asArray()->where('from_date <=', $date_to)->where('to_date >= ', $date_from)->where('office_id', $arr_employee['office'])->findAll();
        }

        $modules->setModule("attendance_details");
        $attendanceModel = $modules->model;
        $module = $modules->getModule();
        if (is_array($employee_id)) {
            $attendanceModel->whereIn("employee", $employee_id);
        } else {
            $attendanceModel->where("employee", $employee_id);
        }
        $attendanceModel->where("date between '$date_from' and '$date_to'");
        $attendanceModel->groupStart();
        $attendanceModel->orWhere("status", getOptionValue($module, "status", "approved"));
        $attendanceModel->orWhere("status", getOptionValue($module, "status", "pending"));
        $attendanceModel->groupEnd();
        $data_attendance_db = $attendanceModel->asArray()->findAll();
        if (is_array($employee_id)) {
            $arr_attendance_detail_employee = [];
            foreach ($data_attendance_db as $item) {
                $arr_attendance_detail_employee[$item['employee']][] = $item;
            }
            $arrListTimeOffRequest = [];
            foreach ($listTimeOffRequest as $item) {
                $arrListTimeOffRequest[$item['created_by']][] = $item;
            }
            foreach ($employee_id as $employee) {
                if (!isset($arr_attendance_detail_employee[$employee]) && !empty($employee)) $arr_attendance_detail_employee[$employee] = [];
                if (!isset($arrListTimeOffRequest[$employee]) && !empty($employee)) $arrListTimeOffRequest[$employee] = [];
            }
            $arrListHoliday = [];
            foreach ($listHoliday as $item) {
                $arrListHoliday[$item['office_id']][] = $item;
            }

            foreach ($arr_attendance_detail_employee as $employee => $item) {
                $work_schedule = $arr_work_schedule[$arr_employee[$employee]['work_schedule']] ?? [];
                if (empty($work_schedule)) {
                    continue;
                }
                $begin = new \DateTime($date_from);
                $end = new \DateTime($date_to);
                $listAttendanceDetailAll = [];
                for ($i = $end; $i >= $begin; $i->modify('-1 day')) {
                    $date = $i->format('Y-m-d');
                    $arr['a'] = $date;
                    $listAttendanceDetailAll[$date] = $arr;
                }
                foreach ($item as $row) {
                    if (isset($row['date'])) {
                        $date = date('Y-m-d', strtotime($row['date']));
                        if (isset($listAttendanceDetailAll[$date])) {
                            $listAttendanceDetailAll[$date] = array_merge($listAttendanceDetailAll[$date], $row);
                        }
                    }
                }

                $currentEmployee = $arr_employee[$employee] ?? [];
                $result = getAttendanceDetail($listAttendanceDetailAll, $currentEmployee, $date_from, $date_to, [], $work_schedule, empty($arrListTimeOffRequest[$employee]) ? false : $arrListTimeOffRequest[$employee], [], empty($arrListHoliday[$currentEmployee['office']]) ? false : $arrListHoliday[$currentEmployee['office']]);
                $deficit_min = $result['total_time']['deficit'] / 60;
                $amount_per_min = $arr_amount_per_min[$employee] ?? 0;
                $arr_table[$employee]['deficit'] = round($deficit_min * $amount_per_min, 2);

                //list_attendance_detail
                $arr_enough_working_hours = [];
                foreach ($result['list_attendance_detail'] as $item_detail) {
                    if (isset($item_detail['deficit']) && $item_detail['deficit'] >= 0) {
                        $date = $item_detail['date'];
                        $arr_enough_working_hours[] = $date;
                    }
                }
                $arr_table[$employee]['arr_enough_working_hours'] = $arr_enough_working_hours;

                // overtime
                $amount_overtime = $arr_amount_overtime_per_min[$employee] ?? 0;
                $overtime_total = $result['total_time']['overtime'] / 60;
                $overtime_holiday = $result['total_time']['overtime_holiday'] / 60;
                $overtime_non_working_day = $result['total_time']['overtime_non_working_day'] / 60;
                $overtime_regular = $result['total_time']['overtime_regular'] / 60;
                $result_overtime = $this->getOvertime($overtime_total, $overtime_holiday, $overtime_non_working_day, $overtime_regular, $amount_overtime, $arr_detail_overtime[$employee] ?? [], $check_max_overtime);
                $arr_table[$employee]['ot'] = $result_overtime['overtime'];
            }
        } else {
            $begin = new \DateTime($date_from);
            $end = new \DateTime($date_to);
            $listAttendanceDetailAll = [];
            for ($i = $end; $i >= $begin; $i->modify('-1 day')) {
                $date = $i->format('Y-m-d');
                $arr['a'] = $date;
                $listAttendanceDetailAll[$date] = $arr;
            }
            foreach ($data_attendance_db as $row) {
                $date = date('Y-m-d', strtotime($row['date']));
                if (isset($listAttendanceDetailAll[$date])) {
                    $listAttendanceDetailAll[$date] = array_merge($listAttendanceDetailAll[$date], $row);
                }
            }
            $currentEmployee = $arr_employee;
            $work_schedule = $arr_work_schedule;
            $result = getAttendanceDetail($listAttendanceDetailAll, $currentEmployee, $date_from, $date_to, [], $work_schedule, empty($listTimeOffRequest) ? false : $listTimeOffRequest, [], empty($listHoliday) ? false : $listHoliday);
            $attendance = $result['total_time']['paid_time'] / 60;
            $deficit_min = $result['total_time']['deficit'] / 60;
            $amount_per_min = $arr_amount_per_min;
            $deficit = round($deficit_min * $amount_per_min, 2);

            $overtime_total = $result['total_time']['overtime'] / 60;
            $overtime_holiday = $result['total_time']['overtime_holiday'] / 60;
            $overtime_non_working_day = $result['total_time']['overtime_non_working_day'] / 60;
            $overtime_regular = $result['total_time']['overtime_regular'] / 60;

            $amount_overtime = $arr_amount_overtime_per_min;
            $arr_overtime = $arr_detail_overtime;
            $result_overtime = $this->getOvertime($overtime_total, $overtime_holiday, $overtime_non_working_day, $overtime_regular, $amount_overtime, $arr_overtime, $check_max_overtime);
            $overtime = $result_overtime['overtime'];
            $data_overtime = $result_overtime['data_overtime'];
            $data_carry_over_of_overtime = $result_overtime['data_overtime_carry_over'];
            $data_deficit = [];
            if ($deficit_min > 0) {
                $data_deficit[] = [
                    'deficit' => $deficit_min,
                    'amount' => $deficit
                ];
            }

            //list_attendance_detail
            $arr_enough_working_hours = [];
            foreach ($result['list_attendance_detail'] as $item_detail) {
                if (isset($item_detail['deficit']) && $item_detail['deficit'] >= 0) {
                    $date = $item_detail['date'];
                    $arr_enough_working_hours[] = $date;
                }
            }

            $arr_detail['attendance'] = $attendance;
            $arr_detail['deficit'] = $deficit;
            $arr_detail['overtime'] = $overtime;
            $arr_detail['data_overtime'] = $data_overtime;
            $arr_detail['data_carry_over_of_overtime'] = $data_carry_over_of_overtime;
            $arr_detail['data_deficit'] = $data_deficit;
            $arr_detail['arr_enough_working_hours'] = $arr_enough_working_hours;
        }

        $out['arr_table'] = $arr_table;
        $out['arr_detail'] = $arr_detail;

        return $out;
    }

    public function getRecurring($employee, $date_from, $date_to, $arr_enough_working_hours)
    {
        if (!is_array($employee)) $employee = [$employee];
        $modules = \Config\Services::modules();
        $modules->setModule("employee_recurring");
        $recurringModel = $modules->model;
        $recurringModel->join("m_recurring", "m_recurring.id = m_employee_recurring.recurring");
        $recurringModel->whereIn('m_employee_recurring.employee', $employee)
            ->where("m_employee_recurring.valid_from <= '$date_to' and m_employee_recurring.valid_to >= '$date_from'");
        $data_recurring_db = $recurringModel->select("m_employee_recurring.employee as employee, m_recurring.id as id, m_recurring.name as name, m_recurring.description as description, m_recurring.amount as amount, m_recurring.payment_type as payment_type, m_recurring.repeat_type as repeat_type, m_recurring.repeat_number as repeat_number, m_recurring.enough_working_hours as enough_working_hours, m_employee_recurring.valid_from as valid_from, m_employee_recurring.valid_to as valid_to")->asArray()->findAll();
        $arr_recurring_employee = [];
        $modules->setModule("recurring");
        $module = $modules->getModule();
        foreach ($data_recurring_db as $item) {
            $date_start = max($item['valid_from'], $date_from);
            $date_end = min($item['valid_to'], $date_to);
            if ($item['enough_working_hours'] == 0) {
                $day_total = ((strtotime($date_end) - strtotime($date_start)) / (60 * 60 * 24)) + 1;
            } else {
                $arr_enough_working_hours_ = $arr_enough_working_hours[$item['employee']] ?? [];
                $day_total = 0;
                $begin = new \DateTime($date_start);
                $end = new \DateTime($date_end);
                for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
                    $date = $i->format('Y-m-d');
                    if (in_array($date, $arr_enough_working_hours_)) {
                        $day_total++;
                    }
                }
            }
            $day_repeat = 0;
            if ($item['repeat_type'] == getOptionValue($module, 'repeat_type', 'week')) {
                $day_repeat = $item['repeat_number'] * 7;
            } elseif ($item['repeat_type'] == getOptionValue($module, 'repeat_type', 'month')) {
                $date_repeat_start = date("Y-m-01", strtotime($date_from));
                $date_repeat_end = date("Y-m-t", strtotime($date_from));
                $day_repeat = $item['repeat_number'] * (((strtotime($date_repeat_end) - strtotime($date_repeat_start)) / (60 * 60 * 24)) + 1);
            } elseif ($item['repeat_type'] == getOptionValue($module, 'repeat_type', 'year')) {
                $day_repeat = $item['repeat_number'] * 365;
            } elseif ($item['repeat_type'] == getOptionValue($module, 'repeat_type', 'day')) {
                $day_repeat = $item['repeat_number'] * 1;
            }
            $amount_per_day = $item['amount'] / $day_repeat;
            $amount = $day_total * $amount_per_day;

            if (empty($arr_recurring_employee[$item['employee']]['total_amount'])) $arr_recurring_employee[$item['employee']]['total_amount'] = 0;
            $arr_recurring_employee[$item['employee']]['total_amount'] += round($amount, 2);
            $arr_recurring_employee[$item['employee']]['data_recurring'][] = [
                'recurring' => $item['name'],
                'description' => $item['description'],
                'amount' => round($amount, 2)
            ];
        }

        return $arr_recurring_employee;
    }

    public function getTimeOff($modules, $employee_id, $arr_employee, $arr_work_schedule, $date_from, $date_to)
    {
        $arr_table = [];
        $arr_detail = [];
        $modules->setModule('time_off_requests');
        $model = $modules->model;
        $module = $modules->getModule();
        $model->join("m_time_off_types", "m_time_off_types.id = m_time_off_requests.type");
        if (is_array($employee_id)) {
            $model->whereIn('m_time_off_requests.created_by', $employee_id);
        } else {
            $model->where('m_time_off_requests.created_by', $employee_id);
        }
        $model->where('m_time_off_requests.status', getOptionValue($module, 'status', 'approved'))
            ->where('m_time_off_requests.date_from <= ', $date_to)
            ->where('m_time_off_requests.date_to >= ', $date_from)
            ->where('m_time_off_types.paid', 0);
        $listTimeOffRequest = $model->select("m_time_off_requests.created_by as employee, m_time_off_types.id as id_type, m_time_off_types.name as type, m_time_off_types.paid as paid, m_time_off_requests.date_from as date_from, m_time_off_requests.date_to as date_to, m_time_off_requests.time_from as time_from, m_time_off_requests.time_to as time_to, m_time_off_requests.total_day as total_day")
            ->asArray()->findAll();
        if (is_array($employee_id)) {
            $data_time_request = [];
            foreach ($listTimeOffRequest as $item) {
                $data_time_request[$item['employee']][] = $item;
            }
            foreach ($data_time_request as $employee => $item_request) {
                $work_schedule = $arr_work_schedule[$arr_employee[$employee]['work_schedule']]['day'] ?? [];
                $arr_time_off = $this->calculateTimeOff($item_request, $work_schedule);
                $arr_table[$employee] = $arr_time_off['total_timeoff'];
            }
        } else {
            $work_schedule = $arr_work_schedule['day'] ?? [];
            $arr_detail = $this->calculateTimeOff($listTimeOffRequest, $work_schedule);
        }

        $out['arr_table'] = $arr_table;
        $out['arr_detail'] = $arr_detail;

        return $out;
    }

    // ** support function 
    private function getPayrollCycle($modules, $date_from, $date_to, $arr_id_employee, $arr_employee, $arr_work_schedule, $arr_amount_per_min, $arr_amount_overtime_per_min, $arr_detail_overtime, $check_max_overtime)
    {
        $data_table = [];
        $arr_enough_working_hours = [];
        // overtime - deficit
        // overtime
        $resultAttendance = $this->getAttendance($modules, $arr_id_employee, $arr_employee, $arr_work_schedule, $date_from, $date_to, $arr_amount_per_min, $arr_amount_overtime_per_min, $arr_detail_overtime, $check_max_overtime)['arr_table'];
        foreach ($resultAttendance as $employee => $item) {
            $data_table[$employee]['deficit'] = $item['deficit'];
            $data_table[$employee]['ot'] = $item['ot'];
            $arr_enough_working_hours[$employee] = $item['arr_enough_working_hours'];
        }

        // recurring
        $arr_recurring = $this->getRecurring($arr_id_employee, $date_from, $date_to, $arr_enough_working_hours);
        foreach ($arr_recurring as $employee => $item) {
            $data_table[$employee]['recurring'] = $item['total_amount'];
        }

        // time-off
        $resultTimeOff = $this->getTimeOff($modules, $arr_id_employee, $arr_employee, $arr_work_schedule, $date_from, $date_to)['arr_table'];
        foreach ($resultTimeOff as $employee => $time_off) {
            $amount_per_min = $arr_amount_per_min[$employee] ?? 0;
            $data_table[$employee]['unpaid'] = round($time_off * 60 * $amount_per_min, 2);
        }

        return $data_table;
    }

    private function calculateSalary($join_date, $last_working_date, $date_from, $date_to, $data_salary, $work_schedule, $setting)
    {
        $setting_working = preference('payroll_setting_calculate_based_on');

        $date_start = $date_from;
        $date_end = $date_to;
        if ($join_date > $date_from) {
            $date_start = $join_date;
        }
        if (!empty($last_working_date) && $last_working_date != '0000-00-00' && $last_working_date < $date_to) {
            $date_end = $last_working_date;
        }

        $month_date_start = date('Y-m-01', strtotime($date_from));
        $month_date_end = date('Y-m-t', strtotime($date_to));

        $month_start = date('m', strtotime($month_date_start));
        $month_end = date('m', strtotime($month_date_end));

        $salary = 0;
        $hour_total = 0;
        if ($setting_working == 'calendar') {
            if (isset($setting['repeat_every_type']['name_option']) && $setting['repeat_every_type']['name_option'] == 'week' && $month_start != $month_end) {
                $date_from_month_start = date('Y-m-01', strtotime($month_date_start));
                $date_to_month_start = date('Y-m-t', strtotime($month_date_start));
                $resultSalaryCalendar = $this->calculateSalaryCalendar($data_salary, $date_start, $date_to_month_start, $date_from_month_start, $date_to_month_start);
                $salary_start = $resultSalaryCalendar['salary'];
                $hour_total_start = $resultSalaryCalendar['hour_total'];

                $date_from_month_end = date('Y-m-01', strtotime($month_date_end));
                $date_to_month_end = date('Y-m-t', strtotime($month_date_end));
                $resultSalaryCalendar = $this->calculateSalaryCalendar($data_salary, $date_from_month_end, $date_end, $date_from_month_end, $date_to_month_end);
                $salary_end = $resultSalaryCalendar['salary'];
                $hour_total_end = $resultSalaryCalendar['hour_total'];

                $salary = $salary_start + $salary_end;
                $hour_total = $hour_total_start + $hour_total_end;
            } else {
                $resultSalaryCalendar = $this->calculateSalaryCalendar($data_salary, $date_start, $date_end, $month_date_start, $month_date_end);
                $salary = $resultSalaryCalendar['salary'];
                $hour_total = $resultSalaryCalendar['hour_total'];
            }
        }

        if ($setting_working == 'working' || is_numeric($setting_working)) {
            if (!empty($work_schedule)) {
                if (isset($setting['repeat_every_type']['name_option']) && $setting['repeat_every_type']['name_option'] == 'week' && $month_start != $month_end) {
                    $date_from_month_start = date('Y-m-01', strtotime($month_date_start));
                    $date_to_month_start = date('Y-m-t', strtotime($month_date_start));
                    $resultSalaryWorking = $this->calculateSalaryWorking($data_salary, $date_start, $date_to_month_start, $date_from_month_start, $date_to_month_start, $work_schedule, $setting_working);
                    $salary_start = $resultSalaryWorking['salary'];
                    $hour_total_start = $resultSalaryWorking['hour_total'];

                    $date_from_month_end = date('Y-m-01', strtotime($month_date_end));
                    $date_to_month_end = date('Y-m-t', strtotime($month_date_end));
                    $resultSalaryWorking = $this->calculateSalaryWorking($data_salary, $date_from_month_end, $date_end, $date_from_month_end, $date_to_month_end, $work_schedule, $setting_working);
                    $salary_end = $resultSalaryWorking['salary'];
                    $hour_total_end = $resultSalaryWorking['hour_total'];

                    $salary = $salary_start + $salary_end;
                    $hour_total = $hour_total_start + $hour_total_end;
                } else {
                    $resultSalaryWorking = $this->calculateSalaryWorking($data_salary, $date_start, $date_end, $month_date_start, $month_date_end, $work_schedule, $setting_working);
                    $salary = $resultSalaryWorking['salary'];
                    $hour_total = $resultSalaryWorking['hour_total'];
                }
            }
        }

        $min_total = $hour_total * 60;
        $amount_per_min = $min_total == 0 ? 0 : $salary / $min_total;

        return [
            'salary' => $salary,
            'amount_per_min' => $amount_per_min
        ];
    }

    private function calculateSalaryCalendar($data_salary, $date_start, $date_end, $month_date_start, $month_date_end)
    {
        $salary = 0;
        $hour_total = 0;
        $day_total = ((strtotime($month_date_end) - strtotime($month_date_start)) / (60 * 60 * 24)) + 1;
        $arr_salary = $this->getDateSalary($data_salary);
        $salary_date_check_from = $date_start;
        foreach ($arr_salary as $item_salary) {
            $salary_date_from = $item_salary['date_from'];
            $salary_date_to = $item_salary['date_to'];
            $salary_check = $item_salary['salary'];

            if ($salary_date_from > $salary_date_check_from) {
                $salary_date_check_from = $salary_date_from;
            }
            $salary_date_check_to = $date_end;
            if (!empty($salary_date_to) && $salary_date_to < $salary_date_check_to) {
                $salary_date_check_to = $salary_date_to;
            }
            $day_working = ((strtotime($salary_date_check_to) - strtotime($salary_date_check_from)) / (60 * 60 * 24)) + 1;
            if ($day_working > 0) {
                $salary += $salary_check * $day_working / $day_total;
                $hour_total += $day_working * 8;
            }
        }

        return ["salary" => $salary, "hour_total" => $hour_total];
    }

    private function calculateSalaryWorking($data_salary, $date_start, $date_end, $month_date_start, $month_date_end, $work_schedule, $setting_working)
    {
        $salary = 0;
        $hour_total = 0;
        $arr_working_date = [];
        $day_total = 0;
        $begin = new \DateTime($month_date_start);
        $end = new \DateTime($month_date_end);
        for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
            $date = $i->format("Y-m-d");
            $day = $i->format("w");
            $work = $work_schedule[$day];
            if ($work['working_day']) {
                $day_total++;
                $arr_working_date[] = $date;
            }
        }

        if (is_numeric($setting_working)) {
            $day_total = $setting_working;
        }

        $arr_salary = $this->getDateSalary($data_salary);
        $salary_date_check_from = $date_start;
        foreach ($arr_salary as $item_salary) {
            $day_working = 0;
            $salary_date_from = $item_salary['date_from'];
            $salary_date_to = $item_salary['date_to'];
            $salary_check = $item_salary['salary'];

            if ($salary_date_from > $salary_date_check_from) {
                $salary_date_check_from = $salary_date_from;
            }
            $salary_date_check_to = $date_end;
            if (!empty($salary_date_to) && $salary_date_to < $salary_date_check_to) {
                $salary_date_check_to = $salary_date_to;
            }

            if ($salary_date_check_from <= $salary_date_check_to) {
                $begin = new \DateTime($salary_date_check_from);
                $end = new \DateTime($salary_date_check_to);
                for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
                    $date = $i->format("Y-m-d");
                    if (in_array($date, $arr_working_date)) {
                        $day_working++;
                    }
                }
            }
            if ($day_working > 0) {
                $salary += $salary_check * $day_working / $day_total;
                $hour_total += $day_working * 8;
            }
        }

        return ["salary" => $salary, "hour_total" => $hour_total];
    }

    private function getDateSalary($arr)
    {
        $arr_salary = [];
        for ($i = 0; $i < count($arr); $i++) {
            $date_from = $arr[$i]['date_from'];
            $date_to = empty($arr[$i]['date_to']) || $arr[$i]['date_to'] == '0000-00-00' ? "" : $arr[$i]['date_to'];
            if (isset($arr[$i + 1]['date_from'])) {
                $date_to = date('Y-m-d', strtotime('-1 day', strtotime($arr[$i + 1]['date_from'])));
            }

            $arr_salary[] = [
                'date_from' => $date_from,
                'date_to' => $date_to,
                'salary' => $arr[$i]['salary'],
            ];
        }

        return $arr_salary;
    }

    private function getOvertime($overtime_total, $overtime_holiday, $overtime_non_working_day, $overtime_regular, $amount_overtime, $arr_overtime, $check_max_overtime)
    {
        $overtime_max = preference('payroll_max_overtime');
        $overtime_max = $overtime_max * 60;

        $overtime = 0;
        $data_overtime = [];
        $data_overtime_carry_over = [];
        $overtime_holiday_after = 0;
        $overtime_non_working_day_after = 0;
        $overtime_regular_after = 0;

        if ($check_max_overtime) {
            if ($overtime_total > $overtime_max) {
                if ($overtime_holiday > 0) {
                    if ($overtime_max > $overtime_holiday) {
                        $overtime_max -= $overtime_holiday;
                        $overtime_holiday = 0;
                    } else {
                        $overtime_holiday_after = $overtime_holiday - $overtime_max;
                        $overtime_holiday = $overtime_max;
                        $overtime_max = 0;
                    }
                }

                if ($overtime_non_working_day > 0) {
                    if ($overtime_max > $overtime_non_working_day) {
                        $overtime_max -= $overtime_non_working_day;
                        $overtime_non_working_day = 0;
                    } else {
                        $overtime_non_working_day_after = $overtime_non_working_day - $overtime_max;
                        $overtime_non_working_day = $overtime_max;
                        $overtime_max = 0;
                    }
                }

                if ($overtime_regular > 0) {
                    if ($overtime_max > $overtime_regular) {
                        $overtime_max -= $overtime_regular;
                        $overtime_regular = 0;
                    } else {
                        $overtime_regular_after = $overtime_regular - $overtime_max;
                        $overtime_regular = $overtime_max;
                        $overtime_max = 0;
                    }
                }
            }
        }

        if ($overtime_holiday > 0) {
            $amount = $arr_overtime['holiday'] ?? round($overtime_holiday * $amount_overtime, 2);
            $overtime += $amount;
            $data_overtime[] = [
                'type' => "holiday",
                'overtime' => $overtime_holiday,
                'amount' => $amount
            ];
        }
        if ($overtime_non_working_day > 0) {
            $amount = $arr_overtime['non_working_day'] ?? round($overtime_non_working_day * $amount_overtime, 2);
            $overtime += $amount;
            $data_overtime[] = [
                'type' => "non_working_day",
                'overtime' => $overtime_non_working_day,
                'amount' => $amount
            ];
        }
        if ($overtime_regular > 0) {
            $amount = $arr_overtime['regular'] ?? round($overtime_regular * $amount_overtime, 2);
            $overtime += $amount;
            $data_overtime[] = [
                'type' => "regular",
                'overtime' => $overtime_regular,
                'amount' => $amount
            ];
        }

        if ($overtime_holiday_after > 0) {
            $data_overtime_carry_over[] = [
                'type' => "holiday",
                'overtime' => $overtime_holiday_after
            ];
        }
        if ($overtime_non_working_day_after > 0) {
            $data_overtime_carry_over[] = [
                'type' => "non_working_day",
                'overtime' => $overtime_non_working_day_after
            ];
        }
        if ($overtime_regular_after > 0) {
            $data_overtime_carry_over[] = [
                'type' => "regular",
                'overtime' => $overtime_regular_after
            ];
        }

        $out['overtime'] = $overtime;
        $out['data_overtime'] = $data_overtime;
        $out['data_overtime_carry_over'] = $data_overtime_carry_over;

        return $out;
    }

    private function calculateTimeOff($listTimeOffRequest, $work_schedule)
    {
        $total_timeoff = 0;
        $arr_timeoff = [];
        if (!empty($work_schedule)) {
            foreach ($listTimeOffRequest as $rowTimeOffRequest) {
                $begin = new \DateTime($rowTimeOffRequest['date_from']);
                $end = new \DateTime($rowTimeOffRequest['date_to']);
                for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
                    $day = $i->format("w");
                    $work = $work_schedule[$day];
                    $total_day = $rowTimeOffRequest['total_day'];
                    if ($rowTimeOffRequest['total_day'] >= 1) {
                        $total_day = 1;
                    }
                    $timeoff = $work['total'] * $total_day;
                    $total_timeoff += $timeoff;

                    $arr_timeoff[$rowTimeOffRequest['id_type']]['name'] = $rowTimeOffRequest['type'];
                    if (empty($arr_timeoff[$rowTimeOffRequest['id_type']]['timeoff'])) $arr_timeoff[$rowTimeOffRequest['id_type']]['timeoff'] = 0;
                    $arr_timeoff[$rowTimeOffRequest['id_type']]['timeoff'] += $timeoff;
                }
            }
        }

        return [
            'total_timeoff' => $total_timeoff,
            'arr_timeoff' => $arr_timeoff
        ];
    }
}
