<?php

namespace App\Helpers;

use App\Traits\AuditoriaLogHelper;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\ConfigRecursamientoIntersemestral;
use App\ConfigEvaluacionOrdinariaParcial;
use App\ConfigRecuperacionParcial;
use App\ConfigCalificarHistorico;
use App\ConfigRecursamientoSemestral;
use App\ConfigEvaluacionExtraordionaria;
use App\DocenteAsignatura;
use Illuminate\Support\Str;
use Sisec;

class HelperFechasEvaluacion {

    use AuditoriaLogHelper;

    public static function isParcialAvailable($parcial, $plantel_id, $periodo_actual_id)
    {
        try {
            $fecha_actual = Carbon::now()->toDateString();
            $ordianarios_config = ConfigEvaluacionOrdinariaParcial::where([
                ['periodo_id' , $periodo_actual_id],
                ['plantel_id' , $plantel_id],
                ['parcial' , $parcial]
            ])->get();
            foreach($ordianarios_config as $obj){
                if($fecha_actual >= $obj->fecha_inicio && $fecha_actual <= $obj->fecha_final){
                    return true;
                }else{
                    return false;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } 
    }

    public static function isCurrentPeriod($periodo_actual_id, $docente_asignatura_id)
    {
        try {
            $docente_asignatura = DocenteAsignatura::where([
                ['id', $docente_asignatura_id],
                ['periodo_id', $periodo_actual_id]
            ])->get();
            if($docente_asignatura->isNotEmpty()){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public static function isAvailableRecuperacionParcial($parcial, $plantel_id)
    {
        try {
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $config_recuperacion = ConfigRecuperacionParcial::where([
                ['periodo_id' , $periodo_actual_id],
                ['plantel_id' , $plantel_id],
                ['parcial' , $parcial]
            ])->first();
           if($config_recuperacion){
               return true;
           }else{
               return false;
           }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } 
    }

    public static function isDateConfigAvailable($parcial, $plantel_id, $periodo_actual_id)
    {
        try {
            $fecha_actual = Carbon::now()->toDateString();
            $ordianarios_config = ConfigEvaluacionOrdinariaParcial::where([
                ['periodo_id' , $periodo_actual_id],
                ['plantel_id' , $plantel_id]
            ])->get();
            foreach($ordianarios_config as $obj){
                if($fecha_actual >= $obj->fecha_inicio && $fecha_actual <= $obj->fecha_final){
                    if($parcial < $obj->parcial){//si el parcial activo es menor al que quiero cargar calificacion, error
                        return true;
                    }else{
                        return false;
                    }
                }
            }
            //ninguna fecha activa
            return false;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } 
    }

    public static function isAvailableDateIntersemestral($plantel_id)
    {
        try {
            $fecha_actual = Carbon::now()->toDateString();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $intersemestral_config = ConfigRecursamientoIntersemestral::where([
                ['periodo_id' , $periodo_actual_id],
                ['plantel_id' , $plantel_id],
            ])->get();
            foreach($intersemestral_config as $obj){
                if($fecha_actual >= $obj->fecha_inicio && $fecha_actual <= $obj->fecha_final){
                    return true;
                }else{
                    return false;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public static function isAvailableDateSemestral($plantel_id)
    {
        try {
            $fecha_actual = Carbon::now()->toDateString();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $semestral = ConfigRecursamientoSemestral::where([
                ['periodo_id' , $periodo_actual_id],
                ['plantel_id' , $plantel_id],
            ])->get();
            foreach($semestral as $obj){
                if($fecha_actual >= $obj->fecha_inicio && $fecha_actual <= $obj->fecha_final){
                    return true;
                }else{
                    return false;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public static function isAvailableDateExtraordinario($plantel_id)
    {
        try {
            $fecha_actual = Carbon::now()->toDateString();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $semestral = ConfigEvaluacionExtraordionaria::where([
                ['periodo_id' , $periodo_actual_id],
                ['plantel_id' , $plantel_id],
            ])->get();
            foreach($semestral as $obj){
                if($fecha_actual >= $obj->fecha_inicio && $fecha_actual <= $obj->fecha_final){
                    return true;
                }else{
                    return false;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public static function isConfigHistoricosAvailable($plantel_id)
    {
        try {
            $fecha_actual = Carbon::now()->toDateString();
            $periodo_actual = Sisec::periodoActual();
            $historico = ConfigCalificarHistorico::where([
                ['periodo_id' , $periodo_actual->id],
                ['plantel_id' , $plantel_id]
            ])->get();
            foreach($historico as $obj){
                if($fecha_actual >= $obj->fecha_inicio && $fecha_actual <= $obj->fecha_final){
                    return true;
                }else{
                    return false;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } 
    }
}
