<?php
/*
* Copyright (C) 2020 @hailongtrinh
* Controller create by CLI - ERP
* Module name : disc
* Controller name : Disc
* Time created : 18/01/2022 15:21:02
*/

namespace HRM\Modules\Test\Controllers;

use App\Controllers\ErpController;

class Test extends ErpController
{
	protected $modelName = 'App\Modules\Disc\Models\DiscModel';

	public function done_test_post()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules('candidate_test');
		$dataPost = $this->request->getPost();
		$questions = $dataPost['data'];
		$resultTest = $dataPost['resultTest'];
		$typeUserTest = $dataPost['typeUserTest'];
		$typeTest = $dataPost['typeTest'];
		$testModel = $modules->model;
		$testModel->setAllowedFields(['question', 'time', 'candidate', 'test_code', 'point', 'employees', 'performer_type']);


		$arrTest = [
			'question' => $dataPost['idtest'],
			'time' => date('Y-m-d H:i:s'),
			'test_code' => 'TEST' . date('Ymd') . $dataPost['candidate'],
			'point' => json_encode($resultTest)
		];

		if ($typeUserTest == 'candidates') {
			$arrTest['candidate'] = $dataPost['candidate'];
			$arrTest['performer_type'] = getOptionValue('candidate_test', 'performer_type', 'candidate');
		} else {
			$arrTest['employees'] = $dataPost['candidate'];
			$arrTest['performer_type'] = getOptionValue('candidate_test', 'performer_type', 'employees');
		}


		$testModel->save($arrTest);
		$idTest = $testModel->getInsertID();
		$arr = [];

		// update test
		if ($typeUserTest == 'candidates') {
			$modules->setModule('candidates');
		} else if ($typeUserTest == 'employees') {
			$modules->setModule('employees');
		}
		$model = $modules->model;
		$model->setAllowedFields(['disc', 'vakad']);

		$dataSave['id'] = $dataPost['candidate'];
		if ($typeTest == getOptionValue('test', 'type', 'disc')) {
			$dataSave['disc'] = json_encode($resultTest);
		} else {
			$dataSave['vakad'] = json_encode($resultTest);
		}
		$model->save($dataSave);
		// END update test

		foreach ($questions as $val):
			$arr[] = [
				'test_code' => $idTest,
				'question' => $val['id'],
				'answer' => $val['selected'],
				'point' => $val['type'],
			];
		endforeach;
		if (isset($arr)) {
			$db = \Config\Database::connect();
			$builderPer = $db->table('m_candidate_test_answer');
			$builderPer->insertBatch($arr);
		}
		return $this->respond(1);
	}

	public function detail_get($id)
	{
		$validation = \Config\Services::validation();
		$modules = \Config\Services::modules('questions');
		$questionsModel = $modules->model;
		$questions = $questionsModel->select('m_questions.test_id as test_id,m_test.type as type,,m_questions.title as question,m_questions.id as question_id,m_test.title as test')
			->join('m_test', 'm_test.id = m_questions.test_id')
			->where('m_test.id', $id)->findAll();

		$arr = [];
		$modules->setModule('answers');
		$answerModel = $modules->model;

		foreach ($questions as $val) {
			$arr['test_id'] = $val->test_id;
			$arr['title'] = $val->test;
			$arr['type'] = $val->type;
			$arr['questions'][$val->question_id] = array(
				'title' => $val->question,
				'id' => $val->question_id,
				'answers' => $answerModel->select('id,title,point')->where('question_id', $val->question_id)->findAll(),
			);
		}
		return json_encode($arr);
	}

	public function import_post()
	{
		$db = \Config\Database::connect();
		$modules = \Config\Services::modules('test');
		$dataPost = $this->request->getPost('data');
		$Test = $this->request->getPost('test');

		$testModel = $modules->model;
		$testModel->setAllowedFields(['title', 'type', 'active']);
		$dataNew = [
			'title' => $Test['title'],
			'type' => $Test['type'],
			'active' => !isset($Test['active']) ? 1 : $Test['active']
		];
		if (isset($Test['id'])) $dataNew['id'] = $Test['id'];

		$beforeSave = handleDataBeforeSave($modules, $dataNew);

		$testModel->save($beforeSave['data']);
		$idTest = isset($Test['id']) ? $Test['id'] : $testModel->getInsertID();
		if (count($dataPost) > 0 && $dataPost[0]) {
			$modules->setModule('questions');
			$questionsModel = $modules->model;
			$questionsModel->setAllowedFields(['title', 'test_id']);
			//  delete all old data
			$questionsModel->where('test_id', $idTest)->delete();
			$builderAnswer = $db->table('m_answers');
			$i = 1;
			foreach ($dataPost as $val) {
				// insert quest
				$quesData = [
					'title' => $val['title'],
					'test_id' => $idTest,
				];
				$questionsModel->save($quesData);
				$id = $questionsModel->getInsertID();
				// insert answer
				$check = 0;
				$arrAnswer = [];
				$aa = 0;
				foreach ($val as $key => $item) {
					if ($key != 'title') {
						$check++;
						$arrAnswer[$aa]['question_id'] = $id;
						$pos = strpos($key, 'answer');
						if ($pos !== false) {
							// check exist
							//$checkExist = $builderAnswer->where('title', $item)->get()->getRow();
							$arrAnswer[$aa]['title'] = $item;
						} else {
							$arrAnswer[$aa]['point'] = $item;
						}
						if ($check >= 2) {
							$check = 0;
							$aa++;
						}

					}
				}
				$builderAnswer->insertBatch($arrAnswer);
				$i++;
			}
		}
		return $this->respond('success');
	}

	public function delete_delete($ids)
	{

	}

	public function loadDataTest_get()
	{
		$modules = \Config\Services::modules('candidate_test');
		$dataGet = $this->request->getGet();
		$filters = isset($dataGet['filters']) ? $dataGet['filters'] : [];

		$candidateTestModel = $modules->model;
		$candidateTestModel->asArray()->join('m_test', 'm_test.id = m_candidate_test.question');

		if (isset($filters['performer_type']) && $filters['performer_type'] != 0) {
			$candidateTestModel->where('m_candidate_test.performer_type', $filters['performer_type']);
		}
		if (isset($filters['typeTest']) && $filters['typeTest'] != 0) {
			$candidateTestModel->where('m_test.type', $filters['typeTest']);

		}

		$result['recordsTotal'] = $candidateTestModel->countAllResults(false);
		$data = $candidateTestModel->orderBy('m_candidate_test.id DESC')->findAll($dataGet['perPage'], $dataGet['page'] * $dataGet['perPage'] - $dataGet['perPage']);
		$bfReturn = handleDataBeforeReturn($modules, $data, true);
		$result['data'] = $bfReturn;
		return $this->respond($result);
	}
}