<?php

namespace App\Helpers\Interfaces;

use App\Helpers\Interfaces\BaseResponseInterface;
use App\Helpers\Interfaces\ErrorResponseInterface;

interface ResponseJsonInterface extends BaseResponseInterface, ErrorResponseInterface
{   
    public static function data($code, $data);
    public static function msg($code, $data);
}