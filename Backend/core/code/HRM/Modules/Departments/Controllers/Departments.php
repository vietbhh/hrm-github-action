<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : departments
*/

namespace HRM\Modules\Departments\Controllers;

use App\Controllers\ErpController;

class Departments extends ErpController
{
	public function index_get()
	{
		return $this->respond([]);
	}

	public function loadData_get()
	{
		$get = $this->request->getGet();

		$parent = isset($get['parent']) ? $get['parent'] : [];

		$modules = \Config\Services::modules('departments');
		$model = $modules->model;
		$listDepartment = $model->asArray()->orderBy('id ASC')->findAll();
		$dataHandle = handleDataBeforeReturn('departments', $listDepartment, true);
		$modules->setModule('employees');
		$employeeModel = $modules->model;

		foreach ($dataHandle as $key => $item) {
			$dataHandle[$key]['employees'] = $employeeModel->where('department_id', $item['id'])->findAll();
		}

		if ($parent) {
			$arr = [];
			foreach ($parent as $idParent):
				$infoParent = array_filter($listDepartment, function ($item) use ($idParent) {
					return $item['id'] == $idParent;
				}, ARRAY_FILTER_USE_BOTH);
				$infoParent = reset($infoParent);
				if ($infoParent['parent'] != $idParent) $infoParent['parent'] = 0;
				$arr[] = $infoParent;

				$childs = $this->buildTree($listDepartment, $idParent);
				array_push($arr, ...$childs);
			endforeach;


			$dataHandle = handleDataBeforeReturn('departments', $arr, true);
			foreach ($dataHandle as $key => $item) {
				$dataHandle[$key]['employees'] = $employeeModel->where('department_id', $item['id'])->findAll();
			}
			return $this->respond($dataHandle);
		}

		return $this->respond($dataHandle);
	}


	public function add_post()
	{
		$post = $this->request->getPost();
		$modules = \Config\Services::modules('departments');
		$model = $modules->model;
		$db = \Config\Database::connect();
		$builder = $db->table('m_employees');
		$departmentList = $model->asArray()->findAll();

		if (isset($post['updateOwner']) && $post['updateOwner']) {
			$infoOwner = $builder->where('id', $post['line_manager'])->get()->getRowArray();
			$idOwner = $infoOwner ? $infoOwner['users_id'] : 0;

			$departmentList = $model->asArray()->findAll();
			$arrNotParentAndChilds = array_filter($departmentList, function ($a) {
				return $a['parent'] == 0 && $a['line_manager'] == 0;
			});
			$arrNoLineManager = [];

			/* Update line manager for department no Line Manager */
			foreach ($arrNotParentAndChilds as $val) {
				$dataChilds = $this->find_childs($departmentList, $val['id']);
				$dataChilds[] = [
					'id' => $val['id'],
					'line_manager' => $val['line_manager'],
					'parent' => $val['parent'],
					'name' => $val['name'],
				];
				$arrNoLineManager = array_merge($arrNoLineManager, $dataChilds);
			}

			$idDepartmentNoLineManager = array_column($arrNoLineManager, 'id');
			if ($idDepartmentNoLineManager) {
				$arrEmployees = $builder->select('id,line_manager')->whereIN('department_id', $idDepartmentNoLineManager)->get()->getResultArray();

				foreach ($arrEmployees as $key => $val) {
					$arrEmployees[$key]['line_manager'] = $idOwner;
				}
				$builder->updateBatch($arrEmployees, 'id');
			}

			$arrNotParent = array_filter($departmentList, function ($a) {
				return $a['parent'] == 0 && $a['line_manager'] != 0;
			});
			$arrLineManager = array_column($arrNotParent, 'line_manager');

			/* Update line manager for department have line manager parent */
			if ($arrLineManager) {
				$arrUpdate = [];
				foreach ($arrLineManager as $value) {
					$arrUpdate[] = [
						'id' => $value,
						'line_manager' => $idOwner
					];
				}
				$builder->updateBatch($arrUpdate, 'id');
			}
			// Update employees app owner

			preference('app_owner', $idOwner, true);
			$dataOwner = [
				'line_manager' => 0,
				'department_id' => 0,
			];
			$builder->set($dataOwner)->where('id', $post['line_manager'])->update();
			return $this->respond(ACTION_SUCCESS);
		}

		$dataHandle = handleDataBeforeSave($modules, $post);
		$model->setAllowedFields($dataHandle['fieldsArray']);
		$model->save($dataHandle['data']);;
		$idDepartment = isset($dataHandle['data']['id']) ? $dataHandle['data']['id'] : $model->insertID;

		if (isset($dataHandle['data']['id'])) {

			$dataChilds = $this->find_childs($departmentList, $dataHandle['data']['id']);
			$idDepNoLineManager = array_column($dataChilds, 'id');
			array_push($idDepNoLineManager, $dataHandle['data']['id']);

			$modules->setModule('employees');
			$employeeModel = $modules->model;
			$arrEmployees = $employeeModel->asArray()->whereIn('department_id', $idDepNoLineManager)->findAll();
			if ($arrEmployees) {
				foreach ($arrEmployees as $key => $value) {
					$updateLineManage = [
						'id' => $value['id'],
						'department_id' => $value['department_id']
					];
					\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $updateLineManage);
				}
			}

			// update line manager for line manager childs
			$departmentChilds = $this->find_childs($departmentList, $dataHandle['data']['id']);
			$departmentChilds[] = ['id' => $dataHandle['data']['id']];
			$arrHaveLineManager = [];
			foreach ($departmentChilds as $val) {
				$id = $val['id'];
				$arrChilds = array_filter($departmentList, function ($a) use ($id) {
					return $a['parent'] == $id && $a['line_manager'] != 0;
				});
				$merge = array_merge($arrHaveLineManager, $arrChilds);
				array_push($arrHaveLineManager, ...$merge);
			}
			$idEmployeesManager = array_column($arrHaveLineManager, 'line_manager');
			foreach ($idEmployeesManager as $value) {
				$arrUpdate = [
					'id' => $value,
					'department_id' => $dataHandle['data']['id']
				];
				\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $arrUpdate);

			}

		}
		if (isset($dataHandle['data']['line_manager']) && $dataHandle['data']['line_manager']) {

			$updateDepartment = [
				'department_id' => $idDepartment
			];
			$builder->update($updateDepartment, ['id' => $dataHandle['data']['line_manager']]);
			$updateDepartment['id'] = $dataHandle['data']['line_manager'];

			\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $updateDepartment);

		}
		return $this->respond(ACTION_SUCCESS);
	}

	private function buildTree($elements = array(), $parentId = 0)
	{
		$branch = array();
		foreach ($elements as $element) {
			if ($element['parent'] == $parentId) {
				$children = $this->buildTree($elements, $element['id']);
				if ($children) {
					array_push($branch, ...$children);
				}
				$branch[] = $element;
			}
		}

		return $branch;
	}

	public function update_employee_post()
	{
		helper('app_select_option');
		$post = $this->request->getPost();
		$modules = \Config\Services::modules('departments');
		$model = $modules->model;
		$model->setAllowedFields(['line_manager']);
		$departmentId = $post['department_id'];
		$department = handleDataBeforeReturn($modules, $model->asArray()->find($departmentId));

		$departmentFrom = $model->asArray()->find($post['department_from']);
		if ($departmentFrom['line_manager'] == $post['id']) {
			$dataUp = [
				'id' => $post['department_from'],
				'line_manager' => 0
			];
			$model->save($dataUp);
			// employees update

			$db = \Config\Database::connect();
			$builder = $db->table('m_employees');

			$modules->setModule('employees');
			$modelEmployee = $modules->model;
			$arrEmployees = $modelEmployee->asArray()->where('department_id', $post['department_from'])->findAll();
			if ($arrEmployees) {
				//$idLineManager = $this->getLineManager($arrEmployees[0]);
				foreach ($arrEmployees as $key => $value) {
					$dataUpdateEmployee = [
						'department_id' => $post['department_from'],
						'id' => $value['id']
					];
					\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $dataUpdateEmployee);

				}
			}
		}

		$modules->setModule('employees');
		$model = $modules->model;
		$employee = handleDataBeforeReturn($modules, $model->asArray()->find($post['id']));

		if ($department['line_manager'] && $employee['id'] == $department['line_manager']['value']) {
			return $this->fail('error_line_manager');
		}

		$model->setAllowedFields(["department_id", "line_manager"]);
		$dataUpdateEmployee = [
			'department_id' => $departmentId,
			'id' => $post['id']
		];

		//new histories
		$params['dataSaveEmployee'] = [
			'department_id' => $departmentId,
			'id' => $post['id']
		];
		$params['dataEmployeeHistory'] = [
			'employeeId' => $post['id'],
			'typeCreate' => 'changed',
			'dataEmployee' => $dataUpdateEmployee
		];

		\CodeIgniter\Events\Events::trigger('on_update_employee_event', $params);
		\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $dataUpdateEmployee);
		return $this->respond(ACTION_SUCCESS);
	}

	public function update_parent_post()
	{
		$post = $this->request->getPost();
		$modules = \Config\Services::modules('departments');
		$model = $modules->model;
		$model->setAllowedFields(['parent']);
		$parent = $model->asArray()->find($post['parent']);
		$department = $model->asArray()->find($post['id']);
		$data = [
			'parent' => $post['parent'],
			'id' => $post['id'],
		];
		$model->save($data);
		if ($parent) {
			$db = \Config\Database::connect();
			$builder = $db->table('m_employees');

			if ($department['line_manager']) {
				// histories
				$dataUpdateEmployee = [
					'department_id' => $department['id'],
					'id' => $department['line_manager']
				];
				\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $dataUpdateEmployee);
			} else {
				$arrEmployees = handleDataBeforeReturn('employees', $builder->where('department_id', $post['id'])->get()->getResultArray(), true);
				if ($arrEmployees) {
					foreach ($arrEmployees as $key => $value) {
						$dataUpdateEmployee = [
							'department_id' => $department['id'],
							'id' => $value['id']
						];
						\CodeIgniter\Events\Events::trigger('update_line_manager_employee', $dataUpdateEmployee);

					}
				}
			}

			if ($parent['parent'] == $post['id'] and $parent['parent'] != 0) {
				$modules->setModule("departments");
				$data = [
					'parent' => $department['parent'],
					'id' => $parent['id'],
				];
				$model->save($data);

			}
		}
		return $this->respond(ACTION_SUCCESS);
	}


	public function delete_department_post()
	{
		$post = $this->request->getPost();

		if (isset($post['department_delete'])) {
			$db = \Config\Database::connect();
			$builder = $db->table('m_employees');
			$modules = \Config\Services::modules('employees');
			$employeeModel = $modules->model;
			$arrEmployees = $employeeModel->select('id,department_id,line_manager')->asArray()->where('department_id', $post['department_delete'])->findAll();
			if (!$arrEmployees) {
				$modules->setModule('departments');
				$model = $modules->model;
				$departmentDelete = $model->asArray()->find($post['department_delete']);
				$model->setAllowedFields(['parent']);
				$model->where('parent', $post['department_delete'])
					->set(['parent' => $departmentDelete['parent']])
					->update();

				$model->delete($post['department_delete']);
				return $this->respond(ACTION_SUCCESS);
			} else {
				$arrEmployees[0]['department_id'] = $post['department_next'];
				$id = $this->getLineManager($arrEmployees[0]);
				foreach ($arrEmployees as $key => $val) {
					$arrEmployees[$key]['line_manager'] = $id;
					$arrEmployees[$key]['department_id'] = $post['department_next'];
				}
				$builder->updateBatch($arrEmployees, 'id');


				$modules->setModule('departments');
				$model = $modules->model;

				if (isset($post['deleteAll'])) {
					if ($post['deleteAll'] == 'false') {
						$departmentDelete = $model->asArray()->find($post['department_delete']);
						$model->setAllowedFields(['parent']);
						$model->where('parent', $post['department_delete'])
							->set(['parent' => $departmentDelete['parent']])
							->update();
					}
					if ($post['deleteAll'] == 'true') {
						$arrEmployees = $employeeModel->select('id,department_id,line_manager')->asArray()->whereIN('department_id', $post['childDelete'])->findAll();
						foreach ($arrEmployees as $key => $val) {
							$arrEmployees[$key]['line_manager'] = $id;
							$arrEmployees[$key]['department_id'] = $post['department_next'];
						}
						$builder->updateBatch($arrEmployees, 'id');
						$model->delete($post['childDelete']);
					}
				}

				$model->delete($post['department_delete']);
				return $this->respond(ACTION_SUCCESS);
			}

		} else {
			return $this->fail('ERROR');
		}
	}

	private function getLineManager($data)
	{

		$modules = \Config\Services::modules('departments');
		$model = $modules->model;
		$listDepartment = $model->asArray()->orderBy('id ASC')->findAll();
		$allParent = $this->find_parents($listDepartment, $data['department_id']);
		$idParentUpdate = preference('app_owner');
		foreach ($allParent as $val):
			if ($val['line_manager'] && $val['line_manager'] != $data['id']) {
				$idParentUpdate = $val['line_manager'];
				break;
			}
		endforeach;
		return $idParentUpdate;
	}

	private function find_parents(array $dataDepartments, $idParent)
	{
		$all = [];
		foreach ($dataDepartments as $val) {
			if ($val['id'] == $idParent) {
				array_push($all, $val);
				$parent = $this->find_parents($dataDepartments, $val['parent']);
				if ($parent) {
					array_push($all, ...$parent);
				}
			}
		}
		return $all;
	}


	private function find_childs(array $dataDepartments, $idParent)
	{
		$all = [];
		foreach ($dataDepartments as $val) {
			if ($val['parent'] == $idParent) {
				$data['id'] = $val['id'];
				$data['parent'] = $val['parent'];
				$data['line_manager'] = $val['line_manager'];
				$data['name'] = $val['name'];

				if (!$val['line_manager']) {
					array_push($all, $data);
					$parent = $this->find_childs($dataDepartments, $val['id']);
					if ($parent) {
						array_push($all, ...$parent);
					}
				}

			}
		}
		return $all;
	}
}