<?php namespace App\Libraries\Notifications\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
	protected $table = 'notifications';
	protected $primaryKey = 'id';
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = ['sender_id', 'recipient_id', 'type', 'title', 'body', 'link', 'image', 'read_by', 'created_at', 'created_by'];
	protected $useTimestamps = true;
	protected $createdField = 'created_at';
	protected $updatedField = '';
	protected $deletedField = '';
	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;

	use \Tatter\Audits\Traits\AuditsTrait;

	protected $beforeInsert = ['ownerInsert'];
	protected $beforeUpdate = ['lastUpdate'];
	protected $afterInsert = ['auditInsert'];
	protected $afterUpdate = ['auditUpdate'];
	protected $afterDelete = ['auditDelete'];

	public function checkPermit($id, $user)
	{
		$this->select(" *,JSON_UNQUOTE(JSON_EXTRACT(recipient_id, '$[*]'))");
		$this->where("JSON_SEARCH(recipient_id, 'all', '{$user}', null, '$[*]') IS NOT NULL ");
		$this->where('id', $id);
		return $this->get()->getRowArray();
	}

	public function listNoti($user, $perPage, $page)
	{
		$this->select("*");
		$this->where("JSON_SEARCH(recipient_id, 'all', '{$user}', null, '$[*]') IS NOT NULL ");
		if ($page > 1) {
			$this->limit($perPage, $page * $perPage);
		} else {
			$this->limit($perPage);
		}
		return $this->orderBy('id', 'DESC')->get()->getResultArray();
	}

	public function getNotificationNumber($user)
	{
		$this->select("id");
		$this->where("JSON_SEARCH(recipient_id, 'all', '{$user}', null, '$[*]') IS NOT NULL ");
		$this->where("JSON_SEARCH(read_by, 'all', '{$user}', null, '$[*]') IS NULL ");
		return $this->countAllResults();
	}

	public function checkAndRead($data)
	{
		$readBy = !empty($data['read_by']) ? json_decode($data['read_by']) : [];
		$a = in_array(user_id(), $readBy);
		if (!$a) {
			$readBy[] = user_id();
			$this->set('read_by', json_encode($readBy))->where('id', $data['id'])->update();
		}
		return true;
	}
}
