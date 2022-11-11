<?php namespace App\Models;

use CodeIgniter\Model;
use Exception;
use \Tatter\Audits\Traits\AuditsTrait;

class AppAutoNumberModel extends Model
{
	protected $table = 'app_autonumbers';
	protected $primaryKey = 'id';
	protected $returnType = 'object';
	protected $useSoftDeletes = false;
	protected $allowedFields = ['module', 'field', 'current_num', 'text_code', 'decimals', 'active'];
	protected $useTimestamps = false;
	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;
	protected $selectFields = ['id', 'module', 'field', 'current_num', 'text_code', 'decimals', 'active'];

	public function getCurrentNumber($module, $field)
	{
		$query = $this->select($this->selectFields);
		$query = $query->where([
			'module' => $module,
			'field' => $field
		]);
		$result = $query->get()->getRowArray();
		$text = $result['text_code'];
		for ($i = 0; $i <= $result['decimals'] - strlen($result['current_num']); $i++) {
			$text .= '0';
		}
		$result['result'] = $text . $result['current_num'];
		return $result;
	}

	public function updateAutoNumber($data)
	{
		if (isset($data['active'])) {
			$data['active'] = ($data['active'] == 'true') ? 1 : 0;
		}
		$this->setAllowedFields(array_keys($data));
		try {
			$this->save($data);
		} catch (Exception $e) {
			return false;
		}

		return true;
	}

	public function increaseCurrentNumber($id)
	{
		return $this->set('current_num', 'current_num+1', false)->where('id', $id)->update();
	}
}

?>