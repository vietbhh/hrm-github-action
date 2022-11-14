<?php

namespace HRM\Modules\Timeoff\Config;

class Cronjob
{
    public function calculate_employee_balance()
    {
        $timeOff = $timeOff = \HRM\Modules\TimeOff\Libraries\TimeOff\Config\Services::TimeOff();
        $status = false;
        if (strtotime('Y-m-d') == strtotime('Y-m-d')) {
            $status = $timeOff->updateEmployeeBalanceCarryover();
        } else {
            $status = true;
        }

        if ($status) {
            $timeOff->updateEmployeeBalance();
        }
    }

    public function expire_carryover_balance()
    {
        $timeOff = \HRM\Modules\TimeOff\Libraries\TimeOff\Config\Services::TimeOff();
        $timeOff->updateCarryoverBalance();
    }
}
