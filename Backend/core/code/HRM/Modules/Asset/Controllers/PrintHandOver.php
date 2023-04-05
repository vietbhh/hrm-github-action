<?php

namespace HRM\Modules\Asset\Controllers;

use App\Controllers\ErpController;

class PrintHandOver extends ErpController
{
	public function export_word_post()
	{
		$getPara = $this->request->getPost();
		$arr_employee = $getPara['employee'];
		$path_template = COREPATH . 'assets/templates/bien_ban_ban_giao_tai_san.doc';
		$logo = COREPATH . 'assets/images/rsz_1logo_print_hand_over.png';
		$d = date("d");
		$m = date("m");
		$Y = date("Y");

		$languageEnGb = new \PhpOffice\PhpWord\Style\Language(\PhpOffice\PhpWord\Style\Language::EN_GB);
		$phpWord = new \PhpOffice\PhpWord\PhpWord();
		$phpWord->getSettings()->setThemeFontLang($languageEnGb);

		$section = $phpWord->addSection();
		$html = '<div style="font-family: Barlow Condensed Light; font-size: 11pt;width: 100%;">';

		$employeesModules = \Config\Services::modules("employees");
		$employeesModel = $employeesModules->model;

		$assetModules = \Config\Services::modules("asset_lists");
		$assetModel = $assetModules->model;

		foreach ($arr_employee as $id_employee) {
			$data_employee = $employeesModel->select(["id", "full_name", "job_title_id"])->asArray()->find($id_employee);

			if ($data_employee) {
				$data_employee = handleDataBeforeReturn($employeesModules, $data_employee);
				$job_title = $data_employee['job_title_id']['label'] ?? "";
				// header
				$header = '<table style="width: 100%; border: none">
<tr>
<td style="width: 50%;text-align: center">
<img src="' . $logo . '" />
<br />
<br />
<span style="font-size: 15pt;font-weight: bold">LIFE GLOBAL., JSC</span>
</td>
<td style="width: 50%; text-align: center">
<p style="font-size: 12pt;font-weight: bold">CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
<p style="font-size: 12pt;font-weight: bold">Độc lập – Tự do – Hạnh phúc</p>
<p style="font-size: 12pt;font-weight: bold">——–o0o——–</p>
</td>
</tr>
</table>';

				// content
				$content = '<p style="text-align: center;font-size: 13pt;font-weight: bold;margin-top: 10pt;margin-bottom: 0;">BIÊN BẢN GIAO NHẬN TSCĐ</p>';
				$content .= '<p style="text-align: center;font-style: italic;margin-bottom: 17pt;">Ngày ' . $d . ' tháng ' . $m . ' năm ' . $Y . '</p>';
				$content .= '<p style="margin-bottom: 0;">Căn cứ Quyết định số: ...................... ngày ' . $d . ' tháng ' . $m . ' năm ' . $Y . ' ....... của ...................... về việc bàn giao TSCĐ: </p>';
				$content .= '<p style="margin-bottom: 0;">               Bản giao nhận TSCĐ gồm:</p>';
				$content .= '<p style="margin-bottom: 0;">               - Ông/Bà : Vũ Thị Hồng Hải, chức vụ : Admin</p>';
				$content .= '<p style="margin-bottom: 0;">               - Ông/Bà : ' . $data_employee['full_name'] . ', chức vụ : ' . $job_title . '</p>';
				$content .= '<p style="margin-bottom: 0;">               - Ông/Bà : ................................................ chức vụ ...............................</p>';
				$content .= '<p style="margin-bottom: 0;">               Địa điểm giao nhận TSCĐ :............................................................................................</p>';
				$content .= '<p style="margin-bottom: 13pt;">               Xác nhận việc giao nhận TSCĐ như sau: </p>';

				// table ->join('m_time_off_types', 'm_time_off_types.id = m_time_off_balances.type', 'inner')
				$list_asset = $assetModel->join("m_asset_types", "m_asset_types.id = m_asset_lists.asset_type", "left")
					->join("m_asset_groups", "m_asset_groups.id = m_asset_types.asset_type_group", "left")
					->select(["m_asset_lists.asset_code as asset_code", "m_asset_lists.asset_descriptions as asset_descriptions", "m_asset_lists.date_created as date_created", "m_asset_types.asset_type_code as asset_type_code", "m_asset_types.asset_type_name as asset_type_name", "m_asset_groups.asset_group_name as asset_group_name"])
					->where('m_asset_lists.owner', $id_employee)->asArray()->findAll();

				$table = '<table style="width: 100%;font-size: 8pt;border-collapse: collapse; border: 1px solid black;">
<tr>
<td style="text-align: center;vertical-align: middle;width: 5%;">STT</td>
<td style="text-align: center;vertical-align: middle;width: 26%;">Tên, ký hiệu quy cách  (cấp hạng TSCĐ)</td>
<td style="text-align: center;vertical-align: middle;width: 18%;">Số hiệu TSCĐ</td>
<td style="text-align: center;vertical-align: middle;width: 10%;">Năm sản xuất</td>
<td style="text-align: center;vertical-align: middle;width: 10%;">Năm đưa vào sử dụng</td>
<td style="text-align: center;vertical-align: middle;width: 31%;">Mô tả</td>
</tr>';

				foreach ($list_asset as $key => $item_asset) {
					$stt = $key + 1;
					$table .= '
<tr>
<td style="vertical-align: middle;text-align: center;width: 5%;">' . $stt . '</td>
<td style="vertical-align: middle;width: 26%;text-align: center">' . $item_asset['asset_type_code'] . ' - ' . $item_asset['asset_type_name'] . '<br />' . $item_asset['asset_group_name'] . '</td>
<td style="vertical-align: middle;width: 18%;text-align: center">' . $item_asset['asset_code'] . '</td>
<td style="vertical-align: middle;width: 10%;text-align: center"></td>
<td style="vertical-align: middle;width: 10%;text-align: center">' . date('Y', strtotime($item_asset['date_created'])) . '</td>
<td style="vertical-align: middle;width: 31%;text-align: center">' . $item_asset['asset_descriptions'] . '</td>
</tr>';
				}

				$table .= '
<tr>
<td style="vertical-align: middle;text-align: center;width: 5%;"></td>
<td style="vertical-align: middle;width: 26%;text-align: center;font-weight: bold;font-style: italic">Cộng</td>
<td style="vertical-align: middle;width: 18%;text-align: center"></td>
<td style="vertical-align: middle;width: 10%;text-align: center"></td>
<td style="vertical-align: middle;width: 10%;text-align: center"></td>
<td style="vertical-align: middle;width: 31%;text-align: center"></td>
</tr>
</table>';

				// footer
				$footer = '<p style="margin-top: 15pt"></p>';
				$footer .= '<table style="width: 100%;">
<tr>
<td style="width: 25%; text-align: center">
<p style="font-weight: bold;margin-bottom: 0;">Giám đốc biên nhận</p>
<p style="font-style: italic">(Ký, họ tên, đóng dấu)</p>
</td>
<td style="width: 25%; text-align: center">
<p style="font-weight: bold;margin-bottom: 0;">Kế toán biên nhận</p>
<p style="font-style: italic">(Ký, họ tên)</p>
</td>
<td style="width: 25%; text-align: center">
<p style="font-weight: bold;margin-bottom: 0;">Người nhận</p>
<p style="font-style: italic">(Ký, họ tên)</p>
</td>
<td style="width: 25%; text-align: center">
<p style="font-weight: bold;margin-bottom: 0;">Người giao</p>
<p style="font-style: italic">(Ký, họ tên)</p>
<p style="font-weight: bold;font-size: 9pt;margin-top: 20pt;">Vũ Thị Hồng Hải</p>
</td>
</tr>
</table>';

				$break_line = '<div style="page-break-before:always"></div>';

				$html .= $header;
				$html .= $content;
				$html .= $table;
				$html .= $footer;
				$html .= $break_line;
			}
		}

		$html .= '</div>';

		\PhpOffice\PhpWord\Shared\Html::addHtml($section, $html, false, false);
		header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
		$phpWord->save('php://output');
	}
}