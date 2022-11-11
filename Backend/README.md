# Codeigniter4-ReactJS

Vjp pr0 core base to start any software.

## Prerequisites

1. PHP 7.2 or above
2. Composer version 1.10 or above
3. intl PHP extension (for formatting currency, number and date/time, see [CodeIgniter4 Docs](https://codeigniter4.github.io/userguide/intro/requirements.html) )
4. xdebug PHP extension (for testing purpose only, optional)
5. php_sqlite3 PHP extension (for testing purpose only, very optional)

## How to use

1. Clone github.com/MufidJamaluddin/Codeigniter4-HMVC.git
2. Install dependency by run ```composer install```
3. Configure the app by change the ```env``` file.

## Make new module 

1. Create module folder in app/Modules folder (example: app/Module/YourModule).
2. Create Config, Controllers, and Models folder in your module path (example: see existing Admin and Land module)
3. Create new Controller file and add your methods and test cases in tests folder
4. Update module routes by run ```php spark route:update``` for create/change all module routes
   OR
   ```php spark route:update -m YourModule``` for create/change only one module.
5. Run ```composer test``` for run your test cases (optional, see [CodeIgniter4 Docs](https://codeigniter4.github.io/userguide/testing/index.html) or [PHPUnit Docs](https://phpunit.readthedocs.io/en/9.1/) )

## Notes

Always run ```php spark route:update``` after create or change module, controller, or controller methods except if you want to configure module route manually.

## Command Prompt

### Command route:update parameter

Parameters:
    '-n' = Set module namespace (default App\Modules)
    '-i' = Set route with /index path without parameter (true/false, default true)
    '-m' = Set route one module name to be create/update (app/Modules/YourModuleName)
    '-f' = Set module folder inside app path (default Modules)


Usage command ```php spark route:update -i false -m YourModule```

### PHPUnit

You can run all of your test cases by run ```composer test```

### Other Command

You can get all command prompt list by run ```php spark list``` and composer command in composer.json > scripts.

## Contribute

You can contribute for extend CodeIgniter4 capabilities or add command prompt for development use by fork this repository. After that, you can make pull request.