<?php

namespace HRM\Modules\Checklist\Config;

class Cronjob
{
    // ** cronjob send mail off track checklist
    public function send_mail_off_track_checklist()
    {
        $today = date('Y-m-d');
        $modules = \Config\Services::modules('checklist');
        $model = $modules->model;

        $listChecklist = $model
            ->asArray()
            ->select([
                'm_checklist.id',
                'm_checklist.name',
                'm_checklist.hr_in_charge',
                'm_checklist.employee_id',
                'm_checklist.type',
                'm_checklist.task_number',
                'm_checklist.complete_task',
                'm_checklist_detail.task_name',
                'm_checklist_detail.due_date',
                'm_checklist_detail.complete_date'
            ])
            ->join('m_checklist_detail', 'm_checklist_detail.checklist_id = m_checklist.id', 'inner')
            ->where('m_checklist.send_mail !=', 1)
            ->findAll();
        $listChecklist = handleDataBeforeReturn($modules, $listChecklist, true);

        $listChecklistOffTrack = [];
        foreach ($listChecklist as $row) {
            $dataPush = $row;
            $dataPush['off_track_task'] = [];
            $dataPush['remain_task_number'] = 0;
            if (!isset($listChecklistOffTrack[$row['id']])) {
                $listChecklistOffTrack[$row['id']] = $dataPush;
            }
            if (strtotime($row['due_date']) < strtotime($today) && empty($row['complete_date'])) {
                $listChecklistOffTrack[$row['id']]['off_track_task'][] = $row['task_name'];
            } else {
                $listChecklistOffTrack[$row['id']]['remain_task_number'] += 1;
            }
        }

        if (count($listChecklistOffTrack) > 0) {
            $arrDataSendMail = [];
            foreach ($listChecklistOffTrack as $row) {
                if (count($row['off_track_task']) > 0 && $row['remain_task_number'] == 0) {
                    $arrDataSendMail[] = [
                        'checklist_id' => $row['id'],
                        'receiver_type' => 'hr_in_charge',
                        'receiver_id' => $row['hr_in_charge']['value'],
                        'receiver_email' => $row['hr_in_charge']['email'],
                        'receiver_name' => $row['hr_in_charge']['full_name'],
                        'assignee_name' => $row['employee_id']['full_name'],
                        'type' => $row['type']['name_option'],
                    ];

                    $arrDataSendMail[] = [
                        'checklist_id' => $row['id'],
                        'receiver_type' => 'employee',
                        'receiver_id' => $row['employee_id']['value'],
                        'receiver_email' => $row['employee_id']['email'],
                        'receiver_name' => $row['employee_id']['full_name'],
                        'type' => $row['type']['name_option'],
                    ];
                }
            }

            if (count($arrDataSendMail) > 0) {
                \CodeIgniter\Events\Events::trigger('send_mail_off_track_checklist', $arrDataSendMail);
            }
        }
    }
}
