<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\AsignaturaRecursamientoIntersemestral;
use App\Http\Requests\StoreRecursamientoIntersemestralRequest;
use App\GrupoRecursamientoIntersemestral;
use App\AlumnoGrupoRecursamientoIntersemestral;
use App\ConfigRecursamientoIntersemestral;
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

class AsignaturaRecursamientoIntersemestralController extends Controller
{
    use AuditoriaLogHelper, CalificarPromediarTrait;

   
    public function store(StoreRecursamientoIntersemestralRequest $request)
    {
        try {
            DB::beginTransaction();
            /* consultar periodo */
            $periodo_actual = Sisec::periodoActual();
            if($request->periodo_id){
                $periodo_id = $request->periodo_id;
            }else{
                $periodo_id = $periodo_actual->id;
            }
            //consultar tamaño de alumnos
            if(!$this->isAvailableDateIntersemestral($request->plantel_id, $periodo_id)){
                //return ResponseJson::msg('Las fechas de configuración para recursamientos intersemestrales se encuentra fuera de tiempo', 400);    
            }
            //consultar si el semestre se imparte en la asignatura
            if(!$this->isCanSemestreInAsignatura($request->semestre, $request->carrera_uac_id)){
                return ResponseJson::msg('La asignatura no se imparte en el semestre', 400);   
            }
            //consultar tipo de semestre
            /*if(!$this->isAvailableSemestre($request->semestre)){//TODO:
                return ResponseJson::msg('El semestre no se encuentra en curso', 400);    
            }*/
            //consultar si el docente pertence al plantel
            $docente_asignacion = DocentePlantilla::where('id', $request->docente_asignacion_id)->first();
            if($docente_asignacion->plantel_id != $request->plantel_id){
                return ResponseJson::msg('El docente no pertenece al plantel', 400);         
            }
            $carrera_uac = CarreraUac::where('id', $request->carrera_uac_id)->first();
            $plantel_carrera = PlantelCarrera::where([
                ['carrera_id', $carrera_uac->carrera_id],
                ['plantel_id', $request->plantel_id]
            ])->first();
            if(!$plantel_carrera){
                return ResponseJson::msg('La carrera no pertenece al plantel', 400);
            }
            $grupo_intersemestral = GrupoRecursamientoIntersemestral::create([
                'plantel_id' => $request->plantel_id,
                'periodo_id' => $periodo_id,
                'semestre' => $request->semestre,
                'max_alumnos' => 99,
                'plantel_carrera_id' => $plantel_carrera->id,
                'estatus' => 'activo'
            ]);
            $this->auditoriaSave($grupo_intersemestral); /* adutoria log */
            //consultar si ya existe la asignatura
            $is_exist_intersemestral = $this->isExistIntersemestral($request, $grupo_intersemestral->id, $periodo_id);
            if($is_exist_intersemestral){
                $intersemestral = AsignaturaRecursamientoIntersemestral::create([
                    'grupo_recursamiento_intersemestral_id' => $grupo_intersemestral->id,
                    'grupo_periodo_id' => $request->grupo_periodo_id,
                    'plantilla_docente_id' => $request->docente_asignacion_id,
                    'carrera_uac_id' => $request->carrera_uac_id,
                    'plantel_id' => $request->plantel_id,
                    'periodo_id' => $periodo_id,
                    'estatus' => 1
                ]);
            }else{
                return ResponseJson::msg('La asignatura de recursamiento intersemestral ya existe', 400);
            }
            $this->auditoriaSave($intersemestral); /* adutoria log */
            foreach($request["alumnos"] as $obj){
                //alumno para mensaje de error
                $alumno_response = Alumno::where('usuario_id', $obj["alumno_id"])->with('usuario')->first();
                //consultar si el alumno esta en la asignatura intersemestral
                if($is_in_intersemestral = $this->isInIntersemestral($obj["alumno_id"], $intersemestral)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' con matricula '.$alumno_response["matricula"].', ya se encuentra cursando la asignatura en recursamiento intersemestral', 400);  
                }
                //solo si el alumno tiene la materia repobada o llevo la materia anteriormente  
                if(!$this->isNotApprovedStudent($obj["alumno_id"], $request->carrera_uac_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar la asignatura en recursamiento intersemestral', 400);  
                }
                //consultar si el alumno es del plantel del grupo
                if(!$this->isHavePlantel($obj["alumno_id"], $request->plantel_id)){
                    return ResponseJson::msg('El alumno no pertenece al plantel de la asignatura de recursamiento intersemestral', 400);    
                }
                //consultar si la carrera es del alumno
                if(!$this->isHaveCarrera($obj["alumno_id"], $carrera_uac->carrera_id)){
                    //return ResponseJson::msg('La carrera del grupo de recursamiento intersemestral no pertenece al alumno '.$alumno_response["usuario"]->nombre, 400);    
                }
                $is_espacio_grupo = $this->isEspacioDisponible($obj["alumno_id"], $grupo_intersemestral->id);
                if($is_espacio_grupo){
                    $alumnos = AlumnoGrupoRecursamientoIntersemestral::create([
                        'alumno_id' => $obj["alumno_id"],
                        'grupo_recursamiento_intersemestral_id' => $intersemestral->grupo_recursamiento_intersemestral_id
                    ]);
                }else{
                    return ResponseJson::msg('El grupo de recursamiento intersemestral se encuentra lleno', 400);   
                }
            }
            DB::commit();
            return ResponseJson::data($intersemestral, 200);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible agregar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible agregar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function update(StoreRecursamientoIntersemestralRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id;
            $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::findOrFail($id);
            if($asignatura_recursamiento_intersemestral->estatus != 1){
                throw new ModelNotFoundException();
            }
            //valores que no cambian
            if(!$this->IsParamsUpdateCheck($asignatura_recursamiento_intersemestral, $request)){
                return ResponseJson::msg('No es posible modificar este valor', 400);
            }
            //consultar si el semestre se imparte en la asignatura
            if(!$this->isCanSemestreInAsignatura($request->semestre, $request->carrera_uac_id)){
                return ResponseJson::msg('La asignatura no se imparte en el semestre', 400);   
            }
            //fecha solicitud
            if(!$this->isAvailableDateIntersemestral($request->plantel_id, $periodo_actual_id)){
                //return ResponseJson::msg('Las fechas de configuración para recursamientos intersemestrales se encuentra fuera de tiempo', 400);    
            }
            //docente plantel
            $docente_asignacion = DocentePlantilla::where('id', $request->docente_asignacion_id)->first();
            if($docente_asignacion->plantel_id != $request->plantel_id){
                return ResponseJson::msg('El docente no pertenece al plantel', 400);         
            }
            $carrera_uac = CarreraUac::where('id', $request->carrera_uac_id)->first();

            //checar si son los mismos alumnos del grupo, eliminar alumnos que ya no esten en el grupo
            $is_same_students = $this->isSameStudents($request["alumnos"], $asignatura_recursamiento_intersemestral);  
            $alumnos_nuevos = $this->alumnosNuevosGrupo($request["alumnos"], $asignatura_recursamiento_intersemestral);
            foreach($alumnos_nuevos as $obj){
                //alumno para mensaje de error
                $alumno_response = Alumno::where('usuario_id', $obj)->with('usuario')->first();
                //solo si el alumno tiene la materia repobada
                if(!$this->isNotApprovedStudent($obj, $request->carrera_uac_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' no cumple los requisitos para cursar la asignatura en recursamiento intersemestral', 400); 
                }
                //el alumno no esta en el grupo intersemestral, evaluar si ya se encuentra recursando un intersmestral de la misma asignatura
                //consultar si el alumno esta en una asignatura intersemestral
                if($this->isInIntersemestral($obj, $asignatura_recursamiento_intersemestral, $asignatura_recursamiento_intersemestral->grupo_recursamiento_intersemestral_id)){
                    return ResponseJson::msg('El alumno '.$alumno_response["usuario"]->nombre.' ya se encuentra cursando la asignatura en recursamiento intersemestrales', 400);  
                }
                //consultar si el alumno es del plantel del grupo
                if(!$this->isHavePlantel($obj, $request->plantel_id)){
                    return ResponseJson::msg('El plantel del grupo de recursamiento intersemestral no pertenece al alumno', 400);
                }
                //consultar si la carrera es del alumno
                if(!$this->isHaveCarrera($obj, $carrera_uac->carrera_id)){
                    return ResponseJson::msg('La carrera del grupo de recursamiento intersemestral no pertenece al alumno', 400);    
                }
                //espacio en grupo
                if(!$this->isEspacioDisponible($obj, $asignatura_recursamiento_intersemestral->grupo_recursamiento_intersemestral_id)){
                    return ResponseJson::msg('El grupo de recursamiento intersemestral se encuentra lleno', 400);   
                }
                //añadir alumno
                $alumnos = AlumnoGrupoRecursamientoIntersemestral::create([
                    'alumno_id' => $obj,
                    'grupo_recursamiento_intersemestral_id' => $asignatura_recursamiento_intersemestral->grupo_recursamiento_intersemestral_id
                ]);    
            }
            //update asignatura
            $asignatura_recursamiento_intersemestral_old = AsignaturaRecursamientoIntersemestral::findOrFail($id);
            $asignatura_recursamiento_intersemestral->update([
                'plantilla_docente_id' => $request->docente_asignacion_id,
                'estatus' => 1
            ]);
            $this->auditoriaSave($asignatura_recursamiento_intersemestral, $asignatura_recursamiento_intersemestral_old); /* adutoria log */
            DB::commit();
            return ResponseJson::data($asignatura_recursamiento_intersemestral, 200);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible modificar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible modificar la asignatura recursamiento intersemestral', 400);
        }
    }
    
    public function isSameStudents($alumnos_request, $asignatura_intersemestral)
    {
        try {
            //grupo de intersemestral
            $grupo_intersemestral = GrupoRecursamientoIntersemestral::find($asignatura_intersemestral->grupo_recursamiento_intersemestral_id);
            //relacion alumno con grupo
            $alumnos_grupo = AlumnoGrupoRecursamientoIntersemestral::where('grupo_recursamiento_intersemestral_id', $asignatura_intersemestral->grupo_recursamiento_intersemestral_id)->get();
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
            //comprobar que el alumno a eliminar no cuente con calificaciones del curso
            $alumnos_grupo = AlumnoGrupoRecursamientoIntersemestral::where([
                ['grupo_recursamiento_intersemestral_id', $asignatura_intersemestral->grupo_recursamiento_intersemestral_id],
            ])->whereIn('alumno_id', $alumnos_eliminar)->get();
            if($alumnos_grupo->isNotEmpty()){
                //buscar calificaciones del curso
                foreach($alumnos_grupo as $obj){
                    $calificaciones_intersemestrales = CalificacionUac::where([
                        ['periodo_id', $asignatura_intersemestral->periodo_id],
                        ['alumno_id', $obj->alumno_id],
                        ['carrera_uac_id', $asignatura_intersemestral->carrera_uac_id],
                        ['plantel_id', $asignatura_intersemestral->plantel_id],
                        ['tipo_calif', 'CI']
                    ])->get();
                    foreach($calificaciones_intersemestrales as $calificacion){
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
                                        ['periodo_id', $asignatura_intersemestral->periodo_id],
                                        ['alumno_id', $obj->alumno_id],
                                        ['carrera_uac_id', $carrera_uac_modulo->id],
                                        ['plantel_id', $asignatura_intersemestral->plantel_id],
                                        ['tipo_calif', 'CI']
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
                    //cambio estatus alumno
                    $this->checkStatusStudent($obj->alumno_id, true);
                    /* eliminar alumno grupo */
                    $obj->delete();
                    $this->auditoriaSave($obj); /* adutoria log */ 
                }
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function alumnosNuevosGrupo($alumnos_request, $asignatura_intersemestral)
    {
        try {
            //grupo de intersemestral
            $grupo_intersemestral = GrupoRecursamientoIntersemestral::find($asignatura_intersemestral->grupo_recursamiento_intersemestral_id);
            //relacion alumno con grupo
            $alumnos_grupo = AlumnoGrupoRecursamientoIntersemestral::where('grupo_recursamiento_intersemestral_id', $asignatura_intersemestral->grupo_recursamiento_intersemestral_id)->get();
            $alumnos_inscritos = []; //arreglo de alumnos en el grupo
            foreach($alumnos_grupo as $obj){
                array_push($alumnos_inscritos, $obj->alumno_id);   
            }
            $alumnos_array = []; //alumnos request
            foreach($alumnos_request as $obj){
                array_push($alumnos_array, $obj["alumno_id"]);   
            }
            $alumnos_nuevos = []; //alumno a eliminar
            foreach($alumnos_array as $obj){
                if(!in_array($obj, $alumnos_inscritos)){
                    array_push($alumnos_nuevos, $obj);
                }
            }
            return $alumnos_nuevos;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function IsParamsUpdateCheck($asignatura_recursamiento_intersemestral, $request)
    {
        try {
            $grupo_intersemestral = GrupoRecursamientoIntersemestral::find($asignatura_recursamiento_intersemestral->grupo_recursamiento_intersemestral_id);
            if($grupo_intersemestral->semestre != $request->semestre){
                return false;
            }
            if($asignatura_recursamiento_intersemestral->carrera_uac_id != $request->carrera_uac_id){
                return false;
            }
            if($asignatura_recursamiento_intersemestral->plantel_id != $request->plantel_id){
                return false;
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isAvailableSemestre($semestre)
    {
        try {
            $periodo_actual = Sisec::periodoActual();
            $numero_periodo = explode('/', $periodo_actual->nombre)[1];
            $semestres = ($numero_periodo == '2') ? [2,4,6] : [1,3,5];
            if(in_array($semestre, $semestres)){
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

    public function isEspacioDisponible($alumno_id, $grupo_intersemestral_id)
    {
        try {
            $grupo_intersemestral = GrupoRecursamientoIntersemestral::where('id', $grupo_intersemestral_id)
            ->with('alumnos')
            ->first();
            if($grupo_intersemestral){
                if($grupo_intersemestral->alumnos->isNotEmpty()){
                    $count = 0;
                    foreach($grupo_intersemestral->alumnos as $obj){
                        $count ++;
                        if($count >= 99){
                            return false;
                        }
                    }
                }else{
                    return true;
                }
            }
            return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isExistIntersemestral($request, $grupo_intersemestral_id, $periodo_actual_id)
    {
        try {
            //buscar mismos parametros en asignatura
            $intersemestral = AsignaturaRecursamientoIntersemestral::where([
                ['plantel_id', $request->plantel_id],
                ['carrera_uac_id', $request->carrera_uac_id],
                ['periodo_id', $periodo_actual_id],
                ['grupo_periodo_id', $request->grupo_periodo_id],
                ['plantilla_docente_id', $request->docente_asignacion_id],
                ['estatus', 1]
            ])->with('carreraUac.uac', 'grupoPeriodo')->first();
            if(!$intersemestral){
                //no existe la asignatura, por lo tanto ni grupo
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

    public function isAvailableDateIntersemestral($plantel_id, $periodo_actual_id)
    {
        try {
            $fecha_actual = Carbon::now()->toDateString();
            $ordianarios_config = ConfigRecursamientoIntersemestral::where([
                ['periodo_id' , $periodo_actual_id],
                ['plantel_id' , $plantel_id],
            ])->get();
            foreach($ordianarios_config as $obj){
                if($fecha_actual >= $obj->fecha_inicio && $fecha_actual <= $obj->fecha_final){
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

    public function isCanSemestreInAsignatura($semestre, $carrera_uac_id)
    {
        try {
          $carrera_uac = CarreraUac::find($carrera_uac_id);
          if($carrera_uac->semestre != $semestre){
              return false;
          }
          return true;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isNotApprovedStudent($alumno_id, $carrera_uac_id)
    {
        try {
            $calificacion = CalificacionUac::where([
                ['alumno_id', $alumno_id],
                ['parcial', 4],
                ['calificacion', '<', 6],
                ['carrera_uac_id', $carrera_uac_id]
            ])->first();
            if($calificacion){
                //si encontre calificacion con parcial 4
                return $calificacion;
            }else{
                //buscar con calificacion con parcial 6
                $calificacion = CalificacionUac::where([
                    ['alumno_id', $alumno_id],
                    ['parcial', 6],
                    ['carrera_uac_id', $carrera_uac_id]
                    ])->first();
                    return $calificacion;
                }
            return false;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isInIntersemestral($alumno_id, $intersemestral, $grupo_intersemestral_id = null)
    {
        try {
            //buscar asignaturas intersemestrales y grupos con carrera_uac y periodo actual
            $intersemestrales_carrera_uac = AsignaturaRecursamientoIntersemestral::where([
                ['carrera_uac_id', $intersemestral->carrera_uac_id],
                ['periodo_id', $intersemestral->periodo_id],
            ])->get();
            $grupo_intersemestrales_id = [];
            foreach($intersemestrales_carrera_uac as $obj){
                array_push($grupo_intersemestrales_id, $obj->grupo_recursamiento_intersemestral_id);   
            }
            //grupos de la asignatura
            if($grupo_intersemestral_id == null){
                /* cuando se creao, aun no existe el grupo */
                $grupos_intersemestrales = GrupoRecursamientoIntersemestral::whereIn('id', $grupo_intersemestrales_id)->with('asignaturaIntersemestral','alumnos.usuario')->get();
                foreach($grupos_intersemestrales as $obj){
                    foreach($obj->alumnos as $alumno){
                        if($alumno->usuario_id == $alumno_id){
                            //alumno en el grupo
                            return $alumno;
                        }
                    }
                }
            }else if($grupo_intersemestral_id != null){
                /* cuando se edita */
                $grupo_intersemestral = GrupoRecursamientoIntersemestral::where('id', $grupo_intersemestral_id)->with('alumnos.usuario')->first();
                foreach($grupo_intersemestral["alumnos"] as $alumno){
                    if($alumno->usuario_id == $alumno_id){
                        return false;
                    }
                }
            }
            return false;
        } catch(ModelNotFoundException $e) {   
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function isHaveCarrera($alumno_id, $carrera_id)
    {
        try {
            $alumno = Alumno::where('usuario_id', $alumno_id)->first();
            if($alumno->carrera_id == $carrera_id){
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
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }
    
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $intersemestral = AsignaturaRecursamientoIntersemestral::findOrFail($id);
            /* if not exist */
            if($intersemestral->estatus != 1){ /* si es diferen activo */
                throw new ModelNotFoundException();
            }
            $old_intersemestral = $intersemestral;
            $intersemestral = AsignaturaRecursamientoIntersemestral::findOrFail($id);            
            //borrar grupo
            $grupo_intersemestral = GrupoRecursamientoIntersemestral::where('id', $intersemestral->grupo_recursamiento_intersemestral_id)->first();
            //relacion alumno
            $alumnos_grupo = AlumnoGrupoRecursamientoIntersemestral::where('grupo_recursamiento_intersemestral_id', $intersemestral->grupo_recursamiento_intersemestral_id)->get();
            foreach($alumnos_grupo as $obj){
                //buscar calificaciones intersemestrales
                $calificacion_intersemestral = CalificacionUac::where([
                    ['alumno_id', $obj->alumno_id],
                    ['carrera_uac_id', $intersemestral->carrera_uac_id],
                    ['periodo_id', $intersemestral->periodo_id],
                    ['tipo_calif', 'CI']
                ])->get();
                foreach($calificacion_intersemestral as $calificacion){ 
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
                                    ['periodo_id', $intersemestral->periodo_id],
                                    ['tipo_calif', 'CI']
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
                //cambio estatus alumno
                $this->checkStatusStudent($obj->alumno_id, true);
                //eliminacion de relacion alumno
                $obj->delete();
                $this->auditoriaSave($obj); /* adutoria log */
            }
            //borrar asignatura
            $intersemestral->delete();
            $this->auditoriaSave($intersemestral); /* adutoria log */
            //borrar grupo
            $grupo_intersemestral->delete();
            $this->auditoriaSave($grupo_intersemestral); /* adutoria log */
            DB::commit();
            return ResponseJson::data($intersemestral, 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar la asignatura recursamiento intersemestral', 400);
        }
    }

    public function show($id)
    {
        try {
            $user = auth()->user();
            $is_control_escolar = HelperPermisoAlcance::isRolControlEscolar($user);
            if($is_control_escolar){
                $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::findorFail($id);
                /* comprobar permisos */
                /* $permisos = HelperPermisoAlcance::getPermisos();
                if(in_array('Plantel', $permisos)){
                    //consultar periodo de la asignatura
                    $is_available_asignatura = ValidationsDocente::isAvailableAsignaturaRecursamientoIntersemestral($id);
                    if(!$is_available_asignatura){
                        throw new ModelNotFoundException();
                    }
                } */
                //consultar estatus de la asignatura recursamiento
                $is_available_asignatura_recursamiento = ValidationsDocente::isAvailableAsignaturaRecursamientoIntersemestralByEstatus($id);
                if($is_available_asignatura_recursamiento){
                    /* alcance usuario */
                    $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
                    $permisos = HelperPermisoAlcance::getPermisos();
                    if(in_array('Nacional', $permisos)){ //evaluar nivel de alcance para ver materias
                        $asignatura_recursamiento_intersemestral = $this->getAsignaturaFromId($asignatura_recursamiento_intersemestral);
                    }else{
                        $asignatura_recursamiento_intersemestral = $this->getAsignaturaFromAlcance($planteles_alacance, $asignatura_recursamiento_intersemestral);
                    }
                    return ResponseJson::data($asignatura_recursamiento_intersemestral, 200);
                }else{
                    throw new ModelNotFoundException();
                }
            }else{
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la asignatura de recursamiento intersemestral', 400);
        }
    }

    public function asignaturasRecursamientoIntersemestralFromDocente($id)
    {
        try {
            /* docente_id */
            $user = auth()->user();
            /* consultar estatus del docente */
            $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::findorFail($id);
            //consultar periodo asignatura
            $is_available_asignatura = ValidationsDocente::isAvailableAsignaturaRecursamientoIntersemestral($id);
            if(!$is_available_asignatura){
                throw new ModelNotFoundException();
            }
            /* consultar si al docente le pertenece la asignatura intersemestral */
            $docente_is_my_uac_intersemestral = ValidationsDocente::isDocenteMyUacIntersemestral($asignatura_recursamiento_intersemestral, $user);
            if($docente_is_my_uac_intersemestral){
                $is_available_docente_docente = ValidationsDocente::isAvailableDocenteFromAsignacion($asignatura_recursamiento_intersemestral->plantilla_docente_id);
                if($is_available_docente_docente){
                    $is_available_asignatura_recursamiento = ValidationsDocente::isAvailableAsignaturaRecursamientoIntersemestralByEstatus($id);
                    if($is_available_asignatura_recursamiento){
                        $asignatura_recursamiento_intersemestral = $this->getAsignaturaFromId($asignatura_recursamiento_intersemestral);
                    }else{
                        throw new ModelNotFoundException();    
                    }
                }else{
                    throw new ModelNotFoundException();
                }
            }else{
                throw new ModelNotFoundException();
            }
            return ResponseJson::data($asignatura_recursamiento_intersemestral, 200);
           
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la asignatura de recursamiento intersemestral', 400);
        }
    }

    public function getAsignaturaFromId($asignatura_recursamiento_intersemestral)
    {
        $fecha_actual = Carbon::now()->toDateString();
        $periodo_actual = Sisec::periodoActual();
        $periodo_actual_id = $periodo_actual->id;
        $carrera_uac_id = $asignatura_recursamiento_intersemestral->carrera_uac_id;
        $plantel_id = $asignatura_recursamiento_intersemestral->plantel_id;
        $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::where([
            ['id', $asignatura_recursamiento_intersemestral->id],
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
            'grupoPeriodo',
            'plantel.municipio.estado',
            //informacion alumno
            'grupoRecursamientoIntersemestral.alumnoGrupoRecursamientoIntersemestral.alumno' => function ($query){
                $query->orderBy('usuario_id')->with('usuario');
            },
            //fechas evaluaciones
            'plantel.recursamientoIntersemestrales' => function($query) use($fecha_actual, $periodo_actual_id){
                $query->where([
                    ['fecha_inicio', '<=', $fecha_actual],
                    ['fecha_final', '>=', $fecha_actual],
                    ['periodo_id', $periodo_actual_id]
                ]);
            },
        ])->first();
        return $asignatura_recursamiento_intersemestral;
    }

    public function getAsignaturaFromAlcance($planteles_alacance, $asignatura_recursamiento_intersemestral)
    {
        $fecha_actual = Carbon::now()->toDateString();
        $periodo_actual = Sisec::periodoActual();
        $periodo_actual_id = $periodo_actual->id;
        $carrera_uac_id = $asignatura_recursamiento_intersemestral->carrera_uac_id;
        $plantel_id = $asignatura_recursamiento_intersemestral->plantel_id;
        $asignatura_recursamiento_intersemestral = AsignaturaRecursamientoIntersemestral::where([
            ['id', $asignatura_recursamiento_intersemestral->id],
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
            //informacion alumno
            'grupoRecursamientoIntersemestral.alumnoGrupoRecursamientoIntersemestral.alumno' => function ($query){
                $query->orderBy('usuario_id')->with('usuario');
            },
            //fechas evaluaciones
            'plantel.recursamientoIntersemestrales' => function($query) use($fecha_actual, $periodo_actual_id){
                $query->where([
                    ['fecha_inicio', '<=', $fecha_actual],
                    ['fecha_final', '>=', $fecha_actual],
                    ['periodo_id', $periodo_actual_id]
                ]);
            },
        ])->first();
        return $asignatura_recursamiento_intersemestral;
    }

}