<?php

namespace App\Libraries\Google\Config;

use App\Libraries\Google\GoogleClient;

class Services extends \CodeIgniter\Config\BaseService
{
    public static function google() : GoogleClient
    {
        return new GoogleClient();
    }
}
