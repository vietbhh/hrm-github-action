<?php

namespace HRM\Modules\Reports\Controllers;

use App\Controllers\ErpController;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use DateTime;

class EmployeeTurnoverRate extends ErpController
{
	public function get_employee_turnover_rate_get()
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

		foreach ($dataEmployee as $key => $item) {
			$month = date('m/Y', strtotime($item['last_working_date']));
			$_dataChart['series'][$month]++;
			$dataChart['empty'] = false;

			$dataEmployee = $this->getEmployee($item, $dataEmployee, $key);
		}
		array_multisort(array_column($dataEmployee, 'days'), SORT_ASC, $dataEmployee);

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
		foreach ($dataEmployee as $key => $item) {
			$dataEmployee = $this->getEmployee($item, $dataEmployee, $key);
		}
		array_multisort(array_column($dataEmployee, 'days'), SORT_ASC, $dataEmployee);

		/*alphabet A to H*/
		$arr_alphabet = [];
		foreach (range('A', 'K') as $columnId) {
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
		$sheet->getStyle("A$i:K$i")->applyFromArray($styleArray);
		$sheet->setCellValue("A$i", "Emp.Name");
		$sheet->setCellValue("B$i", "Emp.ID");
		$sheet->setCellValue("C$i", "Email");
		$sheet->setCellValue("D$i", "Length of Service");
		$sheet->setCellValue("E$i", "Join Date");
		$sheet->setCellValue("F$i", "Last Working Date");
		$sheet->setCellValue("G$i", "Reason Of Leaving");
		$sheet->setCellValue("H$i", "Status");
		$sheet->setCellValue("I$i", "Employment Type");
		$sheet->setCellValue("J$i", "Department");
		$sheet->setCellValue("K$i", "Job title");

		$i = 2;
		foreach ($dataEmployee as $item) {
			$sheet->getStyle("E$i:F$i")->getNumberFormat()->setFormatCode('dd-mmm-yyyy');
			$sheet->getStyle("E$i:F$i")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);

			$length_of_service = "";
			foreach ($item['length_of_service'] as $item_day) {
				$length_of_service .= $item_day['number'] . " " . $item_day['text'] . " ";
			}

			$sheet->setCellValue("A$i", $item['full_name']);
			$sheet->setCellValue("B$i", $item['employee_code']);
			$sheet->setCellValue("C$i", $item['email']);
			$sheet->setCellValue("D$i", empty($length_of_service) ? "-" : $length_of_service);
			$sheet->setCellValue("E$i", empty($item['join_date']) ? "-" : date('d/m/Y', strtotime($item['join_date'])));
			$sheet->setCellValue("F$i", date('d/m/Y', strtotime($item['last_working_date'])));
			$sheet->setCellValue("G$i", $item['reason_of_leaving']['name_option'] ?? "-");
			$sheet->setCellValue("H$i", $item['status']['name_option'] ?? "-");
			$sheet->setCellValue("I$i", $item['employee_type']['label'] ?? "-");
			$sheet->setCellValue("J$i", $item['department_id']['label'] ?? "-");
			$sheet->setCellValue("K$i", $item['job_title_id']['label'] ?? "-");

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
		if (!empty($filter['job_title_id'])) {
			$employeeModel->where('job_title_id', $filter['job_title_id']);
		}
		if (!empty($filter['employee_type'])) {
			$employeeModel->where('employee_type', $filter['employee_type']);
		}
		$date_from = date('Y-m-01', strtotime($filter['date_from']));
		$date_to = date('Y-m-t', strtotime($filter['date_to']));
		$dataEmployee = $employeeModel->where("last_working_date between '" . $date_from . "' and '" . $date_to . "'")->where('last_working_date <>', "")->where('last_working_date <>', null)->where('last_working_date <>', "0000-00-00")->select("id, employee_code, avatar, full_name, username, email, join_date, last_working_date, department_id, job_title_id, status, employee_type, reason_of_leaving")->asArray()->findAll();

		return handleDataBeforeReturn($employeeModules, $dataEmployee, true);
	}

	/**
	 * @param $item
	 * @param $dataEmployee
	 * @param $key
	 * @return array
	 */
	private function getEmployee($item, $dataEmployee, $key): array
	{
		$join_date = $item['join_date'];
		$last_working_date = $item['last_working_date'];
		$length_of_service = [];
		$days = 0;
		if (!empty($join_date) && !empty($last_working_date) && strtotime($join_date) < strtotime($last_working_date)) {
			$date_diff = $this->_date_diff(strtotime($join_date), strtotime($last_working_date));
			$days = $date_diff['days'];
			if ($date_diff['y'] > 0) {
				$length_of_service[] = [
					'number' => $date_diff['y'],
					'text' => $date_diff['y'] > 1 ? "years" : "year"
				];
			}
			if ($date_diff['m'] > 0) {
				$length_of_service[] = [
					'number' => $date_diff['m'],
					'text' => $date_diff['m'] > 1 ? "months" : "month"
				];
			}
			if ($date_diff['d'] > 0) {
				$length_of_service[] = [
					'number' => $date_diff['d'],
					'text' => $date_diff['d'] > 1 ? "days" : "day"
				];
			}
		}
		$dataEmployee[$key]['length_of_service'] = $length_of_service;
		$dataEmployee[$key]['days'] = $days;

		return $dataEmployee;
	}

	private function _date_range_limit($start, $end, $adj, $a, $b, $result)
	{
		if ($result[$a] < $start) {
			$result[$b] -= intval(($start - $result[$a] - 1) / $adj) + 1;
			$result[$a] += $adj * intval(($start - $result[$a] - 1) / $adj + 1);
		}

		if ($result[$a] >= $end) {
			$result[$b] += intval($result[$a] / $adj);
			$result[$a] -= $adj * intval($result[$a] / $adj);
		}

		return $result;
	}

	private function _date_range_limit_days($base, $result)
	{
		$days_in_month_leap = array(31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
		$days_in_month = array(31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

		$base = $this->_date_range_limit(1, 13, 12, "m", "y", $base);

		$year = $base["y"];
		$month = $base["m"];

		if (!$result["invert"]) {
			while ($result["d"] < 0) {
				$month--;
				if ($month < 1) {
					$month += 12;
					$year--;
				}

				$leapyear = $year % 400 == 0 || ($year % 100 != 0 && $year % 4 == 0);
				$days = $leapyear ? $days_in_month_leap[$month] : $days_in_month[$month];

				$result["d"] += $days;
				$result["m"]--;
			}
		} else {
			while ($result["d"] < 0) {
				$leapyear = $year % 400 == 0 || ($year % 100 != 0 && $year % 4 == 0);
				$days = $leapyear ? $days_in_month_leap[$month] : $days_in_month[$month];

				$result["d"] += $days;
				$result["m"]--;

				$month++;
				if ($month > 12) {
					$month -= 12;
					$year++;
				}
			}
		}

		return $result;
	}

	private function _date_normalize($base, $result)
	{
		$result = $this->_date_range_limit(0, 12, 12, "m", "y", $result);

		$result = $this->_date_range_limit_days($base, $result);

		return $this->_date_range_limit(0, 12, 12, "m", "y", $result);
	}

	/**
	 * Accepts two unix timestamps.
	 */
	private function _date_diff($one, $two): array
	{
		$invert = false;
		if ($one > $two) {
			list($one, $two) = array($two, $one);
			$invert = true;
		}

		$key = array("y", "m", "d");
		$a = array_combine($key, array_map("intval", explode(" ", date("Y m d", $one))));
		$b = array_combine($key, array_map("intval", explode(" ", date("Y m d", $two))));

		$result = array();
		$result["y"] = $b["y"] - $a["y"];
		$result["m"] = $b["m"] - $a["m"];
		$result["d"] = $b["d"] - $a["d"];
		$result["invert"] = $invert ? 1 : 0;
		$result["days"] = intval(abs(($one - $two) / 86400));

		if ($invert) {
			$result = $this->_date_normalize($a, $result);
		} else {
			$result = $this->_date_normalize($b, $result);
		}

		return $result;
	}
}
