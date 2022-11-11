<?php namespace Tatter\Audits\Traits;

use CodeIgniter\Config\Services;
use Tatter\Audits\Models\AuditModel;

/*** CLASS ***/
trait AuditsTrait
{
	// takes an array of model $returnTypes and returns an array of Audits, arranged by object and event
	// optionally filter by $events (string or array of strings)
	public function getAudits(array $objects, $events = null): array
	{
		if (empty($objects)) {
			return [];
		}

		// Get the primary keys from the objects
		$objectIds = array_column($objects, $this->primaryKey);

		// Start the query
		$query = model(AuditModel::class)->builder()->where('source', $this->table)->whereIn('source_id', $objectIds);

		if (is_string($events)) {
			$query = $query->where('event', $events);
		} elseif (is_array($events)) {
			$query = $query->whereIn('event', $events);
		}

		// Index by objectId, event
		$array = [];
		// @phpstan-ignore-next-line
		while ($audit = $query->getUnbufferedRow()) {
			if (empty($array[$audit->{$this->primaryKey}])) {
				$array[$audit->{$this->primaryKey}] = [];
			}
			if (empty($array[$audit->{$this->primaryKey}][$audit->event])) {
				$array[$audit->{$this->primaryKey}][$audit->event] = [];
			}

			$array[$audit->{$this->primaryKey}][$audit->event][] = $audit;
		}

		return $array;
	}

	// record successful insert events
	protected function auditInsert(array $data)
	{
		if (!$data['result'])
			return false;

		$audit = [
			'source' => $this->table,
			'source_id' => $this->db->insertID(),
			'event' => 'insert',
			'summary' => count($data['data']) . ' fields',
		];
		Services::audits()->add($audit);

		return $data;
	}

	// record successful update events
	protected function auditUpdate(array $data)
	{
		$audit = [
			'source' => $this->table,
			'source_id' => (empty($data['id'])) ? 0 : (is_array($data['id']) ? implode(",", $data['id']) : $data['id']),
			'event' => 'update',
			'summary' => count($data['data']) . ' fields',
		];
		Services::audits()->add($audit);

		return $data;
	}

	// record successful delete events
	protected function auditDelete(array $data)
	{
		if (!$data['result'])
			return false;
		if (empty($data['id']))
			return false;

		$audit = [
			'source' => $this->table,
			'event' => 'delete',
			'summary' => ($data['purge']) ? 'purge' : 'soft',
		];

		// add an entry for each ID
		$audits = Services::audits();
		foreach ($data['id'] as $id):
			$audit['source_id'] = $id;
			$audits->add($audit);
		endforeach;

		return $data;
	}

	protected function ownerInsert(array $data)
	{
		if (!function_exists('user_id')) helper('auth');
		if (empty($data)) return $data;
		if (empty($data['data']['owner'])) $data['data']['owner'] = user_id();
		if (empty($data['data']['created_by'])) $data['data']['created_by'] = user_id();
		return $data;
	}


	protected function createdByInsert(array $data)
	{
		if (!function_exists('user_id')) helper('auth');
		if (empty($data)) return $data;
		if (empty($data['data']['created_by'])) $data['data']['created_by'] = user_id();
		return $data;
	}

	protected function lastUpdate(array $data)
	{
		if (!function_exists('user_id')) helper('auth');
		if (empty($data)) return $data;
		$data['data']['updated_by'] = user_id();
		return $data;
	}


}