<?php

namespace HRM\Modules\Reports\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Recruitment extends ErpController
{
    public function load_recruitment_get()
    {
        $modules = \Config\Services::modules();
        $params = $this->request->getGet();

        return $this->respond($this->_getRecruitment($modules, $params));
    }

    public function export_recruitment_get()
    {
        $modules = \Config\Services::modules();
        $params = $this->request->getGet();

        $result = $this->_getRecruitment($modules, $params);

        $listRecruitment = $result['list_recruitment'];
        $listHiringWorkflow = $result['list_hiring_workflow'];

        $defaultColNumber = 3;

        $arrAlphabet = [];
        foreach (range('A', 'Z') as $key => $columnId) {
            $arrAlphabet[] = $columnId;
            if ($key == ($defaultColNumber + count($listHiringWorkflow))) {
                break;
            }
        }


        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $row = 1;
        $sheet->setCellValue("A$row", "Job");
        $sheet->setCellValue("B$row", "Created Date");
        $sheet->setCellValue("C$row", "Total Processed");

        $keyHiringWorkflow = 0;
        foreach ($arrAlphabet as $keyAlphabet => $rowAlphabet) {
            if ($keyAlphabet > $defaultColNumber) {
                $sheet->setCellValue($arrAlphabet[$keyAlphabet] . $row, ucfirst($listHiringWorkflow[$keyHiringWorkflow]['stage']));
                $keyHiringWorkflow++;
            }
        }

        $row += 1;
        foreach ($listRecruitment as $rowRecruitment) {
            $sheet->setCellValue("A$row", $rowRecruitment['recruitment_code']);
            $sheet->setCellValue("B$row", $rowRecruitment['created_at']);
            $sheet->setCellValue("C$row", $rowRecruitment['total_process']);

            $keyHiringWorkflow = 0;
            foreach ($arrAlphabet as $keyAlphabet => $rowAlphabet) {
                if ($keyAlphabet > $defaultColNumber) {
                    $sheet->setCellValue($arrAlphabet[$keyAlphabet] . $row, $rowRecruitment['total_' . $listHiringWorkflow[$keyHiringWorkflow]['stage']]);
                    $keyHiringWorkflow++;
                }
            }

            $row++;
        }

        foreach ($arrAlphabet as $columnId) {
            $sheet->getColumnDimension($columnId)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $writer->save('php://output');

        exit;
    }

    // ** support function
    private function _getRecruitment($modules, $filter)
    {
        $fromDate = $filter['from_date'];
        $toDate = $filter['to_date'];
        $publishStatus = $filter['publish_status'];
        $department = $filter['department'];
        $office = $filter['office'];
        if (strtotime($fromDate) > strtotime($toDate)) {
            return [
                'list_recruitment' => [],
                'list_hiring_workflow' => []
            ];
        }

        $result = [];

        //get hiring workflow
        $modules->setModule('hiring_workflow');
        $model = $modules->model;

        $listHiringWorkflow = $model->asArray()->where('locked', 1)->findAll();

        // get recruitment
        $modules->setModule('recruitments');
        $model = $modules->model;

        $builderRecruitment = $model
            ->asArray()
            ->where('created_at >=', $fromDate)
            ->where('created_at <=', $toDate);

        if (!empty($publishStatus) && $publishStatus != 'null') {
            $builderRecruitment->where('publish_status', $publishStatus);
        }

        if (!empty($department) && $department != 'null') {
            $builderRecruitment->where('department', $department);
        }

        if (!empty($office) && $office != 'null') {
            $builderRecruitment->where('office', $office);
        }

        $listRecruitmentQuery = $builderRecruitment->findAll();
        $listRecruitment = handleDataBeforeReturn($modules, $listRecruitmentQuery, true);

        // get candidate
        if (count($listRecruitment) > 0) {
            $arrIdRecruitment = array_column($listRecruitment, 'id');

            $modules->setModule('candidates');
            $model = $modules->model;

            $listCandidate = $model
                ->asArray()
                ->select([
                    'm_candidates.id',
                    'm_candidates.recruitment_proposal',
                    'm_recruitments_workflow.stage',
                ])
                ->join('m_recruitments_workflow', 'm_recruitments_workflow.id = m_candidates.stage', 'inner')
                ->whereIn('recruitment_proposal', $arrIdRecruitment)
                ->findAll();

            foreach ($listRecruitment as $row) {
                $arrayPush = $row;
                if (!isset($result[$row['id']])) {
                    $arrayPush['total_process'] = 0;
                    $arrayPush['created_at'] = date('d M Y', strtotime($row['created_at']));
                    foreach ($listHiringWorkflow as $rowHiringWorkFlow) {
                        $arrayPush['total_' . $rowHiringWorkFlow['stage']] = 0;
                    }
                    $result[$row['id']] = $arrayPush;
                }
            }

            foreach ($listCandidate as $rowCandidate) {
                $result[$rowCandidate['recruitment_proposal']]['total_' . $rowCandidate['stage']] += 1;
                $result[$rowCandidate['recruitment_proposal']]['total_process'] += 1;
            }
        }

        return [
            'list_recruitment' => array_values($result),
            'list_hiring_workflow' => $listHiringWorkflow
        ];
    }
}
