<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreConfigEvaluacionOrdinariaRequest;
use Illuminate\Support\Facades\DB;
use App\ConfigEvaluacionOrdinariaParcial;
use App\ConfigEvaluacionExtraordionaria;
use App\Plantel;
use App\Periodo;
use App\Docente;
use Carbon\Carbon;
use ResponseJson;
use HelperPermisoAlcance;
use App\Traits\AuditoriaLogHelper;
use Sisec;

class ConfigEvaluacionOrdinariaParcialController extends Controller
{
    use AuditoriaLogHelper;
   
    public function store(StoreConfigEvaluacionOrdinariaRequest $request)
    {
        try {
            DB::beginTransaction();
            $periodo_actual = Sisec::periodoActual();
            $checkRequest = 0;
            if($periodo_actual){
                //periodo activo
                $isUpdate = false;
                $plantel_cct = null;
                /* recorrer json de fechas ordinarias */
                if($request["ordinarios"]){
                    foreach($request["ordinarios"] as $obj){
                        $plantel = Plantel::where('cct', $obj["plantel_cct"])->first();
                        if(!HelperPermisoAlcance::evaluarRolPermisosAlcance($plantel->id)){
                            return ResponseJson::msg('No tiene permisos para continuar', 400);   
                        }
                        $obj["id"] != null ? $isExistId = $obj["id"] : $isExistId = $obj["id"]; //hay id => update or destroy
                        //eliminar fecha
                        if($isExistId && array_key_exists('fecha', $obj)){
                            if($obj["fecha"] == ""){
                                $this->destroy($isExistId);
                                $plantel_cct = $obj["plantel_cct"];
                            }
                        }else{
                            $if_available_date = $this->isAvailableDateOrdinaria($periodo_actual, $plantel, $obj["fecha_inicio"], $obj["fecha_final"], $isExistId);
                            if(!$if_available_date){
                                /* si existe id se modifica */
                                if(!$isExistId){
                                    $isExistConfig = $this->isExistConfigOrdinariaInPlantel($obj["parcial"], $plantel, $periodo_actual);
                                    if(!$isExistConfig){
                                        $plantel_cct = $obj["plantel_cct"];
                                        $create_evaluacion_ordinaria = $this->storeEvaluacionOrdinaria($obj["parcial"], $periodo_actual, $plantel, $obj["fecha_inicio"], $obj["fecha_final"]);
                                    }else{
                                        return ResponseJson::error('No fue posible crear la configuración de la evaluación ordinaria', 400, 'El plantel ya cuenta con una configuración para el parcial '.$obj["parcial"]); 
                                    }
                                }else{
                                    $update_evaluacion_ordinaria = $this->updateEvaluacionOrdinaria($obj["parcial"], $periodo_actual, $plantel, $obj["fecha_inicio"], $obj["fecha_final"], $obj["id"]);
                                    $plantel_cct = $obj["plantel_cct"];
                                    $isUpdate = true;
                                }
                            }else{
                                return ResponseJson::error('No fue posible crear la configuración de la evaluación ordinaria', 400, 'La fecha que intenta ingresar '.$obj["fecha_inicio"].' - '.$obj["fecha_final"].' del parcial '.$obj["parcial"].', ya se encuentra en el rango de fecha en el parcial '.$if_available_date->parcial); 
                            }
                        }
                    }
                }else{
                    /* bad request */
                    $checkRequest++;
                }
                /* comprobar si ya existe configuración extraordinaria */
                if($request["extraordinarios"]){
                    foreach($request["extraordinarios"] as $obj){
                        $plantel = Plantel::where('cct', $obj["plantel_cct"])->first();
                        $obj["id"] != null ? $isExistId = $obj["id"] : $isExistId = $obj["id"]; //hay id => update or destroy
                        /* si existe id se modifica */
                        //eliminar fecha
                        if($isExistId && array_key_exists('fecha', $obj)){
                            if($obj["fecha"] == ""){
                                $this->destroy($isExistId, "extraordinarios");
                                $plantel_cct = $obj["plantel_cct"];
                            }
                        }else{
                            if(!$isExistId){
                                $isExistConfig = $this->isExistConfigExtraordinariaInPlantel($periodo_actual, $plantel);
                                if(!$isExistConfig){
                                    $create_evaluacion_extraordinaria = $this->storeEvaluacionExtraordinaria($periodo_actual, $plantel, $obj["fecha_inicio"], $obj["fecha_final"]);
                                    $plantel_cct = $obj["plantel_cct"];
                                }else{
                                     return ResponseJson::error('No fue posible crear la configuración de la evaluación extraordinaria', 400, 'El plantel ya cuenta con una configuración para el periodo '.$periodo_actual->nombre);
                                }
                            }else{
                                $update_evaluacion_extraordinaria = $this->updateEvaluacionExtraordinaria($periodo_actual, $plantel, $obj["fecha_inicio"], $obj["fecha_final"], $obj["id"]);
                                $plantel_cct = $obj["plantel_cct"];
                                $isUpdate = true;
                            }
                        }
                    }
                }else{
                    /* bad request */
                    $checkRequest++;
                }
            }else{
                return ResponseJson::error('No fue posible crear la configuración de la evaluación ordinaria', 400, 'No se encuentran periodos activos');
            }
            /* evaluar request */
            if($checkRequest >= 2){
                //no hay ordinarios/extraordinarios
                throw new ModelNotFoundException();
            }
            //retornar la información solcitiada
            if($plantel_cct != null){
                //si encontro plantel
                $periodo_id = $periodo_actual->id;
                $plantel = Plantel::where('cct' , $plantel_cct)->with([
                    'evaluacionesOrdinarias' => function($query) use ($periodo_id){
                                $query->where('periodo_id', $periodo_id);
                    },
                    'evaluacionesExtraordinarias' => function($query) use ($periodo_id){
                                $query->where('periodo_id', $periodo_id);
                    },
                ])->get();
                DB::commit();
                return ResponseJson::data($plantel, 200);
            }else{
                throw new ModelNotFoundException();
            }
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function isAvailableDateOrdinaria($periodo_actual, $plantel, $fecha_inicio, $fecha_final, $id = null)
    {
        try {
            //fecha inicio
            $evaluacion_ordinaria = ConfigEvaluacionOrdinariaParcial::where([
                ['plantel_id', $plantel->id],
                ['periodo_id', $periodo_actual->id]
            ])->whereBetween('fecha_inicio', [$fecha_inicio, $fecha_final])->first();
            if(!$evaluacion_ordinaria){
                //fecha fin
                $evaluacion_ordinaria = ConfigEvaluacionOrdinariaParcial::where([
                    ['plantel_id', $plantel->id],
                    ['periodo_id', $periodo_actual->id]
                ])->whereBetween('fecha_final', [$fecha_inicio, $fecha_final])->first();
            }
            if($id){ //si hay id en la solitud, consultar si la fecha le pertenece al valor con su id
                if($evaluacion_ordinaria){
                    //si encontro valor
                    if($id == $evaluacion_ordinaria->id){
                        //rango fechas
                        return false; //permitir fecha
                    }
                }
            }
            return $evaluacion_ordinaria;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Fecha no disponible', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Fecha no disponible', 400);
        } 
    }

    public function storeEvaluacionExtraordinaria($periodo, $plantel, $fecha_inicio, $fecha_final)
    {
        try {
            DB::beginTransaction();
            $evaluacion_extraordinaria = ConfigEvaluacionExtraordionaria::create([
                'fecha_inicio' => $fecha_inicio,
                'fecha_final' => $fecha_final,
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo->id,
                'estatus' => 1
            ]);
            $this->auditoriaSave($evaluacion_extraordinaria); /* adutoria log */ 
            DB::commit();
            return $evaluacion_extraordinaria;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function updateEvaluacionExtraordinaria($periodo, $plantel, $fecha_inicio, $fecha_final, $id)
    {
        try {
            DB::beginTransaction();
            $evaluacion_extraordinaria_old = ConfigEvaluacionExtraordionaria::findOrFail($id);
            $evaluacion_extraordinaria = ConfigEvaluacionExtraordionaria::findOrFail($id);
            $evaluacion_extraordinaria->update([
                'fecha_inicio' => $fecha_inicio,
                'fecha_final' => $fecha_final,
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo->id,
                'estatus' => 2
            ]);
            $this->auditoriaSave($evaluacion_extraordinaria, $evaluacion_extraordinaria_old); /* adutoria log */ 
            DB::commit();
            return $evaluacion_extraordinaria;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function storeEvaluacionOrdinaria($parcial, $periodo, $plantel, $fecha_inicio, $fecha_final)
    {
        try {
            DB::beginTransaction();
            $evaluacion_ordinaria = ConfigEvaluacionOrdinariaParcial::create([
                    'parcial' => $parcial,
                    'fecha_inicio' => $fecha_inicio,
                    'fecha_final' => $fecha_final,
                    'plantel_id' => $plantel->id,
                    'periodo_id' => $periodo->id,
                    'estatus' => 1
            ]);
            $this->auditoriaSave($evaluacion_ordinaria); /* adutoria log */ 
            DB::commit();
            return $evaluacion_ordinaria;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function updateEvaluacionOrdinaria($parcial, $periodo, $plantel, $fecha_inicio, $fecha_final, $id)
    {
        try {
            DB::beginTransaction();
            $evaluacion_ordinaria_old = ConfigEvaluacionOrdinariaParcial::findOrFail($id);
            $evaluacion_ordinaria = ConfigEvaluacionOrdinariaParcial::findOrFail($id);
            $evaluacion_ordinaria->update([
                    'parcial' => $parcial,
                    'fecha_inicio' => $fecha_inicio,
                    'fecha_final' => $fecha_final,
                    'plantel_id' => $plantel->id,
                    'periodo_id' => $periodo->id,
                    'estatus' => 2
            ]);
            $this->auditoriaSave($evaluacion_ordinaria, $evaluacion_ordinaria_old); /* adutoria log */ 
            DB::commit();
            return $evaluacion_ordinaria;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function show($id)
    {
        try {
            $evaluacion_ordinaria = EvaluacionOrdinaria::where('id', $id)->with('periodo')->get();
            return ResponseJson::data($evaluacion_ordinaria, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function update(StoreConfigEvaluacionOrdinariaRequest $request, $id)
    {
        try{
            $evaluacion_ordinaria = EvaluacionOrdinaria::findOrFail($id);
            $evaluacion_ordinaria->update([
                'fecha_inicio' => $request->fecha_inicio,
                'fecha_final' => $request->fecha_final,
                'periodo_id' => $request->periodo_id
            ]);
            return ResponseJson::msg('Datos de la configuración de la evaluación ordinaria modificados correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::error('No fue posible modificar los datos de la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible modificar los datos de la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function destroy($id, $action = null)
    {
        try {
            if($action == "extraordinarios"){
                $evaluacion_extraordinaria = ConfigEvaluacionExtraordionaria::findOrFail($id);
                $evaluacion_extraordinaria->delete($id);
            }else{
                $evaluacion_ordinaria = ConfigEvaluacionOrdinariaParcial::findOrFail($id);
                $evaluacion_ordinaria->delete($id);
            }
            return ResponseJson::msg('Dato eliminado correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function showWithPlantel($cct)
    {
        try {
            $periodo_actual = Sisec::periodoActual();
            $periodo_id = $periodo_actual->id;
            $plantel = Plantel::where('cct' , $cct)->with([
                'evaluacionesOrdinarias' => function($query) use ($periodo_id){
                            $query->where('periodo_id', $periodo_id);
                },
                'evaluacionesExtraordinarias' => function($query) use ($periodo_id){
                            $query->where('periodo_id', $periodo_id);
                },
                'recuperacionParciales' => function($query) use ($periodo_id){
                            $query->where('periodo_id', $periodo_id);
                },
                'recursamientoIntersemestrales' => function($query) use ($periodo_id){
                            $query->where('periodo_id', $periodo_id);
                },
            ])->get();
            if($plantel->isNotEmpty()){
                return ResponseJson::data($plantel, 200);
            }else{
               return ResponseJson::msg("No se encontro el recurso solicitado", 400); 
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function isExistConfigOrdinariaInPlantel($parcial, $plantel, $periodo_actual)
    {
        try {
            $isExistConfig = ConfigEvaluacionOrdinariaParcial::where([
                'parcial' => $parcial,
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo_actual->id,
            ])->get();
            if($isExistConfig->isNotEmpty()){
                $resultado = $isExistConfig;
            }else{
                $resultado = false;
            }
            return $resultado;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración de la evaluación ordinaria', 400);
        } 
    }

    public function isExistConfigExtraordinariaInPlantel($plantel, $periodo_actual)
    {
        try {
            $isExistConfig = ConfigEvaluacionExtraordionaria::where([
                'plantel_id' => $plantel->id,
                'periodo_id' => $periodo_actual->id,
            ])->get();
            if($isExistConfig->isNotEmpty()){
                $resultado = $isExistConfig;
            }else{
                $resultado = false;
            }
            return $resultado;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración de la evaluación ordinaria', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible asignar la configuración de la evaluación ordinaria', 400);
        } 
    }

}
