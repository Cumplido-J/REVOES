<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use App\Notifications\SolicitudCrearGrupo;
use App\PlantelCarrera;
use App\Grupo;
use App\GrupoPeriodo;
use App\Alumno;
use App\Periodo;
use App\Usuario;
use App\UAC;
use App\CarreraUac;
use App\DocenteAsignatura;
use App\Traits\AuditoriaLogHelper;
use Sisec;

class GrupoPeriodoController extends Controller
{
    use AuditoriaLogHelper;

    /**
     * Obtiene la lista de grupos activos en un periodo, con filtros por plantel, carrera,
     * y semestre.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if(!Sisec::validarAlcanceYPermiso($request->plantel_id, 'Buscar grupo periodo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción en el plantel seleccionado.'], 403);


        if(isset($request->periodo_id)){
            $periodoId = $request->periodo_id;
            $periodo = Periodo::find($periodoId);
        }else{
            $periodo = Sisec::periodoActual();
            $periodoId = $periodo->id;
        }

        if($periodo == null)
            return response()->json(['message' => 'El periodo no existe'], 404);

        $mitad = explode('/', $periodo->nombre)[1];
        $semestres = ($mitad == '2') ? [2,4,6] : [1,3,5];

        $filtros = GrupoPeriodo::whereHas('plantelCarrera', function($query) use ($request){
            $query->where('plantel_id', $request->plantel_id);
            /* Si se tiene el filtro carrera, se seleccionan sólo los grupos que existen para esa carrera y ese plantel
             * en específico.
             */
            if($request->carrera_id != null){
                $query->where('carrera_id', $request->carrera_id);
            }
        });

        //Si existe el filtro por semestre, se obtienen sólo los grupos de ese semestre.
        if($request->semestre != null){
            if(in_array($request->semestre, $semestres))
                $filtros->where('semestre', $request->semestre);
            else{
                return response()->json(['message' => 'El semestre no se imparte en ese periodo.'], 400);
            }
        }else{
            $filtros->whereIn('semestre', $semestres);
        }

        //Se ejecuta el query con los filtros.
        $grupos = $filtros->where('status', 'activo')
            ->where('periodo_id', $periodoId)
            ->with('plantelCarrera.plantel', 'plantelCarrera.carrera')
            ->withCount('alumnos')
            ->get();

        return response()->json(['data' => ['grupos' => $grupos]], 200);

    }

    /**
     * Obtiene los grupos que se le pueden asignar a un alumno irregular dependiendo de
     * la materia que tiene reprobada y de su plantel.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function gruposPorCarreraUAC(Request $request){

        $alumno = Alumno::find($request->alumno_id);

        if($alumno == null)
            return response()->json(['message' => 'El alumno no existe.'], 404);

        $asignatura = CarreraUac::with('uac')->find($request->carrera_uac_id);

        if($asignatura == null)
            return response()->json(['message' => 'La asignatura no existe.'], 404);

        if($alumno->plantel_carrera_id != null)
            $plantelCarrera = PlantelCarrera::find($alumno->plantel_carrera_id);
        else
            $plantelCarrera = PlantelCarrera::where('plantel_id', $alumno->plantel_id)
            ->where('carrera_id', $alumno->carrera_id)
            ->first();

        if($plantelCarrera == null)
            return response()->json(['message' => 'La carrera no se imparte en el plantel seleccionado.'], 404);

        if(!Sisec::validarAlcanceYPermiso($plantelCarrera->plantel_id, 'Inscribir alumnos a grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        $query = GrupoPeriodo::where('periodo_id', Sisec::periodoActual()->id)
            ->where('plantel_carrera_id', $plantelCarrera->id)
            ->where('semestre', $asignatura->semestre);

        if($asignatura->uac->optativa == 1){
            $query->whereHas('optativas', function($optativas) use ($asignatura){
                $optativas->where('uac_id', $asignatura->uac_id);
            });
        }

        $grupos = $query->get();

        return response()->json(['data' => $grupos], 200);

    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $grupo = GrupoPeriodo::with([
            'plantelCarrera.carrera',
            'plantelCarrera.plantel',
            'periodo',
            'alumnos.usuario',
        ])->where('id', $id)
        ->first();

        if($grupo == null)
            return response()->json(['message' => 'El grupo no existe'], 404);

        if(!Sisec::validarAlcance($grupo->plantelCarrera->plantel_id))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        $carreraId = $grupo->plantelCarrera->carrera_id;

        //Se obtienen las asignaturas con el docente que las imparte
        $carreraUacs = CarreraUac::with(['docenteAsignatura' => function($query) use ($grupo){
                $query->where('grupo_periodo_id', $grupo->id);
            }, 'docenteAsignatura.plantillaDocente.docente', 'uac'])
            ->where('carrera_id', $carreraId)
            ->where('semestre', $grupo->semestre)
            ->whereHas('uac', function($query){
                $query->where('tipo_uac_id', '!=', 4)->where('optativa', 0);
            })
            ->get();

        $grupo->uacs = $carreraUacs;

        //Si el grupo pertenece a 6to semestre se envían las optativas
        if($grupo->semestre == 6){
            $optativas = CarreraUac::whereHas('uac', function($query) use ($grupo){
                $query->where('optativa', 1)
                    ->whereHas('grupoOptativa', function($queryGrupo) use ($grupo){
                        $queryGrupo->where('grupo_periodo_id', $grupo->id);
                    });
                })
                ->where('carrera_id', $carreraId)
                ->with(['docenteAsignatura' => function($query) use ($grupo){
                    $query->where('grupo_periodo_id', $grupo->id);
                }, 'docenteAsignatura.plantillaDocente.docente', 'uac'])
                ->get();

            foreach ($optativas as $op){
                $grupo->uacs->push($op);
            }

            $grupo->optativas = $grupo->optativas()->get();
        }

        //Lista de alumnos que están inscritos sólo en una materia en ese grupo.
        $grupo->alumnos_irregulares = $this->alumnosIrregularesEnGrupo($id);

        //Saber si están abiertas las inscripciones
        $fecha_actual = Carbon::now()->toDateString();
        $grupo->inscripcion_regular_abierta = $grupo->fecha_inicio <= $fecha_actual && $grupo->fecha_fin >= $fecha_actual;
        $grupo->inscripcion_irregular_abierta = $grupo->fecha_inicio_irregular <= $fecha_actual && $grupo->fecha_fin_irregular >= $fecha_actual;

        return response()->json(['data' => $grupo], 200);
    }

    /**
     * Actualiza el grupo asignado a un periodo determinado.
     *
     * @param \Illuminate\Http\Request $request
     * @param $grupo_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $usuario = auth()->user();

        $grupoPeriodo = GrupoPeriodo::with('plantelCarrera')->find($id);
        $old = GrupoPeriodo::with('plantelCarrera')->find($id);

        //Saber si existe el grupo en el catálogo o si no se ha eliminado.
        if($grupoPeriodo == null)
            return response()->json(['message' => 'El grupo para ese periodo no existe'], 404);

        if(!Sisec::validarAlcanceYPermiso($grupoPeriodo->plantelCarrera->plantel_id, 'Editar grupo periodo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        if($grupoPeriodo->accion != null)
            return response()->json(['message' => 'Este grupo ya está en espera de aprobación'], 400);

        $ultimoPeriodo = Sisec::periodoActual();
        if($ultimoPeriodo == null || $ultimoPeriodo->id != $grupoPeriodo->periodo_id){
            return response()->json(['message' => 'No se puede actualizar un grupo de un periodo anterior.'], 400);
        }

        if($request->max_alumnos > 100)
            return response()->json(['message' => 'El máximo de alumnos no puede ser mayor a 100.'], 400);
        DB::beginTransaction();
        try {
            if(!$usuario->hasPermissionTo('Aprobar grupos')){
                $params = [];
                $params['grupo'] = $grupoPeriodo->grupo;
                $params['periodo_id'] = $grupoPeriodo->periodo_id;
                $params['grupo_id'] = $grupoPeriodo->grupo_id;
                $params['semestre'] = $grupoPeriodo->semestre;
                $params['plantel_carrera_id'] = $grupoPeriodo->plantel_carrera_id;
                $params['turno'] = $grupoPeriodo->turno;
                $params['max_alumnos'] = $request->max_alumnos;
                $params['status'] = 'pendiente';
                $params['accion'] = 'editar';
                $params['id_original'] = $id;

                $grupoPeriodo['accion'] = 'editar';
                $grupoPeriodo->save();

                $grupo = GrupoPeriodo::create($params);

                $this->enviarNotificacion($usuario, $grupo, 'actualizar', true);
                $this->auditoriaSave($grupoPeriodo, $old);
                DB::commit();
                return response()->json(['message' => 'Se envió a aprobación'], 200);
            }

            $grupoPeriodo->update(['max_alumnos' => $request->max_alumnos]);
        }catch(QueryException $e){
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar el grupo'], 400);
        }

        $this->auditoriaSave($grupoPeriodo, $old);
        $grupoPeriodo = GrupoPeriodo::where('id', $grupoPeriodo->id)
            ->with('plantelCarrera.plantel', 'plantelCarrera.carrera')->first();
        DB::commit();
        return response()->json(['data' => $grupoPeriodo, 'message' => 'Se ha actualizado el grupo'], 200);
    }

    /**
     * Deshabilita un grupo
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $usuario = auth()->user();

        $grupoPeriodo = GrupoPeriodo::withCount('alumnos')->with('plantelCarrera')->find($id);

        if($grupoPeriodo == null){
            return response()->json(['message' => 'El grupo no está habilitado para el período actual.'], 404);
        }

        if(!Sisec::validarAlcanceYPermiso($grupoPeriodo->plantelCarrera->plantel_id, 'Eliminar grupo periodo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        if($grupoPeriodo->accion != null){
            return response()->json(['message' => 'Este grupo ya tiene otra aprobación pendiente.'],400);
        }

        if($grupoPeriodo->alumnos_count > 0)
            return response()->json(['message'=> 'El grupo no se puede deshabilitar si tiene alumnos inscritos'], 400);

        $docentesAsignados = DocenteAsignatura::where('grupo_periodo_id', $grupoPeriodo->id)->get();

        if($docentesAsignados->isNotEmpty())
            return response()->json(['message' => 'No se puede deshabilitar porque hay docentes asignados a este grupo.'], 400);

        try {

            if(!$usuario->hasPermissionTo('Aprobar grupos')){
                $grupoPeriodo->accion = 'eliminar';
                $grupoPeriodo->save();

                $this->enviarNotificacion($usuario, $grupoPeriodo, 'desactivar', true);
                $this->auditoriaSave($grupoPeriodo);
                return response()->json(['message' => 'Se envió a aprobación'], 200);
            }

            $grupoPeriodo->status = 'inactivo';
            $grupoPeriodo->save();
            $this->auditoriaSave($grupoPeriodo);
            return response()->json(['message' => 'Se ha deshabilitado el grupo'], 200);
        }catch(QueryException $e){
            return response()->json(['message' => 'No se ha podido deshabilitar el grupo'], 400);
        }
    }

    public function habilitarGrupo(Request $request){

        $usuario = auth()->user();

        $grupo = Grupo::with('plantelCarrera')
            ->where('id',$request->grupo_id)
            ->where('status', '!=', 'pendiente')
            ->select('grupo','turno','semestre','plantel_carrera_id')
            ->first();

        if($grupo == null)
            return response()->json(['message' => 'El grupo no existe o está en aprobación'], 404);

        if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Activar grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        if($request->periodo_id == null)
            return response()->json(['message' => 'Se necesita el periodo'], 400);

        if($request->max_alumnos > 100)
            return response()->json(['message' => 'El máximo de alumnos no puede ser mayor a 100.'], 400);

        //Se obtiene el período actual para verificar que no se quiera activar un grupo en un periodo anterior.
        $ultimoPeriodo = Sisec::periodoActual();
        $periodo = Periodo::find($request->periodo_id);

        /*if($ultimoPeriodo == null || $ultimoPeriodo->id != $request->periodo_id){
            return response()->json(['message' => 'No se puede habilitar un grupo para un periodo anterior.'], 400);
        }*/

        //Se verifica que el semestre esté activo en el periodo.
        $mitad = explode('/', $periodo->nombre)[1];
        $semestres = ($mitad == '2') ? [2,4,6] : [1,3,5];

        if(!in_array($grupo->semestre, $semestres))
            return response()->json(['message' => 'Este grupo no se puede activar para el periodo debido al semestre.'], 400);

        //Se verifica que el grupo no esté activo aún en el período.
        $grupoPeriodo = GrupoPeriodo::where('grupo_id', $request->grupo_id)
            ->where('periodo_id', $request->periodo_id)
            ->where('status', '!=', 'inactivo')->first();

        if($grupoPeriodo != null ){
            if($grupoPeriodo->status == 'activo')
                return response()->json(['message' => 'Este grupo ya se ha habilitado para este periodo anteriormente'], 400);
            if($grupoPeriodo->status == 'pendiente')
                return response()->json(['message' => 'Este grupo ya está en espera de aprobación'], 400);
        }

        try {
            $params = $grupo->toArray();
            $params['max_alumnos'] = $request->max_alumnos;
            $params['periodo_id'] = $request->periodo_id;
            $params['grupo_id'] = $request->grupo_id;
            $params['status'] = 'pendiente';
            $params['accion'] = 'activar';

            $grupoPeriodo = GrupoPeriodo::create($params);
            $this->auditoriaSave($grupoPeriodo);

            if(!$usuario->hasPermissionTo('Aprobar grupos')){
                $this->enviarNotificacion($usuario, $grupoPeriodo, 'habilitar', true);
                return response()->json(['message' => 'El grupo se ha enviado a aprobación.'], 200);
            }

            $grupoPeriodo['status'] = 'activo';
            $grupoPeriodo['accion'] = null;
            $grupoPeriodo->save();

            return response()->json(['data' => $grupoPeriodo, 'message' => 'Se ha habilitado el grupo'], 200);
        }catch(QueryException $e){
            return response()->json(['message' => 'Hubo un error al habilitar el grupo'], 400);
        }

    }

    /**
     * Aprueba o rechaza el activar, editar o desactivar un grupo en un periodo.
     *
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function aprobarRechazarGrupo(Request $request, $id){

        $usuario = auth()->user();

        if(!$usuario->hasPermissionTo('Aprobar grupos')){
            return response()->json(['message' => 'No autorizado'], 403);
        }

        try {
            $grupoPeriodo= GrupoPeriodo::withCount(['edicion'])->with('edicion', 'plantelCarrera')->where('id', $id)->firstOrFail();

            if(!Sisec::validarAlcanceYPermiso($grupoPeriodo->plantelCarrera->plantel_id, 'Aprobar grupos'))
                return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }catch(ModelNotFoundException $e) {
            return response()->json(['message' => 'El grupo no existe'], 404);
        }

        $aprobar = $request->aprobar;

        if($grupoPeriodo->accion == null)
            return response()->json(['message' => 'Este grupo no está pendiente de aprobación'], 400);

        if($grupoPeriodo->accion == 'activar'){

            $grupoPeriodo->status = ($aprobar) ? 'activo' : 'rechazado';
            $grupoPeriodo->accion = null;
            $grupoPeriodo->save();

            $mensaje = ($aprobar) ? 'aprobado' : 'rechazado';

            $this->auditoriaManualSave("Ha {$mensaje} la activación de un grupo.", 'grupo_periodo', $grupoPeriodo->id, 'aprobarRechazarGrupo', 'App\GrupoPeriodo');

            return response()->json(['message' => 'Se ha '.$mensaje.' la activación del grupo'], 200);
        }elseif($grupoPeriodo->accion == 'editar'){
            if($aprobar) {
                $edicion = $grupoPeriodo->edicion;

                $grupoPeriodo->update([
                    'max_alumnos' => $edicion->max_alumnos
                ]);

                $grupoPeriodo->edicion->delete();
                $grupoPeriodo->accion = null;
                $grupoPeriodo->save();
                $this->auditoriaManualSave("Aprobó la edición de un grupo periodo", 'grupo_periodo', $grupoPeriodo->id, 'aprobarRechazarGrupo', 'App\GrupoPeriodo');
                return response()->json(['message' => 'Se ha aprobado la modificación del grupo'], 200);
            }else{
                $grupoPeriodo->edicion->delete();
                $grupoPeriodo->accion = null;
                $grupoPeriodo->save();
                $this->auditoriaManualSave("Rechazó la edición de un grupo periodo", 'grupo_periodo', $grupoPeriodo->id, 'aprobarRechazarGrupo', 'App\GrupoPeriodo');
                return response()->json(['message' => 'Se ha rechazado la modificación del grupo'], 200);
            }
        }elseif($grupoPeriodo->accion == 'eliminar'){
            if($aprobar){
                $grupoPeriodo->status = 'inactivo';
                $grupoPeriodo->save();
                $this->auditoriaManualSave("Aprobó la eliminación de un grupo periodo", 'grupo_periodo', $grupoPeriodo->id, 'aprobarRechazarGrupo', 'App\GrupoPeriodo');
                return response()->json(['message' => 'Se ha aprobado la eliminación del grupo'], 200);
            }else{
                $grupoPeriodo->accion = null;
                $grupoPeriodo->save();
                $this->auditoriaManualSave("Rechazó la eliminación de un grupo periodo", 'grupo_periodo', $grupoPeriodo->id, 'aprobarRechazarGrupo', 'App\GrupoPeriodo');
                return response()->json(['message' => 'Se ha rechazado la eliminación del grupo'], 200);
            }
        }
    }

    /**
     * Asigna las materias optativas a un grupo periodo en específico.
     *
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function asignarOptativas(Request $request, $id){

        $grupoPeriodo = GrupoPeriodo::with('plantelCarrera')->where('id', $id)->first();

        if($grupoPeriodo == null || $grupoPeriodo->semestre != 6
            || $grupoPeriodo->status != 'activo' || $grupoPeriodo->accion == 'activar')
            return response()->json(['message' => 'No se le pueden asignar optativas a ese grupo, o el grupo no existe.'], 400);

        if(!Sisec::validarAlcanceYPermiso($grupoPeriodo->plantelCarrera->plantel_id, 'Editar grupo periodo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        $ultimoPeriodo = Sisec::periodoActual();
        if($ultimoPeriodo == null || $ultimoPeriodo->id != $grupoPeriodo->periodo_id){
            return response()->json(['message' => 'No se puede actualizar un grupo de un periodo anterior.'], 400);
        }

        $optativasNuevas = $request->optativas;

        if(count($optativasNuevas) > 3){
            return response()->json(['message' => 'No se pueden asignar más de 3 optativas.'], 400);
        }

        $optativasAsignadas = $grupoPeriodo->optativas()->get()->pluck('id')->toArray();

        $quitar = array_diff($optativasAsignadas, $optativasNuevas);

        //Revisar si las optativas que se quieren quitar no cuentan ya con una asignación a un docente. Si ya fueron asignadas,
        //no se podrán quitar.
        $conAsignacionADocente = $this->optativasConAsignacionADocente($quitar, $grupoPeriodo);
        if($conAsignacionADocente->isNotEmpty()) {
            $idsOptativas = $conAsignacionADocente->pluck('id')->toArray();
            return response()->json([
                'message' => 'Ya existen optativas con docentes asignados.',
                'data' => $conAsignacionADocente,
                'ids' => $idsOptativas
            ], 400);
        }

        $asignar = array_diff($optativasNuevas, $optativasAsignadas);

        $validacion = $this->validarOptativas($asignar, $grupoPeriodo);

        if(!$validacion['valido'])
            return response()->json(['message' => $validacion['message']], 400);

        $grupoPeriodo->optativas()->detach($quitar);
        $grupoPeriodo->optativas()->attach($asignar);

        $this->auditoriaManualSave("Asignó optativas a un grupo", 'grupo_periodo', $grupoPeriodo->id, 'asignarOptativas', 'App\GrupoPeriodo');
        return response()->json(['message' => 'Se han asignado las optativas.'], 200);
    }

    private function validarOptativas($optativas, $grupoPeriodo){

        foreach ($optativas as $optativa) {

            $uac = UAC::find($optativa);

            if ($uac == null)
                return ['message' => 'No es posible asignar una de las materias porque no existe', 'valido' => false];

            if($uac->optativa == 0)
                return ['message' => 'Una de las materias seleccionadas no es optativa', 'valido' => false];

            $carreraUac = CarreraUac::where('carrera_id', $grupoPeriodo->plantelCarrera->carrera_id)->where('uac_id', $optativa);

            if ($carreraUac == null)
                return ['message' => 'Una de la optativas no se imparte en esa carrera'];
        }

        return ['message' => '', 'valido' => true];
    }

    private function optativasConAsignacionADocente($optativas, $grupoPeriodo){

        $asignadas = [];

        foreach ($optativas as $opt){
            $carreraUac = CarreraUac::where('carrera_id', $grupoPeriodo->plantelCarrera->carrera_id)
                ->where('uac_id', $opt)
                ->first();

            if($carreraUac == null)
                continue;

            $asignacion = DocenteAsignatura::where('grupo_periodo_id', $grupoPeriodo->id)
                ->where('carrera_uac_id', $carreraUac->id)
                ->where('estatus', 1)
                ->first();

            if($asignacion != null)
                array_push($asignadas, $opt);
        }

        return Uac::find($asignadas);
    }

    /**
     * Envía una notificación a los usuarios con rol de Dirección para
     * avisar que se solicitó la aprobación de un grupo.
     *
     * @param $usuario
     * @param $grupo
     * @param $accion
     * @param $aprobacion
     */
    private function enviarNotificacion($usuario, $grupo, $accion, $aprobacion){

        $plantelCarrera = PlantelCarrera::find($grupo->plantel_carrera_id);
        $plantel = $plantelCarrera->plantel()->first();
        $municipio = $plantel->municipio()->first();
        $estado = $municipio->estado()->first();

        //NOTA: No uso orWhereHas porque no tengo muchas formas de probar que el resultado sea correcto.
        //Quizás ya con mayor cantidad de usuarios de control escolar se puede modificar.
        $porPlantel = Usuario::permission('Aprobar grupos')
            ->whereHas('planteles', function($query) use ($plantel){
                $query->where('plantel_id', $plantel->id);
            })->get()->pluck('id')->toArray();

        $porEstado = Usuario::permission('Aprobar grupos')
            ->whereHas('estados', function($query) use ($estado){
                $query->where('estado_id', $estado->id);
            })->get()->pluck('id')->toArray();

        $ids = array_unique(array_merge($porPlantel,$porEstado));

        $usuarios = Usuario::whereIn('id', $ids)->get();

        $mensaje = $usuario->nombre.' '.$usuario->primer_apellido.' '.$usuario->segundo_apellido;

        $mensaje.= ($aprobacion) ? ' desea '.$accion.' un grupo.' : ' ha aprobado la '.$accion.' de un grupo.';
        Notification::send($usuarios, new SolicitudCrearGrupo($usuario, $grupo, $mensaje, true));

    }

    /**
     * Obtiene la lista de los alumnos irregulares inscritos en un grupo y
     * la materia en la que están inscritos.
     *
     * @param $id_grupo
     * @return Alumno $alumnosIrregulares
     */
    private function alumnosIrregularesEnGrupo($id_grupo){

        $alumnosIrregulares = Alumno::whereHas('materiasIrregulares', function($query) use ($id_grupo){
            $query->where('grupo_periodo_id', $id_grupo);
        })->with(['materiasIrregulares' => function($query) use ($id_grupo){
            $query->where('grupo_periodo_id', $id_grupo)->with('carreraUac.uac');
        },'usuario'])->get();

        return $alumnosIrregulares;
    }

}
