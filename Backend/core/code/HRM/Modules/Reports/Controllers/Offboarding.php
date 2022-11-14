<?php

namespace HRM\Modules\Reports\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class Offboarding extends ErpController
{
	public function get_offboarding_get()
	{
		$filter = $this->request->getGet();
		$dataEmployee = $this->getDataFilter($filter);

		$dataChart = ['empty' => true];
		$_dataChart = [];
		$begin = new \DateTime($filter['date_from']);
		$end = new \DateTime($filter['date_to']);
		for ($i = $begin; $i <= $end; $i->modify('+1 day')) {
			$month = $i->format('m/Y');
			$_dataChart['labels'][$month] = $month;
			$_dataChart['series'][$month] = 0;
		}

		foreach ($dataEmployee as $item) {
			$month = date('m/Y', strtotime($item['last_working_date']));
			$_dataChart['series'][$month]++;
			$dataChart['empty'] = false;
		}
		$dataChart['labels'] = array_values($_dataChart['labels']);
		$dataChart['series'] = array_values($_dataChart['series']);

		$out['dataChart'] = $dataChart;
		$out['dataTable'] = $dataEmployee;

		return $this->respond($out);
	}

	public function export_excel_get()
	{
		$filter = $this->request->getGet();
		$dataEmployee = $this->getDataFilter($filter);

		/*alphabet A to H*/
		$arr_alphabet = [];
		foreach (range('A', 'H') as $columnId) {
			$arr_alphabet[] = $columnId;
		}

		$spreadsheet = new Spreadsheet();
		$sheet = $spreadsheet->getActiveSheet();

		$styleArray = [
			'fill' => [
				'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
				'startColor' => [
					'argb' => 'A9D08E',
				],
				'endColor' => [
					'argb' => 'A9D08E',
				],
			],
		];

		$i = 1;
		$sheet->getStyle("A$i:H$i")->applyFromArray($styleArray);
		$sheet->setCellValue("A$i", "Emp.Name");
		$sheet->setCellValue("B$i", "Emp.ID");
		$sheet->setCellValue("C$i", "Job title");
		$sheet->setCellValue("D$i", "Employment Type");
		$sheet->setCellValue("E$i", "Department");
		$sheet->setCellValue("F$i", "Office");
		$sheet->setCellValue("G$i", "Reason Of Leaving");
		$sheet->setCellValue("H$i", "Last Working Date");

		$i = 2;
		foreach ($dataEmployee as $item) {
			$sheet->getStyle("H$i")->getNumberFormat()->setFormatCode('dd-mmm-yyyy');
			$sheet->getStyle("H$i")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);

			$sheet->setCellValue("A$i", $item['full_name']);
			$sheet->setCellValue("B$i", $item['employee_code']);
			$sheet->setCellValue("C$i", $item['job_title_id']['label'] ?? "-");
			$sheet->setCellValue("D$i", $item['employee_type']['label'] ?? "-");
			$sheet->setCellValue("E$i", $item['department_id']['label'] ?? "-");
			$sheet->setCellValue("F$i", $item['office']['label'] ?? "-");
			$sheet->setCellValue("G$i", $item['reason_of_leaving']['name_option'] ?? "-");
			$sheet->setCellValue("H$i", date('d/m/Y', strtotime($item['last_working_date'])));

			$i++;
		}

		foreach ($arr_alphabet as $columnId) {
			$sheet->getColumnDimension($columnId)->setAutoSize(true);
		}

		/*export excel*/
		$writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		$writer->save('php://output');

		exit;
	}

	private function getDataFilter($filter)
	{
		$employeeModules = \Config\Services::modules("employees");
		$employeeModel = $employeeModules->model;
		if (!empty($filter['department_id'])) {
			$employeeModel->where('department_id', $filter['department_id']);
		}
		if (!empty($filter['office'])) {
			$employeeModel->where('office', $filter['office']);
		}
		if (!empty($filter['employee_type'])) {
			$employeeModel->where('employee_type', $filter['employee_type']);
		}
		if (!empty($filter['reason_of_leaving'])) {
			$employeeModel->where('reason_of_leaving', $filter['reason_of_leaving']);
		}
		$dataEmployee = $employeeModel->where("last_working_date between '" . $filter['date_from'] . "' and '" . $filter['date_to'] . "'")->where('last_working_date <>', "")->where('last_working_date <>', null)->where('last_working_date <>', "0000-00-00")->select("id, employee_code, avatar, full_name, username, last_working_date, office, department_id, job_title_id, status, employee_type, reason_of_leaving")->orderBy('last_working_date', 'asc')->asArray()->findAll();

		return handleDataBeforeReturn($employeeModules, $dataEmployee, true);
	}
}