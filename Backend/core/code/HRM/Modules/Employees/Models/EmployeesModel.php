<?php

namespace HRM\Modules\Employees\Models;

use App\Models\AppModel;
use App\Models\UserModel;

class EmployeesModel extends AppModel
{
	protected $table = 'm_employees';
	protected $primaryKey = 'id';
	protected $useAutoIncrement = true;
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = [];
	protected $useTimestamps = false;
	protected $createdField = 'created_at';
	protected $updatedField = 'updated_at';
	protected $deletedField = 'deleted_at';

	public function listFromGroup($group): array
	{
		$this->select("*");
		$this->where("JSON_UNQUOTE(JSON_EXTRACT(group_id, '$[*]')) LIKE '[{$group}]%'");
		return $this->get()->getResultArray();
	}

	public function exceptResigned()
	{
		helper('app_select_option');
		return $this->where('status !=', getOptionValue('employees', 'status', 'resigned'));
	}

	public function exceptResignedEmployee()
	{
		return $this->where('m_employees.status !=', 16);
	}

	public function selectBasicFields()
	{
		return $this->select(['id', 'email', 'phone', 'username', 'full_name', 'line_manager']);
	}

	public function selectCommonFields()
	{
		return $this->select(['gender', 'avatar', 'dob', 'office', 'department_id', 'group_id', 'job_title_id', 'join_date', 'status', 'social_facebook', 'social_twitter', 'social_instagram', 'social_telegram', 'social_youtube', 'social_website']);
	}

	public function selectOptionFields($label = 'username')
	{
		return $this->select(['id as value', $label . ' as label', 'avatar as icon']);
	}

	public function getEmployeeByEmail($email)
	{
		return $this->where("email", $email)->asArray()->first();
	}

	public function resign($userIds = [])
	{
		try {
			helper('app_select_option');
			$this->setAllowedFields(['account_status', 'status']);
			$this->whereIn('id', $userIds)->set('account_status', getOptionValue('employees', 'account_status', 'deactivated'))
				->set('status', getOptionValue('employees', 'status', 'resigned'))->update();

			$userModel = new UserModel();
			$userModel->whereIn('id', $userIds)->set([
				'active' => 0,
				'account_status' => 'deactivated'
			])->update();

			foreach ($userIds as $id) {
				$userInfo = $userModel->where('id', $id)->first();
				\CodeIgniter\Events\Events::trigger('on_after_update_account_status_user', $userInfo);
			}

			return [
				"success" => true
			];
		} catch (\Exception $e) {
			return [
				"success" => false,
				"err" => $e->getMessage()
			];
		}
	}
}
