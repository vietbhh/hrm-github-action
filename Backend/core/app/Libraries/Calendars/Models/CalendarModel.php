<?php namespace App\Libraries\Calendars\Models;

use CodeIgniter\Model;

class CalendarModel extends Model
{
	protected $table = 'calendars';
	protected $primaryKey = 'id';
	protected $returnType = 'array';
	protected $useSoftDeletes = false;
	protected $allowedFields = ['source', 'source_id', 'user_id', 'event', 'summary', 'created_at', 'label', 'title', 'start', 'end', 'allday', 'description', 'view_permissions', 'update_permissions'];

	protected $useTimestamps = true;
	protected $createdField = 'created_at';
	protected $updatedField = 'updated_at';
	protected $deletedField = 'deleted_at';
	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;

	use \Tatter\Audits\Traits\AuditsTrait;

	protected $beforeInsert = ['ownerInsert'];
	protected $beforeUpdate = ['lastUpdate'];
	protected $afterInsert = ['auditInsert'];
	protected $afterUpdate = ['auditUpdate'];
	protected $afterDelete = ['auditDelete'];


	public function getlist($where = [])
	{
		$this->select('*');
		foreach ($where as $key => $val) {
			$this->where($key, $val);
		}
		return $this->get()->getResultArray();
	}


	public function checkExist($start, $end, $id = null)
	{
		$this->select('*');
		$this->where('start >=', $start);
		$this->where('end <=', $end);
		$this->where('allday =', 0);
		if ($id) {
			$this->where('id !=', $id);
		}
		return $this->get()->getResultArray();
	}

	public function checkPermissiontest($id, $user)
	{
		$this->select(" *,JSON_UNQUOTE(JSON_EXTRACT(view_permissions, '$[*]'))");

		$this->where("JSON_UNQUOTE(JSON_EXTRACT(view_permissions, '$[*]')) LIKE '%[{$user}]%'");
		$this->where('id', $id);
		return $this->getCompiledSelect();
	}

	public function checkPermission($id, $user)
	{

		$this->select(" *,JSON_UNQUOTE(JSON_EXTRACT(view_permissions, '$[]'))");
		$this->where("JSON_UNQUOTE(JSON_EXTRACT(view_permissions, '$[]')) LIKE '%[{$user}]%'");
		$this->where('id', $id);
		return $this->getCompiledSelect();
	}

	public function checkPermit($id, $user)
	{
		$this->select("*");
		$this->where("JSON_UNQUOTE(JSON_EXTRACT(view_permissions, '$[*]')) LIKE '[{$user}]%'");
		$this->where('id', $id);
		return $this->get()->getRowArray();
	}


}
