<?php

namespace App\Http\Controllers;

use App\ConfigFechaPeriodo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Sisec;

class ConfigFechaPeriodoController extends Controller
{
    public function index($estadoId, $periodoId){

        if(!Sisec::validarAlcanceEstatal($estadoId)){
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }

        $config = ConfigFechaPeriodo::where('estado_id', $estadoId)
            ->where('periodo_id', $periodoId)
            ->first();

        return response()->json(['data' => $config], 200);

    }

    public function update(Request $request){

        $validacion = Validator::make($request->all(), [
            'estado_id' => 'required|exists:cat_estado,id',
            'periodo_id' => 'required|exists:periodo,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
        ],[
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_fin.required' => 'La fecha de fin es obligatoria.',
            'periodo_id.required' => 'El periodo es obligatorio.',
            'periodo_id.exists' => 'El periodo seleccionado no existe.',
            'estado_id.required' => 'El estado es obligatorio.',
            'estado_id.exists' => 'El estado seleccionado no existe.',
            'date' => 'El formato de la fecha es incorrecto.'
        ]);

        if($validacion->fails()){
            $errores = $validacion->errors()->getMessages();
            $msg = '';
            foreach ($errores as $error){
                $msg.=' '.$error[0];
            }

            return response()->json(['message' => $msg], 400);
        }

        if(!Sisec::validarAlcanceEstatal($request->estado_id)){
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }

        $configuracion = ConfigFechaPeriodo::updateOrCreate([
            'estado_id' => $request->estado_id,
            'periodo_id' => $request->periodo_id
        ],[
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
        ]);

        return response()->json(['message' => 'Se han actualizado las fechas.', 'config' => $configuracion], 200);

    }
}
