<?php
namespace HRM\Modules\Employees\Libraries\Employees\Config;

use HRM\Modules\Employees\Libraries\Employees\Employees;

class Services extends \CodeIgniter\Config\BaseService
{
    public static function employees(): Employees
    {
        return new Employees();
    }
}