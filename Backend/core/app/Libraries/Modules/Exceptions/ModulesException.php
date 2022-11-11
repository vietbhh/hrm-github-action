<?php namespace Halo\Modules\Exceptions;

use CodeIgniter\Exceptions\ExceptionInterface;
use CodeIgniter\Exceptions\FrameworkException;

class ModulesException extends FrameworkException implements ExceptionInterface
{
	public static function forMissingName(): ModulesException
	{
		return new static('missing_name');
	}

	public static function forMissingParams($name): ModulesException
	{
		return new static('missing_params_' . $name);
	}

	public static function forExistsData($name): ModulesException
	{
		return new static('exists_data_' . $name);
	}

	public static function forMissingTableName(): ModulesException
	{
		return new static('missing_table_name');
	}

	public static function forUnmatchedName($identify): ModulesException
	{
		return new static('unmatched_name_'.$identify, 404);
	}

	public static function forUnableToMakeMigration(): ModulesException
	{
		return new static('unable_make_migration');
	}

	public static function forUnableToMakeTable($msg): ModulesException
	{
		return new static('[unable_make_table]' . $msg);
	}

	public static function forFailedToAction($msg): ModulesException
	{
		return new static('[action_failed]' . $msg);
	}

}
