<?php namespace App\Models;

use CodeIgniter\Model;
use \Tatter\Audits\Traits\AuditsTrait;

class AppOptionModel extends Model
{
	protected $table = 'app_options';
	protected $primaryKey = 'id';
	protected $returnType = 'object';
	protected $useSoftDeletes = false;
	protected $useTimestamps = false;
	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;
	protected $selectFields = ['id', 'table', 'meta_id', 'field', 'value','icon', 'default', 'order'];
	protected $allowedFields = ['id', 'table', 'meta_id', 'field', 'value','icon', 'default', 'order'];

	public function getMetaFieldOptions($table,$field = null){
		$where = [
			'table' => $table,
		];
		if(!empty($field)) $where['field'] = $field;
		return $this->where($where)->orderBy('order','ASC')->findAll();
	}
}

?>