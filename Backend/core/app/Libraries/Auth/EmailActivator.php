<?php namespace App\Libraries\Auth;

use CodeIgniter\Config\Services;
use CodeIgniter\Entity\Entity;
use Config\Email;
use Myth\Auth\Authentication\Activators\ActivatorInterface;
use Myth\Auth\Authentication\Activators\BaseActivator;

/**
 * Class EmailResetter
 *
 * Sends a reset password email to user.
 *
 * @package App\Libraries\Auth\AuthEmail
 */
class EmailActivator extends BaseActivator implements ActivatorInterface
{
	/**
	 * @var string
	 */
	protected $error;

	/**
	 * Sends a reset email
	 *
	 * @param User $user
	 *
	 * @return mixed
	 */
	public function send(Entity $user = null, $emailActivationTemplates = null): bool
	{
		$email = Services::email();
		$config = new Email();
		$mailConfig = array();
		if (!empty(preference('SMTPUser'))) $mailConfig['SMTPUser'] = preference('SMTPUser');
		if (!empty(preference('SMTPPass'))) $mailConfig['SMTPPass'] = preference('SMTPPass');
		if (!empty(preference('SMTPHost'))) $mailConfig['SMTPHost'] = preference('SMTPHost');
		if (!empty(preference('SMTPPort'))) $mailConfig['SMTPPort'] = preference('SMTPPort');
		if (!empty(preference('SMTPCrypto'))) $mailConfig['SMTPCrypto'] = preference('SMTPCrypto');
		if (!empty(preference('fromName'))) $mailConfig['fromName'] = preference('fromName');
		if (!empty(preference('fromMail'))) $mailConfig['fromMail'] = preference('fromMail');
		$supportEmail = preference('email');
		$sent = $email->initialize($mailConfig)
			->setTo($user->email)
			->setSubject(lang('Auth.activationSubject'))
			->setMessage(view($emailActivationTemplates ?? $this->config->views['emailActivation'], ['app_name' => preference('app_name'), 'hash' => $user->activate_hash, 'name' => $user->full_name ?? $user->username, 'email' => $user->email, 'supportEmail' => $supportEmail, 'ip' => $_SERVER['REMOTE_ADDR']]))
			->setMailType('html')
			->send(false);
		if (!$sent) {
			$this->error = $email->printDebugger(['headers']);
			return false;
		}

		return true;
	}

	/**
	 * Returns the error string that should be displayed to the user.
	 *
	 * @return string
	 */
	public function error(): string
	{
		return $this->error ?? '';
	}

}
