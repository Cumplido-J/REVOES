<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreCarreraUacRequest;
use App\Docente;
use App\Alumno;
use App\DocentePlantilla;
use App\CarreraUac;
use App\GrupoPeriodo;
use App\UAC;
use App\GrupoPeriodoOptativa;
use App\CalificacionUac;
use ResponseJson;
use Sisec;

class CarreraUacController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $carrera_uac = CarreraUac::with('carrera', 'uac')->get();

        return ResponseJson::data($carrera_uac, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
   /*  public function store(StoreCarreraUacRequest $request)
    {
        try {
            CarreraUac::create([
                'semestre' => $request->semestre,
                'carrera_id' => $request->carrera_id,
                'uac_id' => $request->uac_id
            ]);
            return ResponseJson::msg('carrera_uac creado con éxito', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible crear la carrera_uac', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible crear la carrera_uac', 400);
        } 
    } */

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $carrera_uac = CarreraUac::findOrFail($id);
            return ResponseJson::data($carrera_uac, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la carrera_uac', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la carrera_uac', 400);
        } 
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreCarreraUacRequest $request, $id)
    {
        try{
            $carrera_uac = CarreraUac::findOrFail($id);
            $carrera_uac->update([
                'semestre' => $request->semestre,
                'carrera_id' => $request->carrera_id,
                'uac_id' => $request->uac_id
            ]);
            return ResponseJson::msg('Datos del carrera_uac modificados correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::error('No fue posible modificar los datos de la carrera_uac', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible modificar los datos de la carrera_uac', 400);
        } 
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $carrera_uac = CarreraUac::findOrFail($id);
            $carrera_uac->delete($id);
            return ResponseJson::msg('Datos eliminado correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la carrera_uac', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar la carrera_uac', 400);
        } 
    }

    public function uacFilter(Request $request)
    {
        $carrera_id = $request->carrera_id;
        $semestre = $request->semestre;
        $grupo_periodo_id = $request->grupo_periodo_id;
        $periodo_actual = Sisec::periodoActual();
        if($semestre){
            $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
            if($periodo_actual->id == $grupo_periodo->periodo_id){
                if($semestre == 6){
                    $isNotOptativa = 0;
                    $isOptativa = 1;
                    $materias = [];
                    /* optativas */
                    $uac = CarreraUac::whereHas('uac', function($query) use($isOptativa, $grupo_periodo_id){
                         $query->whereHas('grupoOptativa', function($query) use($grupo_periodo_id){
                            $query->where('grupo_periodo_id', $grupo_periodo_id);
                         })->orWhere([
                             ['optativa', 0],
                             ['tipo_uac_id', '<>', 4]
                         ])->doesntHave('submodulos');
                     })->where([
                        ['carrera_id' , $carrera_id],
                        ['semestre', $semestre]
                    ])->with(['carrera', 'uac'])->get();
                    return ResponseJson::data($uac, 200);
                }    
            }
            $uac = CarreraUac::whereHas('uac', function ($query){
                $query->where('tipo_uac_id', '<>', 4)->doesntHave('submodulos');
            })->where([
                ['carrera_id' , $carrera_id],
                ['semestre', $semestre]
            ])->with(['carrera', 'uac'])->get();
            return ResponseJson::data($uac, 200);
        }else{
            return ResponseJson::data([], 400);
        }
    }

    public function uacSinCalificarFilter(Request $request)
    {
        if(!$request->has("alumno_id")){
            return ResponseJson::msg("No fue posible completar la solicitud", 400);
        }
        $alumno_id = $request->alumno_id;
        $semestre = $request->semestre;
        $carrera_id = $request->carrera_id;
        /* validar alumno */
        $alumno = Alumno::find($alumno_id);
        if(!$alumno){
            return ResponseJson::msg("No fue posible completar la solicitud, alumno no encontrado", 400); 
        }
        /* validar semestre */
        /* if($semestre >= $alumno->semestre){
            return ResponseJson::msg("No fue posible completar la solicitud, el alumno aun no cursa el semestre", 400); 
        } */
        if($semestre && $alumno_id){
            /* carrera uacs disponibles */
            $uac_faltantes = [];
            $uacs_obtenidos = [];
            $uacs_calificadas = [];
            $carreras_uac = CarreraUac::whereHas('uac', function ($query){
                $query->doesntHave('submodulos');
            })->where([
                ['carrera_id' , $carrera_id],
                ['semestre', $semestre]
            ])->with(['carrera', 'uac'])->get();
            /* guardar las uacs de las carrera uac relacionada con la carrera */
            foreach($carreras_uac as $carrera_uac){
                array_push($uacs_obtenidos, $carrera_uac->uac_id);
            }
            /* buscar calificaciones con las uac */
            $calificaciones = CalificacionUac::where([
                ['alumno_id', $alumno_id]
            ])->whereHas('carreraUac', function ($q) use($semestre) {
                $q->where('semestre', $semestre);
            })->with('carreraUac')->get();
            foreach($calificaciones as $calificacion){
                if(!in_array($calificacion->carreraUac->uac_id, $uacs_calificadas)){
                    array_push($uacs_calificadas, $calificacion->carreraUac->uac_id);
                }
            }
            /* definir uacs faltantes en historico */
            foreach($uacs_obtenidos as $uac){
                if(!in_array($uac, $uacs_calificadas)){
                    array_push($uac_faltantes, $uac);
                }
            }
            $carrera_uac_faltate = CarreraUac::whereHas('uac', function ($query){
                $query->doesntHave('submodulos');
            })->whereIn('uac_id', $uac_faltantes)->where('carrera_id', $carrera_id)->with(['carrera', 'uac'])->get();

            if($carrera_uac_faltate->isNotEmpty()){
                return ResponseJson::data($carrera_uac_faltate, 200);
            }else{
                return ResponseJson::msg("El alumno no cuenta con faltante de materias para el semestre ".$semestre, 400);
            }
        }else{
            return ResponseJson::data([], 400);
        }
    }

    public function uacReprobadoFilter(Request $request)
    {
        if(!$request->has("alumno_id")){
            return ResponseJson::msg("No fue posible completar la solicitud", 400);
        }
        $alumno_id = $request->alumno_id;
        $semestre = $request->semestre;
        /* validar alumno */
        $alumno = Alumno::find($alumno_id);
        if(!$alumno){
            return ResponseJson::msg("No fue posible completar la solicitud, alumno no encontrado", 400); 
        }
        /* validar semestre */
        if($semestre >= $alumno->semestre){
            return ResponseJson::msg("No fue posible completar la solicitud, el alumno aun no cursa el semestre", 400); 
        }
        if($semestre && $alumno_id){
            /* carrera uacs disponibles */
            $carreras_uac_faltantes_id = [];
            $carreras_uac = CarreraUac::whereHas('uac', function ($query){
                $query->doesntHave('submodulos');
            })->where([
                ['carrera_id' , $alumno->carrera_id],
                ['semestre', $semestre]
            ])->with(['carrera', 'uac'])->get();
            foreach($carreras_uac as $carrera_uac){
                $calificacion_final = CalificacionUac::where([
                    ['alumno_id', $alumno->usuario_id],
                    ['carrera_uac_id', $carrera_uac->id],
                    ['parcial', 4],
                    ['calificacion', '<' , 6]
                ])->first();
                if($calificacion_final){
                    /* evaluar si la ultima calificacion es de tipo ordinario y reprobado */
                    $ultima_calificacion = CalificacionUac::where([
                        ['alumno_id', $alumno->usuario_id],
                        ['carrera_uac_id', $carrera_uac->id]
                    ])->orderBy('id', 'DESC')->first();
                    if($ultima_calificacion->calificacion < 6 && $ultima_calificacion->parcial == 4){
                        array_push($carreras_uac_faltantes_id, $carrera_uac->id);
                    }
                }
            }
            $carrera_uac_faltate = CarreraUac::whereHas('uac', function ($query){
                $query->doesntHave('submodulos');
            })->whereIn('id', $carreras_uac_faltantes_id)->with(['carrera', 'uac'])->get();

            if($carrera_uac_faltate->isNotEmpty()){
                return ResponseJson::data($carrera_uac_faltate, 200);
            }else{
                return ResponseJson::msg("El alumno no cuenta con materias reprobadas para el semestre ".$semestre, 400);
            }
        }else{
            return ResponseJson::data([], 400);
        }
    }

}
