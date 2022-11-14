<?php

namespace HRM\Modules\TimeOff\Libraries\TimeOff;

use HRM\Modules\Employees\Models\EmployeesModel;

class TimeOff
{
    private $currentDate = '';
    private $endYearDate = '';
    private $monthlyAccrualFrequency = 0;
    private $yearlyAccrualFrequency = 0;
    private $accrualEvent = 0;
    private $balanceAdjustmentEvent = 0;
    private $assignDateJoinDate = 0;
    private $assignDateProbationDate = 0;
    private $roundingRuleNearest = 0;
    private $roundingRuleUpTo = 0;
    private $roundingRuleDownTo = 0;
    private $waitingPeriodTypeJoinDate = 0;
    private $waitingPeriodTypeProbationEndDate = 0;
    private $waitingPeriodUnitDay = 0;
    private $waitingPeriodUnitMonth = 0;

    public function __construct()
    {
        helper('app_select_option');
        $this->currentDate = date('Y-m-d');
        $this->endYearDate = date('Y-12-31');
        $this->monthlyAccrualFrequency = getOptionValue('time_off_policies', 'accrual_frequency', 'monthly');
        $this->yearlyAccrualFrequency = getOptionValue('time_off_policies', 'accrual_frequency', 'yearly');
        $this->accrualEvent = getOptionValue('time_off_balance_events', 'event', 'accrual');
        $this->balanceAdjustmentEvent = getOptionValue('time_off_balance_events', 'event', 'balanceadjustment');
        $this->assignDateJoinDate = getOptionValue('time_off_policies', 'assign_date', 'joindate');
        $this->assignDateProbationDate = getOptionValue('time_off_policies', 'assign_date', 'probationdate');
        $this->roundingRuleNearest = getOptionValue('time_off_policies', 'rounding_rule', 'nearest');
        $this->roundingRuleUpTo = getOptionValue('time_off_policies', 'rounding_rule', 'roundupto');
        $this->roundingRuleDownTo = getOptionValue('time_off_policies', 'rounding_rule', 'rounddownto');
        $this->waitingPeriodTypeJoinDate = getOptionValue('time_off_policies', 'waiting_period_type', 'upon_join_date');
        $this->waitingPeriodTypeProbationEndDate = getOptionValue('time_off_policies', 'waiting_period_type', 'probation_end_date');
        $this->waitingPeriodUnitDay = getOptionValue('time_off_policies', 'waiting_period_unit', 'day');
        $this->waitingPeriodUnitMonth = getOptionValue('time_off_policies', 'waiting_period_unit', 'month');
    }

    // ** cronjob function
    /**
     * Our configuration instance.
     *
     * @var listEmployee employee array
     *     */
    public function updateEmployeeBalance($listEmployee = [], $formatEmployeeData = false)
    {
        $modules = \Config\Services::modules();

        if (count($listEmployee) == 0) {
            $modules->setModule('employees');
            $model = new EmployeesModel();
            $listEmployee = $this->_handleListEmployeeData($model->exceptResigned()->findAll());
        }

        if (count($listEmployee) == 0) {
            throw new \Exception("employee list is empty");
        }

        if ($formatEmployeeData) {
            $listEmployee = $this->_handleListEmployeeData($listEmployee);
        }

        //get list policy active
        $modules->setModule('time_off_policies');
        $model = $modules->model;
        $builder = $model->select(['m_time_off_policies.id']);
        $builder->join('m_time_off_types', 'm_time_off_policies.type = m_time_off_types.id');
        $builder->where('m_time_off_types.active', 1);
        $listPolicies = $builder->findAll();

        if (count($listPolicies) > 0) {
            foreach ($listPolicies as $row) {
                $row = (array)$row;
                try {
                    $this->handleBalance($row['id'], $listEmployee);
                } catch (\ReflectionException $e) {
                    throw new \Exception("fail handle balance");
                }
            }
        }
    }

    public function updateEmployeeBalanceCarryover()
    {
        $modules = \Config\Services::modules();
        $modules->setModule('time_off_policies');
        $model = $modules->model;
        $builder = $model->select([
            'm_time_off_policies.id',
            'm_time_off_policies.type',
            "m_time_off_policies.maximum_carry_over"
        ]);
        $builder->join('m_time_off_types', 'm_time_off_policies.type = m_time_off_types.id');
        $builder->where('m_time_off_types.active', 1)->where("m_time_off_policies.maximum_carry_over >", 0);
        $listPolicies = $builder->findAll();

        if (count($listPolicies) == 0) {
            return true;
        }

        $arrTypeId = array_column($listPolicies, 'type');
        $arrTimeOffCarryover = $this->_handleTimeOffPolicyData($listPolicies);

        $modules->setModule('time_off_balances');
        $model =  $modules->model;
        $listTimeOffBalance = $model->select(['id', 'type', 'balance', 'carryover', 'carryover_balance'])->whereIn('type', $arrTypeId)->findAll();
        foreach ($listTimeOffBalance as $row) {
            $row = (array)$row;
            $maxCarryover = isset($arrTimeOffCarryover[$row['type']]) ? $arrTimeOffCarryover[$row['type']]['carryover'] : 0;
            if ($maxCarryover <= 0) {
                continue;
            }

            $carryover = ($row['balance'] > $maxCarryover) ?  $maxCarryover : $row['balance'];

            $dataUpdate = [
                'id' => $row['id'],
                'carryover' => $carryover,
                'carryover_balance' => $carryover
            ];
            $model->setAllowedFields(array_keys($dataUpdate));
            try {
                $model->save($dataUpdate);
            } catch (\ReflectionException $e) {
                throw new \Exception("fail update field time_off_balances.carryover_balance");
            }
        }

        return true;
    }

    public function updateCarryoverBalance()
    {
        $modules = \Config\Services::modules();
        $modules->setModule('time_off_policies');
        $model = $modules->model;

        //get list policy: carryover expiration date = today
        $listPolicy = $model->select(['id', 'type'])
            ->where('carry_over_expiration_month', intval(date('m')))
            ->where('carry_over_expiration_date', intval(date('d')))
            ->findAll();
        if (count($listPolicy) > 0) {
            $arrTypeId = array_unique(array_column($listPolicy, 'type'));
            $modules->setModule('time_off_balances');
            $model = $modules->model;
            $listTimeOffBalance = $model->select(['id', 'carryover_balance'])->where('type', $arrTypeId)->findAll();
            foreach ($listTimeOffBalance as $row) {
                $dataUpdate = [
                    'id' => $row['id'],
                    'carryover_balance' => 0
                ];
                $model->setAllowedFields(array_keys($dataUpdate));
                try {
                    $model->save($dataUpdate);
                } catch (\ReflectionException $e) {
                    throw new \Exception("fail update field time_off_balances.carryover_balance");
                }
            }
        }
    }



    // ** common function
    /**
     * Our configuration instance.
     *
     * @param idPolicy policy id (int)
     * @var listEmployeeAdd employee array ([value: employee id, label: full name, join_date: employee join date, probation_date: employee probation end date])
     *     */
    public function handleBalance($idPolicy, $listEmployeeAdd)
    {
        if (!empty($idPolicy) && count($listEmployeeAdd) > 0) {

            helper('app_select_option');
            $modules = \Config\Services::modules();

            $modules->setModule('time_off_policies');
            $model = $modules->model;
            $infoTimeOffPolicy = (array)$model->find($idPolicy);
            $assignDate = $infoTimeOffPolicy['assign_date'];
            $accrualFrequency = $infoTimeOffPolicy['accrual_frequency'];
            $entitlement = $infoTimeOffPolicy['entitlement'];
            $prorateAccrual = $infoTimeOffPolicy['prorate_accrual'];
            $roundingRule = $infoTimeOffPolicy['rounding_rule'];
            $roundingUnit = $infoTimeOffPolicy['rounding_unit'];
            $waitingPeriod = $infoTimeOffPolicy['waiting_period'];
            $waitingPeriodType = $infoTimeOffPolicy['waiting_period_type'];
            $waitingPeriodUnit = $infoTimeOffPolicy['waiting_period_unit'];
            $numRound = $this->_getNumberRounding($roundingUnit);

            // remove old balance
            $this->handleDeleteBalance($modules, array_column($listEmployeeAdd, 'value'), $infoTimeOffPolicy['type']);

            $arrDataInsertTimeOffBalanceEvent = [];
            foreach ($listEmployeeAdd as $row) {
                $fromDateData = $this->_getFromDate($row, $prorateAccrual, $assignDate, $waitingPeriod,  $waitingPeriodType, $waitingPeriodUnit);
                $fromDateInsert = $fromDate = $fromDateData['date'];
                if (!$this->_validateDate($fromDate, $this->currentDate)) {
                    continue;
                }

                $numberMonthWaitingPeriod = $fromDateData['month_number'];
                // insert time off balance event
                $totalDatePerMonth = 0;
                // if accrual frequency = monthly, each month insert one record to  time_off_balance_events
                // else insert one record to time_off_balance_events
                $totalEntitlement = 0;
                if ($accrualFrequency == $this->monthlyAccrualFrequency) {  // monthly
                    if (empty($prorateAccrual)) {
                        $totalEntitlement = $entitlement / 12 * (12 - intval(date('m', strtotime($fromDate))) + 1);
                    } else {
                        $workingDate = $this->_getDatePerMonth($fromDate);
                        $totalEntitlement = $entitlement / 12 * (12 - intval(date('m', strtotime($fromDate))) + $workingDate);
                    }
                    $totalEntitlement = $this->_roundDate($totalEntitlement, $roundingRule, $numRound);
                    $entitlementMonth  = $this->_roundDate(($totalEntitlement / 12), $roundingRule, $numRound);
                    if (empty($entitlementMonth)) {
                        continue;
                    }

                    // case Probation date or Join date = date create eligibility
                    if (date('m', strtotime($fromDate)) == date('m', strtotime($this->currentDate))) {
                        $numberDate = ($this->_getDatePerMonth($fromDate) * $entitlementMonth) *  $numberMonthWaitingPeriod ;
                        $totalDatePerMonth = $datePerMonth = $this->_roundDate($numberDate, $roundingRule, $numRound);
                        $dataInsert = [
                            'date' =>  $fromDate,
                            'event' => $this->accrualEvent,
                            'type' => $infoTimeOffPolicy['type'],
                            'changed_by' => 0,
                            'change' => $datePerMonth,
                            'employee' => $row['value']
                        ];
                        $arrDataInsertTimeOffBalanceEvent[] = $dataInsert;
                    } else {
                        $monthNum = ((date('Y', strtotime($this->currentDate)) - date('Y', strtotime($fromDate))) * 12)
                            + (date('m', strtotime($this->currentDate)) - date('m', strtotime($fromDate))) + 1;
                        for ($i = 1; $i <= $monthNum; $i++) {
                            // at first month if start date in 01 => datePerMonth = entitlementMonth
                            // else datePerMonth = ((dates of month - start date) / dates of month) * entitlementMonth
                            // next month, datePerMonth = entitlementMonth
                            if (date('m', strtotime($fromDate)) == date('m', strtotime($fromDateInsert))) {
                                $datePerMonth = $this->_getDatePerMonth($fromDate) * $entitlementMonth * $numberMonthWaitingPeriod;
                                $fromDateInsertDB = $fromDate;
                            } else {
                                $datePerMonth = $entitlementMonth;
                                $fromDateInsertDB =  date('Y-m',  strtotime($fromDateInsert)) . '-01';
                            }
                            $datePerMonth = $this->_roundDate($datePerMonth, $roundingRule, $numRound);
                            $dataInsert = [
                                'date' =>  $fromDateInsertDB,
                                'event' => $this->accrualEvent,
                                'type' => $infoTimeOffPolicy['type'],
                                'changed_by' => 0,
                                'change' => $datePerMonth,
                                'employee' => $row['value']
                            ];
                            $arrDataInsertTimeOffBalanceEvent[] = $dataInsert;
                            $totalDatePerMonth += $datePerMonth;
                            $fromDateInsert = date('Y-m-d', strtotime("+1 month", strtotime(date('Y-m-01', strtotime($fromDateInsert)))));
                        }
                    }
                } else if ($accrualFrequency == $this->yearlyAccrualFrequency) { // yearly
                    // In yearly accrual frequency, if not switch prorate accrual, datePerMonth = policy entitlement
                    // else datePerMonth = policy entitlement / 12 (month) * number of month form Join Date or Probation Date to end year
                    if (empty($prorateAccrual)) {
                        $totalEntitlement = $entitlement;
                    } else {
                        $lastDate = date('t', strtotime($fromDate));
                        $monthNum = ((date('Y', strtotime($this->endYearDate)) - date('Y', strtotime($fromDate))) * 12)
                            + (date('m', strtotime($this->endYearDate)) - date('m', strtotime($fromDate)));
                        if (date('d', strtotime($fromDate)) == '01') {
                            $monthNum += 1;
                        } else {
                            $monthNum += intval(date('m', strtotime($fromDate))) / $lastDate;
                        }
                        $totalEntitlement = ($entitlement / 12) *  $monthNum;
                    }

                    if (empty($totalEntitlement)) {
                        continue;
                    }

                    $totalDatePerMonth = $totalEntitlement = $datePerMonth = $this->_roundDate($totalEntitlement, $roundingRule, $numRound);

                    $dataInsert = [
                        'date' => $fromDate,
                        'event' => $this->accrualEvent,
                        'type' => $infoTimeOffPolicy['type'],
                        'changed_by' => 0,
                        'change' => $datePerMonth,
                        'employee' => $row['value']
                    ];
                    $arrDataInsertTimeOffBalanceEvent[] = $dataInsert;
                }

                //insert time off balance
                // check isset time_off_balance by employee and type
                $modules->setModule('time_off_balances');
                $model = $modules->model;
                $infoTimeOffBalance = $model->asArray()
                    ->where('employee', $row['value'])
                    ->where('type', $infoTimeOffPolicy['type'])
                    ->first();
                $dataInsertTimeOffBalance = [
                    'employee' =>  $row['value'],
                    'type' => $infoTimeOffPolicy['type'],
                    'entitlement' => $totalEntitlement,
                    'balance' => $totalDatePerMonth
                ];
                if (isset($infoTimeOffBalance['id'])) {
                    // get total change time_off_balance_events: event = 'balance adjustment'
                    $dataInsertTimeOffBalance['id'] = $infoTimeOffBalance['id'];
                    $changeBalance = $this->_calculateTimeOffBalance($modules, $row['value'], $infoTimeOffPolicy['type'], $infoTimeOffBalance['carryover']);
                    $dataInsertTimeOffBalance['balance'] += $changeBalance;
                } else {
                    $dataInsertTimeOffBalance['carryover'] = 0;
                    $dataInsertTimeOffBalance['requested'] = 0;
                }

                $dataHandleTimeOffBalance = handleDataBeforeSave($modules, $dataInsertTimeOffBalance);
                $model->setAllowedFields(array_keys($dataInsertTimeOffBalance));
                $saveTimeOffBalance = $dataHandleTimeOffBalance['data'];
                try {
                    $model->save($saveTimeOffBalance);
                } catch (\ReflectionException $e) {
                    throw new \Exception("fail save time_off_balances");
                }
            }


            //insert time_off_balance_events
            if (count($arrDataInsertTimeOffBalanceEvent) > 0) {
                $modules->setModule('time_off_balance_events');
                $model = $modules->model;
                $model->setAllowedFields(array_keys($arrDataInsertTimeOffBalanceEvent[0]));
                $model->insertBatch($arrDataInsertTimeOffBalanceEvent);
            }
        }
    }

    public function handleDeleteBalance($modules, $arrEmployeeId, $typeId, $isDeleteBalance = false)
    {
        $modules->setModule('time_off_balance_events');
        $model = $modules->model;
        $builder = $model->where('type', $typeId);
        if (count($arrEmployeeId) > 0) {
            $builder->whereIn('employee', $arrEmployeeId);
        }
        if ($isDeleteBalance == false) {
            $builder->where('DATE_FORMAT(date,"%Y")', date('Y'));
            $builder->where('event', $this->accrualEvent);
        }
        $builder->delete();


        if ($isDeleteBalance == true) {
            $modules->setModule('time_off_balances');
            $model = $modules->model;
            $builder = $model->where('type', $typeId);
            if (count($arrEmployeeId) > 0) {
                $builder->whereIn('employee', $arrEmployeeId);
            }
            $builder->delete();
        }
    }

    public function recalculateEntitlement($idPolicy)
    {
        $modules = \Config\Services::modules();

        $modules->setModule('time_off_policies');
        $model = $modules->model;
        $infoTimeOffPolicy = (array)$model->find($idPolicy);
        $assignDate = $infoTimeOffPolicy['assign_date'];
        $accrualFrequency = $infoTimeOffPolicy['accrual_frequency'];
        $entitlement = $infoTimeOffPolicy['entitlement'];
        $prorateAccrual = $infoTimeOffPolicy['prorate_accrual'];
        $roundingRule = $infoTimeOffPolicy['rounding_rule'];
        $roundingUnit = $infoTimeOffPolicy['rounding_unit'];
        $numRound = $this->_getNumberRounding($roundingUnit);
        $employeeEligibility = json_decode($infoTimeOffPolicy['eligibility_employee']);

        //get list employee removed from time_off_balance_events
        $modules->setModule('time_off_balances');
        $modelTimeOffBalance = $modules->model;
        $builderEmployeeRemove = $modelTimeOffBalance->select('employee')->where('type', $infoTimeOffPolicy['type']);
        if (count($employeeEligibility) > 0) {
            $builderEmployeeRemove->whereNotIn('employee', $employeeEligibility);
        }
        $listEmployeeRemove = $builderEmployeeRemove->findAll();

        if (count($listEmployeeRemove) > 0) {
            $arrEmployeeId = array_column($listEmployeeRemove, 'employee');
            $modules->setModule('employees');
            $modelEmployee = $modules->model;
            $listEmployee = $this->_handleListEmployeeData($modelEmployee->whereIn('id', $arrEmployeeId)->findAll());

            foreach ($listEmployee as $row) {
                $row = (array)$row;
                $fromDate = $this->_getFromDate($row, $prorateAccrual, $assignDate)['date'];

                if (!$this->_validateDate($fromDate, $this->currentDate)) {
                    continue;
                }

                $totalEntitlement = 0;
                if ($accrualFrequency == $this->monthlyAccrualFrequency) {  // monthly
                    if (empty($prorateAccrual)) {
                        $totalEntitlement = $entitlement / 12 * (12 - intval(date('m', strtotime($fromDate))) + 1);
                    } else {
                        $workingDate = $this->_getDatePerMonth($fromDate);
                        $totalEntitlement = $entitlement / 12 * (12 - intval(date('m', strtotime($fromDate))) + $workingDate);
                    }
                    $totalEntitlement = $this->_roundDate($totalEntitlement, $roundingRule, $numRound);
                } else if ($accrualFrequency == $this->yearlyAccrualFrequency) { // yearly
                    if (empty($prorateAccrual)) {
                        $totalEntitlement = $entitlement;
                    } else {
                        $lastDate = date('t', strtotime($fromDate));
                        $monthNum = ((date('Y', strtotime($this->endYearDate)) - date('Y', strtotime($fromDate))) * 12)
                            + (date('m', strtotime($this->endYearDate)) - date('m', strtotime($fromDate)));
                        if (date('d', strtotime($fromDate)) == '01') {
                            $monthNum += 1;
                        } else {
                            $monthNum += intval(date('m', strtotime($fromDate))) / $lastDate;
                        }
                        $totalEntitlement = ($entitlement / 12) *  $monthNum;
                    }
                }
                $infoTimeOffBalance = (array)$modelTimeOffBalance->where('employee', $row['value'])->where('type', $infoTimeOffPolicy['type'])->first();
                if (isset($infoTimeOffBalance['id'])) {
                    // get total change time_off_balance_events: event = 'balance adjustment'
                    $dataInsertTimeOffBalance['id'] = $infoTimeOffBalance['id'];
                    $dataInsertTimeOffBalance = [
                        'id' => $infoTimeOffBalance['id'],
                        'entitlement' => $totalEntitlement
                    ];
                    $modelTimeOffBalance->setAllowedFields(array_keys($dataInsertTimeOffBalance));
                    try {
                        $modelTimeOffBalance->save($dataInsertTimeOffBalance);
                    } catch (\ReflectionException $e) {
                        throw new \Exception("fail save time_off_balances");
                    }
                }
            }
        }
    }

    // ** support function
    private function _validateDate($date, $currentDate)
    {
        if ($date == '' || $date == null || $date == '0000-00-00' || $date == '1970-01-01' || strtotime($date) > strtotime($currentDate)) {
            return false;
        }

        return true;
    }

    private function _getDatePerMonth($date)
    {
        $result = 0;
        if (date('d', strtotime($date)) == '01') {
            $result = 1;
        } else {
            $lastDate = date('t', strtotime($date));
            $result = (intval(date('d', strtotime($date)))) / $lastDate;
        }

        return $result;
    }

    private function _roundDate($dateNum, $roundingRule, $numRound = 0)
    {
        helper('app_select_option');
        if (empty($roundingRule) || $roundingRule == getOptionValue('time_off_policies', 'rounding_rule', 'none') || $numRound == 0) {
            return round($dateNum, 2);
        } else {
            $resultRound = 0;
            if ($roundingRule == $this->roundingRuleNearest) {
                $resultRound = round($dateNum / $numRound) * $numRound;
            } else if ($roundingRule == $this->roundingRuleUpTo) {
                $resultRound = ceil($dateNum / $numRound) * $numRound;
            } else if ($roundingRule == $this->roundingRuleDownTo) {
                $resultRound = floor($dateNum / $numRound) * $numRound;
            }
            return round($resultRound, 2);
        }
    }

    private function _handleListEmployeeData($listEmployee)
    {
        if (count($listEmployee) == 0) {
            return [];
        }
        $result = [];
        foreach ($listEmployee as $row) {
            $row = (array)$row;
            $result[] = [
                'value' => $row['id'],
                'label' => $row['full_name'],
                'join_date' => $row['join_date'],
                'probation_date' => $row['probation_end_date'] ?? ""
            ];
        }

        return $result;
    }

    private function _calculateTimeOffBalance($modules, $employeeId, $typeId, $carryover)
    {
        $modules->setModule('time_off_balance_events');
        $modelTimeOffBalanceEvent = $modules->model;
        $infoTimeOffBalanceEvent = $modelTimeOffBalanceEvent->asArray()
            ->selectSum('change')
            ->where('employee', $employeeId)
            ->where('type', $typeId)
            ->where('DATE_FORMAT(date,"%Y")', date('Y'))
            ->first();
        $change = (isset($infoTimeOffBalanceEvent['change'])) ? $infoTimeOffBalanceEvent['change'] : 0;

        return $change;
    }

    private function _getFromDate($infoEmployee, $prorateAccrual, $assignDate, $waitingPeriod = 0, $waitingPeriodType = 0, $waitingPeriodUnit = 0)
    {
        $monthNumber = 1;
        $joinDate = $infoEmployee['join_date'];
        $probationDate = $infoEmployee['probation_date'];
        $dateReturn = $startDate =  '';
        // In monthly accrual frequency if not switch prorate accrual fromDate = first date of Join month or Probation month
        // else fromDate = Join Date or Probation Date
        if (empty($prorateAccrual)) {
            $joinDate = date('Y-m-01', strtotime($joinDate));
            $probationDate = date('Y-m-01', strtotime($probationDate));
            $startDate = $dateReturn = ($assignDate == $this->assignDateJoinDate) ? date('Y-m-01', strtotime($joinDate)) : date('Y-m-01', strtotime($probationDate));
        } else {
            $startDate = $dateReturn = ($assignDate == $this->assignDateJoinDate) ? $joinDate : $probationDate;
        }

        if (strtotime($dateReturn) < strtotime(date('Y-01-01'))) {
            $dateReturn = date('Y-01-01');
        }

        if (!empty($waitingPeriod) && !empty($waitingPeriodType) && !empty($waitingPeriodUnit)) {
            $fromDate = $waitingPeriodType == $this->waitingPeriodTypeJoinDate ? $joinDate : $probationDate;
            if ($waitingPeriodUnit == $this->waitingPeriodUnitDay) {
                $dateReturn = date('Y-m-d', strtotime('+ ' . $waitingPeriod . ' days', strtotime($fromDate)));
                $duration = intval(date("m")) - intval(date("m", strtotime($dateReturn)));
            } else {
                $dateReturn = date('Y-m-d', strtotime('+ ' . $waitingPeriod . ' months', strtotime($fromDate)));
                $duration = $waitingPeriod;
            }
            $monthNumber += $duration;
        }

        if (!$this->_validateDate($dateReturn, $this->currentDate)) {
            return [
                'date' => '',
                'month_number' => 0
            ];
        }

        return [
            'date' => $dateReturn,
            'month_number' => $monthNumber
        ];
    }

    private function _getNumberRounding($roundingUnit)
    {
        helper('app_select_option');
        $numRound = 0;
        if ($roundingUnit == getOptionValue('time_off_policies', 'rounding_unit', 'quaterofday')) {
            $numRound = 0.25;
        } else if ($roundingUnit == getOptionValue('time_off_policies', 'rounding_unit', 'halfofday')) {
            $numRound = 0.5;
        } else if ($roundingUnit == getOptionValue('time_off_policies', 'rounding_unit', 'quaterofday')) {
            $numRound = 1;
        }

        return $numRound;
    }

    private function _handleTimeOffPolicyData($data)
    {
        $result = [];
        foreach ($data as $row) {
            $row = (array)$row;
            $result[$row['type']]['policy_id'] = $row['id'];
            $result[$row['type']]['carryover'] = $row['maximum_carry_over'];
        }

        return $result;
    }
}
