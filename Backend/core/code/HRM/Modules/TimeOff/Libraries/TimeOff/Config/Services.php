<?php

namespace HRM\Modules\TimeOff\Libraries\TimeOff\Config;

use HRM\Modules\TimeOff\Libraries\TimeOff\TimeOff;

class Services extends \CodeIgniter\Config\BaseService
{
	public static function TimeOff(): TimeOff
	{
		return new TimeOff();
	}
}