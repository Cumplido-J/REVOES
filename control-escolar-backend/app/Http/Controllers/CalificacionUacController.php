<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreCalificacionUacRequest;
use App\Http\Requests\StoreCalificacionUacControlRequest;
use App\Http\Requests\StoreCalificacionIntersemestralRequest;
use App\Http\Requests\StoreCalificacionSemestralRequest;
use App\Http\Requests\StoreCalificacionExtraordinarioRequest;
use App\AsignaturaRecursamientoIntersemestral;
use App\GrupoRecursamientoIntersemestral;
use App\GrupoRecursamientoSemestral;
use App\AlumnoGrupoRecursamientoIntersemestral;
use App\AlumnoGrupoRecursamientoSemestral;
use App\CalificacionUac;
use App\DocenteAsignatura;
use App\Periodo;
use App\Plantel;
use App\CarreraUac;
use App\UAC;
use App\Docente;
use App\DocentePlantilla;
use App\Alumno;
use App\AlumnoGrupo;
use App\AlumnoUacGrupo;
use App\GrupoPeriodo;
use App\UsuarioDocente;
use App\Extraordinario;
use App\AlumnoGrupoExtraordinario;
use Illuminate\Support\Facades\DB;
use App\Traits\AuditoriaLogHelper;
use App\Traits\CalificarPromediarTrait;
use Carbon\Carbon;
use ResponseJson;
use ValidationsDocente;
use HelperFechasEvaluacion;
use HelperPermisoAlcance;
use Sisec;

class CalificacionUacController extends Controller
{
    use AuditoriaLogHelper, CalificarPromediarTrait;
   
    public function store(StoreCalificacionUacRequest $request)
    {
        try {
            DB::beginTransaction();
               if($request["alumnos"]){
                   foreach($request["alumnos"] as $obj){
                    /* docente de asignatura/plantilla */
                    $docente_plantilla = DocentePlantilla::find($request->docente_asignacion_id);
                    /* consultar estatus de asignatura y asignacion */
                    $is_available_asignacion_docente = ValidationsDocente::isAvailableDocenteAsignacion($request->docente_asignacion_id);
                    if(!$is_available_asignacion_docente){
                        return ResponseJson::msg('La asignación del docente no se encuentra disponible', 400);
                    }
                    $is_available_asignatura_docente = ValidationsDocente::isAvailableDocenteAsignatura($request->docente_asignatura_id);
                    if(!$is_available_asignatura_docente){
                        return ResponseJson::msg('La asignatura del docente no se encuentra disponible', 400);   
                    }
                    $is_available_docente = ValidationsDocente::isAvailableDocente($docente_plantilla->docente_id);
                    if(!$is_available_docente){
                        return ResponseJson::msg('El docente no se encuentra disponible', 400);
                    }       
                    //consultar si pertenece asignatura auth
                    $is_my_asignatura = $this->isMyAsignatura($request->docente_asignatura_id, $request->plantel_id, $request->docente_asignacion_id);
                    if(!$is_my_asignatura){
                        //no es asignatura del docente
                        throw new ModelNotFoundException();
                    }
                    /* consultar si el alumno pertenece al grupo periodo */
                    $is_student_group = $this->isExistStudentInGroup($obj["alumno_id"], $request->grupo_periodo_id, $request->carrera_uac_id);
                    if(!$is_student_group){
                        /* alumno no pertenece a grupo */
                        return ResponseJson::msg('El alumno que intenta cargar una calificación no pertenece al grupo', 400);
                    }
                    /* consultar si la calificacion del alumno al cargar le pertenezca al solicitante */
                    $is_group_exist_uac = $this->isExistGroupInUacDocente($request->grupo_periodo_id, $request->carrera_uac_id, $request->plantel_id, $request->docente_asignacion_id);
                    if(!$is_group_exist_uac){
                        return ResponseJson::msg('El grupo que intenta cargar calificación no pertenece a la asignación del docente', 400);
                    }
                    $is_exist_plantel_docente_asignatura = $this->isExistPlantelUacDocente($request->plantel_id, $request->docente_asignatura_id);
                    if(!$is_exist_plantel_docente_asignatura){
                        return ResponseJson::msg('El plantel no tiene relación con la asignatura del docente', 400);
                    }
                    $periodo_actual = Sisec::periodoActual(); //periodo_actual
                    $periodo_actual_id = $periodo_actual->id;
                    $is_exist_carrera_uac_in_docente_asignatura = $this->isExistCarreraUacInUacDocente($request->carrera_uac_id, $request->docente_asignatura_id, $request->grupo_periodo_id, $periodo_actual_id);
                    if(!$is_exist_carrera_uac_in_docente_asignatura){
                        return ResponseJson::msg('La asignatura no tiene relación con la asignatura del docente', 400);
                    }
                    /* consultar si el periodo actual pertenece a la asignatura */
                    $is_current_period = HelperFechasEvaluacion::isCurrentPeriod($periodo_actual_id, $request->docente_asignatura_id);
                    /* consultar si el parcial se encuentra activo */
                    $check_parcial = HelperFechasEvaluacion::isParcialAvailable($obj["parcial"], $request->plantel_id, $periodo_actual_id);
                    //consultar si el alumno tiene una calificacion anterior pendiente y comprobar si el parcial que intenta modificar este dentro de una fecha mayor a la de su parcial
                    $check_pendiente_calificacion = $this->isPendienteCalificacionAlumno($obj["parcial"], $obj["alumno_id"], $request->grupo_periodo_id, $request->carrera_uac_id, $periodo_actual_id, $request->plantel_id);
                    if($check_parcial && $is_current_period || $check_pendiente_calificacion && $is_current_period){
                        if(isset($obj['faltas'])){
                            $faltas = $obj['faltas'];
                        }else{
                            $faltas = null;
                        }
                        $this->calificarAlumno($obj["alumno_id"], $request->carrera_uac_id, $request->plantel_id, $obj["parcial"], $periodo_actual_id, $obj["calificacion"], $faltas, $request->grupo_periodo_id, null, null, null, $docente_plantilla, "N");
                    }else{
                        return ResponseJson::msg('El parcial no se encuentra activo para evaluaciones', 400);
                    }
                }
                $acuse = $this->createAcuse($request);
                DB::commit();
                return $acuse;
            }else{
               return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
            }
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public function storeFromControlEscolar(StoreCalificacionUacControlRequest $request)
    {
        try {
            DB::beginTransaction();
            //consultar rol
            if(!HelperPermisoAlcance::isRolControlEscolar()){
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
            //comprobar alcance 
            $permisos = HelperPermisoAlcance::getPermisos();
            $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
            //alcance plantel
            if(in_array('Plantel', $permisos)){
                if(!in_array($request->plantel_id, $planteles_alacance)){
                    return ResponseJson::msg('No tiene permisos para continuar', 400);
                }
            }else if(in_array('Estatal', $permisos)){
                if(!in_array($request->plantel_id, $planteles_alacance)){
                    return ResponseJson::msg('No tiene permisos para continuar', 400);
                }
            }
            if($request["alumnos"]){
                foreach($request["alumnos"] as $obj){
                /* docente de asignatura/plantilla */
                $docente_plantilla = DocentePlantilla::find($request->docente_asignacion_id);
                /* consultar estatus de asignatura y asignacion */
                $is_available_asignacion_docente = ValidationsDocente::isAvailableDocenteAsignacion($request->docente_asignacion_id);
                if(!$is_available_asignacion_docente){
                    return ResponseJson::msg('La asignación del docente no se encuentra disponible', 400);   
                }
                $is_available_asignatura_docente = ValidationsDocente::isAvailableDocenteAsignatura($request->docente_asignatura_id);
                if(!$is_available_asignatura_docente){
                    return ResponseJson::msg('La asignatura del docente no se encuentra disponible', 400);   
                }
                $is_available_docente = ValidationsDocente::isAvailableDocente($docente_plantilla->docente_id);
                if(!$is_available_docente){
                    return ResponseJson::msg('El docente no se encuentra disponible', 400);
                }
                //consultar si pertenece asignatura auth
                $is_asignatura_docente = $this->isAsignaturaDocente($request->docente_asignatura_id, $request->plantel_id, $request->docente_asignacion_id);
                if(!$is_asignatura_docente){
                    //no es asignatura del docente
                    throw new ModelNotFoundException();
                }
                /* consultar si el alumno pertenece al grupo periodo */
                $is_student_group = $this->isExistStudentInGroup($obj["alumno_id"], $request->grupo_periodo_id, $request->carrera_uac_id);
                if(!$is_student_group){
                    return ResponseJson::msg('El alumno que intenta cargar una calificación no pertenece al grupo', 400);
                }
                /* consultar si la calificacion del alumno al cargar le pertenezca al solicitante */
                $is_group_exist_uac = $this->isExistGroupInUacDocente($request->grupo_periodo_id, $request->carrera_uac_id, $request->plantel_id, $request->docente_asignacion_id);
                if(!$is_group_exist_uac){
                    return ResponseJson::msg('El grupo que intenta cargar calificación no pertenece a la asignación del docente', 400);
                }
                $is_exist_plantel_docente_asignatura = $this->isExistPlantelUacDocente($request->plantel_id, $request->docente_asignatura_id);
                if(!$is_exist_plantel_docente_asignatura){
                    return ResponseJson::msg('El plantel no tiene relación con la asignatura del docente', 400);
                }    
                $periodo_actual = Sisec::periodoActual();
                $periodo_actual_id = $periodo_actual->id;
                $is_exist_carrera_uac_in_docente_asignatura = $this->isExistCarreraUacInUacDocente($request->carrera_uac_id, $request->docente_asignatura_id, $request->grupo_periodo_id, $periodo_actual_id);
                if(!$is_exist_carrera_uac_in_docente_asignatura){
                    return ResponseJson::msg('La asignatura no tiene relación con la asignatura del docente', 400);
                }
                /* consultar si el periodo actual pertenece a la asignatura */
                $is_current_period = HelperFechasEvaluacion::isCurrentPeriod($periodo_actual_id, $request->docente_asignatura_id);
                /* consultar si el parcial se encuentra activo */
                $check_parcial = HelperFechasEvaluacion::isParcialAvailable($obj["parcial"], $request->plantel_id, $periodo_actual_id);
                //consultar si el alumno tiene una calificacion anterior pendiente y comprobar si el parcial que intenta modificar este dentro de una fecha mayor a la de su parcial
                $check_pendiente_calificacion = $this->isPendienteCalificacionAlumno($obj["parcial"], $obj["alumno_id"], $request->grupo_periodo_id, $request->carrera_uac_id, $periodo_actual_id, $request->plantel_id);
                //consultar si esta activa la recuperacion por parcial
                $is_available_recuperacion_parcial = HelperFechasEvaluacion::isAvailableRecuperacionParcial($obj["parcial"], $request->plantel_id);
                if($check_parcial && $is_current_period || $check_pendiente_calificacion && $is_current_period || $is_available_recuperacion_parcial && $is_current_period){
                    $faltas = null;
                    if(isset($obj["faltas"])){
                        $faltas = $obj["faltas"];
                    }
                    $this->calificarAlumno($obj["alumno_id"], $request->carrera_uac_id, $request->plantel_id, $obj["parcial"], $periodo_actual_id, $obj["calificacion"], $faltas, $request->grupo_periodo_id, null, null, null, $docente_plantilla, "N");
                }else{
                    return ResponseJson::msg('El parcial no se encuentra activo para evaluaciones', 400);
                }   
            }
            $acuse = $this->createAcuse($request);
            DB::commit();
            return $acuse;
            }else{
                return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
            }
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public function storeIntersemestralFromControlEscolar(StoreCalificacionIntersemestralRequest $request)
    {
        try {
            DB::beginTransaction();
            if(!HelperPermisoAlcance::isRolControlEscolar()){
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
            if($request["alumnos"]){
                //docente asignacion    
                $docente_plantilla = DocentePlantilla::find($request->docente_asignacion_id);
                $grupo_recursamiento_intersemestral = GrupoRecursamientoIntersemestral::find($request->grupo_recursamiento_intersemestral_id);
                $is_available_asignatura_intersemestral = ValidationsDocente::isAvailableAsignaturaRecursamientoIntersemestral($request->asignatura_recursamiento_intersemestral_id);
                if(!$is_available_asignatura_intersemestral){
                    /* return ResponseJson::msg('Asignatura fuera del periodo actual', 400); */
                }
                //consultar si la asingatura pertenece al docente request y grupo recursamiento intersemestral
                $is_asignatura_docente = $this->isAsignaturaIntersemestralDocenteGrupoPlantelCarreraUac($request->asignatura_recursamiento_intersemestral_id, $request->grupo_recursamiento_intersemestral_id, $request->plantel_id, $request->carrera_uac_id, $docente_plantilla);
                if(!$is_asignatura_docente){
                    return ResponseJson::error('No fue posible cargar la calificación del alumno', 400, "El docente no pertenece al grupo de recursamiento intersemestral"); //la asignatura no pertenece al docente
                }
                //consultar si el periodo de recursamiento intersemestral esta activo y periodo actual pertence
                $is_available_date_recursamiento_intersemestral = HelperFechasEvaluacion::isAvailableDateIntersemestral($request->plantel_id);
                //periodo grupo
                $periodo_id = $grupo_recursamiento_intersemestral->periodo_id;
                if($is_available_date_recursamiento_intersemestral){
                    //recorrido alumnos
                    foreach($request["alumnos"] as $obj){
                        //consultar si el alumno pertenece al recursamiento intersemestrla
                        $is_student_group = $this->isExistStudentInAsignaturaRecursamientoIntersemestral($obj["alumno_id"], $request->grupo_recursamiento_intersemestral_id, $request->plantel_id);
                        if($is_student_group){
                            $this->calificarAlumno($obj["alumno_id"], $request->carrera_uac_id, $request->plantel_id, $obj["parcial"], $periodo_id, $obj["calificacion"], null, null, $request->grupo_recursamiento_intersemestral_id, null, null, $docente_plantilla, "CI");         
                        }else{
                            /* alumno no pertenece a grupo */
                            return ResponseJson::msg('El alumno que intenta cargar una calificación no pertenece al grupo de recursamiento intersemestral', 400);
                        }
                    }
                    DB::commit();
                    return ResponseJson::msg('Calificaciones cargadas con éxito', 200);
                }else{
                    return ResponseJson::msg('Periodo de recursamientos intersemestrales no se encuentra activo', 400);
                }
            }else{
                return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
            }
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public function storeSemestralFromControlEscolar(StoreCalificacionSemestralRequest $request)
    {
        try {
            DB::beginTransaction();
            if(!HelperPermisoAlcance::isRolControlEscolar()){
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
            if($request["alumnos"]){
                //docente asignacion    
                $docente_plantilla = DocentePlantilla::find($request->docente_asignacion_id);
                $grupo_recursamiento_semestral = GrupoRecursamientoSemestral::find($request->grupo_recursamiento_semestral_id);
                //consultar si la asingatura pertenece al docente request y grupo recursamiento intersemestral
                $is_asignatura_docente = $this->isGroupSemestralDocenteGrupoPlantelCarreraUac($request->grupo_recursamiento_semestral_id, $request->plantel_id, $request->carrera_uac_id, $docente_plantilla);
                if(!$is_asignatura_docente){
                    return ResponseJson::error('No fue posible cargar la calificación del alumno', 400, "El docente no pertenece al grupo de recursamiento semestral"); //la asignatura no pertenece al docente
                }
                //consultar si el periodo de recursamiento intersemestral esta activo y periodo actual pertence
                $is_available_date_recursamiento_semestral = HelperFechasEvaluacion::isAvailableDateSemestral($request->plantel_id);
                //periodo grupo
                $periodo_id = $grupo_recursamiento_semestral->periodo_id;
                if($is_available_date_recursamiento_semestral){ 
                    //recorrido alumnos
                    foreach($request["alumnos"] as $obj){
                        //consultar si el alumno pertenece al recursamiento intersemestrla
                        $is_student_group = $this->isExistStudentInGroupRecursamientoSemestral($obj["alumno_id"], $request->grupo_recursamiento_semestral_id, $request->plantel_id);
                        if($is_student_group){
                            $faltas = null;
                            if(isset($obj["faltas"])){
                                $faltas = $obj["faltas"];
                            }
                            $this->calificarAlumno($obj["alumno_id"], $obj["carrera_uac_id"], $request->plantel_id, $obj["parcial"], $periodo_id, $obj["calificacion"], $faltas, null, null, $request->grupo_recursamiento_semestral_id, null, $docente_plantilla, "RS");
                        }else{
                            /* alumno no pertenece a grupo */
                            return ResponseJson::msg('El alumno que intenta cargar una calificación no pertenece al grupo de recursamiento semestral', 400);
                        }
                    }
                    //$acuse = $this->createAcuse($request);
                    DB::commit();
                    return ResponseJson::msg('Calificaciones cargadas con éxito', 200);
                }else{
                    return ResponseJson::msg('Periodo de recursamiento semestral no se encuentra activo', 400);
                }
            }else{
                return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
            }
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public function storeCalificacionesExtraordinarioFromControlEscolar(StoreCalificacionExtraordinarioRequest $request)
    {
        try {
            DB::beginTransaction();
            if(!HelperPermisoAlcance::isRolControlEscolar()){
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
            if($request["alumnos"]){
                $grupo_extraordinario = Extraordinario::find($request->grupo_extraordinario_id);
                $docente_plantilla = DocentePlantilla::find($grupo_extraordinario->plantilla_docente_id);
                if(!HelperFechasEvaluacion::isAvailableDateExtraordinario($grupo_extraordinario->plantel_id)){
                    return ResponseJson::msg('Periodo de extraordinarios no se encuentra activo', 400);
                } 
                //recorrido alumnos
                foreach($request["alumnos"] as $obj){
                    //consultar si el alumno pertenece al extraordinario
                    $is_student_group = $this->isExistStudentInGroupExtraordinario($obj["alumno_id"], $grupo_extraordinario->id, $grupo_extraordinario->plantel_id);
                    if($is_student_group){
                        $this->calificarAlumno($obj["alumno_id"], $obj["carrera_uac_id"], $grupo_extraordinario->plantel_id, 5, $grupo_extraordinario->periodo_id, $obj["calificacion"], null, null, null, null, $grupo_extraordinario->id, $docente_plantilla, "EXT");
                    }else{
                        /* alumno no pertenece a grupo */
                        return ResponseJson::msg('El alumno que intenta cargar una calificación no pertenece al grupo de extraordinario', 400);
                    }
                }
                DB::commit();
                return ResponseJson::msg('Calificaciones cargadas con éxito', 200);
            }else{
                return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
            }
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public function isMyAsignatura($asignatura_id, $plantel_id, $plantilla_docente_id)
    {
        try {
            $user = auth()->user();
            $usuario_docente = UsuarioDocente::where('usuario_id', $user->id)->first();
            $docente_plantilla = DocentePlantilla::where([
                ['docente_id', $usuario_docente->docente_id],
                ['plantel_id', $plantel_id],
                ['plantilla_estatus', 1]
            ])->first();
            if($docente_plantilla){
                //plantilla de usuario es igual a la request
                if($plantilla_docente_id == $docente_plantilla->id){
                    $docente_asignatura = DocenteAsignatura::where([
                        ['id', $asignatura_id],
                        ['plantilla_docente_id', $docente_plantilla->id]
                    ])->get();
                    if($docente_asignatura->isNotEmpty()){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public function isAsignaturaDocente($asignatura_id, $plantel_id, $plantilla_docente_id)
    {
        try {
            $docente_plantilla = DocentePlantilla::find($plantilla_docente_id);
            if($docente_plantilla){
                $docente_asignatura = DocenteAsignatura::where([
                    ['id', $asignatura_id],
                    ['plantilla_docente_id', $docente_plantilla->id]
                ])->get();
                if($docente_asignatura->isNotEmpty()){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }

    public function isExistPlantelUacDocente($plantel_id, $docente_asignatura_id)
    {
        try {
            $docente_asignatura = DocenteAsignatura::where([
                ['id', $docente_asignatura_id],
                ['plantel_id', $plantel_id]
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

    public function isExistCarreraUacInUacDocente($carrera_uac_id, $docente_asignatura_id, $grupo_periodo_id, $periodo_actual)
    {
        try {
            $docente_asignatura = DocenteAsignatura::where([
                ['id', $docente_asignatura_id],
                ['carrera_uac_id', $carrera_uac_id],
                ['grupo_periodo_id', $grupo_periodo_id]
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

    public function isExistStudentInGroup($alumno_id, $grupo_periodo_id, $carrera_uac_id)
    {
        try {
            /* consultar si el alumno se encuentra en la asignatura del docente */
            $validar_existencia_grupo_periodo = AlumnoGrupo::where([
                ['alumno_id', $alumno_id],
                ['grupo_periodo_id', $grupo_periodo_id],
                ['status', 'Inscrito']
            ])->get();
            if($validar_existencia_grupo_periodo->isNotEmpty()){
                return true;
            }else{
                //verificar en recursamiento
                $validar_existencia_grupo_periodo_recursamiento = AlumnoUacGrupo::where([
                    ['alumno_id', $alumno_id],
                    ['grupo_periodo_id', $grupo_periodo_id],
                    ['carrera_uac_id', $carrera_uac_id]
                ])->get();
                if($validar_existencia_grupo_periodo_recursamiento->isNotEmpty()){
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

    public function isExistGroupInUacDocente($grupo_periodo_id, $carrera_uac_id, $plantel_id, $docente_asignacion_id)
    {
        try {
            /* consultar si el grupo y carrera_uac se encuentra en las asignaturas del docente */
            $validar_existencia_alumno_uac = DocenteAsignatura::where([
                ['grupo_periodo_id', $grupo_periodo_id],
                ['carrera_uac_id', $carrera_uac_id],
                ['plantel_id', $plantel_id],
                ['plantilla_docente_id', $docente_asignacion_id]
            ])->get();
            if($validar_existencia_alumno_uac->isNotEmpty()){
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

    public function isPendienteCalificacionAlumno($parcial, $alumno_id, $grupo_periodo_id, $carrera_uac_id, $periodo_actual_id, $plantel_id)
    {
        try {
            //return $parcial;
            if($parcial < 3){ //si es menor al parcial 3, significa que dejo materias por calificar, de lo contrario nunca se cargo un parcial 3
                //consultar si el alumno tiene calificaciones pendientes de parciales anterior
                $is_available_date = HelperFechasEvaluacion::isDateConfigAvailable($parcial, $plantel_id, $periodo_actual_id); //periodo/fechas de evaluar activas
                if($is_available_date){ //fechas ordinarias activas en el plantel de la asignatura
                    $calificaciones_pendiente = CalificacionUac::where([
                        ['alumno_id', $alumno_id],
                        ['carrera_uac_id', $carrera_uac_id],
                        ['grupo_periodo_id', $grupo_periodo_id],
                        ['periodo_id', $periodo_actual_id],
                        ['parcial', $parcial],
                    ])->get();
                    if($calificaciones_pendiente->isNotEmpty()){
                        foreach($calificaciones_pendiente as $obj){
                            if($parcial == $obj->parcial){
                                if($obj->calificacion == null){
                                    //calificación pendiente
                                    return true;
                                }
                            }
                        }
                    }else{
                        //no tiene calificación,retornar true
                        return true;
                    }
                }else{
                    return false;
                }
            }
            return false;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        }
    }
  
    public function isAsignaturaIntersemestralDocenteGrupoPlantelCarreraUac($asignatura_recursamiento_intersemestral_id, $grupo_recursamiento_intersemestral_id, $plantel_id, $carrera_uac_id, $plantilla_docente_id)
    {
        try {
            $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::where([
                ['id', $asignatura_recursamiento_intersemestral_id],
                ['plantilla_docente_id', $plantilla_docente_id->id],
                ['plantel_id', $plantel_id],
                ['carrera_uac_id', $carrera_uac_id],
                ['grupo_recursamiento_intersemestral_id', $grupo_recursamiento_intersemestral_id]
            ])->first();    
            if($asignatura_recursamiento_intersemestral){
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

    public function isGroupSemestralDocenteGrupoPlantelCarreraUac($grupo_recursamiento_semestral_id, $plantel_id, $carrera_uac_id, $plantilla_docente_id)
    {
        try {
            $grupo_recursamiento_semestral = GrupoRecursamientoSemestral::where([
                ['id', $grupo_recursamiento_semestral_id],
                ['plantilla_docente_id', $plantilla_docente_id->id],
                ['plantel_id', $plantel_id],
                ['carrera_uac_id', $carrera_uac_id],
            ])->first();    
            if($grupo_recursamiento_semestral){
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

    public function isExistStudentInAsignaturaRecursamientoIntersemestral($alumno_id, $grupo_recursamiento_intersemestral_id, $plantel_id)
    {
        try {           
            //grupo recursamiento intersemestral
            $grupo_recursamiento_intersemestral = GrupoRecursamientoIntersemestral::find($grupo_recursamiento_intersemestral_id);
            /* consultar si el grupo y carrera_uac se encuentra en las asignaturas del docente */
            $validar_existencia_alumno_intersemestral = AlumnoGrupoRecursamientoIntersemestral::where([
                ['alumno_id', $alumno_id],
                ['grupo_recursamiento_intersemestral_id', $grupo_recursamiento_intersemestral->id]
            ])->get();
            if($validar_existencia_alumno_intersemestral->isNotEmpty()){
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

    public function isExistStudentInGroupRecursamientoSemestral($alumno_id, $grupo_recursamiento_semestral_id, $plantel_id)
    {
        try {           
            //grupo recursamiento intersemestral
            $grupo_recursamiento_semestral_id = GrupoRecursamientoSemestral::find($grupo_recursamiento_semestral_id);
            /* consultar si el grupo y carrera_uac se encuentra en las asignaturas del docente */
            $validar_existencia_alumno_semestral = AlumnoGrupoRecursamientoSemestral::where([
                ['alumno_id', $alumno_id],
                ['grupo_recursamiento_semestral_id', $grupo_recursamiento_semestral_id->id]
            ])->get();
            if($validar_existencia_alumno_semestral->isNotEmpty()){
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

    public function isExistStudentInGroupExtraordinario($alumno_id, $grupo_extraordinario_id, $plantel_id)
    {
        try {           
            //grupo recursamiento intersemestral
            $grupo_extraordinario = Extraordinario::find($grupo_extraordinario_id);
            /* consultar si el grupo y carrera_uac se encuentra en las asignaturas del docente */
            $validar_existencia_alumno_ext = AlumnoGrupoExtraordinario::where([
                ['alumno_id', $alumno_id],
                ['extraordinario_id', $grupo_extraordinario->id]
            ])->get();
            if($validar_existencia_alumno_ext->isNotEmpty()){
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
 
    public function createAcuse(Request $data)
    {
        try {
            if($data->input()){
                $data_format = json_encode($data->input(), true);
                $fecha_creacion = Carbon::now();
                if($data->grupo_periodo_id){
                    $type_doc = "ACTA DE CALIFICACIONES";
                    $view_acuse = $this->viewAcuse($fecha_creacion, $data_format, $type_doc);
                }else if($data->grupo_recursamiento_intersemestral_id){
                    $type_doc = "CALIFICACIONES RECURSAMIENTO INTERSEMESTRAL";
                    $view_acuse = $this->viewAcuse($fecha_creacion, $data_format, $type_doc);
                }else if($data->grupo_recursamiento_semestral_id){
                    $type_doc = "CALIFICACIONES RECURSAMIENTO SEMESTRAL";
                    $view_acuse = $this->viewAcuse($fecha_creacion, $data_format, $type_doc);
                }else if($data->grupo_extraordinario_id){
                    $type_doc = "CALIFICACIONES EXTRAORDINARIO";
                    $view_acuse = $this->viewAcuse($fecha_creacion, $data_format, $type_doc);
                }
                return $view_acuse;
            }else{
                return ResponseJson::msg('No fue posible ver el acta de calificaciones', 400);
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible ver el acta de calificaciones', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible ver el acta de calificaciones', 400);
        }
    }

    public function viewAcuse($fecha, $data, $type_doc)
    {
        try {
            DB::beginTransaction();
            $data = json_decode($data, true);
            /* busqueda de alumnos por grupo y materia */
            $carrera_uac_query = $data["carrera_uac_id"];
            $plantel_query = $data["plantel_id"];
            /* alumnos a grupados */
            $alumnos = [];
            if($type_doc == 'ACTA DE CALIFICACIONES'){
                $grupo_periodo = GrupoPeriodo::where('id',$data["grupo_periodo_id"])->with([
                    'alumnoUacGrupo' => function($query) use($carrera_uac_query, $plantel_query){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_query]
                        ])->with(['alumno' => function($query){
                            $query->orderBy('usuario_id')->with('usuario');
                        }]);
                    },
                    'alumnoUacGrupo.alumno.calificacionUac' => function($query) use($carrera_uac_query, $plantel_query){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_query],
                            ['plantel_id', $plantel_query],
                        ]);
                    },
                    'alumnos.calificacionUac' => function($query) use($carrera_uac_query, $plantel_query){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_query],
                            ['plantel_id', $plantel_query],
                        ])->orderBy('parcial');
                    },
                    'alumnos' => function($query) {
                        $query->orderBy('usuario_id')->with('usuario');
                    },
                ])->first();
                $grupo = $grupo_periodo->grupo;
                $turno = $grupo_periodo->turno;
                $periodo = Periodo::find($grupo_periodo->periodo_id);
                $semestre = $grupo_periodo->semestre;
                /* a grupar alumnos */
                $grupo_periodo_alumnos = $grupo_periodo->alumnos;
                $grupo_periodo_alumnos_recursamiento = $grupo_periodo->alumnoUacGrupo;
                foreach($grupo_periodo_alumnos as $obj){
                    array_push($alumnos, $obj);

                }
                foreach($grupo_periodo_alumnos_recursamiento as $obj){
                    array_push($alumnos, $obj->alumno);

                }
                $dataSend = $this->mapAcuseData($alumnos, $data["plantel_id"], $data["carrera_uac_id"], $data["docente_asignacion_id"], $periodo, $semestre, $turno, $grupo, $type_doc);
            }else if($type_doc == 'CALIFICACIONES RECURSAMIENTO INTERSEMESTRAL'){
                $grupo_intersemestral = GrupoRecursamientoIntersemestral::findOrFail($data["grupo_recursamiento_intersemestral_id"]);
                $grupo_intersemestral = GrupoRecursamientoIntersemestral::where('id',$data["grupo_recursamiento_intersemestral_id"])->with([
                    'alumnos.calificacionUac' => function($query) use($carrera_uac_query, $plantel_query){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_query],
                            ['tipo_calif', "CI"],
                            ['plantel_id', $plantel_query],
                        ])->orderBy('parcial');
                    },
                    'alumnos' => function($query) {
                        $query->orderBy('usuario_id')->with('usuario');
                    },
                ])->first();
                $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::where('grupo_recursamiento_intersemestral_id', $data["grupo_recursamiento_intersemestral_id"])
                ->with('grupoPeriodo')->first();
                $grupo = $asignatura_recursamiento_intersemestral->grupoPeriodo->grupo;
                $turno = $asignatura_recursamiento_intersemestral->grupoPeriodo->turno;
                $periodo = Periodo::find($grupo_intersemestral->periodo_id);
                $semestre = $grupo_intersemestral->semestre;
                $grupo_alumnos = $grupo_intersemestral->alumnos;
                foreach($grupo_alumnos as $obj){
                    array_push($alumnos, $obj);

                }
                $dataSend = $this->mapAcuseData($alumnos, $data["plantel_id"], $data["carrera_uac_id"], $data["docente_asignacion_id"], $periodo, $semestre, $turno, $grupo, $type_doc);
            }else if($type_doc == 'CALIFICACIONES RECURSAMIENTO SEMESTRAL'){
                $grupo_semestral = GrupoRecursamientoSemestral::findOrFail($data["grupo_recursamiento_semestral_id"]);
                $periodo = Periodo::find($grupo_semestral->periodo_id);
                $grupo_semestral = GrupoRecursamientoSemestral::where('id',$data["grupo_recursamiento_semestral_id"])
                ->with(['alumnoGrupoRecursamientoSemestral' => function($query) use($carrera_uac_query, $plantel_query, $periodo, $data){
                        $query->where('periodo_curso_id', $data["periodo_curso_id"])->with(['alumno.calificacionUac' => function($query) use($carrera_uac_query, $plantel_query, $periodo){
                            $query->where([
                                ['carrera_uac_id', $carrera_uac_query],
                                ['periodo_id', $periodo->id],
                                ['tipo_calif', "RS"],
                                ['plantel_id', $plantel_query],
                            ])->orderBy('parcial');
                        },
                    ]);
                },
                'alumnoGrupoRecursamientoSemestral.alumno' => function($query) {
                    $query->orderBy('usuario_id')->with('usuario');
                },
                'alumnoGrupoRecursamientoSemestral.periodoCurso' => function ($query) use($data){
                    $query->where('id', $data["periodo_curso_id"]);
                },
                'alumnoGrupoRecursamientoSemestral.carreraUacCurso.carrera',
                'alumnoGrupoRecursamientoSemestral.carreraUacCurso.uac'])->first();
                $asignatura_recursamiento_semestral = GrupoRecursamientoSemestral::where('id', $data["grupo_recursamiento_semestral_id"])->with('grupoPeriodo')->first();
                /* alumnos normales */    
                $grupo = $asignatura_recursamiento_semestral->grupoPeriodo->grupo;
                $turno = $asignatura_recursamiento_semestral->grupoPeriodo->turno;
                $periodo = Periodo::find($grupo_semestral->periodo_id);
                $periodo_donde_reprobo = Periodo::find($data["periodo_curso_id"]);
                $semestre = $grupo_semestral->semestre;
                $grupo_alumnos = $grupo_semestral->alumnoGrupoRecursamientoSemestral;
                $alumnos_resagados = [];
                foreach($grupo_alumnos as $obj){
                    if($obj->carrera_uac_curso_id){
                        $resagados = array(
                            'usuario_id' => $obj->alumno->usuario_id,
                            'matricula' => $obj->alumno->matricula,
                            'usuario' => $obj->alumno->usuario,
                            'calificacionUac' => $obj->calificacionesRS,
                            'periodoCurso' => $obj->periodoCurso,
                            'carreraUacCurso' => $obj->carreraUacCurso
                        );
                        array_push($alumnos_resagados, $resagados);
                    }else{
                        $test = array(
                            'usuario_id' => $obj->alumno->usuario_id,
                            'matricula' => $obj->alumno->matricula,
                            'usuario' => $obj->alumno->usuario,
                            'calificacionUac' => $obj->calificacionesRS,
                            'periodoCurso' => $obj->periodoCurso,
                            'carreraUacCurso' => $obj->carreraUacCurso
                        );
                        array_push($alumnos, $test);
                    }
                }
                /* alumnos normal */
                $alumnosTotales = [];
                if(count($alumnos) > 0){
                    $alumnosNormales = [$this->mapAcuseData($alumnos, $data["plantel_id"], $data["carrera_uac_id"], $data["docente_asignacion_id"], $periodo, $semestre, $turno, $grupo, $type_doc, $periodo_donde_reprobo)];
                }else{
                    $alumnosNormales = [];
                }
                /* union de resagados similares */
                $alumnosResagados = [];
                foreach($alumnos_resagados as $obj){
                    $data_send = [$obj];
                    $alumnoMap = $this->mapAcuseData($data_send, $data["plantel_id"], $obj["carreraUacCurso"]["id"], $data["docente_asignacion_id"], $periodo, $semestre, $turno, $grupo, $type_doc, $periodo_donde_reprobo);
                    array_push($alumnosResagados, $alumnoMap);
                }
                /* incliur alumnos normales */
                foreach($alumnosNormales as $obj){
                    array_push($alumnosTotales, $obj);
                }
                /* incliur resagados */
                foreach($alumnosResagados as $obj){
                    array_push($alumnosTotales, $obj);
                }
                $dataSend = $alumnosTotales;
            }else if($type_doc == 'CALIFICACIONES EXTRAORDINARIO'){
                $extraordinario = Extraordinario::findOrFail($data["grupo_extraordinario_id"]);
                $extraordinario = Extraordinario::where('id', $data["grupo_extraordinario_id"])->with([
                    'alumnos.calificacionUac' => function($query) use($carrera_uac_query, $plantel_query){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_query],
                            ['tipo_calif', "EXT"],
                            ['plantel_id', $plantel_query],
                        ]);
                    },
                    'alumnos' => function($query) {
                        $query->orderBy('usuario_id')->with('usuario');
                    },
                ])->first();
                $grupo = $extraordinario->grupoPeriodo->grupo;
                $turno = $extraordinario->grupoPeriodo->turno;
                $periodo = Periodo::find($extraordinario->periodo_id);
                $semestre = $extraordinario->semestre;
                $grupo_alumnos = $extraordinario->alumnos;
                foreach($grupo_alumnos as $obj){
                    array_push($alumnos, $obj);

                }
                $dataSend = $this->mapAcuseData($alumnos, $data["plantel_id"], $data["carrera_uac_id"], $data["docente_asignacion_id"], $periodo, $semestre, $turno, $grupo, $type_doc);
            }
            if($type_doc == 'CALIFICACIONES RECURSAMIENTO SEMESTRAL'){
                $pdf = PDF::loadView('reportesPDF/actaCalificacionesRS', compact('dataSend'))->stream('calificaciones-rs-'.$fecha->toDateString().'.pdf');
            }else if($type_doc == 'CALIFICACIONES RECURSAMIENTO INTERSEMESTRAL'){
                $pdf = PDF::loadView('reportesPDF/actaCalificacionesCI', compact('dataSend'))->stream('calificaciones-ci-'.$fecha->toDateString().'.pdf');
            }else if($type_doc == 'ACTA DE CALIFICACIONES'){
                $pdf = PDF::loadView('reportesPDF/acuseEnviarCalificaciones', compact('dataSend'))->stream('acta-calificacion-'.$fecha->toDateString().'.pdf');
            }else if($type_doc == 'CALIFICACIONES EXTRAORDINARIO'){
                $pdf = PDF::loadView('reportesPDF/actaCalificacionesEXT', compact('dataSend'))->stream('acta-calificacion-ext-'.$fecha->toDateString().'.pdf');
            }
            DB::commit();
            return $pdf;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible generar el acta de calificaciones', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible generar el acta de calificaciones', 400);
        }
    }

    public function mapAcuseData($alumnos, $plantel_id, $carrera_uac_id, $docente_asignacion_id, $periodo, $semestre, $turno, $grupo, $type_doc, $periodo_donde_reprobo = null)
    {
        try {
            /* busqueda de alumnos por grupo y materia */
            /* ordenar alumnos por apellidos */
            usort($alumnos, function($a, $b) {
                return strcasecmp($a['usuario']['primer_apellido'], $b['usuario']['primer_apellido']);
            });
            /* contador de alumnos */
            $count_alumnos = count($alumnos);
            /* añadir alumnos regular y sus calificaciones */
            $calificaciones_alumnos = $this->mapCalificacionTablaAcuse($alumnos, $type_doc);
            /* consultas */
            $plantel = Plantel::where('id', $plantel_id)->with('personal', 'municipio.estado')->first();
            $docente_asignacion = DocentePlantilla::find($docente_asignacion_id);
            $docente = Docente::find($docente_asignacion->docente_id);
            $carrera_uac = CarreraUac::where('id', $carrera_uac_id)->with('uac', 'carrera')->first();
            $meses = array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
            $now = Carbon::now();
            $mes = $meses[($now->format('n')) - 1];
            $fecha_actual = $plantel->municipio->nombre.", ".$plantel->municipio->estado->nombre.', a '.$now->day.' de '.$mes.' del '.$now->year;
            $abreviatura_estado = $plantel->municipio->estado->abreviatura;
            $periodo_mes = explode('-', $periodo->nombre_con_mes)[1];   
            $periodo_mes = explode(' ', $periodo_mes)[1];
            $dataSend = [
                'tipo_doc' => $type_doc,
                'control_escolar' => $plantel->personal,
                'estado' => $plantel->municipio->estado->nombre,
                'abreviatura_estado' => $abreviatura_estado,
                'plantel' => "cct ".$plantel->cct." ".$plantel->nombre,
                'docente' => $docente->segundo_apellido ? $docente->primer_apellido." ".$docente->segundo_apellido." ".$docente->nombre :
                $docente->primer_apellido." ".$docente->nombre,
                'asignatura' =>  $carrera_uac->uac->clave_uac."-".$carrera_uac->uac->nombre,
                'carrera' =>  $carrera_uac->carrera->clave_carrera."-".$carrera_uac->carrera->nombre,
                'semestre' => $semestre,
                'grupo' => $grupo,
                'turno' => $turno,
                'periodo' => $periodo->nombre_con_mes,
                'periodo_mes' => $periodo_mes,
                'fecha_acuse' => $fecha_actual,
                'num_alumnos' => $count_alumnos,
                'alumnos' => $alumnos,
                'calificaciones' => $calificaciones_alumnos
            ];
            if($periodo_donde_reprobo){
                $dataSend["periodo_donde_reprobo"] = $periodo_donde_reprobo->nombre_con_mes;
            }
            return $dataSend;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible generar el acta de calificaciones', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible generar el acta de calificaciones', 400);
        }
    }

    public function mapCalificacionTablaAcuse($alumnos, $type_doc)
    {
        try {
            $calificacionesArray = [];
            foreach($alumnos as $alumno){
                $count = 0; //contador para identificar ultimo parcial añadido
                $countCalificaciones = 0; //contador de calificaciones insertadas
                $parciales = [];
                $lastParcial = ["0"];
                foreach($alumno["calificacionUac"] as $calificacion){
                    if($type_doc == 'ACTA DE CALIFICACIONES'){
                        if($calificacion->tipo_calif != 'CI' && $calificacion->tipo_calif != 'RS'){ //calificaciones curso normal
                            $count ++; /* contador de calificacion por parcial */
                            array_push($lastParcial, $calificacion->parcial); /* ultimo parcial insertado */
                            if(!in_array($calificacion->parcial, $parciales)){ /* evitar repetir parciales */
                                array_push($parciales, $calificacion->parcial);
                            }
                            if($lastParcial[$count-1] == $calificacion->parcial){
                                /* si no se encuentra en el ultimo parcial */
                            }else{
                                $faltas = $calificacion->faltas ? $calificacion->faltas : 0; //faltas
                                $countCalificaciones++; //contador calificaciones encontradas
                                $nueva_calificacion = array("alumno_id" => $alumno->usuario_id, "parcial" => $calificacion->parcial, "calificacion" => $calificacion->calificacion, "faltas" => $faltas);
                                array_push($calificacionesArray, $nueva_calificacion); /* calificacion alumno */
        
                            }
                        }
                    }else if($type_doc == 'CALIFICACIONES RECURSAMIENTO INTERSEMESTRAL'){
                        $count ++; /* contador de calificaciones por parcial */
                        $countCalificaciones++;
                        if($calificacion->parcial == 6){
                            $parcial = 4;
                        }else{
                            $parcial = $calificacion->parcial;
                        }
                        array_push($lastParcial, $parcial); /* ultimo parcial insertado */
                        if(!in_array($parcial, $parciales)){ /* evitar repetir parciales */
                            array_push($parciales, $parcial);
                        }
                        if($lastParcial[$count-1] == $parcial){
                            /* si no se encuentra en el ultimo parciañ */
                        }else{
                            $faltas = $calificacion->faltas ? $calificacion->faltas : 0; //faltas
                            $nueva_calificacion = array("alumno_id" => $alumno->usuario_id, "parcial" => $parcial, "calificacion" => $calificacion->calificacion, "faltas" => $faltas);
                            array_push($calificacionesArray, $nueva_calificacion); /* calificacion alumno */
                        }
                    }else if($type_doc == 'CALIFICACIONES RECURSAMIENTO SEMESTRAL'){
                        $count ++; /* contador de calificaciones por parcial */
                        $countCalificaciones++;
                        if($calificacion["parcial"] == 4){
                            $parcial = 4;
                        }else{
                            $parcial = $calificacion["parcial"];
                        }
                        array_push($lastParcial, $parcial); /* ultimo parcial insertado */
                        if(!in_array($parcial, $parciales)){ /* evitar repetir parciales */
                            array_push($parciales, $parcial);
                        }
                        if($lastParcial[$count-1] == $parcial){
                            /* si no se encuentra en el ultimo parciañ */
                        }else{
                            $faltas = $calificacion["faltas"] ? $calificacion["faltas"] : 0; //faltas
                            $nueva_calificacion = array("alumno_id" => $alumno["usuario_id"], "parcial" => $parcial, "calificacion" => $calificacion["calificacion"], "faltas" => $faltas);
                            array_push($calificacionesArray, $nueva_calificacion); /* calificacion alumno */
                        }
                    }else if($type_doc == 'CALIFICACIONES EXTRAORDINARIO'){
                        $count ++; /* contador de calificaciones por parcial */
                        $countCalificaciones++;
                        $parcial = 5;
                        array_push($lastParcial, $parcial); /* ultimo parcial insertado */
                        if(!in_array($parcial, $parciales)){ /* evitar repetir parciales */
                            array_push($parciales, $parcial);
                        }
                        if($lastParcial[$count-1] == $parcial){
                            /* si no se encuentra en el ultimo parciañ */
                        }else{
                            $faltas = $calificacion->faltas ? $calificacion->faltas : 0; //faltas
                            $nueva_calificacion = array("alumno_id" => $alumno->usuario_id, "parcial" => $parcial, "calificacion" => $calificacion->calificacion, "faltas" => $faltas);
                            array_push($calificacionesArray, $nueva_calificacion); /* calificacion alumno */
                        }
                    }
                }
                if($countCalificaciones < 5){/* si le faltan calificaciones por parcial */
                    for($i = 1; $i <= 5; $i++){
                        if (!in_array($i, $parciales)) {
                            /* si no cuenta con parcial calificado añadir 0 por defecto */
                            /* agregar parcial con 0 */
                            $nueva_calificacion = array("alumno_id" => $alumno["usuario_id"], "parcial" => $i, "calificacion" => "-", "faltas" => "-");
                            array_push($calificacionesArray, $nueva_calificacion);
                        }
                    }
                }
            }
            /* sort calificaciones parciales */
            usort($calificacionesArray, function ($a, $b) {
                return $a['parcial'] <=> $b['parcial'];
            });
            return $calificacionesArray;
        } catch(ModelNotFoundException $e) {
            return null;
        } catch(QueryException $e) {
            return null;
        } 
    }
}
