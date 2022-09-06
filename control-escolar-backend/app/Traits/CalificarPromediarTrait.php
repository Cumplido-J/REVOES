<?php

namespace App\Traits;

use App\Traits\AuditoriaLogHelper;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\CalificacionUac;
use App\CarreraUac;
use App\Periodo;
use App\UAC;
use App\GrupoPeriodo;
use App\Alumno;

trait CalificarPromediarTrait
{
 /**
     * Calificar y promediagr
     *
     * @return array
     */
    public function calificarAlumno($alumno_id, $carrera_uac_id, $plantel_id, $parcial, $periodo_id, $calificacion, $faltas = null, $grupo_periodo_id = null, $grupo_recursamiento_intersemestral_id = null, $grupo_recursamiento_semestral_id = null, $grupo_extraordinario_id = null, $docente_plantilla, $tipo_calif, $califHistorica = false, $auditoria = true)
    {
        try {
            /* identificar tipo calificación */
            $tipo_calif = $this->tipoCalificacion($tipo_calif, $parcial, $carrera_uac_id, $alumno_id, null, $auditoria);
            /* consultar si ya cuenta con la calificación */
            $checkIfExistCalificacionParcial = $this->ifExistCalificacionInParcial($alumno_id, $carrera_uac_id, $plantel_id, $parcial, $periodo_id, $tipo_calif);/* checar si ya cuenta con calificación dentro del parcial */
            /* calificacion menor a 5 */
            $calificacion_parse = $this->isMenorACinco($calificacion, $periodo_id, $califHistorica);
            /* identificar al docente tipo_calif */
            if($docente_plantilla){
                if(isset($docente_plantilla->docente_id)){
                    $docente_id = $docente_plantilla->docente_id;
                }else{
                    $docente_id = $docente_plantilla;
                }
            }else{
                $docente_id = null;
            }
            if($checkIfExistCalificacionParcial){
                /* si ya cuenta con calificación, modificar */
                $calificacion_uac_old = CalificacionUac::findOrFail($checkIfExistCalificacionParcial->id);
                $calificacion_uac = CalificacionUac::findOrFail($checkIfExistCalificacionParcial->id);
                $calificacion_uac->update([
                    'alumno_id' => $alumno_id,
                    'carrera_uac_id' => $carrera_uac_id,
                    'calificacion' => $calificacion_parse,
                    'grupo_periodo_id' => $grupo_periodo_id,
                    'grupo_recursamiento_intersemestral_id' => $grupo_recursamiento_intersemestral_id,
                    'grupo_recursamiento_semestral_id' => $grupo_recursamiento_semestral_id,
                    'grupo_extraordinario_id' => $grupo_extraordinario_id,
                    'plantel_id' => $plantel_id,
                    'parcial' => $parcial,
                    'periodo_id' => $periodo_id,
                    'docente_id' => $docente_id,
                    'faltas' => $faltas,
                    'tipo_calif' => $tipo_calif
                ]);
                if($auditoria){
                    self::auditoriaSave($calificacion_uac, $calificacion_uac_old); /* adutoria log */
                }
            }else{
                /* nueva calificación */
                $calificacion_uac = CalificacionUac::create([
                    'alumno_id' => $alumno_id,
                    'carrera_uac_id' => $carrera_uac_id,
                    'calificacion' => $calificacion_parse,
                    'grupo_periodo_id' => $grupo_periodo_id,
                    'grupo_recursamiento_intersemestral_id' => $grupo_recursamiento_intersemestral_id,
                    'grupo_recursamiento_semestral_id' => $grupo_recursamiento_semestral_id,
                    'grupo_extraordinario_id' => $grupo_extraordinario_id,
                    'plantel_id' => $plantel_id,
                    'parcial' => $parcial,
                    'periodo_id' => $periodo_id,
                    'docente_id' => $docente_id,
                    'faltas' => $faltas,
                    'tipo_calif' => $tipo_calif
                ]);
                if($auditoria){
                    self::auditoriaSave($calificacion_uac); /* adutoria log */
                }
            }
            /* comprobar si la calificación es tipo sub modulo */
            $calificacion_modulo = $this->checkParcialModulo($alumno_id, $calificacion_parse, $carrera_uac_id, $parcial, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria);
            /* evaluar calificación final (no promediar automaticamente si la calificacion es final) */
            if($parcial != 4 && $parcial != 6 && $parcial != 5){
                return $calificacion_final = $this->promediarCalificacionFinal($alumno_id, $calificacion_parse, $carrera_uac_id, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria);
            }
            /* si el parcial es 4, dejar calificacion como llegue */
            return true;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    } 

    /**
     * Verifica si ya existe la calificacion en el parcial.
     */
    public function ifExistCalificacionInParcial($alumno_id, $carrera_uac_id, $plantel_id, $parcial, $periodo_id, $tipo_calif)
    {
        try {
            if($tipo_calif == "N" || $tipo_calif == null){ //calificación normal
                $calificacion_uac = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['carrera_uac_id', $carrera_uac_id],
                    ['plantel_id', $plantel_id],
                    ['parcial', $parcial],
                    ['periodo_id', $periodo_id]
                ])->first();
            }else if($tipo_calif == "CI" || $tipo_calif == "EXT" || $tipo_calif == "RS"){ //calificación intersemestral
                $calificacion_uac = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['carrera_uac_id', $carrera_uac_id],
                    ['plantel_id', $plantel_id],
                    ['parcial', $parcial],
                    ['periodo_id', $periodo_id],
                    ['tipo_calif', $tipo_calif]
                ])->first();
            }
            return $calificacion_uac;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } 
    }

    /**
     * Verifica si la calificacion parcial pertenece a una agrupación de modulo.
     */
    public function checkParcialModulo($alumno_id, $calificacion, $carrera_uac_id, $parcial, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria)
    {
        try {
            $carrera_uac = CarreraUac::find($carrera_uac_id);
            $uac = UAC::find($carrera_uac->uac_id);
            /* comprobar si es materia tipo submodulo */
            if(!$uac->modulo_id){
                return false; //no es submodulo
            }
            /* comprobar que no sea modulo */
            if($uac->id == $uac->modulo_id){
                return false; //es modulo
            }
            /* comprobar si hay relación carrera módulo */
            $carrera_uac_modulo = CarreraUac::where([
                ['uac_id', $uac->modulo_id],
                ['carrera_id', $carrera_uac->carrera_id]
            ])->first();
            if(!$carrera_uac_modulo){
                return false;  /* no se encontro la relación módulo carrera */
            }
            if($calificacion || $calificacion >= 0){
                /* de ser nueva o actualizacion de calificacion final parcial 6 de tipo CI */
                if($parcial >= 4){
                    /* proceso para parcializar calificacion final de tipo especial en caso de no contar calificados parciales y solo la final */
                    return $parcializar_calificacion_especial = $this->parcializarCalificacionEspecial(
                        $alumno_id, $calificacion, $carrera_uac_modulo, $carrera_uac_id, $parcial,
                        $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria);
                }else{
                    /* calificar de forma normal */
                    return $this->calificarParcialModulo($carrera_uac_modulo, $alumno_id, $calificacion, $carrera_uac_id, $parcial, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria);
                }
            }else{
                /* eliminar calificación parcial del módulo ya que se elimino una calificación */
                $calificacion_promedio_uac_modulo = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['tipo_calif', $tipo_calif],
                    ['carrera_uac_id', $carrera_uac_modulo->id],
                    ['periodo_id', $periodo_id],
                    ['parcial', $parcial],
                ])->first();
                if($calificacion_promedio_uac_modulo){
                    $calificacion_promedio_uac_modulo_old = CalificacionUac::find($calificacion_promedio_uac_modulo->id);
                    $calificacion_promedio_uac_modulo->update(['calificacion' => NULL]);
                    if($auditoria){
                        self::auditoriaSave($calificacion_promedio_uac_modulo, $calificacion_promedio_uac_modulo_old); /* adutoria log */
                    }
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    /**
     * Verifica si la calificacion ya necesita su calificación final automatica
     */
    public function promediarCalificacionFinal($alumno_id, $calificacion, $carrera_uac_id, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria)
    {
        try {
            if($tipo_calif == null){
                $tipo_parcial = 4; /* calificación Ordinaria */
                $tipo_calif = null;
            }else if($tipo_calif == "CI"){
                $tipo_parcial = 6; /* calificación R. Intersemestral */
            }else if($tipo_calif == "RS"){
                $tipo_parcial = 4; /* calificación R. Semestral */
                $tipo_calif == "RS";
            }else if($tipo_calif == "EXT"){
                $tipo_parcial = 5; /* calificación R. Semestral */
                $tipo_calif == "EXT";
            }
            if($calificacion || $calificacion >= 0){
                $parciales = ["1","2","3"];
                /* obtener las calificaciones mas recientes de cada parcial */
                $calificaciones_parciales_uac = [];
                if($this->isSubModulo($carrera_uac_id) || $this->isModulo($carrera_uac_id)){
                    for($i = 1; $i <= 3; $i++){
                        $calificacion_final = CalificacionUac::where([
                            ['alumno_id', $alumno_id],
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', $i]
                        ])->orderBy('id', 'DESC')->get();
                        if(count($calificacion_final) > 0){
                            array_push($calificaciones_parciales_uac, $calificacion_final[0]);
                        }
                    }
                }else{
                    $calificaciones_parciales_uac = CalificacionUac::where([
                        ['alumno_id', $alumno_id],
                        ['carrera_uac_id', $carrera_uac_id],
                        ['tipo_calif', $tipo_calif],
                    ])->where(function ($query) use($parciales){
                        $query->whereIn('parcial', $parciales);
                    })->whereNotNull('calificacion')->orderBy('parcial')->get();
                }
                $size = count($calificaciones_parciales_uac);
                if($size == 3){
                    $calificacion_final = null;
                    /* buscar calificacion final de tipo null doble y detectar cual es la nueva RS */
                    if($tipo_calif == null || $tipo_calif == "RS"){
                        /* cuando la calificacion es null (normal), consultar calificaciones finales de la materia sin validar periodo (ya que puede tener periodo anterior y esto duplicaria, mientras sea
                        curso normal no debe a ver problema) */
                        $calificacion_final = $this->getLastCalificacionFinal($alumno_id, $carrera_uac_id, $periodo_id, $grupo_periodo_id, $tipo_calif);
                    }
                    if(!$calificacion_final){
                        /* consulta si ya cuenta con calificacion final */
                        $calificacion_final = CalificacionUac::where([
                            ['alumno_id', $alumno_id],
                            ['carrera_uac_id', $carrera_uac_id],
                            ['periodo_id', $periodo_id],
                            ['tipo_calif', $tipo_calif],
                            ['parcial', $tipo_parcial],
                        ])->get();
                    }
                    /* promediar calificación */
                    $promedio = 0;
                    foreach($calificaciones_parciales_uac as $obj){
                        $promedio += $obj->calificacion;
                    }
                    $promedio = $promedio / 3;
                    /* validar uac tipo modulo */
                    if($this->isSubModulo($carrera_uac_id) || $this->isModulo($carrera_uac_id)){
                        foreach($calificaciones_parciales_uac as $obj){
                            if($obj->calificacion < 6){
                                $promedio = 5;
                            }
                        }
                    }
                    /* obtener calificacion minimo dependiendo periodo */
                    $calificacion = $this->calificacionFinalPromedio($promedio, $periodo_id);
                    /* modificar o agregar calificacion */
                    if(count($calificacion_final) > 0){
                        foreach($calificacion_final as $obj){
                            $calificacion_final = $obj;
                        }
                        $calificacion_final_old = CalificacionUac::find($calificacion_final->id);
                        $calificacion_final->update([
                            'calificacion' => $calificacion,
                            //'tipo_calif' => $tipo_calif
                        ]);
                        if($auditoria){
                            self::auditoriaSave($calificacion_final, $calificacion_final_old); /* adutoria log */
                        }
                    }else{
                        $calificacion_final = CalificacionUac::create([
                            'alumno_id' => $alumno_id,
                            'carrera_uac_id' => $carrera_uac_id,
                            'calificacion' => $calificacion,
                            'grupo_periodo_id' => $grupo_periodo_id,
                            'grupo_recursamiento_intersemestral_id' => $grupo_recursamiento_intersemestral_id,
                            'grupo_recursamiento_semestral_id' => $grupo_recursamiento_semestral_id,
                            'plantel_id' => $plantel_id,
                            'parcial' => $tipo_parcial,
                            'periodo_id' => $periodo_id,
                            'docente_id' => $docente_id,
                            'tipo_calif' => $tipo_calif
                        ]);
                        if($auditoria){
                            self::auditoriaSave($calificacion_final); /* adutoria log */
                        }
                    }
                    /* cambio estatus alumno */
                    $this->checkStatusStudent($alumno_id, $auditoria);
                }
            }else{
                /* eliminar calificación final ya que se elimino una calificación */
                $calificacion_final = CalificacionUac::where([
                        ['alumno_id', $alumno_id],
                        ['carrera_uac_id', $carrera_uac_id],
                        ['grupo_periodo_id', $grupo_periodo_id],
                        ['grupo_recursamiento_intersemestral_id', $grupo_recursamiento_intersemestral_id],
                        ['grupo_recursamiento_semestral_id', $grupo_recursamiento_semestral_id],
                        ['periodo_id', $periodo_id],
                        ['parcial', $tipo_parcial],
                ])->first();
                /* consultar si anteriormente tenia calificación final */
                if($calificacion_final){
                    $calificacion_final_old = CalificacionUac::find($calificacion_final->id);
                    if($calificacion_final){
                        $calificacion_final->update(['calificacion' => NULL]);
                        if($auditoria){
                            self::auditoriaSave($calificacion_final, $calificacion_final_old); /* adutoria log */
                        }
                    }
                }else{
                    return false;
                }
            }
            return true;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } 
    }

    public function getLastCalificacionFinal($alumno_id, $carrera_uac_id, $periodo_id, $grupo_periodo_id, $tipo_calificacion)
    {
        try {
            if($tipo_calificacion == "RS"){
                /* obtener la ultima RS */
                $calificacion_final = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['carrera_uac_id', $carrera_uac_id],
                    ['tipo_calif', $tipo_calificacion],
                    ['parcial', 4]
                ])->orderBy('id', 'DESC')->get();
            }else{
                /* obtener la ultima calificacion normal o RS en su defecto */
                $calificacion_final = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['carrera_uac_id', $carrera_uac_id],
                    /* ['tipo_calif', null], */
                    ['parcial', 4]
                ])->orderBy('id', 'DESC')->get();
            }
            if(count($calificacion_final) > 0){
                if($periodo_id > $calificacion_final[0]->periodo_id){
                    return null;
                }
                $calificacion = array($calificacion_final[0]);
            }else{
                $calificacion = [];
            }
            return $calificacion;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        }
    }

    /**
     * Ponderar la calificacion correspondiente del modulo/submodulo
     */
    public function ponderarCalificacionParcialModulo($sub_modulos, $calificacion_parcial_sub_modulos)
    {
        try {
            $calificacion_modulo_parcial = 0;
            //comprobar si no tiene submodulos reprobados
            foreach($calificacion_parcial_sub_modulos as $obj){
                if($obj["calificacion"] < 6 ){
                    return $calificacion_modulo_parcial = 5;
                }
            }
            //evaluar calificacion modulo
            $horas_totales_sub_modulos = 0; //horas totales por sub modulos
            foreach($sub_modulos as $sub_modulo){
                $horas_totales_sub_modulos += $sub_modulo->horas;
            }
            $calificacion_ponderada_parcial_sub_modulo = []; //arreglo con informacion a evaluar
            //calificacion del sub modulo con su total de horas
            foreach($calificacion_parcial_sub_modulos as $calificacion){
                $calificacion_hora = array(
                    "calificacion_parcial" => $calificacion["calificacion"], 
                    "horas_total_sub_modulo" => $calificacion["carrera_uac"]["uac"]["horas"] //horas del submodulo
                );
                array_push($calificacion_ponderada_parcial_sub_modulo, $calificacion_hora);
            }
            //promediar calificacion con ponderaciones
            foreach($calificacion_ponderada_parcial_sub_modulo as $key => $obj){
                $calificacion_ponderada = 0;
                $calificacion_ponderada = $obj["calificacion_parcial"] * $obj["horas_total_sub_modulo"];
                $calificacion_ponderada = $calificacion_ponderada / $horas_totales_sub_modulos;
                $calificacion = array('calificacion_ponderada' => $calificacion_ponderada);
                $calificacion_ponderada_parcial_sub_modulo[$key] = $calificacion; //nuevo json con resultados
            }
            //sumar calificaciones ponderadas
            foreach($calificacion_ponderada_parcial_sub_modulo as $obj){
                $calificacion_modulo_parcial += $obj["calificacion_ponderada"]; //suma de resultados
            }
            return round($calificacion_modulo_parcial, 1, PHP_ROUND_HALF_UP);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }   
    }

     /**
     * Calificar parcial modulo
     */
    public function calificarParcialModulo($carrera_uac_modulo, $alumno_id, $calificacion, $carrera_uac_id, $parcial, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria)
    {
        try {
            $calificaciones_parciales_sub_modulos = []; /* calificaciones sub modulos */
            /* obtener submodulos */
            $sub_modulos = $this->obtenerSubModulos($carrera_uac_modulo->uac_id);
            /* obtener carrera_uac_modulos */
            $carrera_uac_sub_modulos = $this->obtenerCarreraUacSubModulos($sub_modulos, $carrera_uac_modulo->carrera_id);
            /* calificaciones de parciales */
            foreach($carrera_uac_sub_modulos as $obj){
                $calificacion_sub_modulo = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['carrera_uac_id', $obj->id],
                    ['parcial', $parcial]
                ])->with('carreraUac.uac')->orderBy('id', 'DESC')->get()->toArray();
                if(count($calificacion_sub_modulo) != 0){
                    //guardar la calificacion mas reciente
                    array_push($calificaciones_parciales_sub_modulos, $calificacion_sub_modulo[0]);
                    /* si existe ya una calificacion RS */
                    if($calificacion_sub_modulo[0]['tipo_calif'] != null && $calificacion_sub_modulo[0]['tipo_calif'] != 'CI'){
                        $tipo_calif = $calificacion_sub_modulo[0]['tipo_calif'];
                    }
                }
            }
            /* calificación parcial ponderada modulo */
            $calificacion_parcial_ponderada = $this->ponderarCalificacionParcialModulo($sub_modulos, $calificaciones_parciales_sub_modulos);
            /* si el numero de califiaciones por parcial coincide con numero de submodulos, el modulo esta listo para ser evaluado automaticamente */
            if(count($calificaciones_parciales_sub_modulos) == count($sub_modulos)){
                /* si no hay periodo _id y la calificacion es curso normal, buscar su relacion */
                if(!$periodo_id && $tipo_calif == null){
                    /* consultar si ya existe calificacion parcial */
                    $calificacion_modulo_parcial = CalificacionUac::where([
                        ['alumno_id', $alumno_id],
                        ['carrera_uac_id', $carrera_uac_modulo->id],
                        ['tipo_calif', $tipo_calif],
                        ['parcial', $parcial],
                    ])->orderBy('id', 'DESC')->get()->toArray();
                    if(count($calificacion_modulo_parcial) > 0){
                        $calificacion_modulo_parcial = $calificacion_modulo_parcial[0];
                    }else{
                        $calificacion_modulo_parcial = null;
                    }
                }else{
                    /* consultar si ya existe calificacion parcial */
                    $calificacion_modulo_parcial = CalificacionUac::where([
                        ['alumno_id', $alumno_id],
                        ['carrera_uac_id', $carrera_uac_modulo->id],
                        ['tipo_calif', $tipo_calif],
                        /* ['periodo_id', $periodo_id], */
                        ['parcial', $parcial],
                    ])->orderBy('id', 'DESC')->get()->toArray();
                    if(count($calificacion_modulo_parcial) > 0){
                        $calificacion_modulo_parcial = $calificacion_modulo_parcial[0];
                    }else{
                        $calificacion_modulo_parcial = null;
                    }
                }
                //return $calificacion_modulo_parcial; 
                if($calificacion_modulo_parcial){
                    //modificar calificación parcial modulo
                    $calificacion_modulo_parcial_old = CalificacionUac::find($calificacion_modulo_parcial['id']);
                    $calificacion_modulo_parcial = CalificacionUac::find($calificacion_modulo_parcial['id']);
                    $calificacion_modulo_parcial->update([
                        'calificacion' => $calificacion_parcial_ponderada
                    ]);
                    if($auditoria){
                        self::auditoriaSave($calificacion_modulo_parcial, $calificacion_modulo_parcial_old); /* adutoria log */
                    }
                }else{
                    /* calificacion_modulo_parcial */
                    $calificacion_modulo_parcial = CalificacionUac::create([
                        'alumno_id' => $alumno_id,
                        'carrera_uac_id' => $carrera_uac_modulo->id,
                        'calificacion' => $calificacion_parcial_ponderada,
                        'grupo_periodo_id' => $grupo_periodo_id,
                        'grupo_recursamiento_intersemestral_id' => $grupo_recursamiento_intersemestral_id,
                        'grupo_recursamiento_semestral_id' => $grupo_recursamiento_semestral_id,
                        'plantel_id' => $plantel_id,
                        'parcial' => $parcial,
                        'periodo_id' => $periodo_id,
                        'docente_id' => $docente_id,
                        'tipo_calif' => $tipo_calif,
                    ]);
                    if($auditoria){
                        self::auditoriaSave($calificacion_modulo_parcial); /* adutoria log */
                    }
                }
            }
            /* compobar si ya puede ser calificado la calificación final automatica por parciales */
            if($parcial <= 3){
                return $this->promediarCalificacionFinal($alumno_id, $calificacion_parcial_ponderada, $carrera_uac_modulo->id, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria);
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }   
    }

    /**
     * Parcializar calificaciones de tipo submodulo de tipo especial para poder ponderar la calificacion
     */
    public function parcializarCalificacionEspecial($alumno_id, $calificacion, $carrera_uac_modulo, $carrera_uac_id, $parcial, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria)
    {
        try {
           /* comprobar que la carrera_uac_id contiene calificaciones de su mismo tipo en en su periodo */
            $calificacion_especial = CalificacionUac::where([
                ['alumno_id', $alumno_id],
                ['carrera_uac_id', $carrera_uac_id],
                ['periodo_id', $periodo_id],
                ['tipo_calif', $tipo_calif],
                ['plantel_id', $plantel_id]
            ])->get();
            if($calificacion_especial->isNotEmpty()){
                /* comprobar si contiene parciales del 1 al 3 */
                $parciales_comprobados = [];
                $parciales_faltantes = [];
                foreach($calificacion_especial as $calificacion_parcial){
                    /* comprobar parcial */
                    if($calificacion_parcial["parcial"] == 1){
                        if(!in_array(1, $parciales_comprobados)){
                            /* guardar parcial ya evaluado */
                            array_push($parciales_comprobados, 1);
                        }
                    }
                    if($calificacion_parcial["parcial"] == 2){
                        if(!in_array(2, $parciales_comprobados)){
                            array_push($parciales_comprobados, 2);
                        }
                    }
                    if($calificacion_parcial["parcial"] == 3){
                        if(!in_array(3, $parciales_comprobados)){
                            array_push($parciales_comprobados, 3);
                        }
                    }
                }
                /* crear calificaciones parciales faltantes*/
                if(!in_array(1, $parciales_comprobados)){
                    array_push($parciales_faltantes, 1);
                }
                if(!in_array(2, $parciales_comprobados)){
                    array_push($parciales_faltantes, 2);
                }
                if(!in_array(3, $parciales_comprobados)){
                    array_push($parciales_faltantes, 3);
                }
                if(count($parciales_faltantes) > 0){
                    foreach($parciales_faltantes as $parcial_faltante){
                        $calificacion_parcial = CalificacionUac::create([
                            'alumno_id' => $alumno_id,
                            'carrera_uac_id' => $carrera_uac_id,
                            'parcial' => $parcial_faltante,
                            'periodo_id' => $periodo_id,
                            'grupo_periodo_id' => $grupo_periodo_id,
                            'grupo_recursamiento_intersemestral_id' => $grupo_recursamiento_intersemestral_id,
                            'grupo_recursamiento_semestral_id' => $grupo_recursamiento_semestral_id,
                            'calificacion' => $calificacion,
                            'plantel_id' => $plantel_id,
                            'tipo_calif' => $tipo_calif
                        ]);
                        if($auditoria){
                            self::auditoriaSave($calificacion_parcial); /* adutoria log */
                        }
                    }
                }else{
                    /* modificar calificaciones relacionadas */
                    $calificacion_especial = CalificacionUac::where([
                        ['alumno_id', $alumno_id],
                        ['carrera_uac_id', $carrera_uac_id],
                        ['periodo_id', $periodo_id],
                        ['tipo_calif', $tipo_calif],
                        ['plantel_id', $plantel_id]
                    ])->get();
                    foreach($calificacion_especial as $obj){
                        $old_calificaion = CalificacionUac::find($obj->id);
                        $obj->update([
                            'calificacion' => $calificacion
                        ]);
                        if($auditoria){
                            self::auditoriaSave($obj, $old_calificaion); /* adutoria log */
                        }
                    }
                }
            }
            /* una ves obtenido las calificaciones parcializadas, empezar proceso para calificar con ponderacion cada parcial del modulo */
            for($i = 1; $i <= 3; $i ++){
                $calificacion_sub_modulo = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['carrera_uac_id', $carrera_uac_id],
                    ['periodo_id', $periodo_id],
                    ['tipo_calif', $tipo_calif],
                    ['parcial', $i],
                    ['plantel_id', $plantel_id]
                ])->first();
                if($calificacion_sub_modulo){
                    $this->calificarParcialModulo($carrera_uac_modulo, $alumno_id, $calificacion_sub_modulo->calificacion, $carrera_uac_id, $i, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $periodo_id, $docente_id, $plantel_id, $tipo_calif, $auditoria);
                }
            }
            return true;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }   
    }

    /**
     * Verifica y cambia el estatus del docente dependiendo de su calificacion
     */
    public function checkStatusStudent($alumno_id, $auditoria)
    {
        try {
            $alumno_old = Alumno::find($alumno_id);
            $alumno = Alumno::find($alumno_id);
            $check = $this->isNotApproved($alumno_id);
            if($check && $alumno->tipo_alumno == 'Regular'){
                $alumno->update([
                    'tipo_alumno' => 'Irregular'
                ]);
            }else if(!$check && $alumno->tipo_alumno == 'Irregular'){
                $alumno->update([
                    'tipo_alumno' => 'Regular'
                ]);
                if($auditoria){
                    self::auditoriaSave($alumno, $alumno_old); /* adutoria log */
                }
            }
            return $alumno;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }   
    }

    /**
     * Verifica si el alumno contiene calificaciones reprobatorias
     */
    public function isNotApproved($alumnoId){
        $calificaciones = $this->obtenerCalificacionesFinales($alumnoId);
        $cont = 0;
        foreach ($calificaciones as $semestre){
            foreach ($semestre as $uac){
                if($uac[0] != null && $uac[0]->parcial >= 4 && $uac[0]->calificacion < 6){
                    $cont ++;
                }
            }
        }
        if($cont >= 2){
            return true;
        }
        return false;
    }

    /**
     * Obtener calificaciones finales
     */
    public function obtenerCalificacionesFinales($alumnoId){

        $alumno = Alumno::find($alumnoId);
        $semestre = $alumno->semestre;

        $calificaciones = CalificacionUac::with('carreraUac.uac')
            ->where('alumno_id', $alumno->usuario_id)
            ->whereHas('carreraUac', function($query) use ($semestre) {
                $query->where('semestre', '<=', $semestre);
            })->where('parcial', '>=', 4)
            ->get();

        $calificaciones = $calificaciones->filter(function($dato){
            return $dato->carreraUac->uac->tipo_uac_id != 10;
        });

        $calificaciones = $calificaciones->groupBy('carreraUac.semestre');

        $calificaciones = $calificaciones->map(function ($item, $key) {
            return $item->sortByDesc('periodo_id')
                ->sortByDesc('calificacion')
                ->sortByDesc('parcial')
                ->sortByDesc('id');
        });

        //Calificaciones agrupadas por semestre y por asignatura
        $calificaciones = $calificaciones->map(function ($item, $key) {
            return $item->groupBy('carreraUac.id');
        });

        return $calificaciones;
    }
    
    /**
     * Obtener submodulos de un módulo
     */
    public function obtenerSubModulos($modulo_id)
    {
        return $sub_modulos = UAC::where('modulo_id', $modulo_id)->get();
    }

    /**
     * Consultar si es materia modulo
     */
    public function isSubModulo($carrera_uac_id)
    {
        $carrera_uac = CarreraUac::find($carrera_uac_id);
        $uac = UAC::find($carrera_uac->uac_id);
        /* comprobar si es materia tipo submodulo */
        if($uac->modulo_id){
            return true; //no es submodulo
        }
        return false;   
    }

    /**
     * Consultar si es materia modulo
     */
    public function isModulo($carrera_uac_id)
    {
        $carrera_uac = CarreraUac::find($carrera_uac_id);
        $uac = UAC::find($carrera_uac->uac_id);
        /* comprobar si es materia tipo modulo */
        if($uac->submodulos->isNotEmpty()){
            return true;
        }
        return false;
    }

    /**
     * Obtener submodulos de un módulo
     */
    public function obtenerCarreraUacSubModulos($sub_modulos, $carrera_id)
    {
        //carrera uacs sub modulos
        $carrera_uac_sub_modulos = [];
        foreach($sub_modulos as $obj){
            $carrera_uac_sub_modulo = CarreraUac::where([
                ['uac_id', $obj->id],
                ['carrera_id', $carrera_id]
            ])->first();
            if($carrera_uac_sub_modulo){
                array_push($carrera_uac_sub_modulos, $carrera_uac_sub_modulo);
            }
        }
        return $carrera_uac_sub_modulos;
    }

    /**
     * Comprobar si la calificacion no contiene de un tipo de evaluacion difente a Normal
     */
    public function comprobarTipoEvalucionCIandEXTandRS($parcial, $carrera_uac_id, $alumno_id, $calificacion_id = null){
        /* si es parcial 1 al 3, comprobar si puede ser calificado en esos parciales */
        if($parcial == 1 || $parcial == 2 || $parcial == 3 || $parcial == 4){
            $calificaciones = CalificacionUac::where([
                ['alumno_id', $alumno_id],
                ['carrera_uac_id', $carrera_uac_id]
            ])->get();
            foreach($calificaciones as $obj){
                if($obj->tipo_calif == 'CI'){
                    return false;
                }else if($obj->tipo_calif == 'EXT'){
                    return false;
                }else if($obj->tipo_calif == 'RS'){
                    if($obj->id != $calificacion_id){
                        return false;
                    }
                }
            }
        }
        return true;

    }

    /**
     * Comprobar si la calificacion es de tipo normal parcial 4
     */
    public function comprobarTipoEvaluacionNormalFinal($alumno_id, $carrera_uac_id){
        /* buscar calificacionesz de la materia en difernetes parciales */
        $calificaciones = CalificacionUac::where([
            ['alumno_id', $alumno_id],
            ['carrera_uac_id', $carrera_uac_id],
        ])->whereIn('parcial', ['1', '2', '3'])->get();
        if(count($calificaciones) < 3){
            return true; //cuando hay faltantes de parciales se puede agregar directo la final
        }else{
            return false; //se debe de llenar por medio de parciales
        }
        return true;
    }

    /**
     * Comprobar si la calificacion es de tipo normal parcial 4
     */
    public function existeCalificacionEspecialFinal($calificacion){
        $calificaciones = CalificacionUac::where([
            ['alumno_id', $calificacion->alumno_id],
            ['carrera_uac_id', $calificacion->carrera_uac_id],
        ])->orderBy('id', 'DESC')->get();
        /* si la ultima calificacion final insertada es diferente a la calificacion de tipo no normal a modificar -> no modificar */
        foreach($calificaciones as $calificacion_final){
            if($calificacion_final->parcial > 4){
                if($calificacion_final->id == $calificacion->id){
                    return true;
                }else{
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Comprobar si la calificacion es modulo
    */
    public function comprobarModulo($carrera_uac_id){
        $carrera_uac = CarreraUac::find($carrera_uac_id);
        $modulo = UAC::find($carrera_uac->uac_id);
        $uacs_submodulo = UAC::where([
            ['modulo_id', $modulo->id]
        ])->get();
        if($uacs_submodulo->isNotempty()){
            return true;
        }else{
            return false;
        }
    }

    /**
     * Comprobar si la calificacion es de submodulo
     */
    public function comprobarSubModulo($carrera_uac_id){
        $carrera_uac = CarreraUac::find($carrera_uac_id);
        $submodulo = UAC::find($carrera_uac->uac_id);
        if($submodulo->modulo_id){
            return true;
        }
        return false;
    }

    /**
     * Calificar y promediagr
     *
     * @return array
     */
    public function tipoCalificacion($tipo_calif, $parcial, $carrera_uac_id, $alumno_id, $calificacion_id = null, $auditoria)
    {
        try {
            if($tipo_calif == "CI"){
                $tipo_calif_insert = "CI"; //calificación intersemestral
            }else if($tipo_calif == "EXT"){
                $tipo_calif_insert = "EXT"; //calificación ext
            }else if($tipo_calif == "RS"){
                $tipo_calif_insert = "RS"; //calificación rs
            }else{
                /* tipo null */
                /* identificar parcial */
                if($parcial == 5){
                    $tipo_calif_insert = "EXT"; //calificación ext
                }else if($parcial == 6 ){
                    $tipo_calif_insert = "CI"; //calificación intersemestral
                }else{
                    /* detectar si es RS */
                    $calificaciones = CalificacionUac::where([
                        ['alumno_id', $alumno_id],
                        ['carrera_uac_id', $carrera_uac_id],
                        ['parcial', 4]
                    ])->get();
                    if(count($calificaciones) > 1){
                        $tipo_calif_insert = "RS"; //calificación rs
                        /* convertir a rs oficial */
                        if($calificacion_id){
                            $calificacion = CalificacionUac::findOrFail($calificacion_id);
                            $calificacion_old = $calificacion;
                            $calificacion->update([
                                'tipo_calif' => $tipo_calif_insert
                            ]);
                            if($auditoria){
                                self::auditoriaSave($calificacion, $calificacion_old); /* adutoria log */
                            }
                        }
                    }else{
                        $tipo_calif_insert = null; //calificación normal
                    }
                }
            }
            return $tipo_calif_insert;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    } 

    /**
     * Redondear califacacion y si es menor a 5, convertirla a 5 o en su defecto, dejarla como esta en caso del periodo que se mande
     */
    public function isMenorACinco($calificacion, $periodo_id, $califHistorica){
        $fecha_permitida_menor_cinco = '2022-01-31';
        $periodo = Periodo::find($periodo_id);
        /* calificacion */
        $calificacion_parse = 0;
        $calificacion ? $calificacion_parse = round($calificacion, 1, PHP_ROUND_HALF_UP) : $calificacion_parse = $calificacion;   
        if($califHistorica || $periodo->fecha_fin <= $fecha_permitida_menor_cinco){
            /* calificacion menor a 5 */
            return $calificacion_parse;
        }else{
            /* nueva forma de calificacion */
            $calificacion_parse < 5 ? $calificacion_parse = 5 : $calificacion_parse = $calificacion_parse;
            return $calificacion_parse;
        }
    }

    /**
     * Redondear califacacion y si es menor a 5, convertirla a 5 o en su defecto, dejarla como esta en caso del periodo que se mande
     */
    public function calificacionFinalPromedio($calificacion, $periodo_id){
        $fecha_redondeo = '2020-07-15';
        $calificacion_periodo = Periodo::find($periodo_id);
        /* nueva forma de calificacion */
        $calificacion < 6 ? $calificacion = 5 : $calificacion = $calificacion;
        if($calificacion_periodo->fecha_fin <= $fecha_redondeo){
            /* calificacion redondeo si es mayor a .5 => 6.6 sube a 7*/
            return $calificacion = round($calificacion);
        }else{
            /* calificacion redondeo decimal, 6.55 sube a 6.6 */
            return $calificacion = round($calificacion, 1, PHP_ROUND_HALF_UP);
        }
    }

}