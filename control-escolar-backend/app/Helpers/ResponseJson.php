<?php

namespace App\Helpers;

use App\Helpers\Interfaces\ResponseJsonInterface;

class ResponseJson implements ResponseJsonInterface 
{
    public static function response (array $data, $code) 
    {
        return response()->json($data, $code);
    }

    public static function data($data, $code)
    {
        return self::response([
            'data' => $data,
            'code' => $code,
            'error' => null
        ], $code);
    }
    
    public static function msg($msg, $code)
    {
        return self::response([
            'message' => $msg,
            'code' => $code,
            'error' => null
        ], $code);
    }

    public static function error($msg, $code, $details = [])
    {
        return self::response([
            'error' => [
                'message' => $msg,
                'details' => $details
            ],
            'code' => $code
        ], $code);
    }
}