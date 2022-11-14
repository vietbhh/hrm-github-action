<?php
namespace HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups\Config;
use HRM\Modules\EmployeeGroups\Libraries\EmployeeGroups\EmployeeGroups;

class Services extends \CodeIgniter\Config\BaseService
{
    public static function employeeGroups() : EmployeeGroups
    {
        return new EmployeeGroups();
    }
}