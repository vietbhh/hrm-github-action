<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : setting
* Controller name : Setting
* Time created : 14/09/2020 20:24:20
*/

namespace App\Controllers\Settings;

use App\Controllers\ErpController;

class Mail extends ErpController
{
	public function templates_get($returnOption = false)
	{
		$mail = \Config\Services::mail();
		$condition = $this->request->getGet();
		$conditionKey = ['source', 'id', 'category'];
		$where = [];
		foreach ($condition as $key => $item) {
			if (in_array($key, $conditionKey)) {
				$where[$key] = $item;
			}
		}
		return $this->respond($mail->getTemplates($where, $returnOption));
	}

	public function templates_post()
	{
		$mail = \Config\Services::mail();
		$data = $this->request->getPost();
		return $this->respond($mail->saveTemplate($data));
	}

	public function templates_delete($id)
	{
		$mail = \Config\Services::mail();
		$template = $mail->getTemplates($id);
		if (filter_var($template['isLock'], FILTER_VALIDATE_BOOLEAN)) {
			return $this->failValidationErrors('UNABLE_DELETE_LOCKED_TEMPLATES');
		}
		$mail->deleteTemplate($id);
		return $this->respond(ACTION_SUCCESS);
	}

}