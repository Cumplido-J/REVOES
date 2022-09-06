<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\InstitucionSeguro;

class InstitucionSeguroController extends Controller
{
    public function index(){
        return response()->json(['data' => InstitucionSeguro::all()], 200);
    }
}
