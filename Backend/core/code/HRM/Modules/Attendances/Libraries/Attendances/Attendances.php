<?php

namespace HRM\Modules\Attendances\Libraries\Attendances;

class Attendances
{
    public function createNewAttendanceSchedule()
    {
        $modules = \Config\Services::modules();
        $attendanceApprovalCycle = preference('attendance_approval_cycle');
        if (empty($attendanceApprovalCycle)) {
            return false;
        }

        $attendanceApprovalCycleNum = empty(preference('attendance_approval_cycle_num')) ? 0 : preference('attendance_approval_cycle_num');
        $attendanceStartDate = preference('attendance_start_date');
        $attendanceRepeatOn = !empty(preference('attendance_repeat_on')) ? json_decode(preference('attendance_repeat_on'), true) : [];
        $today = date('Y-m-d');

        $modules->setModule('attendances');
        $model = $modules->model;
        $infoAttendance = $model->asArray()->where('date_to >=', $today)->first();
        if (!$infoAttendance) {
            $infoLastAttendance = $model->asArray()->orderBy('date_to', 'DESC')->first();
            $currentAttendanceStartDate = empty($attendanceStartDate) ? $today : $attendanceStartDate;
            $startDateMonthly = $startDateWeekly = isset($infoLastAttendance['date_to'])
                ? date('Y-m-d', strtotime('+1 days', strtotime($infoLastAttendance['date_to'])))
                : $currentAttendanceStartDate;
            if ($attendanceApprovalCycle == 'weekly') {
                $totalSchedule = 1;
                $numDays = 7 * $attendanceApprovalCycleNum;

                if (strtotime($today) > strtotime($startDateWeekly)) {
                    $duration = (strtotime($today) - strtotime($startDateWeekly)) / (60 * 60 * 24);
                    $totalSchedule = $duration < 7 ? 1 : ceil($duration / $numDays);
                }
                for ($i = 1; $i <= $totalSchedule; $i++) {
                    $dateTo = date('Y-m-d', strtotime(' + ' . $numDays . ' days', strtotime($startDateWeekly)));
                    $name = $this->formatDateToLetter($startDateWeekly) . ' - ' . $this->formatDateToLetter($dateTo);
                    $dataInsert = [
                        'name' => $name,
                        'date_from' => $startDateWeekly,
                        'date_to' => $dateTo
                    ];
                    $model->setAllowedFields(array_keys($dataInsert));
                    $model->save($dataInsert);
                    $idAttendance = $model->getInsertID();
                    $this->_updateAttendanceId($idAttendance, $startDateWeekly, $dateTo);

                    $startDateWeekly = $dateTo;
                }
            } else if ($attendanceApprovalCycle == 'monthly') {
                $numYear = (date('Y', strtotime($today)) - date('Y', strtotime($startDateMonthly))) * 12;
                $numMonth = date('m', strtotime($today)) - date('m', strtotime($startDateMonthly));
                $totalSchedule = ($numYear + $numMonth) < 1 ? 1 : ($numYear + $numMonth);
                $startDateMonthlyForInsert = $startDateMonthly;
                $weekDayRepeatOn = $attendanceRepeatOn['value'];
                if ($attendanceRepeatOn['type'] == 'day_in_week') {
                    $weekDayNumOrder = $attendanceRepeatOn['num_order'];

                    for ($i = 1; $i <= $totalSchedule; $i++) {
                        $dateTo  = date('Y-m-01', strtotime(' + ' . $attendanceApprovalCycleNum . ' month', strtotime($startDateMonthly)));
                        $weekDayCurrentDateTo = date('w', strtotime($dateTo));
                        if ($weekDayRepeatOn == $weekDayCurrentDateTo) {
                            $durationDateTo = $weekDayRepeatOn + 1;
                        } elseif ($weekDayRepeatOn < $weekDayCurrentDateTo) {
                            $durationDateTo = ($weekDayRepeatOn + 7) - $weekDayCurrentDateTo;
                        } else {
                            $durationDateTo = $weekDayRepeatOn - $weekDayCurrentDateTo;
                        }

                        $durationDateTo = $durationDateTo + (($weekDayNumOrder - 1) * 7);
                        $dateToForInsert = date('Y-m-d', strtotime('+' . ($durationDateTo - 1) . ' days', strtotime($dateTo)));
                        $dateToTemp = date('Y-m-d', strtotime('+' . ($durationDateTo) . ' days', strtotime($dateTo)));
                        $name = $this->formatDateToLetter($startDateMonthlyForInsert) . ' - ' . $this->formatDateToLetter($dateToForInsert);

                        $dataInsert = [
                            'name' => $name,
                            'date_from' => $startDateMonthlyForInsert,
                            'date_to' => $dateToForInsert
                        ];
                        
                        $model->setAllowedFields(array_keys($dataInsert));
                        $model->save($dataInsert);
                        $idAttendance = $model->getInsertID();
                        $this->_updateAttendanceId($idAttendance, $startDateMonthly, $dateTo);

                        $startDateMonthly = $dateTo;
                        $startDateMonthlyForInsert = $dateToTemp;
                    }
                } else {
                    $totalSchedule += 1;
                    for ($i = 1; $i <= $totalSchedule; $i++) {
                        if (strtotime($startDateMonthly) > strtotime($today)) {
                            break;
                        }

                        $dateTo = date('Y-m-d', strtotime(' + ' . $attendanceApprovalCycleNum . ' month', strtotime($startDateMonthly)));
                        $dateToTemp = date('Y-m-d', strtotime('-1 days', strtotime($dateTo)));

                        $name = $this->formatDateToLetter($startDateMonthly) . ' - ' . $this->formatDateToLetter($dateToTemp);

                        $dataInsert = [
                            'name' => $name,
                            'date_from' => $startDateMonthly,
                            'date_to' => $dateToTemp
                        ];

                        $model->setAllowedFields(array_keys($dataInsert));
                        $model->save($dataInsert);
                        $idAttendance = $model->getInsertID();
                        $this->_updateAttendanceId($idAttendance, $startDateMonthly, $dateTo);

                        $startDateMonthly = $dateTo;
                    }
                }
            }
        }
    }

    public function recalculateAttendance()
    {
        $modules = \Config\Services::modules();

        $attendanceApprovalCycle = preference('attendance_approval_cycle');
        $attendanceApprovalCycleNum = preference('attendance_approval_cycle_num');
        $startDateMonthly = $startDateWeekly = $attendanceStartDate = preference('attendance_start_date');
        if (strtotime($attendanceStartDate) > strtotime(date('Y-m-d'))) {
            $modules->setModule('attendances');
            $model = $modules->model;

            //delete all data attendance
            $model->where('date_from <', $attendanceStartDate)->delete();

            //insert new attendance
            $listAttendanceInsert = [];
            if ($attendanceApprovalCycle == 'monthly') {
                for ($i = 1; $i <= 12; $i++) {
                    $fromDate = date('Y-m-d', strtotime('-1 day', strtotime('-1 month', strtotime($startDateMonthly))));
                    if (strtotime($fromDate) <= strtotime(date('Y-m-d'))) {
                        $arrayPush = [
                            'date_from' => $fromDate,
                            'date_to' => $startDateMonthly,
                            'name' => $this->formatDateToLetter($fromDate) . ' - ' . $this->formatDateToLetter($startDateMonthly)
                        ];
                        $listAttendanceInsert[] = $arrayPush;
                    }
                    $startDateMonthly = date('Y-m-d', strtotime('-1 month', strtotime($startDateMonthly)));
                }
            } else if ($attendanceApprovalCycle == 'weekly' && !empty($attendanceApprovalCycleNum)) {
                $startDateWeekly = date('Y-m-d', strtotime('-1 day', strtotime($startDateWeekly)));
                $numDays = $attendanceApprovalCycleNum * 7;
                $totalSchedule = floor(365 / $numDays);
                for ($i = 1; $i <= $totalSchedule; $i++) {
                    $fromDate = date('Y-m-d', strtotime('- ' . $numDays  . ' day', strtotime($startDateWeekly)));
                    $toDate = date('Y-m-d', strtotime('-1 day', strtotime($startDateWeekly)));
                    if (strtotime($fromDate) <= strtotime(date('Y-m-d'))) {
                        $arrayPush = [
                            'date_from' => $fromDate,
                            'date_to' => $toDate,
                            'name' => $this->formatDateToLetter($fromDate) . ' - ' . $this->formatDateToLetter($toDate)
                        ];
                        $listAttendanceInsert[] = $arrayPush;
                    }
                    $startDateWeekly = $fromDate;
                }
            }

            $listAttendanceNew = [];
            if (count($listAttendanceInsert) > 0) {
                $listAttendanceRevert = array_reverse($listAttendanceInsert);
                foreach ($listAttendanceRevert as $row) {
                    $arrayPush = $row;
                    $model->setAllowedFields(array_keys($arrayPush));
                    $model->save($arrayPush);
                    $id = $model->getInsertID();
                    $arrayPush['id'] = $id;
                    $listAttendanceNew[] = $arrayPush;
                }
            }

            // update attendance id in attendance_detail
            if (count($listAttendanceNew) > 0) {
                //get list attendance detail
                $modules->setModule('attendance_details');
                $model = $modules->model;
                $listAttendanceDetail = $model->select(['id', 'date', 'attendance'])
                    ->asArray()
                    ->where('date <', $attendanceStartDate)
                    ->findAll();
                foreach ($listAttendanceDetail as $keyAttendanceDetail => $rowAttendanceDetail) {
                    foreach ($listAttendanceNew as $keyAttendance => $rowAttendance) {
                        if (
                            strtotime($rowAttendanceDetail['date']) >= strtotime($rowAttendance['date_from'])
                            && strtotime($rowAttendanceDetail['date']) <= strtotime($rowAttendance['date_to'])
                        ) {
                            $listAttendanceDetail[$keyAttendanceDetail]['attendance'] = $rowAttendance['id'];
                        }
                    }
                }
                $model->setAllowedFields([
                    'id',
                    'attendance'
                ]);
                $model->updateBatch($listAttendanceDetail, 'id');
            }
        }
    }

    public function formatDateToLetter($date)
    {
        return date('d M Y', strtotime($date));
    }

    // ** support function
    private function _updateAttendanceId($attendanceId, $fromDate, $toDate)
    {
        $modules = \Config\Services::modules('attendance_details');
        $model = $modules->model;

        $listAttendanceDetail = $model->asArray()
            ->where('date >= ', $fromDate)
            ->where('date <= ', $toDate)
            ->findAll();

        foreach ($listAttendanceDetail as $rowAttendanceDetail) {
            $dataUpdate = [
                'id' => $rowAttendanceDetail['id'],
                'attendance' => $attendanceId
            ];

            $model->setAllowedFields(array_keys($dataUpdate));
            $model->save($dataUpdate);
        }
    }
}
