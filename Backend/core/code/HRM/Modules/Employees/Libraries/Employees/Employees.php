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

	public function getOverviewEmployee($filter = [])
	{
		helper('app_select_option');
		$employeeService = \HRM\Modules\Employees\Libraries\Employees\Config\Services::employees();

		$result = [
			'total_employee_number' => 0,
			'total_employee_rate' => 0,
			'total_employee_grow' => false,
			'new_employee_number' => 0,
			'new_employee_rate' => 0,
			'new_employee_grow' => false,
			'onboarding_number' => 0,
			'onboarding_rate' => 0,
			'onboarding_grow' => false,
			'turn_over_number' => 0,
			'turn_over_rate' => 0,
			'turn_over_grow' => false
		];

		$firstDayOfCurrentMonth = date('Y-m-01');
		$lastDayOfCurrentMonth = date('Y-m-t');
		$firstDayOfLastMonth = date('Y-m-01', strtotime('-1 month'));
		$lastDayOfLastMonth = date('Y-m-t', strtotime('-1 month'));
		$currentDate = date('Y-m-d');

		$modulesEmployee = \Config\Services::modules('employees');
		$modelEmployee = $modulesEmployee->model;

		// ** total employee
		$result['total_employee_number'] = $modelEmployee
			->whereNotIn('status', [
				getOptionValue('employees', 'status', 'offboarding'),
				getOptionValue('employees', 'status', 'resigned')
			])->countAllResults();
		$totalEmployeeLastMonth = $modelEmployee
			->whereNotIn('status', [
				getOptionValue('employees', 'status', 'offboarding'),
				getOptionValue('employees', 'status', 'resigned')
			])
			->where('join_date <=', $lastDayOfLastMonth)
			->where('join_date >=', $firstDayOfLastMonth)
			->countAllResults();

		$totalEmployeeCurrentMonth = $modelEmployee
			->whereNotIn('status', [
				getOptionValue('employees', 'status', 'offboarding'),
				getOptionValue('employees', 'status', 'resigned')
			])
			->where('join_date <=', $lastDayOfCurrentMonth)
			->where('join_date >=', $firstDayOfCurrentMonth)
			->countAllResults();
		$result['total_employee_rate'] = $this->_getRate($totalEmployeeLastMonth, $totalEmployeeCurrentMonth);
		$result['total_employee_grow'] =  $result['total_employee_rate'] >= 0;

		// ** new employee
		$result['new_employee_number'] = $modelEmployee->whereNotIn('status', [
			getOptionValue('employees', 'status', 'offboarding'),
			getOptionValue('employees', 'status', 'resigned')
		])
			->where('join_date <=', $currentDate)
			->where('join_date >=', date('Y-m-d', strtotime('-30 days', strtotime($currentDate))))
			->countAllResults();

		$newEmployeeLastThirtyDate = $modelEmployee->whereNotIn('status', [
			getOptionValue('employees', 'status', 'offboarding'),
			getOptionValue('employees', 'status', 'resigned')
		])
			->where('join_date <=', date('Y-m-d', strtotime('-30 days', strtotime($currentDate))))
			->where('join_date >=', date('Y-m-d', strtotime('-60 days', strtotime($currentDate))))
			->countAllResults();

		$result['new_employee_rate'] = $this->_getRate($newEmployeeLastThirtyDate, $result['new_employee_number']);
		$result['new_employee_grow'] =  $result['new_employee_rate'] >= 0;


		$modulesEmployeeHistory = \Config\Services::modules('employee_histories');
		$modelEmployeeHistory = $modulesEmployeeHistory->model;

		$typeOptionUpdateStatus = getOptionValue('employee_histories', 'type', 'update_status');
		$typeOptionJoin = getOptionValue('employee_histories', 'type', 'join');
		$listAllHistory = $modelEmployeeHistory->asArray()
			->where('created_at <=', $lastDayOfCurrentMonth . ' 23:59:59')
			->where('created_at >=', $firstDayOfLastMonth . ' 00:00:00')
			->whereIn('type', [
				$typeOptionUpdateStatus,
				$typeOptionJoin
			])
			->orderBy('created_at', 'ASC')
			->findAll();

		// ** group data by employee
		$listAllHistoryNew = [];
		foreach ($listAllHistory as $row) {
			$status = 'onboarding';
			if ($row['type'] == $typeOptionUpdateStatus) {
				$arrStatusChange = $employeeService->getChangedField($row['description']);
				$status = isset($arrStatusChange['to']) ? $arrStatusChange['to'] : '';
			}

			$listAllHistoryNew[$row['employee']][date('Y-m', strtotime($row['created_at']))][$status] = [
				'id' => $row['employee'],
				'created_at' => $row['created_at'],
				'status' => $status
			];
		}

		$onboardingNumberLastMonth = 0;
		$turnOverNumberLastMonth = 0;
		foreach ($listAllHistoryNew as $employees) {
			foreach ($employees as $times) {
				foreach ($times as $key => $row) {
					$createdAt = date('Y-m-d', strtotime($row['created_at']));

					if (empty($row['status'])) {
						continue;
					}

					if ($row['status'] == 'onboarding') {
						if (strtotime($createdAt) <= strtotime($lastDayOfCurrentMonth) && strtotime($createdAt) >= strtotime($firstDayOfCurrentMonth)) {
							$result['onboarding_number'] += 1;
						} elseif (strtotime($createdAt) <= strtotime($lastDayOfLastMonth) && strtotime($createdAt) >= strtotime($firstDayOfLastMonth)) {
							$onboardingNumberLastMonth += 1;
						}
					} elseif ($row['status'] == 'offboarding' || $row['status'] == 'resigned') {
						if (strtotime($createdAt) <= strtotime($lastDayOfCurrentMonth) && strtotime($createdAt) >= strtotime($firstDayOfCurrentMonth)) {
							$result['turn_over_number'] += 1;
						} elseif (strtotime($createdAt) <= strtotime($lastDayOfLastMonth) && strtotime($createdAt) >= strtotime($firstDayOfLastMonth)) {
							$turnOverNumberLastMonth += 1;
						}
					}
				}
			}
		}

		// ** onboarding
		$result['onboarding_rate'] = $this->_getRate($onboardingNumberLastMonth, $result['onboarding_number']);
		$result['onboarding_grow'] = $result['onboarding_rate'] >= 0;

		// ** turn over
		$result['turn_over_rate'] = $this->_getRate($turnOverNumberLastMonth, $result['turn_over_number']);
		$result['turn_over_grow'] = $result['turn_over_rate'] >= 0;

		return $result;
	}

	//
	private function _handleCheckEmpty($param)
	{
		if (empty($param)) return "Unknown";
		return $param;
	}

	private function _getRate($number1, $number2)
	{
		if (($number1 != 0 && $number2 != 0) && $number1 != $number2) {
			return (($number2 - $number1) / $number1) * 100;
		} elseif ($number1 == 0 && $number2 != 0) {
			return $number2 * 100;
		} elseif ($number1 != 0 && $number2 == 0) {
			return 0 - ($number1 * 100);
		}

		return 0;
	}
}
