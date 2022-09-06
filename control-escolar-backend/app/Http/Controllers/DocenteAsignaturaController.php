<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreDocenteAsignaturaRequest;
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
use Sisec;
use ResponseJson;
use ValidationsDocente;
use HelperPermisoAlcance;

class DocenteAsignaturaController extends Controller
{
    use AuditoriaLogHelper;

    public function index()
    {
        $docente_asignaturas = DocenteAsignatura::with('grupoPeriodo', 'plantel', 'carreraUac.uac', 'carreraUac.carrera', 'plantillaDocente.docente')->get();
        return ResponseJson::data($docente_asignaturas, 200);
    }

    public function store(StoreDocenteAsignaturaRequest $request)
    {
        try {
            DB::beginTransaction();
            if(!ValidationsDocente::isAvailableDocenteFromAsignacion($request->plantilla_docente_id)){
                return ResponseJson::msg('El docente no se encuentra activo', 400);
            } 
            if(!ValidationsDocente::isAvailableDocenteAsignacion($request->plantilla_docente_id)){
                return ResponseJson::msg('Asignación no disponible o no se encuentra activa', 400);    
            }
            /* periodo test */
            $periodo_actual = Sisec::periodoActual();
            if(isset($request->periodo_id)){
                $periodo_id = $request->periodo_id;
            }else{
                $periodo_id = $periodo_actual->id;
            }
            $plantel_id = $this->getPlantelByPlantilla($request->plantilla_docente_id);
            /* buscar si esta en uso la asingatura por el docente */
            if(!$this->isAvailableGroupAsignaturaFromAsignacion($request->grupo_periodo_id, $request->carrera_uac_id, $plantel_id, $request->plantilla_docente_id, $periodo_id)){
                return ResponseJson::msg('La asignatura ya se encuentra asignada al docente seleccionado', 400);
            }
            if(!$this->isAvailableGroupAsignatura($request->grupo_periodo_id, $request->carrera_uac_id, $plantel_id, $periodo_id)){
                return ResponseJson::msg('La asignatura ya se encuentra actualmente asignada a otro docente', 400);    
            }
            /* saltar validacion en caso de no ser asignatura actual */
            if($periodo_id == $periodo_actual->periodo_id){
                if($this->checkHoursDocente($request->plantilla_docente_id, $request->carrera_uac_id, $periodo_id)){
                    return ResponseJson::msg("El docente no cuenta con horas suficientes para impartir la materia", 400);
                }
            }
            if(!$this->checkGroupExistPlantel($request->grupo_periodo_id, $request->carrera_uac_id, $plantel_id)){
                return ResponseJson::msg("El grupo que intenta asignar no pertenece al plantel y a la carrera seleccionados", 400);
            }
            if(!$this->checkGroupWithPeriod($request->grupo_periodo_id, $periodo_id, $request->carrera_uac_id, $request->plantel_id)){
                return ResponseJson::msg("El grupo seleccionado no pertenece al periodo seleccionado", 400);
            }
            if(!$this->checkGroupWithSemestre($request->grupo_periodo_id, $request->carrera_uac_id)){
                return ResponseJson::msg("El grupo seleccionado no pertenece al semestre seleccionado", 400);
            }
            $docente_asignatura = DocenteAsignatura::create([
                'periodo_id' => $periodo_id,
                'grupo_periodo_id' => $request->grupo_periodo_id,
                'plantilla_docente_id' => $request->plantilla_docente_id,
                'carrera_uac_id' => $request->carrera_uac_id,
                'plantel_id' => $plantel_id,
                'estatus' => 1,
                ]);
            $this->auditoriaSave($docente_asignatura); /* auditoria log */
            DB::commit();
            return ResponseJson::msg('Asignatura creada con éxito', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible completar el proceso', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible completar el proceso', 404);
        } 
    }

    public function update(StoreDocenteAsignaturaRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $docente_asignatura = DocenteAsignatura::findOrFail($id);
            if(!ValidationsDocente::isAvailableDocenteFromAsignacion($request->plantilla_docente_id)){
                return ResponseJson::msg('El docente no se encuentra activo', 400);
            } 
            if(!ValidationsDocente::isAvailableDocenteAsignacion($request->plantilla_docente_id)){
                return ResponseJson::msg('Asignación no disponible o no se encuentra activa', 400);    
            }
            /* comprobar tipo usuario */
            $permisos = HelperPermisoAlcance::getPermisos();
            if(in_array('Plantel', $permisos)){
                return ResponseJson::msg("No tiene permisos para continuar", 400);
            }
            /* periodo test */
            if(isset($request->periodo_id)){
                $periodo_id = $request->periodo_id;
            }else{
                return ResponseJson::msg('Se necesita periodo para continuar', 400);    
            }
            $plantel_id = $this->getPlantelByPlantilla($request->plantilla_docente_id);
            /* buscar si esta en uso la asingatura por el docente */
            if($periodo_id != $docente_asignatura->periodo_id){
                if(!$this->isAvailableGroupAsignaturaFromAsignacion($request->grupo_periodo_id, $request->carrera_uac_id, $plantel_id, $request->plantilla_docente_id, $periodo_id)){
                    return ResponseJson::msg('La asignatura ya se encuentra asignada al docente seleccionado', 400);
                }
                if(!$this->isAvailableGroupAsignatura($request->grupo_periodo_id, $request->carrera_uac_id, $plantel_id, $periodo_id)){
                    return ResponseJson::msg('La asignatura ya se encuentra actualmente asignada a otro docente', 400);    
                }
                $old_data = $docente_asignatura;
                $docente_asignatura->update([
                    'periodo_id' => $periodo_id
                ]);
                $this->auditoriaSave($docente_asignatura, $old_data); /* adutoria log */ 
            }
            DB::commit();
            return ResponseJson::msg("Modificación realizada con éxito", 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg("No es posible modificar el recurso", 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No es posible modificar el recurso', 400);
        } 
    }

    public function destroy($id)
    {
        try {
            /* asignacion is activa */
            $docente_asignatura = DocenteAsignatura::findOrFail($id);
            $old_data = DocenteAsignatura::find($id);
            $is_available_docente_asignacion = ValidationsDocente::isAvailableDocenteAsignacion($docente_asignatura->plantilla_docente_id);
            if($is_available_docente_asignacion){
                if($docente_asignatura->estatus != 0){
                    $docente_asignatura->update([
                        'estatus' => 0
                    ]);
                    $this->auditoriaSave($docente_asignatura, $old_data); /* adutoria log */ 
                }else{
                    throw new ModelNotFoundException();
                }
            }else{
                return ResponseJson::msg('Asignación no disponible o no se encuentra activa', 400);
            }
            return ResponseJson::msg('Asignatura eliminada correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la Asignatura', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible eliminar la Asignatura', 400);
        } 
    }

    public function asignaturasDocenteFromControlEscolar($id)
    {
        try {
            if(HelperPermisoAlcance::isRolControlEscolar()){
                /* consultar estatus del docente */
                $docente_asignatura = DocenteAsignatura::findorFail($id);
                //consultar estatus asignatura
                $is_available_asignatura = ValidationsDocente::isAvailableDocenteAsignaturaOutPeriod($id);
                if($is_available_asignatura){
                    /* alcance usuario */
                    $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
                    $permisos = HelperPermisoAlcance::getPermisos();
                    /* docente */
                    $docente_plantilla = DocentePlantilla::find($docente_asignatura->plantilla_docente_id);
                    /* calificaciones */
                    $docente_id = $docente_plantilla->docente_id;
                    $carrera_uac_id = $docente_asignatura->carrera_uac_id;
                    $plantel_id = $docente_asignatura->plantel_id;
                    $docente_asignatura_id = $docente_asignatura->id;
                    $fecha_actual = Carbon::now()->toDateString();
                    $periodo_actual = Sisec::periodoActual();
                    $periodo_actual_id = $periodo_actual->id;
                    if(in_array('Nacional', $permisos)){ //evaluar nivel de alcance para ver materias
                        $docente_asignatura = DocenteAsignatura::where([
                            ['id', $id],
                            ['periodo_id', $periodo_actual_id]
                        ])->with([
                        //alumnos recursamiento
                        'grupoPeriodo.alumnoUacGrupo' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $docente_asignatura_id, $periodo_actual_id){
                            $query->where('carrera_uac_id', $carrera_uac_id)->with([
                                //calificaciones alumno
                                'alumno.calificacionUac' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $periodo_actual_id){
                                    $query->where([
                                        ['carrera_uac_id', $carrera_uac_id],
                                        ['plantel_id', $plantel_id],
                                        ['periodo_id', $periodo_actual_id]
                                    ])->orWhere([
                                        ['carrera_uac_id', $carrera_uac_id],
                                        ['docente_id', $docente_id],
                                        ['plantel_id', $plantel_id],
                                        ['periodo_id', $periodo_actual_id]
                                    ])->orderBy('parcial');
                                },
                                //informacion alumno
                                'alumno' => function ($query){
                                    $query->orderBy('usuario_id')->with('usuario');
                                },
                                //bitacora alumno
                                'alumno.bitacoraEvaluacion' => function ($query) use($docente_asignatura_id, $periodo_actual_id, $docente_id, $carrera_uac_id, $plantel_id){
                                    $query->where([
                                        ['carrera_uac_id', $carrera_uac_id],
                                        ['plantel_id', $plantel_id],
                                        ['periodo_id', $periodo_actual_id],
                                        ['id', $docente_asignatura_id]
                                    ]);
                                }
                            ]);
                        },
                        //alumnos normal
                        'grupoPeriodo.alumnos.calificacionUac' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $periodo_actual_id){
                            $query->where([
                                ['carrera_uac_id', $carrera_uac_id],
                                ['plantel_id', $plantel_id],
                                ['periodo_id', $periodo_actual_id]
                            ])->orWhere([
                                ['carrera_uac_id', $carrera_uac_id],
                                ['docente_id', $docente_id],
                                ['plantel_id', $plantel_id],
                                ['periodo_id', $periodo_actual_id]
                            ])->orderBy('parcial');
                        },
                        //bitacora alumno
                        'grupoPeriodo.alumnos.bitacoraEvaluacion' => function ($query) use($docente_asignatura_id, $periodo_actual_id, $docente_id, $carrera_uac_id, $plantel_id){
                            $query->where([
                                ['carrera_uac_id', $carrera_uac_id],
                                ['plantel_id', $plantel_id],
                                ['periodo_id', $periodo_actual_id],
                                ['docente_asignatura_id', $docente_asignatura_id]
                            ]);
                        },
                        //informacion alumno
                        'grupoPeriodo.alumnos' => function($query){
                            $query->orderBy('usuario_id')->with('usuario');
                        },
                        //fechas evaluaciones
                        'plantel.evaluacionesOrdinarias' => function($query) use($fecha_actual, $periodo_actual){
                            $query->where([
                                ['fecha_inicio', '<=', $fecha_actual],
                                ['fecha_final', '>=', $fecha_actual],
                                ['periodo_id', $periodo_actual->id]
                            ]);
                        },
                        //recuperacion
                        'plantel.recuperacionParciales' => function($query) use($periodo_actual){
                            $query->where('periodo_id' , $periodo_actual->id);
                        },
                        //rubricas
                        'rubricasEvaluacion' => function ($q){
                            $q->orderBy('parcial');
                        },
                        'carreraUac.uac', 'carreraUac.carrera', 'plantillaDocente.docente'])->first();
                    }else{
                        //comprobar alcance 
                        $docente_asignatura = DocenteAsignatura::where('id', $id)
                        //validacion de alcance
                        ->whereHas('plantillaDocente', function ($query) use($planteles_alacance){
                            $query->whereIn('plantel_id', $planteles_alacance);
                        })
                        ->whereHas('grupoPeriodo.periodo', function ($q) use($periodo_actual_id){
                            $q->where('id', $periodo_actual_id);
                        })->with([
                        //alumnos recursamiento
                        'grupoPeriodo.alumnoUacGrupo' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $docente_asignatura_id, $periodo_actual_id){
                            $query->where('carrera_uac_id', $carrera_uac_id)->with([
                                //calificaciones alumno
                                'alumno.calificacionUac' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $periodo_actual_id){
                                    $query->where([
                                        ['carrera_uac_id', $carrera_uac_id],
                                        ['plantel_id', $plantel_id],
                                        ['periodo_id', $periodo_actual_id]
                                    ])->orWhere([
                                        ['carrera_uac_id', $carrera_uac_id],
                                        ['docente_id', $docente_id],
                                        ['plantel_id', $plantel_id],
                                        ['periodo_id', $periodo_actual_id]
                                    ])->orderBy('parcial');
                                },
                                //informacion alumno
                                'alumno' => function ($query){
                                    $query->orderBy('usuario_id')->with('usuario');
                                },
                                //bitacora alumno
                                'alumno.bitacoraEvaluacion' => function ($query) use($docente_asignatura_id, $periodo_actual_id, $docente_id, $carrera_uac_id, $plantel_id){
                                    $query->where([
                                        ['carrera_uac_id', $carrera_uac_id],
                                        ['plantel_id', $plantel_id],
                                        ['periodo_id', $periodo_actual_id],
                                        ['id', $docente_asignatura_id]
                                    ]);
                                }
                            ]);
                        },
                        //alumnos normal
                        'grupoPeriodo.alumnos.calificacionUac' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $periodo_actual_id){
                            $query->where([
                                ['carrera_uac_id', $carrera_uac_id],
                                ['plantel_id', $plantel_id],
                                ['periodo_id', $periodo_actual_id]
                            ])->orWhere([
                                ['carrera_uac_id', $carrera_uac_id],
                                ['docente_id', $docente_id],
                                ['plantel_id', $plantel_id],
                                ['periodo_id', $periodo_actual_id]
                            ])->orderBy('parcial');
                        },
                        //bitacora alumno
                        'grupoPeriodo.alumnos.bitacoraEvaluacion' => function ($query) use($docente_asignatura_id, $periodo_actual_id, $docente_id, $carrera_uac_id, $plantel_id){
                            $query->where([
                                ['carrera_uac_id', $carrera_uac_id],
                                ['plantel_id', $plantel_id],
                                ['periodo_id', $periodo_actual_id],
                                ['docente_asignatura_id', $docente_asignatura_id]
                            ]);
                        },
                        //informacion alumno
                        'grupoPeriodo.alumnos' => function($query){
                            $query->orderBy('usuario_id')->with('usuario');
                        },
                        //fechas evaluaciones
                        'plantel.evaluacionesOrdinarias' => function($query) use($fecha_actual, $periodo_actual_id){
                            $query->where([
                                ['fecha_inicio', '<=', $fecha_actual],
                                ['fecha_final', '>=', $fecha_actual],
                                ['periodo_id', $periodo_actual_id]
                            ]);
                        },
                        //recuperacion
                        'plantel.recuperacionParciales' => function($query) use($periodo_actual_id){
                            $query->where('periodo_id' , $periodo_actual_id);
                        },
                        //rubricas
                        'rubricasEvaluacion' => function ($q){
                            $q->orderBy('parcial');
                        },
                        'carreraUac.uac', 'carreraUac.carrera', 'plantillaDocente.docente'])->first();
                        if($docente_asignatura == null){
                            throw new ModelNotFoundException();
                        }
                    }
                    if($docente_asignatura){
                        return ResponseJson::data($docente_asignatura, 200);
                    }else{
                        throw new ModelNotFoundException();    
                    }
                }else{
                    throw new ModelNotFoundException();
                }
            }else{
                return ResponseJson::msg('No tiene permisos para continuar', 400);
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontrar la Asignatura', 400);
        }
    }
    
    public function asignaturasFromDocente($id)
    {
        try {
            /* docente_id */
            $user = auth()->user();
            /* consultar estatus del docente */
            $docente_asignatura = DocenteAsignatura::findorFail($id);
            //consultar estatus asignatura
            $is_available_asignatura = ValidationsDocente::isAvailableDocenteAsignatura($id);
            if($is_available_asignatura){
                /* consultar si al docente le pertenece la asignatura */
                $docente_is_my_uac = $this->isDocenteMyUac($docente_asignatura, $user);
                if($docente_is_my_uac){
                    $is_available_docente_docente = ValidationsDocente::isAvailableDocenteFromAsignacion($docente_asignatura->plantilla_docente_id);
                    if($is_available_docente_docente){
                        $is_available_docente_asignacion = ValidationsDocente::isAvailableDocenteAsignacion($docente_asignatura->plantilla_docente_id);
                        if($is_available_docente_asignacion){
                            /* docente */
                            $docente_plantilla = DocentePlantilla::find($docente_asignatura->plantilla_docente_id);
                            /* calificaciones */
                            $docente_id = $docente_plantilla->docente_id;
                            $carrera_uac_id = $docente_asignatura->carrera_uac_id;
                            $plantel_id = $docente_asignatura->plantel_id;
                            $docente_asignatura_id = $docente_asignatura->id;
                            $fecha_actual = Carbon::now()->toDateString();
                            $periodo_actual = Sisec::periodoActual();
                            $periodo_actual_id = $periodo_actual->id;
                            $docente_asignatura = DocenteAsignatura::where('id', $id)->whereHas('grupoPeriodo.periodo', function ($q) use($periodo_actual){
                                $q->where('id', $periodo_actual->id);
                            })->with([
                            //alumnos recursamiento
                            'grupoPeriodo.alumnoUacGrupo' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $docente_asignatura_id, $periodo_actual_id){
                                $query->where('carrera_uac_id', $carrera_uac_id)->with([
                                    //calificaciones alumno
                                    'alumno.calificacionUac' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $periodo_actual_id){
                                        $query->where([
                                            ['carrera_uac_id', $carrera_uac_id],
                                            ['plantel_id', $plantel_id],
                                            ['periodo_id', $periodo_actual_id]
                                        ])->orWhere([
                                            ['carrera_uac_id', $carrera_uac_id],
                                            ['docente_id', $docente_id],
                                            ['plantel_id', $plantel_id],
                                            ['periodo_id', $periodo_actual_id]
                                        ])->orderBy('parcial');
                                    },
                                    //informacion alumno
                                    'alumno' => function ($query){
                                        $query->orderBy('usuario_id')->with('usuario');
                                    },
                                    //bitacora alumno
                                    'alumno.bitacoraEvaluacion' => function ($query) use($docente_asignatura_id, $periodo_actual_id, $docente_id, $carrera_uac_id, $plantel_id){
                                        $query->where([
                                            ['carrera_uac_id', $carrera_uac_id],
                                            ['plantel_id', $plantel_id],
                                            ['periodo_id', $periodo_actual_id],
                                            ['docente_asignatura_id', $docente_asignatura_id]
                                        ]);
                                    }
                                ]);
                            },
                            //alumnos normal
                            'grupoPeriodo.alumnos.calificacionUac' => function($query) use($docente_id, $carrera_uac_id, $plantel_id, $periodo_actual_id){
                                $query->where([
                                    ['carrera_uac_id', $carrera_uac_id],
                                    ['plantel_id', $plantel_id],
                                    ['periodo_id', $periodo_actual_id]
                                ])->orWhere([
                                    ['carrera_uac_id', $carrera_uac_id],
                                    ['docente_id', $docente_id],
                                    ['plantel_id', $plantel_id],
                                    ['periodo_id', $periodo_actual_id]
                                ])->orderBy('parcial');
                            },
                            //bitacora alumno
                            'grupoPeriodo.alumnos.bitacoraEvaluacion' => function ($query) use($docente_asignatura_id, $periodo_actual_id, $docente_id, $carrera_uac_id, $plantel_id){
                                $query->where([
                                    ['carrera_uac_id', $carrera_uac_id],
                                    ['plantel_id', $plantel_id],
                                    ['periodo_id', $periodo_actual_id],
                                    ['docente_asignatura_id', $docente_asignatura_id]
                                ]);
                            },
                            //informacion alumno
                            'grupoPeriodo.alumnos' => function($query){
                                $query->orderBy('usuario_id')->with('usuario');
                            },
                            //fechas evaluaciones
                            'plantel.evaluacionesOrdinarias' => function($query) use($fecha_actual, $periodo_actual){
                                $query->where([
                                    ['fecha_inicio', '<=', $fecha_actual],
                                    ['fecha_final', '>=', $fecha_actual],
                                    ['periodo_id', $periodo_actual->id]
                                ]);
                            },
                            //rubricas
                            'rubricasEvaluacion' => function ($q){
                                $q->orderBy('parcial');
                            },
                            'carreraUac.uac', 'carreraUac.carrera'])->first();
                            return ResponseJson::data($docente_asignatura, 200);
                        }else{
                            throw new ModelNotFoundException();
                        }
                    }else{
                        throw new ModelNotFoundException();
                    }
                }else{
                    throw new ModelNotFoundException();
                }
            }else{
                throw new ModelNotFoundException();
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontrar la Asignatura', 400);
        }
    }
    
    /**
     * Obtener docente asignaturas dependiendo parametros
     *
     * @param \Illuminate\Http\Request $request
     * @param $grupo_periodo_id
     * @param $carrera_uac_id
     * @return \Illuminate\Http\ResponseJson
     */
    public function getDocentesByAsignatura(Request $request)
     {
        try {
            $grupo_periodo = GrupoPeriodo::findOrFail($request->grupo_periodo_id);
            $periodo_id = $grupo_periodo->periodo_id;
            $docentes = Docente::whereHas('docentePlantilla', function ($query) use($request, $periodo_id){
                $query->whereHas('docenteAsignatura', function ($query) use($request, $periodo_id){
                    $query->where([
                        ['grupo_periodo_id', $request->grupo_periodo_id],
                        ['carrera_uac_id', $request->carrera_uac_id],
                        ['periodo_id', $periodo_id],
                        ['estatus', 1],
                    ]);
                });
            })->get();
            if(count($docentes) <= 0){
                return ResponseJson::msg("No se encontraron resultados de algún docente que impartiera la marteria seleccionada en el periodo seleccionado", 400);    
            }else{
                return ResponseJson::data($docentes, 200);
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("No se encontraron resultados", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No se encontraron resultados', 400);
        }    
     }

    /* utils */
    public function checkGroupWithPeriod($grupo_periodo_id, $periodo_id, $carrera_uac_id, $plantel_id)
    {
        try {
            $grupo_periodo = GrupoPeriodo::findOrFail($grupo_periodo_id);
            if($grupo_periodo->periodo_id == $periodo_id){
                /* check carrera */
                $carrera_uac = CarreraUac::find($carrera_uac_id);
                $plantel_carrera = PlantelCarrera::where([
                    'carrera_id' => $carrera_uac->carrera_id,
                    'plantel_id' => $plantel_id
                ])->first();
                if($grupo_periodo->plantel_carrera_id == $plantel_carrera->id){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public function checkGroupWithSemestre($grupo_periodo_id, $carrera_uac_id)
    {
        try {
            $grupo_periodo = GrupoPeriodo::findOrFail($grupo_periodo_id);
            $carrera_uac = CarreraUac::find($carrera_uac_id);
            if($grupo_periodo->semestre == $carrera_uac->semestre){
            return true;
            }else{
            return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }    
    }

    public function checkGroupExistPlantel($grupo_periodo_id, $carrera_uac_id, $plantel_id)
    {
        try {
            $grupo_periodo = GrupoPeriodo::findOrFail($grupo_periodo_id);
            $plantel_carrera = PlantelCarrera::findOrFail($grupo_periodo->plantel_carrera_id);
            $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
            if($plantel_carrera->plantel_id == $plantel_id && $plantel_carrera->carrera_id == $carrera_uac->carrera_id){
                //si el plantel del grupo es igual al plantel de la asignacion y la carrera que se envia es igual a la del grupo
                return true;
            }else{
                //el grupo no pertenece al plantel de la asignacion/plantilla y la carrera no pertenece al grupo
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        } 
    }

    public function getPlantelByPlantilla($id)
    {
        try {
            $plantel_id = DocentePlantilla::findOrFail($id);
            return $plantel_id->plantel_id;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        } 
    }

    public function getHoursUac($carrera_uac_id)
    {
        try {
            $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
            $uac = UAC::findOrFail($carrera_uac->uac_id);
            $horas = $uac->creditos / 2;
            return $horas;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado al buscar la uac", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado al buscar la uac', 400);
        } 
    }
    
    public function getHoursDocente($plantilla_id)
    {
        try {
            $plantilla_docente = DocentePlantilla::findOrFail($plantilla_id);
            return $plantilla_docente->horas;
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado al buscar al docente", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado al buscar al docente', 400);
        } 
    }

    public function checkHoursDocente($plantilla_docente_id, $carrera_uac_id, $periodo_id, $isUpdate = null)
    {
        try {
            $docente_hours = $this->getHoursDocente($plantilla_docente_id);
            $count_hours = 0;
            /* si es update agregar horas de la uac a horas docente para hacer validación */
            if($isUpdate){
                $uac_hours = $this->getHoursUac($carrera_uac_id); /* get horas materia a la semana */
                $docente_hours += $uac_hours;
            }
            /* sumar horas de nueva materia a contador */
            $uac_hours = $this->getHoursUac($carrera_uac_id);
            $count_hours += $uac_hours;
            /* buscar horas a la semana vinculadas al docente */
            $docente_asignatura = DocenteAsignatura::where([
                ['plantilla_docente_id', $plantilla_docente_id],
                ['periodo_id', $periodo_id]
                ])->get();
            foreach($docente_asignatura as $obj){
                if($obj->estatus > 0){
                    $uac_hours = $this->getHoursUac($obj->carrera_uac_id); /* get horas materia a la semana */
                    $count_hours += $uac_hours; /* horas acumuladas */
                }
            }
            if($count_hours >= $docente_hours){
                /* horas completas */
                return true;
            }else {  
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado al buscar al docente", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado al buscar al docente', 400);
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

    public function isAvailableGroupAsignatura($grupo_periodo_id, $carrera_uac_id, $plantel_id, $periodo_id)
    {
        try {
            $docente_asignatura = DocenteAsignatura::where([
                ['grupo_periodo_id', $grupo_periodo_id],
                ['carrera_uac_id', $carrera_uac_id],
                ['plantel_id', $plantel_id],
                ['periodo_id', $periodo_id]
            ])->get();
            $result = 0; /* contador */
            if($docente_asignatura->isNotEmpty()){
                $size = count($docente_asignatura); /* tamaño de datos encontrados */
                $result = $size; /* igualar el contaddor */
                /* estatus es eliminado */
                foreach($docente_asignatura as $obj) {
                    if($obj->estatus == 1){
                        $plantilla = DocentePlantilla::find($obj->plantilla_docente_id);
                        if($plantilla->plantilla_estatus == 1){
                            /* en uso por algun docente */
                            $result--; /* si hay algun dato en uso romper contador */
                        }
                    }
                }
                /* encontro pero con estatus eliminado */
                if($result == $size){ 
                    /* se recorio el arreglo y todos los valores evaluados */
                    return true;
                }else{
                    /* un valor en uso */
                    return false;
                }
            }else{
                /* disponible */
                return true;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }

    public function isAvailableGroupAsignaturaFromAsignacion($grupo_periodo_id, $carrera_uac_id, $plantel_id, $plantilla_docente_id, $periodo_id)
    {
        try {
            $docente_asignatura = DocenteAsignatura::where([
                ['grupo_periodo_id', $grupo_periodo_id],
                ['plantilla_docente_id', $plantilla_docente_id],
                ['carrera_uac_id', $carrera_uac_id],
                ['plantel_id', $plantel_id],
                ['periodo_id', $periodo_id]
            ])->get();
            $result = 0; /* contador recorrido arrelgo */
            if($docente_asignatura->isNotEmpty()){
                $size = count($docente_asignatura);
                $result = $size;
                /* estatus es eliminado */
                foreach($docente_asignatura as $obj) {
                    if($obj->estatus == 1){
                        /* disponible */
                        $result--;
                    }
                }
            /* evaluar recorrido */
            if($result == $size){
                /* no se rompio recorrido */
                return true;
            }else{
                return false;
            }
            }else{
                /* disponible */
                return true;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("Error inesperado", 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('Error inesperado', 400);
        }
    }
    
}
