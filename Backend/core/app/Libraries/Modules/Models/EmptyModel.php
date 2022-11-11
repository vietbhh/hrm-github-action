<?php namespace Halo\Modules\Models;

class EmptyModel extends \Tatter\Permits\Model
{
	protected $table = '';
	protected $allowedFields = [];
	protected $returnType = 'object';
	protected $useTimestamps = true;
	protected $protectFields = true;
	protected $skipValidation = true;
	protected $validationRules = [];
	protected $validationMessages = [];

	//Audits
	use \Tatter\Audits\Traits\AuditsTrait;

	protected $beforeInsert = ['ownerInsert'];
	protected $beforeUpdate = ['lastUpdate'];
	protected $afterInsert = ['auditInsert'];
	protected $afterUpdate = ['auditUpdate'];
	protected $afterDelete = ['auditDelete'];


	public function getLastQuery()
	{
		return $this->getLastQuery();
	}

	public function withoutTimestamps()
	{
		$this->useTimestamps = false;
		return $this;
	}

	public function withoutTrigger()
	{
		$this->beforeInsert = [];
		$this->beforeUpdate = [];
		$this->afterUpdate = [];
		$this->afterInsert = [];
		$this->afterDelete = [];
		return $this;
	}

	public function setBeforeInsert($params = [])
	{
		$this->beforeInsert = $params;
		return $this;
	}

	public function setBeforeUpdate($params = [])
	{
		$this->beforeUpdate = $params;
		return $this;
	}

	public function setAfterInsert($params = [])
	{
		$this->afterInsert = $params;
		return $this;
	}

	public function setAfterUpdate($params = [])
	{
		$this->afterUpdate = $params;
		return $this;
	}

	public function setAfterDelete($params = [])
	{
		$this->afterDelete = $params;
		return $this;
	}
}

?>