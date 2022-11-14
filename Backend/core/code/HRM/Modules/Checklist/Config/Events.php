<?php

namespace HRM\Modules\Checklist\Config;

class Events
{
    public function sendMailAssignChecklist($data)
    {
        helper('view');
        if (!isset($data['checklist_detail']) || empty($data['checklist_detail']) || count($data['checklist_detail']) == 0) {
            return false;
        }

        $listDataSendMail = [];
        foreach ($data['checklist_detail'] as $row) {
            $dataPush = [
                'receiver_id' => $row['assignee']['value'],
                'receiver_email' => $row['assignee']['email'],
                'receiver_name' => $row['assignee']['label'],
                'employee_id' => $data['checklist']['employee_id']['value'],
                'employee_name' => $data['checklist']['employee_id']['label'],
                'type' => $data['checklist']['type']['name_option'],
                'list_task' => [['task_name' => $row['task_name']]]
            ];

            if (!isset($listDataSendMail[$row['assignee']['value']])) {
                $listDataSendMail[$row['assignee']['value']] = $dataPush;
            } else {
                $listDataSendMail[$row['assignee']['value']]['list_task'][] = [
                    'task_name' => $row['task_name']
                ];
            }
        }

        if (count($listDataSendMail) > 0) {
            $mail = \Config\Services::mail();
            $subject = 'New Tasks';

            foreach ($listDataSendMail as $row) {
                $to =  $row['receiver_email'];
                if (!empty($to)) {
                    if ($row['receiver_id'] == $row['employee_id']) {
                        $subject = 'Start onboarding now';
                    }

                    $content = getMailTemplates('HRM\Modules\Checklist\Views\MailTemplates\assignChecklist', [
                        'data' => $row
                    ]);
                    $mail->send($subject, $to, $content);
                }
            }
        }
    }

    public function sendMailUpdateChecklist($data)
    {
        helper('view');
        $mail = \Config\Services::mail();

        $to =  $data['receiver_email'];
        if (!empty($to)) {
            $subject = $data['updated_by'] . ' updated Checklist';
            $content = getMailTemplates('HRM\Modules\Checklist\Views\MailTemplates\updateChecklist', [
                'data' => $data
            ]);
            $mail->send($subject, $to, $content);
        }
    }

    public function sendMailOffTrack($data)
    {
        helper('view');
        $mail = \Config\Services::mail();


        $arrUpdate = [];
        foreach ($data as $row) {
            $to =  $row['receiver_email'];
            if (!empty($to)) {
                $subject = 'Off-track ' . $row['type'];

                $content = getMailTemplates('HRM\Modules\Checklist\Views\MailTemplates\offTrack', [
                    'data' => $row
                ]);

                $result = $mail->send($subject, $to, $content);
                if ($result) {
                    $arrUpdate[$row['checklist_id']] = [
                        'id' => $row['checklist_id'],
                        'send_mail' => 1
                    ];
                }
            }
        }

        if (count($arrUpdate)  > 0) {
            $modules = \Config\Services::modules('checklist');
            $model = $modules->model;

            $model->setAllowedFields([
                'id',
                'send_mail'
            ]);
            $model->updateBatch($arrUpdate, 'id');
        }
    }

    public function sendMailOffBoarding($data)
    {
        helper('view');
        if (!isset($data['checklist_detail']) || empty($data['checklist_detail']) || count($data['checklist_detail']) == 0) {
            return false;
        }

        $listDataSendMail = [];
        foreach ($data['checklist_detail'] as $row) {
            $dataPush = [
                'receiver_id' => $row['assignee']['value'],
                'receiver_email' => $row['assignee']['email'],
                'receiver_name' => $row['assignee']['label'],
                'employee_id' => $data['checklist']['employee_id']['value'],
                'employee_name' => $data['checklist']['employee_id']['label'],
                'type' => $data['checklist']['type']['name_option'],
                'list_task' => [['task_name' => $row['task_name']]]
            ];

            if (!isset($listDataSendMail[$row['assignee']['value']])) {
                $listDataSendMail[$row['assignee']['value']] = $dataPush;
            } else {
                $listDataSendMail[$row['assignee']['value']]['list_task'][] = [
                    'task_name' => $row['task_name']
                ];
            }
        }

        if (count($listDataSendMail) > 0) {
            $mail = \Config\Services::mail();
            
            foreach ($listDataSendMail as $row) {
                $to =  $row['receiver_email'];
                if (!empty($to)) {
                    if ($row['receiver_id'] == $row['employee_id']) {
                        $subject = 'It is too soon to say goodbye…';
                        $content = getMailTemplates('HRM\Modules\Checklist\Views\MailTemplates\offBoarding', [
                            'data' => $row
                        ]);
                    } else {
                        $subject = 'New Tasks';
                        $content = getMailTemplates('HRM\Modules\Checklist\Views\MailTemplates\assignChecklist', [
                            'data' => $row
                        ]);
                    }

                    $mail->send($subject, $to, $content);
                }
            }
        }
    }
}
