<?php namespace App\Libraries\Mail;

use App\Libraries\Mail\Config\Mail;
use App\Libraries\Mail\Models\EmailModel;

class MailManager
{
	/**
	 * Our configuration instance.
	 *
	 * @param MailConfig $config
	 * @var MailConfig
	 *     */
	protected $config;
	protected $model;
	protected $email;
	protected $setting;

	public function __construct()
	{
		$this->model = new EmailModel();
		$this->config = new Mail();
		$this->email = \Config\Services::email();

	}


	public function send($subject, $to, $content, $cc = null, $bcc = null, $attachments = [], $overrideConfig = [], $timer = null): bool
	{
		if (!is_callable('user_id')) {
			helper('auth');
		}
		$status = 'pending';
		$result = true;
		$config = [
			'SMTPUser' => preference('SMTPUser'),
			'SMTPPass' => preference('SMTPPass'),
			'SMTPHost' => preference('SMTPHost'),
			'SMTPPort' => preference('SMTPPort'),
			'SMTPCrypto' => preference('SMTPCrypto'),
			'fromName' => preference('fromName'),
			'fromMail' => preference('fromMail'),
		];
		$config = $overrideConfig + $config;
		$time_expected = $timer;
		$time_real = '';
		$respond = '';
		if (empty($timer)) {
			$time_expected = date('Y-m-d H:i:s');
			$this->email->initialize($config);
			$this->email->setSubject($subject);
			$this->email->setTo($to);
			$this->email->setMessage($content);
			if ($cc) $this->email->setCC($cc);
			if ($bcc) $this->email->setBCC($bcc);
			if ($this->email->send()) {
				$result = true;
				$status = 'success';
			} else {
				$result = false;
				$status = 'failed';
			}
			$respond = $this->email->printDebugger(['header', 'subject', 'body']);
			$time_real = date('Y-m-d H:i:s');
		}
		$log = [
			'from' => $config['SMTPUser'],
			'config' => json_encode($config),
			'to' => is_array($to) ? implode(';', $to) : $to,
			'cc' => is_array($cc) ? implode(';', $cc) : $cc,
			'bcc' => is_array($bcc) ? implode(';', $bcc) : $bcc,
			'subject' => $subject,
			'content' => $content,
			'attachments' => is_array($attachments) ? implode(';', $attachments) : $attachments,
			'owner' => user_id(),
			'status' => $status,
			'respond' => json_encode($respond),
			'time_expected' => $time_expected,
			'time_real' => $time_real,
			'created_at' => date('Y-m-d H:i:s'),
		];
		$this->model->save($log);

		return $result;
	}

	public function getTemplates($condition = [], $returnAsOption = false)
	{
		return !empty($condition['id']) ? $this->model->getTemplateDetail($condition) : $this->model->getTemplates($condition, $returnAsOption);
	}

	public function saveTemplate($data)
	{
		return $this->model->saveTemplate($data);
	}

	public function deleteTemplate($id)
	{
		return $this->model->deleteTemplate($id);
	}

}