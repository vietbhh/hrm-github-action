<?php

namespace App\Controllers;


class Task extends ErpController
{
	private $task;

	public function __construct()
	{
		$this->task = \Config\Services::task();
	}

	public function add_post()
	{
		$dataPost = $this->request->getPost();
		$filesData = $this->request->getFiles();

		$title = $dataPost['title'];
		$assignee = $dataPost['assignee'];
		$description = $dataPost['description'];
		$date = date("Y-m-d", strtotime($dataPost['date']));
		$tag = $dataPost['tags'];
		$important = $dataPost['important'];
		$setImport = 0;
		$arrFile = [];

		$modules = \Config\Services::modules();
		$modules->setModule('tasks');
		$dataHandleTask = handleDataBeforeSave($modules, $dataPost, $filesData);
		$saveStaff = $dataHandleTask['data'];
		$uploadFieldsArray = $dataHandleTask['uploadFieldsArray'];

		//$id = 100;


		$isCompleted = $dataPost['isCompleted'];
		$status = 'none';
		if ($dataPost['isCompleted'] == 'true') {
			$status = 'completed';
			$saveStaff['status'] = 'completed';
		} else {
			$saveStaff['status'] = 'none';
		}

		$saveStaff['date'] = $date;

		if ($important == 'true' || $important == 1) {
			$setImport = 1;
			$saveStaff['important'] = 1;
		}

		if (!isset($dataPost['trash'])) {
			$saveStaff['trash'] = 0;
		}

		$id = null;
		if (isset($dataPost['id'])) {
			$id = $dataPost['id'];
		}


		$add = $this->task->add($saveStaff);


		if ($filesData) {
			foreach ($filesData as $key => $files) {
				if (empty($files)) continue;
				//	if (is_numeric($i = array_search($key, $arrFiles))) continue;
				if (!is_array($files)) $files = [$files];
				foreach ($files as $position => $file) {
					if (empty($uploadFieldsArray[$key])) $file = $file['data'];
					if (!$file->isValid()) {
						return $this->failValidationErrors($file->getErrorString() . '(' . $file->getError() . ')');
					}
					if (!$file->hasMoved()) {
						$subPath = (!empty($uploadFieldsArray[$key])) ? 'other' : 'data';
						$filePath = '/uploads/' . $_ENV['data_folder_module'] . '/tasks/' . $add . '/' . $subPath . '/';
						$storePath = WRITEPATH . $filePath;

						if ($key === 'filesDataWillUpdate') {
							$fileName = $saveStaff[$key][$position]['name'];
							$removeOldFilePath = $storePath . $fileName;
							if (is_file($removeOldFilePath)) {
								unlink($removeOldFilePath);
							}
							$fileName = safeFileName($fileName);
							$file->move($storePath, $fileName);
						} else {
							$fileName = safeFileName($file->getName());
							$paths[] = $file->move($storePath, $fileName);
							if (!empty($uploadFieldsArray[$key])) {
								if ($uploadFieldsArray[$key]->field_type == 'upload_multiple') {
									$arrayFiles = isset($saveStaff[$key]) ? json_decode($saveStaff[$key], true) : [];
									$arrayFiles[] = $fileName;
									$saveStaff[$key] = json_encode($arrayFiles);
								} else {
									$saveStaff[$key] = $fileName;
								}
							}
						} //end check file update
					}

				}
			}
		}

		$saveStaff['id'] = $add;
		$add = $this->task->add($saveStaff);

		return $this->respond($add);

	}


	public function addtag_post()
	{
		$db = \Config\Database::connect();
		$builder = $db->table('tasks_tags');
		$value = $this->request->getPost('value');
		$color = $this->request->getPost('color');
		$id = $this->request->getPost('id');
		if (isset($value)) {
			$data = [
				'value' => $value,
				'color' => $color,
			];
			if ($id && $id > 0) {
				$builder->update($data, ['id' => $id]);
			} else {
				$builder->where('value', $value);
				$query = $builder->get()->getResult();
				if (!$query) {
					$builder->insert($data);
				}
			}
		}
		echo json_encode(1);
	}

	public function gettag_get()
	{
		$db = \Config\Database::connect();
		$builder = $db->table('tasks_tags');
		$query = $builder->get()->getResultArray();
		echo json_encode($query);

	}

	public function detail_get($id)
	{
		$a = $this->task->detail($id);
		return $this->respond($a);
	}

	public function load_get()
	{
		$modules = \Config\Services::modules();
		$moduleTask = $modules->setModule('tasks');
		$dataGet = $this->request->getGet();
		$status = 0;
		$important = false;
		if (isset($dataGet['filter'])) {
			if ($dataGet['filter'] == 'important') {
				$important = true;
			} else {
				$status = $dataGet['filter'];
			}
		}
		$q = '';
		if (isset($dataGet['q'])) {
			$q = $dataGet['q'];
		}
		$page = 1;
		if (isset($dataGet['page'])) {
			$page = $dataGet['page'];
		}

		$tag = '';
		if (isset($dataGet['tag'])) {
			$tag = $dataGet['tag'];
		}
		$sort = '';
		if (isset($dataGet['sortBy'])) {
			$sort = $dataGet['sortBy'];
		}
		$data = $this->task->list($status, $important, $q, $page, $tag, $sort);

		$db = \Config\Database::connect();
		$builder = $db->table('m_employees');

		$dataStaff = '';
		$modules->setModule('employees');

		$arrData = [];
		foreach ($data as $val):
			$owner = $builder->get()->getRow();
			$assignee = $builder->where('id', $val['assignee'])->get()->getRow();
			$val['ownerurl'] = '/modules/employees/' . $owner->id . '/other/' . $owner->avatar;
			$val['assigneeurl'] = '/modules/employees/' . $assignee->id . '/other/' . $assignee->avatar;
			$arrData[] = $val;
		endforeach;

		$modules->setModule('tasks');
		$data = handleDataBeforeReturn($modules, $arrData, true);

		return $this->respond($data);
	}

	public function delete_delete($ids)
	{
		$ids = explode(',', $ids);
		$this->task->deleted($ids, true);
		return $this->respond('success');
	}

}


