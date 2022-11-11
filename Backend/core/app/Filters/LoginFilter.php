<?php namespace App\Filters;

use Config\Services;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

class LoginFilter implements FilterInterface
{
	/**
	 * Do whatever processing this filter needs to do.
	 * By default it should not return anything during
	 * normal execution. However, when an abnormal state
	 * is found, it should return an instance of
	 * CodeIgniter\HTTP\Response. If it does, script
	 * execution will end and that Response will be
	 * sent back to the client, allowing for error pages,
	 * redirects, etc.
	 *
	 * @param \CodeIgniter\HTTP\RequestInterface $request
	 * @param array|null $params
	 *
	 * @return mixed
	 */

	public function before(RequestInterface $request, $params = null)
	{
		if (!function_exists('logged_in')) {
			helper('auth');
		}
		// if no user is logged in then send to the login form
		$authenticate = Services::authentication();
		if (!$authenticate->check()) {
			//header('HTTP/1.1 401 Unauthorized', true, 401);
			$result = ["status" => 401, "error" => 401, "messages" => ['error' => 'invalid_auth_token','data' => $authenticate->token()]];
			return \Config\Services::response()->setStatusCode(401)->setBody(json_encode($result))->setHeader("WWW-Authenticate", "Bearer Token");

		}
	}

	//--------------------------------------------------------------------

	/**
	 * Allows After filters to inspect and modify the response
	 * object as needed. This method does not allow any way
	 * to stop execution of other after filters, short of
	 * throwing an Exception or Error.
	 *
	 * @param \CodeIgniter\HTTP\RequestInterface $request
	 * @param \CodeIgniter\HTTP\ResponseInterface $response
	 * @param array|null $arguments
	 *
	 * @return void
	 */
	public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
	{

	}

	//--------------------------------------------------------------------
}
