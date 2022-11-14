<?php

namespace HRM\Modules\HeaderAssistant\Controllers;

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
		$datetoday = date("Y-m-d");
		$modules = \Config\Services::modules();
		$modules->setModule('employees');
		$model = $modules->model;
		return $model->select("id,full_name,avatar")->where("dob", $datetoday)->asArray()->findAll();
	}
}