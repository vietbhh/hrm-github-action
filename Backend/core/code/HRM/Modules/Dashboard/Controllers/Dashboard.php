<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : dashboard
* Controller name : Dashboard
* Time created : 04/06/2022 15:00:11
*/

namespace HRM\Modules\Dashboard\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\WorkSchedule\Models\WorkScheduleModel;
use stdClass;

class Dashboard extends ErpController
{
	private $datetoday = '';
	private int $limit = 4;
	private int $user_id = 0;

	public function index_get()
	{
		return $this->respond([]);
	}

	public function __construct()
	{
		helper('app_select_option');
		$this->datetoday = date('Y-m-d');
		$this->user_id = user_id();
	}

	public function get_dashboard_get()
	{
		return $this->respond([]);
	}

	public function get_dob_get()
	{
		$modules = \Config\Services::modules();
		$data_dob = $this->getDob($modules);

		return $this->respond($data_dob);
	}

	public function get_data_attendance_get()
	{
		$modules = \Config\Services::modules();
		$data_attendance = $this->getAttendance($modules);

		return $this->respond($data_attendance);
	}

	public function get_data_off_get()
	{
		$modules = \Config\Services::modules();
		$data_off = $this->getWhoOffToDay($modules);

		return $this->respond($data_off);
	}

	public function get_data_my_time_off_get()
	{
		$modules = \Config\Services::modules();
		$data_my_time_off = $this->getMyTimeOff($modules);

		return $this->respond($data_my_time_off);
	}

	public function get_data_pending_approval_get()
	{
		$modules = \Config\Services::modules();
		// time off
		$data_time_off_get = $this->getTimeOff($modules);
		$data_time_off = array_slice($data_time_off_get['data_time_off'], 0, $this->limit);
		$count_data_time_off = $data_time_off_get['count_data_time_off'];

		// time attendance
		$data_time_attendance_get = $this->getTimeAttendance($modules);
		$data_time_attendance = array_slice($data_time_attendance_get['data_time_attendance'], 0, $this->limit);
		$count_data_time_attendance = $data_time_attendance_get['count_data_time_attendance'];

		// pending approval
		$count_pending_approval = $count_data_time_off + $count_data_time_attendance;

		$out['data_time_off'] = $data_time_off;
		$out['count_data_time_off'] = $count_data_time_off;
		$out['data_time_attendance'] = $data_time_attendance;
		$out['count_data_time_attendance'] = $count_data_time_attendance;
		$out['count_pending_approval'] = $count_pending_approval;

		return $this->respond($out);
	}

	public function get_data_check_list_get()
	{
		$data_check_list = $this->getChecklistData();

		return $this->respond($data_check_list);
	}

	public function save_widget_post()
	{
		$getParam = $this->request->getPost();
		$data = json_decode($getParam['data'], true);
		preference("dashboard_widget", $data);
		return $this->respond($data);
	}

	public function update_loading_dashboard_get()
	{
		return $this->respond(ACTION_SUCCESS);
	}

	public function get_department_get()
	{
		$modules = \Config\Services::modules('departments');
		$model = $modules->model;
		$listDepartment = $model->asArray()->orderBy('id ASC')->findAll();

		$modules->setModule('employees');
		$employeeModel = $modules->model;
		$arrParent = [];

		$dashboard_department_show = preference('dashboard_department_show');
		$arrShow = $dashboard_department_show ? $dashboard_department_show : [];

		foreach ($listDepartment as $key => $item) {
			if ($arrShow && in_array($item['id'], $arrShow) ) {
				$item['employees'] = [];
				$arrParent[] = $item;
				continue;
			}

			if (!$arrShow && !$item['parent'] && count($arrParent) < 3) {
				$item['employees'] = [];
				$arrParent[] = $item;
			}
		}

		foreach ($arrParent as $key => $val) {
			$departmentChild = $this->getDepartmentChilds($listDepartment, $val['id']);
			$departmentChild[] = $val;

			foreach (array_column($departmentChild, 'id') as $idDep) {
				$employees = $employeeModel->asArray()->select('id,full_name,avatar')->where('department_id', $idDep)->findAll();
				array_push($arrParent[$key]['employees'], ...$employees);
				$arrParent[$key]['deparments_child'][] = $idDep;
			}
		}

		return $this->respond($arrParent);
	}

	public function get_attendance_setting_get()
	{
		$modules = \Config\Services::modules('attendance_setting');
		$model = $modules->model;

		$currentUser = user();
		$userOffice = $currentUser->office;

		$attendanceSettingInfo = $model->asArray()
			->where('offices', $userOffice)
			->first();

		return $this->respond([
			'data' => handleDataBeforeReturn($modules, $attendanceSettingInfo)
		]);
	}

	public function get_attendance_today_get()
	{
		$currentUserId = user_id();

		$modules = \Config\Services::modules('attendances');
		$model = $modules->model;

		$result = [
			'info_attendance' => new stdClass(),
			'list_attendance_detail' => [],
			'attendance_today' => new stdClass()
		];

		$infoAttendance = $model->asArray()
			->where("date_from <=", date('Y-m-d'))
			->where("date_to >=", date('Y-m-d'))
			->first();

		if ($infoAttendance) {
			$attendanceId = $infoAttendance['id'];

			$result['info_attendance'] = handleDataBeforeReturn($modules, $infoAttendance);

			$modules->setModule('attendance_details');
			$model = $modules->model;
			$listAttendanceDetail = $model->asArray()
				->where('attendance', $attendanceId)
				->where('employee', $currentUserId)
				->where('date', date('Y-m-d'))
				->orderBy('clock_in', 'ASC')
				->findAll();
			$result['list_attendance_detail'] = handleDataBeforeReturn($modules, $listAttendanceDetail, true);
			$result['attendance_today'] = reset($result['list_attendance_detail']);
		}

		// get work schedule today
		$modules->setModule('employees');
		$model = $modules->model;
		$currentEmployee = $model->asArray()->find($currentUserId);

		$model = new WorkScheduleModel();
		$arrWorkingDay = $model->findFormat($currentEmployee['work_schedule'])['day'];
		$result['work_schedule_today'] = $arrWorkingDay[date('w')];

		return $this->respond($result);
	}

	public function update_view_department()
	{
		$postData = $this->request->getPost();
		if (isset($postData['department']) && isset($postData['id']) && $postData['id']) {
			if (!preference('dashboard_department_show')) {
				preference('dashboard_department_show', '', true);
				preference('dashboard_department_show', $postData['department'], false, $postData['id']);
			} else {
				preference('dashboard_department_show', $postData['department'], false, $postData['id']);
			}

		}
		return $this->respond(ACTION_SUCCESS);
	}

	/**
	 *  support function
	 */
	private function getDob($modules)
	{
		$modules->setModule("employees");
		$employeeModel = $modules->model;
		$month = date('m');
		return $employeeModel->where("Month(dob) = '$month'")->select("id, full_name, dob, username, email, avatar, Day(dob) as day")->orderBy('day', 'asc')->asArray()->findAll();
	}

	private function getAttendance($modules)
	{
		$modules->setModule("attendance_details");
		$model = $modules->model;
		$model->join("m_employees", "m_employees.id = m_attendance_details.employee");
		$data_attendance_db = $model->where('date', $this->datetoday)->where("clock_in != '' and clock_in is not null")->select("m_attendance_details.clock_in as clock_in, m_employees.full_name as full_name, m_employees.username as username, m_employees.avatar as avatar")->orderBy('clock_in', 'desc')->asArray()->findAll($this->limit, 0);

		$data_attendance = [];
		foreach ($data_attendance_db as $item) {
			$clock_in = date("H:i:s", strtotime($item['clock_in']));
			$arr = $item;
			$arr['clock_in_hour'] = $clock_in;
			$data_attendance[] = $arr;
		}

		return $data_attendance;
	}

	private function getWhoOffToDay($modules)
	{
		$modules->setModule("time_off_requests");
		$model = $modules->model;
		$module = $modules->getModule();
		$model->join("m_employees", "m_employees.id = m_time_off_requests.created_by");
		$data_off = $model->where("'$this->datetoday' between date_from and date_to")
			->where("m_time_off_requests.status", getOptionValue($module, "status", "approved"))
			->select("m_employees.full_name as full_name, m_employees.username as username, m_employees.avatar as avatar, m_time_off_requests.total_day as total_day, m_time_off_requests.date_from as date_from, m_time_off_requests.date_to as date_to")
			->asArray()->findAll();

		return $data_off;
	}

	private function getMyTimeOff($modules)
	{
		$modules->setModule("time_off_requests");
		$model = $modules->model;
		$module = $modules->getModule();
		$model->join("m_time_off_types", "m_time_off_types.id = m_time_off_requests.type");
		$data_my_time_off = $model->where("m_time_off_requests.created_by", $this->user_id)
			->where("m_time_off_requests.status", getOptionValue($module, "status", "pending"))
			->select("m_time_off_types.name as name, m_time_off_requests.total_day as total_day, m_time_off_requests.date_from as date_from, m_time_off_requests.date_to as date_to, m_time_off_requests.time_from as time_from, m_time_off_requests.time_to as time_to")
			->orderBy('date_from', 'desc')
			->asArray()->findAll($this->limit, 0);

		return $data_my_time_off;
	}

	private function getTimeOff($modules)
	{
		$modules->setModule("time_off_requests");
		$model = $modules->model;
		$module = $modules->getModule();
		$model->join("m_time_off_types", "m_time_off_types.id = m_time_off_requests.type");
		$model->join("m_employees", "m_employees.id = m_time_off_requests.created_by");
		$isManage = isSuper("time_off_requests");
		if (!$isManage) {
			$model->where("m_time_off_requests.created_by", $this->user_id);
		}
		$data_time_off = $model->where("m_time_off_requests.status", getOptionValue($module, "status", "pending"))
			->select("m_time_off_types.name as name, m_time_off_requests.total_day as total_day, m_employees.full_name as full_name, m_employees.avatar as avatar")
			->orderBy('date_from', 'desc')
			->asArray()->findAll();
		$count_data_time_off = count($data_time_off);

		return ['data_time_off' => $data_time_off, 'count_data_time_off' => $count_data_time_off];
	}

	private function getTimeAttendance($modules)
	{
		$modules->setModule("attendance_details");
		$model = $modules->model;
		$module = $modules->getModule();
		$model->join("m_employees", "m_employees.id = m_attendance_details.employee");
		$model->join("m_attendances", "m_attendances.id = m_attendance_details.attendance");
		$isManage = isSuper("attendance_details");
		if (!$isManage) {
			$model->where("m_attendance_details.employee", $this->user_id);
		}
		$model->where("'$this->datetoday' between m_attendances.date_from and m_attendances.date_to")->where("m_attendance_details.status", getOptionValue($module, "status", "pending"));
		$data_time_attendance = $model->select("m_employees.full_name as full_name, m_employees.avatar as avatar")->groupBy("m_attendance_details.employee")->orderBy("m_attendance_details.employee")->asArray()->findAll();
		$count_data_time_attendance = count($data_time_attendance);

		return ['data_time_attendance' => $data_time_attendance, 'count_data_time_attendance' => $count_data_time_attendance];
	}

	protected function getChecklistData()
	{
		helper("app_select_option");
		$modules = \Config\Services::modules();
		$modules->setModule('checklist');
		$model = $modules->model;

		$builder = $model->select(['id', 'employee_id', 'task_number', 'complete_task', 'type'])
			->asArray()
			->where('status', getOptionValue('checklist', 'status', 'inprogress'));
		$listChecklist = handleDataBeforeReturn($modules, $builder->findAll(), true);
		$arrOnboarding = [];
		$arrOffboarding = [];
		$onboardingType = getOptionValue('checklist', 'type', 'onboarding');
		$offboardingType = getOptionValue('checklist', 'type', 'offboarding');
		$arrEmployeeId = [];
		foreach ($listChecklist as $rowChecklist) {
			if (empty($rowChecklist['employee_id'])) continue;
			$arrEmployeeId[] = $rowChecklist['employee_id']['value'];
			if ($rowChecklist['type']['value'] == $onboardingType) {
				$arrOnboarding[] = $rowChecklist;
			} else if ($rowChecklist['type']['value'] == $offboardingType) {
				$arrOffboarding[] = $rowChecklist;
			}
		}

		$listEmployee = [];
		if (count($arrEmployeeId) > 0) {
			$modules->setModule('employees');
			$model = $modules->model;
			$builderEmployee = $model->select([
				'id',
				'username',
				'full_name',
				'email',
				'job_title_id',
				'last_working_date',
				'join_date',
				'department_id',
				'office',
				'avatar AS icon'
			])->asArray();
			$listEmployee = handleDataBeforeReturn($modules, $builderEmployee->findAll(), true);
		}

		return [
			'onboarding_data' => $arrOnboarding,
			'offboarding_data' => $arrOffboarding,
			'list_employee' => $listEmployee
		];
	}

	private function getDepartmentChilds($elements = array(), $parentId = 0)
	{
		$branch = array();
		foreach ($elements as $element) {
			if ($element['parent'] == $parentId) {
				$children = $this->getDepartmentChilds($elements, $element['id']);
				if ($children) {
					array_push($branch, ...$children);
				}
				$branch[] = $element;
			}
		}

		return $branch;
	}
}
