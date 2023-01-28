<?php
namespace HRM\Modules\Insurance\Libraries\Insurance\Config;

use HRM\Modules\Insurance\Libraries\Insurance\Insurance;

class Services extends \CodeIgniter\Config\BaseService
{
    public static function insurance(): Insurance
    {
        return new Insurance();
    }
}