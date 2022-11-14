<?php

namespace HRM\Controllers;

use App\Controllers\ErpController;
use HRM\Modules\Employees\Models\EmployeesModel;

class Search extends ErpController
{
	public function cacheDataEmployeeSearch()
	{
		$employeeModel = new EmployeesModel();
		$employeeModel->exceptResigned();
		$dataEmployeeSearch_db = $employeeModel->select(["id", "full_name", "username", "email", "avatar", "line_manager"])->asArray()->findAll();
		$dataEmployeeSearch = [];
		foreach ($dataEmployeeSearch_db as $item) {
			$item['link'] = "/user/u/" . $item['username'];
			$item['title'] = $item['full_name'] . " - " . $item['username'];
			$dataEmployeeSearch[] = $item;
		}
		cache()->save('dataEmployeeSearch', $dataEmployeeSearch, getenv('default_cache_time'));

		return $dataEmployeeSearch;
	}

	public function get_data_employee_search_get()
	{
		helper('HRM\Modules\Employees\Helpers\employee_helper');
		if (!$dataEmployeeSearch = cache('dataEmployeeSearch')) {
			$dataEmployeeSearch = $this->cacheDataEmployeeSearch();
		}

		if (hasModulePermit("employees", 'allEmployeesIncludingResignedOnes') || hasModulePermit("employees", 'allEmployees')) {
			return $this->respond($dataEmployeeSearch);
		}

		if (hasModulePermit("employees", 'directAndIndirectReports')) {
			$data = getEmployeesByRank(user_id(), "subordinate", $dataEmployeeSearch, false);
			return $this->respond(array_values($data));
		}

		if (hasModulePermit("employees", 'directReports')) {
			$data = getEmployeesByRank(user_id(), "subordinate", $dataEmployeeSearch, true);
			return $this->respond(array_values($data));
		}

		return $this->respond([]);
	}
}