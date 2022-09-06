<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreRecursamientoSemestralRequest;
use App\GrupoRecursamientoSemestral;
use App\AlumnoGrupoRecursamientoSemestral;
use App\ConfigRecursamientoSemestral;
use App\DocenteAsignatura;
use App\DocentePlantilla;
use App\UAC;
use App\CarreraUac;
use App\Alumno;
use App\Docente;
use App\Usuario;
use App\UsuarioDocente;
use App\AlumnoGrupo;
use App\Periodo;
use App\PlantelCarrera;
use App\GrupoPeriodo;
use App\CalificacionUac;
use Carbon\Carbon;
use App\Traits\AuditoriaLogHelper;
use App\Traits\CalificarPromediarTrait;
use Sisec;
use ResponseJson;
use ValidationsDocente;
use HelperPermisoAlcance;
use HelperFechasEvaluacion;

class RecursamientoSemestralController extends Controller
{
    use AuditoriaLogHelper, CalificarPromediarTrait;

    public function store(StoreRecursamientoSemestralRequest $request)
    {
        try {
            DB::beginTransaction();
            /* consultar periodo */
            $periodo_actual = Sisec::periodoActual();
            if($request->periodo_id){
                $periodo_id = $request->periodo_id;
               /*  $permisos = HelperPermisoAlcance::getPermisos();
                if(in_array('Plantel', $permisos)){ //evaluar nivel de alcance
                    $periodo_id = $periodo_actual->id;    
                } */
            }else{
                $periodo = Sisec::periodoActual();
                $periodo_id = $periodo->id;
            }
            $grupo_periodo = GrupoPeriodo::findOrFail($request->grupo_periodo_id);
            if(!HelperFechasEvaluacion::isAvailableDateSemestral($request->plantel_id, $periodo_actual->id)){
                return ResponseJson::msg('Las fechas de configuración para recursamientos semestrales se encuentra fuera de tiempo', 400);    
            }
            /* configuraciones semestral */
            $grupo_semestral_config = ConfigRecursamientoSemestral::where([
                ['plantel_id', $request->plantel_id],
                ['periodo_id', $periodo_actual->id]
            ])->first();
            //consultar si el semestre se imparte en la asignatura
            if(!$this->isCanSemestreInAsignatura($grupo_periodo->semestre, $request->carrera_uac_id)){
                return ResponseJson::msg('La asignatura no se imparte en el semestre', 400);                                        
            }
            //consultar tipo de semestre
            if(!$this->isAvailableSemestre($grupo_periodo->semestre, $periodo_id)){
                return ResponseJson::msg('El semestre del grupo seleccionado, no se cursa en el periodo seleccionado', 400);    
            }
            /* crear grupo recursamiento */
            if(!$this->existGroup($periodo_id, $grupo_periodo->id, $grupo_periodo->semestre, $request->carrera_uac_id, $request->plantel_id, $request->docente_asignacion_id)){
                $grupo_semestral = GrupoRecursamientoSemestral::create([
                    'grupo_periodo_id' => $request->grupo_periodo_id,
                    'carrera_uac_id' => $request->carrera_uac_id,
                    'estatus' => 1,
                    'plantilla_docente_id' => $request->docente_asignacion_id,
                    'semestre' => $grupo_periodo->semestre, 
                    'max_alumnos' => $grupo_semestral_config->max_alumnos, 
                    'plantel_id' => $request->plantel_id,
                    'periodo_id' => $periodo_id
                ]);
                $this->auditoriaSave($grupo_semestral); /* adutoria log */ 
            }else{
                return ResponseJson::msg('El grupo de recursamiento semestral ya se encuentra registrado', 400);
            }
            /* insertar alumnos al grupo */
            foreach($request["alumnos"] as $obj){
                /* alumno para mensaje de error */
                $alumno_response = Alumno::where('usuario_id', $obj["alumno_id"])->with('usuario')->first();
                /* validar carrera uac curso _id */
                $carrera_uac_curso_id = null;
                if(isset($obj["carrera_uac_id"])){
                    if($request->carrera_uac_id != $obj["carrera_uac_id"]){
                        $carrera_uac_curso_id = $obj["carrera_uac_id"];
                    }
                }
                /* variable para consultar calificacion */
                $carrera_uac_validar_id = $carrera_uac_curso_id ?? $request->carrera_uac_id;
                /* consultar estatus alumno */
                if($alumno_response->estatus_inscripcion != "Activo"){
                    //return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no se encuentra inscrito actualmente', 400);  
                }
                //consultar si el alumno esta ya en el grupo de recursamiento
                if($this->studentExistInGroup($alumno_response->usuario_id, $grupo_semestral->id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' ya se encuentra en el grupo de recursamiento semestral', 400);  
                }
                //consultar si el alumno ya esta recursando la asignatura carrera_uac_id
                if($this->studentExistInCarreraUac($obj["alumno_id"], $request->carrera_uac_id, $periodo_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' ya se encuentra cursando la asignatura en recursamiento semestral', 400);  
                }
                //consultar si el alumno tiene la materia reprobada en su historial
                $testAlumno = $this->isNotApprovedStudent($obj["alumno_id"], $carrera_uac_validar_id, $periodo_id);
                if($testAlumno == 1){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar la asignatura en recursamiento semestral, su periodo donde curso debe ser al menos un año despues para ser candidato a recursamiento', 400);  
                }else if($testAlumno == 0){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar la asignatura en recursamiento semestral', 400);  
                }
                //consultar si el alumno es del plantel del grupo
                if(!$this->isHavePlantel($obj["alumno_id"], $request->plantel_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no pertenece al plantel de la asignatura de recursamiento semestral', 400);    
                }
                $is_espacio_grupo = $this->isEspacioDisponible($obj["alumno_id"], $grupo_semestral->id, $grupo_semestral_config->max_alumnos);
                $periodo_curso_uac_id = $this->getPeriodoCursoUac($obj["alumno_id"], $carrera_uac_validar_id);
                if(!$periodo_curso_uac_id){
                    $periodo_curso_uac_id = $periodo_id;
                }
                if($is_espacio_grupo){
                    $alumnos = AlumnoGrupoRecursamientoSemestral::create([
                        'alumno_id' => $obj["alumno_id"],
                        'grupo_recursamiento_semestral_id' => $grupo_semestral->id,
                        'periodo_curso_id' => $periodo_curso_uac_id,
                        'carrera_uac_curso_id' => $carrera_uac_curso_id
                    ]);
                }else{
                    return ResponseJson::msg('El máximo de alumnos permitidos dentro del grupo semestral es de '.$grupo_semestral_config->max_alumnos, 400);   
                }
            }
            DB::commit();
            return ResponseJson::data($grupo_semestral, 200);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible agregar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible agregar la asignatura recursamiento semestral', 400);
        }
    }

    public function update(StoreRecursamientoSemestralRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            /* consultar periodo */
            $periodo_actual = Sisec::periodoActual();
            $grupo_recursamiento_semestral = GrupoRecursamientoSemestral::findOrFail($id);
            $periodo_id = $grupo_recursamiento_semestral->periodo_id;
            if($grupo_recursamiento_semestral->estatus != 1){
                throw new ModelNotFoundException();
            }
            $grupo_periodo = GrupoPeriodo::findOrFail($request->grupo_periodo_id);
            //fecha solicitud
            if(!HelperFechasEvaluacion::isAvailableDateSemestral($request->plantel_id, $periodo_actual->id)){
                return ResponseJson::msg('Las fechas de configuración para recursamientos semestrales se encuentra fuera de tiempo', 400);    
            }
            /* configuraciones semestral */
            $grupo_semestral_config = ConfigRecursamientoSemestral::where([
                ['plantel_id', $request->plantel_id],
                ['periodo_id', $periodo_actual->id]
            ])->first();
            //valores que no cambian
            if(!$this->IsParamsUpdateCheck($grupo_recursamiento_semestral, $request)){
                return ResponseJson::msg('No se puede modificar este valor', 400);
            }
            //consultar si el semestre se imparte en la asignatura
            if(!$this->isCanSemestreInAsignatura($grupo_periodo->semestre, $grupo_recursamiento_semestral->carrera_uac_id)){
                return ResponseJson::msg('La asignatura no se imparte en el semestre', 400);   
            }
            $carrera_uac = CarreraUac::where('id', $grupo_recursamiento_semestral->carrera_uac_id)->first();
            //checar si son los mismos alumnos del grupo, eliminar alumnos que ya no esten en el grupo
            $is_same_students = $this->isSameStudents($request["alumnos"], $grupo_recursamiento_semestral);  
            $alumnos_nuevos = $this->alumnosNuevosGrupo($request["alumnos"], $grupo_recursamiento_semestral->id);
            foreach($alumnos_nuevos as $obj){
                //alumno para mensaje de error
                $alumno_response = Alumno::where('usuario_id', $obj["alumno_id"])->with('usuario')->first();
                /* validar carrera uac curso _id */
                $carrera_uac_curso_id = null;
                if(isset($obj["carrera_uac_id"])){
                    if($grupo_recursamiento_semestral->carrera_uac_id != $obj["carrera_uac_id"]){
                        $carrera_uac_curso_id = $obj["carrera_uac_id"];
                    }
                }
                /* variable para consultar calificacion */
                $carrera_uac_validar_id = $carrera_uac_curso_id ?? $grupo_recursamiento_semestral->carrera_uac_id;
                //consultar si el alumno tiene la materia reprobada en su historial
                $testAlumno = $this->isNotApprovedStudent($obj["alumno_id"], $carrera_uac_validar_id, $periodo_id);
                if($testAlumno == 1){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar la asignatura en recursamiento semestral, su periodo donde curso debe ser al menos un año despues para ser candidato a recursamiento', 400);  
                }else if($testAlumno == 0){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar la asignatura en recursamiento semestral', 400);  
                }
                //consultar si el alumno esta en una asignatura semestral
                if($this->isInInterSemestral($obj["alumno_id"], $grupo_recursamiento_semestral)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' ya se encuentra cursando la asignatura en recursamiento semestral', 400);  
                }
                //consultar si el alumno es del plantel del grupo
                if(!$this->isHavePlantel($obj["alumno_id"], $request->plantel_id)){
                    return ResponseJson::msg('El plantel del grupo de recursamiento semestral no pertenece al alumno', 400);
                }
                //espacio en grupo
                if(!$this->isEspacioDisponible($obj["alumno_id"], $grupo_recursamiento_semestral->id, $grupo_semestral_config->max_alumnos)){
                    return ResponseJson::msg('El máximo de alumnos permitidos dentro del grupo semestral es de '.$$grupo_semestral_config->max_alumnos, 400);
                }
                //añadir alumno
                $periodo_curso_uac_id = $this->getPeriodoCursoUac($obj["alumno_id"], $carrera_uac_validar_id);
                if(!$periodo_curso_uac_id){
                    $periodo_curso_uac_id = $grupo_recursamiento_semestral->periodo_id;
                }
                $alumnos = AlumnoGrupoRecursamientoSemestral::create([
                    'alumno_id' => $obj["alumno_id"],
                    'grupo_recursamiento_semestral_id' => $grupo_recursamiento_semestral->id,
                    'periodo_curso_id' => $periodo_curso_uac_id,
                    'carrera_uac_curso_id' => $carrera_uac_curso_id
                ]);
            }
            DB::commit();
            return ResponseJson::data($grupo_recursamiento_semestral, 200);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible modificar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible modificar la asignatura recursamiento semestral', 400);
        }
    }
    
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $semestral = GrupoRecursamientoSemestral::findOrFail($id);
            /* if not exist */
            if($semestral->estatus != 1){ /* si es diferen1*/
                throw new ModelNotFoundException();
            }
            $old_semestral = $semestral;
            $semestral = GrupoRecursamientoSemestral::findOrFail($id);
            /* carrera uac recursamiento */
            $carrera_uac = CarreraUac::find($semestral->carrera_uac_id);
            //borrar relacion grupo alumno
            $alumnos_grupo  = AlumnoGrupoRecursamientoSemestral::where('grupo_recursamiento_semestral_id', $semestral->id)->get();
            foreach($alumnos_grupo as $obj){
                //buscar calificaciones semestral con carrera que curso
                if($obj->carrera_uac_curso_id){
                    $calificacion_semestral = CalificacionUac::where([
                        ['alumno_id', $obj->alumno_id],
                        ['carrera_uac_id', $obj->carrera_uac_curso_id],
                        ['periodo_id', $semestral->periodo_id],
                        ['tipo_calif', 'RS']
                    ])->get();
                    foreach($calificacion_semestral as $calificacion){
                        //eliminar calificaciones
                        /* comprobar si pertenece a un modulo */
                        $carrera_uac = CarreraUac::find($calificacion->carrera_uac_id);
                        if($carrera_uac){
                            $uac = UAC::find($carrera_uac->uac_id);
                            if($uac->modulo_id){
                                /* submodulo */
                                $carrera_uac_modulo = CarreraUac::where([
                                    ['carrera_id', $carrera_uac->carrera_id],
                                    ['uac_id', $uac->modulo_id]
                                ])->first();
                                if($carrera_uac_modulo){
                                    /* buscar calificaciones del modulo relacionado */
                                    $calificaciones_modulos = CalificacionUac::where([
                                        ['alumno_id', $obj->alumno_id],
                                        ['carrera_uac_id', $carrera_uac_modulo->id],
                                        ['periodo_id', $semestral->periodo_id],
                                        ['tipo_calif', 'RS']
                                    ])->get();
                                    foreach($calificaciones_modulos as $calificacion_modulo){
                                        $calificacion_modulo->delete();
                                        $this->auditoriaSave($calificacion_modulo); /* adutoria log */
                                    }
                                }
                            }
                        }
                        $calificacion->delete();
                        $this->auditoriaSave($calificacion); /* adutoria log */
                    }
                }else{
                    /* carrera uac grupo */
                    $calificacion_semestral = CalificacionUac::where([
                        ['alumno_id', $obj->alumno_id],
                        ['carrera_uac_id', $carrera_uac->id],
                        ['periodo_id', $semestral->periodo_id],
                        ['tipo_calif', 'RS']
                    ])->get();
                    foreach($calificacion_semestral as $calificacion){
                        //eliminar calificaciones
                        /* comprobar si pertenece a un modulo */
                        $carrera_uac = CarreraUac::find($calificacion->carrera_uac_id);
                        if($carrera_uac){
                            $uac = UAC::find($carrera_uac->uac_id);
                            if($uac->modulo_id){
                                /* submodulo */
                                $carrera_uac_modulo = CarreraUac::where([
                                    ['carrera_id', $carrera_uac->carrera_id],
                                    ['uac_id', $uac->modulo_id]
                                ])->first();
                                if($carrera_uac_modulo){
                                    /* buscar calificaciones del modulo relacionado */
                                    $calificaciones_modulos = CalificacionUac::where([
                                        ['alumno_id', $obj->alumno_id],
                                        ['carrera_uac_id', $carrera_uac_modulo->id],
                                        ['periodo_id', $semestral->periodo_id],
                                        ['tipo_calif', 'RS']
                                    ])->get();
                                    foreach($calificaciones_modulos as $calificacion_modulo){
                                        $calificacion_modulo->delete();
                                        $this->auditoriaSave($calificacion_modulo); /* adutoria log */
                                    }
                                }
                            }
                        }
                        $calificacion->delete();
                        $this->auditoriaSave($calificacion); /* adutoria log */
                    }
                }
                //cambio estatus alumno
                $this->checkStatusStudent($obj->alumno_id, true);
                //eliminacion de relacion alumno
                $obj->delete();
                $this->auditoriaSave($obj); /* adutoria log */
            }
            //borrar recursamiento
            $semestral->delete();
            $this->auditoriaSave($semestral); /* adutoria log */
            DB::commit();
            return ResponseJson::data($semestral, 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function show($id)
    {
        try {
            $user = auth()->user();
            $is_control_escolar = HelperPermisoAlcance::isRolControlEscolar($user);
            if($is_control_escolar){
                /* consultar estatus del docente */
                $grupo_recursamiento_semestral = GrupoRecursamientoSemestral::findorFail($id);
                /* comprobar permisos */
                $permisos = HelperPermisoAlcance::getPermisos();
                /* if(in_array('Plantel', $permisos)){ //evaluar nivel de alcance
                    //consultar periodo de la asignatura
                    $is_available_asignatura = ValidationsDocente::isAvailableAsignaturaRecursamientoSemestralByPeriod($grupo_recursamiento_semestral);
                    if(!$is_available_asignatura){
                        throw new ModelNotFoundException();
                    }
                } */
                //consultar estatus de la asignatura recursamiento
                $is_available_asignatura_recursamiento = ValidationsDocente::isAvailableAsignaturaRecursamientoSemestralByEstatus($grupo_recursamiento_semestral);
                if($is_available_asignatura_recursamiento){
                    /* alcance usuario */
                    $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
                    $permisos = HelperPermisoAlcance::getPermisos();
                    if(in_array('Nacional', $permisos)){ //evaluar nivel de alcance para ver materias
                        $grupo_recursamiento_semestral = $this->getRecursamientoFromId($grupo_recursamiento_semestral);
                    }else{
                        $grupo_recursamiento_semestral = $this->getAsignaturaFromAlcance($planteles_alacance, $grupo_recursamiento_semestral);
                    }
                    return ResponseJson::data($grupo_recursamiento_semestral, 200);
                }else{
                    throw new ModelNotFoundException();
                }
            }else{
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la asignatura de recursamiento semestral', 400);
        }
    }

    public function showFromDocente($id)
    {
        try {
            /* docente_id */
            $user = auth()->user();
            $is_control_escolar = HelperPermisoAlcance::isRolControlEscolar($user);
            if($is_control_escolar){
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
            /* consultar estatus del docente */
            $grupo_recursamiento_semestral = GrupoRecursamientoSemestral::findorFail($id);
            //consultar periodo asignatura
            $is_available_asignatura = ValidationsDocente::isAvailableAsignaturaRecursamientoSemestralByPeriod($grupo_recursamiento_semestral);
            if(!$is_available_asignatura){
                throw new ModelNotFoundException();
            }
            /* consultar si al docente le pertenece la asignatura semestral */
            $docente_is_my_uac_intersemestral = ValidationsDocente::isDocenteMyUacSemestral($grupo_recursamiento_semestral, $user);
            if($docente_is_my_uac_intersemestral){
                $is_available_docente_docente = ValidationsDocente::isAvailableDocenteFromAsignacion($grupo_recursamiento_semestral->plantilla_docente_id);
                if($is_available_docente_docente){
                    $is_available_asignatura_recursamiento = ValidationsDocente::isAvailableAsignaturaRecursamientoSemestralByEstatus($grupo_recursamiento_semestral);
                    if($is_available_asignatura_recursamiento){
                        $grupo_recursamiento_semestral = $this->getRecursamientoFromId($grupo_recursamiento_semestral);
                    }else{
                        throw new ModelNotFoundException();    
                    }
                }else{
                    throw new ModelNotFoundException();
                }
            }else{
                throw new ModelNotFoundException();
            }
            return ResponseJson::data($grupo_recursamiento_semestral, 200);
           
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la asignatura de recursamiento semestral', 400);
        }
    }    

    public function getPeriodoCursoUac($alumno_id, $carrera_uac_id)
    {
        try {
            $calificacion = CalificacionUac::where([
                    ['carrera_uac_id', $carrera_uac_id],
                    ['alumno_id', $alumno_id],
                    ['parcial', '4'],
                    ['calificacion', '<' , 6]
            ])->orderBy('id', 'DESC')->get();
            if(count($calificacion) > 0){
                return $calificacion[0]["periodo_id"];
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function existGroup($periodo_actual_id, $grupo_periodo_id, $semestre, $carrera_uac_id, $plantel_id, $docente_asignacion_id)
    {
        try {
            $grupo_semestral = GrupoRecursamientoSemestral::where([
                ['grupo_periodo_id' , $grupo_periodo_id],
                ['carrera_uac_id' , $carrera_uac_id],
                ['plantilla_docente_id', $docente_asignacion_id],
                ['semestre' , $semestre], 
                ['plantel_id' , $plantel_id],
                ['periodo_id' , $periodo_actual_id]
           ])->first();
           return $grupo_semestral;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function studentExistInCarreraUac($alumno_id, $carrera_uac_id, $periodo_actual_id)
    {
        try {
            $grupos_semestrales = GrupoRecursamientoSemestral::where([
                ['periodo_id' , $periodo_actual_id],
                ['carrera_uac_id', $carrera_uac_id]
           ])->get();
           foreach($grupos_semestrales as $grupo_semestral){
                $alumnos_grupo_semestral = AlumnoGrupoRecursamientoSemestral::where([
                    ['grupo_recursamiento_semestral_id', $grupo_semestral->id],
                    ['alumno_id', $alumno_id]
                ])->first();
                if($alumnos_grupo_semestral){
                    return true;
                }
           }
           return false;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function studentExistInGroup($alumno_id, $grupo_semestral_id)
    {
        try {
           $grupo_semestral = GrupoRecursamientoSemestral::find($grupo_semestral_id);
           $grupo_alumnos_semestral = AlumnoGrupoRecursamientoSemestral::where([
               ['grupo_recursamiento_semestral_id', $grupo_semestral->id],
               ['alumno_id', $alumno_id]
           ])->get();
           if(count($grupo_alumnos_semestral) > 0){
                return true;
           }else{
               return false;
           }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }
    
    public function isSameStudents($alumnos_request, $grupo_semestral)
    {
        try {
            //relacion alumno con grupo
            $alumnos_grupo = AlumnoGrupoRecursamientoSemestral::where('grupo_recursamiento_semestral_id', $grupo_semestral->id)->get();
            $alumnos_inscritos = []; //arreglo de alumnos en el grupo
            foreach($alumnos_grupo as $obj){
                array_push($alumnos_inscritos, $obj->alumno_id);   
            }
            $alumnos_array = []; //alumnos request
            foreach($alumnos_request as $obj){
                array_push($alumnos_array, $obj["alumno_id"]);   
            }
            $alumnos_eliminar = []; //alumno a eliminar
            foreach($alumnos_inscritos as $obj){
                if(!in_array($obj, $alumnos_array)){
                    array_push($alumnos_eliminar, $obj);
                }
            }
            /* carrera uac */
            $carrera_uac = CarreraUac::find($grupo_semestral->carrera_uac_id);
            //comprobar que el alumno a eliminar no cuente con calificaciones del curso
            $alumnos_grupo = AlumnoGrupoRecursamientoSemestral::where([
                ['grupo_recursamiento_semestral_id', $grupo_semestral->id],
            ])->whereIn('alumno_id', $alumnos_eliminar)->get();
            if($alumnos_grupo->isNotEmpty()){
                //buscar calificaciones del curso
                foreach($alumnos_grupo as $obj){
                    $carrera_uac_id = $obj->carrera_uac_curso_id ?? $carrera_uac->id;
                    /* si el alumno tiene carrera normal */
                    $calificaciones_semestrales = CalificacionUac::where([
                        ['periodo_id', $grupo_semestral->periodo_id],
                        ['alumno_id', $obj->alumno_id],
                        ['carrera_uac_id', $carrera_uac_id],
                        ['plantel_id', $grupo_semestral->plantel_id],
                        ['tipo_calif', 'RS']
                    ])->get();
                    if($calificaciones_semestrales->isNotEmpty()){
                        /* eliminar calificaciones */
                        foreach($calificaciones_semestrales as $calificacion){
                            /* comprobar si es tipo modulos */
                            $carrera_uac = CarreraUac::find($calificacion->carrera_uac_id);
                            if($carrera_uac){
                                $uac = UAC::find($carrera_uac->uac_id);
                                if($uac->modulo_id){
                                    /* submodulo */
                                    $carrera_uac_modulo = CarreraUac::where([
                                        ['carrera_id', $carrera_uac->carrera_id],
                                        ['uac_id', $uac->modulo_id]
                                    ])->first();
                                    if($carrera_uac_modulo){
                                        /* buscar calificaciones del modulo relacionado */
                                        $calificaciones_modulos = CalificacionUac::where([
                                            ['periodo_id', $grupo_semestral->periodo_id],
                                            ['alumno_id', $obj->alumno_id],
                                            ['carrera_uac_id', $carrera_uac_modulo->id],
                                            ['plantel_id', $grupo_semestral->plantel_id],
                                            ['tipo_calif', 'RS']
                                        ])->get();
                                        foreach($calificaciones_modulos as $calificacion_modulo){
                                            $calificacion_modulo->delete();
                                            $this->auditoriaSave($calificacion_modulo); /* adutoria log */
                                        }
                                    }
                                }
                            }
                            /* eliminar calificacion */
                            $calificacion->delete();
                            $this->auditoriaSave($calificacion); /* adutoria log */
                        }
                    }
                    //cambio estatus alumno
                    $this->checkStatusStudent($obj->alumno_id, true);
                    /* eliminar alumno grupo */
                    $obj->delete();
                    $this->auditoriaSave($obj); /* adutoria log */ 
                }
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function alumnosNuevosGrupo($alumnos_request, $grupo_semestral_id)
    {
        try {
            //relacion alumno con grupo
            $alumnos_grupo = AlumnoGrupoRecursamientoSemestral::where('grupo_recursamiento_semestral_id', $grupo_semestral_id)->get();
            $alumnos_inscritos = []; //arreglo de alumnos en el grupo
            foreach($alumnos_grupo as $obj){
                array_push($alumnos_inscritos, $obj->alumno_id);   
            }
            $alumnos_array = []; //alumnos request
            foreach($alumnos_request as $obj){
                array_push($alumnos_array, $obj);   
            }
            $alumnos_nuevos = []; //alumno a eliminar
            foreach($alumnos_array as $obj){
                if(!in_array($obj["alumno_id"], $alumnos_inscritos)){
                    array_push($alumnos_nuevos, $obj);
                }
            }
            return $alumnos_nuevos;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function IsParamsUpdateCheck($grupo_recursamiento_semestral, $request)
    {
        try {
            $grupo_semestral = GrupoRecursamientoSemestral::find($grupo_recursamiento_semestral->id);
            if($grupo_semestral->plantel_id != $request->plantel_id){
                return false;
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function isAvailableSemestre($semestre, $periodo_id)
    {
        try {
            $periodo = Periodo::find($periodo_id);
            $numero_periodo = explode('/', $periodo->nombre)[1];
            $semestres = ($numero_periodo == '2') ? [2,4,6] : [1,3,5];
            if(in_array($semestre, $semestres)){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function isEspacioDisponible($alumno_id, $grupo_semestral_id, $max_alumnos)
    {
        try {
            $grupo_semestral = GrupoRecursamientoSemestral::where('id', $grupo_semestral_id)
            ->with('alumnos')
            ->first();
            if($grupo_semestral){
                if($grupo_semestral->alumnos->isNotEmpty()){
                    $count = 0;
                    foreach($grupo_semestral->alumnos as $obj){
                        $count ++;
                        if($count >= $max_alumnos){
                            return false;
                        }
                    }
                }else{
                    return true;
                }
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function isCanSemestreInAsignatura($semestre, $carrera_uac_id)
    {
        try {
          $carrera_uac = CarreraUac::find($carrera_uac_id);
          if($carrera_uac->semestre != $semestre){
              return false;
          }
          return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function isNotApprovedStudent($alumno_id, $carrera_uac_id, $periodo_actual_id)
    {
        try {
            $calificacion_alumno = CalificacionUac::where([
                ['carrera_uac_id', $carrera_uac_id],
                ['alumno_id', $alumno_id],
                ['parcial', '>=', '4']
            ])->orderBy('id', 'DESC')->get();
            if(count($calificacion_alumno) > 0){
                foreach($calificacion_alumno as $calificacion){
                    if($calificacion->calificacion < 6){
                        if($calificacion->periodo_id == $periodo_actual_id){
                            return 1; //el perido debe ser diferente al que reprobo para recursar
                        }
                        return 2; //alumno candidato y reprobado
                    }else{
                        return 0; //alumno aprobado
                    }
                }
            }else{
                return 3; //alumno no llevo la materia, candidato
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function isInInterSemestral($alumno_id, $grupo_semestral)
    {
        try {
            $alumnos_grupo_semestral = AlumnoGrupoRecursamientoSemestral::where([
                ['grupo_recursamiento_semestral_id', $grupo_semestral],
                ['alumno_id', $alumno_id]
            ])->first();
            if($alumnos_grupo_semestral){
                return true;
            }
            return false;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function isHavePlantel($alumno_id, $plantel_id)
    {
        try {
            $alumno = Alumno::where('usuario_id', $alumno_id)->first();
            if($alumno->plantel_id == $plantel_id){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento semestral', 400);
        }
    }

    public function getRecursamientoFromId($grupo_recursamiento_semestral)
    {
        $fecha_actual = Carbon::now()->toDateString();
        $periodo_actual = Sisec::periodoActual();
        $periodo_actual_id = $periodo_actual->id;
        $carrera_uac_id = $grupo_recursamiento_semestral->carrera_uac_id;
        $plantel_id = $grupo_recursamiento_semestral->plantel_id;
        $grupo_recursamiento_semestral = GrupoRecursamientoSemestral::where([
            ['id', $grupo_recursamiento_semestral->id],
            ['estatus', 1]
        ])->with([
            //docente
            'plantillaDocente.docente',
            //periodo
            'periodo',
            //carrera uac
            'carreraUac',
            'carreraUac.uac',
            'carreraUac.carrera',
            'periodo',
            'plantel.municipio.estado',
            'grupoPeriodo',
            //informacion alumno
            'alumnoGrupoRecursamientoSemestral.alumno' => function ($query){
                $query->orderBy('usuario_id')->with('usuario');
            },
            //periodo
            'alumnoGrupoRecursamientoSemestral.periodoCurso',
            //carrera donde curso
            'alumnoGrupoRecursamientoSemestral.carreraUacCurso',
            //fechas evaluaciones
            'plantel.recursamientoSemestrales' => function($query) use($fecha_actual, $periodo_actual_id){
                $query->where([
                    ['fecha_inicio', '<=', $fecha_actual],
                    ['fecha_final', '>=', $fecha_actual],
                    ['periodo_id', $periodo_actual_id]
                ]);
            },
        ])->first();
        return $grupo_recursamiento_semestral;
    }

    public function getAsignaturaFromAlcance($planteles_alacance, $grupo_recursamiento_semestral)
    {
        $fecha_actual = Carbon::now()->toDateString();
        $periodo_actual = Sisec::periodoActual();
        $periodo_actual_id = $periodo_actual->id;
        $carrera_uac_id = $grupo_recursamiento_semestral->carrera_uac_id;
        $plantel_id = $grupo_recursamiento_semestral->plantel_id;
        $grupo_recursamiento_semestral = GrupoRecursamientoSemestral::where([
            ['id', $grupo_recursamiento_semestral->id],
            ['estatus', 1]
        ])
        //comprobar alcance
        ->whereHas('plantel', function ($query) use($planteles_alacance){
            $query->whereIn('id', $planteles_alacance);
        })->with([
            'plantillaDocente.docente',
            //periodo
            'periodo',
            //carrera uac
            'carreraUac',
            'carreraUac.uac',
            'carreraUac.carrera',
            'periodo',
            'grupoPeriodo',
            'plantel.municipio.estado',
            //calificaciones alumno
            'alumnoGrupoRecursamientoSemestral.alumno.calificacionUac' => function($query) use($carrera_uac_id, $plantel_id){
                $query->where([
                    ['carrera_uac_id', $carrera_uac_id],
                    ['tipo_calif', "RS"]
                ])->orderBy('parcial');
            },
            //informacion alumno
            'alumnoGrupoRecursamientoSemestral.alumno' => function ($query){
                $query->orderBy('usuario_id')->with('usuario');
            },
            //periodo
            'alumnoGrupoRecursamientoSemestral.periodoCurso',
            //carrera donde curso
            'alumnoGrupoRecursamientoSemestral.carreraUacCurso',
            //fechas evaluaciones
            'plantel.recursamientoSemestrales' => function($query) use($fecha_actual, $periodo_actual_id){
                $query->where([
                    ['fecha_inicio', '<=', $fecha_actual],
                    ['fecha_final', '>=', $fecha_actual],
                    ['periodo_id', $periodo_actual_id]
                ]);
            },
        ])->first();
        return $grupo_recursamiento_semestral;
    }

}
