<?php

namespace App\Helpers;

use App\Traits\AuditoriaLogHelper;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Plantel;
use Illuminate\Support\Str;

class HelperPermisoAlcance {

    public static function isRolControlEscolar()
    {
        try {
            $user = auth()->user();
            $roles = $user->getRoleNames()->toArray();
            $roles_control_escolar = [
                "ROLE_DEV",
                "ROLE_DIRECCION",
                "ROLE_SOPORTE_TECNICO",
                "ROLE_CONTROL_ESCOLAR_ESTATAL",
                "ROLE_CONTROL_ESCOLAR_PLANTEL",
                "ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC",
                "ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC",
                "Permiso_CTRL-ESCOLAR_Y_CERTIFICACION"
            ];
            //comprobar si cuenta con el rol
            foreach($roles_control_escolar as $rol){
                if(in_array($rol, $roles)){
                    return true;
                }
            }
            return false;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("No tiene permisos para continuar", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } 
    }

    public static function getPermisos()
    {
        try{
            /* alcance y permisos */
            $user = auth()->user();
            $permisos = $user->getAllPermissions()->pluck('name')->toArray();
            return $permisos;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } 
    }

    public static function getPlantelAlcance()
    {
        try{
            /* alcance y permisos */
            $user = auth()->user();
            $alcance = DB::table('administrador_alcance_usuario')->where('usuario_id', $user->id)->get();
            $plantel_alcance = [];
            foreach ($alcance as $a){
                $detalle = DB::table('detalle_alcance')->where('catalcanceusuario_id', $a->catalcance_id)->first();
                if($detalle->plantel_id != null){
                    array_push($plantel_alcance, $detalle->plantel_id); //estado alcance
                }
            }
            return $plantel_alcance;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } 
    }

    public static function getPermisosAlcanceEstado()
    {
        try{
             /* alcance y permisos */
            $user = auth()->user();
            $alcance = DB::table('administrador_alcance_usuario')->where('usuario_id', $user->id)->get();
            $estado_alcance = [];
            foreach ($alcance as $a){
                $detalle = DB::table('detalle_alcance')->where('catalcanceusuario_id', $a->catalcance_id)->first();
                if($detalle->estado_id != null){
                    array_push($estado_alcance, $detalle->estado_id); //estado alcance
                }
            }
            return $estado_alcance;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } 
    }

    public static function getPermisosAlcancePlantel()
    {
        try{
             /* alcance y permisos */
            $user = auth()->user();
            $permisos = HelperPermisoAlcance::getPermisos();
            $planteles_alacance = HelperPermisoAlcance::getPlantelAlcance();
            $estado_alcance = HelperPermisoAlcance::getPermisosAlcanceEstado();
            if(in_array('Estatal', $permisos)){
                //llenar planteles_alacance alcance estatal
                if(!$planteles_alacance != null && $estado_alcance != null){
                    $getPlantel = Plantel::whereHas('municipio', function($query) use($estado_alcance){
                        $query->whereIn('estado_id', $estado_alcance);
                    })->get();
                    foreach($getPlantel as $obj){
                        array_push($planteles_alacance, $obj->id); //plantel alcance
                    }
                }
            }
            return $planteles_alacance;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No tiene permisos para continuar', 400);
        } 
    }

    public static function evaluarRolPermisosAlcance($plantel_id)
    {
        try {
            //consultar rol
            if(!HelperPermisoAlcance::isRolControlEscolar()){
                //return false;  
            }
            //comprobar alcance
            $permisos = HelperPermisoAlcance::getPermisos();
            $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
            //alcance plantel
            if(in_array('Plantel', $permisos)){
                if(!in_array($plantel_id, $planteles_alacance)){
                    return false;
                }
            }else if(in_array('Estatal', $permisos)){
                if(!in_array($plantel_id, $planteles_alacance)){
                    return false;
                }
            }
            return true;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        }
    }

}
