<?php
namespace Config;
require_once COREPATH . '/../vendor/codeigniter4/framework/system/Config/DotEnv.php';
/**
 * This file is part of the CodeIgniter 4 framework.
 *
 * (c) CodeIgniter Foundation <admin@codeigniter.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


use InvalidArgumentException;

/**
 * Environment-specific configuration
 */
class DotEnv extends \CodeIgniter\Config\DotEnv
{

	protected function setVariable(string $name, string $value = '')
	{
		putenv("$name=$value");
		$_ENV[$name] = $value;
		$_SERVER[$name] = $value;
	}

}


?>