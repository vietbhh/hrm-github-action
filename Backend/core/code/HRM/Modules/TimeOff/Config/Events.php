<?php

namespace HRM\Modules\Timeoff\Config;
class Events
{
	function SendMailRequest($params)
	{
		$mail_date = $params['mail_date'];
		$mail_link_team = $params['mail_link_team'];
		$mail_link_request_approve = $params['mail_link_request_approve'];
		$mail_link_request_reject = $params['mail_link_request_reject'];
		$mail_name = $params['mail_name'];
		$mail_type = $params['mail_type'];
		$mail_total = $params['mail_total'];
		$mail_node = $params['mail_node'];
		$mail_name_send = $params['mail_name_send'];
		$mailSubject = $params['mailSubject'];
		$mailTo = $params['mailTo'];

		$mailServices = \Config\Services::mail();
		$mailContent = "
<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
	<tr>
		<td>
		<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;' align='center' bgcolor='#ffffff'>
			<tr>
				<td style='padding: 35px; font-size: 18px'>
				<span>Hi $mail_name,</span>
					<br>
					<span>$mail_name_send submitted a time off request with the following information:</span>
					<br>
					<ul>
						<li>Type: $mail_type</li>
						<li>Date: $mail_date</li>
						<li>Total: $mail_total</li>			
						<li>Note: $mail_node</li>
					</ul>
					<p style='text-align:center; white-space:nowrap; overflow:auto'>
						<a target='_blank' href='$mail_link_request_approve' style='background-color: rgb(1, 205, 137) !important; border: 1px solid rgb(1, 205, 137); border-radius: 2px; color: rgb(255, 255, 255) !important; display: inline-block; font-size: 16px; font-weight: bold; letter-spacing: 1px; line-height: 16px; padding: 15px 40px; text-align: center; text-decoration: none; font-family: helvetica, sans-serif; margin-right: 12px'>Approve</a>
						<a target='_blank' href='$mail_link_request_reject' style='background-color: rgb(226, 87, 76) !important; border: 1px solid rgb(226, 87, 76); border-radius: 2px; color: rgb(255, 255, 255) !important; display: inline-block; font-size: 16px; font-weight: bold; letter-spacing: 1px; line-height: 16px; padding: 15px 40px; text-align: center; text-decoration: none; font-family: helvetica, sans-serif; margin-right: 12px'>Reject</a>
					</p>
					<span>View <a target='_blank' href='$mail_link_team' style='color: #01CD89; text-decoration: none;'>Approval Time Off</a> for more details.</span>
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
		if (!empty($mailTo)) {
			$mail = $mailServices->send($mailSubject, $mailTo, $mailContent);
		}

		return $mail;
	}

	function SendMailRequestNotification($params)
	{
		$status = $params['status'];
		$mail_name = $params['mail_name'];
		$mail_name_send = $params['mail_name_send'];
		$mail_date = $params['mail_date'];
		$mail_link_team = $params['mail_link_team'];
		$mailSubject = $params['mailSubject'];
		$mail_to = $params['mail_to'];
		$bcc = $params['bcc'];
		$mailServices = \Config\Services::mail();
		$mailContent = "
<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;' align='center' bgcolor='#F2F2F3'>
	<tr>
		<td>
		<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%;max-width:700px;font: small/1.5 Arial,Helvetica,sans-serif;' align='center' bgcolor='#ffffff'>
			<tr>
				<td style='padding: 35px; font-size: 18px'>
				<span>Hi $mail_name,</span>
					<br>
					<span>$mail_name_send $status $mail_name time off request for $mail_date</span>
					<br>
					<br>
					<span>View <a target='_blank' href='$mail_link_team' style='color: #01CD89; text-decoration: none;'>My Time Off</a> for more details.</span>
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
			$mail = $mailServices->send($mailSubject, $mail_to, $mailContent, null, $bcc);
		}

		return $mail;
	}
}