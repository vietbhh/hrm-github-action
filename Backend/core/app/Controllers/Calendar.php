<?php

namespace App\Controllers;


use App\Libraries\Calendars\Config\Calendars;
use App\Libraries\Calendars\Models\CalendarModel;
use App\Models\UserModel;
use App\Libraries\Notifications\Notifications;

class Calendar extends ErpController
{
	private \App\Libraries\Calendars\Calendars $calendar;

	public function __construct()
	{
		$this->calendar = \Config\Services::calendars();
	}

	public function load_get()
	{
		$modules = \Config\Services::modules('calendars');
		$filter = $this->request->getGet();
		$data = $this->calendar->list($filter);
		$data = handleDataBeforeReturn($modules, $data, true);

		$arrAllDay = [];
		if (count($data) > 0) {
			foreach ($data as $key => $row) {
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

					unset($data[$key]);
				}
			}
		}

		$result = array_merge($data, array_values($arrAllDay));

		return $this->respond([
			'results' => $result
		]);
	}

	public function add_post()
	{
		$getPost = $this->request->getPost();
		$fileUpload = $this->request->getFiles();
		$body = json_decode($getPost['body'], true);
		$dataSave = [
			'title' => $body['event_name'],
			'start' => $body['start'],
			'end' => $body['end'],
			'allday' => 'false',
			'description' => $body['details'],
			'color' => str_replace('#', '', $body['color'])
		];

		$add = $this->calendar->add($dataSave, $fileUpload);

		if (!$add) {
			return $this->respond('exist');
		}

		$dataSave['id'] = $add;
		return $this->respond([
			'result' => $dataSave
		]);
	}

	public function update_post($id)
	{
		$getPost = $this->request->getPost();
		$fileUpload = $this->request->getFiles();
		$add = $this->calendar->add($getPost, $fileUpload, $id);

		if (!$add) {
			return $this->respond('exist');
		}
		return $this->respond($add);
	}

	public function detail_get($id)
	{
		$modules = \Config\Services::modules('calendars');
		$info = $this->calendar->detail($id);
		if (!$info) {
			return $this->respond($id . '_not_exist');
		}
		$data = handleDataBeforeReturn($modules, $info);
		return $this->respond($data);
	}

	public function delete_delete($ids)
	{
		$db = \Config\Database::connect();
		$builder = $db->table('calendars');
		$ids = explode(',', $ids);
		foreach ($ids as $id) {
			$builder->delete(['id' => $id]);
		}
		return $this->respond('success');
	}

	public function load_calendar_tag_get()
	{
		$modules = \Config\Services::modules('calendar_tags');
		$model = $modules->model;

		$listCalendarTag = handleDataBeforeReturn($modules, $model->asArray()->orderBy('id', 'ASC')->findAll(), true);

		return $this->respond([
			'results' => $listCalendarTag
		]);
	}

	public function get_list_event_get()
	{
		$modules = \Config\Services::modules('calendars');
		$filter = $this->request->getGet();
		$from = isset($filter['from']) ? $filter['from'] : date('Y-m-d');
		$to = isset($filter['to']) ? $filter['to'] : date('Y-m-d', strtotime('+ 2 days', strtotime($from)));

		$data = $this->calendar->list([
			'created_at_from' => $from,
			'created_at_to' => $to
		]);

		$data = handleDataBeforeReturn($modules, $data, true);
		$result = [
			'today' => [],
			'tomorrow' => []
		];
		foreach ($data as $row) {
			$startDate = date('Y-m-d', strtotime($row['start']));
			if (strtotime($startDate) === strtotime($from)) {
				$result['today'][] = $row;
			} else {
				$result['tomorrow'][] = $row;
			}
		}

		return $this->respond([
			'results' => $result
		]);
	}

	public function get_detail_event_get($id)
	{
		$modules = \Config\Services::modules('calendars');
		$model = $modules->model;

		try {
			$info = $model->asArray()->where('id', $id)->first();
			$info['color'] = isset($info['color']) ? '#' . $info['color'] : '';
			$info['is_owner'] = $info['owner'] == user_id();
			$attachment = json_decode($info['attachments'], true);
			if (is_array($attachment)) {
				$storePath = getModuleUploadPath('calendar', $info['id'], false) . 'other/';
				foreach ($attachment as $key => $row) {
					$fileInfo = getFilesProps($storePath . $row);
					$attachment[$key] = [
						'type' => strpos($fileInfo['type'], 'image') !== false ? 'image' : $fileInfo['type'],
						'name' => $fileInfo['fileName'],
						'src' => $fileInfo['url'],
						'size' => $fileInfo['size'],
						'_id' => ''
					];
				}
				$info['attachment'] = $attachment;
			}
			return $this->respond($info);
		} catch (\Exception $e) {
			echo '<pre>';
			print_r($e);
			echo '</pre>';
			return $this->respond([]);
		}
	}
}
