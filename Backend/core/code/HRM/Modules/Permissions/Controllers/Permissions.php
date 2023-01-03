<?php

namespace HRM\Modules\Permissions\Controllers;

use App\Controllers\ErpController;
use Myth\Auth\Authorization\GroupModel;

class Permissions extends ErpController
{
	protected array $arrPermissionRadio = [
		[
			'value' => 'all_employees_including_resigned_ones',
			'permission' => 'modules.employees.allEmployeesIncludingResignedOnes'
		],
		[
			'value' => 'all_employees',
			'permission' => 'modules.employees.allEmployees'
		],
		[
			'value' => 'direct_and_indirect_reports',
			'permission' => 'modules.employees.directAndIndirectReports'
		],
		[
			'value' => 'direct_reports',
			'permission' => 'modules.employees.directReports'
		]
	];
	protected array $arrPermissionSelectEmployee = [
		[
			'name' => 'employee_personal_info',
			'value' => [
				'view_only' => ['modules.employees.viewPersonalInfo'],
				'view_and_edit' => ['modules.employees.viewPersonalInfo', 'modules.employees.updatePersonalInfo']
			]
		],
		[
			'name' => 'employee_address',
			'value' => [
				'view_only' => ['modules.employees.viewAddress'],
				'view_and_edit' => ['modules.employees.viewAddress', 'modules.employees.updateAddress']
			]
		],
		[
			'name' => 'employee_bank_info',
			'value' => [
				'view_only' => ['modules.employees.viewBankInformation'],
				'view_and_edit' => ['modules.employees.viewBankInformation', 'modules.employees.updateBankInformation']
			]
		],
		[
			'name' => 'employee_social_network',
			'value' => [
				'view_only' => ['modules.employees.viewSocialNetwork'],
				'view_and_edit' => ['modules.employees.viewSocialNetwork', 'modules.employees.updateSocialNetwork']
			]
		],
		[
			'name' => 'employee_other',
			'value' => [
				'view_only' => ['modules.employees.viewOther'],
				'view_and_edit' => ['modules.employees.viewOther', 'modules.employees.updateOther']
			]
		],
		[
			'name' => 'employee_job_information',
			'value' => [
				'view_only' => ['modules.employees.viewJobInformation'],
				'view_and_edit' => ['modules.employees.viewJobInformation', 'modules.employees.updateJobInformation']
			]
		],
		[
			'name' => 'employee_contracts',
			'value' => [
				'view_only' => ['modules.employees.viewContracts'],
				'view_and_edit' => ['modules.employees.viewContracts', 'modules.employees.updateContracts']
			]
		],
		[
			'name' => 'employee_work_schedule',
			'value' => [
				'view_only' => ['modules.employees.viewWorkSchedule'],
				'view_and_edit' => ['modules.employees.viewWorkSchedule', 'modules.employees.updateWorkSchedule']
			]
		],
		[
			'name' => 'employee_payrolls',
			'value' => [
				'view_only' => ['modules.employees.viewPayroll']
			]
		],
		[
			'name' => 'employee_educations',
			'value' => [
				'view_only' => ['modules.employees.viewEducations'],
				'view_and_edit' => ['modules.employees.viewEducations', 'modules.employees.updateEducations']
			]
		],
		[
			'name' => 'employee_dependents',
			'value' => [
				'view_only' => ['modules.employees.viewDependents'],
				'view_and_edit' => ['modules.employees.viewDependents', 'modules.employees.updateDependents']
			]
		],
		[
			'name' => 'employee_documents',
			'value' => [
				'view_only' => ['modules.employees.viewDocuments'],
				'view_and_edit' => ['modules.employees.viewDocuments', 'modules.employees.updateDocuments']
			]
		],
		[
			'name' => 'employee_activity',
			'value' => [
				'view_only' => ['modules.employees.viewActivity']
			]
		]
	];
	protected array $arrPermissionSelectProfile = [
		[
			'name' => 'profile_personal_info',
			'value' => [
				'view_only' => ['custom.profile.viewPersonalInfo'],
				'view_and_edit' => ['custom.profile.viewPersonalInfo', 'custom.profile.updatePersonalInfo']
			]
		],
		[
			'name' => 'profile_address',
			'value' => [
				'view_only' => ['custom.profile.viewAddress'],
				'view_and_edit' => ['custom.profile.viewAddress', 'custom.profile.updateAddress']
			]
		],
		[
			'name' => 'profile_bank_info',
			'value' => [
				'view_only' => ['custom.profile.viewBankInformation'],
				'view_and_edit' => ['custom.profile.viewBankInformation', 'custom.profile.updateBankInformation']
			]
		],
		[
			'name' => 'profile_social_network',
			'value' => [
				'view_only' => ['custom.profile.viewSocialNetwork'],
				'view_and_edit' => ['custom.profile.viewSocialNetwork', 'custom.profile.updateSocialNetwork']
			]
		],
		[
			'name' => 'profile_other',
			'value' => [
				'view_only' => ['custom.profile.viewOther'],
				'view_and_edit' => ['custom.profile.viewOther', 'custom.profile.updateOther']
			]
		],
		[
			'name' => 'profile_job_information',
			'value' => [
				'view_only' => ['custom.profile.viewJobInformation'],
				'view_and_edit' => ['custom.profile.viewJobInformation', 'custom.profile.updateJobInformation']
			]
		],
		[
			'name' => 'profile_contracts',
			'value' => [
				'view_only' => ['custom.profile.viewContracts'],
				'view_and_edit' => ['custom.profile.viewContracts', 'custom.profile.updateContracts']
			]
		],
		[
			'name' => 'profile_work_schedule',
			'value' => [
				'view_only' => ['custom.profile.viewWorkSchedule'],
				'view_and_edit' => ['custom.profile.viewWorkSchedule', 'custom.profile.updateWorkSchedule']
			]
		],
		[
			'name' => 'profile_payrolls',
			'value' => [
				'view_only' => ['custom.profile.viewPayroll']
			]
		],
		[
			'name' => 'profile_educations',
			'value' => [
				'view_only' => ['custom.profile.viewEducations'],
				'view_and_edit' => ['custom.profile.viewEducations', 'custom.profile.updateEducations']
			]
		],
		[
			'name' => 'profile_dependents',
			'value' => [
				'view_only' => ['custom.profile.viewDependents'],
				'view_and_edit' => ['custom.profile.viewDependents', 'custom.profile.updateDependents']
			]
		],
		[
			'name' => 'profile_documents',
			'value' => [
				'view_only' => ['custom.profile.viewDocuments'],
				'view_and_edit' => ['custom.profile.viewDocuments', 'custom.profile.updateDocuments']
			]
		],
		[
			'name' => 'profile_activity',
			'value' => [
				'view_only' => ['custom.profile.viewActivity']
			]
		]
	];
	protected array $arrPermissionsCheckbox = [
		[
			'name' => 'employees_manage',
			'value' => ['modules.employees.manage']
		],
		[
			'name' => 'employees_hiring',
			'value' => ['modules.employees.hiring']
		],
		[
			'name' => 'employees_termination',
			'value' => ['modules.employees.termination']
		],
		[
			'name' => 'employees_settings',
			'value' => ['modules.employees.accessEmployeeSettings']
		],
		[
			'name' => 'checklist_manage',
			'value' => ['modules.checklist.manage', 'modules.checklist_detail.manage']
		],
		[
			'name' => 'checklist_settings',
			'value' => ['modules.checklist_template.manage', 'modules.checklist_template_detail.manage']
		],
		[
			'name' => 'overtime_manage',
			'value' => ['modules.overtimes.accessManageOvertime', 'modules.overtimes.manage']
		],
		[
			'name' => 'overtime_request',
			'value' => ['modules.overtimes.accessOvertimeRequest']
		],
		[
			'name' => 'employee_time_off',
			'value' => ['modules.time_off.accessEmployeeTimeOff']
		],
		[
			'name' => 'team_time_off',
			'value' => ['modules.time_off.accessTeamTimeOff']
		],
		[
			'name' => 'approval_time_off',
			'value' => ['modules.time_off.accessApprovalTimeOff']
		],
		[
			'name' => 'time_off_settings',
			'value' => ['modules.time_off_types.manage', 'modules.time_off_holidays.manage', 'modules.time_off.accessSettingTimeOff']
		],
		[
			'name' => 'time_off_settings_holidays',
			'value' => ['modules.time_off_holidays.manage']
		],
		[
			'name' => 'time_off_settings_types',
			'value' => ['modules.time_off_types.manage']
		],
		[
			'name' => 'employee_attendance',
			'value' => ['modules.attendances.accessEmployeeAttendance']
		],
		[
			'name' => 'team_attendance',
			'value' => ['modules.attendances.accessTeamAttendance']
		],
		[
			'name' => 'attendance_setting',
			'value' => ['modules.attendance_setting.manage']
		],
		[
			'name' => 'employee_payroll',
			'value' => ['modules.payrolls.manage']
		],
		[
			'name' => 'payrolls_settings',
			'value' => ['accessPayrollsSetting', 'modules.pay_cycles.manage', 'modules.recurring.manage']
		],
		[
			'name' => 'recruitment_manage',
			'value' => ['modules.recruitments.manage', 'modules.candidates.manage']
		],
		[
			'name' => 'recruitment_approval',
			'value' => ['modules.recruitments.approve']
		],
		[
			'name' => 'recruitment_request',
			'value' => ['modules.recruitments.add', 'modules.recruitments.request']
		],
		[
			'name' => 'recruitment_jobs',
			'value' => ['modules.recruitments.add', 'modules.recruitments.jobs']
		],
		[
			'name' => 'recruitment_settings',
			'value' => ['modules.recruitments.access', 'modules.recruitments.accessRecruitmentSettings', 'modules.tags.manage', 'modules.sources.manage']
		],
		[
			'name' => 'candidates_manage',
			'value' => ['modules.candidates.manage']
		],
		[
			'name' => 'news_manage',
			'value' => ['modules.news.manage']
		],
		[
			'name' => 'reports_employees',
			'value' => ['modules.reports.employee']
		],
		[
			'name' => 'reports_onboarding',
			'value' => ['modules.reports.onboarding']
		],
		[
			'name' => 'reports_offboarding',
			'value' => ['modules.reports.offboarding']
		],
		[
			'name' => 'reports_time_off_schedule',
			'value' => ['modules.reports.timeOffSchedule']
		],
		[
			'name' => 'reports_time_off_balance',
			'value' => ['modules.reports.timeOffBalance']
		],
		[
			'name' => 'reports_attendance',
			'value' => ['modules.reports.attendance']
		],
		[
			'name' => 'reports_recruitment',
			'value' => ['modules.reports.recruitment']
		],
		[
			'name' => 'settings_superpower',
			'value' => ['sys.superpower']
		],
		[
			'name' => 'settings_developer_mode',
			'value' => ['sys.developer_mode']
		],
		[
			'name' => 'settings_download',
			'value' => ['sys.download']
		],
		[
			'name' => 'settings_modules',
			'value' => ['sys.modules']
		],
		[
			'name' => 'settings_app',
			'value' => ['app.manage']
		],
		[
			'name' => 'settings_users',
			'value' => ['users.manage']
		],
		[
			'name' => 'settings_permits',
			'value' => ['permits.manage']
		],
		[
			'name' => 'settings_offices',
			'value' => ['offices.manage']
		],
		[
			'name' => 'settings_departments',
			'value' => ['departments.manage']
		],
		[
			'name' => 'settings_job_titles',
			'value' => ['job_titles.manage']
		],
		[
			'name' => 'settings_groups',
			'value' => ['groups.manage']
		],
		[
			'name' => 'settings_work_schedules',
			'value' => ['modules.work_schedules.manage']
		],
		[
			'name' => 'settings_employee_groups',
			'value' => ['modules.employee_groups.manage']
		],
		[
			'name' => 'other_dashboard',
			'value' => ['custom.dashboard.access']
		],
		[
			'name' => 'settings_employee_level',
			'value' => ['modules.employee_level.manage']
		],
		[
			'name' => 'asset_list',
			'value' => ['modules.asset_lists.accessAssetList']
		],
		[
			'name' => 'asset_inventory',
			'value' => ['modules.asset_lists.accessAssetInventory']
		],
		[
			'name' => 'asset_import',
			'value' => ['modules.asset_lists.accessImportAsset']
		],
		[
			'name' => 'asset_qr_code_generator',
			'value' => ['modules.asset_lists.accessBarcodeGenerator']
		],
		[
			'name' => 'asset_type',
			'value' => ['modules.asset_types.manage']
		],
		[
			'name' => 'asset_group',
			'value' => ['modules.asset_groups.manage']
		]
	];
	protected array $arrCheckboxChild = [
		"employees_manage" => [
			"employees_hiring",
			"employees_termination",
			"employees_settings"
		],
		"time_off_settings" => [
			"time_off_settings_holidays",
			"time_off_settings_types"
		],
		"recruitment_manage" => [
			"recruitment_approval",
			"recruitment_request",
			"recruitment_jobs",
			"candidates_manage",
			"recruitment_settings"
		]
	];

	public function get_detail_get($id)
	{
		$model = new GroupModel();
		$info = $model->where('id', $id)->first();
		if ($info) {
			$users = [];
			foreach ($model->getUsersForGroup($id) as $val) {
				$users[] = [
					'email' => $val['email'],
					'full_name' => $val['full_name'],
					'icon' => $val['avatar'],
					'label' => $val['username'],
					'value' => $val['id'],
				];
			}
			$info->users = $users;
			$permissions = array_column($model->getPermissionsForGroup($id), 'name');
			$per_radio = "";
			$per_select_employee = [];
			$per_select_profile = [];
			$per_checkbox = [];
			$per_stateCheckBoxList = [];
			$per_stateCheckBoxIndeterminate = [];
			foreach ($this->arrPermissionRadio as $item) {
				if (in_array($item['permission'], $permissions)) {
					$per_radio = $item['value'];
					break;
				}
			}
			foreach ($this->arrPermissionSelectEmployee as $item) {
				$val = 'no_access';
				foreach ($item['value'] as $value => $per) {
					if (count(array_intersect($permissions, $per)) == count($per)) {
						$val = $value;
					}
				}
				$per_select_employee[$item['name']] = $val;
			}
			foreach ($this->arrPermissionSelectProfile as $item) {
				$val = 'no_access';
				foreach ($item['value'] as $value => $per) {
					if (count(array_intersect($permissions, $per)) == count($per)) {
						$val = $value;
					}
				}
				$per_select_profile[$item['name']] = $val;
			}
			foreach ($this->arrPermissionsCheckbox as $item) {
				$checked = false;
				if (count(array_intersect($permissions, $item['value'])) == count($item['value'])) {
					$checked = true;
				}
				$per_checkbox[$item['name']] = $checked;
			}
			foreach ($this->arrCheckboxChild as $parent => $item) {
				$per_stateCheckBoxIndeterminate[$parent] = false;
				$arr = [];
				foreach ($item as $per) {
					if ($per_checkbox[$per]) {
						$arr[] = $per;
					}
				}
				$per_stateCheckBoxList[$parent] = $arr;
				if (count($arr) > 0 && count($arr) < count($item)) {
					$per_stateCheckBoxIndeterminate[$parent] = true;
				}
			}

			// check widget
			foreach ($permissions as $item) {
				$item_exp = explode(".", $item);
				if (isset($item_exp[1]) && $item_exp[1] == 'widget') {
					if (isset($item_exp[2])) {
						$name_check = "other_widget_" . $item_exp[2];
						$per_checkbox[$name_check] = true;
					}
				}
			}

			$info->per_radio = $per_radio;
			$info->per_select_employee = $per_select_employee;
			$info->per_select_profile = $per_select_profile;
			$info->per_checkbox = $per_checkbox;
			$info->per_stateCheckBoxList = $per_stateCheckBoxList;
			$info->per_stateCheckBoxIndeterminate = $per_stateCheckBoxIndeterminate;
			$info->permissions = $permissions;
			return $this->respond($info);
		} else {
			return $this->failNotFound('Not_found');
		}
	}

	public function save_post()
	{
		$model = new GroupModel();
		$authorize = \Config\Services::authorization();
		$getPost = $this->request->getPost();

		if ($model->save($getPost) === false) {
			return $this->fail($model->errors());
		} else {
			$id = $model->insertID;
			if (isset($getPost['id']) && ($getPost['id'])) {
				$id = $getPost['id'];
				// remove user
				foreach ($model->getUsersForGroup($id) as $val) {
					$model->removeUserFromGroup($val['id'], $id);
				}

				// remove permission
				if ($id != 1) {
					foreach ($model->getPermissionsForGroup($id) as $val) {
						$model->removePermissionFromGroup($val['id'], $id);
					}
				}
			}

			// user
			if (isset($getPost['users'])) {
				foreach ($getPost['users'] as $val) {
					if ($val) {
						$exist = $this->checkUserInGroup($val, $id);
						if (!$exist) {
							$model->addUserToGroup($val, $id);
						}
					}
				}
			}

			// permission
			if (isset($getPost['permission_radio'])) {
				foreach ($this->arrPermissionRadio as $item) {
					if ($item['value'] == $getPost['permission_radio']) {
						$authorize->addPermissionToGroup($item['permission'], $id);
						break;
					}
				}
			}
			foreach ($this->arrPermissionSelectEmployee as $item) {
				if (isset($getPost[$item['name']]) && $getPost[$item['name']] != 'no_access') {
					foreach ($item['value'][$getPost[$item['name']]] as $per) {
						$authorize->addPermissionToGroup($per, $id);
					}
				}
			}
			foreach ($this->arrPermissionSelectProfile as $item) {
				if (isset($getPost[$item['name']]) && $getPost[$item['name']] != 'no_access') {
					foreach ($item['value'][$getPost[$item['name']]] as $per) {
						$authorize->addPermissionToGroup($per, $id);
					}
				}
			}
			foreach ($this->arrPermissionsCheckbox as $item) {
				if (isset($getPost[$item['name']]) && filter_var($getPost[$item['name']], FILTER_VALIDATE_BOOLEAN)) {
					foreach ($item['value'] as $per) {
						echo '<pre>';
						print_r($per);
						echo '</pre>';
						$authorize->addPermissionToGroup($per, $id);
					}
				}
			}
			if (isset($getPost['checkboxChild'])) {
				$checkboxChild = $getPost['checkboxChild'];
				foreach ($this->arrCheckboxChild as $parent => $item) {
					if (isset($checkboxChild[$parent]) && filter_var($checkboxChild[$parent], FILTER_VALIDATE_BOOLEAN)) {
						$checkPer = array_search($parent, array_column($this->arrPermissionsCheckbox, 'name'));
						if ($checkPer || $checkPer === 0) {
							foreach ($this->arrPermissionsCheckbox[$checkPer]['value'] as $per) {
								$authorize->addPermissionToGroup($per, $id);
							}
						}
					}
					if (isset($checkboxChild[$parent . '_checkedList'])) {
						foreach ($checkboxChild[$parent . '_checkedList'] as $name) {
							$checkPer = array_search($name, array_column($this->arrPermissionsCheckbox, 'name'));
							if ($checkPer || $checkPer === 0) {
								foreach ($this->arrPermissionsCheckbox[$checkPer]['value'] as $per) {
									$authorize->addPermissionToGroup($per, $id);
								}
							}
						}
					}
				}
			}

			// check widget
			foreach ($getPost as $key => $item) {
				$key_exp = explode("other_widget_", $key);
				if (isset($key_exp[1]) && filter_var($item, FILTER_VALIDATE_BOOLEAN)) {
					$per = "custom.widget." . $key_exp[1];
					$authorize->addPermissionToGroup($per, $id);
				}
			}
			return $this->respondCreated($model->getInsertID());
		}
	}

	private function checkUserInGroup($user, $group)
	{
		$model = new GroupModel();
		$users = $model->getUsersForGroup($group);
		$check = array_search($user, array_column($users, 'id'));
		if ($check || $check === 0) {
			return 1;
		}
		return 0;
	}

	private function checkPerInGroup($per, $group)
	{
		$model = new GroupModel();
		$permissions = $model->getPermissionsForGroup($group);
		$check = array_search($per, array_column($permissions, 'name'));
		if ($check || $check === 0) {
			return 1;
		}
		return 0;
	}
}