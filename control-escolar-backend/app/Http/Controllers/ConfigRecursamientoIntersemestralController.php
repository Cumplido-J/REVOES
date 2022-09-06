<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreConfigRecursamientoIntersemestralRequest;
use Illuminate\Support\Facades\DB;
use App\ConfigRecursamientoIntersemestral;
use App\Plantel;
use App\Periodo;
use App\Docente;
use Carbon\Carbon;
use ResponseJson;
use HelperPermisoAlcance;
use App\Traits\AuditoriaLogHelper;
use Sisec;

class ConfigRecursamientoIntersemestralController extends Controller
{
    use AuditoriaLogHelper;
    
    public function store(StoreConfigRecursamientoIntersemestralRequest $request)
    {
        try {
            DB::beginTransaction();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $checkRequest = 0;
            $isUpdate = false;
            $plantel_cct = null;
            /* recorrer json de fechas ordinarias */
            if($request["recursamiento"]){
                foreach($request["recursamiento"] as $obj){
                    $plantel_cct = $obj["plantel_cct"];
                    $plantel = Plantel::where('cct', $obj["plantel_cct"])->first();
                    if(!HelperPermisoAlcance::evaluarRolPermisosAlcance($plantel->id)){
                        return ResponseJson::msg('No tiene permisos para continuar', 400);   
                    }
                    if(array_key_exists('id', $obj)){
                        $isUpdate = true;
                    }else{
                        $isUpdate = false;
                    }
                    if($isUpdate){
                        $confi_recuperacion_parcial = ConfigRecursamientoIntersemestral::where('id', $obj["id"])->first();
                        if($confi_recuperacion_parcial){
                            //consultar si es valor a eliminar
                            if(array_key_exists('parcial', $obj)){
                                //eliminar
                                $confi_recuperacion_parcial = $this->destroy($obj["id"]);
                            }
                            //consultar si ya se encuentra este valor
                            $isExistConfig = $this->isExistConfigRecursamientoIntersemestral($plantel, $periodo_actual_id);
                            if($isExistConfig){
                                if($isExistConfig->id == $confi_recuperacion_parcial->id){
                                    $store = $this->updateConfigRecursamientoIntersemestral($obj["id"], $obj["fecha_inicio"], $obj["fecha_final"], $plantel, $periodo_actual_id);
                                }
                            }
                        }
                    }else{
                        //nueva config
                        $isExistConfig = $this->isExistConfigRecursamientoIntersemestral($plantel, $periodo_actual_id); //consultar valores
                        if(!$isExistConfig){
                            //no existen configuraciones
                            $store = $this->storeConfigRecursamientoIntersemestral($obj["fecha_inicio"], $obj["fecha_final"], $plantel, $periodo_actual_id);
                        }else{
                            return ResponseJson::msg("Ya se encuentra una fecha activa para recursamientos intersemestrales", 400);
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
                $plantel = Plantel::where('cct' , $plantel_cct)->with([
                    'recursamientoIntersemestrales' => function($query) use ($periodo_actual_id){
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
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        } 
    }

    public function updateConfigRecursamientoIntersemestral($id, $fecha_inicio, $fecha_final, $plantel, $periodo_actual_id)
    {
        try {
            DB::beginTransaction();
            $config_recuperacion_parcial = ConfigRecursamientoIntersemestral::where('id', $id)->first();
            $config_recuperacion_parcial->update([
                    'fecha_inicio' => $fecha_inicio,
                    'fecha_final' => $fecha_final,
                    'plantel_id' => $plantel->id,
                    'periodo_id' => $periodo_actual_id
            ]);
            $this->auditoriaSave($config_recuperacion_parcial); /* adutoria log */ 
            DB::commit();
            return $config_recuperacion_parcial;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        }
    }

    public function storeConfigRecursamientoIntersemestral($fecha_inicio, $fecha_final, $plantel, $periodo_actual_id)
    {
        try {
            DB::beginTransaction();
            $config_recuperacion_parcial = ConfigRecursamientoIntersemestral::create([
                    'fecha_inicio' => $fecha_inicio,
                    'fecha_final' => $fecha_final,
                    'plantel_id' => $plantel->id,
                    'periodo_id' => $periodo_actual_id
            ]);
            $this->auditoriaSave($config_recuperacion_parcial); /* adutoria log */ 
            DB::commit();
            return $config_recuperacion_parcial;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        }
    }

    public function destroy($id)
    {
        try {        
            $evaluacion_ordinaria = ConfigRecursamientoIntersemestral::findOrFail($id);
            $evaluacion_ordinaria->delete($id);
            return ResponseJson::msg('Dato eliminado correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración del recursamiento intersemestral', 400);
        } 
    }

    public function showWithPlantel($cct)
    {
        try {
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $plantel = Plantel::where('cct' , $cct)->with([
                'recursamientoIntersemestrales' => function($query) use ($periodo_actual_id){
                    $query->where('periodo_id', $periodo_actual_id);
                },
            ])->get();
            if($plantel->isNotEmpty()){
                return ResponseJson::data($plantel, 200);
            }else{
               return ResponseJson::msg("No se encontro el recurso solicitado", 400); 
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración del recursamiento intersemestral', 400);
        } 
    }

    public function isExistConfigRecursamientoIntersemestral($plantel, $periodo_actual_id)
    {
        try {
            $isExistConfig = ConfigRecursamientoIntersemestral::where([
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo_actual_id,
            ])->first();
            return $isExistConfig;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración del recursamiento intersemestral', 400);
        } 
    }

}
