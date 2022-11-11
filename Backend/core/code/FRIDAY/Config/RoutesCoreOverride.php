<?php
if (!isset($routes)) {
	$routes = \Config\Services::routes(true);
}
/**
 *
 * Override CORE Routes
 * $routes->get('calendar/load', 'Calendar::load_get', ['namespace' => 'HRM\Controllers']);
 *
 */