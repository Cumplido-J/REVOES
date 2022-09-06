<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreConfigCalificarHistoricoRequest;
use Illuminate\Support\Facades\DB;
use App\ConfigCalificarHistorico;
use App\Plantel;
use App\Periodo;
use App\Docente;
use Carbon\Carbon;
use ResponseJson;
use HelperPermisoAlcance;
use App\Traits\AuditoriaLogHelper;
use Sisec;

class ConfigCalificarHistoricoController extends Controller
{
    use AuditoriaLogHelper;
    
    public function store(StoreConfigCalificarHistoricoRequest $request)
    {
        try {
            DB::beginTransaction();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $isUpdate = false;
            $plantel_cct = null;
            /* recorrer json de fechas ordinarias */
            if($request["historico"]){
                foreach($request["historico"] as $obj){
                    $plantel_cct = $obj["plantel_cct"];
                    $plantel = Plantel::where('cct', $obj["plantel_cct"])->first();
                    if(!HelperPermisoAlcance::evaluarRolPermisosAlcance($plantel->id)){
                        return ResponseJson::msg('No tiene permisos para continuar', 400);   
                    }
                    if(array_key_exists('id', $obj)){
                        $isUpdate = true;
                        if($isUpdate && array_key_exists('fecha', $obj)){
                            if($obj["fecha"] == ""){
                                //eliminar
                                $config_calificar_historico = $this->destroy($obj["id"]);
                            }
                        }
                    }else{
                        $isUpdate = false;
                    }
                    if($isUpdate){
                        $config_calificar_historico = ConfigCalificarHistorico::where('id', $obj["id"])->first();
                        if($config_calificar_historico){
                           /* modificar fecha */
                           $update_config = $this->updateConfigCalificarHistorico($config_calificar_historico, $obj["fecha_inicio"], $obj["fecha_final"], $plantel, $periodo_actual_id);
                        }
                    }else{
                        //consultar valores
                        $isExistConfig = $this->isExistConfigCalificarHistorico($plantel, $periodo_actual_id);
                        if(!$isExistConfig){
                            $store = $this->storeConfigCalificarHistorico($obj["fecha_inicio"], $obj["fecha_final"], $plantel, $periodo_actual_id);
                        }else{
                            return ResponseJson::msg("Ya se encuentra activa una fecha para modificaciones de calificaciones historicas", 400);
                        }
                    }
                }
            }else{
                throw new ModelNotFoundException();
            }
            //retornar la información solcitiada
            if($plantel_cct != null){
                //si encontro plantel
                $periodo_id = $periodo_actual_id;
                $plantel = Plantel::where('cct' , $plantel_cct)->with([
                    'configCalificarHistorico' => function($query) use ($periodo_actual_id){
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
            return ResponseJson::msg('No fue posible crear la configuración calificar historicos', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración calificar historicos', 400);
        } 
    }

    public function destroy($id)
    {
        try {        
            $config_historicos = ConfigCalificarHistorico::findOrFail($id);
            $config_historicos->delete($id);
            return ResponseJson::msg('Dato eliminado correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración calificar historicos', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración calificar historicos', 400);
        } 
    }

    public function showWithPlantel($cct)
    {
        try {
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $plantel = Plantel::where('cct' , $cct)->with([
                'configCalificarHistorico' => function($query) use ($periodo_actual_id){
                            $query->where('periodo_id', $periodo_actual_id);
                },
            ])->get();
            if($plantel->isNotEmpty()){
                return ResponseJson::data($plantel, 200);
            }else{
               return ResponseJson::msg("No se encontro el recurso solicitado", 400); 
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración calificar historicos', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración calificar historicos', 400);
        } 
    }

    public function isExistConfigCalificarHistorico($plantel, $periodo_actual_id)
    {
        try {
            $isExistConfig = ConfigCalificarHistorico::where([
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo_actual_id,
            ])->first();
            return $isExistConfig;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración calificar historicos', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración calificar historicos', 400);
        } 
    }

    public function updateConfigCalificarHistorico($config_calificar_historico, $fecha_inicio, $fecha_final, $plantel, $periodo_actual_id)
    {
        try {
            DB::beginTransaction();
            $config_calificar_historico->update([
                    'fecha_inicio' => $fecha_inicio,
                    'fecha_final' => $fecha_final,
                    'plantel_id' => $plantel->id,
                    'periodo_id' => $periodo_actual_id
            ]);
            $this->auditoriaSave($config_calificar_historico); /* adutoria log */ 
            DB::commit();
            return $config_calificar_historico;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        }
    }

    public function storeConfigCalificarHistorico($fecha_inicio, $fecha_final, $plantel, $periodo_actual_id)
    {
        try {
            DB::beginTransaction();
            $config_calificar_historico = ConfigCalificarHistorico::create([
                    'fecha_inicio' => $fecha_inicio,
                    'fecha_final' => $fecha_final,
                    'plantel_id' => $plantel->id,
                    'periodo_id' => $periodo_actual_id
            ]);
            $this->auditoriaSave($config_calificar_historico); /* adutoria log */ 
            DB::commit();
            return $config_calificar_historico;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración del recursamiento intersemestral', 400);
        }
    }

}
