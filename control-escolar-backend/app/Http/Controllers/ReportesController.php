<?php

namespace App\Http\Controllers;

use App\ConfigFechaPeriodo;
use App\Exports\AspirantesExport;
use App\Exports\EvaluacionSemestralExport;
use App\Traits\CalificacionesTrait;
use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Http\Request;
use App\Alumno;
use App\GrupoPeriodo;
use App\DocentePlantilla;
use App\Docente;
use App\DocenteAsignatura;
use App\Estado;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AlumnosExport;
use App\Exports\ConcentradoSemestralExport;
use App\Exports\PoblacionExport;
use App\CarreraUac;
use App\Plantel;
use App\UAC;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Support\Arr;
use Sisec;
use PDF as PDFSencillo;

class ReportesController extends Controller
{
    use CalificacionesTrait;

    public function listaAsistencia($grupoId, $carreraUacId = null){

        $usuario = auth()->user();

        $grupo = GrupoPeriodo::where('id', $grupoId)
            ->with(['alumnos' => function($query) {
                $query->where('status', 'Inscrito')->with('usuario');
            },'plantelCarrera.plantel.municipio.estado', 'plantelCarrera.carrera', 'periodo'])
            ->withCount('alumnos')
            ->first();

        $grupo->alumnos = $grupo->alumnos->sortBy(function($alumno) {
            return Str::upper(Sisec::quitarAcentos($alumno->nombre_por_apellido));
        });

        if(!Sisec::validarAlcance($grupo->plantelCarrera->plantel->id))
           return response()->json(['message' => 'No tiene permiso para imprimir la lista de este grupo'], 400);

        $docenteAsignatura = null;
        $docente = Docente::where('curp', $usuario->username)->first();

        try {
            if ($usuario->hasRole('ROLE_DOCENTE') && $docente != null && $carreraUacId != null) {
                $docenteAsignatura = $this->docenteAsignatura($docente->id, $carreraUacId, $grupo);
            }
        }catch(Exception $e){
            return response()->json(['message' => $e->getMessage()], 403);
        }

        if($docenteAsignatura == null && $usuario->hasRole('ROLE_DOCENTE'))
            return response()->json(['message' => 'No puede imprimir la lista de asistencia porque no tiene al grupo asignado.'], 403);

        return $pdf = PDF::loadView('reportesPDF/listaAsistencia', compact('grupo', 'docenteAsignatura'))
            ->setPaper('a4', 'landscape')
            ->stream('lista_asistencia.pdf');

    }

    public function docentesPorGrupo($grupoId){

        $grupo = GrupoPeriodo::where('id', $grupoId)
            ->with('periodo','plantelCarrera.plantel.municipio.estado','plantelCarrera.carrera')
            ->withCount('alumnos')
            ->first();

        if(!Sisec::validarAlcance($grupo->plantelCarrera->plantel->id))
           return response()->json(['message' => 'No tiene permiso para imprimir la lista de este grupo'], 400);

        $carreraId = $grupo->plantelCarrera->carrera_id;

        //Se obtienen las asignaturas con el docente que las imparte
        $carreraUacs = CarreraUac::where('carrera_id', $carreraId)
            ->where('semestre', $grupo->semestre)
            ->whereHas('uac', function($query){
                $query->where('tipo_uac_id', '!=', 4)->where('optativa', 0);
            })->with(['docenteAsignatura' => function($query) use ($grupo){
                $query->where('grupo_periodo_id', $grupo->id);
            }, 'docenteAsignatura.plantillaDocente.docente', 'uac'])
            ->get();

        $grupo->uacs = $carreraUacs;

        //Si el grupo pertenece a 6to semestre se envían las optativas
        if($grupo->semestre == 6){
            $optativas = CarreraUac::where('carrera_id', $carreraId)
                ->whereHas('uac', function($query) use ($grupo){
                    $query->where('optativa', 1)
                        ->whereHas('grupoOptativa', function($queryGrupo) use ($grupo){
                            $queryGrupo->where('grupo_periodo_id', $grupo->id);
                        });
                    })
                    ->with(['docenteAsignatura' => function($query) use ($grupo){
                        $query->where('grupo_periodo_id', $grupo->id);
                    }, 'docenteAsignatura.plantillaDocente.docente', 'uac'
                ])->get();

            foreach ($optativas as $op){
                $grupo->uacs->push($op);
            }
        }

        return $pdf = PDF::loadView('reportesPDF/docentesPorGrupo', compact('grupo'))
            ->setPaper('a4', 'landscape')
            ->stream('docentes_por_grupo.pdf');

    }

    public function reporteCalificacionesParcial(Request $request,  $grupoId){

        //Variables de resultado
        $promedio = 0;
        $reprobados = 0;
        $aprobados = 0;
        $promedioPorMateria = [];
        $totalAlumnos = 0;
        $procentajeAprobados = 0;
        $porcentajeReprobados = 0;

        $parcial = $request->parcial;

        $grupo = GrupoPeriodo::find($grupoId);

        if($grupo == null)
            return response()->json(['message' => 'El grupo no existe'], 400);

        if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Generar boletas')){
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }

        $grupo = GrupoPeriodo::where('id', $grupoId)
            ->with(['alumnos' => function($query) use ($grupo, $parcial){
                $query->where('status', 'Inscrito')
                    ->with(['calificacionUac' => function($califs) use ($grupo, $parcial){

                        if($parcial < 4) {
                            $califs->where('parcial', $parcial);
                        }else {
                            $califs->whereIn('parcial', [4, 5]);
                        }

                        $califs->where('periodo_id', $grupo->periodo_id)
                            ->whereHas('carreraUac', function($query) use ($grupo){
                                $query->where('semestre', $grupo->semestre);
                            })
                            ->orderBy('parcial', 'desc')
                            ->with('carreraUac.uac');
                    }]);
            }], 'alumnoUacGrupo', 'plantelCarrera.plantel.municipio.estado', 'plantelCarrera.carrera')
            ->withCount(['alumnos' => function($query){
                $query->where('status', 'Inscrito');
            }])
            ->first();

        $grupo->alumnos = $grupo->alumnos->sortBy(function($alumno) {
            return Str::upper(Sisec::quitarAcentos($alumno->nombre_por_apellido));
        });

        $grupo->alumnos = $grupo->alumnos->map(function($alumno){
            $alumno->calificacion_uac = $alumno->calificacionUac->sortBy(function($calif){
                return $calif->carreraUac->uac->id;
            })->values();

            return $alumno;
        });

        $asignaturas = $this->asignaturasSemestreCarrera($grupo->semestre, $grupo->plantelCarrera->carrera_id, $grupo)->toArray();
        $promedioAsignaturas = $this->obtenerPromedioAsignaturas($grupo,$asignaturas);

        $promedioGeneral = $this->obtenerPromedioGeneral($asignaturas, $promedioAsignaturas);

        $estadisticas = $this->estadisticasCalificacionesParcial($grupo, $asignaturas);

        return $pdf = PDF::loadView('reportesPDF/reporteCalificacionesParcial', compact('grupo', 'parcial',
            'asignaturas', 'promedioAsignaturas','promedioGeneral', 'estadisticas'))
            ->stream('estadisticas-calificaciones.pdf');
    }

    /**
     * REDIS
     *
     * @param $grupoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function reporteAlumnos($grupoId){

        $usuario = auth()->user();

        $grupo = GrupoPeriodo::where('id', $grupoId)
            ->with(['alumnos' => function($query) {
                $query->where('status', 'Inscrito')->with(['usuario' => function($query){
                    $query->orderBy('primer_apellido');
                }]);
            },'plantelCarrera.plantel.municipio.estado', 'plantelCarrera.plantel.personal', 'plantelCarrera.carrera', 'periodo'])
            ->withCount('alumnos')
            ->first();

        $grupo->alumnos = $grupo->alumnos->sortBy(function($alumno) {
            return Str::upper(Sisec::quitarAcentos($alumno->nombre_por_apellido));
        });

        $fecha = Sisec::obtenerFechaActual();

        if(!Sisec::validarAlcance($grupo->plantelCarrera->plantel->id))
           return response()->json(['message' => 'No tiene permiso para imprimir la lista de este grupo'], 400);

        return $pdf = PDF::loadView('reportesPDF/reporteAlumnos', compact('grupo', 'fecha'))
            ->stream('reporte-alumnos.pdf');

    }

    public function reporteAlumnosFiltro(Request $request){

        $campos = [
            'Primer Apellido', 'Segundo Apellido', 'Nombre', 'CURP', 'Matricula', 'Plantel', 'Carrera', 'Semestre', 'Grupo'
        ];

        if($request->telefono){
            array_push($campos, 'Teléfono');
        }

        if($request->domicilio){
            array_push($campos, 'Domicilio');
        }

        if($request->fecha_nacimiento){
            array_push($campos, 'Fecha de Nacimiento');
        }

        if($request->email){
            array_push($campos, 'Email');
        }

        if($request->sexo){
            array_push($campos, 'Sexo');
        }

        return Excel::download(new AlumnosExport($request->ids, $campos), 'alumnos.xlsx');
    }

    /**
     * Como el reporte por el filtro pero utilizando a los alumnos del grupo-periodo
     * @param Request $request
     * @param $idGrupo
     */
    public function reporteAlumnosPorGrupo(Request $request){

        $grupos = $request->ids;

        $grupos = GrupoPeriodo::whereIn('id', $grupos)->with('alumnos')->get();

        $ids = [];
        foreach ($grupos as $grupo){
            array_push($ids, $grupo->alumnos->pluck('usuario_id')->toArray());
        }

        $ids = Arr::flatten($ids);
        $request->ids = $ids;

        return $this->reporteAlumnosFiltro($request);

    }

    public function reportePoblacionAlumnos(Request $request){

        $alumnos = Alumno::whereIn('usuario_id', $request->ids)->get();

        if(count($alumnos) <= 0)
            return response()->json(['message' => 'No se ha seleccionado ningún alumno'], 400);

        $info['plantel'] = $plantel = $alumnos->first()->plantel->nombre_final;
        $info['plantel_id'] = $alumnos->first()->plantel_id;
        $info['estado'] = $estado = $alumnos->first()->plantel->municipio->estado->nombre;
        $info['grupo'] = '';
        $info['semestre'] = '';
        $info['carrera'] = '';

        $estadisticas = [];
        $estadisticas[0][0] = 0;
        $estadisticas[0][1] = 0;
        $estadisticas[0][2] = 0;

        $grupo = $alumnos->first()->grupos->where('periodo_id', Sisec::periodoActual()->id)->first();

        //Saber si el filtro fue por grupo
        if($grupo != null){
            $alumnosEnGrupo = Alumno::whereHas('grupos', function($query) use ($grupo){
                $query->where('grupo_periodo.id', $grupo->id);
            })->get()->pluck('usuario_id');

            $alumnosEnGrupo = collect($alumnosEnGrupo);
            $ids = collect($request->ids);
            $diferentes1 = $alumnosEnGrupo->diff($request->ids);
            $diferentes2 = $ids->diff($alumnosEnGrupo);

            if(count($diferentes1) == 0 && count($diferentes2) == 0){
                $info['grupo'] = $grupo->grupo;
                $info['semestre'] = $grupo->semestre;
                $info['carrera'] = $grupo->plantelCarrera->carrera->clave_carrera. ' - '.$grupo->plantelCarrera->carrera->nombre;
            }
            //Saber si es por semestre
        }

        if($info['semestre'] == ''){
            $semestreAlumnos = array_unique($alumnos->pluck('semestre')->toArray());
            if(count($semestreAlumnos) == 1){
                $info['semestre'] = $semestreAlumnos[0];
            }
        }

        if($info['carrera'] == ''){
            $carreraAlumnos = array_unique($alumnos->pluck('carrera_id')->toArray());
            if(count($carreraAlumnos) == 1){
                $info['carrera'] = $alumnos->first()->carrera->clave_carrera.' - '.$alumnos->first()->carrera->nombre;
            }
        }

        foreach ($alumnos as $alumno){

            $grupoAlumno = $alumno->grupos->where('periodo_id', Sisec::periodoActual()->id)->first();
            if($grupoAlumno != null){
                $grupoAlumno = $grupoAlumno->id;
            }

            $estadisticas[0][2]++;

            $sexo = '';
            if($alumno->sexo == ''){
                try{
                    $sexo = substr($alumno->usuario->username, 10, 1);
                }catch(Exception $e){

                }
            }

            if($alumno->sexo == 'Masculino' || $sexo == 'H'){
                $estadisticas[0][0]++;
            }else if($alumno->sexo == 'Femenino' || $sexo == 'M'){
                $estadisticas[0][1]++;
            }

        }

        return Excel::download(new PoblacionExport($estadisticas, $info), 'alumnos.xlsx');

    }

    public function reportePoblacionAlumnosPorGrupo(Request $request){

        $grupos = $request->ids;

        $grupos = GrupoPeriodo::whereIn('id', $grupos)->with('alumnos')->get();

        $ids = [];
        foreach ($grupos as $grupo){
            array_push($ids, $grupo->alumnos->pluck('usuario_id')->toArray());
        }

        $ids = Arr::flatten($ids);
        $request->ids = $ids;

        return $this->reportePoblacionAlumnos($request);

    }

    public function constancia(Request $request, $alumnos, $grupoId = null){

        if(!Sisec::validarAlcance($alumnos->first()->plantel->id))
           return response()->json(['message' => 'No tiene permiso para imprimir la lista de este grupo'], 400);

        $periodo = Sisec::periodoActual();

        $semestres = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto'];
        $semestre = $semestres[$alumnos->first()->semestre-1];

        $meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
            'octubre', 'noviembre', 'diciembre'];
        $descripcion = $request->descripcion;
        $fotografia = $request->fotografia;

        $fecha = str_pad(Carbon::now()->day, 2, '0', STR_PAD_LEFT).' días del mes de '.$meses[Carbon::now()->month-1].' del año '.Carbon::now()->year;

        if($grupoId){
            $grupo = GrupoPeriodo::find($grupoId);
        }else{
            $grupo = $alumnos->first()->grupos->sortByDesc('periodo_id')->first();
        }

        foreach($alumnos as $alumno){
            $alumno->grupo = $alumno->grupos->sortByDesc('periodo_id')->first();

            if($alumno->grupo == null){
                return response()->json(['message' => 'El alumno nunca ha estado inscrito en un grupo.'], 400);
            }

            $configuracionPeriodo = ConfigFechaPeriodo::where('periodo_id', $alumno->grupo->periodo->id)
                ->where('estado_id', $alumno->grupo->plantelCarrera->plantel->municipio->estado_id)
                ->first();
            if($configuracionPeriodo){
                $inicio = Carbon::parse($configuracionPeriodo->fecha_inicio);
                $fin = Carbon::parse($configuracionPeriodo->fecha_fin);
            }else{
                $inicio = Carbon::createFromFormat('Y-m-d', $alumno->grupo->periodo->fecha_inicio);
                $fin = Carbon::parse($alumno->grupo->periodo->fecha_fin);
            }

            $alumno->inicioPeriodo = $inicio->day.' de '.$meses[$inicio->month-1].' de '.$inicio->year;
            $alumno->finPeriodo =  $fin->day.' de '.$meses[$fin->month-1].' de '.$fin->year;

            //Para el promedio de la constancia.
            $calificaciones = $this->calificacionesHistorial($alumno->usuario_id);
            $calificacionesTransito = $this->calificacionesCreditosTransito($alumno->usuario_id);

            $alumno->promedioCreditos = $this->promedioGeneralCreditos($calificaciones, $calificacionesTransito, null);
        }

        $plantilla = $this->elegirPlantillaConstancia($alumnos->first()->plantel->id);

        //Almacenar la fecha de periodo vacacional
        $estadoId = $grupo->plantelCarrera->plantel->municipio->estado_id;
        $configuracionPeriodo = ConfigFechaPeriodo::where('estado_id', $estadoId)->where('periodo_id', $periodo->id)->first();

        if($configuracionPeriodo){
            $configuracionPeriodo->descripcion_constancia = $request->descripcion;
            $configuracionPeriodo->save();
        }

        return $pdf = PDFSencillo::loadView($plantilla, compact('alumnos', 'semestre', 'fecha', 'descripcion', 'fotografia'))
            ->stream('constancia.pdf');

    }

    public function constanciaPorAlumno(Request $request, $id){

        $alumno = Alumno::with('carrera', 'plantel.personal', 'usuario')->where('usuario_id', $id)->get();

        if(count($alumno) == 0) {
            return response()->json(['message' => 'El alumno no existe'], 404);
        }

        return $this->constancia($request, $alumno);

    }

    public function constanciaPorGrupo(Request $request, $grupoId){

        $grupo = GrupoPeriodo::find($grupoId);

        if($grupo == null){
            return response()->json(['message' => 'El grupo seleccionado no existe.']);
        }

        $alumnos = $grupo->alumnos()->get();

        return $this->constancia($request, $alumnos, $grupoId);

    }

    public function reporteReprobados($grupoId, Request $request){

        $grupo = GrupoPeriodo::findOrFail($grupoId);

        if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Generar boletas')){
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }

        $grupo->solo_reprobados = $request->solo_reprobados ?? false;

        $alumnos = $this->alumnosCalificacionesPorGrupo($grupo, true, $request->solo_reprobados);

        $asignaturas = $this->asignaturasSemestreCarrera($grupo->semestre, $grupo->plantelCarrera->carrera_id, $grupo);
        //Quitar módulos
//        $asignaturas = $asignaturas->filter(function($item){
//            return $item->tipo_uac_id != 4;
//        })->values()->toArray();

        $alumnos = $this->obtenerPromedioParcialesAlumnosReprobados($alumnos);

        $grupo->alumnos = $alumnos;

        if(count($grupo->alumnos) <= 0)
            return response()->json(['message' => 'El grupo no tiene alumnos reprobados'], 400);

        return $pdf = PDF::loadView('reportesPDF/reporteAlumnosReprobados', compact('grupo', 'asignaturas'))
            ->setPaper('a4', 'landscape')
            ->stream('reporte-reprobados.pdf');
    }

    public function concentradoSemestral($grupoId){
        $grupo = GrupoPeriodo::findOrFail($grupoId);

        if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Generar boletas')){
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }

        $alumnos = $this->alumnosCalificacionesPorGrupo($grupo, false);
        $asignaturas = $this->asignaturasSemestreCarrera($grupo->semestre, $grupo->plantelCarrera->carrera_id, $grupo);

        $alumnos = $this->obtenerArregloDeAlumnosConCalificaciones($alumnos, $asignaturas);
        $alumnos = $this->obtenerEstadisticasConcentradoSemestral($alumnos, $asignaturas);
        $alumnos = $this->obtenerPromedioFinalYExtraordinario($alumnos, $asignaturas);

        $info = [];
        $info['plantel'] = $grupo->plantelCarrera->plantel->nombre_final;
        $info['plantel_id'] = $grupo->plantelCarrera->plantel_id;
        $info['cct'] = $grupo->plantelCarrera->plantel->cct;
        $info['estado'] = $estado = $grupo->plantelCarrera->plantel->municipio->estado->nombre;
        $info['grupo'] = $grupo->grupo;
        $info['semestre'] = $grupo->semestre;
        $info['turno'] = $grupo->turno;
        $info['ciclo'] = $grupo->periodo->nombre_con_mes;
        $info['carrera'] = $grupo->plantelCarrera->carrera->nombre;
        $info['periodo'] = $grupo->periodo->nombre_con_mes;
        $info['promedio'] = $this->obtenerPromedioGrupoConcentradoSemestral($alumnos);

        return Excel::download(new ConcentradoSemestralExport($alumnos, $asignaturas, $info), 'concentrado-semestral.xlsx');

    }

    public function evaluacionSemestral($grupoId){
        $grupo = GrupoPeriodo::findOrFail($grupoId);

        if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Generar boletas')){
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }

        $alumnos = $this->alumnosCalificacionesPorGrupo($grupo, false);
        $asignaturas = $this->asignaturasSemestreCarrera($grupo->semestre, $grupo->plantelCarrera->carrera_id, $grupo, false);
        $alumnos = $this->obtenerArregloDeAlumnosConCalificaciones($alumnos, $asignaturas);

        return $pdf = PDF::loadView('reportesPDF/evaluacionSemestral', compact('grupo', 'asignaturas', 'alumnos'))
            ->stream('evaluacion-semestral.pdf');
    }

    public function reporteAspirantes(Request $request){

        $plantel = $request->plantel_id;

        if ($request->fecha_inicio == null){
            $fechaInicio = ($request->fecha_fin != null) ? Carbon::parse($request->fecha_fin) : Carbon::now();
        } else {
            $fechaInicio = Carbon::parse($request->fecha_inicio);
        }

        $fechaFin = ($request->fecha_fin == null) ? Carbon::now() : Carbon::parse($request->fecha_fin);

        return Excel::download(new AspirantesExport($fechaInicio, $fechaFin, $plantel), 'reporte-aspirantes.xlsx');

    }

    /*
     * Obtener el registro de docente-asignatura para la lista de asistencia. Si no existe, no le permitirá imprimir
     * la lista de asistencia al usuario docente.
     */
    private function docenteAsignatura($docenteId, $carreraUacId, $grupo = null){

        $plantilla = DocentePlantilla::where('docente_id', $docenteId)
            ->where('plantel_id', $grupo->plantelCarrera->plantel->id)
            ->where('fecha_fin_contrato', null)
            ->where('plantilla_estatus', 1)
            ->first();

        if($plantilla == null){
            $plantilla = DocentePlantilla::where('docente_id', $docenteId)
                ->where('plantel_id', $grupo->plantelCarrera->plantel->id)
                ->where('fecha_fin_contrato', '>=', Carbon::parse($grupo->periodo->fecha_fin)->subMonth())
                ->where('plantilla_estatus', 1)
                ->first();
        }

        if($plantilla == null)
            throw new Exception('No tiene un contrato asignado en este plantel');

        return DocenteAsignatura::where('plantilla_docente_id', $plantilla->id)
            ->where('grupo_periodo_id', $grupo->id)
            ->where('carrera_uac_id', $carreraUacId)
            ->with('plantillaDocente.docente','carreraUac.uac')
            ->first();

    }

    private function asignaturasSemestreCarrera($semestre, $carreraId, $grupo, $conSubmodulos = true){

        $asignaturas = UAC::whereHas('carreras', function($query) use ($carreraId){
                $query->where('carrera_id', $carreraId);
            })->where('semestre', $semestre)
            ->where('optativa', 0);

        if(!$conSubmodulos) {
            $asignaturas->where('tipo_uac_id', '!=', 10);
        }

        $asignaturas = $asignaturas->get();

        if($grupo != null) {
            $optativas = $grupo->optativas()->get();
            $asignaturas = $asignaturas->merge($optativas);
        }

        $asignaturas = $asignaturas->sortBy(function($dato){
           return $dato->id;
        })->values();

        return $asignaturas;
    }

    private function obtenerPromedioAsignaturas($grupo, $asignaturas){

        $promedioAsignaturas = array_fill(0,count($asignaturas),0);
        $sumaCalifs = array_fill(0,count($asignaturas),0);
        $cantCalifs = array_fill(0,count($asignaturas),0);

        foreach($grupo->alumnos as $alumno){

            $alumno->calificacionUac = $alumno->calificacionUac->sortBy(function($calif){
                return $calif->carreraUac->uac->id;
            })->values();

            $i = 0;

            foreach($alumno->calificacionUac as $calif){

                while($i < count($asignaturas) && $asignaturas[$i]['clave_uac'] != $calif->carreraUac->uac->clave_uac){
                    $i++;
                }

                if($i < sizeof($sumaCalifs) && $calif->calificacion >= 0) {
                    $sumaCalifs[$i] += $calif->calificacion;
                    $cantCalifs[$i]++;
                    $i++;
                }
            }

        }

        for($i = 0; $i < count($asignaturas); $i++){
            if($cantCalifs[$i] > 0)
                $promedioAsignaturas[$i] = round($sumaCalifs[$i]/$cantCalifs[$i], 1, PHP_ROUND_HALF_UP);
            else
                $promedioAsignaturas[$i] = 0;
        }

        return $promedioAsignaturas;

    }

    private function obtenerPromedioGeneral($asignaturas, $promedioAsignaturas){
        $suma = 0;
        $cantAsignaturas = 0;

        for($i = 0; $i < count($asignaturas); $i++){
            if($asignaturas[$i]['tipo_uac_id'] != 10 && $promedioAsignaturas[$i] > 0){
                $suma+=$promedioAsignaturas[$i];
                $cantAsignaturas++;
            }
        }

        return ($cantAsignaturas > 0) ? round($suma/$cantAsignaturas, 1, PHP_ROUND_HALF_UP) : 0;

    }

    private function estadisticasCalificacionesParcial($grupo, $asignaturas)
    {
        $reprobados = array_fill(0, count($asignaturas), 0);
        $aprobados = array_fill(0, count($asignaturas), 0);
        $porcentajeAprobados = array_fill(0, count($asignaturas), 0);
        $porcentajeReprobados = array_fill(0, count($asignaturas), 0);
        $totalAlumnos = array_fill(0, count($asignaturas), 0);


        foreach ($grupo->alumnos as $alumno) {

            $i = 0;
            $clavePrevia = null;

            foreach ($alumno->calificacionUac as $calif) {

                if($clavePrevia == $calif->carreraUac->uac->clave_uac) {
                    continue;
                }

                while ($i < sizeof($asignaturas) && $asignaturas[$i]['clave_uac'] != $calif->carreraUac->uac->clave_uac) {
                    //dd($asignaturas[$i]['clave_uac'].' | '.$calif->carreraUac->uac->clave_uac.' | '.$i.' | '.$alumno->matricula);
                    $i++;
                }

                if($i >= sizeof($asignaturas))
                    break;

                if ($calif->calificacion >= 0) {
                    $totalAlumnos[$i]++;
                    if ($calif->calificacion < 6)
                        $reprobados[$i]++;
                    else if ($calif->calificacion >= 6)
                        $aprobados[$i]++;
                }

                $clavePrevia = $asignaturas[$i]['clave_uac'];

                $i++;
            }

        }

        for($i = 0; $i < count($asignaturas); $i++){
            $porcentajeAprobados[$i] = ($totalAlumnos[$i] > 0) ?  round(($aprobados[$i]*100)/$totalAlumnos[$i], 1, PHP_ROUND_HALF_UP) : 0;
            $porcentajeReprobados[$i] = ($totalAlumnos[$i] > 0) ? round(($reprobados[$i]*100)/$totalAlumnos[$i], 1, PHP_ROUND_HALF_UP) : 0;
        }

        return [
            'reprobados' => $reprobados,
            'aprobados' => $aprobados,
            'totalAlumnos' => $totalAlumnos,
            'porcentajeReprobados' => $porcentajeReprobados,
            'porcentajeAprobados' => $porcentajeAprobados,
        ];
    }

    private function obtenerPromedioParcialesAlumnosReprobados($alumnos){

        foreach($alumnos as $alumno) {

            $promedios = [-1, -1, -1];
            $sumas = [0, 0, 0];
            $cantAsignaturas = [0, 0, 0];

            foreach ($alumno->calificacionUac as $materias) {
                foreach ($materias as $calificacion) {

                    if($calificacion->carreraUac->uac->tipo_uac_id == 10)
                        break;

                    $sumas[$calificacion->parcial - 1] += $calificacion->calificacion;
                    $cantAsignaturas[$calificacion->parcial - 1]++;
                }
            }

            for ($i = 0; $i < 3; $i++) {
                if ($cantAsignaturas[$i] > 0)
                    $promedios[$i] = $sumas[$i] / $cantAsignaturas[$i];
            }

            $alumno->promedios = $promedios;
        }

        return $alumnos;

    }

    /**
     * Se obtienen los alumnos con sus calificaciones de las asignaturas indicadas, en un arreglo listo para mostrarse
     * en un formato de excel. (Se simplifica el orden de las calificaciones y los datos del alumno)
     *
     * @param $alumnos
     * @param $asignaturas
     * @return array
     *
     */
    private function obtenerArregloDeAlumnosConCalificaciones($alumnos, $asignaturas){

        $alumnosArray = [];

        foreach($alumnos as $alumno) {
            $datos = [];
            $datos['alumno'] = Str::upper($alumno->nombre_por_apellido);
            $datos['matricula'] = $alumno->matricula;
            $datos['genero'] = $alumno->sexo;
            $datos['reprobadas'] = 0;
            $califAlumno = [];
            $materiasAlumno = $this->formatearArregloDeCalificacionesPorMateria($alumno->calificacionUac);
            foreach ($asignaturas as $asignatura) {
                $calificaciones = $materiasAlumno[$asignatura->clave_uac] ?? null;
                //Si hay calificaciones de la asignatura
                if ($calificaciones != null) {
                    $final = 0;
                    $i = 1;
                    foreach ($calificaciones as $calificacion) {
                        if ($calificacion->parcial == $i) {
                            $califAlumno[$asignatura['clave_uac']][$i - 1] = $calificacion->calificacion;
                        } else {
                            if($i == 5){
                                $califAlumno[$asignatura['clave_uac']][$i - 1] = $final;
                            }else {
                                $califAlumno[$asignatura['clave_uac']][$i - 1] = '';
                            }
                        }

                        if ($calificacion->parcial >= 4) {
                            $final = $calificacion->calificacion;
                        }

                        $i++;
                    }

                    //Rellenar las calificaciones en caso de que no tenga todos los parciales asignados.
                    if($i < 5){
                        for ($j = $i; $j <= 5; $j++) {
                            $califAlumno[$asignatura['clave_uac']][$j - 1] = '';
                        }
                    }

                    //Para asignar la calificación "final" en caso de que no haya presentado extraordinario
                    if ($i == 5) {
                        $califAlumno[$asignatura->clave_uac][4] = $final;
                    }

                    if($final < 6){
                        $datos['reprobadas']++;
                    }

                } else {
                    for ($i = 0; $i < 5; $i++) {
                        $califAlumno[$asignatura['clave_uac']][$i] = '';
                    }
                }
            }

            $datos['materias'] = $califAlumno;
            array_push($alumnosArray, $datos);

        }

        return $alumnosArray;

    }

    /**
     * Se utiliza para el reporte de concentrado semestral, obtiene el promedio final y extraordinario de los parciales
     * de las materias.
     *
     * @param $alumnos
     * @return mixed
     */
    private function obtenerPromedioFinalYExtraordinario($alumnos, $asignaturas){

        foreach($alumnos as &$alumno){
            $ord = 0;
            $extra = 0;
            $cantOrd = 0;
            $cantExtra = 0;

            if($alumno['materias'] == null)
                continue;

            foreach($alumno['materias'] as $key => $materia){
                $uac = $asignaturas->where('clave_uac', $key)->first();
                if($uac->tipo_uac_id == 10){
                    continue;
                }

                if($materia[3] != '') {
                    $ord += $materia[3];
                    $cantOrd++;
                }
                if($materia[4] != '') {
                    $extra += $materia[4];
                    $cantExtra++;
                }
            }
            $alumno['ordinario'] = $cantOrd > 0 ? round($ord/$cantOrd, 1, PHP_ROUND_HALF_UP) : 0;
            $alumno['extraordinario'] = $cantExtra > 0 ? round($ord/$cantExtra, 1, PHP_ROUND_HALF_UP) : 0;
        }

        return $alumnos;

    }

    private function obtenerEstadisticasConcentradoSemestral($alumnos, $asignaturas){

        $promedioMateria = [];
        $totalAlumnos = [];
        $reprobados = [];
        $aprobados = [];
        $porcentajeReprobados = [];
        $porcentajeAprobados = [];


        foreach($asignaturas as $asignatura){
            //Simplificar el nombre de la variable
            $uac = $asignatura->clave_uac;

            $promedioMateria[$uac] = [];
            $totalAlumnos[$uac] = [];
            $reprobados[$uac] = [];
            $aprobados[$uac] = [];
            $porcentajeReprobados[$uac] = [];
            $porcentajeAprobados[$uac] = [];

            //La i representa el parcial y la posición en el arreglo
            for($i = 0; $i < 5; $i++){
                $promedioMateria[$uac][$i] = 0;
                $totalAlumnos[$uac][$i] = 0;
                $reprobados[$uac][$i] = 0;
                $aprobados[$uac][$i] = 0;
                $porcentajeReprobados[$uac][$i] = 0;
                $porcentajeAprobados[$uac][$i] = 0;

                foreach($alumnos as $alumno){
                    $materia = $alumno['materias'][$uac];
                    if($materia[$i] != ''){
                        $promedioMateria[$uac][$i] += $materia[$i] != '' ? $materia[$i] : 0;
                        $totalAlumnos[$uac][$i]++;
                        if($materia[$i] < 6){
                            $reprobados[$uac][$i]++;
                        }else{
                            $aprobados[$uac][$i]++;
                        }
                    }
                }

                $porcentajeAprobados[$uac][$i] = ($totalAlumnos[$uac][$i] > 0) ?  round(($aprobados[$uac][$i]*100)/$totalAlumnos[$uac][$i], 1, PHP_ROUND_HALF_UP) : 0;
                $porcentajeReprobados[$uac][$i] = ($totalAlumnos[$uac][$i] > 0) ?  round(($reprobados[$uac][$i]*100)/$totalAlumnos[$uac][$i], 1, PHP_ROUND_HALF_UP) : 0;
                $promedioMateria[$uac][$i] = ($totalAlumnos[$uac][$i] > 0) ?  round($promedioMateria[$uac][$i]/$totalAlumnos[$uac][$i], 1, PHP_ROUND_HALF_UP) : 0;
            }

        }

        array_push($alumnos, [
            'alumno' => '',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => '',
            'materias' => [],
            'estadistica' => true
        ]);

        array_push($alumnos, [
            'alumno' => '',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => '',
            'materias' => [],
            'estadistica' => true
        ]);

        array_push($alumnos, [
            'alumno' => 'Promedio por materia',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => $this->obtenerMateriasReprobadasConcentradoSemestral($alumnos),
            'materias' => $promedioMateria,
        ]);

        array_push($alumnos, [
            'alumno' => 'Total alumnos',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => '',
            'materias' => $totalAlumnos,
            'estadistica' => true
        ]);

        array_push($alumnos, [
            'alumno' => 'Alumnos reprobados',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => '',
            'materias' => $reprobados,
            'estadistica' => true
        ]);

        array_push($alumnos, [
            'alumno' => 'Alumnos aprobados',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => '',
            'materias' => $aprobados,
            'estadistica' => true
        ]);

        array_push($alumnos, [
            'alumno' => 'Porcentaje reprobados',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => '',
            'materias' => $porcentajeReprobados,
            'estadistica' => true
        ]);

        array_push($alumnos, [
            'alumno' => 'Porcentaje aprobados',
            'matricula' => '',
            'genero' => '',
            'reprobadas' => '',
            'materias' => $porcentajeAprobados,
            'estadistica' => true
        ]);

        return $alumnos;

    }

    private function obtenerPromedioGrupoConcentradoSemestral($alumnos){

        $promedio = 0;
        $extras = [];
        foreach($alumnos as $alumno){
            if(!isset($alumno['estadistica']) && $alumno['alumno'] != 'Promedio por materia')
                $promedio+=$alumno['extraordinario'];
        }

        $alumnos = count($alumnos)-8;
        $promedio = round($promedio/$alumnos, 1, PHP_ROUND_HALF_UP);
        return $promedio;

    }

    private function obtenerMateriasReprobadasConcentradoSemestral($alumnos){
        $reprobadas = 0;
        foreach($alumnos as $alumno){
            if(is_numeric($alumno['reprobadas']))
                $reprobadas+=$alumno['reprobadas'];
        }

        return $reprobadas;
    }

    private function elegirPlantillaConstancia($plantelId){

        $plantel = Plantel::with('municipio.estado')->find($plantelId);

        $plantilla = 'reportesPDF.constancias.'.$plantel->municipio->estado->abreviatura;
        if(!view()->exists($plantilla)){
            $plantilla = 'reportesPDF.constancias.DEFAULT';
        }

        return $plantilla;
    }

}
