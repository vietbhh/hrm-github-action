<?php

namespace HRM\Modules\Payrolls\Libraries\Payrolls\Config;

use HRM\Modules\Payrolls\Libraries\Payrolls\Payrolls;

class Services extends \CodeIgniter\Config\BaseService
{
	public static function payrolls(): Payrolls
	{
		return new Payrolls();
	}
}