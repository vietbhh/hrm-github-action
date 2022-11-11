<?php namespace Halo\Modules\Models;

use Halo\Modules\Entities\Module;

class ModuleModel extends \Tatter\Permits\Model
{
	protected $table = 'modules';
	protected $primaryKey = 'id';
	protected $returnType = Module::class;
	protected $useSoftDeletes = true;
	protected $allowedFields = ['name', 'tableName', 'type', 'layout', 'fullWidth', 'icon', 'moduleIcon', 'add_mode', 'update_mode', 'view_mode', 'sidebar_menu', 'options'];
	protected $useTimestamps = true;
	protected $validationRules = [
		'name' => 'required|is_unique[modules.name,id,{id}]',
		'tableName' => 'required|is_unique[modules.tableName,id,{id}]'
	];
	protected $validationMessages = [];
	protected $skipValidation = false;
	protected $selectFields = [];

	//Audits
	use \Tatter\Audits\Traits\AuditsTrait;

	protected $beforeInsert = ['createdByInsert'];
	protected $beforeUpdate = ['lastUpdate'];
	protected $afterInsert = ['auditInsert'];
	protected $afterUpdate = ['auditUpdate'];
	protected $afterDelete = ['auditDelete'];

	public function getModule($identify)
	{
		return is_numeric($identify) ? $this->find($identify) : $this->where('name', $identify)->first();
	}

	public function getModuleUserOptions($moduleId = null, $userId = null)
	{
		if (is_cli()) {
			return [];
		}
		if (!function_exists('user_id')) helper('auth');
		$userId = ($userId) ?: user_id();
		$where = [];
		$result = [];
		if ($moduleId || $userId) {
			if ($moduleId) $where['module_id'] = $moduleId;
			if ($userId) $where['user_id'] = $userId;
			$query = $this->db->table('modules_users')->where($where)->get();
			$data = empty($moduleId) ? $query->getResultArray() : $query->getRowArray();
		}

		if (!empty($data)) {
			if (empty($moduleId)) {
				foreach ($data as $key => $item) {
					$result[$item['module_id']] = empty($item['user_options']) ? [] : json_decode($item['user_options'], true);
				}
			} else {
				$result = empty($data['user_options']) ? [] : json_decode($data['user_options'], true);
			}
		}

		return $result;
	}

	public function saveModuleUserOptions($moduleId, $options)
	{
		$userId = user_id();
		$where = [
			'module_id' => $moduleId,
			'user_id' => $userId,
		];
		$exist = $this->db->table('modules_users')->where($where)->get()->getRowArray();
		if (empty($exist)) {
			$data = [
				'module_id' => $moduleId,
				'user_id' => $userId,
				'user_options' => json_encode($options)
			];
			return $this->db->table('modules_users')->insert($data);
		} else {
			$existOptions = empty($exist['user_options']) ? [] : json_decode($exist['user_options'], true);
			$updateData = array_merge($existOptions, $options);
			return $this->db->table('modules_users')->update(['user_options' => json_encode($updateData)], ['id' => $exist['id']]);
		}
	}

}

?>
