<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreRubricasEvaluacionRequest;
use Illuminate\Support\Facades\DB;
use App\RubricasEvaluacion;
use App\DocenteAsignatura;
use App\DocentePlantilla;
use App\UsuarioDocente;
use App\AlumnoGrupo;
use App\BitacoraEvaluacion;
use App\Traits\AuditoriaLogHelper;
use ResponseJson;
use ValidationsDocente;
use Sisec;

class RubricasEvaluacionController extends Controller
{
    use AuditoriaLogHelper;

    public function index()
    {
        $rubricas_evaluacion = RubricasEvaluacion::all();

        return ResponseJson::data($rubricas_evaluacion, 200);
    }

    public function store(StoreRubricasEvaluacionRequest $request)
    {
        try {
            //comprobar disponibilidad del docente
            DB::beginTransaction();
            $docente_asignatura = DocenteAsignatura::find($request->docente_asignatura_id);
            $docente_plantilla = DocentePlantilla::find($docente_asignatura->plantilla_docente_id);
            $is_available_asignacion_docente = ValidationsDocente::isAvailableDocenteAsignacion($docente_plantilla->id);
            $is_available_asignatura_docente = ValidationsDocente::isAvailableDocenteAsignatura($request->docente_asignatura_id);
            $is_available_docente = ValidationsDocente::isAvailableDocente($docente_plantilla->docente_id);
            if($is_available_docente){
                if($is_available_asignacion_docente){
                    if($is_available_asignatura_docente){
                        //comprobar si pertenece la asignatura
                        $user = auth()->user();
                        $is_my_uac = $this->isDocenteMyUac($docente_asignatura, $user);
                        if($is_my_uac){
                            //comprobar porcentaje total de rubricas
                            $rubricas_suma = $this->sumaRubricas($request->asistencia, $request->examen, $request->practicas, $request->tareas);
                            if($rubricas_suma == 100){
                                $exist_rubricas_parcial = $this->existRubricasEnParcial($request->docente_asignatura_id, $request->parcial);
                                if($exist_rubricas_parcial){
                                    $rubricas_evaluacion = RubricasEvaluacion::create([
                                        'parcial' => $request->parcial,
                                        // 'total_asistencias' => $request->total_asistencias,
                                        'asistencia' => $request->asistencia,
                                        'examen' => $request->examen,
                                        'practicas' => $request->practicas,
                                        'tareas' => $request->tareas,
                                        'docente_asignatura_id' => $request->docente_asignatura_id
                                    ]);
                                    $this->auditoriaSave($rubricas_evaluacion); /* adutoria log */ 
                                }else{
                                    return ResponseJson::msg('El parcial ya cuenta con rubricas de evaluación', 400);        
                                }
                            }else if($rubricas_suma != 100){
                                return ResponseJson::msg('El porcentaje de rubricas es de '.$rubricas_suma.'% el total debe ser 100%', 400);
                            }
                        }else{
                            throw new ModelNotFoundException();
                        }
                    }else{
                        return ResponseJson::msg('La asignatura del docente no se encuentra disponible', 400);   
                    }
                }else{
                    return ResponseJson::msg('La asignación del docente no se encuentra disponible', 400);
                }
            }else{
                return ResponseJson::msg('El docente no se encuentra disponible', 400);
            }
            DB::commit();
            return ResponseJson::data($rubricas_evaluacion, 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible definir las rubricas de evaluación', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible definir las rubricas de evaluación', 400);
        } 
    }

    public function isDocenteMyUac($docente_asignatura, $user)
    {
        try {
            $usuario_docente = UsuarioDocente::where('usuario_id', $user->id)->first();
            /* asignaciones docente */
            $plantillas_docente = DocentePlantilla::where('docente_id', $usuario_docente->docente_id)->get();
            $find = false;
            foreach($plantillas_docente as $plantilla){
                if($plantilla->id == $docente_asignatura->plantilla_docente_id){
                    $find = true;
                }
            }
            return $find;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public function existRubricasEnParcial($docente_asignatura_id, $parcial)
    {   
        try {
            $rubricas_evaluacion = RubricasEvaluacion::where([
                ['docente_asignatura_id' , $docente_asignatura_id],
                ['parcial', $parcial]
            ])->get();
            if($rubricas_evaluacion->isNotEmpty()){
                return false;
            }
            return true;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public function sumaRubricas($asistencia, $examen, $practicas, $tareas)
    {
        $count_porcentaje = 0;
        $count_porcentaje = $count_porcentaje + $asistencia + $examen + $practicas + $tareas;
        return $count_porcentaje;
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

    public function showWithAsignatura($id)
    {
        try {
            $rubricas_evaluacion = RubricasEvaluacion::whereHas('docenteAsignatura', function($q) use($id){
                $q->where('id', $id);
            })->orderBy('parcial')->get();
            /*
             $rubricas_evaluacion = DocenteAsignatura::where('id', $id)->with(['rubricasEvaluacion' => function($q){
                $q->orderBy('parcial');
            }])->get();*/
            return ResponseJson::data($rubricas_evaluacion, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la rubricas', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible encontar la rubricas', 400);
        } 
    }

    public function update(StoreRubricasEvaluacionRequest $request, $id)
    {
        try{
           //comprobar disponibilidad del docente
           DB::beginTransaction();
           $rubricas_evaluacion = RubricasEvaluacion::findOrFail($id);
           $docente_asignatura = DocenteAsignatura::find($request->docente_asignatura_id);
           $docente_plantilla = DocentePlantilla::find($docente_asignatura->plantilla_docente_id);
           $is_available_asignacion_docente = ValidationsDocente::isAvailableDocenteAsignacion($docente_plantilla->id);
           $is_available_asignatura_docente = ValidationsDocente::isAvailableDocenteAsignatura($request->docente_asignatura_id);
           $is_available_docente = ValidationsDocente::isAvailableDocente($docente_plantilla->docente_id); 
            if($is_available_docente){
                if($is_available_asignacion_docente){
                    if($is_available_asignatura_docente){
                        //comprobar si pertenece la asignatura
                        $user = auth()->user();
                        $is_my_uac = $this->isDocenteMyUac($docente_asignatura, $user);
                        if($is_my_uac){
                            $is_my_rubrica = $this->isMyRubrica($request->docente_asignatura_id, $rubricas_evaluacion);
                            if($is_my_rubrica){
                                //comprobar porcentaje total de rubricas
                                $is_student_rubrica = $this->isExistStudentWithRubricas($rubricas_evaluacion, $request->docente_asignatura_id);
                                if(!$is_student_rubrica){
                                    $rubricas_suma = $this->sumaRubricas($request->asistencia, $request->examen, $request->practicas, $request->tareas);
                                    if($rubricas_suma == 100){
                                        //$exist_rubricas_parcial = $this->existRubricasEnParcial($request->docente_asignatura_id, $request->parcial);
                                        $exist_rubricas_parcial = false;
                                        if(!$exist_rubricas_parcial){
                                            $old_data = RubricasEvaluacion::findOrFail($id);
                                            $rubricas_evaluacion = RubricasEvaluacion::findOrFail($id);
                                            $rubricas_evaluacion->update([
                                                // 'total_asistencias' => $request->total_asistencias,
                                                'asistencia' => $request->asistencia,
                                                'examen' => $request->examen,
                                                'practicas' => $request->practicas,
                                                'tareas' => $request->tareas
                                               // 'docente_asignatura_id' => $request->docente_asignatura_id
                                            ]);
                                            $this->auditoriaSave($rubricas_evaluacion, $old_data); /* adutoria log */ 
                                        }else{
                                            return ResponseJson::msg('El parcial ya cuenta con rubricas de evaluación', 400);        
                                        }
                                    }else if($rubricas_suma != 100){
                                        return ResponseJson::msg('El porcentaje de rubricas es de '.$rubricas_suma.' el total debe ser 100%', 400);
                                    }
                                }else{
                                    return ResponseJson::msg('No es posible modificar la rubrica de evaluación si ya fue aplicada para evaluaciones', 400);
                                }
                            }else{
                                 //la asignatura no pertenece a las rubricas
                                throw new ModelNotFoundException();
                            }
                        }else{
                            //la asignación no pertenece a la asignatura y rubrica
                            throw new ModelNotFoundException();
                        }
                    }else{
                        return ResponseJson::msg('La asignatura del docente no se encuentra disponible', 400);   
                    }
                }else{
                    return ResponseJson::msg('La asignación del docente no se encuentra disponible', 400);
                }
            }else{
                return ResponseJson::data('El docente no se encuentra disponible', 400);
            }
           DB::commit();
           return ResponseJson::data($rubricas_evaluacion, 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible modificar los datos de la rubricas', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible modificar los datos de la rubricas', 400);
        } 
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $rubricas_evaluacion = RubricasEvaluacion::findOrFail($id);
            $docente_asignatura = DocenteAsignatura::find($rubricas_evaluacion->docente_asignatura_id);
            $docente_plantilla = DocentePlantilla::find($docente_asignatura->plantilla_docente_id);
            $is_available_asignacion_docente = ValidationsDocente::isAvailableDocenteAsignacion($docente_plantilla->id);
            $is_available_asignatura_docente = ValidationsDocente::isAvailableDocenteAsignatura($rubricas_evaluacion->docente_asignatura_id);
            $is_available_docente = ValidationsDocente::isAvailableDocente($docente_plantilla->docente_id);
            if($is_available_docente){
                if($is_available_asignacion_docente){
                    if($is_available_asignatura_docente){
                        //comprobar porcentaje total de rubricas
                        $user = auth()->user();
                        $is_my_uac = $this->isDocenteMyUac($docente_asignatura, $user);
                        if($is_my_uac){
                            $exist_rubricas_bitacora = $this->existRubricasEnBitacora($rubricas_evaluacion, $docente_asignatura->id);
                            if($exist_rubricas_bitacora){
                                $rubricas_evaluacion->delete($id);
                                $this->auditoriaSave($rubricas_evaluacion); /* adutoria log */ 
                            }else{
                                return ResponseJson::msg('No es posible eliminar la rubrica de evaluación si ya fue aplicada para evaluaciones', 400);   
                            }
                        }
                    }else{
                        return ResponseJson::msg('La asignatura del docente no se encuentra disponible', 400);   
                    }
                }else{
                    return ResponseJson::msg('La asignación del docente no se encuentra disponible', 400);
                }
            }else{
                return ResponseJson::msg('El docente no se encuentra disponible', 400);
            }
            DB::commit();
            return ResponseJson::msg('Rubricas eliminadas correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar las rubricas', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar las rubricas', 400);
        } 
    }

    public function existRubricasEnBitacora($rubricas_evaluacion, $docente_asignatura_id)
    {
        try {
            $bitacora_evaluacion = BitacoraEvaluacion::where([
                ['docente_asignatura_id' , $docente_asignatura_id],
                ['parcial', $rubricas_evaluacion->parcial]
            ])->get();
            if($bitacora_evaluacion->isNotEmpty()){
                return false;
            }
            return true;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public function isExistStudentWithRubricas($rubricas_evaluacion, $docente_asignatura_id)
    {
        try {
            $alumnos_bitacora = BitacoraEvaluacion::where('docente_asignatura_id', $docente_asignatura_id)->get();
            $docente_asignatura = DocenteAsignatura::find($docente_asignatura_id);
            foreach($alumnos_bitacora as $obj){
                //consultar parcial de rubricas en bitacora
                if($obj->parcial == $rubricas_evaluacion->parcial){
                    //consultar si el alumno en bitacora pertenece aun al grupo docente asignatura
                    $grupo_periodo_alumno = AlumnoGrupo::where([
                        ['alumno_id', $obj->alumno_id],
                        ['grupo_periodo_id', $docente_asignatura->grupo_periodo_id]
                    ])->get();
                    if($grupo_periodo_alumno->isNotEmpty()){
                        return true;
                    }
                }
            }
            return false;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }    
    }

    public function isMyRubrica($docente_asignatura_id, $rubricas_evaluacion)
    {
        try {
            $docente_asignatura = DocenteAsignatura::find($docente_asignatura_id);
            if($rubricas_evaluacion->docente_asignatura_id == $docente_asignatura->id){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible añadir las calificaciones al alumno', 400);
        }
    }

}
