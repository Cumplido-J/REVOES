<?php

namespace App\Helpers\Interfaces;

interface ErrorResponseInterface 
{   
    public static function error($msg, $detail, $code);
}