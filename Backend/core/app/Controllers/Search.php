<?php

namespace App\Controllers;

use App\Models\UserModel;

class Search extends ErpController
{
	public function cacheDataEmployeeSearch()
	{
		$userModel = new UserModel();
		$dataEmployeeSearch_db = $userModel->select(["id", "full_name", "username", "email", "avatar"])->asArray()->findAll();
		$dataEmployeeSearch = [];
		foreach ($dataEmployeeSearch_db as $item) {
			$item['link'] = "/user/u/" . $item['username'];
			$item['title'] = $item['full_name'] . " - " . $item['username'];
			$dataEmployeeSearch[] = $item;
		}
		cache()->save('dataUserSearch', $dataEmployeeSearch, getenv('default_cache_time'));

		return $dataEmployeeSearch;
	}

	public function get_data_employee_search_get()
	{
		if (!$dataUserSearch = cache('dataUserSearch')) {
			$dataUserSearch = $this->cacheDataEmployeeSearch();
		}

		return $this->respond($dataUserSearch);
	}
}