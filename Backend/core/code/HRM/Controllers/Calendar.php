<?php

namespace HRM\Controllers;

use App\Controllers\ErpController;
use DateTime;
use HRM\Modules\Employees\Models\EmployeesModel;

class Calendar extends ErpController
{
    public function load_get()
    {
        $modules = \Config\Services::modules();

        $filter = $this->request->getGet();
        $calendarTag = isset($filter['calendar_tag']) ? $filter['calendar_tag'] : [];

        $modules->setModule('calendars');
        $modelCalendar = $modules->model;
        $builderCalendar = $modelCalendar->asArray();
        if (count($calendarTag) > 0 && !in_array('all', $calendarTag)) {
            $builderCalendar->whereIn('calendar_tag', $calendarTag);
        }
        $listCalendar = $builderCalendar->findAll();
        $listCalendarFilter = [];
        // get edit, view permission
        $currentUser = user();
        $userId = $currentUser->id;
        $userOffice = $currentUser->office;
        if (count($listCalendar) > 0) {
            foreach ($listCalendar as  $rowCalendar) {
                $arrayPush = $rowCalendar;

                $arrPermission = $this->_getEventPermission($rowCalendar,  $currentUser);

                $arrayPush['is_editable'] = $arrPermission['is_editable'];

                if ($arrPermission['is_viewable']) {
                    $listCalendarFilter[] = $arrayPush;
                }
            }
        }
        $listCalendar = handleDataBeforeReturn($modules, $listCalendarFilter, true);

        // get list all day event
        $arrAllDay = [];
        if (count($listCalendar) > 0) {
            foreach ($listCalendar as $key => $row) {
                if ($row['allday']) {
                    $date = date('Y-m-d', strtotime($row['start']));
                    $arrPush = [
                        'id' => $row['id'],
                        'start' => $date,
                        'end' => $date,
                        'allday' => true,
                        'is_all_day' => true,
                        'title' => 'All day',
                        'is_editable' => false,
                        'is_viewable' => false,
                        'list_event' => [$row]
                    ];
                    
                    if (!isset($arrAllDay[$date])) {
                        $arrAllDay[$date] = $arrPush;
                    } else {
                        $arrAllDay[$date]['list_event'][] = $row;
                    }

                    unset($listCalendar[$key]);
                }
            }
        }

        $arrAllDay = $this->_getListAllDayEvent($modules, $arrAllDay, $userOffice, $userId);


        $listCalendar = array_merge(
            $listCalendar,
            array_values($arrAllDay)
        );

        return $this->respond([
            'results' => $listCalendar
        ]);
    }

    public function load_calendar_tag_get()
    {
        $modules = \Config\Services::modules('calendar_tags');
        $model = $modules->model;

        $listCalendarTag = handleDataBeforeReturn($modules, $model->asArray()->orderBy('id', 'ASC')->findAll(), true);

        $googleService = \App\Libraries\Google\Config\Services::google();
        $userSync = $googleService->getInfoUserSyncedGoogle();

        return $this->respond([
            'results' => $listCalendarTag,
            'user_sync' => $userSync
        ]);
    }

    public function get_event_detail_get($id)
    {
        $modules = \Config\Services::modules('calendars');
        $model = $modules->model;

        $infoEvent = $model->asArray()->find($id);

        if (!$infoEvent) {
            return $this->failNotFound();
        }

        $arrPermission = $this->_getEventPermission($infoEvent,  user());

        if (!$arrPermission['is_viewable']) {
            return $this->failForbidden();
        }

        $infoEvent['is_editable'] = $arrPermission['is_editable'];

        return $this->respond([
            'data' => handleDataBeforeReturn($modules, $infoEvent)
        ]);
    }

    // ** support function
    private function _getListAllDayEvent($modules, $arrAllDay, $userOffice, $userId)
    {
        helper('app_select_option');
        // get list employee dob
        $modelEmployee = new EmployeesModel();
        $listEmployee = $modelEmployee->exceptResigned()->asArray()->findAll();
        foreach ($listEmployee as $rowEmployee) {
            $dateOfBirth = $rowEmployee['dob'];
            if (
                $dateOfBirth != ''
                && $dateOfBirth != null
                && $dateOfBirth != '0000-00-00'
                && $dateOfBirth != '1970-01-01'
            ) {
                $dateMonth = date('m-d', strtotime($dateOfBirth));
                $employeeInfo = [
                    'id' => $rowEmployee['id'],
                    'full_name' => $rowEmployee['full_name'],
                    'email' => $rowEmployee['email'],
                    'avatar' => $rowEmployee['avatar']
                ];
                $arrayPush = [
                    'start' => date('Y-' . $dateMonth),
                    'end' => date('Y-' . $dateMonth),
                    'allday' => true,
                    'is_dob' => true,
                    'title' => 'birthday',
                    'is_editable' => false,
                    'is_viewable' => true,
                    'employee_info' => [$employeeInfo]
                ];
                if (!isset($arrAllDay[date('Y-' . $dateMonth)])) {
                    $arrAllDay[date('Y-' . $dateMonth)] = $arrayPush;
                } else {
                    $arrAllDay[date('Y-' . $dateMonth)]['is_dob'] = true;
                    $arrAllDay[date('Y-' . $dateMonth)]['employee_info'][] = $employeeInfo;
                }
            }
        }

        // get list holiday
        $modules->setModule('time_off_holidays');
        $model = $modules->model;

        $listHoliday = $model
            ->asArray()
            ->where('office_id', $userOffice)
            ->findAll();

        foreach ($listHoliday as $rowHoliday) {
            $fromDate = $rowHoliday['from_date'];
            $toDate = $rowHoliday['to_date'];

            $holidayInfo = [
                'id' => $rowHoliday['id'],
                'from_date' => date('d M Y', strtotime($fromDate)),
                'to_date' => date('d M Y', strtotime($toDate)),
                'name' => $rowHoliday['name']
            ];

            $begin = new DateTime($fromDate);
            $end   = new DateTime($toDate);

            for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
                $date = $i->format('Y-m-d');
                $arrayPush = [
                    'start' => $date,
                    'end' => $date,
                    'allday' => true,
                    'is_holiday' => true,
                    'title' => 'holiday',
                    'is_editable' => false,
                    'is_viewable' => false,
                    'holiday_info' => [$holidayInfo]
                ];
                if (!isset($arrAllDay[$date])) {
                    $arrAllDay[$date] = $arrayPush;
                } else {
                    $arrAllDay[$date]['is_holiday'] = true;
                    $arrAllDay[$date]['holiday_info'][] = $holidayInfo;
                }
            }
        }

        // get list time off
        $modules->setModule('time_off_requests');
        $model = $modules->model;

        $listTimeOff = $model
            ->asArray()
            ->select([
                'm_time_off_requests.id',
                'm_time_off_requests.note',
                'm_time_off_requests.status',
                'm_time_off_requests.date_from',
                'm_time_off_requests.time_from',
                'm_time_off_requests.date_to',
                'm_time_off_requests.time_to',
                'm_time_off_requests.is_full_day',
                'm_time_off_types.name as type_name'
            ])
            ->join('m_time_off_types', 'm_time_off_types.id = m_time_off_requests.type', 'inner')
            ->whereIn('status', [
                getOptionValue('time_off_requests', 'status', 'approved'),
                getOptionValue('time_off_requests', 'status', 'pending')
            ])
            ->where('m_time_off_requests.owner', $userId)
            ->findAll();

        foreach ($listTimeOff as $rowTimeOff) {
            $fromDate = $rowTimeOff['date_from'];
            $toDate = $rowTimeOff['date_to'];

            $timeOffInfo = [
                'id' => $rowTimeOff['id'],
                'note' => $rowTimeOff['note'],
                'status' => $rowTimeOff['status'],
                'is_pending' => ($rowTimeOff['status'] == getOptionValue('time_off_requests', 'status', 'pending')),
                'from_date' => date('d M Y H:i A', strtotime($rowTimeOff['date_from'] . ' ' . $rowTimeOff['time_from'])),
                'to_date' => date('d M Y H:i A', strtotime($rowTimeOff['date_to'] . ' ' . $rowTimeOff['time_to'])),
                'type_name' => $rowTimeOff['type_name']
            ];

            $begin = new DateTime($fromDate);
            $end   = new DateTime($toDate);

            for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
                $date = $i->format('Y-m-d');
                $arrayPush = [
                    'start' => $date,
                    'end' => $date,
                    'allday' => $rowTimeOff['is_full_day'],
                    'is_time_off' => true,
                    'title' => 'time_off',
                    'is_editable' => false,
                    'is_viewable' => false,
                    'time_off_info' => [$timeOffInfo]
                ];
                if (!isset($arrAllDay[$date])) {
                    $arrAllDay[$date] = $arrayPush;
                } else {
                    $arrAllDay[$date]['is_time_off'] = true;
                    $arrAllDay[$date]['time_off_info'][] = $timeOffInfo;
                }
            }
        }

        // get list checklist
        $modules->setModule('checklist_detail');
        $model = $modules->model;
        $listChecklist = $model->asArray()
            ->where('assignee', $userId)
            ->where('status', getOptionValue('checklist_detail', 'status', 'inprogress'))
            ->findAll();

        foreach ($listChecklist as $rowChecklist) {
            $date = $rowChecklist['due_date'];

            $arrPush = [
                'id' => $rowChecklist['id'],
                'start' => $date,
                'end' => $date,
                'allday' => true,
                'is_checklist' => true,
                'title' => 'All day',
                'is_editable' => false,
                'is_viewable' => false,
                'list_checklist' => [$rowChecklist]
            ];

            if (!isset($arrAllDay[$date])) {
                $arrAllDay[$date] = $arrPush;
            } else {
                $arrAllDay[$date]['is_checklist'] = true;
                $arrAllDay[$date]['list_checklist'][] = $rowChecklist;
            }
        }

        return $arrAllDay;
    }

    private function _getEventPermission($infoEvent, $currentUser)
    {
        $isEditable = 0;
        $isViewable = false;

        $owner = $infoEvent['owner'];
        $viewPermissionType = $infoEvent['view_permission_type'];
        $department = empty($infoEvent['department']) ? [] : json_decode($infoEvent['department'], true);
        $office = empty($infoEvent['office']) ? [] : json_decode($infoEvent['office'], true);
        $specificEmployee = empty($infoEvent['specific_employee']) ? [] : json_decode($infoEvent['specific_employee'], true);

        $userId = $currentUser->id;
        $userOffice = $currentUser->office;
        if ($owner == $userId) {
            $isEditable = 1;
            $isViewable = true;
        } else {
            if ($viewPermissionType === 'everyone') {
                $isViewable = true;
            } else {
                switch ($viewPermissionType) {
                    case "office":
                        $isViewable = (!empty($userOffice)) && in_array($userOffice, $office);
                        break;
                    case "department":
                        $isViewable = (!empty($userDepartment)) && in_array($userOffice, $department);
                        break;
                    case "specific_employee":
                        $isViewable =  in_array($userId, $specificEmployee);
                        break;
                    default:
                        $isViewable = false;
                        break;
                }
            }
        }

        return [
            'is_editable' => $isEditable,
            'is_viewable' => $isViewable
        ];
    }
}
