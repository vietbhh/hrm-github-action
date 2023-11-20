<?php

namespace HRM\Modules\HeaderAssistant\Controllers;

use HRM\Modules\Employees\Models\EmployeesModel;

class HeaderAssistant extends \App\Controllers\HeaderAssistant
{
	public function get_header_assistant_get()
	{
		$data_custom = $this->getHeaderAssistant();

		$result['data_birthday'] = $this->_renderBirthday($this->getDataBirthday());
		$result['data_custom'] = $data_custom;
		return $this->respond($result);
	}

	private function getDataBirthday()
	{
		$month = date('m');
		$day = date('d');

		$model = new EmployeesModel();
		return $model->select("id,full_name,avatar")->where("Month(dob) = '$month'")->where("DAY(dob) = '$day'")->exceptResigned()->asArray()->findAll();
	}
}