<?php

namespace HRM\Modules\Employees\Libraries\Employees;

use Exception;

class Employees
{
	/**
	 * @param string $typeCreate : changed / joining
	 * @param array $dataInsert
	 *          * changed: array_key: ['field' => '...', 'from' => '...', 'to' => '...']  note: changed Field From something To something
	 *          * joining: array_key: ['department' => '...', 'job_title' => '...', 'date' => '...']  note: joining Department as a Job_title on Date
	 *          * date_format: Y-m-d
	 * @throws Exception
	 */
	public function createNewEmployeeHistory($employeeId, string $typeCreate, array $dataInsert)
	{
		if (isset($dataInsert['department']) || isset($dataInsert['field'])) {
			$arr[] = $dataInsert;
			$dataInsert = $arr;
		}

		if (($typeCreate == 'joining' && !isset($dataInsert[0]['department'])) || ($typeCreate == 'changed' && !isset($dataInsert[0]['field']))) {
			throw new Exception("Error array format");
		}

		$data = [];
		if ($typeCreate == 'changed') {
			foreach ($dataInsert as $item) {
				$field = $this->_handleCheckEmpty($item['field']);
				$from = $this->_handleCheckEmpty($item['from']);
				$to = $this->_handleCheckEmpty($item['to']);
				$data[] = [
					'employee' => $employeeId,
					'description' => "changed@$field@was_changed_from@ \"$from\" @to@ \"$to\"",
					'owner' => empty(user_id()) ? 1 : user_id(),
					'created_by' => empty(user_id()) ? 1 : user_id(),
				];
			}
		}

		if ($typeCreate == 'joining') {
			$app_name = preference("app_name");
			foreach ($dataInsert as $item) {
				$department = $this->_handleCheckEmpty($item['department']);
				$job_title = $this->_handleCheckEmpty($item['job_title']);
				$date = $this->_handleCheckEmpty($item['date']);
				$data[] = [
					'employee' => $employeeId,
					'description' => "joining@ \"$department\" @as_a(n)@ \"$job_title\" @at@ \"$app_name\" @on@ \"$date\"",
					'owner' => empty(user_id()) ? 1 : user_id(),
					'created_by' => empty(user_id()) ? 1 : user_id(),
				];
			}
		}

		if (!empty($data)) {
			$modules = \Config\Services::modules("employee_histories");
			$model = $modules->model;
			$model->setAllowedFields(["employee", "description", "owner", "created_by"]);
			$model->insertBatch($data);
		}
	}

	//
	private function _handleCheckEmpty($param)
	{
		if (empty($param)) return "Unknown";
		return $param;
	}
}