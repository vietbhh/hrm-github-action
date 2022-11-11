<?php

namespace App\Libraries\Upload\Config;

use App\Libraries\Upload\Upload;

class Services extends \CodeIgniter\Config\BaseService 
{
    public static function upload() : Upload
    {
        return new Upload();
    }
}