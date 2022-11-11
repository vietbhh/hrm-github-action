<?php namespace Halo\Modules\Models;

use CodeIgniter\Model;

class MetaModel extends Model
{
	protected $table = 'modules_metas';
	protected $primaryKey = 'id';
	protected $returnType = 'object';
	protected $useSoftDeletes = false;
	protected $allowedFields = [
		"module",
		"field",
		"field_enable",
		"field_type",
		"field_select_field_show",
		"field_select_module",
		"field_icon_type",
		"field_icon",
		"field_table_width",
		"field_table_sortable",
		"field_form_col_size",
		"field_form_require",
		"field_default_value",
		"field_readonly",
		"field_table_show",
		"field_form_show",
		"field_quick_view_show",
		"field_detail_show",
		"field_filter_show",
		"field_form_order",
		"field_table_order",
		"field_quick_view_order",
		"field_detail_order",
		"field_filter_order",
		"field_options_values",
		"field_options",
		"field_form_unique",
		"field_quick_form_show",
		"field_validate_rules"
	];
	//Need to update : ,,,field_validate_rules,
	protected $useTimestamps = false;
	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;
	protected $selectFields = [];

	public function getModuleMetas($moduleId = null): array
	{
		$metas = array();
		$data = empty($moduleId) ? $this->findAll() : $this->where('module', $moduleId)->findAll();
		foreach ($data as $item) {
			$metas[$item->id] = $item;
		}
		return $metas;
	}

	public function getModuleMetasUser($moduleId = null, $userId = null): array
	{
		$userId = ($userId) ?: user_id();
		$data = $where = [];
		if ($moduleId || $userId) {
			if ($moduleId) $where['module_id'] = $moduleId;
			if ($userId) $where['user_id'] = $userId;
			$data = $this->db->table('modules_metas_users')->where($where)->get()->getResult();
		}
		return $data;
	}

	public function updateModuleMetasUser($data, $userId = null)
	{
		$userId = ($userId) ?: user_id();
		$moduleId = $data['module_id'];
		$metaId = $data['module_meta_id'];
		if (empty($moduleId) || empty($metaId)) return false;
		$where = [
			'module_id' => $moduleId,
			'module_meta_id' => $metaId,
			'user_id' => $userId,
		];
		if (empty($data['user_id'])) $data['user_id'] = $userId;
		$exist = $this->db->table('modules_metas_users')->where($where)->get()->getRow();
		if (empty($exist)) {
			return $this->db->table('modules_metas_users')->insert($data);
		} else {
			return $this->db->table('modules_metas_users')->update($data, ['id' => $exist->id]);
		}

	}

	public function isMetaFieldExists($moduleId, $field)
	{
		$data = array();
		if ($moduleId) {
			$data = $this->where(['module' => $moduleId, 'field' => $field])->first();
		}
		return $data;
	}
}

?>
