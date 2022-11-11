<?php

if (!function_exists('preference')) {
	/**
	 * Provides a wrapper for user contextual Settings.
	 *
	 * @param mixed|null $value
	 *
	 * @return mixed
	 * @throws RuntimeException if attempting to set a preference witohut an active user
	 *
	 */
	function preference(string $key, $value = null, $setDefault = false, $userId = false)
	{
		// Check for shorthand requests
		if (count(explode('.', $key)) === 1) {
			$key = 'Preferences.' . $key;
		}
		if (!function_exists('user_id')) {
			helper('auth');
		}

		if (!$userId) {
			$userId = user_id();
		}
		$settings = service('settings');
		// Authenticated
		if ($userId && !$setDefault) {

			// Getting
			if (count(func_get_args()) === 1) {
				return $settings->get($key, 'user:' . $userId);
			}

			// Setting
			if ($value !== null) {
				$settings->set($key, $value, 'user:' . $userId);
			} // Forgetting (passed null value)
			else {
				$settings->forget($key, 'user:' . $userId);
			}

			return;
		}

		// Anonymous

		// Getting
		if (count(func_get_args()) === 1) {
			if (session()->has('settings-' . $key)) {
				return session('settings-' . $key);
			}
			return service('settings')->get($key);
		}

		// Setting
		if ($value !== null) {
			session()->set('settings-' . $key, $value);
			$settings->set($key, $value);
			return;
		}

		// Forgetting (passed null value)
		session()->remove('settings-' . $key);
	}
}