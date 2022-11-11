<?php

namespace App\Libraries\Calendars;


use App\Libraries\Calendars\Models\CalendarModel;
use App\Libraries\Calendars\Config\Calendars as CalendarsConfig;

class Calendars
{
	protected $model;
	protected $config;

	public function __construct()
	{
		$this->model = new CalendarModel();
		$this->config = new CalendarsConfig();
	}

	public function detail($id = null)
	{
		$checkPermit = $this->model->checkPermission($id, user_id());

		if (!$checkPermit) return 'not_permission';
		return $this->model->find($id);
	}

	public function checkExist($content = null)
	{
	}

	public function add($getPost, $fileUpload, $id = null)
	{
		$modules = \Config\Services::modules('calendars');

		$content = $getPost;
		if ($id) {
			$content['id'] = $id;
		}

		if (isset($getPost['view_permissions'])) {
			$content['view_permissions'] = json_encode(array_filter($getPost['view_permissions']), JSON_NUMERIC_CHECK);
		}

		if (isset($getPost['allday'])) {
			$content['allday'] = $getPost['allday'] ? 1 : 0;
			if ($getPost['allday']) {
				$content['start'] = date('Y-m-d 00:00:00', strtotime($content['start']));
				$content['end'] = date('Y-m-d 23:59:59', strtotime($content['end']));
			}
		}

		if (isset($getPost['view_permission_type'])) {
			$content['office'] = '';
			$content['department'] = '';
			$content['specific_employee'] = '';
			if ($getPost['view_permission_type'] != 'everyone') {
				$content[$getPost['view_permission_type']] = $getPost[$getPost['view_permission_type']];
			}
		}

		try {
			$id = $modules->saveRecord($content, $fileUpload);
		} catch (\Exception $e) {
			throw $e;
		}

		// sync event with Google Calendar
		$googleService = \App\Libraries\Google\Config\Services::google();
		$calendarService = $googleService->calendar();
		$calendarService->handleAddEvent([
			'title' => $content['title'],
			'note' => $content['description'],
			'date_from' => date('Y-m-d', strtotime($content['start'])),
			'time_from' => date('H:i:s', strtotime($content['start'])),
			'date_to' => date('Y-m-d', strtotime($content['end'])),
			'time_to' => date('H:i:s', strtotime($content['end'])),
		]);

		return $id;
	}


	public function listUser($id = null, $start = null, $end = null)
	{
		$where['user_id'] = $id;
		if ($start != null && $end != null) {
			$where['start'] = $start;
			$where['end'] = $end;
		}
		return $this->model->getlist($where);
	}

	public function list($filter)
	{
		$calendarTag = isset($filter['calendar_tag']) ? $filter['calendar_tag'] : [];
		$builder = $this->model;
		if (count($calendarTag) > 0 && !in_array('all', $calendarTag)) {
			$builder->whereIn('calendar_tag', $calendarTag);
		}
		return $builder->findAll();
	}

	public function deleted($id = null)
	{
		$this->model->delete($id);
		return $id;
	}
}