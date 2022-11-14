<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : careers
*/

namespace HRM\Modules\Careers\Controllers;

use App\Controllers\ErpController;

class Careers extends ErpController
{
	public function index_get()
	{

		helper('app_select_option');
		$getPara = $this->request->getGet();
		$moduleName = 'recruitments';
		$modules = \Config\Services::modules($moduleName);
		$recruitmentModel = $modules->model;
		$recruitmentModel->join('offices', 'offices.id = m_recruitments.office', 'left');
		$recruitmentModel->join('departments', 'departments.id = m_recruitments.department ', 'left');
		if (isset($getPara['search']) && $getPara['search']) {
			$recruitmentModel->groupStart();
			$recruitmentModel->like('recruitment_code', $getPara['search']);
			$recruitmentModel->orLike('offices.name', $getPara['search']);
			$recruitmentModel->orLike('departments.name', $getPara['search']);
			//$recruitmentModel->orLike('requirements', $getPara['search']);
			//$recruitmentModel->orLike('benefits', $getPara['search']);
			$recruitmentModel->groupEnd();
		}
		$recruitmentModel->where('status', getOptionValue($moduleName, 'status', 'approve'));
		$recruitmentModel->where('publish_status', getOptionValue($moduleName, 'publish_status', 'published'));
		$data['recordsTotal'] = $recruitmentModel->countAllResults(false);
		$list = $recruitmentModel->findAll();
		$data['data'] = handleDataBeforeReturn($modules, $list, true);
		return $this->respond($data);
	}

	public function info_get()
	{

		helper('app_select_option');
		$getPara = $this->request->getGet();
		$slug = isset($getPara['slug']) ? $getPara['slug'] : '';
		$moduleName = 'recruitments';
		$modules = \Config\Services::modules($moduleName);
		$recruitmentModel = $modules->model;
		$infoJob = handleDataBeforeReturn($modules, $recruitmentModel->asArray()->where('slug', $slug)->where('publish_status', getOptionValue($moduleName, 'publish_status', 'published'))->where('status !=', getOptionValue($moduleName, 'status', 'closed'))->first());

		if ($infoJob) {
			if ($infoJob['office']) {
				$modules->setModule('offices');
				$officesModel = $modules->model;
				$offices = $officesModel->asArray()->where('id', $infoJob['office']['value'])->first();
				$infoJob['offices_address'] = $offices['address'];
			}
		} else {
			return $this->failNotFound(NOT_FOUND);
		}
		return $this->respond($infoJob);

	}

	public function apply_post()
	{
		$dataPost = $this->request->getPost();
		$dataFiles = $this->request->getFiles();

		$data = $dataPost['data'];
		if (!isset($data['checkrb']) && $data['checkrb']) return $this->fail(FAILED_SAVE);
		$moduleName = 'candidates';
		$modules = \Config\Services::modules($moduleName);
		$candidateModel = $modules->model;
		$checkExist = $candidateModel->where('candidate_email', $data['candidate_email'])->where('recruitment_proposal', $data['recruitment_proposal'])->first();
		if ($checkExist) return $this->fail('EXIST');
		unset($data['checkrb']);

		// add stage applied
		$modules->setModule('recruitments_workflow');
		$modelWorkflow = $modules->model;
		$idStageApplied = $modelWorkflow->where('stage', 'applied')->where('recruitment', $data['recruitment_proposal'])->first()->id;
		if ($idStageApplied) {
			$data['stage'] = $idStageApplied;
		}

		$modules->setModule($moduleName);
		$filesData = '';
		if (isset($dataFiles) && $dataFiles) $filesData = $dataFiles['data'];
		$fields = array_merge(array_keys($data), array_keys($filesData));
		$dataHandleCandidate = handleDataBeforeSave($modules, $data, $filesData, $fields);
		$candidateModel->setAllowedFields($fields);

		$saveData = $dataHandleCandidate['data'];
		$uploadFieldsArray = $dataHandleCandidate['uploadFieldsArray'];
		$candidateModel->save($saveData);

		$id = $candidateModel->getInsertID();
		if ($filesData) {
			foreach ($filesData as $key => $files) {
				if (empty($files)) continue;
				if (!is_array($files)) $files = [$files];
				foreach ($files as $position => $file) {
					//if (empty($uploadFieldsArray[$key])) $file = $file['data'];
					if (!$file->isValid()) {
						return $this->failValidationErrors($file->getErrorString() . '(' . $file->getError() . ')');
					}
					if (!$file->hasMoved()) {
						$subPath = (!empty($uploadFieldsArray[$key])) ? 'other' : 'data';
						$storePath = getModuleUploadPath('candidates', $id) . $subPath . '/';
						if ($key === 'filesDataWillUpdate') {
							$fileName = $saveData[$key][$position]['name'];
							$removeOldFilePath = $storePath . $fileName;
							if (is_file($removeOldFilePath)) {
								unlink($removeOldFilePath);
							}
							$fileName = safeFileName($fileName);
							//$file->move($storePath, $fileName);
						} else {
							$fileName = safeFileName($file->getName());
							$paths[] = $file->move($storePath, $fileName);
							if (!empty($uploadFieldsArray[$key])) {
								if ($uploadFieldsArray[$key]->field_type == 'upload_multiple') {
									$arrayFiles = isset($saveData[$key]) ? json_decode($saveData[$key], true) : [];
									$arrayFiles[] = $fileName;
									$saveData[$key] = json_encode($arrayFiles);
								} else {
									$saveData[$key] = $fileName;
								}
							}
						} //end check file update
					}
				}
			}
			$saveData['id'] = $id;
			try {
				$candidateModel->save($saveData);
			} catch (\ReflectionException $e) {
				return $this->fail(FAILED_SAVE . '_' . $e->getMessage());
			}
		}

		// SEND MAIL
		$modules->setModule('recruitments');
		$jobModel = $modules->model;
		$infoJob = $jobModel->asArray()->find($data['recruitment_proposal']);
		$modules->setModule('users');
		$userModel = $modules->model;
		$infoUser = $userModel->asArray()->find($infoJob['owner']);
		$this->newApply($data['candidate_name'], ['full_name' => $infoUser['full_name'], 'email' => $infoUser['email']], $infoJob['recruitment_code'], $infoJob['id']);


		return $this->respond(ACTION_SUCCESS);
		exit;

	}

	private function newApply($name, $mailTo, $nameJob, $idJob)
	{
		$mailServices = \Config\Services::mail();
		$subject = 'New apply for Job [' . $nameJob . ']';
		$full_nameTo = $mailTo['full_name'];
		$urlApprove = $_ENV["app.siteURL"] . '/recruitments/jobs/' . $idJob;
		$resultApprove = '';
		$cc = preference('recruitment_email');

		$mailContent = "
<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
	<tr>
		<td>
		<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;' align='center' bgcolor='#ffffff'>
			<tr>
				<td style='padding: 35px; font-size: 18px'>
				<span>Hi $full_nameTo,</span>
				<br>
				<br>
				<span>New candidate apply for $nameJob</span>
				<br>
				<span>Candidate : $name</span>
				<br>
				<span>Check it out <a target='_blank' href='$urlApprove' style='color: #01CD89; text-decoration: none;'>here</a>.</span>
				<br>
				<span>Thanks!</span>
				<br>
				<br>
				<span>Best regards,</span>
				<br>
				<span>Friday team</span>
				</td>
			</tr>
		</table>
		</td>
	</tr>
</table>
		";

		if (!empty($mailTo['email'])) {
			$mailServices->send($subject, $mailTo['email'], $mailContent, $cc);
		}
	}
}