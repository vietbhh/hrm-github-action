<?php namespace App\Libraries\Auth;

use CodeIgniter\Router\Exceptions\RedirectException;
use \Config\Services;
use CodeIgniter\Events\Events;
use CodeIgniter\Model;
use Firebase\JWT\JWT;
use App\Entities\User;
use mysql_xdevapi\Exception;
use Myth\Auth\Exceptions\AuthException;
use Myth\Auth\Exceptions\UserNotFoundException;

class JWTAuthenticatior implements \Myth\Auth\Authentication\AuthenticatorInterface
{
	/**
	 * @var string
	 */
	protected $token;


	/**
	 * @var string
	 */
	protected $refreshToken;


	/**
	 * @var User
	 */
	protected $user;

	/**
	 * @var Model
	 */
	protected $userModel;

	/**
	 * @var Model
	 */
	protected $loginModel;

	/**
	 * @var string
	 */
	protected $error;

	/**
	 * @var \Config\Auth
	 */
	protected $config;



	public function __construct($config)
	{
		$this->config = $config;
	}

	/**
	 * Returns the current error, if any.
	 *
	 * @return string
	 */
	public function error()
	{
		return $this->error;
	}

	/**
	 * Whether to continue instead of throwing exceptions,
	 * as defined in config.
	 *
	 * @return string
	 */
	public function silent()
	{
		return $this->config->silent;
	}


	/**
	 * Logs a user into the system.
	 * NOTE: does not perform validation. All validation should
	 * be done prior to using the login method.
	 *
	 * @param User|null $user
	 * @param bool $remember
	 *
	 * @return bool
	 * @throws \Exception
	 */
	public function login(User $user = null, bool $remember = false): bool
	{
		if (empty($user)) {
			$this->user = null;
			return false;
		}

		$this->user = $user;
		// Always record a login attempt
		$ipAddress = Services::request()->getIPAddress();
		$this->recordLoginAttempt($user->email, $ipAddress, $user->id ?? null, true);
		////////////GENERATE TOKEN///////////////////////////
		Services::response()->noCache();
		$this->token = $this->generateAccessToken($this->user->id)['token'];
		$this->refreshToken = $this->rememberUser($this->user->id, $remember);

		////////////END GENERATE API///////////////////////

		// We'll give a 20% chance to need to do a purge since we
		// don't need to purge THAT often, it's just a maintenance issue.
		// to keep the table from getting out of control.
		if (mt_rand(1, 100) < 20) {
			$this->loginModel->purgeOldRememberTokens();
		}

		// trigger login event, in case anyone cares
		Events::trigger('login', $user);

		return true;
	}

	/**
	 * generate access token
	 *
	 */
	public function generateAccessToken(int $userId)
	{
		helper('date');
		$secret = $_ENV['jwt_secret'];
		$token['id'] = $userId;  //From here
		$token['iat'] = now();
		$jwt_expireTime = $_ENV['jwt_expireTime'];
		$token['exp'] = now() + 60 * 60 * $jwt_expireTime;
		$result = array(
			'exp' => $token['exp'],
			'token' => JWT::encode($token, $secret)
		);
		return $result;
	}

	/**
	 * generate refresh token
	 *
	 */
	protected function generateRefreshToken(int $userId, bool $remember)
	{
		helper('date');
		$secret = $_ENV['jwt_refreshTokenSecret'];
		$token['id'] = $userId;
		$token['iat'] = now();
		$token['remember'] = $remember;
		$jwt_refreshTokenExpireTime = $_ENV['jwt_refreshTokenExpireTime'];
		$expires = now() + 60 * 60 * $jwt_refreshTokenExpireTime;
		if ($remember && $this->config->allowRemembering) {
			$expires = now() + $this->config->rememberLength;
		}
		$token['exp'] = $expires;

		$result = array(
			'exp' => $expires,
			'token' => JWT::encode($token, $secret)
		);
		return $result;
	}

	/**
	 * Decode token to user data
	 *
	 * @return bool;
	 */
	public function jwtTokenHandler()
	{
		$request = \Config\Services::request();
		$headers = $request->header('Authorization');
		if (!empty($headers)) {
			if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
				$this->token = $matches[1];
			}
		}
		if ($this->jwtTokenDecode()) {
			return true;
		}
		return false;
	}

	/**
	 * Decode token to user data
	 *
	 * @return array|null|object|bool
	 */
	public function jwtTokenDecode()
	{
		$data = null;
		$secret = $_ENV['jwt_secret'];
		try {
			$data = \Firebase\JWT\JWT::decode($this->token, $secret, array('HS256'));
		} catch (\Exception $e) {
			$data = false;
		}
		return $data;
	}


	/**
	 * Checks to see if the user is logged in.
	 *
	 * @return bool
	 * @throws \Exception
	 */
	public function isLoggedIn(): bool
	{
		// On the off chance
		if ($this->user instanceof User) {
			return true;
		}
		$userData = $this->jwtTokenDecode();

		if ($userData && $userID = $userData->id) {
			// Store our current user object
			$this->user = $this->userModel->find($userID);
			return $this->user instanceof User;
		}
		return false;
	}


	/**
	 * Logs a user into the system by their ID.
	 *
	 * @param int $id
	 * @param bool $remember
	 */
	public function loginByID(int $id, bool $remember = false)
	{
		$user = $this->retrieveUser(['id' => $id]);

		if (empty($user)) {
			throw UserNotFoundException::forUserID($id);
		}

		return $this->login($user, $remember);
	}

	/**
	 * Logs a user out of the system.
	 */
	public function logout()
	{
		$user = $this->user();
		// Take care of any remember me functionality
		$this->loginModel->purgeRememberTokens($user->id);
		// trigger logout event
		Events::trigger('logout', $user);
	}

	/**
	 * Record a login attempt
	 *
	 * @param string $email
	 * @param string|null $ipAddress
	 * @param int|null $userID
	 *
	 * @param bool $success
	 *
	 * @return bool|int|string
	 */
	public function recordLoginAttempt(string $email, string $ipAddress = null, int $userID = null, bool $success)
	{
		return $this->loginModel->insert([
			'ip_address' => $ipAddress,
			'email' => $email,
			'user_id' => $userID,
			'date' => date('Y-m-d H:i:s'),
			'success' => (int)$success
		]);
	}

	/**
	 * Generates refresh token
	 * and stores the necessary info in the db and a cookie.
	 *
	 * Refresh token use for extend access token,after [jwt_refreshTokenExpireTime] hours,
	 * user must to login again,if user active in [jwt_refreshTokenExpireTime] time,refresh will be extend continuous
	 *
	 * @see https://paragonie.com/blog/2015/04/secure-authentication-php-with-long-term-persistence
	 *
	 * @param int $userID
	 * @param bool $remember
	 * @return string
	 * @throws \Exception
	 */
	public function rememberUser(int $userID, $remember = false)
	{
		$selector = bin2hex(random_bytes(12));
		// Generate refresh token
		$refreshToken = $this->generateRefreshToken($userID, $remember);
		// Store it in the database
		$this->loginModel->rememberUser($userID, $selector, $refreshToken['token'], date('Y-m-d H:i:s', $refreshToken['exp']));
		$token = $selector . ':' . $refreshToken['token'];
		return $token;
	}

	/**
	 * Sets a new validator for this user/selector. This allows
	 * a one-time use of remember-me tokens, but still allows
	 * a user to be remembered on multiple browsers/devices.
	 *
	 * @param int $userID
	 * @param string $selector
	 */
	public function refreshToken(string $refreshToken)
	{
		try {
			[$selector, $token] = explode(':', $refreshToken);
		} catch (\Exception $e) {
			return false;
		}
		$existing = $this->loginModel->getRememberToken($selector);
		// No matching record? Shouldn't happen, but remember the user now.
		if (empty($existing)) {
			return false;
		}
		$secret = $_ENV['jwt_refreshTokenSecret'];
		try {
			$data = \Firebase\JWT\JWT::decode($token, $secret, array('HS256'));
			if (!$this->user = $this->retrieveUser(['id' => $data->id])) {
				return false;
			}
			$accessToken = $this->generateAccessToken($data->id);
			$refreshToken = $this->generateRefreshToken($data->id, $data->remember);
			$this->loginModel->updateRememberValidator($selector, $refreshToken['token'], date('Y-m-d H:i:s', $refreshToken['exp']));

			return array(
				'accessToken' => $accessToken['token'],
				'refreshToken' => $selector . ':' . $refreshToken['token'],
			);
		} catch (\Exception $e) {
			return false;
		}
	}


	/**
	 * Returns the User ID for the current logged in user.
	 *
	 * @return int|null
	 */
	public function id()
	{
		return $this->user->id ?? null;
	}


	/**
	 * Returns the User instance for the current logged in user.
	 *
	 * @return User|null
	 */
	public function user()
	{
		$user = $this->user;
		unset($user->password_hash);
		unset($user->reset_hash);
		unset($user->reset_at);
		unset($user->reset_expires);
		unset($user->activate_hash);
		unset($user->force_pass_reset);
		return $this->user;
	}


	/**
	 * Returns the current token.
	 *
	 * @return string|null
	 */
	public function token()
	{
		return $this->token;
	}


	/**
	 * Returns the current refresh token.
	 *
	 * @return string|null
	 */
	public function getRefreshToken()
	{
		return $this->refreshToken;
	}

	/**
	 * Grabs the current user from the database.
	 *
	 * @param array $wheres
	 *
	 * @return array|null|object
	 */
	public function retrieveUser(array $wheres)
	{
		if (!$this->userModel instanceof Model) {
			throw AuthException::forInvalidModel('User');
		}

		$user = $this->userModel
			->where($wheres)
			->first();

		return $user;
	}




	//--------------------------------------------------------------------
	// Model Setters
	//--------------------------------------------------------------------

	/**
	 * Sets the model that should be used to work with
	 * user accounts.
	 *
	 * @param \CodeIgniter\Model $model
	 *
	 * @return $this
	 */
	public function setUserModel(Model $model)
	{
		$this->userModel = $model;

		return $this;
	}

	/**
	 * Sets the model that should be used to record
	 * login attempts (but failed and successful).
	 *
	 * @param Model $model
	 *
	 * @return $this
	 */
	public function setLoginModel(Model $model)
	{
		$this->loginModel = $model;

		return $this;
	}


	/**
	 * Attempts to validate the credentials and log a user in.
	 *
	 * @param array $credentials
	 * @param bool $remember Should we remember the user (if enabled)
	 *
	 * @return bool
	 */
	public function attempt(array $credentials, bool $remember = null): bool
	{
		$this->user = $this->validate($credentials, true);

		if (empty($this->user)) {
			// Always record a login attempt, whether success or not.
			$ipAddress = Services::request()->getIPAddress();
			$this->recordLoginAttempt($credentials['email'] ?? $credentials['username'], $ipAddress, $this->user->id ?? null, false);

			$this->user = null;
			return false;
		}

		if ($this->user->isBanned()) {
			// Always record a login attempt, whether success or not.
			$ipAddress = Services::request()->getIPAddress();
			$this->recordLoginAttempt($credentials['email'] ?? $credentials['username'], $ipAddress, $this->user->id ?? null, false);

			$this->error = 'user_is_banned';

			$this->user = null;
			return false;
		}

		if (!$this->user->isActivated()) {
			// Always record a login attempt, whether success or not.
			$ipAddress = Services::request()->getIPAddress();
			$this->recordLoginAttempt($credentials['email'] ?? $credentials['username'], $ipAddress, $this->user->id ?? null, false);

			$param = http_build_query([
				'login' => urlencode($credentials['email'] ?? $credentials['username'])
			]);

			$this->error = 'user_is_not_activated';

			$this->user = null;
			return false;
		}

		return $this->login($this->user, $remember);
	}

	/**
	 * Checks to see if the user is logged in or not.
	 *
	 * @return bool
	 */
	public function check(): bool
	{
		if (!$this->jwtTokenHandler()) {
			$this->error = 'invalid_bearer_token';
			return false;
		}
		if ($this->isLoggedIn()) {
			// Do we need to force the user to reset their password?
			if ($this->user && $this->user->force_pass_reset) {
				$this->error = 'force_pass_reset';
				throw new Exception('force_pass_reset');
			}

			return true;
		}

		// Check the remember me functionality.
		/*$remember = $this->jwtTokenDecode()['remember'];
		if (empty($remember)) {
			return false;
		}
		[$selector, $validator] = explode(':', $remember);
		$validator = hash('sha256', $validator);

		$token = $this->loginModel->getRememberToken($selector);

		if (empty($token)) {
			return false;
		}

		if (!hash_equals($token->hashedValidator, $validator)) {
			return false;
		}
		// Yay! We were remembered!
		$user = $this->userModel->find($token->user_id);
		if (empty($user)) {
			return false;
		}
		$this->login($user);*/
		// We only want our remember me tokens to be valid
		// for a single use.
		//$this->refreshRemember($user->id, $selector);
		return false;
	}

	/**
	 * Checks the user's credentials to see if they could authenticate.
	 * Unlike `attempt()`, will not log the user into the system.
	 *
	 * @param array $credentials
	 * @param bool $returnUser
	 *
	 * @return bool|User
	 */
	public function validate(array $credentials, bool $returnUser = false)
	{
		// Can't validate without a password.
		if (empty($credentials['password']) || count($credentials) < 2) {
			return false;
		}

		// Only allowed 1 additional credential other than password
		$password = $credentials['password'];
		unset($credentials['password']);

		if (count($credentials) > 1) {
			throw AuthException::forTooManyCredentials();
		}

		// Ensure that the fields are allowed validation fields
		if (!in_array(key($credentials), $this->config->validFields)) {
			throw AuthException::forInvalidFields(key($credentials));
		}

		// Can we find a user with those credentials?
		$user = $this->userModel->where($credentials)
			->first();

		if (!$user) {
			$this->error = 'wrong_credentials';
			return false;
		}

		// Now, try matching the passwords.
		$result = password_verify(base64_encode(
			hash('sha384', $password, true)
		), $user->password_hash);

		if (!$result) {
			$this->error = 'invalid_password';
			return false;
		}


		// Check to see if the password needs to be rehashed.
		// This would be due to the hash algorithm or hash
		// cost changing since the last time that a user
		// logged in.
		if (password_needs_rehash($user->password_hash, $this->config->hashAlgorithm)) {
			$user->password = $password;
			$this->userModel->save($user);
		}

		return $returnUser
			? $user
			: true;
	}

}
