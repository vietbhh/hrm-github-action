<?php namespace App\Libraries\Mail\Config;


use App\Libraries\Mail\MailManager;
require_once APPPATH . 'Config/Services.php';

class Services extends \CodeIgniter\Config\BaseService
{
	public static function mail(BaseConfig $config = null, bool $getShared = true): MailManager
	{
		if ($getShared) {
			return static::getSharedInstance('mail', $config);
		}

		// If no config was injected then load one
		if (empty($config)) {
			$config = config('mail');
		}
		return new MailManager($config);
	}
}
