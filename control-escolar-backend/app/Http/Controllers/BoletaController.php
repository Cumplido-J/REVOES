<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Alumno;
use App\Plantel;
use App\Municipio;
use App\Estado;
use App\Carrera;
use App\UAC;
use App\Periodo;
use App\CalificacionUac;
use App\GrupoPeriodo;
use App\PlantelCarrera;
use App\CarreraUac;
use App\CalificacionRevalidacion;
use App\BitacoraEvaluacion;
use App\RubricasEvaluacion;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade as PDF;
use Barryvdh\Snappy\Facades\SnappyPdf as SnappyPDF;
use Sisec;
use \Illuminate\Support\Str;
use App\Traits\AuditoriaLogHelper;

class BoletaController extends Controller
{
    use AuditoriaLogHelper;

    /**
     * Se generan las boletas de los alumnos inscritos en un grupo durante un período.
     *
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function boletaPorGrupo($id, Request $request){

        $grupo = GrupoPeriodo::with('plantelCarrera.plantel.municipio.estado','plantelCarrera.plantel.personal',
            'plantelCarrera.carrera')
            ->where('id', $id)
            ->first();

        if($grupo == null)
            return response()->json(['message' => 'El grupo no existe.'], 404);

        if(!Sisec::validarAlcance($grupo->plantelCarrera->plantel->id))
            return response()->json(['message' => 'No tiene permisos para generar boletas del grupo seleccionado.'], 403);

        $alumnos = $grupo->alumnos()->where('alumno_grupo.status', 'Inscrito')->get();

        $alumnos = $alumnos->sortBy(function($alumno) {
            return Str::upper(Sisec::quitarAcentos($alumno->nombre_por_apellido));
        });

        $alumnos = $alumnos->pluck('usuario_id')->toArray();

        if(count($alumnos) <= 0)
            return response()->json(['message' => 'No hay alumnos inscritos en este grupo'], 400);

        $director = $request->director;
        $director = 'Nombre del director'; //Provisional

        $datosGenerales = $this->datosBoletaPorGrupo($grupo);

        $datosAlumnos = [];

        foreach ($alumnos as $alumnoId) {
            $datos = [];

            $alumno = Alumno::with('plantel.municipio.estado', 'carrera', 'usuario')
                ->where('usuario_id', $alumnoId)
                ->first();

            $datos['datosIndividuales'] = $this->datosAlumnoBoleta($alumno, $grupo);

            $datos = $this->obtenerCalificaciones($grupo, $alumno, $datos, $grupo->semestre, Periodo::find($grupo->periodo_id));
            if(array_key_exists('calificaciones', $datos)) //Sólo si tiene alguna calificación asignada el alumno.
                array_push($datosAlumnos, $datos);
        }

        if($datosAlumnos == null)
            return response()->json(['message' => 'No hay calificaciones disponibles para este grupo aún.'], 400);

        return $pdf = PDF::loadView('reportesPDF/boletas', compact('datosAlumnos', 'director', 'datosGenerales'))->stream('boleta.pdf');

    }

    public function boletaPorSemestre(Request $request){

        $params = $request->all();

        if(!Sisec::validarAlcance($params['plantel_id']))
            return response()->json(['message' => 'No tiene permisos para generar boletas del plantel seleccionado.'], 403);

        $plantelCarrera = PlantelCarrera::where('plantel_id', $params['plantel_id'])
            ->where('carrera_id', $params['carrera_id'])
            ->first();

        if($plantelCarrera == null)
            return response()->json(['message' => 'No se imparte la carrera en el plantel seleccionado'], 404);

        //Plantel, carrera, semestre, periodo
        $datosGenerales = $this->datosBoletaPorSemestre($params);

        if($datosGenerales == null)
            return response()->json(['message' => 'Algo salió mal'], 400);

        $alumnos = $this->obtenerAlumnos($params, $plantelCarrera);

        if(count($alumnos) <= 0)
            return response()->json(['message' => 'No hay alumnos inscritos en ese plantel, carrera y semestre en el período elegido.'], 400);

        $periodo = Periodo::find($params['periodo_id']);

        $datosAlumnos = [];

        foreach ($alumnos as $alumno) {
            $datos = [];

            $datos['datosIndividuales'] = $this->datosAlumnoBoleta($alumno);

            $grupo = $alumno->grupos()->where('periodo_id', $periodo->id)->first();

            $datos = $this->obtenerCalificaciones($grupo, $alumno, $datos, $params['semestre'], $periodo);
            if(array_key_exists('calificaciones', $datos)) //Sólo si tiene alguna calificación asignada el alumno.
                array_push($datosAlumnos, $datos);
        }

        if($datosAlumnos == null)
            return response()->json(['message' => 'Aún no hay calificaciones disponibles para los alumnos de este semestre.'], 400);

        return $pdf = PDF::loadView('reportesPDF/boletas', compact('datosAlumnos', 'datosGenerales'))->stream('boleta.pdf');
    }

    public function boletaPorAlumno($id){

        $alumno = Alumno::with('plantel.municipio.estado', 'carrera', 'usuario')->where('usuario_id', $id)->first();

        if(!Sisec::validarAlcance($alumno->plantel->id))
            return response()->json(['message' => 'No tiene permisos para generar la boleta del alumno seleccionado.'], 403);

        if($alumno == null){
            return response()->json(['message' => 'El alumno no existe'], 404);
        }

        $datosGenerales = [
            'periodo' => Sisec::periodoActual()->nombre_con_mes,
            'cct' => $alumno->plantel->cct,
            'plantel' => ($alumno->plantel->nombre_final == null)
                ? $alumno->plantel->nombre
                : $alumno->plantel->nombre_final,
            'tipo_plantel' => $alumno->plantel->tipo_plantel_id,
            'estado' => $alumno->plantel->municipio->estado->nombre,
            'municipio' => $alumno->plantel->municipio->nombre,
            'carrera' => $alumno->carrera->nombre,
            'fecha' => $this->fechaActual(),
            'semestre' => $alumno->semestre,
            'personal' => $alumno->plantel->personal,
            'abreviatura_estado' => $alumno->plantel->municipio->estado->abreviatura,
        ];

        $datosAlumnos = [];

        $datos['datosIndividuales'] = $this->datosAlumnoBoleta($alumno);

        $grupo = $alumno->grupos->where('periodo_id', Sisec::periodoActual()->id)->first();

        $datos = $this->obtenerCalificaciones($grupo, $alumno, $datos, $alumno->semestre, Sisec::periodoActual());

        if(!array_key_exists('calificaciones', $datos)){
            return response()->json(['message' => 'El alumno no tiene calificaciones asignadas en este período'], 400);
        }

        array_push($datosAlumnos, $datos);

        return $pdf = PDF::loadView('reportesPDF/boletas', compact('datosAlumnos', 'datosGenerales'))->stream('boleta.pdf');

    }

    /**
     * Todas las boletas de un alumno, para todos los semestres.
     *
     * @param $id id del alumno
     */
    public function boletasPorAlumno($id){

        $alumno = Alumno::with('plantel.municipio.estado', 'carrera', 'usuario', 'grupos')->where('usuario_id', $id)->first();

        if(!Sisec::validarAlcance($alumno->plantel->id))
            return response()->json(['message' => 'No tiene permisos para generar la boleta del alumno seleccionado.'], 403);

        if($alumno == null){
            return response()->json(['message' => 'El alumno no existe'], 404);
        }

        //Se guardan los datos de cada semestre
        $datosAlumnos = [];

        $alumno->grupos = $alumno->grupos->sortBy('semestre');

        foreach($alumno->grupos as $grupo){

            $datos = [];

            $datos['datosIndividuales'] = [
                'grupo' => $grupo->grupo,
                'semestre' => $grupo->semestre,
                'alumno' => $alumno->nombrePorApellido,
                'matricula' => $alumno->matricula,
                'curp' => $alumno->usuario->username,
                'estado' => $grupo->plantelCarrera->plantel->municipio->estado->nombre,
                'abreviatura_estado' =>  $grupo->plantelCarrera->plantel->municipio->estado->abreviatura,
                'municipio' =>  $grupo->plantelCarrera->plantel->municipio->nombre,
                'carrera' => $grupo->plantelCarrera->carrera->nombre,
                'tipo_plantel' => $grupo->plantelCarrera->plantel->tipo_plantel_id,
                'plantel' => ($grupo->plantelCarrera->plantel->nombre_final == null)
                    ? $grupo->plantelCarrera->plantel->nombre
                    : $grupo->plantelCarrera->plantel->nombre_final,
                'cct' => $grupo->plantelCarrera->plantel->cct,
                'periodo' => $grupo->periodo->nombre_con_mes,
                'fecha' => $this->fechaActual(),
                'personal' => $grupo->plantelCarrera->plantel->personal
            ];

            $datos = $this->obtenerCalificaciones($grupo, $alumno, $datos, $grupo->semestre, $grupo->periodo);

            if(array_key_exists('calificaciones', $datos)){
                array_push($datosAlumnos, $datos);
            }

        }

        if(empty($datosAlumnos)){
            return response()->json(['message' => 'El alumno no tiene calificaciones asignadas.'], 400);
        }

        return $pdf = PDF::loadView('reportesPDF/boletas', compact('datosAlumnos'))->stream('boleta.pdf');

    }

    private function historialAcademico($idAlumnos, $grupoPeriodoId = null){

        $periodoActual = Sisec::periodoActual();

        $alumnos = Alumno::with(['grupos' => function($query) use ($periodoActual) {
            $query->whereHas('periodo', function($query) use ($periodoActual){
                $query->where('id', $periodoActual->id);
            })->where('alumno_grupo.status', 'Inscrito');
        }, 'usuario', 'carrera'])
        ->whereIn('usuario_id', $idAlumnos)
        ->get();

        $alumnos = $alumnos->sortBy(function($alumno) {
            return Str::upper(Sisec::quitarAcentos($alumno->nombre_por_apellido));
        });

        if(count($alumnos) == 0)
            return null;

            //Obtener datos generales para los historiales
        if($grupoPeriodoId != null || count($alumnos->first()->grupos) > 0) {
            if($grupoPeriodoId != null) {
                $grupo = GrupoPeriodo::findOrFail($grupoPeriodoId);
            }else{
                $grupo = $alumnos->first()->grupos[0];
            }
            $nombreGrupo = $grupo->grupo;
            $datosGenerales = $this->datosGeneralesHistorialAcademico($grupo->plantelCarrera->plantel, $grupo->plantelCarrera->carrera, $grupo->semestre, $nombreGrupo);
        }else{
            $datosGenerales = $this->datosGeneralesHistorialAcademico($alumnos->first()->plantel, $alumnos->first()->carrera, $alumnos->first()->semestre);
        }

        foreach ($alumnos as $alumno) {

            /*if ($alumno->plantel_id == null || !Sisec::validarAlcance($alumno->plantel_id) || $alumno->carrera_id == null)
                continue;*/

            $alumno->datosAlumno = $this->datosAlumnoHistorial($alumno,$periodoActual);

            if(!$grupoPeriodoId) {
                $alumno->calificaciones = $this->calificacionesHistorial($alumno);
            }else{
                $alumno->calificaciones = $this->calificacionesHistorialPorGrupo($alumno, $grupoPeriodoId);
            }

            $alumno->calificacionesTransito = ($alumno->tipo_trayectoria == 'Transito') ? $this->calificacionesCreditosTransito($alumno, $grupoPeriodoId) : null;

            $alumno->periodos = $this->obtenerPeriodosHistorial($alumno->calificaciones, $alumno);

            $alumno->promedioCreditos = $this->promedioGeneralCreditos($alumno->calificaciones, $alumno->calificacionesTransito);
        }

        return [
            'alumnos' => $alumnos,
            'datosGenerales' => $datosGenerales
        ];
    }

    public function historialAcademicoPorAlumno($id){

        $historial = $this->historialAcademico([$id]);
        if($historial == null){
            return response()->json(['message' => 'El alumno no existe.']);
        }

        $alumnos = $historial['alumnos'];

        $datosGenerales = $historial['datosGenerales'];

        $periodoActual = Sisec::periodoActual()->nombre_con_mes;

        $periodos = Periodo::all();

        return $pdf = SnappyPDF::loadView('reportesPDF/historialAcademico',
            compact('alumnos', 'periodoActual', 'datosGenerales', 'periodos'))
            ->stream('Historial Academico.pdf');

    }

    public function historialAcademicoPorGrupo($id){

        $grupo = GrupoPeriodo::with(['alumnos' => function($query){
                $query->where('status', 'Inscrito');
            }], 'plantelCarrera.plantel')
            ->find($id);

        if($grupo == null)
            return response()->json(['message' => 'El grupo no existe']);

        $alumnos = $grupo->alumnos;

        $historial = $this->historialAcademico($alumnos->pluck('usuario_id'), $id);

        $alumnos = $historial['alumnos'];
        $datosGenerales = $historial['datosGenerales'];

        $periodoActual = Sisec::periodoActual()->nombre_con_mes;

        $periodos = Periodo::all();

        return $pdf = SnappyPDF::loadView('reportesPDF/historialAcademico',
            compact('alumnos', 'periodoActual', 'datosGenerales', 'periodos'))
            ->stream('Historial Academico.pdf');
    }

    /**
     * Se obtienen los datos generales para la boleta.
     *
     * @param $grupo
     * @return array
     */
    private function datosBoletaPorGrupo($grupo){

        return [
            'periodo' => $grupo->periodo()->first()->nombre_con_mes,
            'cct' => $grupo->plantelCarrera->plantel->cct,
            'plantel' => ($grupo->plantelCarrera->plantel->nombre_final == null)
                ? $grupo->plantelCarrera->plantel->nombre
                : $grupo->plantelCarrera->plantel->nombre_final,
            'tipo_plantel' => $grupo->plantelCarrera->plantel->tipo_plantel_id,
            'estado' => $grupo->plantelCarrera->plantel->municipio->estado->nombre,
            'abreviatura_estado' => $grupo->plantelCarrera->plantel->municipio->estado->abreviatura,
            'municipio' => $grupo->plantelCarrera->plantel->municipio->nombre,
            'carrera' => $grupo->plantelCarrera->carrera->nombre,
            'fecha' => $this->fechaActual(),
            'semestre' => $grupo->semestre,
            'personal' => $grupo->plantelCarrera->plantel->personal
        ];

    }

    private function datosBoletaPorSemestre($params){

        try {
            $plantel = Plantel::with('municipio.estado','personal')->where('id', $params['plantel_id'])->firstOrFail();
            $carrera = Carrera::findOrFail($params['carrera_id']);
            $periodo = Periodo::findOrFail($params['periodo_id']);
        }catch(ModelNotFoundException $e){
            return null;
        }

        return [
            'periodo' => $periodo->nombre_con_mes,
            'cct' => $plantel->cct,
            'plantel' => ($plantel->nombre_final == null)
                ? $plantel->nombre
                : $plantel->nombre_final,
            'tipo_plantel' => $plantel->tipo_plantel_id,
            'estado' => $plantel->municipio->estado->nombre,
            'abreviatura_estado' => $plantel->municipio->estado->abreviatura,
            'municipio' => $plantel->municipio->nombre,
            'carrera' => $carrera->nombre,
            'fecha' => $this->fechaActual(),
            'semestre' => $params['semestre'],
            'personal' => $plantel->personal
        ];

    }

    private function datosAlumnoHistorial($alumno, $periodo){

        $anioIngreso = '20'.substr($alumno->matricula,0,2);
        $anioEgreso = (int)$anioIngreso+3;

        return [
            'generacion' => $anioIngreso.' - '.$anioEgreso,
            'matricula' => $alumno->matricula,
            'alumno' => $alumno->usuario->primer_apellido.' '.$alumno->usuario->segundo_apellido.' '.$alumno->usuario->nombre,
            'curp' => $alumno->usuario->username,
        ];
    }

    private function datosGeneralesHistorialAcademico($plantel, $carrera, $semestre, $grupo=null){

        $periodo = Sisec::periodoActual();

        $direccionPlantel = Str::upper($plantel->calle.', CP '.$plantel->codigo_postal.', '.
            $plantel->ciudad);

        return [
            'periodo' => $periodo->nombre_con_mes,
            'cct' => $plantel->cct,
            'plantel' => ($plantel->nombre_final == null)
                ? $plantel->nombre
                : $plantel->nombre_final,
            'tipo_plantel' => $plantel->tipo_plantel_id,
            'estado' => $plantel->municipio->estado->nombre,
            'abreviatura_estado' => $plantel->municipio->estado->abreviatura,
            'municipio' => $plantel->municipio->nombre,
            'carrera' => $carrera->nombre,
            'creditos' => $carrera->total_creditos,
            'clave_carrera' => $carrera->clave_carrera,
            'fecha' => $this->fechaActual(),
            'semestre' => $semestre,
            'personal' => $plantel->personal()->first(),
            'direccion_plantel' => $direccionPlantel,
            'grupo' => $grupo
        ];
    }

    /**
     * Se obtienen los alumnos dependiendo del plantel, carrera, semestre y período
     *
     * @param $params
     * @param $plantelCarrera
     * @return mixed
     */
    private function obtenerAlumnos($params, $plantelCarrera){

        $alumnos = Alumno::whereHas('grupos', function($query) use ($params, $plantelCarrera){
                $query->where('periodo_id', $params['periodo_id'])
                    ->where('semestre', $params['semestre'])
                    ->where('plantel_carrera_id', $plantelCarrera->id);
            })->with(['usuario', 'grupos' => function($query) use ($params, $plantelCarrera) {
                $query->where('periodo_id', $params['periodo_id'])
                    ->where('semestre', $params['semestre'])
                    ->where('plantel_carrera_id', $plantelCarrera->id);
            }])
            ->where('plantel_id', $params['plantel_id'])
            ->where('carrera_id', $params['carrera_id'])
            ->where('estatus_inscripcion', 'Activo')
            ->get();

        $alumnos = $alumnos->sortBy(function($alumno) {
            return Str::upper(Sisec::quitarAcentos($alumno->nombre_por_apellido));
        });

        return $alumnos;
    }

    /**
     * Se obtienen los datos del alumno para colocarlos en la boleta.
     *
     * @param $alumno
     * @param null $grupo
     * @return array
     */
    private function datosAlumnoBoleta($alumno, $grupo = null){

        if($grupo == null)
            $grupo = $alumno->grupos->where('periodo_id', Sisec::periodoActual()->id)->first();

        return [
            'grupo' => ($grupo->grupo ?? '').' - '.($grupo->turno ?? ''),
            'alumno' => $alumno->usuario->primer_apellido.' '.$alumno->usuario->segundo_apellido.' '.$alumno->usuario->nombre,
            'matricula' => $alumno->matricula,
            'curp' => $alumno->usuario->username,
        ];

    }

    /**
     * Se obtienen las calificaciones del alumno. Las asignaturas dependerán del semestre y período o
     * del grupo que se haya elegido como filtro.
     *
     * @param $grupo
     * @param $alumno
     * @param $datos
     * @param $semestre
     * @param $periodo
     * @return mixed
     */
    private function obtenerCalificaciones($grupo, $alumno, $datos, $semestre, $periodo){

        $carrera = ($grupo) ? $grupo->plantelCarrera->carrera_id : $alumno->carrera_id;

        $materias = CarreraUac::where('carrera_id', $carrera)
            ->where('semestre', $semestre)
            ->whereHas('uac', function($query){
                $query->where('optativa', 0);
            })->with('uac')
            ->get();

        $materias = $materias->sortBy(function($materia){
            return $materia->uac->id;
        });

        $materiasNombres = [];
        foreach($materias as $materia){
            $materiasNombres[$materia->id] = $materia->uac->nombre;
        }

        $calificaciones = CalificacionUac::with('carreraUac.uac')
            ->where('alumno_id', $alumno->usuario_id)
            ->where('periodo_id', $periodo->id)
            ->whereHas('carreraUac', function($query) use ($semestre){
                $query->where('semestre', $semestre)->orderBy('id', 'asc');
            })
            ->whereIn('parcial', [1,2,3])
            ->where('tipo_calif', null)
            ->orderBy('id')
            ->get();

        if(count($calificaciones) <= 0)
            return $datos;

        $calificaciones = $calificaciones->groupBy('carrera_uac_id');

        $nombresMateriasConCalificacion = [];
        foreach($calificaciones as $key => $materia){
            $nombre = CarreraUac::find($key)->uac->nombre;
            array_push($nombresMateriasConCalificacion, $nombre);
        }

        $calificaciones = $calificaciones->map(function($califs, $id) use ($alumno){

            $califs = $califs->sortBy('parcial')->take(3)->values();

            //Obtener calificación final original
            $finalNormal = CalificacionUac::where('carrera_uac_id',  $id)
                ->where('alumno_id', $alumno->usuario_id)
                ->where('parcial', 4)
                ->orderBy('id', 'ASC')
                ->first();

            //Obtener todas las calificaciones finales que tenga asignadas
            $final = CalificacionUac::where('carrera_uac_id',  $id)
                ->where('alumno_id', $alumno->usuario_id)
                ->where('parcial', '>=', 4)
                ->orderBy('id', 'DESC')
                ->get();

            //Si tiene más de una calificación final, ext, ci, rs
            if(count($final) > 1){
                $final = $final->first();
                if($final->parcial == 4){
                    $final->tipo_calif = 'RS';
                }else if($final->parcial == 5){
                    $final->tipo_calif = 'EXT';
                }else if($final->parcial == 6){
                    $final->tipo_calif = 'CI';
                }

                $califs->push($finalNormal);
                $final->parcial = 5;
                $califs->push($final);
            }else if($finalNormal != null){
                $califs->push($finalNormal);
            }

            return $califs;
        });

        //Obtener promedios
        $datos['promedios'] = $this->obtenerPromedios($calificaciones->flatten());

        //Agrupar y ordenar para mostrar en la boleta
        $datos['calificaciones'] = $calificaciones;

        foreach($materiasNombres as $key => $uac){
            if(!isset($datos['calificaciones'][$key]) && !in_array($uac,$nombresMateriasConCalificacion)){
                $datos['calificaciones'][$key] = collect(['carreraUac' => CarreraUac::find($key)]);
            }
        }

        $datos['calificaciones'] = $datos['calificaciones']->sortBy(function($dato){
            return $dato->first()->carreraUac->uac->id ?? $dato->first()->uac->id;
        });

        return $datos;
    }

    /**
     * Se obtienen las faltas a partir de la bitácora. Ya no se utiliza, queda como referencia.
     *
     * @param $calificaciones
     * @return mixed
     */
    private function obtenerFaltas($calificaciones){

        $calificaciones = $calificaciones->map(function($item){

            $bitacora = $item->alumno->bitacoraEvaluacion()->get();
            if($bitacora == null){
                return $item->asistencias = null;
            }

            $bitacoraIds = $bitacora->pluck('id')->toArray();

            $bitacora = BitacoraEvaluacion::whereIn('id', $bitacoraIds)
                ->where('parcial', $item->parcial)
                ->whereHas('docenteAsignatura', function($query) use ($item){
                    $query->where('carrera_uac_id', $item->carrera_uac_id)
                        ->where('grupo_periodo_id', $item->grupo_periodo_id)
                        ->whereHas('plantillaDocente', function($queryDocente) use ($item){
                            $queryDocente->where('docente_id', $item->docente_id);
                        });
                })->first();

            if($bitacora == null) {
                $item->faltas = null;
                return $item;
            }

            $totalAsistencias = RubricasEvaluacion::where('docente_asignatura_id', $bitacora->docente_asignatura_id)
                ->where('parcial', $bitacora->parcial)
                ->first();

            $asistenciasAlumno = ($bitacora->asistencia*10*$totalAsistencias->total_asistencias)/100;
            $item->faltas = $totalAsistencias->total_asistencias - $asistenciasAlumno;

            return $item;
        });

        return $calificaciones;
    }

    /**
     * Se calculan los promedios de las asignaturas cursadas en el semestre correspondiente.
     *
     * @param $calificaciones
     * @return array
     */
    private function obtenerPromedios($calificaciones){

        $promedios = [];

        for($i = 1; $i < 4; $i++) {

            //Filtrar por parcial y quitar los submódulos y las calificaciones NP y PE.
            $califsParcial = $calificaciones->filter(function ($value, $key) use ($i) {
                return $value != null && $value->parcial == $i && $value->carreraUac->uac->tipo_uac_id != 10;
            });

            //Se obtienen cuántas asignaturas son originalmente
            $cantOriginal = count($califsParcial);

            //Se quitan los pendientes de evaluación(null), y los NP (-1)
            $califsParcial = $califsParcial->filter(function ($value, $key) use ($i) {
                return $value->calificacion != null && $value->calificacion >= 0;
            });

            //Se suman las calificaciones válidas (0 - 10).
            $suma = $califsParcial->sum('calificacion');

            if(count($califsParcial) > 0)
                array_push($promedios, round( $suma/$cantOriginal, 1, PHP_ROUND_HALF_UP));
            else
                array_push($promedios, '');
        }

        $promedioFinal = 0;

        $califFinalExtra = $calificaciones->sortByDesc('id');

        //Para la calificación final tomando en cuenta los extraordinarios si aplicó alguno
        $califFinalExtra = $califFinalExtra->filter(function ($value, $key) {
            return $value != null && ($value->parcial == 4 || $value->parcial == 5) && $value->carreraUac->uac->tipo_uac_id != 10;
        });

        $califFinalExtra = $califFinalExtra->groupBy('carrera_uac_id');
        $totalAsignaturas = count($califFinalExtra);

        foreach ($califFinalExtra as $calificacion){
            $calif = $calificacion[0];
            /*if(count($calificacion) > 1){
                $calif = $calificacion->where('parcial', 5)->first();
            }*/

            if($calif != null && $calif->calificacion >= 0)
                $promedioFinal+=$calif->calificacion;
        }

        if($totalAsignaturas > 0)
            $promedioFinal/=$totalAsignaturas;
        else
            $promedioFinal = 0;

        array_push($promedios, round( $promedioFinal, 1, PHP_ROUND_HALF_UP));

        return $promedios;
    }

    private function calificacionesHistorial($alumno){

        $semestre = (count($alumno->grupos) > 0) ? $alumno->grupos[0]->semestre-1 : $alumno->semestre;
        $grupo_periodo_id = (count($alumno->grupos) > 0) ? $alumno->grupos[0]->id : null;

        //Asignaturas de la carrera sin optativas
        $uac = UAC::whereHas('carreras', function($query) use ($alumno){
                $query->where('carrera.id', $alumno->carrera_id);
            })->where('tipo_uac_id', '!=', 10)
            ->where('optativa', 0)
            ->where('semestre', '=', $alumno->semestre)
            ->get();

        //Obtener optativas según el grupo del alumno (en caso de que aplique)
        $optativas = [];
        if($alumno->semestre == 6 && $grupo_periodo_id != null){
            $optativas = UAC::whereHas('grupoOptativa', function($query) use ($grupo_periodo_id){
                $query->where('grupo_periodo_id', $grupo_periodo_id);
            })->get();
        }

        if(!empty($optativas)) {
            $uac = $uac->push($optativas);
        }

        $uac = $uac->pluck('id');

        //Obtener carrera_uac
        $asignaturasCarrera = CarreraUac::where('carrera_id', $alumno->carrera_id)->whereIn('uac_id', $uac)
            ->get();
        $asignaturasCarrera = $asignaturasCarrera->pluck('id')->toArray();

        //Obtener asignaturas cursadas por el alumno (que tienen calificación)
        $asignaturasCursadas = CalificacionUac::with('carreraUac.uac')
            ->where('alumno_id', $alumno->usuario_id)
            ->whereHas('carreraUac.uac', function($query){
                $query->where('tipo_uac_id' , '!=', 10);
            })
            ->get();

        //Obtener sólo los ids de la carreraUac
        $asignaturasCursadas = $asignaturasCursadas->unique('carrera_uac_id')->pluck('carrera_uac_id')->toArray();

        $asignaturas = array_merge($asignaturasCarrera, $asignaturasCursadas);
        $asignaturas = array_unique($asignaturas);

        $calificaciones = CarreraUac::whereIn('id', $asignaturas)
            ->with(['calificaciones' => function($query) use ($alumno){
                $query->where('alumno_id', $alumno->usuario_id)
                    ->where('parcial', '>', 3)
                    ->orderBy('periodo_id', 'desc')
                    ->orderBy('parcial', 'desc');
            }, 'uac'])
            ->orderBy('semestre')
            ->orderBy('uac_id')
            ->get();

        $calificaciones = $calificaciones->groupBy('semestre');

        return $calificaciones;

    }

    private function calificacionesHistorialPorGrupo($alumno, $grupoPeriodoId){

        $grupo = GrupoPeriodo::findOrFail($grupoPeriodoId);

        //Asignaturas de la carrera sin optativas
        $uac = UAC::whereHas('carreras', function($query) use ($alumno){
                $query->where('carrera.id', $alumno->carrera_id);
            })->where('tipo_uac_id', '!=', 10)
            ->where('optativa', 0)
            ->where('semestre', '=', $grupo->semestre)
            ->get();

        //Obtener optativas según el grupo del alumno (en caso de que aplique)
        $optativas = [];
        if($alumno->semestre == 6){
            $optativas = UAC::whereHas('grupoOptativa', function($query) use ($grupoPeriodoId){
                $query->where('grupo_periodo_id', $grupoPeriodoId);
            })->get();
        }

        if(!empty($optativas)) {
            $uac = $uac->push($optativas);
        }

        $uac = $uac->pluck('id');

        //Obtener carrera_uac
        $asignaturasCarrera = CarreraUac::where('carrera_id', $alumno->carrera_id)
            ->whereIn('uac_id', $uac)
            ->where('semestre', '<=', $grupo->semestre)
            ->pluck('id')
            ->toArray();

        //Obtener asignaturas cursadas por el alumno (que tienen calificación)
        $asignaturasCursadas = CalificacionUac::with('carreraUac.uac')
            ->where('alumno_id', $alumno->usuario_id)
            ->whereHas('carreraUac.uac', function($query){
                $query->where('tipo_uac_id' , '!=', 10);
            })
            ->whereHas('carreraUac', function($query) use ($grupo){
                $query->where('semestre', '<=', $grupo->semestre);
            })
            ->get();

        //Obtener sólo los ids de la carreraUac
        $asignaturasCursadas = $asignaturasCursadas->unique('carrera_uac_id')->pluck('carrera_uac_id')->toArray();

        $asignaturas = array_merge($asignaturasCarrera, $asignaturasCursadas);
        $asignaturas = array_unique($asignaturas);

        $calificaciones = CarreraUac::whereIn('id', $asignaturas)
            ->with(['calificaciones' => function($query) use ($alumno){
                $query->where('alumno_id', $alumno->usuario_id)
                    ->where('parcial', '>', 3)
                    ->orderBy('periodo_id', 'desc')
                    ->orderBy('parcial', 'desc');
            }, 'uac'])
            ->orderBy('semestre')
            ->orderBy('uac_id')
            ->get();

        $calificaciones = $calificaciones->groupBy('semestre');

        return $calificaciones;

    }

    private function calificacionesCreditosTransito($alumno, $grupoPeriodoId = null){

        $transito = [];
        $calificaciones = CalificacionRevalidacion::with('periodo')
            ->where('alumno_id', $alumno->usuario_id);

        if($grupoPeriodoId){
            $grupo = GrupoPeriodo::findOrFail($grupoPeriodoId);
            $calificaciones->where('periodo_id', '<=', $grupo->periodo_id);
        }

        $calificaciones = $calificaciones->get();

        $calificaciones = $calificaciones->groupBy('periodo_id');

        $transito['creditos'] = $calificaciones->map(function($periodo){
           return $periodo->sum('creditos');
        })->toArray();

        $transito['promedios'] = $calificaciones->map(function($periodo){
           return $periodo->avg('calificacion');
        })->toArray();

        $transito['planteles'] = $calificaciones->map(function($plantel){
            return array_unique($plantel->pluck('cct')->toArray());
        })->toArray();

        $transito['calificaciones'] = $calificaciones->toArray();

        return $transito;
    }

    /**
     * Se obtiene el promedio general y los créditos obtenidos para el historial académico.
     *
     * @param $calificaciones
     * @param $calificacionesTransito
     * @return array
     */
    private function promedioGeneralCreditos($calificaciones, $calificacionesTransito){

        $suma = 0;
        $cantidadCalif = 0;
        $creditos = 0;

        foreach ($calificaciones as $semestre){
            foreach ($semestre as $uac){
                if(count($uac->calificaciones) <= 0)
                    continue;

                $cantidadCalif++;

                //Validar que sea calificacion final o extraordinaria
                if($uac->calificaciones[0]->parcial < 4)
                    continue;

                //Sólo si aprobó se sumarán los créditos
                if($uac->calificaciones[0]->calificacion != null && $uac->calificaciones[0]->calificacion >= 6)
                    $creditos+=$uac->calificaciones[0]->carreraUac->uac->creditos;

                if($uac->calificaciones[0]->calificacion != null && $uac->calificaciones[0]->calificacion >= 0)
                    $suma+=$uac->calificaciones[0]->calificacion;
            }
        }

        $promedio = 0;

        if($calificacionesTransito != null){
            $cantidadCalif+=count($calificacionesTransito['calificaciones']);
            foreach ($calificacionesTransito['creditos'] as $creditosTransito)
                $creditos+=$creditosTransito;
            foreach ($calificacionesTransito['promedios'] as $califTransito)
                $suma+=$califTransito;
        }

        if($cantidadCalif > 0)
            $promedio = round( $suma/$cantidadCalif, 1, PHP_ROUND_HALF_UP);

        $promedioConLetra = 'DIEZ';

        if($promedio < 10){
            $digitos = explode('.', $promedio);
            $numeros = ['CERO','UNO','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE'];
            $promedioConLetra = $numeros[$digitos[0]].' PUNTO ';
            $promedioConLetra.=(count($digitos) > 1) ? $numeros[$digitos[1]] : 'CERO';
        }

        return [
            'creditos' => $creditos,
            'promedio' => $promedio,
            'promedioConLetra' => $promedioConLetra
        ];
    }

    private function obtenerPeriodosHistorial($calificaciones, $alumno){

        $periodosFinales = [];
        foreach ($calificaciones as $semestre){
            $periodosPorMateria = [];
            foreach ($semestre as $uacs){

                $calificacion = CalificacionUac::where('alumno_id',  $alumno->usuario_id)
                    ->where('carrera_uac_id', $uacs->id)
                    ->where('parcial', 4)
                    ->where('tipo_calif', null)
                    ->orderBy('id')
                    ->first();

                if($calificacion){
                    array_push($periodosPorMateria, $calificacion->periodo_id);
                }else if(count($uacs->calificaciones) > 0)
                    array_push($periodosPorMateria, $uacs->calificaciones->mode('periodo_id')[0]);
            }

            if(!empty($periodosPorMateria)) {
                $masRepetido = collect($periodosPorMateria)->mode()[0];
                $masRepetido = Periodo::find($masRepetido);
                array_push($periodosFinales, ['id' => $masRepetido->id, 'nombre_con_mes' => $masRepetido->nombre_con_mes]);
            }else{
                array_push($periodosFinales, ['id' => null, 'nombre_con_mes' => '']);
            }

        }

        return $periodosFinales;

    }

    private function fechaActual(){

        $fecha = Carbon::now();

        $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        $fechaConletra = $fecha->day.' de '.$meses[$fecha->month-1].' de '.$fecha->year;

        return $fechaConletra;
    }
}
