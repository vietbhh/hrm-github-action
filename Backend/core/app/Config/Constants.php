<?php

//--------------------------------------------------------------------
// App Namespace
//--------------------------------------------------------------------
// This defines the default Namespace that is used throughout
// CodeIgniter to refer to the Application directory. Change
// this constant to change the namespace that all application
// classes should use.
//
// NOTE: changing this will require manually modifying the
// existing namespaces of App\* namespaced-classes.
//
defined('APP_NAMESPACE') || define('APP_NAMESPACE', 'App');

/*
|--------------------------------------------------------------------------
| Composer Path
|--------------------------------------------------------------------------
|
| The path that Composer's autoload file is expected to live. By default,
| the vendor folder is in the Root directory, but you can customize that here.
*/
defined('COMPOSER_PATH') || define('COMPOSER_PATH', COREPATH . '..' . DS . 'vendor/autoload.php');

/*
|--------------------------------------------------------------------------
| Timing Constants
|--------------------------------------------------------------------------
|
| Provide simple ways to work with the myriad of PHP functions that
| require information to be in seconds.
*/
defined('SECOND') || define('SECOND', 1);
defined('MINUTE') || define('MINUTE', 60);
defined('HOUR') || define('HOUR', 3600);
defined('DAY') || define('DAY', 86400);
defined('WEEK') || define('WEEK', 604800);
defined('MONTH') || define('MONTH', 2592000);
defined('YEAR') || define('YEAR', 31536000);
defined('DECADE') || define('DECADE', 315360000);

/*
|--------------------------------------------------------------------------
| Exit Status Codes
|--------------------------------------------------------------------------
|
| Used to indicate the conditions under which the script is exit()ing.
| While there is no universal standard for error codes, there are some
| broad conventions.  Three such conventions are mentioned below, for
| those who wish to make use of them.  The CodeIgniter defaults were
| chosen for the least overlap with these conventions, while still
| leaving room for others to be defined in future versions and user
| applications.
|
| The three main conventions used for determining exit status codes
| are as follows:
|
|    Standard C/C++ Library (stdlibc):
|       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
|       (This link also contains other GNU-specific conventions)
|    BSD sysexits.h:
|       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
|    Bash scripting:
|       http://tldp.org/LDP/abs/html/exitcodes.html
|
*/
defined('EXIT_SUCCESS') || define('EXIT_SUCCESS', 0); // no errors
defined('EXIT_ERROR') || define('EXIT_ERROR', 1); // generic error
defined('EXIT_CONFIG') || define('EXIT_CONFIG', 3); // configuration error
defined('EXIT_UNKNOWN_FILE') || define('EXIT_UNKNOWN_FILE', 4); // file not found
defined('EXIT_UNKNOWN_CLASS') || define('EXIT_UNKNOWN_CLASS', 5); // unknown class
defined('EXIT_UNKNOWN_METHOD') || define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT') || define('EXIT_USER_INPUT', 7); // invalid user input
defined('EXIT_DATABASE') || define('EXIT_DATABASE', 8); // database error
defined('EXIT__AUTO_MIN') || define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX') || define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code
defined('PHPASS_HASH_STRENGTH') || define('PHPASS_HASH_STRENGTH', 8);
defined('PHPASS_HASH_PORTABLE') || define('PHPASS_HASH_PORTABLE', FALSE);
defined('PWD_MASTER_KEY') || define('PWD_MASTER_KEY', 'W13hGXqf2c');

defined('USER_SELECT_FIELDS') || define('USER_SELECT_FIELDS', ['avatar as icon', 'email as email', 'full_name as full_name']);

defined('USER_MODULES') || define('USER_MODULES', ['users','employees']);

defined('NOT_FOUND') || define('NOT_FOUND', 'not_found');
defined('MISSING_PERMISSION') || define('MISSING_PERMISSION', 'MISSING_PERMISSION');
defined('MISSING_ACCESS_PERMISSION') || define('MISSING_ACCESS_PERMISSION', 'dont_have_access_permission');
defined('MISSING_LIST_PERMISSION') || define('MISSING_LIST_PERMISSION', 'dont_have_list_permission');
defined('MISSING_ADD_PERMISSION') || define('MISSING_ADD_PERMISSION', 'dont_have_add_permission');
defined('MISSING_UPDATE_PERMISSION') || define('MISSING_UPDATE_PERMISSION', 'dont_have_update_permission');
defined('MISSING_DELETE_PERMISSION') || define('MISSING_DELETE_PERMISSION', 'dont_have_delete_permission');
defined('MISSING_IMPORT_PERMISSION') || define('MISSING_IMPORT_PERMISSION', 'dont_have_import_permission');
defined('MISSING_REQUIRED') || define('MISSING_REQUIRED', 'missing_data_or_field_required');
defined('VALIDATE_DATA_ERROR') || define('VALIDATE_DATA_ERROR', 'validate_data_error');
defined('FAILED_SAVE') || define('FAILED_SAVE', 'failed_save');
defined('FAILED_UPLOAD') || define('FAILED_UPLOAD', 'failed_upload');
defined('FAILED_DELETE') || define('FAILED_DELETE', 'failed_delete');
defined('FILE_CORRUPTED') || define('FILE_CORRUPTED', 'file_corrupted');
defined('FILE_NOT_ALLOWED') || define('FILE_NOT_ALLOWED', 'file_not_allowed');
defined('FILE_TOO_LARGE') || define('FILE_TOO_LARGE', 'file_too_large');
defined('ACTION_SUCCESS') || define('ACTION_SUCCESS', 'action_success');
defined('MODULE_ERROR') || define('MODULE_ERROR', 'module_error');
defined('DEFAULT_SAVE_API_DISABLE') || define('DEFAULT_SAVE_API_DISABLE', 'DEFAULT_SAVE_API_DISABLE');
defined('DEFAULT_LOAD_API_DISABLE') || define('DEFAULT_LOAD_API_DISABLE', 'DEFAULT_LOAD_API_DISABLE');
defined('DEFAULT_DETAIL_API_DISABLE') || define('DEFAULT_DETAIL_API_DISABLE', 'DEFAULT_DETAIL_API_DISABLE');
defined('DEFAULT_DELETE_API_DISABLE') || define('DEFAULT_DELETE_API_DISABLE', 'DEFAULT_DELETE_API_DISABLE');
defined('DEFAULT_IMPORT_API_DISABLE') || define('DEFAULT_IMPORT_API_DISABLE', 'DEFAULT_IMPORT_API_DISABLE');