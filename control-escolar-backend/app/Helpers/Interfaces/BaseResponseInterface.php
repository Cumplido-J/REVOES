<?php

namespace App\Helpers\Interfaces;

interface BaseResponseInterface 
{   
    public static function response (array $data, $code);
}