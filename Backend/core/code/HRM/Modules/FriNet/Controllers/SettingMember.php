<?php

namespace HRM\Modules\FriNet\Controllers;

use App\Controllers\ErpController;
use Halo\Modules\Models\MetaModel;

class SettingMember extends ErpController
{
	public function get_metas_get()
	{
		$moduleManager = \Config\Services::modules();
		$metas = $moduleManager->getMetas("employees", true);
		return $this->respond($metas);
	}

	public function show_hide_info_post()
	{
		$postData = $this->request->getPost();
		$checked = $postData['checked'];
		$field_id = $postData['id'];
		$metaModel = new MetaModel();
		try {
			$data = $metaModel->where('id', $field_id)->asArray()->first();
			$field_options = json_decode($data['field_options'], true);
			$field_options['settingMember'] = filter_var($checked, FILTER_VALIDATE_BOOLEAN);;
			$metaModel->where('id', $field_id)->set(['field_options' => json_encode($field_options)])->update();
			$moduleManager = \Config\Services::modules();
			$moduleManager->getAllMetas(true);
			return $this->respond(ACTION_SUCCESS);
		} catch (\Exception $e) {
			return $this->failForbidden($e->getMessage());
		}
	}
}