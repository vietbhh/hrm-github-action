<?php namespace Myth\Auth\Authentication\Resetters;

use Myth\Auth\Config\Auth;

class BaseResetter
{
	protected $config;


	public function __construct(Auth $config)
	{
		$this->config = $config;
	}

	/**
	 * Allows for setting a config file on the Resetter.
	 *
	 * @param $config
	 *
	 * @return $this
	 */
	public function setConfig($config)
	{
		$this->config = $config;

		return $this;
	}

	/**
	 * Gets a config settings for current Resetter.
	 *
	 * @return $array
	 */
	public function getResetterSettings()
	{
		return (object)$this->config->userResetters[get_class($this)];
	}

}
