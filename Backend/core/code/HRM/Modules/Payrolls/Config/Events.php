<?php

namespace HRM\Modules\Payrolls\Config;

class Events
{
	public function sendPayslip($params)
	{
		$mailServices = \Config\Services::mail();
		foreach ($params as $item) {
			$mailSubject = $item['subject'];
			$mail_to = $item['email'];
			$mailContent = $item['mail_body'];
			if (!empty($mail_to)) {
				$mailServices->send($mailSubject, $mail_to, $mailContent);
			}
		}
	}
}