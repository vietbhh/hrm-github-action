<?php namespace App\Libraries\Calendars\Config;


class Services extends \CodeIgniter\Config\BaseService
{
	public static function calenders(BaseConfig $config = null, bool $getShared = true)
	{
		if ($getShared) {
			return static::getSharedInstance('calenders', $config);
		}

		// If no config was injected then load one
		if (empty($config)) {
			$config = config('Calenders');
		}

		return new Calendars($config);
	}
}
