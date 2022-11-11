<?php
/*******--System variable--*******/
define('COREPATH', realpath(__DIR__ . DS . '..' . DS . '..' . DS . '..' . DS . '..' . DS . 'core') . DS);
define('COREAPP', realpath(COREPATH . 'app') . DS);
define('CODEPATH', realpath(COREPATH . 'code') . DS);
define('WPATH', realpath(__DIR__ . DS . '..' . DS . '..' . DS . 'writable') . DS);
define('CLIENTPATH', realpath(__DIR__ . DS . '..') . DS);
/*******--Configuration--*******/
defined('CODE_NAMESPACE') || define('CODE_NAMESPACE', 'DEFAULT');

?>