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
	public function createNewEmployeeHistory($employeeId, string $typeCreate, array $dataInsert, array $arrAdditionalTypeValue = [])
	{
		helper('app_select_option');
		if (isset($dataInsert['department']) || isset($dataInsert['field'])) {
			$arr[] = $dataInsert;
			$dataInsert = $arr;
		}

		if (($typeCreate == 'joining' && !isset($dataInsert[0]['department'])) || ($typeCreate == 'changed' && !isset($dataInsert[0]['field']))) {
			throw new Exception("Error array format");
		}

		$typeOptionUpdate = getOptionValue('employee_histories', 'type', 'update');
		$typeOptionUpdateStatus = getOptionValue('employee_histories', 'type', 'update_status');
		$typeOptionJoin = getOptionValue('employee_histories', 'type', 'join');

		$arrTypeValue = [
			'status' => $typeOptionUpdateStatus
		];
		$arrTypeValue = array_merge($arrTypeValue, $arrAdditionalTypeValue);

		$data = [];
		if ($typeCreate == 'changed') {

			foreach ($dataInsert as $item) {
				$field = $this->_handleCheckEmpty($item['field']);
				$from = $this->_handleCheckEmpty($item['from']);
				$to = $this->_handleCheckEmpty($item['to']);
				$data[] = [
					'employee' => $employeeId,
					'description' => "changed@$field@was_changed_from@ \"$from\" @to@ \"$to\"",
					'type' => isset($arrTypeValue[$field]) ? $arrTypeValue[$field] : $typeOptionUpdate,
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
					'type' => $typeOptionJoin,
					'owner' => empty(user_id()) ? 1 : user_id(),
					'created_by' => empty(user_id()) ? 1 : user_id(),
				];
			}
		}

		if (!empty($data)) {
			$modules = \Config\Services::modules("employee_histories");
			$model = $modules->model;
			$model->setAllowedFields(["employee", "description", "owner", "created_by", "type"]);
			$model->insertBatch($data);
		}
	}

	public function getChangedField($description)
	{
		if (strlen(trim($description)) == 0) {
			return [];
		}

		$result = [
			'field' => '',
			'from' => '',
			'to' => ''
		];

		$arrDescription = explode('@', $description);
		$result['field'] = isset($arrDescription[1]) ? $arrDescription[1] : '';

		$strReplace = str_replace('changed@'.$result['field'].'@was_changed_from@ ', '', $description);
		$arrStatus = explode(' @to@ ', $strReplace);
		$result['from'] = isset($arrStatus[0]) ? str_replace('"', '', $arrStatus[0]) : '';
		$result['to'] = isset($arrStatus[1]) ? str_replace('"', '', $arrStatus[1]) : '';

		return $result;
	}

	//
	private function _handleCheckEmpty($param)
	{
		if (empty($param)) return "Unknown";
		return $param;
	}
}
