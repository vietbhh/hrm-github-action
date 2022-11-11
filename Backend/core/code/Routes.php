<?php
/**
 * --------------------------------------------------------------------
 * Router Scan
 * --------------------------------------------------------------------
 */

foreach (CODE_AUTOLOAD as $key => $item) {
	$path = CODEPATH . '/' . $key . '/Modules';
	if (is_dir($path)) {
		foreach (glob($path . '/*', GLOB_ONLYDIR) as $item_dir) {
			if (file_exists($item_dir . '/Config/Routes.php')) {
				require_once($item_dir . '/Config/Routes.php');
			}
		}
	}
}

?>