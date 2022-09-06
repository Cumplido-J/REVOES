<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use App\DocentePlantilla;
use App\DocenteAsignatura;
use App\Plantel;
use App\Docente;
use App\AsignaturaRecursamientoIntersemestral;
use App\Periodo;
use App\UsuarioDocente;

class ValidationsDocente  {

    public static function isAvailableDocenteAsignacion($docente_asignacion_id)
    {
        try {
            $docente_asignacion = DocentePlantilla::findOrFail($docente_asignacion_id);
            if($docente_asignacion->plantilla_estatus == 1){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }
    
    public static function isAvailableDocenteAsignatura($docente_asignatura_id)
    {
        try {
            $periodo_actual = Periodo::orderBy('id', 'DESC')->first();
            $periodo_actual_id = $periodo_actual->id;
            $docente_asignatura = DocenteAsignatura::findOrFail($docente_asignatura_id);
            if($docente_asignatura->estatus == 1 && $periodo_actual_id == $docente_asignatura->periodo_id){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }
    
    public static function isAvailableDocenteAsignaturaOutPeriod($docente_asignatura_id)
    {
        try {
            $docente_asignatura = DocenteAsignatura::findOrFail($docente_asignatura_id);
            if($docente_asignatura->estatus == 1){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isAvailableDocente($docente_id)
    {
        try {
            $docente = Docente::findOrFail($docente_id);
            if($docente->docente_estatus == 1){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isAvailableDocenteFromAsignacion($plantilla_id)
    {
        try {
            $plantilla = DocentePlantilla::findOrFail($plantilla_id);
            $docente = Docente::findOrFail($plantilla->docente_id);
            if($docente->docente_estatus == 1){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }
    
    public static function isAvailableAsignaturaRecursamientoIntersemestral($asignatura_recursamiento_intersemestral_id)
    {
        try {
            $periodo_actual = Periodo::orderBy('id', 'DESC')->first();
            $periodo_actual_id = $periodo_actual->id;
            $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::findOrFail($asignatura_recursamiento_intersemestral_id);
            if($asignatura_recursamiento_intersemestral->estatus == 1 && $periodo_actual_id == $asignatura_recursamiento_intersemestral->periodo_id){
                /* activo */
                return true;
            }else{
                /* comprobar si es es proceso para historico */
                $permisos = HelperPermisoAlcance::getPermisos();
                if(in_array('Plantel', $permisos)){ //evaluar nivel de alcance
                    return false;
                }else{
                    return true;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isAvailableAsignaturaRecursamientoIntersemestralByEstatus($asignatura_recursamiento_intersemestral_id)
    {
        try {
            $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::findOrFail($asignatura_recursamiento_intersemestral_id);
            if($asignatura_recursamiento_intersemestral->estatus == 1){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }
    
    public static function isDocenteMyUacIntersemestral($asignatura_intersemestral, $user)
    {
        try {
            $usuario_docente = UsuarioDocente::where('usuario_id', $user->id)->first();
            /* asignaciones docente */
            $plantillas_docente = DocentePlantilla::where('docente_id', $usuario_docente->docente_id)->get();
            $find = false;
            foreach($plantillas_docente as $plantilla){
                if($plantilla->id == $asignatura_intersemestral->plantilla_docente_id){
                    $find = true;
                }
            }
            return $find;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isAvailableAsignaturaRecursamientoSemestralByPeriod($grupo_recursamiento_semestral)
    {
        try {
            $periodo_actual = Periodo::orderBy('id', 'DESC')->first();
            $periodo_actual_id = $periodo_actual->id;
            if($periodo_actual_id == $grupo_recursamiento_semestral->periodo_id){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isAvailableAsignaturaRecursamientoSemestralByEstatus($grupo_recursamiento_semestral)
    {
        try {
            if(1 == $grupo_recursamiento_semestral->estatus){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isAvailableExtraordinarioByPeriod($extraordinario)
    {
        try {
            $periodo_actual = Periodo::orderBy('id', 'DESC')->first();
            $periodo_actual_id = $periodo_actual->id;
            if($periodo_actual_id == $extraordinario->periodo_id){
                /* activo */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isDocenteMyUacSemestral($asignatura_intersemestral, $user)
    {
        try {
            $usuario_docente = UsuarioDocente::where('usuario_id', $user->id)->first();
            /* asignaciones docente */
            $plantillas_docente = DocentePlantilla::where('docente_id', $usuario_docente->docente_id)->get();
            $find = false;
            foreach($plantillas_docente as $plantilla){
                if($plantilla->id == $asignatura_intersemestral->plantilla_docente_id){
                    $find = true;
                }
            }
            return $find;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public static function isDocenteMyUacExtraordinario($extraordinario, $user)
    {
        try {
            $usuario_docente = UsuarioDocente::where('usuario_id', $user->id)->first();
            /* asignaciones docente */
            $plantillas_docente = DocentePlantilla::where('docente_id', $usuario_docente->docente_id)->get();
            $find = false;
            foreach($plantillas_docente as $plantilla){
                if($plantilla->id == $extraordinario->plantilla_docente_id){
                    $find = true;
                }
            }
            return $find;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }
}
