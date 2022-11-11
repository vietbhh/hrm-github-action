<?php
/**
 * --------------------------------------------------------------------
 * Router in this file will override some core router
 * --------------------------------------------------------------------
 */

foreach (CODE_AUTOLOAD as $key => $item) {
	if (file_exists(CODEPATH . '/' . $key . '/Config/RoutesCoreOverride.php')) {
		require_once(CODEPATH . '/' . $key . '/Config/RoutesCoreOverride.php');
	}
}
?>