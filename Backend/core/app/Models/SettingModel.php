<?php namespace App\Models;

use CodeIgniter\Model;

class SettingModel extends Model
{
	protected $table = 'settings';
	protected $primaryKey = 'id';

	protected $returnType = 'object';
	protected $useSoftDeletes = true;

	protected $allowedFields = ['key', 'class', 'type', 'value', 'summary', 'config', 'protected', 'secret', 'context'];

	protected $useTimestamps = true;

	protected $validationRules = [];
	protected $validationMessages = [];
	protected $skipValidation = false;

	public function getDefaultSettings(): array
	{
		$data = $this->groupBy(['key', 'class'])->where('context IS NULL')->findAll();
		if (is_array($data)) {
			foreach ($data as $key => $item) {
				if (is_array($item)) {
					$item['config'] = empty($item['config']) ? [] : json_decode($item['config'], true);
				} else {
					$item->config = empty($item->config) ? (object)[] : json_decode($item->config);
				}
				$data[$key] = $item;
			}
		} else {
			if (is_array($data)) {
				$data['config'] = empty($data['config']) ? [] : json_decode($data['config'], true);
			} else {
				$data->config = empty($data->config) ? (object)[] : json_decode($data->config);
			}

		}
		return $data;
	}
}
