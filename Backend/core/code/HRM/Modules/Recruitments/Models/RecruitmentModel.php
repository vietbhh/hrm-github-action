<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : recruitment
* Model name : RecruitmentModel
* Time created : 12/04/2021 06:04:43
*/

namespace HRM\Modules\Recruitments\Models;

use App\Models\AppModel;

class RecruitmentModel extends AppModel
{
	protected $table = 'm_recruitments';
	protected $primaryKey = 'id';
	protected $returnType = 'array';

	public function getRecruitmentWorkflow($id, $searchTextCandidates = '', $filterCandidates = [], $getCandidates = true): array
	{
		$workflowModel = new AppModel();
		$stages = $workflowModel->setTable('m_recruitments_workflow')->select(['id', 'stage', 'default_state_id', 'order', 'locked'])->asArray()->where('recruitment ', $id)->orderBy('order', 'asc')->findAll();
		$results = [];
		$firstStage = $stages[0];
		foreach ($stages as $item) {
			$stage = [
				'id' => $item['id'],
				'title' => $item['stage'],
				'cards' => []
			];
			$results[$item['id']] = $stage;
			if ($item['order'] < $firstStage['order']) {
				$firstStage = $item;
			}
		}

		if ($getCandidates) {
			$candidates = $this->getRecruitmentCandidates($id, $searchTextCandidates, $filterCandidates);
			foreach ($candidates as $item) {
				$stageId = empty($item['stage']) ? $firstStage['id'] : $item['stage'];
				$item['is_employed'] = filter_var($item['is_employed'], FILTER_VALIDATE_BOOLEAN);
				$results[$stageId]['cards'][] = $item;
			}
		}
		return $results;
	}


	public function getRecruitmentCandidates($id, $searchTextCandidates = '', $filter = array()): array
	{
		$candidateModel = new AppModel();
		$candidateModel = $candidateModel->setTable('m_candidates')->select(['id', 'candidate_name', 'candidate_email', 'candidate_phone', 'candidate_dob', 'candidate_avatar', 'gender', 'recruitment_proposal', 'stage', 'stage_order', 'is_employed', 'cv', 'source', 'skills', 'disc', 'vakad'])->asArray()->where('recruitment_proposal ', $id)->where($filter)->orderBy('recruitment_proposal ASC, stage_order ASC');
		if (!empty($searchTextCandidates)) {
			$candidateModel = $candidateModel->groupStart()->like('candidate_name', $searchTextCandidates)->orLike('candidate_email', $searchTextCandidates)->orLike('candidate_phone', $searchTextCandidates)->groupEnd();
		}

		return $candidateModel->findAll();
	}

	public function getActivity($recruitmentId, $page = 1)
	{
		$model = new AppModel();
		$perPage = 10;
		$offset = ($page - 1) * $perPage;
		$model = $model->setTable('mc_candidates_activities')->asArray()->where('recruitment', $recruitmentId)->orderBy('created_at', 'DESC');
		$total = $model->countAllResults(false);
		return [
			'total' => $total,
			'data' => $model->findAll($perPage, $offset),
			'page' => $page,
			'hasMore' => ($offset + $perPage) < $total
		];
	}

	public function addActivity($recruitmentId, $log = '')
	{
		$model = new AppModel();
		$data = [
			'recruitment' => $recruitmentId,
			'activity' => $log,
			'created_at' => date('Y-m-d H:i:s'),
			'created_by' => user_id()
		];
		$model = $model->setTable('mc_candidates_activities')->setAllowedFields(['recruitment', 'activity', 'created_at', 'created_by'])->withoutTrigger()->withoutTimestamps();
		return $model->insert($data);
	}

	public function getCandidateByTag($tagID)
	{
		$db = \Config\Database::connect();
		$builder = $db->table('m_candidates');
		$builder->select('COUNT(*) as total,JSON_UNQUOTE(JSON_EXTRACT(tags, "$[*]"))');
		$builder->where("JSON_UNQUOTE(JSON_EXTRACT(tags, '$[*]')) LIKE '%{$tagID}%'");
		return $builder->get()->getRow()->total;
	}

	public function getCandidateBySource($sourceID)
	{
		$db = \Config\Database::connect();
		$builder = $db->table('m_candidates');
		$builder->select('COUNT(*) as total')->where('source', $sourceID);
		return $builder->get()->getRow()->total;
	}
}