<?php namespace App\Libraries\Notifications\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
	protected $table = 'notifications';
	protected $primaryKey = 'id';
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = ['sender_id', 'recipient_id', 'type', 'title', 'body', 'link', 'icon', 'read_by', 'actions', 'created_at', 'created_by'];
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

	public function listNotification($perPage = 10, $page = 0, $unreadOnly = false): array
	{
		$user = user_id();
		$this->select("*");
		$this->where(handleJsonQueryString("recipient_id", $user));
		if ($unreadOnly) $this->where(handleJsonQueryString("read_by", $user, "!="));
		if ($perPage != 0) {
			if ($page > 0) {
				$this->limit($perPage, $page * $perPage);
			} else {
				$this->limit($perPage);
			}
		}
		return $this->orderBy('id', 'DESC')->findAll();
	}

	public function getUnreadNotificationNumber()
	{
		$user = user_id();
		$this->select("id");
		$this->where(handleJsonQueryString("recipient_id", $user));
		$this->where(handleJsonQueryString("read_by", $user, "!="));
		return $this->countAllResults();
	}

	public function markAsRead($data): bool
	{
		$readBy = !empty($data['read_by']) ? json_decode($data['read_by']) : [];
		if (!in_array(user_id(), $readBy)) {
			$readBy[] = user_id();
			$this->set('read_by', json_encode($readBy))->where('id', $data['id'])->update();
		}
		return true;
	}
}
