<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreExtraordinarioRequest;
use App\Extraordinario;
use App\AlumnoGrupoExtraordinario;
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

class ExtraordinarioController extends Controller
{
    use AuditoriaLogHelper, CalificarPromediarTrait;

    public function store(StoreExtraordinarioRequest $request)
    {
        try {
            DB::beginTransaction();
            /* consultar periodo */
            $periodo_actual = Sisec::periodoActual();
            if($request->periodo_id){
                $periodo_id = $request->periodo_id;
                /* $permisos = HelperPermisoAlcance::getPermisos();
                if(in_array('Plantel', $permisos)){ //evaluar nivel de alcance
                    $periodo_id = $periodo_actual->id;    
                } */
            }else{
                $periodo = Sisec::periodoActual();
                $periodo_id = $periodo->id;
            }
            $grupo_periodo = GrupoPeriodo::findOrFail($request->grupo_periodo_id);
            if(!HelperFechasEvaluacion::isAvailableDateExtraordinario($request->plantel_id)){
                return ResponseJson::msg('Las fechas de configuración para extraordinarios se encuentra fuera de tiempo', 400);    
            }
            //consultar si el semestre se imparte en la asignatura
            if(!$this->isCanSemestreInAsignatura($grupo_periodo->semestre, $request->carrera_uac_id)){
                return ResponseJson::msg('La asignatura no se imparte en el semestre', 400);                                        
            }
            //consultar tipo de semestre
            if(!$this->isAvailableSemestre($grupo_periodo->semestre, $periodo_id)){
                return ResponseJson::msg('El semestre del grupo seleccionado, no se cursa en el periodo seleccionado', 400);    
            }
            //consultar tipo de asignatura
            $carrera_uac = CarreraUac::find($request->carrera_uac_id);
            $uac = UAC::find($carrera_uac->uac_id);
            if($uac->modulo_id){
                return ResponseJson::msg('La asignatura seleccionada no puede ser cursada en el extraordinario', 400);    
            }
            if(!$this->ifExistExtraordinario($periodo_id, $grupo_periodo->id, $grupo_periodo->semestre, $request->carrera_uac_id, $request->plantel_id)){
                $extraordinario = Extraordinario::create([
                    'grupo_periodo_id' => $request->grupo_periodo_id,
                    'carrera_uac_id' => $request->carrera_uac_id,
                    'plantilla_docente_id' => $request->docente_asignacion_id,
                    'semestre' => $grupo_periodo->semestre,
                    'plantel_id' => $request->plantel_id,
                    'periodo_id' => $periodo_id
                ]);
                $this->auditoriaSave($extraordinario); /* adutoria log */ 
            }else{
                return ResponseJson::msg('El extraordinario ya se encuentra registrado', 400);
            }
            /* insertar alumnos al grupo */
            foreach($request["alumnos"] as $obj){
                //alumno para mensaje de error
                $alumno_response = Alumno::where('usuario_id', $obj["alumno_id"])->with('usuario')->first();
                /* validar carrera uac curso _id */
                $carrera_uac_curso_id = null;
                if(isset($obj["carrera_uac_id"])){
                    if($request->carrera_uac_id != $obj["carrera_uac_id"]){
                        $carrera_uac_curso_id = $obj["carrera_uac_id"];
                    }else{
                        $carrera_uac_curso_id = $request->carrera_uac_id;    
                    }
                }else{
                    $carrera_uac_curso_id = $request->carrera_uac_id;
                }
                /* consultar estatus alumno */
                if($alumno_response->estatus_inscripcion != "Activo"){
                    //return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no se encuentra inscrito actualmente', 400);  
                }
                if($this->studentExistInExtraordinario($alumno_response->usuario_id, $extraordinario->id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' ya se encuentra en el extraordinario', 400);  
                }
                //consultar si el alumno ya esta recursando la asignatura carrera_uac_id
                if($this->studentExistInCarreraUac($obj["alumno_id"], $request->carrera_uac_id, $periodo_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' ya se encuentra cursando el extraordinario', 400);  
                }
                //consultar si el alumno tiene la materia reprobada en su historial
                if(!$this->isNotApprovedStudent($obj["alumno_id"], $carrera_uac_curso_id, $periodo_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar el extraordinario', 400);  
                }
                //consultar si el alumno es del plantel del grupo
                if(!$this->isHavePlantel($obj["alumno_id"], $request->plantel_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no pertenece al plantel del extraordinario', 400);    
                }
                $periodo_curso_uac_id = $this->getPeriodoCursoUac($obj["alumno_id"], $carrera_uac_curso_id);
                if(!$periodo_curso_uac_id){
                    $periodo_curso_uac_id = $periodo_id;
                }
                $alumnos = AlumnoGrupoExtraordinario::create([
                    'alumno_id' => $obj["alumno_id"],
                    'extraordinario_id' => $extraordinario->id,
                    'periodo_curso_id' => $periodo_curso_uac_id,
                    'carrera_uac_curso_id' => $carrera_uac_curso_id
                ]);
            }
            DB::commit();
            return ResponseJson::data($extraordinario, 200);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible agregar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible agregar el extraordinario', 400);
        }
    }

    public function update(StoreExtraordinarioRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            /* consultar periodo */
            $periodo_actual = Sisec::periodoActual();
            $extraordinario = Extraordinario::findOrFail($id);
            $periodo_id = $extraordinario->periodo_id;
            $grupo_periodo = GrupoPeriodo::findOrFail($extraordinario->grupo_periodo_id);
            //fecha solicitud
            if(!HelperFechasEvaluacion::isAvailableDateExtraordinario($request->plantel_id, $periodo_actual->id)){
                return ResponseJson::msg('Las fechas de configuración para extraordinarios se encuentra fuera de tiempo', 400);    
            }
            //valores que no cambian
            if(!$this->IsParamsUpdateCheck($extraordinario, $request)){
                return ResponseJson::msg('No se puede modificar este valor', 400);
            }
            //consultar si el semestre se imparte en la asignatura
            if(!$this->isCanSemestreInAsignatura($grupo_periodo->semestre, $request->carrera_uac_id)){
                return ResponseJson::msg('La asignatura no se imparte en el semestre', 400);   
            }
            $carrera_uac = CarreraUac::where('id', $extraordinario->carrera_uac_id)->first();
            //checar si son los mismos alumnos del grupo, eliminar alumnos que ya no esten en el grupo
            $is_same_students = $this->isSameStudents($request["alumnos"], $extraordinario);  
            $alumnos_nuevos = $this->alumnosNuevosGrupo($request["alumnos"], $extraordinario->id);
            foreach($alumnos_nuevos as $obj){
                //alumno para mensaje de error
                $alumno_response = Alumno::where('usuario_id', $obj["alumno_id"])->with('usuario')->first();
                /* validar carrera uac curso _id */
                $carrera_uac_curso_id = null;
                if(isset($obj["carrera_uac_id"])){
                    if($extraordinario->carrera_uac_id != $obj["carrera_uac_id"]){
                        $carrera_uac_curso_id = $obj["carrera_uac_id"];
                    }else{
                        $carrera_uac_curso_id = $extraordinario->carrera_uac_id;
                    }
                }else{
                    $carrera_uac_curso_id = $extraordinario->carrera_uac_id;
                }
                //solo si el alumno tiene la materia repobada
                if(!$this->isNotApprovedStudent($obj["alumno_id"], $carrera_uac_curso_id, $periodo_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar el extraordinario', 400); 
                }
                if($this->isInExtraordinario($obj["alumno_id"], $extraordinario)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' ya se encuentra cursando el extraordinario', 400);  
                }
                //consultar si el alumno es del plantel del grupo
                if(!$this->isHavePlantel($obj["alumno_id"], $request->plantel_id)){
                    return ResponseJson::msg('El plantel del extraordinario no pertenece al alumno', 400);
                }
                //añadir alumno
                $periodo_curso_uac_id = $this->getPeriodoCursoUac($obj["alumno_id"], $carrera_uac_curso_id);
                if(!$periodo_curso_uac_id){
                    $periodo_curso_uac_id = $extraordinario->periodo_id;
                }
                $alumnos = AlumnoGrupoExtraordinario::create([
                    'alumno_id' => $obj["alumno_id"],
                    'extraordinario_id' => $extraordinario->id,
                    'periodo_curso_id' => $periodo_curso_uac_id,
                    'carrera_uac_curso_id' => $carrera_uac_curso_id
                ]);
            }
            DB::commit();
            return ResponseJson::data($extraordinario, 200);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible modificar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible modificar el extraordinario', 400);
        }
    }
    
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $extaordinario = Extraordinario::findOrFail($id);
            $old_extraordinario = $extaordinario;
            $extaordinario = Extraordinario::findOrFail($id);
            /* carrera uac */
            $carrera_uac = CarreraUac::find($extaordinario->carrera_uac_id);
            //borrar relacion grupo alumno
            $alumnos_grupo  = AlumnoGrupoExtraordinario::where('extraordinario_id', $extaordinario->id)->get();
            foreach($alumnos_grupo as $obj){
                //buscar calificaciones ext con carrera que curso
                if($obj->carrera_uac_curso_id){
                    $calificacion_ext = CalificacionUac::where([
                        ['alumno_id', $obj->alumno_id],
                        ['carrera_uac_id', $obj->carrera_uac_curso_id],
                        ['periodo_id', $extaordinario->periodo_id],
                        ['tipo_calif', 'EXT']
                    ])->get();
                    foreach($calificacion_ext as $calificacion){
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
                                        ['periodo_id', $extaordinario->periodo_id],
                                        ['tipo_calif', 'EXT']
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
                    $calificacion_ext = CalificacionUac::where([
                        ['alumno_id', $obj->alumno_id],
                        ['carrera_uac_id', $carrera_uac->id],
                        ['periodo_id', $extaordinario->periodo_id],
                        ['tipo_calif', 'EXT']
                    ])->get();
                    foreach($calificacion_ext as $calificacion){
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
                                        ['periodo_id', $extaordinario->periodo_id],
                                        ['tipo_calif', 'EXT']
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
            $extaordinario->delete();
            $this->auditoriaSave($extaordinario); /* adutoria log */
            DB::commit();
            return ResponseJson::data($extaordinario, 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function show($id)
    {
        try {
            $user = auth()->user();
            $is_control_escolar = HelperPermisoAlcance::isRolControlEscolar($user);
            if($is_control_escolar){
                /* consultar estatus del docente */
                $extraordinario = Extraordinario::findorFail($id);
                /* comprobar permisos */
                $permisos = HelperPermisoAlcance::getPermisos();
                /* if(in_array('Plantel', $permisos)){ //evaluar nivel de alcance
                    //consultar periodo de la asignatura
                    if(!ValidationsDocente::isAvailableExtraordinarioByPeriod($extraordinario)){
                        throw new ModelNotFoundException();
                    }
                } */
                /* alcance usuario */
                $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
                $permisos = HelperPermisoAlcance::getPermisos();
                if(in_array('Nacional', $permisos)){ //evaluar nivel de alcance para ver materias
                    $extraordinario = $this->getExtraordinarioFromId($extraordinario);
                }else{
                    $extraordinario = $this->getExtraordinarioFromAlcance($planteles_alacance, $extraordinario);
                }
                return ResponseJson::data($extraordinario, 200);
            }else{
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontarl extraordinario', 400);
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
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function ifExistExtraordinario($periodo_actual_id, $grupo_periodo_id, $semestre, $carrera_uac_id, $plantel_id)
    {
        try {
            $extraordinario = Extraordinario::where([
                ['grupo_periodo_id' , $grupo_periodo_id],
                ['carrera_uac_id' , $carrera_uac_id],
                ['semestre' , $semestre], 
                ['plantel_id' , $plantel_id],
                ['periodo_id' , $periodo_actual_id]
           ])->first();
           return $extraordinario;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function studentExistInCarreraUac($alumno_id, $carrera_uac_id, $periodo_actual_id)
    {
        try {
            $extraordinarios = Extraordinario::where([
                ['periodo_id' , $periodo_actual_id],
                ['carrera_uac_id', $carrera_uac_id]
           ])->get();
           foreach($extraordinarios as $extraordinario){
                $alumnos_grupo_extraordinario = AlumnoGrupoExtraordinario::where([
                    ['extraordinario_id', $extraordinario->id],
                    ['alumno_id', $alumno_id]
                ])->first();
                if($alumnos_grupo_extraordinario){
                    return true;
                }
           }
           return false;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function studentExistInExtraordinario($alumno_id, $extraordinario_id)
    {
        try {
           $extraordinario = Extraordinario::find($extraordinario_id);
           $grupo_alumnos_extraordinarios = AlumnoGrupoExtraordinario::where([
               ['extraordinario_id', $extraordinario->id],
               ['alumno_id', $alumno_id]
           ])->get();
           if(count($grupo_alumnos_extraordinarios) > 0){
                return true;
           }else{
               return false;
           }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }
    
    public function isSameStudents($alumnos_request, $extraordinario)
    {
        try {
            //relacion alumno con grupo
            $alumnos_grupo = AlumnoGrupoExtraordinario::where('extraordinario_id', $extraordinario->id)->get();
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
            $carrera_uac = CarreraUac::find($extraordinario->carrera_uac_id);
            //comprobar que el alumno a eliminar no cuente con calificaciones del curso
            $alumnos_grupo = AlumnoGrupoExtraordinario::where([
                ['extraordinario_id', $extraordinario->id],
            ])->whereIn('alumno_id', $alumnos_eliminar)->get();
            if($alumnos_grupo->isNotEmpty()){
                //buscar calificaciones del curso
                foreach($alumnos_grupo as $obj){
                    /* si el alumno viene de otra carrera */
                    if($obj->carrera_uac_curso_id){
                        $calificaciones_ext = CalificacionUac::where([
                            ['periodo_id', $extraordinario->periodo_id],
                            ['alumno_id', $obj->alumno_id],
                            ['carrera_uac_id', $obj->carrera_uac_curso_id],
                            ['plantel_id', $extraordinario->plantel_id],
                            ['tipo_calif', 'EXT']
                        ])->get();
                        if($calificaciones_ext->isNotEmpty()){
                            /* eliminar calificaciones */
                            foreach($calificaciones_ext as $calificacion){
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
                                                ['periodo_id', $extraordinario->periodo_id],
                                                ['alumno_id', $obj->alumno_id],
                                                ['carrera_uac_id', $carrera_uac_modulo->id],
                                                ['plantel_id', $extraordinario->plantel_id],
                                                ['tipo_calif', 'EXT']
                                            ])->get();
                                            foreach($calificaciones_modulos as $calificacion_modulo){
                                                $calificacion_modulo->delete();
                                                $this->auditoriaSave($calificacion_modulo); /* adutoria log */
                                            }
                                        }
                                    }
                                }
                                /* eliminar calificaciones */
                                $obj->delete();
                                $this->auditoriaSave($obj); /* adutoria log */ 
                            }
                        }
                    }else{
                        /* si el alumno tiene carrera normal */
                        $calificaciones_ext = CalificacionUac::where([
                            ['periodo_id', $extraordinario->periodo_id],
                            ['alumno_id', $obj->alumno_id],
                            ['carrera_uac_id', $carrera_uac->id],
                            ['plantel_id', $extraordinario->plantel_id],
                            ['tipo_calif', 'EXT']
                        ])->get();
                        if($calificaciones_ext->isNotEmpty()){
                            /* eliminar calificaciones */
                            foreach($calificaciones_ext as $calificacion){
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
                                                ['periodo_id', $extraordinario->periodo_id],
                                                ['alumno_id', $obj->alumno_id],
                                                ['carrera_uac_id', $carrera_uac_modulo->id],
                                                ['plantel_id', $extraordinario->plantel_id],
                                                ['tipo_calif', 'EXT']
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
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function alumnosNuevosGrupo($alumnos_request, $extraordinario_id)
    {
        try {
            //relacion alumno con grupo
            $alumnos_grupo = AlumnoGrupoExtraordinario::where('extraordinario_id', $extraordinario_id)->get();
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
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function IsParamsUpdateCheck($extraordinario, $request)
    {
        try {
            $extraordinario = Extraordinario::find($extraordinario->id);
            if($extraordinario->plantel_id != $request->plantel_id){
                return false;
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
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
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
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
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
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
                        return true;
                    }else{
                        return false;
                    }
                }
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function isInExtraordinario($alumno_id, $extraordinario)
    {
        try {
            $alumnos_extraordinario = AlumnoGrupoExtraordinario::where([
                ['extraordinario_id', $extraordinario],
                ['alumno_id', $alumno_id]
            ])->first();
            if($alumnos_extraordinario){
                return true;
            }
            return false;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
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
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar el extraordinario', 400);
        }
    }

    public function getExtraordinarioFromId($extraordinario)
    {
        $fecha_actual = Carbon::now()->toDateString();
        $periodo_actual = Sisec::periodoActual();
        $periodo_actual_id = $periodo_actual->id;
        $carrera_uac_id = $extraordinario->carrera_uac_id;
        $plantel_id = $extraordinario->plantel_id;
        $extraordinario = Extraordinario::where([
            ['id', $extraordinario->id]
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
            'alumnoGrupoExtraordinario.alumno' => function ($query){
                $query->orderBy('usuario_id')->with('usuario');
            },
            //periodo
            'alumnoGrupoExtraordinario.periodoCurso',
            //carrera donde curso
            'alumnoGrupoExtraordinario.carreraUacCurso',
            //fechas evaluaciones
            'plantel.configExtraordinario' => function($query) use($fecha_actual, $periodo_actual_id){
                $query->where([
                    ['fecha_inicio', '<=', $fecha_actual],
                    ['fecha_final', '>=', $fecha_actual],
                    ['periodo_id', $periodo_actual_id]
                ]);
            },
        ])->first();
        return $extraordinario;
    }

    public function getExtraordinarioFromAlcance($planteles_alacance, $extraordinario)
    {
        $fecha_actual = Carbon::now()->toDateString();
        $periodo_actual = Sisec::periodoActual();
        $periodo_actual_id = $periodo_actual->id;
        $carrera_uac_id = $extraordinario->carrera_uac_id;
        $plantel_id = $extraordinario->plantel_id;
        $extraordinario = Extraordinario::where([
            ['id', $extraordinario->id]
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
            'alumnoGrupoExtraordinario.alumno.calificacionUac' => function($query) use($carrera_uac_id, $plantel_id){
                $query->where([
                    ['carrera_uac_id', $carrera_uac_id],
                    ['tipo_calif', 'EXT']
                ])->orderBy('parcial');
            },
            //informacion alumno
            'alumnoGrupoExtraordinario.alumno' => function ($query){
                $query->orderBy('usuario_id')->with('usuario');
            },
            //periodo
            'alumnoGrupoExtraordinario.periodoCurso',
            //carrera donde curso
            'alumnoGrupoExtraordinario.carreraUacCurso',
            //fechas evaluaciones
            'plantel.configExtraordinario' => function($query) use($fecha_actual, $periodo_actual_id){
                $query->where([
                    ['fecha_inicio', '<=', $fecha_actual],
                    ['fecha_final', '>=', $fecha_actual],
                    ['periodo_id', $periodo_actual_id]
                ]);
            },
        ])->first();
        return $extraordinario;
    }

}
