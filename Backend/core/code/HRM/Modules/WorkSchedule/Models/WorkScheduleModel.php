<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : recruitment
* Model name : RecruitmentModel
* Time created : 12/04/2021 06:04:43
*/

namespace HRM\Modules\WorkSchedule\Models;

use App\Models\AppModel;

class WorkScheduleModel extends AppModel
{
	protected $table = 'm_work_schedules';
	protected $primaryKey = 'id';
	protected $returnType = 'array';

	public function formatDay($data)
	{
		$data['day'][0] = json_decode($data['sunday'], true);
		$data['day'][1] = json_decode($data['monday'], true);
		$data['day'][2] = json_decode($data['tuesday'], true);
		$data['day'][3] = json_decode($data['wednesday'], true);
		$data['day'][4] = json_decode($data['thursday'], true);
		$data['day'][5] = json_decode($data['friday'], true);
		$data['day'][6] = json_decode($data['saturday'], true);
		$rmDay = array_diff_key($data, ['monday' => 1, 'tuesday' => 1, 'wednesday' => 1, 'thursday' => 1, 'friday' => 1, 'saturday' => 1, "sunday" => 1]);
		return $rmDay;
	}

	public function findFormat($id)
	{
		$data = $this->select('*')->find($id);
		if (empty($data)){
			return  [];
		}
		$result = $this->formatDay($data);
		return $result;
	}

	public function findAllFormat($filter = [])
	{
		$data = $this->select('*');
		if (count($filter) > 0) {
			foreach ($filter as $key => $val) {
				if ($key === 'textSearch') {
					$data->like('name', $val);
				} else {
					if ($val) {
						$data->where($key, $val);
					}
				}
			}
		}

		$data = $data->findAll();
		$arr = [];
		foreach ($data as $item) {
			$arr[] = $this->formatDay($item);
		}
		return $arr;

	}
}