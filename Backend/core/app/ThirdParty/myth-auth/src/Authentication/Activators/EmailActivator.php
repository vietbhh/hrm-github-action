<?php namespace Myth\Auth\Authentication\Activators;

use CodeIgniter\Config\Services;
use CodeIgniter\Entity;
use Config\Email;

/**
 * Class EmailActivator
 *
 * Sends an activation email to user.
 *
 * @package Myth\Auth\Authentication\Activators
 */
class EmailActivator extends BaseActivator implements ActivatorInterface
{
	/**
	 * @var string
	 */
	protected $error;

	/**
	 * Sends an activation email
	 *
	 * @param User $user
	 *
	 * @return mixed
	 */
	public function send(Entity $user = null): bool
	{
		$email = Services::email();
		$config = new Email();

		$settings = $this->getActivatorSettings();

		$sent = $email->setFrom($settings->fromEmail ?? $config->fromEmail, $settings->fromName ?? $config->fromName)
			->setTo($user->email)
			->setSubject(lang('Auth.activationSubject'))
			->setMessage(view($this->config->views['emailActivation'], ['hash' => $user->activate_hash]))
			->setMailType('html')
			->send();

		if (!$sent) {
			$this->error = lang('Auth.errorSendingActivation', [$user->email]);
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
