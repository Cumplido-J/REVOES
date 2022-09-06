<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Periodo;
use Illuminate\Support\Facades\DB;

class PeriodoController extends Controller
{
    /**
     * Regresa la lista de periodos para que funcione como catálogo en otras vistas
     * (Podría usar el index, dependerá de los demás módulos, este es temporal)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function catalogo(){
        $periodos = Periodo::orderBy('id', 'desc')->get();

        return response()->json(['periodos' => $periodos], 200);
    }

    public function catalogoGeneraciones(){
        return response()->json(['generaciones' => DB::table('cat_generacion')->get()], 200);
    }

    public function getConfigCtePeriodos(Request $request){
        $generacion = DB::table('cat_generacion')->where('generacion', $request->generacion)->first();

        $periodo = null;
        if($generacion) {
            $periodo = DB::table('config_cte_periodos')
                ->where('id_entidad', $request->estado_id)
                ->where('id_generacion', $generacion->id)
                ->first();
        }

        return response()->json(['config_periodo' => $periodo], 200);
    }

}
