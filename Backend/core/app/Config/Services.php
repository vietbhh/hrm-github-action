<?php namespace Config;

use App\Libraries\Calendars\Calendars;
use App\Libraries\Calendars\Config\Calendars as CalendarsConfig;
use App\Libraries\Mail\Config\Mail as MailConfig;
use App\Libraries\Mail\MailManager;
use App\Libraries\NodeServer\NodeServer;
use App\Libraries\Notifications\Notifications;
use App\Libraries\Tasks\Tasks;
use App\Models\UserModel;
use CodeIgniter\Config\BaseConfig;
use CodeIgniter\Config\Services as CoreServices;
use CodeIgniter\Model;
use Halo\Modules\Models\MetaModel;
use Halo\Modules\Models\ModuleModel;
use Halo\Modules\Models\RouteModel;
use Halo\Modules\ModulesManager;
use Myth\Auth\Authorization\FlatAuthorization;
use Myth\Auth\Authorization\GroupModel;
use Myth\Auth\Authorization\PermissionModel;
use Myth\Auth\Models\LoginModel;
use Tatter\Audits\Audits;
use Tatter\Permits\Config\Permits as PermitsConfig;
use Tatter\Permits\Interfaces\PermitsUserModelInterface;
use Tatter\Permits\Permits;

require_once SYSTEMPATH . 'Config/Services.php';

/**
 * Services Configuration file.
 *
 * Services are simply other classes/libraries that the system uses
 * to do its job. This is used by CodeIgniter to allow the core of the
 * framework to be swapped out easily without affecting the usage within
 * the rest of your application.
 *
 * This file holds any application-specific services, or service overrides
 * that you might need. An example has been included with the general
 * method format you should use for your service methods. For more examples,
 * see the core Services file at system/Config/Services.php.
 */
class Services extends CoreServices
{

	public static function authentication(string $lib = 'local', Model $userModel = null, Model $loginModel = null, bool $getShared = true)
	{
		if ($getShared) {
			return self::getSharedInstance('authentication', $lib, $userModel, $loginModel);
		}

		$userModel = $userModel ?? model(UserModel::class);
		$loginModel = $loginModel ?? model(LoginModel::class);

		/** @var \Myth\Auth\Config\Auth $config */
		$config = config('Auth');
		$class = $config->authenticationLibs[$lib];
		$instance = new $class($config);

		return $instance
			->setUserModel($userModel)
			->setLoginModel($loginModel);
	}

	public static function authorization(Model $groupModel = null, Model $permissionModel = null, Model $userModel = null, bool $getShared = true)
	{


		$groupModel = $groupModel ?? model(GroupModel::class);
		$permissionModel = $permissionModel ?? model(PermissionModel::class);
		$userModel = $userModel ?? model(UserModel::class);

		$instance = new FlatAuthorization($groupModel, $permissionModel);

		return $instance->setUserModel($userModel);
	}


	/**
	 * @param string|null $module
	 * @param ModuleModel|null $moduleModel
	 * @param RouteModel|null $routeModel
	 * @param MetaModel|null $metaModel
	 * @param bool $getShared
	 * @return ModulesManager
	 */
	public static function modules($module = '', ModuleModel $moduleModel = null, RouteModel $routeModel = null, MetaModel $metaModel = null, bool $getShared = false): ModulesManager
	{
		if ($getShared) {
			return static::getSharedInstance('modules', $module, $moduleModel, $routeModel, $metaModel);
		}
		return new ModulesManager(
			$module,
			$moduleModel ?? model(ModuleModel::class),
			$routeModel ?? model(RouteModel::class),
			$metaModel ?? model(MetaModel::class)
		);
	}

	/**
	 * @param PermitsConfig|null $config
	 * @param PermitsUserModelInterface|null $userModel
	 * @param boolean $getShared
	 */
	public static function permits(PermitsConfig $config = null, PermitsUserModelInterface $userModel = null, bool $getShared = true): Permits
	{
		if ($getShared) {
			return static::getSharedInstance('permits', $config, $userModel);
		}

		$config = $config ?? config('Permits');

		return new Permits($config, $userModel);
	}


	public static function audits(BaseConfig $config = null, bool $getShared = true): Audits
	{
		if ($getShared) {
			return static::getSharedInstance('audits', $config);
		}

		// If no config was injected then load one
		if (empty($config)) {
			$config = config('Audits');
		}

		return new Audits($config);
	}

	public static function nodeServer($options = []): NodeServer
	{
		return new NodeServer($options);
	}


	/**
	 * @param CalendarsConfig|null $config
	 * @param bool $getShared
	 */
	public static function calendars(CalendarsConfig $config = null, bool $getShared = true): Calendars
	{
		if ($getShared) {
			return static::getSharedInstance('calendars', $config);
		}

		// If no config was injected then load one
		if (empty($config)) {
			$config = config('calendars');
		}
		return new Calendars($config);
	}

	/**
	 * @param MailConfig|null $config
	 * @param bool $getShared
	 */

	public static function mail($config = null, bool $getShared = true): MailManager
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

	public static function notifications($config = null, bool $getShared = true)
	{
		if ($getShared) {
			return static::getSharedInstance('notifications', $config);
		}

		// If no config was injected then load one
		if (empty($config)) {
			$config = config('notifications');
		}
		return new Notifications($config);
	}


	public static function task($config = null, bool $getShared = true)
	{
		if ($getShared) {
			return static::getSharedInstance('task', $config);
		}

		// If no config was injected then load one
		if (empty($config)) {
			$config = config('task');
		}
		return new Tasks($config);
	}
}
