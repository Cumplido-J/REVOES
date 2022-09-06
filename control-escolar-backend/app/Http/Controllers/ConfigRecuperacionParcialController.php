<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreConfigRecuperacionParcialRequest;
use Illuminate\Support\Facades\DB;
use App\ConfigRecuperacionParcial;
use App\Plantel;
use App\Periodo;
use App\Docente;
use Carbon\Carbon;
use ResponseJson;
use HelperPermisoAlcance;
use App\Traits\AuditoriaLogHelper;
use Sisec;

class ConfigRecuperacionParcialController extends Controller
{
    use AuditoriaLogHelper;
    
    public function store(StoreConfigRecuperacionParcialRequest $request)
    {
        try {
            DB::beginTransaction();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $checkRequest = 0;
            $isUpdate = false;
            $plantel_cct = null;
            /* recorrer json de fechas ordinarias */
            if($request["recuperacion"]){
                foreach($request["recuperacion"] as $obj){
                    $plantel_cct = $obj["plantel_cct"];
                    $plantel = Plantel::where('cct', $obj["plantel_cct"])->first();
                    if(!HelperPermisoAlcance::evaluarRolPermisosAlcance($plantel->id)){
                        return ResponseJson::msg('No tiene permisos para continuar', 400);   
                    }
                    if(array_key_exists('id', $obj)){
                        //return "hay id => editar";
                        $isUpdate = true;
                    }else{
                        //return "no id => crear";
                        $isUpdate = false;
                    }
                    //definir si es edición o nuevo valor
                    if($isUpdate){
                        $confi_recuperacion_parcial = ConfigRecuperacionParcial::where('id', $obj["id"])->first();
                        if($confi_recuperacion_parcial){
                            //consultar si es valor a eliminar
                            if($obj["parcial"] == 0){
                                //eliminar
                                $confi_recuperacion_parcial = $this->destroy($obj["id"]);
                            }
                            //consultar si ya se encuentra este valor
                            $isExistConfig = $this->isExistConfigRecuperacionParcial($obj["parcial"], $plantel, $periodo_actual_id);
                            if($isExistConfig){
                                //consultar si cambio de valores
                                if($isExistConfig->id == $confi_recuperacion_parcial->id){
                                    //return "update";
                                }else{
                                    //return "VALORES IGUALES";
                                }
                            }
                        }
                    }else{
                        //consultar valores
                        $isExistConfig = $this->isExistConfigRecuperacionParcial($obj["parcial"], $plantel, $periodo_actual_id);
                        if(!$isExistConfig){
                            //return "AGREGAR";
                            $store = $this->storeConfigRecuperacionParcial($obj["parcial"], $plantel, $periodo_actual_id);
                        }else{
                            return ResponseJson::msg("Ya se encuentra el parcial ".$obj["parcial"]." activo", 400);
                        }
                    }
                }
            }else{
                //no hay ordinarios/extraordinarios
                throw new ModelNotFoundException();
            }
            //retornar la información solcitiada
            if($plantel_cct != null){
                //si encontro plantel
                $periodo_id = $periodo_actual_id;
                $plantel = Plantel::where('cct' , $plantel_cct)->with([
                    'recuperacionParciales' => function($query) use ($periodo_actual_id){
                                $query->where('periodo_id', $periodo_actual_id);
                    }
                ])->get();
                DB::commit();
                return ResponseJson::data($plantel, 200);
            }else{
                throw new ModelNotFoundException();
            }
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la recuperación por parcial', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la recuperación por parcial', 400);
        } 
    }

    public function storeConfigRecuperacionParcial($parcial, $plantel, $periodo_actual_id)
    {
        try {
            DB::beginTransaction();
            $config_recuperacion_parcial = ConfigRecuperacionParcial::create([
                'parcial' => $parcial,
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo_actual_id
            ]);
            $this->auditoriaSave($config_recuperacion_parcial); /* adutoria log */ 
            DB::commit();
            return $config_recuperacion_parcial;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la recuperación por parcial', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la recuperación por parcial', 400);
        } 
    }

    public function destroy($id)
    {
        try {        
            $evaluacion_ordinaria = ConfigRecuperacionParcial::findOrFail($id);
            $evaluacion_ordinaria->delete($id);
            return ResponseJson::msg('Dato eliminado correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración de la recuperación por parcial', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración de la recuperación por parcial', 400);
        } 
    }

    public function showWithPlantel($cct)
    {
        try {
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $plantel = Plantel::where('cct' , $cct)->with([
                'recuperacionParciales' => function($query) use ($periodo_actual_id){
                            $query->where('periodo_id', $periodo_actual_id);
                },
            ])->get();
            if($plantel->isNotEmpty()){
                return ResponseJson::data($plantel, 200);
            }else{
               return ResponseJson::msg("No se encontro el recurso solicitado", 400); 
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración de la recuperación por parcial', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración de la recuperación por parcial', 400);
        } 
    }

    public function isExistConfigRecuperacionParcial($parcial, $plantel, $periodo_actual_id)
    {
        try {
            $isExistConfig = ConfigRecuperacionParcial::where([
                'parcial' => $parcial,
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo_actual_id,
            ])->first();
            return $isExistConfig;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración de la recuperación por parcial', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración de la recuperación por parcial', 400);
        } 
    }

}
