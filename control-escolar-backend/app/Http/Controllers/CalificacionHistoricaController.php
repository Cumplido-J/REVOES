<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\UpdateCalificacionesHistoricasRequest;
use App\Http\Requests\StoreCalificacionesHistoricasRequest;
use App\Http\Requests\StoreAlumnoGrupoPeriodoHistoricoRequest;
use App\CalificacionUac;
use App\DocentePlantilla;
use App\DocenteAsignatura;
use App\CarreraUac;
use App\Alumno;
use App\UAC;
use App\AlumnoGrupo;
use App\Periodo;
use App\GrupoPeriodo;
use App\Usuario;
use App\PlantelCarrera;
use App\Docente;
use Illuminate\Support\Facades\DB;
use App\Traits\AuditoriaLogHelper;
use App\Traits\CalificarPromediarTrait;
use Carbon\Carbon;
use ResponseJson;
use HelperPermisoAlcance;
use HelperFechasEvaluacion;
use Sisec;

class CalificacionHistoricaController extends Controller
{
    use AuditoriaLogHelper, CalificarPromediarTrait;
   
    public function calificacionesAlumno($id)
    {
        try {
            $alumno = Alumno::findOrFail($id);
            //consultar rol
            if(!$this->evaluarRolPermisosAlcance($alumno)){
                return ResponseJson::msg('No tiene permisos para continuar', 400);   
            }
            /* periodo actual */
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            /* grupo actual alumno */
            $alumno = Alumno::where('usuario_id', $id)->with(['grupos' => function ($query) use($periodo_actual_id){
                $query->where('periodo_id', $periodo_actual_id);
            }])->first();
            /* semestre actual */
            $semestre_actual = [];
            if($alumno->grupos->isNotEmpty()){
                foreach($alumno->grupos as $grupo){
                    array_push($semestre_actual, $grupo->semestre);
                }
            }
            $alumno_calificaciones = Alumno::where('usuario_id', $id);
            $inscrito_actual = false;
            if(count($semestre_actual) > 0){
                $semestre_actual = max($semestre_actual);
                $inscrito_actual = true;
            }
            if($inscrito_actual){
                /* obtener calificaciones diferentes al semestre actual */
                if($semestre_actual < 6){
                    $alumno_calificaciones->with([
                        'calificacionUac.carreraUac' => function ($query) use($semestre_actual) {
                            $query->where('semestre', '<', $semestre_actual);
                        },
                        'calificacionUac.carreraUac.uac',
                        'calificacionUac.carreraUac.carrera'
                    ]);
                }else{
                    $alumno_calificaciones->with([
                        'calificacionUac.carreraUac.uac',
                        'calificacionUac.carreraUac.carrera'
                     ]);
                }
            }else{
                /* el alumno no esta en un semestre inscrito (probablemente salio ya) */
                $alumno_calificaciones->with([
                    'calificacionUac.carreraUac.uac',
                    'calificacionUac.carreraUac.carrera'
                ]);
            }
            $alumno_calificaciones = $alumno_calificaciones->get();
            return ResponseJson::data($alumno_calificaciones, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        }
    }

    public function update($id, UpdateCalificacionesHistoricasRequest $request)   
    {
        try {
            DB::beginTransaction(); 
            $alumno = Alumno::findOrFail($id);
            $alumno = Alumno::where('usuario_id', $id)->with(['usuario','carrera', 'plantel', 'grupos' => function($query){
                $query->where('periodo_id', Sisec::periodoActual()->id);
            }])->first();
            if(!$this->evaluarRolPermisosAlcance($alumno)){
                return ResponseJson::msg('No tiene permisos para continuar', 400);   
            }
            if(!HelperFechasEvaluacion::isConfigHistoricosAvailable($alumno->plantel_id)){
                //return ResponseJson::msg('Las fechas para modificar calificaciones historicas se encuentra desactivadas', 400);                
            }
            //recorrido 
            foreach($request["calificaciones"] as $obj){
                /* modificar calificacion */
                if(isset($obj["calificacion_id"])){
                    $calificacion = CalificacionUac::where('id', $obj["calificacion_id"])->first();
                    if(!$calificacion){
                        return ResponseJson::msg("No fue posible realizar la solicitud, la calificación no existe", 400);
                    }
                    /* periodo actual */
                    $periodo_actual = Sisec::periodoActual();
                    $periodo_actual_id = $periodo_actual->id;
                    if($calificacion->periodo_actual_id == $periodo_actual_id){
                        return ResponseJson::msg("No fue posible realizar la solicitud, solo pueden ser modificadas calificaciones de periodos anteriores", 400);
                    }
                    /* comprobar si la carrera uac pertence oferta academica alumno */
                    $carrera_uac = CarreraUac::find($calificacion->carrera_uac_id);
                    if($carrera_uac->carrera_id != $alumno->carrera_id){
                        //return ResponseJson::msg('La asignatura no pertenece a la oferta académica del alumno', 400);
                    }
                    /* identificar tipo calificacion/evaluacion */
                    $tipo_calificacion = $this->tipoCalificacion($calificacion->tipo_calif, $calificacion->parcial, $calificacion->carrera_uac_id, $calificacion->alumno_id, $calificacion->id, true);
                    /* carrera uac */
                    $carrera_uac_id = $calificacion->carrera_uac_id;
                    /* parcial */
                    $parcial = $calificacion->parcial;
                    /* periodo */
                    $periodo_id = $calificacion->periodo_id;
                    /* grupo */
                    $grupo_periodo_id = $calificacion->grupo_periodo_id;
                    /* intersemestral */
                    $grupo_recursamiento_intersemestral_id = $calificacion->grupo_recursamiento_intersemestral_id ? $calificacion->grupo_recursamiento_intersemestral_id : NULL;
                    /* semestral */
                    $grupo_recursamiento_semestral_id = $calificacion->grupo_recursamiento_semestral_id ? $calificacion->grupo_recursamiento_semestral_id : NULL;
                    /* ext */
                    $grupo_ext_id = $calificacion->grupo_extraordinario_id;
                    /* faltas */
                    $faltas = $calificacion->faltas;
                    /* docente */
                    $docente_id = $calificacion->docente_id;
                    if($this->comprobarModulo($carrera_uac_id)){
                        /* comprobar si es modulo */
                       //return ResponseJson::msg("No es posible modificar la calificación ya que esta calificación pertenece a un módulo", 400);
                    }
                    if($tipo_calificacion == "EXT"){
                        /* comprobar submodulo de tipo EXT */
                        if($this->comprobarSubModulo($carrera_uac_id)){
                            return ResponseJson::msg("No es posible modificar la calificación ya que un submódulo no puede tener calificación de tipo EXT", 400);
                        }
                    }
                    /* comprobar si la calificacion a modificar es parcial 4 o final y que no contenga otros parciales*/
                    if($calificacion->parcial == 4 && $tipo_calificacion == "N"){
                        if(!$this->comprobarTipoEvaluacionNormalFinal($alumno->usuario_id, $carrera_uac_id)){
                            return ResponseJson::msg("No es posible modificar la calificación ya que esta calificación debe ser promediada con sus respectivos parciales", 400);
                        }
                    }
                    /* comprobar si la calificacion a modificar diferente a curso normal, sea la mas reciente => pero si es reprobatoria, continuar proceso para actualizar*/
                    if($calificacion->calificacion <= 5 && $obj["calificacion"] > 5){
                        if(!$this->existeCalificacionEspecialFinal($calificacion)){
                            return ResponseJson::msg("No es posible modificar la calificación ya que cuenta con una mas reciente de tipo especial", 400);
                        }
                    }
                }
                /* agregar calificacion */
                else if(isset($obj["carrera_uac_id"])){
                    return ResponseJson::msg('No fue posible realizar la solicitud', 404);
                }else{
                    /* se necesita id o carrera_uac_id para continuar */
                    return ResponseJson::msg('No fue posible realizar la solicitud', 400);
                }
                /* iniciar proceso para la calificacion y promedio */
                $this->calificarAlumno(
                    $alumno->usuario_id, $carrera_uac_id, $calificacion->plantel_id, $parcial, $periodo_id, $obj["calificacion"], 
                    $faltas, $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, $grupo_ext_id,
                    $docente_id, $tipo_calificacion, true);
            }
            DB::commit();
            return ResponseJson::msg("Calificación modificada con éxito", 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 404);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 404);
        }
    }

    public function store($id, StoreCalificacionesHistoricasRequest $request)   
    {
        try {       
            DB::beginTransaction();
            $alumno = Alumno::findOrFail($id);
            if(!$this->evaluarRolPermisosAlcance($alumno)){
                return ResponseJson::msg('No tiene permisos para continuar', 400);   
            }
            if(!HelperFechasEvaluacion::isConfigHistoricosAvailable($alumno->plantel_id)){
                //return ResponseJson::msg('Las fechas para modificar calificaciones historicas se encuentra desactivadas', 400);                
            }
            /* comprobar periodo actual */
            $periodo_actual = Sisec::periodoActual();
            if($request->periodo_id == $periodo_actual->id){
                return ResponseJson::msg('No es posible ingresar calificaciones del periodo actual', 400);
            }
            /* comprobar si la materia pertenece al semestre */
            if(!$this->isUacSemestre($request->carrera_uac_id, $request->semestre, $request->periodo_id)){
                return ResponseJson::msg('La materia que intenta agregar, no es cursada en el semestre que selecciono', 400);
            }
            /* comprobar si la materia esta en el correcto periodo */
            if(!$this->isUacPeriodo($request->carrera_uac_id, $request->periodo_id)){
                return ResponseJson::msg('La materia que intenta agregar, no es cursada en el periodo que selecciono', 400);
            }
            /* comprobar si el grupo esta en el correcto periodo */
            if(!$this->isGrupoInPeriodo($request->grupo_periodo_id, $request->periodo_id)){
                return ResponseJson::msg('El grupo que selecciono no pertenece al periodo', 400);
            }
            /* comprobar si la carrera uac pertence oferta academica alumno */
            $carrera_uac = CarreraUac::find($request->carrera_uac_id);
            if($carrera_uac->carrera_id != $alumno->carrera_id){
                //return ResponseJson::msg('La asignatura no pertenece a la oferta académica del alumno', 400);
            }
            /* comprobar la calificacion y la materia en el historial */
            if($request->tipo_calificacion == 'N'){
                /* comprobar si falta la materia en historial */
                $uac_test = CalificacionUac::where([
                    ['alumno_id', $alumno->usuario_id],
                    ['carrera_uac_id', $request->carrera_uac_id],
                    ['tipo_calif', null]
                ])->first();
                if($uac_test){
                    return ResponseJson::msg('La materia que intenta agregar, ya existe dentro del historial del alumno', 400);   
                }
            }
            //recorrido
            foreach($request["calificaciones"] as $obj){
                /* buscar alumno periodo solo de tipo ORDINARIO */
                if($request->tipo_calificacion == 'N'){
                    /* buscar alumno en el grupo periodo seleccionado */
                    if(!$this->isAlumnoGrupoPeriodo($alumno, $request->grupo_periodo_id)){
                        /* si el alumno no esta en el grupo seleccionado */
                        /* comprobar que el alumno no este en otro grupo diferente al seleccionado */
                        if($alumno_grupo = $this->isAlumnoHaveGroupPeriod($alumno->usuario_id, $request->grupo_periodo_id, $request->periodo_id)){
                            return ResponseJson::msg('El alumno se encuentra asignado en el grupo '.$alumno_grupo->grupo['semestre'].' '.$alumno_grupo->grupo['grupo'].' favor de verificar el grupo en el periodo seleccionado o en su defecto, identificar el grupo y eliminar al alumno del grupo', 400);
                        }else{
                            /* vincular al alumno al grupo seleccionado */
                            $this->addAlumnoGrupoPeriodo($alumno->usuario_id, $request->grupo_periodo_id);
                        }
                    }
                    /* comprobar si vienen todos los semestres necesarios */
                    $cont_parciales = []; //contador parciales
                    $cont_parciales_enviados_tipo_n = 0;
                    foreach($request["calificaciones"] as $calificacion){
                        if($request->tipo_calificacion == "N"){
                            $cont_parciales_enviados_tipo_n = $cont_parciales_enviados_tipo_n + 1;
                            if($calificacion["parcial"] == "1"){
                                if(!in_array(1, $cont_parciales)){
                                    array_push($cont_parciales, 1);
                                }
                            }else if($calificacion["parcial"] == "2"){
                                if(!in_array(2, $cont_parciales)){
                                    array_push($cont_parciales, 2);
                                }
                            }else if($calificacion["parcial"] == "3"){
                                if(!in_array(3, $cont_parciales)){
                                    array_push($cont_parciales, 3);
                                }
                            }
                       }
                    }
                    /* comprobar el numero de parciales enviados y los correctos */
                    $cont_parciales_correctos = count($cont_parciales);
                    if($cont_parciales_correctos != $cont_parciales_enviados_tipo_n || $cont_parciales_correctos < 3){
                        return ResponseJson::msg("Verificar el total de parciales enviados", 400);
                    }
                }
                /* faltas */
                $faltas = null;
                /* docente */
                $docente_id = $request->docente_id;
                /* grupos  */
                $grupo_periodo_id = null;
                $grupo_recursamiento_intersemestral_id = null;
                $grupo_recursamiento_semestral_id = null;
                /* por definir */
                /* verificar el tipo de evaluacion */
                if($request->tipo_calificacion == "N"){
                    $parcial = $obj["parcial"];
                    $faltas = $obj["faltas"] ?? null;
                    $grupo_periodo_id = $request->grupo_periodo_id ?? null;
                }
                /* iniciar proceso para la calificacion y promedio */
                $this->calificarAlumno(
                    $alumno->usuario_id, $request->carrera_uac_id, $request->plantel_id, 
                    $parcial, $request->periodo_id, $obj["calificacion"], $faltas, 
                    $grupo_periodo_id, $grupo_recursamiento_intersemestral_id, $grupo_recursamiento_semestral_id, null, $docente_id, $request->tipo_calificacion, true
                );
                /* crear docente-asignatura */
                $this->crearDocenteAsignatura($docente_id, $request->plantel_id, $grupo_periodo_id, $request->carrera_uac_id, $request->periodo_id);
            }
            DB::commit();
            return ResponseJson::msg("Calificación agregada con éxito", 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        }
    }

    public function eliminarCalificacionesCarreraUac(Request $request)   
    {
        try {       
            DB::beginTransaction();
            $alumno = Alumno::findOrFail($request->alumno_id);
            if(!$this->evaluarRolPermisosAlcance($alumno)){
                return ResponseJson::msg('No tiene permisos para continuar', 400);   
            }
            if(!HelperFechasEvaluacion::isConfigHistoricosAvailable($alumno->plantel_id)){
                //return ResponseJson::msg('Las fechas para modificar calificaciones historicas se encuentra desactivadas', 400);                
            }
            if($request->has("carrera_uac_id")){
                $carrera_uac = CarreraUac::findOrFail($request->carrera_uac_id);
                $uac = UAC::find($carrera_uac->uac_id);
                $calificacion = CalificacionUac::where([
                    ['alumno_id', $request->alumno_id],
                    ['carrera_uac_id', $request->carrera_uac_id]
                ])->first();
                if(!$calificacion){
                    return ResponseJson::msg('No fue posible realizar la solicitud', 400); 
                }
                /* validar tipo de calificacion */
                if($calificacion->alumno_id != $alumno->usuario_id){
                    return ResponseJson::msg('No fue posible realizar la solicitud', 400);         
                }
                /* eliminar todas las relaciones calificacion con la materia */
                $carrera_uacs = CarreraUac::where('uac_id', $carrera_uac->uac_id)->get();
                $carrera_uacs_id = [];
                foreach($carrera_uacs as $obj){
                    array_push($carrera_uacs_id, $obj->id);
                }
                $calificaciones_relacionadas = CalificacionUac::where([
                    ['alumno_id', $alumno->usuario_id]
                ])->whereIn('carrera_uac_id', $carrera_uacs_id)->get();
                if($calificaciones_relacionadas->isNotEmpty()){
                    /* recorrido para pasar a 5 antes de eliminar para casos de sub modulos */
                    if($uac->modulo_id){
                        foreach($calificaciones_relacionadas as $obj){
                            $this->calificarAlumno(
                                $alumno->usuario_id, $obj->carrera_uac_id, $alumno->plantel_id, 
                                $obj->parcial, $obj->periodo_id, 5, $obj->faltas, 
                                $obj->grupo_periodo_id, $request->grupo_recursamiento_intersemestral_id, $request->grupo_recursamiento_semestral_id, null, null, $obj->tipo_calif, true
                            );
                        }
                    }
                }
                /* eliminar calificaciones realcionadas */
                $calificaciones_relacionadas = CalificacionUac::where([
                    ['alumno_id', $alumno->usuario_id],
                    ['carrera_uac_id', $calificacion->carrera_uac_id],
                ])->get();
                if(count($calificaciones_relacionadas)){
                    foreach($calificaciones_relacionadas as $obj){
                        $obj->delete();
                        $this->auditoriaSave($obj); /* adutoria log */
                    }
                }
                /* si la calificacion es de tipo submodulo y hay calificacion diferente al ordinario, comprobar que el modulo mo merezca el tipo calificacion, de ser asi eliminar tambien */
                $uac = UAC::find($carrera_uac->uac_id);
                if($uac->modulo_id){
                    /* obtener carrera_uac */
                    $carrera_uac_modulo = CarreraUac::where([
                        ['uac_id', $uac->modulo_id],
                        ['carrera_id', $carrera_uac->carrera_id],
                        ['semestre', $carrera_uac->semestre]
                    ])->first();
                    if($carrera_uac_modulo){
                        /* es de tipo submodulo */
                        $calificaciones_modulo = CalificacionUac::where([
                            ['alumno_id', $alumno->usuario_id],
                            ['carrera_uac_id', $carrera_uac_modulo->id],
                        ])->get();
                        if(count($calificaciones_modulo)){
                            foreach($calificaciones_modulo as $obj){
                                /* reprobar materia primero */
                                $this->calificarAlumno(
                                    $alumno->usuario_id, $obj->carrera_uac_id, $alumno->plantel_id, 
                                    $obj->parcial, $obj->periodo_id, 5, $obj->faltas, 
                                    $obj->grupo_periodo_id, $request->grupo_recursamiento_intersemestral_id, $request->grupo_recursamiento_semestral_id, null, null, $obj->tipo_calif, true
                                );
                                $obj->delete();
                                $this->auditoriaSave($obj); /* adutoria log */
                            }
                        }
                    }
                }
            }else{
                return ResponseJson::msg('No fue posible realizar la solicitud', 400);    
            }
            DB::commit();
            return ResponseJson::data("Calificación eliminada con éxito", 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        }
    }

    public function eliminarCalificacionById($id, Request $request)   
    {
        try {
            DB::beginTransaction();
            $alumno = Alumno::findOrFail($id);
            if(!$this->evaluarRolPermisosAlcance($alumno)){
                return ResponseJson::msg('No tiene permisos para continuar', 400);   
            }
            if(!HelperFechasEvaluacion::isConfigHistoricosAvailable($alumno->plantel_id)){
                //return ResponseJson::msg('Las fechas para modificar calificaciones historicas se encuentra desactivadas', 400);                
            }
            if($request->has("calificacion_id")){
                $calificacion = CalificacionUac::findOrFail($request->calificacion_id);
                /* validar tipo de calificacion */
                if($calificacion->alumno_id != $id){
                    return ResponseJson::msg('No fue posible realizar la solicitud, la calificación no esta relacionada con el alumno', 400);         
                }
                if($calificacion){
                    /* identificar tipo calificacion/evaluacion */
                    $tipo_calificacion = $this->tipoCalificacion($calificacion->tipo_calif, $calificacion->parcial, $calificacion->carrera_uac_id, $calificacion->alumno_id, $calificacion->id, true);
                    /* recorrido para pasar a 5 antes de eliminar para casos de sub modulos */
                    $this->calificarAlumno(
                        $alumno->usuario_id, $calificacion->carrera_uac_id, $alumno->plantel_id,
                        $calificacion->parcial, $calificacion->periodo_id, 5, $calificacion->faltas,
                        $calificacion->grupo_periodo_id, $calificacion->grupo_recursamiento_intersemestral_id, $calificacion->grupo_recursamiento_semestral_id, null, $calificacion->docente_id, $calificacion->tipo_calif, true
                    );
                    /* comprobar si es de tipo especial (RS, CI) y eliminar todos sus parciales relacionados */
                    $calificaciones_relacionadas = CalificacionUac::where([
                        ['alumno_id', $id],
                        ['tipo_calif', $tipo_calificacion],
                        ['carrera_uac_id', $calificacion->carrera_uac_id]
                    ])->orderBy('id', 'DESC')->get();
                    foreach($calificaciones_relacionadas as $calificacionRelacionada){
                        $calificacionTest = CalificacionUac::find($calificacionRelacionada->id);
                        $calificacionTest->delete();    
                        $this->auditoriaSave($calificacionTest); /* adutoria log */
                    }
                    /* eliminar calificacion */
                    $calificacion->delete();
                    $this->auditoriaSave($calificacion); /* adutoria log */
                }else{
                    return ResponseJson::msg('No fue posible realizar la solicitud, no se encontro registro de la calificación id', 400);            
                }
            }else{
                return ResponseJson::msg('No fue posible realizar la solicitud, se necesita la calificación id', 400);        
            }
            DB::commit();
            return ResponseJson::data("Calificación eliminada con éxito", 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible realizar la solicitud', 400);
        }
    }

    /* utils */
    public function crearDocenteAsignatura($docente_id, $plantel_id, $grupo_periodo_id, $carrera_uac_id, $periodo_id)
    {
        try {
            $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
            $platen_carrera = PlantelCarrera::find($grupo_periodo->plantel_carrera_id);
            $carrera_uac = CarreraUac::find($carrera_uac_id);
            $carrera_uac = CarreraUac::where([
                ['uac_id', $carrera_uac->uac_id],
                ['carrera_id', $platen_carrera->carrera_id]
            ])->first();
            $docente_asignacion = DocentePlantilla::where([
                ['docente_id', $docente_id],
                ['plantel_id', $plantel_id],
                ['plantilla_estatus', '<>', 0]
            ])->first();
            if($docente_asignacion){
                /* comprobar asignatura docente */
                $docente_asignatura = DocenteAsignatura::where([
                   ['plantel_id', $plantel_id],
                   ['carrera_uac_id', $carrera_uac->id],
                   ['grupo_periodo_id', $grupo_periodo_id],
                   ['estatus', 1]
                ])->first();
                if(!$docente_asignatura){
                    /* crear docente asignatura */
                    $docente_asignatura = DocenteAsignatura::create([
                        'plantel_id' => $plantel_id,
                        'carrera_uac_id' => $carrera_uac->id,
                        'grupo_periodo_id' => $grupo_periodo_id,
                        'periodo_id' => $grupo_periodo->periodo_id,
                        'plantilla_docente_id' => $docente_asignacion->id,
                        'estatus' => 1
                    ]);
                }
                return $docente_asignatura;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isUacSemestre($carrera_uac_id, $semestre, $periodo_id)
    {
        try {
            $carrera_uac = CarreraUac::find($carrera_uac_id);
            if($carrera_uac->semestre == $semestre){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isUacPeriodo($carrera_uac_id, $periodo_id)
    {
        try {
            $periodo = Periodo::find($periodo_id);
            $numero_periodo = explode('/', $periodo->nombre)[1];
            $semestres = ($numero_periodo == '2') ? [2,4,6] : [1,3,5];
            $carrera_uac = CarreraUac::find($carrera_uac_id);
            if(in_array($carrera_uac->semestre, $semestres)){
                /* comprobar uac */
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isGrupoInPeriodo($grupo_periodo_id, $periodo_id)
    {
        try {
            $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
            if($grupo_periodo->periodo_id == $periodo_id){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }
    
    public function isAlumnoGrupoPeriodo($alumno, $grupo_periodo_id)
    {
        try {
            $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
            $alumno_grupo = AlumnoGrupo::where([
                ['grupo_periodo_id', $grupo_periodo->id],
                ['alumno_id', $alumno->usuario_id]
            ])->first();
            if(!$alumno_grupo){
                return false;
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isAlumnoGrupoRS($alumno, $grupo_periodo_id)
    {
        try {
            $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
            $alumno_grupo = AlumnoGrupo::where([
                ['grupo_periodo_id', $grupo_periodo->id],
                ['alumno_id', $alumno->usuario_id]
            ])->first();
            if(!$alumno_grupo){
                return false;
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function evaluarRolPermisosAlcance($alumno)
    {
        try {
            //consultar rol
            if(!HelperPermisoAlcance::isRolControlEscolar()){
                return false;  
            }
            //comprobar alcance
            $permisos = HelperPermisoAlcance::getPermisos();
            $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
            //alcance plantel
            if(in_array('Plantel', $permisos)){
                if(!in_array($alumno->plantel_id, $planteles_alacance)){
                    return false;
                }
            }else if(in_array('Estatal', $permisos)){
                if(!in_array($alumno->plantel_id, $planteles_alacance)){
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

    public function isAlumnoHaveGroupPeriod($alumno_id, $grupo_periodo_id, $periodo_id)
    {
        /* alumno grupos */
        $alumno_grupo = AlumnoGrupo::where('alumno_id', $alumno_id)->whereHas('grupo', function ($query) use($periodo_id){
            $query->where('periodo_id', $periodo_id);
        })->with('grupo')->first();
        return $alumno_grupo;
    }

    public function addAlumnoGrupoPeriodo($alumno_id, $grupo_periodo_id)
    {
        /* grupo periodo */
        $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
        /* comprobar numero de alumnos */
        $alumnos_grupo = AlumnoGrupo::where('grupo_periodo_id', $grupo_periodo_id)->get(); 
        $alumnos_inscritos = 0;
        foreach($alumnos_grupo as $obj){
            if($obj->status == "Inscrito"){
                $alumnos_inscritos ++;
            }
        }
        /* validar si es necesario modificar maximo de alumnos */
        if($alumnos_inscritos >= $grupo_periodo->max_alumnos){
           /* modificar max alumnos */
           $new_max = $grupo_periodo->max_alumnos + 1;
           $grupo_periodo->update([
               'max_alumnos' => $new_max,
           ]);
        }
        /* relacionar al alumno */
        $alumno_grupo = AlumnoGrupo::create([
            'alumno_id' => $alumno_id,
            'grupo_periodo_id' => $grupo_periodo_id,
            'status' => "Inscrito"
        ]);
        return $alumno_grupo;
    }

}