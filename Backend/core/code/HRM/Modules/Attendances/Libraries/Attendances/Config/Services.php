<?php
namespace HRM\Modules\Attendances\Libraries\Attendances\Config;

use HRM\Modules\Attendances\Libraries\Attendances\Attendances;

class Services extends \CodeIgniter\Config\BaseService
{
    public static function attendance() : Attendances
    {
        return new Attendances();
    }
}