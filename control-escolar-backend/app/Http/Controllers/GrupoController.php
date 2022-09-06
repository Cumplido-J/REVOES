<?php

namespace App\Http\Controllers;

use App\Alumno;
use App\GrupoPeriodo;
use App\Periodo;
use App\PlantelCarrera;
use App\Usuario;
use App\Grupo;
use Carbon\Carbon;
use App\Notifications\SolicitudCrearGrupo;
use App\Http\Requests\StoreUpdateGrupoRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Traits\AuditoriaLogHelper;
use Sisec;

class GrupoController extends Controller
{
    use AuditoriaLogHelper;

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        if(!Sisec::validarAlcanceYPermiso($request->plantel_id, 'Buscar grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción en el plantel seleccionado.'], 403);

        $periodoActual = Sisec::periodoActual();

        $filtros = Grupo::whereHas('plantelCarrera', function($query) use ($request){
                $query->where('plantel_id', $request->plantel_id);
                /* Si se tiene el filtro carrera, se seleccionan sólo los grupos que existen para esa carrera y ese plantel
                 * en específico.
                 */
                if($request->carrera_id != null){
                    $query->where('carrera_id', $request->carrera_id);
                }
            })->with(['grupoPeriodos' => function($query) use ($periodoActual){
                    $query->where('periodo_id', $periodoActual->id)->where('status', '!=', 'inactivo');
                },'plantelCarrera.carrera','plantelCarrera.plantel'
            ]);

        //Si existe el filtro por semestre, se obtienen sólo los grupos de ese semestre.
        if($request->semestre != null){
            $filtros->where('semestre', $request->semestre);
        }

        //Se ejecuta el query con los filtros.
        $grupos = $filtros->where('status', 'activo')->get();

        return response()->json(['data' => ['grupos' => $grupos]], 200);
    }

    /**
     * Muestra los grupos que están pendientes de aprobación
     * de crear o actualizar datos.
     *
     * @return JsonResponse
     */
    public function gruposParaAprobacion(Request $request){

        if(!auth()->user()->hasPermissionTo('Aprobar grupos'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        if($request->plantel_id != null && !Sisec::validarAlcance($request->plantel_id))
            return response()->json(['message' => 'No tiene permisos para ver información de este plantel'], 403);

        $planteles = ($request->plantel_id != null) ? (array)$request->plantel_id : Sisec::plantelesUsuario();

        $creados = Grupo::where('accion', '!=', null)
            ->whereHas('plantelCarrera.plantel', function($query) use ($planteles){
                $query->whereIn('id', $planteles);
            })
            ->with('plantelCarrera.plantel', 'plantelCarrera.carrera');

        $editados = Grupo::where('accion', 'editar')
            ->where('id_original', null)
            ->whereHas('plantelCarrera.plantel', function($query) use ($planteles){
                $query->whereIn('id', $planteles);
            })
            ->with(['edicion' => function($query){
                $query->with('plantelCarrera.plantel','plantelCarrera.carrera');
            },'plantelCarrera.plantel', 'plantelCarrera.carrera']);

        if($request->semestre != null){
            $creados->where('semestre', $request->semestre);
            $editados->where('semestre', $request->semestre);
        }

        $creados = $creados->get();
        $editados = $editados->get();

        $creados = $creados->filter(function ($value, $key){
            if($value->accion == 'crear' || $value->accion == 'eliminar')
                return $value;
        });

        $grupos = $creados->merge($editados);

        $grupos->transform(function($item, $key){
           $item->url = '/aprobacion-grupos';
           return $item;
        });

        $periodo = $request->periodo_id ?? Sisec::periodoActual()->id;

        $periodosCreados = GrupoPeriodo::where('accion', '!=', 'editar')
            ->whereHas('plantelCarrera.plantel', function($query) use ($planteles){
                $query->whereIn('id', $planteles);
            })
            ->where('periodo_id', $periodo)
            ->with('plantelCarrera.plantel', 'plantelCarrera.carrera', 'periodo');

        $periodosEditados = GrupoPeriodo::where('accion', 'editar')
            ->where('id_original', null)
            ->where('periodo_id', $periodo)
            ->whereHas('plantelCarrera.plantel', function($query) use ($planteles){
                $query->whereIn('id', $planteles);
            })->with([
                'plantelCarrera.plantel',
                'plantelCarrera.carrera',
                'periodo',
                'edicion' => function($query){
                    $query->with('plantelCarrera.carrera', 'plantelCarrera.plantel');
            }]);

        if($request->semestre != null){
            $periodosCreados->where('semestre', $request->semestre);
            $periodosEditados->where('semestre', $request->semestre);
        }

        $periodosCreados = $periodosCreados->get();
        $periodosEditados = $periodosEditados->get();

        $gruposPeriodos = $periodosCreados->merge($periodosEditados);

        $gruposPeriodos->transform(function($item, $key){
           $item->url = '/aprobacion-grupos-periodos';
           return $item;
        });

        $grupos = array_merge($grupos->toArray(), $gruposPeriodos->toArray());

        return response()->json(['data' => $grupos], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        //PENDIENTE: Utilizar validator
        //PENDIENTE: Aprobación para crear grupos
//        $params = $request->validated();
        if(!Sisec::validarAlcanceYPermiso($request->plantel_id, 'Crear grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción en el plantel seleccionado.'], 403);

        $usuario = auth()->user();
        $params = $request->all();

        $plantelCarreraId = $this->getPlantelCarreraId($request->plantel_id, $request->carrera_id);

        if($plantelCarreraId == null){
            return response()->json(['message' => 'La carrera seleccionada no se imparte en el plantel seleccionado'], 400);
        }

        $params['plantel_carrera_id'] = $plantelCarreraId;
        $params['status'] = 'pendiente';
        $params['accion'] = 'crear';
        $params['created_at'] = Carbon::now();

        if($this->existeGrupo($params) != null){
            return response()->json(['message' => 'El grupo ya existe o se encuentra en aprobación'], 400);
        }
        DB::beginTransaction();
        try{
            $nuevoGrupo = Grupo::create($params);
            $paraLog = $nuevoGrupo;
            $nuevoGrupo = Grupo::with('plantelCarrera.carrera','plantelCarrera.plantel')
                ->where('id', $nuevoGrupo->id)->first();

            if(!$usuario->hasPermissionTo('Aprobar grupos')){
                $this->enviarNotificacion($usuario, $nuevoGrupo, 'crear', true);
                $this->auditoriaSave($paraLog);
                DB::commit();
                return response()->json(['message' => 'El grupo se ha enviado a aprobación.'], 200);
            }

            $nuevoGrupo->status = 'activo';
            $nuevoGrupo->accion = null;
            $nuevoGrupo->save();
            $this->auditoriaSave($paraLog);
            DB::commit();
            return response()->json(['data' => $nuevoGrupo, 'message' => 'Se ha creado el grupo'], 200);
        }catch(QueryException $e){
            DB::rollBack();
            return response()->json(['message' => 'Error al crear el grupo'], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id)
    {
        $grupo = Grupo::find($id);

        $grupo = Grupo::with([
                'plantelCarrera.plantel.municipio',
                'plantelCarrera.carrera.uac' => function($query) use ($grupo){
                    $query->where('uac.semestre', $grupo->semestre)
                        ->where('uac.optativa', 0)
                        ->where('tipo_uac_id', '!=', 4)
                        ->groupBy('id');
                }
            ])->where('id',$id)
            ->first();

        if($grupo != null && !Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Buscar grupo'))
            return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

        return response()->json(['data' => $grupo], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $usuario = auth()->user();

        $params = $request->all();

        $params['plantel_carrera_id'] = $this->getPlantelCarreraId($request->plantel_id, $request->carrera_id);

        if($params['plantel_carrera_id'] == null)
            return response()->json(['message' => 'La carrera seleccionada no se oferta en ese plantel.']);

        $grupo = Grupo::with('plantelCarrera')->find($id);
        $old = Grupo::with('plantelCarrera')->find($id);

        if($grupo == null){
            return response()->json(['message'=> 'El grupo no existe'], 404);
        }

        if($grupo->accion != null){
            return response()->json(['message' => 'El grupo ya se encuentra en espera de aprobación'], 400);
        }

        $existe = $this->existeGrupo($params);

        if($existe != null){
            if($existe->id == $id)
                return response()->json(['message' => 'Se ha actualizado el grupo'], 200);
            elseif($existe->id_original == null)
                return response()->json(['message' => 'No se puede modificar porque ya existe un grupo con esos datos.'], 400);
            else
                return response()->json(['message' => 'Ya existe un grupo con esos datos en espera de aprobación'], 400);
        }

        //PENDIENTE: Usar Validator
        DB::beginTransaction();
        try {
            /* Validar que el usuario tenga acceso tanto al plantel al que pertenece el grupo actualmente
            *  como al que lo quiere cambiar */
            if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Editar grupo')
                || !Sisec::validarAlcanceYPermiso($request->plantel_id, 'Editar grupo'))
                return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

            if(!$usuario->hasPermissionTo('Aprobar grupos')){
                $params['status'] = 'pendiente';
                $params['id_original'] = $id;
                $params['created_at'] = Carbon::now();
                $params['accion'] = 'editar';
                $grupo['accion'] = 'editar';
                $grupo->save();
                $this->auditoriaSave($grupo, $old);
                $grupo = Grupo::create($params);

                $this->enviarNotificacion($usuario, $grupo, 'actualizar', true);
                DB::commit();
                return response()->json(['message' => 'Se envió a aprobación'], 200);
            }

            $grupo->update($params);
            $this->auditoriaSave($grupo, $old);
            $grupo = Grupo::with('plantelCarrera.carrera')->where('id', $grupo->id)->first();
            DB::commit();
            return response()->json(['data' => $grupo, 'message' => 'Se ha actualizado el grupo'], 200);
        }catch(QueryException $e){
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar el grupo'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $usuario = auth()->user();

        DB::beginTransaction();
        try {
            $grupo = Grupo::with('plantelCarrera')->find($id);

            if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Eliminar grupo'))
                return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);

            if($grupo->accion != null){
                return response()->json(['message' => 'Este grupo ya tiene otra aprobación pendiente.'],400);
            }

            if(!$usuario->hasPermissionTo('Aprobar grupos')){
                $grupo->accion = 'eliminar';
                $grupo->save();
                $this->auditoriaSave($grupo);
                $this->enviarNotificacion($usuario, $grupo, 'eliminar', true);
                DB::commit();
                return response()->json(['message' => 'Se envió a aprobación'], 200);
            }

            $grupo->status = 'inactivo';
            $grupo->save();
            $this->auditoriaSave($grupo);
            DB::commit();
            return response()->json(['data' => $grupo, 'message' => 'Se ha eliminado el grupo'], 200);
        }catch(QueryException $e){
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar el grupo'], 400);
        }

    }

    /**
     * Aprueba o rechaza la creación o modificación de un grupo.
     *
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function aprobarRechazarGrupo(Request $request, $id){

        $usuario = auth()->user();

        if(!$usuario->hasPermissionTo('Aprobar grupos')){
            return response()->json(['message' => 'No autorizado'], 403);
        }

        try {
            $grupo = Grupo::withCount(['edicion', 'grupoPeriodos' => function ($query) {
                $query->where('status', 'activo');
            }])->with('edicion', 'plantelCarrera')->where('id', $id)->firstOrFail();

            if(!Sisec::validarAlcanceYPermiso($grupo->plantelCarrera->plantel_id, 'Aprobar grupos'))
                return response()->json(['message' => 'No tiene permisos para realizar esta acción.'], 403);
        }catch(ModelNotFoundException $e) {
            return response()->json(['message' => 'El grupo no existe'], 404);
        }

        $aprobar = $request->aprobar;

        if($grupo->accion == null)
            return response()->json(['message' => 'Este grupo no está pendiente de aprobación'], 400);

        if($grupo->accion == 'crear'){

//            if($grupo->created_at < Carbon::now()->subDays(14))
//                return response()->json(['message' => 'Ha pasado demasiado tiempo desde la solicitud de aprobación'], 400);

            if(!$aprobar){
                //$grupo->delete();
                $grupo->status = 'rechazado';
                $grupo->accion = null;
                $grupo->save();
                $mensaje = 'rechazado';
                $this->auditoriaManualSave("Rechazó la creación de un grupo", 'grupo', $grupo->id, 'aprobarRechazarGrupo', 'App\Grupo');

            }else{
                $grupo->status = 'activo';
                $grupo->accion = null;
                $grupo->save();
                $mensaje = 'aprobado';
                $this->auditoriaManualSave("Aprobó la creación de un grupo", 'grupo', $grupo->id, 'aprobarRechazarGrupo', 'App\Grupo');
            }

            return response()->json(['message' => 'Se ha '.$mensaje.' la creación del grupo'], 200);
        }elseif($grupo->accion == 'editar'){
            if($aprobar) {
                $edicion = $grupo->edicion;

                if(!$edicion){
                    return response()->json(['message' => 'Ha ocurrido un error al aprobar la edición del grupo o ya ha sido aprobado anteriormente, favor de rechazarla.'], 400);
                }

                $grupo->update([
                    'grupo' => $edicion->grupo,
                    'semestre' => $edicion->semestre,
                    'turno' => $edicion->turno,
                    'plantel_carrera_id' => $edicion->plantel_carrera_id,
                    'max_alumnos' => $edicion->max_alumnos
                ]);

                if($grupo->edicion != null)
                    $grupo->edicion->delete();
                $grupo->accion = null;
                $grupo->save();
                $this->auditoriaManualSave("Aprobó la edición de un grupo", 'grupo', $grupo->id, 'aprobarRechazarGrupo', 'App\Grupo');

                return response()->json(['message' => 'Se ha aprobado la modificación del grupo'], 200);
            }else{
                if($grupo->edicion != null)
                    $grupo->edicion->delete();
                $grupo->accion = null;
                $grupo->save();
                $this->auditoriaManualSave("Rechazó la edición de un grupo", 'grupo', $grupo->id, 'aprobarRechazarGrupo', 'App\Grupo');

                return response()->json(['message' => 'Se ha rechazado la modificación del grupo'], 200);
            }
        }elseif($grupo->accion == 'eliminar'){
            if($aprobar){
                $grupo->status = 'inactivo';
                $grupo->accion = null;
                $grupo->save();
                $this->auditoriaManualSave("Aprobó la eliminación de un grupo", 'grupo', $grupo->id, 'aprobarRechazarGrupo', 'App\Grupo');

                return response()->json(['message' => 'Se ha aprobado la eliminación del grupo'], 200);
            }else{
                $grupo->accion = null;
                $grupo->save();
                $this->auditoriaManualSave("Rechazó la eliminación de un grupo", 'grupo', $grupo->id, 'aprobarRechazarGrupo', 'App\Grupo');

                return response()->json(['message' => 'Se ha rechazado la eliminación del grupo'], 200);
            }
        }
    }

    /**
     * Verifica si existe un grupo con los datos provistos.
     *
     * @param $params
     * @return mixed
     */
    private function existeGrupo($params){

        $existe = Grupo::where('grupo', $params['grupo'])
            ->where('turno', $params['turno'])
            ->where('plantel_carrera_id', $params['plantel_carrera_id'])
            ->where('semestre', $params['semestre'])
            ->where('status', '!=' ,'inactivo')
            ->where('status', '!=', 'rechazado')
            ->first();

        return $existe;

    }

    /**
     * Obtiene el id del objeto plantelCarrera que se busca
     *
     * @param $plantel_id
     * @param $carrera_id
     * @return mixed
     */
    private function getPlantelCarreraId($plantel_id, $carrera_id){
        $plantelCarrera = PlantelCarrera::where('plantel_id', $plantel_id)
            ->where('carrera_id', $carrera_id)
            ->first();

        return ($plantelCarrera == null) ? $plantelCarrera : $plantelCarrera->id;
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

}
