<?php namespace App\Models;

use App\Entities\User;
use Myth\Auth\Authorization\GroupModel;

class UserModel extends \Tatter\Permits\Models\UserModel
{
	protected $table = 'users';
	protected $primaryKey = 'id';

	protected $returnType = User::class;
	protected $useSoftDeletes = false;

	protected $allowedFields = [
		'full_name', 'username', 'email', 'phone', 'password_hash', 'reset_hash', 'reset_at', 'reset_expires', 'activate_hash', 'account_status',
		'active', 'force_pass_reset', 'dob', 'avatar', 'gender', 'code', 'google_linked', 'facebook_linked', 'deleted_at', 'office', 'group_id', 'job_title_id', 'department_id', 'device_token'
	];

	protected $useTimestamps = true;

	protected $validationRules = [
		'email' => 'required|valid_email|is_unique[users.email,id,{id}]',
		'username' => 'required|alpha_numeric_punct|min_length[3]|is_unique[users.username,id,{id}]',
	];


	protected $validationMessages = [];

	protected $skipValidation = false;
	use \Tatter\Audits\Traits\AuditsTrait;


	protected $beforeInsert = ['ownerInsert'];
	protected $beforeUpdate = ['lastUpdate'];
	protected $afterInsert = ['auditInsert'];
	protected $afterUpdate = ['auditUpdate'];
	protected $afterDelete = ['auditDelete'];

	/**
	 * The id of a group to assign.
	 * Set internally by withGroup.
	 * @var int
	 */
	protected $assignGroup;

	/**
	 * Logs a password reset attempt for posterity sake.
	 *
	 * @param string $email
	 * @param string|null $token
	 * @param string|null $ipAddress
	 * @param string|null $userAgent
	 */
	public function logResetAttempt(string $email, string $token = null, string $ipAddress = null, string $userAgent = null)
	{
		$this->db->table('auth_reset_attempts')->insert([
			'email' => $email,
			'ip_address' => $ipAddress,
			'user_agent' => $userAgent,
			'token' => $token,
			'created_at' => date('Y-m-d H:i:s')
		]);
	}

	/**
	 * Logs an activation attempt for posterity sake.
	 *
	 * @param string|null $token
	 * @param string|null $ipAddress
	 * @param string|null $userAgent
	 */
	public function logActivationAttempt(string $token = null, string $ipAddress = null, string $userAgent = null)
	{
		$this->db->table('auth_activation_attempts')->insert([
			'ip_address' => $ipAddress,
			'user_agent' => $userAgent,
			'token' => $token,
			'created_at' => date('Y-m-d H:i:s')
		]);
	}

	/**
	 * Sets the group to assign any users created.
	 *
	 * @param string $groupName
	 *
	 * @return $this
	 */
	public function withGroup(string $groupName)
	{
		$group = $this->db->table('auth_groups')->where('name', $groupName)->get()->getFirstRow();

		$this->assignGroup = $group->id;

		return $this;
	}

	/**
	 * Clears the group to assign to newly created users.
	 *
	 * @return $this
	 */
	public function clearGroup()
	{
		$this->assignGroup = null;

		return $this;
	}

	/**
	 * If a default role is assigned in Config\Auth, will
	 * add this user to that group. Will do nothing
	 * if the group cannot be found.
	 *
	 * @param $data
	 *
	 * @return mixed
	 */
	protected function addToGroup($data)
	{
		if (is_numeric($this->assignGroup)) {
			$groupModel = model(GroupModel::class);
			$groupModel->addUserToGroup($data['id'], $this->assignGroup);
		}

		return $data;
	}

	public function getPublicInformation($identity)
	{
		$whereKey = 'id';
		if (!is_numeric($identity)) {
			$whereKey = 'username';
		}
		return $this->asArray()->where($whereKey, $identity)->select($this->getPublicField())->first();
	}

	public function getPublicField()
	{
		return ['id', 'full_name', 'username', 'email', 'phone', 'account_status', 'active', 'dob', 'avatar', 'gender', 'code', 'google_linked', 'facebook_linked', 'office', 'group_id', 'job_title_id', 'department_id', 'device_token'];
	}

	public function getListUsers($field = [])
	{
		$defaultFields = [
			'id',
			'username',
			'full_name',
			'email',
			'avatar'
		];
		$selectFields = array_unique(array_merge($defaultFields, $field));
		$data = $this->select($selectFields)->asArray()->findAll();
		$users = [];
		foreach ($data as $item) {
			$users[$item['id']] = $item;
		}
		return $users;

	}
}
