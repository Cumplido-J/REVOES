<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreBitacoraEvaluacionRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\RubricasEvaluacion;
use App\BitacoraEvaluacion;
use App\DocentePlantilla;
use App\DocenteAsignatura;
use App\UsuarioDocente;
use App\Traits\AuditoriaLogHelper;
use ResponseJson;
use ValidationsDocente;
use Sisec;

class BitacoraEvaluacionController extends Controller
{
    use AuditoriaLogHelper;
    
    public function index()
    {
        $rubricas_evaluacion = RubricasEvaluacion::all();
        
        return ResponseJson::data($rubricas_evaluacion, 200);
    }

    public function store(StoreBitacoraEvaluacionRequest $request)
    {
        try {
            //DB::beginTransaction();
            /* consultar estatus de asignatura y asignacion */
            $is_available_asignacion_docente = ValidationsDocente::isAvailableDocenteAsignacion($request->docente_asignacion_id);
            $is_available_asignatura_docente = ValidationsDocente::isAvailableDocenteAsignatura($request->docente_asignatura_id);
            $docente_plantilla = DocentePlantilla::find($request->docente_asignacion_id);
            $is_available_docente = ValidationsDocente::isAvailableDocente($docente_plantilla->docente_id);
            if($is_available_asignacion_docente){
                if($is_available_asignatura_docente){
                    if($is_available_docente){
                        $rubricas = RubricasEvaluacion::find($request->rubricas_evaluacion_id);
                        if($request["alumnos"]){ //si hay alumnos en request
                            $is_my_rubrica = $this->isMyRubrica($rubricas, $request->docente_asignatura_id, $request->docente_asignacion_id);
                            if($is_my_rubrica){
                                $rubrica_promedio = $this->promediarRubricas($request["alumnos"], $rubricas, $request);
                                if($rubrica_promedio){
                                    $insert_rubricas_and_create_calificacion = $this->insertRubricasInsertCalificacionUac($rubrica_promedio, $rubricas, $request);
                                    if($insert_rubricas_and_create_calificacion){
                                        return $insert_rubricas_and_create_calificacion;
                                    }else{
                                        throw new ModelNotFoundException();
                                    }
                                /*}else if($rubrica_promedio == 2){
                                    //el % no coinciden con el total de rubricas
                                    return ResponseJson::msg('Las rubricas de evaluación no coinciden con el parcial del alumno', 400);*/
                                }else { 
                                    //el % no coinciden con el total de rubricas
                                    return ResponseJson::msg('El porcentaje de la(s) rubricas de evaluación no coinciden con las rubricas establecidas en el parcial', 400);
                                }
                            }else{
                                //no le pertenece las rubricas
                                //return ResponseJson::msg('Rubricas no le pertenecen', 400);
                                throw new ModelNotFoundException();
                            }
                        }else{
                            //no hay alumno request
                            //return ResponseJson::msg('Alumnos requeridos', 400);
                            throw new ModelNotFoundException();
                        }
                    }else{
                        //return ResponseJson::msg('Docente no disponible', 400);
                        throw new ModelNotFoundException();
                    }
                }else{
                    //return ResponseJson::msg('Asignatura no disponible', 400);
                    throw new ModelNotFoundException();
                }
            }else{
                //return ResponseJson::msg('Asignacion no disponible', 400);
                throw new ModelNotFoundException();
            }
            //DB::commit();
            return ResponseJson::msg('Calificación creada con éxito', 200);
        } catch(ModelNotFoundException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } 
    }

    public function storeFromRS(StoreBitacoraEvaluacionRequest $request)
    {
        try {
            //DB::beginTransaction();
            /* consultar estatus de asignatura y asignacion */
            $is_available_asignacion_docente = ValidationsDocente::isAvailableDocenteAsignacion($request->docente_asignacion_id);
            $is_available_asignatura_docente = ValidationsDocente::isAvailableDocenteAsignatura($request->docente_asignatura_id);
            $docente_plantilla = DocentePlantilla::find($request->docente_asignacion_id);
            $is_available_docente = ValidationsDocente::isAvailableDocente($docente_plantilla->docente_id);
            if($is_available_asignacion_docente){
                if($is_available_asignatura_docente){
                    if($is_available_docente){
                        $rubricas = RubricasEvaluacion::find($request->rubricas_evaluacion_id);
                        if($request["alumnos"]){ //si hay alumnos en request
                            $is_my_rubrica = $this->isMyRubrica($rubricas, $request->docente_asignatura_id, $request->docente_asignacion_id);
                            if($is_my_rubrica){
                                $rubrica_promedio = $this->promediarRubricas($request["alumnos"], $rubricas, $request);
                                if($rubrica_promedio){
                                    $insert_rubricas_and_create_calificacion = $this->insertRubricasInsertCalificacionUac($rubrica_promedio, $rubricas, $request, 'RS');
                                    if($insert_rubricas_and_create_calificacion){
                                        return $insert_rubricas_and_create_calificacion;
                                    }else{
                                        throw new ModelNotFoundException();
                                    }
                                /*}else if($rubrica_promedio == 2){
                                    //el % no coinciden con el total de rubricas
                                    return ResponseJson::msg('Las rubricas de evaluación no coinciden con el parcial del alumno', 400);*/
                                }else { 
                                    //el % no coinciden con el total de rubricas
                                    return ResponseJson::msg('El porcentaje de la(s) rubricas de evaluación no coinciden con las rubricas establecidas en el parcial', 400);
                                }
                            }else{
                                //no le pertenece las rubricas
                                //return ResponseJson::msg('Rubricas no le pertenecen', 400);
                                throw new ModelNotFoundException();
                            }
                        }else{
                            //no hay alumno request
                            //return ResponseJson::msg('Alumnos requeridos', 400);
                            throw new ModelNotFoundException();
                        }
                    }else{
                        //return ResponseJson::msg('Docente no disponible', 400);
                        throw new ModelNotFoundException();
                    }
                }else{
                    //return ResponseJson::msg('Asignatura no disponible', 400);
                    throw new ModelNotFoundException();
                }
            }else{
                //return ResponseJson::msg('Asignacion no disponible', 400);
                throw new ModelNotFoundException();
            }
            //DB::commit();
            return ResponseJson::msg('Calificación creada con éxito', 200);
        } catch(ModelNotFoundException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } 
    }
    
    public function isMyRubrica($rubrica, $docente_asignatura_id, $docente_asignacion_id)
    {

        try {
            $user = auth()->user();
            $docente_auth = UsuarioDocente::where('usuario_id', $user->id)->first();
            $test_asignatura = false;
            //asignaciones del docente auth
            $asignaciones_docente = DocentePlantilla::where('docente_id', $docente_auth->docente_id)->get();
            foreach($asignaciones_docente as $obj){
                //buscar asignaturas de docene auth
                $asignaturas_docente = DocenteAsignatura::where('plantilla_docente_id', $obj->id)->get();
                foreach($asignaturas_docente as $asignatura){
                    //buscar asignaturas docente
                    if($asignatura->id == $docente_asignatura_id){
                        $test_asignatura = true;
                    }
                }
            }
            if($rubrica->docente_asignatura_id == $docente_asignatura_id && $test_asignatura){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e){
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }    

    }

    public function insertRubricasInsertCalificacionUac($alumnos, $rubricas, $request, $tipo_evaluacion = null)
    {
        try {
            DB::beginTransaction();
            $insert_rubricas = $this->insertRubricasInBitacora($alumnos, $rubricas, $request, $tipo_evaluacion); //bitacora
            $insert_calificaciones = $this->insertCalificaciones($alumnos, $request, $tipo_evaluacion); //calificacion uac
            DB::commit();
            return $insert_calificaciones; //retornar acuse pdf
        } catch(ModelNotFoundException $e){
            DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }    
    }

    public function insertRubricasInBitacora($alumnos, $rubricas, $request, $tipo_evaluacion)
    {
        try {
            DB::beginTransaction();
            $is_rubricas = $this->isRubricasAsignatura($rubricas, $request->docente_asignatura_id);
            if($is_rubricas){
                $periodo_actual = $this->getPeriodoActual();
                $docente = DocentePlantilla::find($request->docente_asignacion_id);
                foreach($alumnos["alumnos"] as $alumno){
                    $is_exist_bitacora_parcial = $this->isExistBitacoraInParcial($alumno["parcial"],$alumnos["docente_asignatura_id"], $alumno["alumno_id"]);
                    if($is_exist_bitacora_parcial){
                        //update
                        $bitacora_alumno_old = BitacoraEvaluacion::find($is_exist_bitacora_parcial->id);
                        $bitacora_alumno = BitacoraEvaluacion::find($is_exist_bitacora_parcial->id);
                        $bitacora_alumno->update([
                            'parcial' => $alumno["parcial"],
                            'asistencia' => $alumno["asistencia"],
                            'examen' => $alumno["examen"],
                            'practicas' => $alumno["practicas"],
                            'tareas' => $alumno["tareas"],
                            'tipo_evaluacion' => $tipo_evaluacion,
                            'alumno_id' => $alumno["alumno_id"],
                            'docente_asignatura_id' => $alumnos["docente_asignatura_id"],
                            'carrera_uac_id' => $request->carrera_uac_id,
                            'plantel_id' => $request->plantel_id,
                            'periodo_id' => $periodo_actual->id,
                            'docente_id' => $docente->docente_id
                        ]);
                        $this->auditoriaSave($bitacora_alumno, $bitacora_alumno_old); /* adutoria log */ 
                    }else{
                        //create
                        $bitacora_alumno = BitacoraEvaluacion::firstOrCreate([
                            'alumno_id' => $alumno["alumno_id"],
                            'carrera_uac_id' => $request->carrera_uac_id,
                            'parcial' => $alumno["parcial"],
                            'docente_asignatura_id' => $alumnos["docente_asignatura_id"],
                            'tipo_evaluacion' => $tipo_evaluacion,
                        ], [
                            'tipo_evaluacion' => $tipo_evaluacion,
                            'parcial' => $alumno["parcial"],
                            'asistencia' => $alumno["asistencia"],
                            'examen' => $alumno["examen"],
                            'practicas' => $alumno["practicas"],
                            'tareas' => $alumno["tareas"],
                            'alumno_id' => $alumno["alumno_id"],
                            'docente_asignatura_id' => $alumnos["docente_asignatura_id"],
                            'carrera_uac_id' => $request->carrera_uac_id,
                            'plantel_id' => $request->plantel_id,
                            'periodo_id' => $periodo_actual->id,
                            'docente_id' => $docente->docente_id
                        ]);
                        $this->auditoriaSave($bitacora_alumno); /* adutoria log */ 
                    }
                }
            }else{
                return false;
            }
            DB::commit();
            return ResponseJson::msg('Calificación creada con éxito', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }    
    }

    public function isRubricasAsignatura($rubricas, $docente_asignatura_id)
    {
        try {
            DB::beginTransaction();
            $rubricas = RubricasEvaluacion::where([
                ['docente_asignatura_id', $docente_asignatura_id],
                ['id', $rubricas->id]
            ])->first(); //servicio existente
            DB::commit();
            return ResponseJson::msg('Calificación creada con éxito', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }    
    }

    public function isExistBitacoraInParcial($parcial, $docente_asignatura_id, $alumno_id)
    {
        try {
            //DB::beginTransaction();
            $bitacora_alumno = BitacoraEvaluacion::where([
                ['parcial', $parcial],
                ['docente_asignatura_id', $docente_asignatura_id],
                ['alumno_id', $alumno_id]
            ])->first();
            return $bitacora_alumno;
            //DB::commit();
            //return ResponseJson::msg('Calificación creada con éxito', 200);
        } catch(ModelNotFoundException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }     
    }

    public function insertCalificaciones($alumnos, $request, $tipo_evaluacion)
    {
        try {
            //DB::beginTransaction();
            $url = 'http://'.$request->getHttpHost();
            $version = '/api';
            if($tipo_evaluacion){
                $name_route = '/calificaciones-uac-recursamiento-semestral-docente';
            }else{
                $name_route = '/calificaciones-uac-from-docente';
            }
            $url = $url.$version.$name_route;
            $requests = Request::create($url, 'POST', $alumnos); //servicio existente
            return app()->handle($requests);
            //DB::commit();
            return ResponseJson::msg('Calificación creada con éxito', 200);
        } catch(ModelNotFoundException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            //DB::rollBack();
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }    
    }

    public function getPorcentajeRubrica($rubrica_request, $rubrica_config)
    {
        if($rubrica_request > 0){ //si la rubirca es mayor a 0 convertir
            $rubrica_request = $rubrica_request*100; //obtener numero para obtener porcetnaje total
            $rubrica_request = substr($rubrica_request, 0, -1); //eliminar ultimo 0
            $rubrica_request = $rubrica_request/100; // dividir entre 100
            $rubrica_resultado = $rubrica_request * $rubrica_config; //numero obtenido por el porcentaje total de la rubrica
            return $rubrica_resultado;
        }
        return $rubrica_request;
    }

    public function promediarRubricas($alumnos, $rubricas, $request)
    {
        $array_alumno = []; //arreglo final con alumnos y rubricas convetidos
        foreach($alumnos as $alumno){
            $count_rubricas = 0; //numero de rubricas necesarias
            $count_rubricas_correctas = 0; //numero de rubricas correctas
            $count_rubricas_porcentaje_total = 0;
            //rubricas resultados
            $rubrica_resultado_asistencia = 0;
            $rubrica_resultado_examen = 0;
            $rubrica_resultado_practicas = 0;
            $rubrica_resultado_tarea = 0;
            //calificaciones promediadia
            $rubrica_promedio_asistencia = 0;
            $rubrica_promedio_examen = 0;
            $rubrica_promedio_practicas = 0;
            $rubrica_promedio_tarea = 0;
            //comprobar si las rubricas pertenecen al parcial del alumno
            if($alumno["parcial"] != $rubricas->parcial){
                //las rubricas no coincidenn con el parcial del alumno
                return false;
            }
            //asistencia
            if($rubricas->asistencia){
                $count_rubricas += 1;
                if(array_key_exists('asistencia', $alumno)){
                    $rubrica_promedio_asistencia = $alumno["asistencia"];
                    $rubrica_resultado_asistencia = $this->getPorcentajeRubrica($alumno["asistencia"], $rubricas->asistencia);
                    if($rubrica_resultado_asistencia <= $rubricas->asistencia){
                        //el porcentaje coinciden 
                        $count_rubricas_correctas += 1;
                        $count_rubricas_porcentaje_total = $count_rubricas_porcentaje_total+$rubrica_resultado_asistencia;
                        /*$faltas = ($alumno["asistencia"] * 10 * $rubricas->total_asistencias) / 100; //al reves => faltas - asistencias totales = resultado / asistencias totales x 100 = resultado%
                        $faltas = $rubricas->total_asistencias - $faltas;*/
                    }else{
                        //el porcentaje es mayor
                        return false;
                    }
                }else{
                    //se necesita asistencias
                    return false;
                }
            }
            //examen
            if($rubricas->examen){
                $count_rubricas += 1;
                if(array_key_exists('examen', $alumno)){
                    $rubrica_promedio_examen = $alumno["examen"];
                    $rubrica_resultado_examen = $this->getPorcentajeRubrica($alumno["examen"], $rubricas->examen);
                    if($rubrica_resultado_examen <= $rubricas->examen){
                        //el porcentaje coinciden 
                        $count_rubricas_correctas += 1;
                        $count_rubricas_porcentaje_total = $count_rubricas_porcentaje_total+$rubrica_resultado_examen;
                    }else{
                        //el porcentaje es mayor
                        return false;
                    }
                }else{
                    //se necesita examen
                    return false;
                }
            }
            //practicas
             if($rubricas->practicas){
                $count_rubricas += 1;
                if(array_key_exists('practicas', $alumno)){
                    $rubrica_promedio_practicas = $alumno["practicas"];
                    $rubrica_resultado_practicas = $this->getPorcentajeRubrica($alumno["practicas"], $rubricas->practicas);
                    if($rubrica_resultado_practicas <= $rubricas->practicas){
                        //el porcentaje coinciden 
                        $count_rubricas_correctas += 1;
                        $count_rubricas_porcentaje_total = $count_rubricas_porcentaje_total+$rubrica_resultado_practicas;
                    }else{
                        //el porcentaje es mayor
                        return false;
                    }
                }else{
                    //se necesita practicas
                    return false;
                }
            }
            //tareas
            if($rubricas->tareas){
                $count_rubricas += 1;
                if(array_key_exists('tareas', $alumno)){
                    $rubrica_promedio_tarea = $alumno["tareas"];
                    $rubrica_resultado_tarea = $this->getPorcentajeRubrica($alumno["tareas"], $rubricas->tareas);
                    if($rubrica_resultado_tarea <= $rubricas->tareas){
                        //el porcentaje coinciden 
                        $count_rubricas_correctas += 1;
                        $count_rubricas_porcentaje_total = $count_rubricas_porcentaje_total+$rubrica_resultado_tarea;
                    }else{
                        //el porcentaje es mayor
                        return false;
                    }
                }else{
                    //se necesita tareas
                    return false;
                }
            }
            //faltas totales
            if(array_key_exists('faltas', $alumno)){
                $faltas = $alumno["faltas"];
            }else{
                $faltas = null;
            }
            //comprobar si se cumple numero de rubricas
            if($count_rubricas == $count_rubricas_correctas){
                $calificaciones = array(
                    "alumno_id" => $alumno["alumno_id"], 
                    "parcial" => $alumno["parcial"], 
                    "calificacion" => $count_rubricas_porcentaje_total*0.10, 
                    "examen" => $rubrica_promedio_examen, 
                    "asistencia" => $rubrica_promedio_asistencia, 
                    "practicas" => $rubrica_promedio_practicas, 
                    "tareas" => $rubrica_promedio_tarea,
                    "faltas" => $faltas,
                    "porcentaje_final" => $count_rubricas_porcentaje_total
                );
                array_push($array_alumno, $calificaciones);
            }else{
                return false;
            }
        }
        $new_request = $request->all(); //nuevo request
        unset($new_request['alumnos']); //eliminar anterior arreglo alumnos
        $new_request = $new_request + ["alumnos" => $array_alumno];
        return $new_request;
    }

    public function getPeriodoActual()
    {
        try {
            $periodo_actual = Sisec::periodoActual();
            return $periodo_actual;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible cargar la calificación del alumno', 400);
        } 
    }

    public function show($id)
    {
        try {
            $rubricas_evaluacion = RubricasEvaluacion::findOrFail($id);
            return ResponseJson::data($rubricas_evaluacion, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la rubricas', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la rubricas', 400);
        } 
    }

    public function update(StoreBitacoraEvaluacionRequest $request, $id)
    {
        try{
            DB::beginTransaction();
            $rubricas_evaluacion = RubricasEvaluacion::findOrFail($id);
            $rubricas_evaluacion->update([
                'parcial' => $request->parcial,
                'asistencia' => $request->asistencia,
                'examen' => $request->examen,
                'practicas' => $request->practicas,
                'tareas' => $request->tareas,
                'docente_asignatura_id' => $request->docente_asignatura_id,
                'alumno_id' => $request->alumno_id
            ]);
            DB::commit();
            return ResponseJson::msg('Datos del rubricas modificados correctamente', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::error('No fue posible modificar los datos de la rubricas', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible modificar los datos de la rubricas', 400);
        } 
    }

    public function destroy($id)
    {
        try {
            $rubricas_evaluacion = RubricasEvaluacion::findOrFail($id);
            $rubricas_evaluacion->delete($id);
            return ResponseJson::msg('Rubricas eliminadas correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar las rubricas', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar las rubricas', 400);
        } 
    }

}
