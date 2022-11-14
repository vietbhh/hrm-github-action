<?php

namespace HRM\Modules\Attendances\Config;

class Events
{
	public function updateTotalLog($params)
	{
		try {
			$db = \Config\Database::connect();
			$builder = $db->table('m_attendance_details');
			if (gettype($params) === 'array') {
				$builder->updateBatch($params, 'id');
			}
			if (gettype($params) === 'integer') {
				$builder->set('total_log', 'total_log + 1', false)->where('id', $params)->update();
			}

			return true;
		} catch (\ReflectionException $e) {
			return false;
		}
	}

	public function sendMailNotificationManager($params)
	{
		$mailServices = \Config\Services::mail();
		$mailSubject = 'Time to review employee attendance';
		$actual_link = $_ENV["app.siteURL"];
		$employeeAttendanceUrl = "$actual_link/attendances/employee-attendance";
		foreach ($params as $item) {
			$mail_to = $item['email'];
			$full_name = $item['full_name'];

			$mailContent = "
<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
	<tr>
		<td>
		<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;' align='center' bgcolor='#ffffff'>
			<tr>
				<td style='padding: 35px; font-size: 18px'>
				<span>Hi $full_name, to make sure employees are paid correctly, please review and confirm their attendance records.</span>
				<br>
				<br>
				<span>The attendance records will be used as an input for the payroll if your company has decided to calculate pay based on the number of working hours tracked in FriHR.</span>
				<br>
				<br>
				<span>Your colleagues doing payroll will see what you have confirmed and pay people according to that information.</span>
				<br>
				<br>
				<span>Please review and confirm employees' attendance <a target='_blank' href='$employeeAttendanceUrl' style='color: #01CD89; text-decoration: none;'>here</a>.</span>
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
			if (!empty($mail_to)) {
				$mailServices->send($mailSubject, $mail_to, $mailContent);
			}
		}
	}

	public function sendMailNotificationEmployee($params)
	{
		$mailServices = \Config\Services::mail();
		$mailSubject = 'Time to review your attendance';
		$actual_link = $_ENV["app.siteURL"];
		$employeeAttendanceUrl = "$actual_link/attendances/my-attendance";
		foreach ($params as $item) {
			$mail_to = $item['email'];
			$full_name = $item['full_name'];

			$mailContent = "
<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
	<tr>
		<td>
		<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;' align='center' bgcolor='#ffffff'>
			<tr>
				<td style='padding: 35px; font-size: 18px'>
				<span>Hi $full_name, to make sure your are paid correctly, please review your attendance records. If something incorrect,update it and noti for your line manager or HR department confirm it.</span>
				<br>
				<br>
				<span>The attendance records will be used as an input for the payroll if your company has decided to calculate pay based on the number of working hours tracked in FriHR.</span>
				<br>
				<br>
				<span>Please review and confirm your attendance <a target='_blank' href='$employeeAttendanceUrl' style='color: #01CD89; text-decoration: none;'>here</a>.</span>
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
			if (!empty($mail_to)) {
				$mailServices->send($mailSubject, $mail_to, $mailContent);
			}
		}
	}
}