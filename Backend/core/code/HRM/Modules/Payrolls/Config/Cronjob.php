<?php

namespace HRM\Modules\Payrolls\Config;

use HRM\Modules\Payrolls\Controllers\Payrolls;

class Cronjob
{
	// crontab create new payroll schedule
	public function create_new_payroll_schedule()
	{
		$modules = \Config\Services::modules();
		$today = date('Y-m-d');
		//get payroll cycle
		$modules->setModule('pay_cycles');
		$model = $modules->model;
		$infoPayrollCycle = $model->asArray()->first();
		$effectiveDateCycle = isset($infoPayrollCycle['effective']) ? $infoPayrollCycle['effective'] : null;
		$repeatTypeCycle = isset($infoPayrollCycle['repeat_every_type']) ? $infoPayrollCycle['repeat_every_type'] : null;
		$repeatNumCycle = isset($infoPayrollCycle['repeat_every_num']) ? $infoPayrollCycle['repeat_every_num'] : null;
		//get info payroll
		$modules->setModule('payrolls');
		$model = $modules->model;
		$infoPayroll = $model->asArray()->where('date_to >', $today)->first();

		//insert new schedule
		if (!$infoPayroll) {
			/* case today is new effective date
			 - insert new payrolls
			   case today is not new effective date
			 - get last payroll and continue schedule
			*/
			$infoLastPayroll = $model->asArray()->orderBy('date_to', 'DESC')->first();
			$allowInsert = false;
			if ($effectiveDateCycle !== null && (strtotime($today) === strtotime($effectiveDateCycle))) {
				$fromDate = $effectiveDateCycle;
				$toDate = $this->_getToDate($fromDate, $repeatTypeCycle, $repeatNumCycle);
				$repeatType = $repeatTypeCycle;
				$repeatNum = $repeatNumCycle;
				$allowInsert = true;
			} else if ($infoLastPayroll) {
				$repeatType = $infoLastPayroll['repeat_every_type'];
				$repeatNum = $infoLastPayroll['repeat_every_num'];
				$fromDate = date('Y-m-d', strtotime('+1 day', strtotime($infoLastPayroll['date_to'])));
				$toDate = $this->_getToDate($fromDate, $repeatType, $repeatNum);
				$allowInsert = true;
			} else if (!$infoLastPayroll) {
				$fromDate = $today;
				$toDate = $this->_getToDate($fromDate, $repeatTypeCycle, $repeatNumCycle);
				$repeatType = $repeatTypeCycle;
				$repeatNum = $repeatNumCycle;
				$allowInsert = true;
			}

			if ($allowInsert) {
				$insertData = [
					'name' => $this->_formatDateToLetter($fromDate) . ' - ' . $this->_formatDateToLetter($toDate),
					'date_from' => $fromDate,
					'date_to' => $toDate,
					'closed' => 0,
					'repeat_every_type' => $repeatType,
					'repeat_every_num' => $repeatNum
				];
				$model->setAllowedFields(array_keys($insertData));
				$model->save($insertData);
			}
		}
	}

	// crontab run when today is Cut-off Date
	function handle_cut_off_date()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$today = date('Y-m-d');

		$modules->setModule('payrolls');
		$model = $modules->model;
		$infoCurrentPayroll = $model->asArray()->where('date_from <=', $today)->where('date_to >=', $today)->first();
		if (!$infoCurrentPayroll) {
			echo 'invalid payroll info';
			return;
		}

		//get payroll cycle
		$modules->setModule('pay_cycles');
		$model = $modules->model;
		$infoPayrollCycle = $model->asArray()->first();
		$repeatTypeCycle = isset($infoPayrollCycle['repeat_every_type']) ? $infoPayrollCycle['repeat_every_type'] : null;
		$cutOffDate = isset($infoPayrollCycle['cut_off_date']) ? $infoPayrollCycle['cut_off_date'] : null;

		$dateCutOff = $this->_getDateCutOff($repeatTypeCycle, $cutOffDate, $infoCurrentPayroll['date_to']);
		if (strtotime($today) === strtotime($dateCutOff)) {
			//handle todo
			try {
				$idPayroll = $infoCurrentPayroll['id'];
				$payrollController = new Payrolls();
				$result = $payrollController->closePayroll($idPayroll, true);
				echo $result;
			} catch (\Exception $e) {
				echo $e->getMessage();
			}
		}
	}

	// crontab send mail to person in charge before Cut-off Date
	function send_mail_review_payroll()
	{
		helper('app_select_option');
		$modules = \Config\Services::modules();
		$mailServices = \Config\Services::mail();
		$today = date('Y-m-d');

		$modules->setModule('payrolls');
		$model = $modules->model;
		$infoCurrentPayroll = $model->asArray()->where('date_from <=', $today)->where('date_to >=', $today)->first();
		if (!$infoCurrentPayroll) {
			echo 'invalid payroll info';
			return;
		}

		//get payroll cycle
		$modules->setModule('pay_cycles');
		$model = $modules->model;
		$infoPayrollCycle = $model->asArray()->first();
		$repeatTypeCycle = isset($infoPayrollCycle['repeat_every_type']) ? $infoPayrollCycle['repeat_every_type'] : null;
		$cutOffDate = isset($infoPayrollCycle['cut_off_date']) ? $infoPayrollCycle['cut_off_date'] : null;
		$reviewBeforeCutOffDate = isset($infoPayrollCycle['rw_before_cut_off_date']) ? $infoPayrollCycle['rw_before_cut_off_date'] : null;

		$dateCutOff = $this->_getDateCutOff($repeatTypeCycle, $cutOffDate, $infoCurrentPayroll['date_to']);
		if (strtotime($today) === strtotime('-' . $reviewBeforeCutOffDate . ' day', strtotime($dateCutOff))) {
			//get info employee
			$personInCharge = $infoPayrollCycle['person_in_charge'];
			$modules->setModule('employees');
			$model = $modules->model;
			$infoEmployee = $model->select([
				"id",
				"full_name",
				"email"
			])->asArray()->find($personInCharge);

			if ($infoEmployee) {
				$mailName = $mailSubject = 'Time to review payroll';
				$mailTo = $infoEmployee['email'];
				$logoDefaultPath = preference('logo_default');
				$filepath = getenv('app.baseURL') . '/download/logo/image?name=' . $logoDefaultPath;
				$mailContent = "
                    <div style='width: 100%'>
                        <div style='width: 75%; margin: auto; padding: 20px;'>
                            <div>
                                <img alt='logo' width='10%' src='$filepath' />
                            </div>
                            <div>
                                <table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center'>
                                    <tr>
                                        <td>
                                            <h2 style='margin-bottom: 25px'>" . $mailName . "</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>Hi " . $infoEmployee['full_name'] . ", </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                The upcoming payroll pay date is " . date('d/m/Y', strtotime($today)) . ". 
                                                <br />
                                                It’s time to review your employee payroll information to make sure all changes are taken into account.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>Please click <a href='" . getenv('app.siteURL') . "/payrolls/employee-payroll'>here</a> to review your Payroll info</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Best regards,</td>
                                    </tr>
                                    <tr>
                                        <td>Friday team</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                ";
				$mail = $mailServices->send($mailSubject, $mailTo, $mailContent);
				return $mail;
			} else {
				echo 'invalid employee info';
				return;
			}
		}
	}

	// ** support function
	private function _formatDateToLetter($date)
	{
		return date('d M Y', strtotime($date));
	}

	private function _getToDate($formDate, $repeatType, $repeatNum)
	{
		helper('app_select_option');
		//weekly
		if (
			$repeatType == getOptionValue('payrolls', 'repeat_every_type', 'week')
			|| $repeatType == getOptionValue('pay_cycles', 'repeat_every_type', 'week')
		) {
			return date('Y-m-d', strtotime('+' . ((7 * $repeatNum) - 1) . '  day', strtotime($formDate)));
		}

		return date('Y-m-d', strtotime('-1 day', strtotime('+1 month', strtotime($formDate))));
	}

	public function _getDateCutOff($repeatTypeCycle, $cutOffDate, $endDate)
	{
		helper('app_select_option');
		if ($repeatTypeCycle == getOptionValue('pay_cycles', 'repeat_every_type', 'week')) {
			return date('Y-m-d', strtotime('-' . $cutOffDate . ' day', strtotime($endDate)));
		} else if ($repeatTypeCycle == getOptionValue('pay_cycles', 'repeat_every_type', 'month')) {
			return date('Y-m-' . $cutOffDate);
		}
		return '';
	}
}
