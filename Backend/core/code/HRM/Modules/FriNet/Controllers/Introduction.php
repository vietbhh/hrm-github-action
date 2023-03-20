<?php

namespace HRM\Modules\FriNet\Controllers;

use App\Controllers\ErpController;

class Introduction extends ErpController
{
	public function get_setting_member_get()
	{
		$moduleManager = \Config\Services::modules();
		$metas = $moduleManager->getMetas("employees", true);

		$result = [
			'personalInfo' => [],
			'address' => [],
			'bankInfo' => [],
			'socialNetwork' => [],
			'otherField' => [],
			'jobField' => [],
			'payrollField' => []
		];
		foreach ($metas as $item) {
			if (
				$item->field_enable && !empty($item->field_options) &&
				(
					(isset($item->field_options['settingMember']) && $item->field_options['settingMember']) ||
					!isset($item->field_options['settingMember'])
				) &&
				isset($item->field_options['form']['tabId'])
			) {
				if ($item->field_options['form']['tabId'] === "general") {
					$result['personalInfo'][] = $item;
				}
				if ($item->field_options['form']['tabId'] === "contact") {
					$result['address'][] = $item;
				}
				if ($item->field_options['form']['tabId'] === "bankaccount") {
					$result['bankInfo'][] = $item;
				}
				if ($item->field_options['form']['tabId'] === "social") {
					$result['socialNetwork'][] = $item;
				}
				if ($item->field_options['form']['tabId'] === "other") {
					$result['otherField'][] = $item;
				}
				if ($item->field_options['form']['tabId'] === "job") {
					$result['jobField'][] = $item;
				}
				if ($item->field_options['form']['tabId'] === "payroll") {
					$result['payrollField'][] = $item;
				}
			}
		}

		return $this->respond($result);
	}
}