<?php

namespace App\Controllers\Settings;

use App\Controllers\ErpController;
use Myth\Auth\Authorization\GroupModel;
use Myth\Auth\Authorization\PermissionModel;

class Groups extends ErpController
{
	public function index_get()
	{
		return $this->respond(1);
	}

	public function detail_get($id)
	{
		$model = new GroupModel();
		$info = $model->where('id', $id)->first();
		if ($info) {
			$users = [];
			foreach ($model->getUsersForGroup($id) as $val) {
				$users[] = [
					'email' => $val['email'],
					'full_name' => $val['full_name'],
					'icon' => $val['avatar'],
					'label' => $val['username'],
					'value' => $val['id'],
				];
			}
			$info->users = $users;
			$per = array_column($model->getPermissionsForGroup($id), 'id');
			$info->permissions = $per;
			return $this->respond($info);
		} else {
			return $this->failNotFound('Not_found');
		}
	}

	private function checkUserInGroup($user, $group)
	{
		$model = new GroupModel();
		$users = $model->getUsersForGroup($group);
		$check = array_search($user, array_column($users, 'id'));
		if ($check || $check === 0) {
			return 1;
		}
		return 0;
	}

	private function checkPerInGroup($per, $group)
	{
		$model = new GroupModel();
		$permissions = $model->getPermissionsForGroup($group);
		$check = array_search($per, array_column($permissions, 'id'));
		if ($check || $check === 0) {
			return 1;
		}
		return 0;
	}


	public function save_post()
	{
		$model = new GroupModel();
		$getPost = $this->request->getPost();
		if ($model->save($getPost) === false) {
			return $this->fail($model->errors());
		} else {
			$id = $model->insertID;
			if (isset($getPost['id']) && ($getPost['id'])) {
				$id = $getPost['id'];
				foreach ($model->getUsersForGroup($id) as $val) {
					$model->removeUserFromGroup($val['id'], $id);
				}
				foreach ($model->getPermissionsForGroup($id) as $val) {
					$model->removePermissionFromGroup($val['id'], $id);
				}
			}
			if (isset($getPost['permissions'])) {
				foreach ($getPost['permissions'] as $val) {
					if ($val) {
						$exist = $this->checkPerInGroup($val, $id);
						if (!$exist) {
							$model->addPermissionToGroup($val, $id);
						}
					}
				}
			}

			if (isset($getPost['users'])) {
				foreach ($getPost['users'] as $val) {
					if ($val) {
						$exist = $this->checkUserInGroup($val, $id);
						if (!$exist) {
							$model->addUserToGroup($val, $id);
						}
					}
				}
			}
			return $this->respondCreated($model->getInsertID());
		}
	}

	public function addUserToGroup_post()
	{
		$model = new GroupModel();
		$getPost = $this->request->getPost();
		if (isset($getPost['users']) && isset($getPost['group_id']) && ($getPost['group_id'])) {
			foreach ($getPost['users'] as $val) {
				$exist = $this->checkUserInGroup($val, $getPost['group_id']);
				if (!$exist) {
					$model->addUserToGroup($val, $getPost['group_id']);
				}
			}
			return $this->respond('success');
		}

		if (((!isset($getPost['user_id']) || !isset($getPost['group_id']) || !($getPost['user_id']) || !($getPost['group_id'])))) {
			return $this->fail('user_id and group_id is requied !');
		}
		$exist = $this->checkUserInGroup($getPost['user_id'], $getPost['group_id']);
		if (!$exist) {
			$model->addUserToGroup($getPost['user_id'], $getPost['group_id']);
		}
		return $this->respond('success');
	}

	public function removeUserFromGroup_post($all = false)
	{
		$model = new GroupModel();
		$getPost = $this->request->getPost();
		if (((!isset($getPost['user_id']) || !isset($getPost['group_id']) || !($getPost['user_id']) || !($getPost['group_id'])))) {
			return $this->fail('user_id and group_id is requied !');
		}

		if ($all) {
			$model->removeUserFromAllGroups($getPost['user_id']);
		} else {
			$model->removeUserFromGroup($getPost['user_id'], $getPost['group_id']);
		}
		return $this->respond('success');
	}

	public function addPerToGroup_post()
	{
		$model = new GroupModel();
		$getPost = $this->request->getPost();
		if (isset($getPost['permissions']) && isset($getPost['group_id']) && ($getPost['group_id'])) {
			foreach ($getPost['permissions'] as $val) {
				$exist = $this->checkPerInGroup($val, $getPost['group_id']);
				if (!$exist) {
					$model->addPermissionToGroup($val, $getPost['group_id']);
				}
			}
			return $this->respond('success');
		}


		if (((!isset($getPost['permission_id']) || !isset($getPost['group_id']) || !($getPost['permission_id']) || !($getPost['group_id'])))) {
			return $this->fail('permission_id and group_id is requied !');
		}
		$exist = $this->checkPerInGroup($getPost['permission_id'], $getPost['group_id']);
		if (!$exist) {
			$model->addPermissionToGroup($getPost['permission_id'], $getPost['group_id']);

		}
		return $this->respond('success');
	}

	public function removePerFromGroup_post($all = false)
	{
		$model = new GroupModel();
		$getPost = $this->request->getPost();
		if (((!isset($getPost['permission_id']) || !isset($getPost['group_id']) || !($getPost['permission_id']) || !($getPost['group_id'])))) {
			return $this->fail('user_id and group_id is requied !');
		}

		if ($all) {
			$model->removePermissionFromAllGroups($getPost['permission_id']);
		} else {
			$model->removePermissionFromGroup($getPost['permission_id'], $getPost['group_id']);
		}
		return $this->respond('success');
	}

	public function delete_delete($ids)
	{
		$cache = \Config\Services::cache();
		$model = new GroupModel();
		$ids = explode(',', $ids);
		$idDel = [];
		foreach ($ids as $id) {
			$in = $model->find($id);
			if ($in) {
				if ($in->can_delete == 'true') {
					$model->delete($ids);
					$cache->delete($id . '_users');
					$idDel[] = $id;
				}
			}
		}
		return $this->respondDeleted($idDel);
	}

	public function permissions_get()
	{
		$perModel = new PermissionModel();
		$perData = $perModel->findAll();
		$arr = [];
		foreach ($perData as $val):
			$explode = explode(".", $val['name']);
			$value = [
				'id' => $val['id'],
				'description' => $val['description'],
			];
			if (($explode[0] == 'custom') || ($explode[0] == 'modules')) {
				if (count($explode) >= 3) {
					$arr[$explode[0]][$explode[1]][$explode[2]] = $value;
				} else {
					$arr[$explode[0]][$explode[1]] = $value;
				}
			} else {
				if (count($explode) >= 3) {
					$arr['features'][$explode[0]][$explode[1]][$explode[2]] = $value;
				} else {
					$arr['features'][$explode[0]][$explode[1]] = $value;
				}
			}

		endforeach;
		return $this->respond($arr);
	}

	public function load_get()
	{
		$model = new GroupModel();
		$search = $this->request->getGet('search');

		if ($search) {
			$model->like('name',$search);
			$model->orLike('description',$search);
		}
		$data = $model->findAll();

		$dataA = [];
		foreach ($data as $val):
			$val->users = count($model->getUsersForGroup($val->id));
			$dataA[] = $val;
		endforeach;
		return $this->respond($dataA);

	}

	public function duplicate_get($id)
	{
		$model = new GroupModel();
		$info = $model->find($id);
		if ($info) {
			$arrPer = [];
			$groupRep['name'] = $info->name . ' (Duplication ' . date('H:i') . ')';
			$groupRep['description'] = 'Duplication from ' . $info->name;
			$groupRep['default'] = $info->default;
			$model->save($groupRep);
			$lastId = $model->insertID;
			$permissions = $model->getPermissionsForGroup($id);

			$idPers = array_column($permissions, 'id');
			foreach ($idPers as $val) {
				$arrPer[] = ['permission_id' => $val, 'group_id' => $lastId];
			}

			$db = \Config\Database::connect();
			$builder = $db->table('auth_groups_permissions');
			$builder->insertBatch($arrPer);
			return $this->respond($lastId);
		} else {
			return $this->failNotFound('Not_found');
		}

	}

	public function validate_post()
	{
		$name = $this->request->getPost('name');
		$id = $this->request->getPost('id');
		$db = \Config\Database::connect();
		$builder = $db->table('auth_groups');
		$builder->where('name', $name);
		if (isset($id) && $id) {
			$builder->where('id !=', $id);
		}
		$query = $builder->get()->getResultArray();
		if (count($query) == 0) {
			return $this->respond(true);
		}
		return $this->respond(false);
	}
	//--------------------------------------------------------------------

}

