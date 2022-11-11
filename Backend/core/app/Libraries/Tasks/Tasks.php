<?php namespace App\Libraries\Tasks;


use App\Libraries\Tasks\Models\TaskModel;

class Tasks
{
	protected $model;

	public function __construct()
	{
		$this->model = new TaskModel();
	}

	public function add($data)
	{

		/*if ($id) {
			$content['id'] = $id;
		}
		$content['title'] = $title;
		$content['assignee'] = $assignee;
		$content['description'] = $description;
		$content['date'] = $date;
		$content['important'] = $important;
		$content['status'] = $status;
		$content['tags'] = json_encode($tag);
		$content['files'] = json_encode($files);
		$content['trash'] = 0;*/
		$this->model->save($data);
		if (isset($data['id'])) {
			return $data['id'];
		}
		return $this->model->insertID;
	}

	public function detail($id = null)
	{
		return $this->model->find($id);
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

	public function list($status = null, $important = false, $q = null, $page = null, $tag = null, $sort = null)
	{
		$this->model->select(" * ");
		if ($important) {
			$this->model->where('important', 1);
		}
		if ($status === 'completed') {
			$this->model->where('status', $status)->where('trash', 0);
		} else if ($status === 'added') {
			$this->model->where('owner', user_id());
		} else if ($status === 'deleted') {
			$this->model->where('trash', 1);
		} else {
			$this->model->where('trash', 0);
		}
		if ($status !== 'added') {
			$this->model->where('assignee', user_id());
		}
		if ($q) {
			$this->model->like('title', $q);
		}
		if ($tag) {
			$this->model->where("JSON_SEARCH(tags, 'all', '{$tag}', null, '$[*]') IS NOT NULL ");
		}

		$valPage = $page * 15;
		$this->model->limit($valPage, 0);
		if ($sort == 'asc') {
			$this->model->orderBy('title', 'asc');

		} else if ($sort == 'desc') {
			$this->model->orderBy('title', 'desc');

		} else if ($sort == 'date') {
			$this->model->orderBy('date', 'asc');

		} else {
			$this->model->orderBy('date', 'desc');
		}


		return $this->model->get()->getResultArray();
	}

	public function deleted($id = [], $trash = true)
	{
		if ($trash) {
			$data = [
				'trash' => 1
			];
			$this->model->update($id, $data);
		}
	}
}
