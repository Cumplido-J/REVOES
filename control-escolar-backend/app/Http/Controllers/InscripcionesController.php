<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\GrupoPeriodo;
use App\Periodo;
use App\Alumno;
use App\PlantelCarrera;
use App\DocumentoInscripcion;
use App\AlumnoGrupo;
use App\AlumnoUacGrupo;
use App\CarreraUac;
use App\Plantel;
use ResponseJson;
use Auth;
use Sisec;
use App\CalificacionUac;
use Illuminate\Support\Facades\DB;
use App\Traits\AuditoriaLogHelper;

class InscripcionesController extends Controller
{
    use AuditoriaLogHelper;

    function __construct() {

        $this->middleware(function ($request, $next) {
            // ...
            $this->periodoActual = Sisec::periodoActual();

            if($this->periodoActual == null){
                return response()->json(['message' => 'No hay un periodo escolar definido'], 400);
            }

            return $next($request);
        });
   }

    /**
     * Establece el periodo de inscripciones para un grupo en específico.
     * @param Request $request
     * @param $grupoPeriodoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function configurarPeriodoInscripciones(Request $request, $grupoPeriodoId){

        $grupoPeriodo = GrupoPeriodo::with('plantelCarrera')->find($grupoPeriodoId);
        $old = GrupoPeriodo::with('plantelCarrera')->find($grupoPeriodoId);

        if($grupoPeriodo == null)
            return response()->json(['message' => 'El grupo no existe']);

        if(!Sisec::validarAlcanceYPermiso($grupoPeriodo->plantelCarrera->plantel_id, 'Configurar fecha inscripcion por grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción'], 403);

        if($grupoPeriodo->periodo_id != $this->periodoActual->id)
            return response()->json(['message' => 'El grupo no pertenece al período actual.'], 400);

        if($grupoPeriodo->status != 'activo'){
            return response()->json(['message' => 'El grupo no está activo para este período o está pendiente de aprobación'], 400);
        }

        $params = $request->all();

        $params['fecha_inicio'] = Carbon::createFromFormat('d/m/Y', $params['fecha_inicio']);
        $params['fecha_inicio_irregular'] = Carbon::createFromFormat('d/m/Y', $params['fecha_inicio_irregular']);
        $params['fecha_fin'] = Carbon::createFromFormat('d/m/Y', $params['fecha_fin']);
        $params['fecha_fin_irregular'] = Carbon::createFromFormat('d/m/Y', $params['fecha_fin_irregular']);

        if(!$this->validarFechas($params, $this->periodoActual))
            return response()->json(['message' => 'Verifique las fechas.'], 400);

        $grupoPeriodo->update([
            'fecha_inicio' => $params['fecha_inicio'],
            'fecha_fin' => $params['fecha_fin'],
            'fecha_inicio_irregular' => $params['fecha_inicio_irregular'],
            'fecha_fin_irregular' => $params['fecha_fin_irregular'],
            'tipo_inscripcion' => $params['tipo_inscripcion']
        ]);

        $this->auditoriaSave($grupoPeriodo, $old);
        return response()->json(['message' => 'Se ha configurado el periodo de inscripciones correctamente'], 200);

    }

    /**
     * Establece las fechas para las inscripciones para todos los grupos pertenecientes a un plantel.
     * @param Request $request
     * @param $plantelId
     * @return \Illuminate\Http\JsonResponse
     */
    public function configurarInscripcionesGenerales(Request $request, $plantelId){

        if(!Sisec::validarAlcanceYPermiso($plantelId, 'Configurar fecha inscripcion por plantel'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción'], 403);

        $params = $request->all();

        $params['fecha_inicio'] = Carbon::createFromFormat('d/m/Y', $params['fecha_inicio']);
        $params['fecha_inicio_irregular'] = Carbon::createFromFormat('d/m/Y', $params['fecha_inicio_irregular']);
        $params['fecha_fin'] = Carbon::createFromFormat('d/m/Y', $params['fecha_fin']);
        $params['fecha_fin_irregular'] = Carbon::createFromFormat('d/m/Y', $params['fecha_fin_irregular']);

        if(!$this->validarFechas($params, $this->periodoActual))
            return response()->json(['message' => 'Verifique las fechas.'], 400);

        $grupos = GrupoPeriodo::where('periodo_id', $this->periodoActual->id)
            ->whereHas('plantelCarrera', function($query) use ($plantelId) {
                $query->where('plantel_id', $plantelId);
            })->where('status','activo')
            ->update([
                'fecha_inicio' => $params['fecha_inicio'],
                'fecha_fin' => $params['fecha_fin'],
                'fecha_inicio_irregular' => $params['fecha_inicio_irregular'],
                'fecha_fin_irregular' => $params['fecha_fin_irregular'],
                'tipo_inscripcion' => $params['tipo_inscripcion']
            ]);

        $this->auditoriaManualSave("Configuró las inscripciones para grupos del plantel {$plantelId}", 'plantel', $plantelId, 'configurarInscripcionesGenerales', 'App\Plantel');
        return response()->json(['message' => 'Se ha configurado el periodo de inscripciones correctamente'], 200);
    }

    /**
     * Se valida que las fechas de inscripción sean correctas, no antiguas, etc. Para la configuración de
     * insripciones a un grupo periodo.
     *
     * @param $params
     * @param int $periodo grupoPeriodo
     * @return bool
     */
    private function validarFechas($params, $periodo){

        $inicio_regular = $params['fecha_inicio'];
        $inicio_irregular = $params['fecha_inicio_irregular'];
        $fin_regular = $params['fecha_fin'];
        $fin_irregular = $params['fecha_fin_irregular'];

        $inicio_periodo = Carbon::createFromFormat('Y-m-d', $periodo->fecha_inicio);
        $fin_periodo = Carbon::createFromFormat('Y-m-d', $periodo->fecha_fin);
        if(
            $inicio_regular < $inicio_periodo
            || $fin_regular > $fin_periodo
            || $inicio_irregular < $inicio_periodo
            || $fin_irregular > $fin_periodo
            || $inicio_irregular < $fin_regular
            || $inicio_regular > $fin_regular
            || $inicio_irregular > $fin_irregular
        ){
            return false;
        }

        return true;
    }

    /**
     * Se obtienen los grupos disponibles para que un alumno se inscriba dependiendo
     * de su semestre, carrera, plantel y el período. Se toma en cuenta el estatus
     * del alumno.
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function gruposDisponiblesInscripcionPorAlumno(){

        $alumno = Alumno::find(Auth::user()->id);
//        $alumno = Alumno::find(227556);

        if($alumno == null)
            return response()->json(['message' => 'El usuario no es un alumno'], 400);

        if($alumno->permitir_inscripcion == 'No permitir')
            return response()->json(['message' => 'El alumno no tiene permitido inscribirse a un grupo.'], 400);

        //Revisar si el alumno ya está inscrito en un grupo en el periodo actual
        if($alumno->grupos()->where('periodo_id', $this->periodoActual->id)->first() != null)
            return response()->json(['message' => 'Ya te has inscrito a un grupo anteriormente.'], 400);

        $grupos = $this->gruposDisponibles($alumno, $alumno->semestre+1, $alumno->plantel_id, $alumno->carrera_id);

        return response()->json(['data' => $grupos], 200);
    }

    /**
     * Obtener los grupos disponibles para cambiar a un alumno de grupo (un solo alumno).
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function gruposDisponiblesParaCambioDeUnAlumno($id){

        $alumno = Alumno::with(['grupos' => function ($query) {
            $query->where('periodo_id', Sisec::periodoActual()->id);
        }])->find($id);

        if($alumno == null)
            return response()->json(['message' => 'El usuario no es un alumno'], 400);

        if(!Sisec::validarAlcanceYPermiso($alumno->plantel_id, 'Inscribir alumnos a grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción'], 403);

        if(count($alumno->grupos) == 0)
            return response()->json(['message' => 'El alumno no está inscrito a un grupo en el período actual'], 400);

        $grupos = $this->gruposDisponibles($alumno, $alumno->semestre, $alumno->plantel_id, $alumno->carrera_id, $alumno->grupos[0]);

        return response()->json(['data' => $grupos], 200);
    }

    /**
     * Grupos disponibles para cambiar alumnos de un grupo a otro (alumnos inscritos en un grupo específico).
     *
     * @param int $id Identificador del grupo periodo
     * @return \Illuminate\Http\JsonResponse
     */
    public function gruposDisponiblesParaCambio($id){

        $grupoPeriodo = GrupoPeriodo::with('plantelCarrera')->find($id);

        if($grupoPeriodo == null)
            return response()->json(['message' => 'El grupo no existe'], 404);

        if(!Sisec::validarAlcanceYPermiso($grupoPeriodo->plantelCarrera->plantel_id, 'Inscribir alumnos a grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción'], 403);

        if($grupoPeriodo->status != 'activo')
            return response()->json(['message' => 'El grupo no está activo'], 400);

        $grupos = $this->gruposDisponibles(null, $grupoPeriodo->semestre, $grupoPeriodo->plantelCarrera->plantel_id, $grupoPeriodo->plantelCarrera->carrera_id, $grupoPeriodo);

        return $grupos;
    }

    /**
     * Se obtiene un listado de todos los documentos que puede entregar un alumno.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function documentos(){

        $documentos = DocumentoInscripcion::all();

        return response()->json(['data' => $documentos], 200);

    }

    public function inscripcionesParaAprobacion(){

        if(!auth()->user()->hasPermissionTo('Inscribir alumnos a grupo')){
            return response()->json(['message' => 'No tiene los permisos para realizar esta acción'], 403);
        }

        $planteles = Sisec::plantelesUsuario();

        $periodoActual = $this->periodoActual;

        $inscripciones = AlumnoGrupo::whereHas('grupo', function($query) use ($periodoActual){
            $query->where('periodo_id', $periodoActual->id);
        })
            ->with('alumno.usuario', 'grupo.plantelCarrera.carrera', 'grupo.plantelCarrera.plantel')
            ->whereHas('alumno', function($query) use ($planteles){
                $query->whereIn('plantel_id', $planteles);
            })
            ->where('status', 'En espera')
            ->get();

        return response()->json(['data' => $inscripciones], 200);
    }

    /**
     * @param $id_grupo
     * @return \Illuminate\Http\JsonResponse
     */
    public function inscripcionPorAlumno($id_grupo){

        //Provisional
//        $alumno = Alumno::find(9703);
        $alumno = Alumno::find(Auth::user()->id);

        $grupo = GrupoPeriodo::withCount('alumnos')->where('id', $id_grupo)->first();

        $validacion = $this->validarInscripcion($grupo, $alumno, 'alumno');

        if($validacion['code'] != 200)
            return response()->json(['message' => $validacion['message']], $validacion['code']);

        $grupo->alumnos()->attach($alumno->usuario_id, ['status' => 'En espera']);

        return response()->json(['message' => 'Solicitud de inscripción realizada correctamente.'], 200);
    }

    public function inscripcionPorControlEscolar(Request $request){

        $grupo = GrupoPeriodo::with('plantelCarrera')->find($request->grupo_periodo_id);

        if($grupo == null)
            return response()->json(['message' => 'El grupo no está activo o no existe'], 404);

        if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Inscribir alumnos a grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción'], 403);

        //Revisar si el tipo de inscripción no es exclusiva para los alumnos
        if($grupo->tipo_inscripcion == 'alumno')
            return response()->json(['message' => 'Sólo los alumnos se pueden inscribir a este grupo manualmente.'], 400);

        $alumnos = $request->alumnos;

        if($grupo->max_alumnos < $grupo->alumnos()->count() + count($alumnos))
            return response()->json(['message' => 'La inscripción de los alumnos rebasaría la cantidad máxima permitida en el grupo'], 400);

        $errores = [];
        $idAlumnos = [];

        foreach ($alumnos as $id_alumno){

            $alumno = Alumno::with('usuario')->where('usuario_id', $id_alumno)->first();

            if($alumno == null)
                continue;

            $validacion = $this->validarInscripcion($grupo,$alumno,'control escolar');

            if($validacion['code'] != 200) {
                array_push($errores, ['alumno' => $alumno, 'error' => $validacion['message']]);
                array_push($idAlumnos, $id_alumno);
            }else{
                $grupo->alumnos()->attach($id_alumno, ['status' => 'Inscrito']);
                if ($alumno->semestre < $grupo->semestre)
                	$alumno->semestre++;
                $alumno->save();
            }

        }
        //Guardar los ids de los alumnos que se pudieron inscribir para el log.
        $alumnosString = json_encode(array_diff($alumnos, $idAlumnos));

        if(count($errores) == 0 || count($errores) < count($alumnos))
            $this->auditoriaManualSave("Inscribió alumnos a un grupo. (alumnos={$alumnosString})", 'grupo_periodo', $grupo->id, 'inscripcionPorControlEscolar', 'App\GrupoPeriodo');

        if(count($errores) > 0) {
            if(count($errores) < count($alumnos))
                $message = 'Se han inscrito algunos alumnos al grupo.';
            else
                $message = 'No se ha podido inscribir ningún alumno al grupo.';

            return response()->json(['message' => $message, 'data' => $errores, 'ids' => $idAlumnos], 400);
        }

        return response()->json(['message' => 'Se han inscrito correctamente los alumnos al grupo'], 200);
    }

    /**
     * Aprobar o rechazar la solicitud de inscripción de un alumno a un grupo. Si se aprueba se
     * cambia el status a Inscrito y si no, se elimina la solicitud para que se pueda inscribir
     * al alumno a un grupo distinto.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function aprobarInscripcionAlumno(Request $request){

        if(!auth()->user()->hasPermissionTo('Inscribir alumnos a grupo'))
            return response()->json(['message' => 'No tiene permisos para inscribir a un alumno.'], 400);

        $solicitud = AlumnoGrupo::find($request->alumno_grupo_id);

        if($solicitud == null)
            return response()->json(['message' => 'No se encuentra la solicitud de inscripción.'], 404);

        if($solicitud->status == 'Inscrito')
            return response()->json(['message' => 'La inscripción del alumno ya se encuentra realizada, no se puede modificar'], 400);

        if($request->aprobar) {
            $solicitud->status = 'Inscrito';
            $solicitud->save();

            $alumno = Alumno::find($solicitud->alumno_id);
            $alumno->semestre++;
            $alumno->save();

            $message = 'aprobado';
        }else{
            $solicitud->delete();
            $message = 'rechazado';
        }

        return response()->json(['message' => 'Se ha '.$message.' la inscripción del alumno al grupo'], 200);
    }

    public function cambiarAlumnosDeGrupo(Request $request){

        if(!auth()->user()->hasPermissionTo('Inscribir alumnos a grupo'))
            return response()->json(['message' => 'No tiene permiso para realizar esta acción.'], 403);

        $cambios = collect($request->cambios);

        $verificarMaxAlumnos = $cambios->groupBy('grupo_periodo_id');

        //Verificar si la cantidad de alumnos a inscribir en el grupo no hace que se exceda el límite de alumnos.
        foreach ($verificarMaxAlumnos as $grupo){
            $grupoPeriodo = GrupoPeriodo::withCount('alumnos')->find($grupo[0]['grupo_periodo_id']);
            if($grupoPeriodo->alumnos_count + count($verificarMaxAlumnos) > $grupoPeriodo->max_alumnos)
                return response()->json(['message' => 'La cantidad de alumnos en el grupo '.$grupoPeriodo->grupo.' excede el límite máximo'], 400);
        }

        $errores = [];
        $idAlumnos = [];

        DB::beginTransaction();
        try {
            //Hacer el cambio de grupo para cada alumno.
            foreach ($cambios as $cambio) {
                $alumno = Alumno::with(['grupos' => function ($query) {
                    $query->where('periodo_id', Sisec::periodoActual()->id);
                }])->find($cambio['alumno_id']);

                $grupoPeriodo = GrupoPeriodo::find($cambio['grupo_periodo_id']);

                $validacion = $this->validarCambioDeGrupo($alumno, $grupoPeriodo);

                if($validacion != 'Correcto') {
                    array_push($errores, ['alumno' => $alumno, 'error' => $validacion]);
                    array_push($idAlumnos, $alumno->usuario_id);
                    continue;
                }

                if (count($alumno->grupos) > 0) {
                    $old_id = $alumno->grupos->first()->id;
                    $alumno->grupos->first()->alumnos()->detach($alumno->usuario_id);
                }

                $cambio = AlumnoGrupo::insertGetId([
                    'alumno_id' => $alumno->usuario_id,
                    'grupo_periodo_id' => $grupoPeriodo->id,
                    'status' => 'Inscrito'
                ]);

                $this->auditoriaManualSave(
                    "Cambió a un alumno de grupo. (alumno_id={$alumno->usuario_id}, grupo_periodo_id_nuevo={$grupoPeriodo->id}, grupo_periodo_id_anterior={$old_id})",
                    'alumno_grupo',
                    $cambio,
                    'cambiarAlumnosDeGrupo',
                    'App\AlumnoGrupo'
                );
            }
        }catch(Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'No se ha podido cambiar a los alumnos de grupo'], 400);
        }

        DB::commit();
        if(count($errores) >0)
            return response()->json(['message' => 'Se cambiaron algunos alumnos de grupo', 'data' => $errores, 'ids' => $idAlumnos], 400);

        return response()->json(['message' => 'Se ha cambiado a los alumnos de grupo'], 200);

    }

    public function quitarAlumnoDeGrupo(Request $request, $id){

        $alumno = Alumno::find($id);
        if($alumno == null){
            return response()->json(['message'=> 'El alumno no existe'], 404);
        }

        if(!Sisec::validarAlcanceYPermiso($alumno->plantel_id, 'Inscribir alumnos a grupo'))
                return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        $estaEnGrupo = AlumnoGrupo::where('alumno_id', $alumno->usuario_id)
            ->where('grupo_periodo_id', $request->grupo_periodo_id)
            ->first();
        if($estaEnGrupo == null){
            return response()->json(['message' => 'El alumno no está inscrito en el grupo'], 400);
        }

        $grupoPeriodo = GrupoPeriodo::find($request->grupo_periodo_id);
        /*if($grupoPeriodo->periodo_id != Sisec::periodoActual()->id){
            return response()->json(['message' => 'Sólo se pueden quitar alumnos de grupos en el período actual'], 400);
        }*/

        //Se valida con calificaciones del período ya que puede que hayan cambiado al alumno de grupo anteriormente.
        $calificaciones = CalificacionUac::where('alumno_id', $alumno->usuario_id)
            ->where('periodo_id', $grupoPeriodo->periodo_id)
            ->get();

        if($calificaciones->isNotEmpty()){
            return response()->json(['message' => 'No se puede quitar al alumno del grupo porque ya se le han asignado calificaciones'], 400);
        }

        $alumno->grupos()->detach($request->grupo_periodo_id);
        $alumno->semestre--;
        $alumno->save();

        return response()->json(['message' => 'Se ha quitado al alumno del grupo.'], 200);
    }

    private function validarCambioDeGrupo($alumno, $grupo){

        if($alumno == null)
            return 'El usuario no es un alumno';

        if($grupo == null)
            return 'El grupo no existe';

        if($grupo->periodo_id != Sisec::periodoActual()->id)
            return 'El grupo no pertenece al período actual';

        if($alumno->semestre != $grupo->semestre)
            return 'El alumno no está en el mismo semestre del grupo';

        if($alumno->plantel_id != $grupo->plantelCarrera->plantel_id)
            return 'El alumno no pertenece al plantel del grupo';

        if($alumno->carrera_id != $grupo->plantelCarrera->carrera_id)
            return 'El alumno no pertenece a la carrera del grupo';

        return 'Correcto';

    }

    private function validarFechaInscripcion($grupo, $alumno){
        $fechaActual = Carbon::now()->toDateString();

        if(($alumno->tipo_alumno == 'Regular' && $grupo->fecha_inicio <= $fechaActual && $grupo->fecha_fin >= $fechaActual) ||
        ($alumno->tipo_alumno == 'Irregular' && $grupo->fecha_inicio_irregular <= $fechaActual && $grupo->fecha_fin_irregular >= $fechaActual))
            return true;
        else
            return false;
    }

    /**
     * Se validan todas las posibles razones por las que un alumno no se debería poder inscribir a un grupo.
     *
     * @param $grupo
     * @param $alumno
     * @param $tipo
     * @return array
     */
    private function validarInscripcion($grupo, $alumno, $tipo){

        if($alumno == null)
            return ['message' => 'El usuario no es un alumno', 'code' => 400];

        //Revisar si tiene permitido inscribirse a un grupo
        if($alumno->permitir_inscripcion == 'No Permitir')
            return ['message' => 'El alumno no se puede inscribir a un grupo porque no tiene su información completa', 'code' => 400];

        if($alumno->estatus_inscripcion == 'Baja')
            return ['message' => 'El alumno no se puede inscribir a un grupo porque está dado de baja.', 'code' => 400];

        //Revisar si el alumno ya está inscrito en un grupo en el periodo actual
        if($alumno->grupos()->where('periodo_id', $this->periodoActual->id)->first() != null)
            return ['message' => 'El alumno ya se encuentra inscrito a un grupo o en aprobación.', 'code' => 400];

        //Revisar si existe el grupo
        if($grupo == null)
            return ['message' => 'El grupo no existe', 'code' => 404];

        if($grupo->status != 'activo')
            return ['message' => 'El grupo no está activo.', 'code' => 400];

        //Revisar si el alumno puede inscribirse
        if($tipo == 'alumno' && $grupo->tipo_inscripcion == 'control escolar')
            return ['message' => 'Sólo control escolar te puede inscribir a este grupo', 'code' => 400];

        //Revisar si el grupo pertenece al periodo activo
        if($grupo->periodo_id != $this->periodoActual->id)
            return ['message' => 'El grupo no pertenece al periodo actual', 'code' => 400];

        //Revisar que el grupo no esté lleno
        if($tipo == 'alumno' && $grupo->alumnos_count >= $grupo->max_alumnos)
            return ['message' => 'El grupo ya tiene el máximo de alumnos, favor de elegir otro.', 'code' => 400];

        //Revisar la fecha en la que el alumno quiere inscribirse
        if(!$this->validarFechaInscripcion($grupo, $alumno)){
            if($tipo == 'alumno')
                return ['message' => 'El período de inscripción al grupo está cerrado.', 'code' => 400];
            else
                return ['message' => 'La fecha de inscripción no es válida para este alumno y grupo.', 'code' => 400];
        }

        //Revisar el semestre del alumno
        //if($alumno->semestre != $grupo->semestre-1)
				if($alumno->semestre < $grupo->semestre-1 || $alumno->semestre > $grupo->semestre)
        	return ['message' => 'No se puede inscribir a este grupo debido al semestre.', 'code' => 400];

        $plantelCarrera = $grupo->plantelCarrera()->first();

        //Revisar si el alumno pertenece al plantel del grupo
        $plantel = $grupo->plantelCarrera()->first()->plantel()->first()->id;
        if($alumno->plantel_id != $plantel && $alumno->plantel_carrera_id != $plantelCarrera->id)
            return ['message' => 'El alumno no está inscrito en el plantel correspondiente al grupo', 'code' => 400];

        $carrera = $grupo->plantelCarrera()->first()->carrera()->first()->id;
        if($alumno->carrera_id != $carrera && $alumno->plantel_carrera_id != $plantelCarrera->id)
            return ['message' => 'El alumno no cursa la carrera correspondiente al grupo', 'code' => 400];

        return ['message' => 'Correcto', 'code' => 200];
    }

    /**
     * Se inscribe a un alumno irregular a una materia dentro de un grupo. Sólo a una materia y se verifica
     * si el alumno la debe y si puede estar en ese grupo.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function inscripcionAlumnoIrregularAsignatura(Request $request){

        //Pendiente: Validar que el alumno no sea un alumno regular o que no haya acreditado ya la asignatura,
        //ya que esté la parte de calificaciones.

        $alumno = Alumno::find($request->alumno_id);

        $grupo = GrupoPeriodo::find($request->grupo_periodo_id);

        $carreraUac = CarreraUac::find($request->carrera_uac_id);

        if($alumno->plantel_carrera_id != null)
            $plantelCarrera = PlantelCarrera::find($alumno->plantel_carrera_id);
        else
            $plantelCarrera = PlantelCarrera::where('plantel_id', $alumno->plantel_id)
            ->where('carrera_id', $alumno->carrera_id)
            ->first();

        $validacion = $this->validarInscripcionIrregularAsignatura($alumno, $grupo, $plantelCarrera, $carreraUac);

        if($validacion['code'] != 200)
            return response()->json(['message' => $validacion['message']], $validacion['code']);

        if($inscripcion = AlumnoUacGrupo::create([
            'alumno_id' => $alumno->usuario_id,
            'grupo_periodo_id' => $grupo->id,
            'carrera_uac_id' => $carreraUac->id
        ])) {
            $this->auditoriaManualSave(
                "Inscribió a un alumno a una materia. (carrera_uac_id={$carreraUac->id}, grupo_periodo_id={$grupo->id}, alumno_id={$alumno->usuario_id})",
                'alumno_uac_grupo',
                $inscripcion->id,
                'inscripcionAlumnoIrregularAsignatura',
                'App\AlumnoUacGrupo'
            );
            return response()->json(['message' => 'Se ha inscrito al alumno correctamente.'], 200);
        }else {
            return response()->json(['message' => 'Ha ocurrido un error al inscribir al alumno, por favor intente más tarde.'], 400);
        }
    }

    /**
     * Se validan todas las posibles razones por las que un alumno irregular no se debería poder inscribir
     * a una materia.
     *
     * @param $alumno
     * @param $grupo
     * @param $plantelCarrera
     * @param $carreraUac
     * @return array
     */
    private function validarInscripcionIrregularAsignatura($alumno, $grupo, $plantelCarrera, $carreraUac){

        if($alumno == null)
            return ['message' => 'El alumno no existe.', 'code' => 404];

        if(!Sisec::validarAlcanceYPermiso($alumno->plantel_id, 'Inscribir alumnos a grupo'))
            return ['message' => 'No tiene permisos para realizar esta acción', 'code' => 403];

        $periodoActual = $this->periodoActual;

        $materias = AlumnoUacGrupo::where('alumno_id', $alumno->usuario_id)
            ->whereHas('grupo', function($query) use ($periodoActual){
                $query->where('periodo_id', $periodoActual->id);
            })->get();

        if($materias != null && count($materias) == 2)
            return ['message' => 'El alumno no puede recursar más materias en este período.', 'code' => 400];

        if($alumno->tipo_alumno != 'Irregular')
            return ['message' => 'El alumno no es irregular por lo tanto no se puede inscribir a una materia de forma extraordinaria.', 'code' => 400];

        if($grupo == null)
            return ['message' => 'El grupo no existe.', 'code' => 404];

        if($grupo->status != 'activo')
            return ['message' => 'El grupo no está activo', 400];

        if($grupo->periodo_id != $this->periodoActual->id)
            return ['message' => 'El grupo no corresponde al período actual', 'code' => 400];

        if($carreraUac == null)
            return ['message' => 'La asignatura no existe', 'code' => 404];

        if($plantelCarrera == null)
            return ['message' => 'La carrera no se imparte en el plantel seleccionado.', 'code' => 404];

        //Valida que el alumno ya haya cursado ese semestre
        if($alumno->semestre < $carreraUac->semestre && $alumno->semestre < 6)
            return ['message' => 'El alumno no puede recursar una materia de un semestre superior o que no ha cursado.', 'code' => 400];

        //Pendiente: Validar que ya haya cursado la materia y que la haya reprobado. Pendiente de saber si un alumno
        //puede volver a cursar una asignatura que no haya reprobado.
        $cursada = CalificacionUac::where('alumno_id', $alumno->usuario_id)
            ->where('carrera_uac_id', $carreraUac->id)->first();

        if($cursada == null)
            return ['message' => 'El alumno no ha cursado la materia anteriormente', 'code' => 400];

        $periodoActual = $this->periodoActual->id;

        $inscrito = AlumnoUacGrupo::where('alumno_id', $alumno->usuario_id)
            ->where('carrera_uac_id', $carreraUac->id)
            ->whereHas('grupo', function($query) use ($periodoActual) {
                $query->where('periodo_id', $periodoActual);
        })->first();

        if($inscrito != null)
            return ['message' => 'El alumno ya está inscrito en esa asignatura', 'code' => 400];

        //Verificar si el grupo pertenece a la carrera y el plantel del alumno.
        if($grupo->plantel_carrera_id != $plantelCarrera->id)
            return ['message' => 'No se puede asignar ese grupo porque el alumno no está inscrito en la carrera o el plantel seleccionados.', 'code' => 400];

        //Verificar si la asignatura se imparte en la carrera asignada al grupo.
        if($carreraUac->carrera_id != $plantelCarrera->carrera_id)
            return ['message' => 'La asignatura no se imparte en la carrera que tiene asignada el grupo seleccionado.', 'code' => 400];

        //Verificar si el semestre del grupo corresponde al de la asignatura
        if($grupo->semestre != $carreraUac->semestre)
            return ['message' => 'La asignatura no se imparte en el semestre asignado al grupo seleccionado', 'code' => 400];

        return ['message' => 'Correcto', 'code' => 200];
    }

    /**
     * Obtener los grupos disponibles para un alumno que desea inscribirse en un determinado semestre.
     * Se recibe el semestre en caso de que sea un cambio de grupo, para poder buscar grupos del semestre actual
     * del alumno.
     *
     * @param $alumno
     * @param $semestre
     * @param $plantel
     * @param $carrera
     * @param null $grupoActual
     * @return \Illuminate\Http\JsonResponse
     */
    private function gruposDisponibles($alumno, $semestre, $plantel, $carrera, $grupoActual = null)
    {
        $plantelCarrera = PlantelCarrera::where('plantel_id', $plantel)->where('carrera_id', $carrera)->first();

        if ($plantelCarrera == null)
            return response()->json(['message' => 'Hubo un problema con el plantel y la carrera a los que el alumno está inscrito'], 400);

        $query = GrupoPeriodo::withCount('alumnos')
            ->where('plantel_carrera_id', $plantelCarrera->id)
            ->where('semestre', $semestre)
            ->where('periodo_id', $this->periodoActual->id)
            ->where('status', 'activo');

        //Obtener grupos dependiendo de las fechas de inscripciones, sólo para la inscripción hecha por un alumno.
        if ($grupoActual == null && $alumno != null){
            $fecha_actual = Carbon::now()->toDateString();

            if ($alumno->tipo_alumno == 'Regular') {
                $query->where('fecha_inicio', '<=', $fecha_actual)
                    ->where('fecha_fin', '>=', $fecha_actual);
            } else {
                $query->where('fecha_inicio_irregular', '<=', $fecha_actual)
                    ->where('fecha_inicio_irregular', '>=', $fecha_actual);
            }
            $grupos = $query->get();
        }else{
            $query->where('id', '!=', $grupoActual->id);
            $grupos = $query->get();
            $grupos = $grupos->filter(function($value, $key){
                return $value->alumnos_count < $value->max_alumnos;
            })->values()->all();
        }

        return $grupos;

    }
}
