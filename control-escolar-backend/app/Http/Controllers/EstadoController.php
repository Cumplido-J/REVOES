<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Estado;

class EstadoController extends Controller
{
    public function index(){

        $estados = Estado::get();

        return response()->json(['data' => $estados], 200);

    }
}
