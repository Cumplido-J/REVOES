<?php

namespace App\Http\Controllers;

use App\Alumno;
use App\Aspirante;
use App\Grupo;
use App\GrupoPeriodo;
use App\Periodo;
use App\PlantelCarrera;
use App\Plantel;
use App\Usuario;
use App\CalificacionUac;
use App\CalificacionCompetencia;
use App\CalificacionRevalidacion;
use App\CarreraUac;
use App\AlumnoGrupo;
use App\ExpedienteAlumno;
use App\Tutor;
use App\Traits\AuditoriaLogHelper;
use App\Traits\CalificacionesTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Sisec;
use HelperPermisoAlcance;

class AlumnoController extends Controller
{
    use AuditoriaLogHelper, CalificacionesTrait;

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        if(!Sisec::validarAlcance($request->plantel_id))
            return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);

        //El plantel es obligatorio
        $plantel = Plantel::find($request->plantel_id);

        if($plantel == null)
            return response()->json(['message' => 'El plantel no existe'], 404);

        $query = Alumno::with('usuario','carrera')->where('plantel_id', $request->plantel_id);

        //Por carrera
        if($request->carrera_id != null) {

            $plantelCarrera = PlantelCarrera::where('plantel_id', $request->plantel_id)
                ->where('carrera_id', $request->carrera_id)
                ->first();

            if ($plantelCarrera == null)
                return response()->json(['message' => 'No se imparte la carrera en el plantel seleccionado.'], 400);

            $query->where('carrera_id', $request->carrera_id);
        }

         //Por semestre
        if(isset($request->semestre)){
            if($request->semestre == 0) {
                $query->where('semestre', 1);
                $query->whereDoesntHave('grupos', function ($filter) {
                    $filter->where('periodo_id', Sisec::periodoActual()->id);
                });
            }else {
                $query->where('semestre', $request->semestre);
            }
        }

        //Por grupo
        if($request->grupo_periodo_id) {
            $query->whereHas('grupos', function ($query) use ($request) {
                $query->where('grupo_periodo_id', $request->grupo_periodo_id);
            });
        }

        //Sólo alumnos irregulares
        if($request->solo_irregulares && !$request->solo_regulares){
            $query->where('tipo_alumno', 'Irregular');
        }

        //Sólo alumnos regulares
        if($request->solo_regulares && !$request->solo_irregulares){
            $query->where('tipo_alumno', 'Regular');
        }

        //Si tiene que incluir el grupo al que está inscrito o en espera de inscripción
        if($request->inscripcion_grupo) {
            $periodoActual = Sisec::periodoActual();
            $query->with(['grupos' => function ($query) use ($periodoActual) {
                $query->where('periodo_id', $periodoActual->id);
            }, 'documentos']);
        }

        if($request->estatus_inscripcion != null){
            $query->where('estatus_inscripcion', $request->estatus_inscripcion);
        }

        $alumnos = $query->get();

        if($request->cadena != null){
            $buscar = Str::upper($request->cadena);
            //Filtrar por nombre, apellido, o curp
            $alumnos = $alumnos->filter(function($value, $key) use ($buscar){
                return Str::contains(Str::upper($value->usuario->primer_apellido), $buscar)
                    || Str::contains(Str::upper($value->usuario->segundo_apellido),$buscar)
                    || Str::contains(Str::upper($value->usuario->nombre),$buscar)
                    || Str::contains(Str::upper($value->usuario->username), $buscar)
                    || Str::contains(Str::upper($value->matricula), $buscar)
                    || Str::contains(Str::upper($value->matricula), $buscar)
                    || Str::contains(Str::upper($value->nombre_completo), $buscar);
            })->values();
        }

        return response()->json(['data' => $alumnos], 200);
    }

//    /**
//     * Display a listing of the resource.
//     *
//     * @param Request $request
//     * @return \Illuminate\Http\JsonResponse
//     */
//    public function index(Request $request)
//    {
//        $query = null;
//
//        if($request->plantel_id == null){
//            if(!auth()->user()->hasPermissionTo('Estatal'))
//                return response()->json(['message' => 'Es necesario seleccionar un plantel.'], 400);
//
//            $estado = $request->state_id;
//
//            $query = Alumno::whereHas('plantel.municipio.estado', function($query) use ($estado){
//                $query->where('estado_id', $estado);
//            });
//        }
//
//        if($request->plantel_id != null) {
//            if(!Sisec::validarAlcance($request->plantel_id))
//                return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);
//
//            $plantel = Plantel::find($request->plantel_id);
//
//            if ($plantel == null)
//                return response()->json(['message' => 'El plantel seleccionado no existe'], 404);
//
//            $query = Alumno::where('plantel_id', $request->plantel_id);
//        }
//
//        if($request->cadena != null){
//            $buscar = Str::upper($request->cadena);
//
//            $query->whereHas('usuario', function($query) use ($buscar){
//                $query->where('primer_apellido', 'like', "%{$buscar}%")
//                    ->orWhere('segundo_apellido', 'like', "%{$buscar}%")
//                    ->orWhere('nombre', 'like', "%{$buscar}%")
//                    ->orWhere('username', 'like', "%{$buscar}%");
//            })->orWhere('matricula', $buscar);
//
//            //Filtrar por nombre, apellido, o curp
//            /*$alumnos = $alumnos->filter(function($value, $key) use ($buscar){
//                return Str::contains(Str::upper($value->usuario->primer_apellido), $buscar)
//                    || Str::contains(Str::upper($value->usuario->segundo_apellido),$buscar)
//                    || Str::contains(Str::upper($value->usuario->nombre),$buscar)
//                    || Str::contains(Str::upper($value->usuario->username), $buscar)
//                    || Str::contains(Str::upper($value->matricula), $buscar);
//            })->values();*/
//        }
//
//        //Por carrera
//        if($request->carrera_id != null) {
//
//            $plantelCarrera = PlantelCarrera::where('plantel_id', $request->plantel_id)
//                ->where('carrera_id', $request->carrera_id)
//                ->first();
//
//            if ($plantelCarrera == null)
//                return response()->json(['message' => 'No se imparte la carrera en el plantel seleccionado.'], 400);
//
//            $query->where('carrera_id', $request->carrera_id);
//        }
//
//         //Por semestre
//        if($request->semestre != null){
//            $query->where('semestre',$request->semestre);
//        }
//
//        //Por grupo
//        if($request->grupo_periodo_id) {
//            $query->whereHas('grupos', function ($query) use ($request) {
//                $query->where('grupo_periodo_id', $request->grupo_periodo_id);
//            });
//        }
//
//        //Sólo alumnos irregulares
//        if($request->solo_irregulares && !$request->solo_regulares){
//            $query->where('tipo_alumno', 'Irregular');
//        }
//
//        //Sólo alumnos regulares
//        if($request->solo_regulares && !$request->solo_irregulares){
//            $query->where('tipo_alumno', 'Regular');
//        }
//
//        //Si tiene que incluir el grupo al que está inscrito o en espera de inscripción
//        if($request->inscripcion_grupo) {
//            $periodoActual = Sisec::periodoActual();
//            $query->with(['grupos' => function ($query) use ($periodoActual) {
//                $query->where('periodo_id', $periodoActual->id);
//            }, 'documentos']);
//        }
//
//        if($request->estatus_inscripcion != null){
//            $query->where('estatus_inscripcion', $request->estatus_inscripcion);
//        }
//
//        $alumnos = $query->with('usuario', 'carrera')->get();
//
//        return response()->json(['data' => $alumnos], 200);
//    }

    public function alumnosPorId(Request $request){
        $alumno = [];
        if($request->plantel_id != null){
            if(!Sisec::validarAlcance($request->plantel_id))
                return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);
            $alumno = Alumno::whereIn('usuario_id', $request->alumnos_id)
            ->with(['usuario','carrera', 'plantel', 'grupos' => function($query){
                $query->where('periodo_id', Sisec::periodoActual()->id);
            }])
            ->select('usuario_id', 'direccion', 'codigo_postal', 'matricula', 'carrera_id', 'plantel_id', 'semestre', 'turno', 'tipo_alumno')
            ->get();
        }else{
            $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
            $alumno = Alumno::whereIn('usuario_id', $request->alumnos_id)->whereIn('plantel_id', $planteles_alacance)
            ->with(['usuario','carrera', 'plantel', 'grupos' => function($query){
                $query->where('periodo_id', Sisec::periodoActual()->id);
            }])
            ->select('usuario_id', 'direccion', 'codigo_postal', 'matricula', 'carrera_id', 'plantel_id', 'semestre', 'turno', 'tipo_alumno')
            ->get();
        }
        return response()->json(['data' => $alumno], 200);

    }

    /**
     * Se obtienen los alumnos que están por egresar con las calificaciones finales
     * de sus módulos y submódulos ordenadas y filtradas.
     *
     * @param $plantelId
     * @return \Illuminate\Http\JsonResponse
     */
    public function alumnosPorEgresar($plantelId){

        if(!Sisec::validarAlcance($plantelId))
            return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);

        $plantel = Plantel::where('id', $plantelId)->with(['evaluacionesOrdinarias' => function($query){
            $query->where('parcial', 3)->where('periodo_id', Sisec::periodoActual()->id);
        }])->first();

        if(count($plantel->evaluacionesOrdinarias) < 1 || $plantel->evaluacionesOrdinarias[0]->fecha_final >= Carbon::now()->toDateString()){
            return response()->json(['message' => 'El período de evaluaciones aún no se ha cerrado para este plantel'], 400);
        }

        //Obtener los alumnos por egresar con las calificaciones de sus módulos y submódulos
        $alumnos = Alumno::where('plantel_id', $plantelId)
            ->where('estatus_inscripcion', 'Activo')
            ->where('semestre', 6)
            ->with(['calificacionUac' => function($query){
                $query->whereHas('carreraUac.uac', function($tipoUac){
                    $tipoUac->where('tipo_uac_id', 4)
                        ->orWhere('tipo_uac_id', 10)
                        ->orWhere('tipo_uac_id', 3);
                })->where('parcial', '>', 3)
                ->orderBy('parcial', 'desc')
                ->orderBy('periodo_id', 'desc');
            }, 'calificacionUac.carreraUac.uac', 'plantel', 'carrera','usuario'])
            ->get();

        //Agrupar por materia en caso de que haya más de una calificación para alguna.
        $alumnosFiltrados = $alumnos->map(function ($alumno, $key) {
            $alumno->modulos = $alumno->calificacionUac->groupBy('carreraUac.id')->values();
            $alumno->modulos = $alumno->modulos->sortBy(function($dato){
               return $dato->first()->carreraUac->uac->clave_uac;
            })->values();
            $alumno->unsetRelation('calificacionUac');
            return $alumno;
        });

        $this->alumnosIrregularesPorCreditos($alumnos);

        return response()->json(['data' => $alumnosFiltrados], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param string $curp
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($curp)
    {
        $periodoActual = Sisec::periodoActual();

        try {
            $alumno = Alumno::whereHas('usuario', function ($query) use ($curp) {
                $query->where('username', $curp);
            })
            ->with([
                'usuario',
                'documentos',
                'plantel.municipio.estado',
                'expediente.institucion',
                'expediente.estadoNacimiento',
                'expediente.municipioNacimiento',
                'tutores',
                'carrera'
            ])->with(['grupos' => function ($query) use ($periodoActual) {
                    $query->where('periodo_id', $periodoActual->id);
                }, 'materiasIrregulares' => function($query) use ($periodoActual){
                    $query->whereHas('grupo', function($query) use ($periodoActual){
                        $query->where('periodo_id', $periodoActual->id);
                    })->with('carreraUac.uac','grupo');
                }])
            ->firstOrFail();

            if(!Sisec::validarAlcance($alumno->plantel_id))
                return response()->json(['message' => 'No tiene permisos para consultar un alumno de otro plantel.'], 403);

            $reprobadas = $this->cantidadMateriasReprobadas($alumno->usuario_id);
            $alumno->cantidad_materias_reprobadas = $reprobadas;

            return response()->json(['data' => $alumno], 200);
        }catch(ModelNotFoundException $e) {
            return response()->json(['message' => 'No se encontró un alumno con ese CURP'], 404);
        }
    }

    public function showFoto($curp){
        $alumno = Alumno::whereHas('usuario', function ($query) use ($curp) {
            $query->where('username', $curp);
        })->first();

        if($alumno == null){
            return response()->json(['message' => 'El alumno no existe'], 404);
        }

        if($alumno->ruta_fotografia == null){
            return response()->json(['message' => 'El alumno no tiene foto asignada'], 404);
        }

        if(!Storage::exists($alumno->ruta_fotografia)){
            return response()->json(['message' => 'No se encuentra la fotografía'], 404);
        }

        return Storage::response($alumno->ruta_fotografia);
    }

    /**
     * Actualizar a un alumno cuando cambie el semestre, se añaden también
     * los documentos que entregó el alumno o se actualizan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $alumno = Alumno::find($id);

        if($alumno == null){
            return response()->json(['message' => 'El alumno no existe'], 404);
        }

        if(!Sisec::validarAlcance($request->plantel_id))
                return response()->json(['message' => 'No tiene permisos para modificar los datos de un alumno de otro plantel.'], 403);

        $usuario = Usuario::find($id);

        //Datos del alumno
        $paramsAlumno = $request->only(['semestre', 'plantel_id', 'carrera_id', 'numero_contacto', 'numero_movil',
            'direccion', 'codigo_postal', 'cambio_subsistema', 'cambio_carrera', 'estatus', 'tipo_alumno',
            'tipo_trayectoria', 'permitir_inscripcion', 'estatus_inscripcion', 'periodo_inicio', 'periodo_termino', 'generacion',
            'matricula', 'genero']);
        $paramsUsuario = $request->only(['nombre', 'primer_apellido', 'segundo_apellido', 'email']);
        if($request->has('curp')){
            $paramsUsuario['username'] = $request->curp;
        }
        $carrera = $alumno->carrera_id;

        //Validar que no se repita matrícula
        if($request->has('matricula') && Alumno::where('matricula', $request->matricula)->where('usuario_id', '!=', $id)->first() != null){
            return response()->json(['message' => 'Ya existe un alumno con esa matricula, favor de verificarla e intentar de nuevo'], 400);
        }else if($request->has('matricula') && strlen($request->matricula) > 19){
            return response()->json(['message' => 'La matrícula debe tener menos de 20 dígitos.'], 400);
        }

        //Validar que no se repita curp
        if(Usuario::where('username', $request->curp)->where('id', '!=', $id)->first() != null){
            return response()->json(['message' => 'Ya existe un alumno o usuario con ese curp, favor de verificarlo e intentar de nuevo'], 400);
        }

        $curpRegex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/';

        if(($alumno->expediente != null && $alumno->expediente->pais_nacimiento == 'Mexico') || $request->pais_nacimiento == 'Mexico') {
            try {
                $this->validate($request,
                    ['curp' => ['regex:' . $curpRegex, 'size:18']]);
            } catch (ValidationException $e) {
                return response()->json(['message' => 'El formato del CURP es incorrecto. Favor de verificarlo'], 400);
            }
        }else{
            $curpRegex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/';
            try {
                $this->validate($request,
                    ['curp' => ['regex:' . $curpRegex, 'min:10']]);
            } catch (ValidationException $e) {
                return response()->json(['message' => 'El formato del CURP es incorrecto. Favor de verificarlo'], 400);
            }
        }

        DB::beginTransaction();
        try {
            $old = Alumno::find($alumno->usuario_id);

            $mensaje = "";

            $cambioCorrecto = true;

            //Verificar si hubo un cambio de plantel o de semestre
            if($alumno->plantel_id != $paramsAlumno['plantel_id']){
                $cambioCorrecto = $this->cambioDePlantel($alumno, $paramsAlumno);
            }else if(isset($paramsAlumno['semestre']) && $alumno->semestre != $paramsAlumno['semestre']){
                $cambioCorrecto = $this->cambioDeSemestre($alumno, $paramsAlumno);
            }

            if(!$cambioCorrecto){
                return response()->json(['message' => 'Se detectó un cambio de plantel o semestre, sin embargo esto no es posible ya que el alumno ya tiene calificaciones asignadas en el grupo actual.'], 400);
            }

            //Asignar o quitar fotografia
            if($request->hasFile('fotografia')) {
                $paramsAlumno['ruta_fotografia'] = $this->asignarFotografia($request, $alumno);
            }else if($request->has('fotografia') && $request->fotografia == null){
                if($alumno->ruta_fotografia != null && Storage::exists($alumno->ruta_fotografia)){
                    Storage::delete($alumno->ruta_fotografia);
                }
                $paramsAlumno['ruta_fotografia'] = null;
            }

            $alumno->update($paramsAlumno);
            $usuario->update($paramsUsuario);

            $alumno->documentos()->sync($request->documentos);

            $this->actualizarTutores($request, $alumno);
            $this->crearExpediente($request, $alumno);
            $this->auditoriaSave($alumno, $old);

            $alumno = Alumno::with('usuario')->where('usuario_id', $id)->first();

            DB::commit();
            return response()->json(['message' => 'Se ha actualizado el alumno. '.$mensaje, 'data' => $alumno], 200);
        }catch(QueryException $e){
            DB::rollBack();
            return response()->json(['message' => 'Algo salió mal, intente de nuevo'], 400);
        }

    }

    /**
     * Se sincronizan (añaden o quitan) los documentos que ha entregado el alumno en control escolar.
     * @param Request $request
     * @param $id_alumno
     * @return \Illuminate\Http\JsonResponse
     */
    public function sincronizarDocumentos(Request $request, $id_alumno){

        $alumno = Alumno::find($id_alumno);

        if($alumno == null)
            return response()->json(['message' => 'El alumno no existe.'], 404);

        if(!Sisec::validarAlcance($request->plantel_id))
                return response()->json(['message' => 'No tiene permisos para modificar los datos de un alumno de otro plantel.'], 403);

        $alumno->documentos()->sync($request->documentos);

        return response()->json(['message' => 'Documentos asignados correctamente', 'data' => $alumno->documentos()->get()], 200);
    }

    public function destroy($id){

        if(!auth()->user()->hasPermissionTo('Eliminar alumnos')){
            return response()->json(['message' => 'No tiene permiso para realizar esta acción'], 401);
        }

        //Checar que el alumno no tenga calificaciones asignadas de control escolar
        if(CalificacionUac::where('alumno_id', $id)->first() != null){
            return response()->json(['message' => 'No se puede eliminar el alumno ya que tiene calificaciones asignadas'], 400);
        }

        //Checar que el alumno no tenga calificaciones asignadas de certificados
        if((DB::table('alumno_carrera_competencia')->where('alumno_id', $id)->first() != null)){
            return response()->json(['message' => 'No se puede eliminar el alumno ya que tiene calificaciones asignadas para certificación'], 400);
        }

        //Checar que el alumno no haya completado sus datos para la encuesta
        if(DB::table('alumno_datos')->where('alumno_id', $id)->first() != null){
            return response()->json(['message' => 'No se puede eliminar el alumno.'], 400);
        }

        $alumno = Alumno::find($id);
        if($alumno == null)
            return response()->json(['message' => 'El alumno no existe'], 404);

        DB::beginTransaction();

        try {
            $alumno->grupos()->detach();
            $alumno->expediente()->delete();
            $alumno->tutores()->delete();
            $alumno->documentos()->detach();
            $alumno->materiasIrregulares()->delete();
            $alumno->bitacoraEvaluacion()->delete();
            $alumno->delete();

            Usuario::find($id)->delete();

            DB::commit();
            return response()->json(['message' => 'Se ha eliminado el alumno.'], 200);
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'No se ha podido eliminar al alumno, contacte a soporte.'], 400);
        }

    }

    /**
     * Dar de baja a un alumno, se elimina del grupo en el que se encuentra inscrito actualmente
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function darDeBaja($id)
    {
        $periodoActual = Sisec::periodoActual();

        $alumno = Alumno::with(['grupos' => function($query) use ($periodoActual){
            $query->where('periodo_id', $periodoActual->id);
        }])->where('usuario_id', $id)->first();

        if($alumno == null)
            return response()->json(['message' => 'El alumno no existe'], 404);

        if(!Sisec::validarAlcance($alumno->plantel_id))
            return response()->json(['message' => 'No tiene permisos para modificar los datos de un alumno de otro plantel.'], 403);

        if($alumno->estatus_inscripcion == 'baja')
            return response()->json(['message' => 'El alumno ya está dado de baja.'], 400);

        DB::beginTransaction();

        try{
            //Si el alumno está inscrito en un grupo actualmente, darlo de baja
            if(count($alumno->grupos) >0) {
                $grupoAlumno = $alumno->grupos[0];
                $grupoAlumno->alumnos()->detach($id);
            }

            $alumno->estatus_inscripcion = 'Baja';
            $alumno->save();

            $this->auditoriaSave($alumno);

            DB::commit();

        }catch (\Throwable $e){
            DB::rollBack();
            return response()->json(['message' => 'No se ha podido dar de baja al alumno'], 200);
        }

        return response()->json(['message' => 'Se ha dado de baja al alumno'], 200);
    }

    /**
     * Registrar alumnos de nuevo ingreso, reingreso, cambio de subsistema,
     * cambio de carrera, etc.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registrarAlumno(Request $request)
    {

        if (!Sisec::validarAlcance($request->plantel_id))
            return response()->json(['message' => 'No tiene permisos para registrar un alumno en el plantel seleccionado.'], 403);

        $documentos = $request->documentos;
        $tipoInscripcion = $request->tipo_inscripcion;
        $alumno = null;

        $params = $request->all();
        $curp = $request->curp;

        //TODO: Validar que se genere el CURP para extranjeros
        //Generar CURP temporal para alumnos extranjeros
        if(!$curp || $curp == ""){
            return response()->json(['message' => 'Favor de asignar un CURP al alumno'], 400);
        }else if ($params['pais_nacimiento'] != 'Mexico') {
            if(strlen($request->curp) < 10){
                return response()->json(['message' => 'La CURP debe tener al menos 10 caracteres.'], 400);
            }
            $curpRegex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/';

            try {
                $this->validate($request, ['curp' => ['regex:'.$curpRegex, 'min: 10']]);
            }catch (ValidationException $e){
                return response()->json(['message' => 'El formato del CURP es incorrecto. Favor de verificarlo'], 400);
            }
        } else {
            $curpRegex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/';

            try {
                $this->validate($request, ['curp' => ['regex:'.$curpRegex, 'size:18']]);
            }catch (ValidationException $e){
                return response()->json(['message' => 'El formato del CURP es incorrecto. Favor de verificarlo'], 400);
            }
        }

        DB::beginTransaction();

        try {
            $usuario = Usuario::create([
                'nombre' => $request->nombre,
                'primer_apellido' => $request->primer_apellido,
                'segundo_apellido' => $request->segundo_apellido,
                'fecha_insert' => Carbon::now(),
                'password' => bcrypt(Str::random(8)),
                'email' => $request->email,
                'username' => Str::upper($curp)
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'No se ha podido registrar el alumno, es posible que ya exista uno con ese CURP'
            ], 400);
        }

        $usuario->assignRole('ROLE_ALUMNO');
        DB::table('usuario_rol')->insert(['usuario_id' => $usuario->id, 'rol_id' => 3]);

        $params['usuario_id'] = $usuario->id;
        $params['estatus_inscripcion'] = 'Activo';

        if (isset($params['generacion']) && $params['generacion'] == null) {
            $anioIngreso = $params['anio_ingreso'];
            $anioEgreso = (int)$anioIngreso + 3;
            $params['generacion'] = $anioIngreso . '-' . $anioEgreso;
        }

        $plantelCarrera = PlantelCarrera::where('plantel_id', $params['plantel_id'])
            ->where('carrera_id', $params['carrera_id'])
            ->first();

        if ($plantelCarrera != null)
            $params['plantel_carrera_id'] = $plantelCarrera->id;

        if ($params['matricula'] == null){
            $params['matricula'] = $this->generarMatricula($params);
            if ($params['matricula'] == null){
                DB::rollBack();
                return response()->json(['message' => 'La matrícula ya ha sido asignada anteriormente.'], 400);
            }
        }else{
            $mensaje = "";
            if(!$this->validarMatricula($params, $mensaje)){
                DB::rollBack();
                return response()->json(['message' => $mensaje], 400);
            }
        }

        try {
            $alumno = Alumno::create($params);
            //Esto se hace para que se pueda guardar el id del alumno en el log.
            $alumno->usuario_id = $usuario->id;

            $tutores = json_decode($request->tutores);
            if($tutores != null){
                foreach ($tutores as $tutor){
                    Tutor::create([
                        'alumno_id' => $alumno->usuario_id,
                        'nombre' => $tutor->nombre,
                        'primer_apellido' => $tutor->primer_apellido,
                        'segundo_apellido' => $tutor->segundo_apellido,
                        'numero_telefono' => $tutor->numero_telefono
                    ]);
                }
            }

            //Asignar datos de expediente a alumno
            $this->crearExpediente($request, $alumno);
            $this->auditoriaSave($alumno);

            $aspirante = Aspirante::where('curp', $usuario->username)->where('deleted_at', null)->first();
            if($aspirante != null)
                $aspirante->forceDelete();
        }catch(QueryException $e){
            DB::rollBack();
            return response()->json(['message' => 'No se ha podido registrar el alumno, verifique los campos y vuelva a intentarlo.'], 400);
        }

        $usuario->update(['password' => bcrypt($alumno->matricula)]);
        $alumno = Alumno::find($usuario->id);

        try {
            //Si el alumno está inscribiéndose de un cambio de subsistema, se registran manualmente sus calificaciones
            if ($tipoInscripcion == 'Cambio subsistema') {
                $alumno->tipo_trayectoria = 'Transito';
                $alumno->cambio_subsistema = 1;

                if ($request->calificaciones != null)
                    $this->calificacionesCambioSubsistema($request->calificaciones, $usuario->id);
                /*else
                    $alumno->estatus = 'Información no capturada';*/

            //Si no, se capturan con las materias que ha cursado.
            } else if ($tipoInscripcion == 'Cambio carrera' || $alumno->semestre > 1) {
                $alumno->cambio_carrera = 1;

                if ($request->calificaciones_uac != null || $request->calificaciones_competencias != null) {
                    $this->calificacionesNuevoAlumno($request->calificaciones_uac, $usuario->id);
                } /*else
                    $alumno->estatus = 'Información no capturada';*/
            }
        }catch(\Throwable $e){
            DB::rollBack();
            return response()->json(['message' => 'No se ha podido registrar al alumno, verifique la información e intente de nuevo.'], 400);
        }

        //Asignar fotografía del alumno
        if($request->hasFile('fotografia')) {
            $alumno->ruta_fotografia = $this->asignarFotografia($request, $alumno);
        }else if($request->has('fotografia') && $request->fotografia == null){
            if($alumno->ruta_fotografia != null && Storage::exists($alumno->ruta_fotografia)){
                Storage::delete($alumno->ruta_fotografia);
            }
            $alumno->ruta_fotografia = null;
        }

        $alumno->save();
        $alumno->documentos()->sync($documentos);

        DB::commit();
        return response()->json(['message' => 'Se ha registrado correctamente el alumno', 'data' => $alumno], 200);

    }

    /**
     * Cambiar de grupo a un alumno inscrito. Se da de baja del grupo actual y se inscribe en el nuevo.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function cambiarGrupo(Request $request){

        $alumno = Alumno::with(['grupos' => function ($query) {
            $query->where('periodo_id', Sisec::periodoActual()->id);
        }])->find($request->alumno_id);

        /*if($alumno == null)
            return response()->json(['message' => 'El alumno no existe'], 404);*/

        $grupoPeriodo = GrupoPeriodo::with('plantelCarrera')->find($request->grupo_periodo_id);

        if($grupoPeriodo == null)
            return response()->json(['message' => 'El grupo no existe'], 404);

        if($grupoPeriodo->plantelCarrera->plantel_id != $alumno->plantel_id)
            return response()->json(['message' => 'El alumno no pertenece al plantel del grupo'], 400);

        if($grupoPeriodo->plantelCarrera->carrera_id != $alumno->carrera->id)
            return response()->json(['message' => 'El alumno no pertenece a la carrera del grupo'], 400);

        DB::beginTransaction();

        try {
            $old = null;
            if (count($alumno->grupos) > 0) {
                $old = $alumno->grupos->first();
                $alumno->grupos->first()->alumnos()->detach($alumno->usuario_id);
            }

            $cambio = AlumnoGrupo::insertGetId([
                'alumno_id' => $alumno->usuario_id,
                'grupo_periodo_id' => $grupoPeriodo->id,
                'status' => 'Inscrito'
            ]);

        }catch(Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'Algo salió mal, intente de nuevo más tarde'], 400);
        }

        $old_id = ($old != null) ? $old->id : null;
        $this->auditoriaManualSave(
            "Cambió a un alumno de grupo. (alumno_id={$alumno->usuario_id}, grupo_periodo_id_nuevo={$grupoPeriodo->id}, grupo_periodo_id_anterior={$old_id})",
            'alumno_grupo',
            $cambio,
            'cambiarGrupo',
            'App\AlumnoGrupo'
        );
        DB::commit();
        return response()->json(['message' => 'Se ha cambiado de grupo al alumno'], 200);

    }

    private function validarMatricula($params, &$mensaje){
        $primerosDosDigitos = substr($params['matricula'], 0, 2);
        $anioActual = substr(Carbon::now()->year, 2, 2);
        $anioIngreso = substr($params['anio_ingreso'], 2, 2);
        $existeMatricula = Alumno::where('matricula', $params['matricula'])->first();

        if($existeMatricula != null) {
            $mensaje = 'Ya existe un alumno con la matrícula ingresada';
        }else if(!preg_match("/^[0-9]{2}$/", $primerosDosDigitos) || $primerosDosDigitos > $anioActual) {
            $mensaje = 'La matrícula que ingresó no es válida';
        }else if( $anioIngreso != $primerosDosDigitos) {
            $mensaje = 'Los primeros dos dígitos de la matrícula no corresponden con el año de ingreso del alumno';
        }else if(strlen($params['matricula']) > 19){
            $mensaje = 'La matrícula debe tener menos de 20 dígitos';
        }else{
            return true;
        }

        return false;
    }

    /**
     * Genera la matrícula de un alumno que apenas se está registrando en el sistema.
     *
     * @param $params array
     * @return string
     */
    private function generarMatricula($params){

        $matricula = "";
        //Últimos 2 dígitos del año en que inició la prepa y 4, que es el tipo de administración.
        $matricula.=substr($params['anio_ingreso'], -2).'4';


        $plantel = Plantel::find($params['plantel_id']);
        $estado = $plantel->municipio()->first()->estado()->first()->id;

        if(strlen($estado) < 2){
            $estado = '0'.$estado;
        }

        //Dos dígitos pertenecientes al estado en el que se encuentra el plantel,
        //07 que es el tipo de plantel "Cecyte" y el número del plantel
        $matricula.=$estado.'07';

        //Si es cecyte
        if($plantel->tipo_plantel_id == 18)
            $matricula.= '0'.$plantel->numero;
        //Si es emsad
        else if($plantel->tipo_plantel_id == 19) {
            $matricula .= '5'.$plantel->numero;
        }

        //Obtener la última matrícula asignada para generar el número consecutivo.
        $ultimo = Alumno::where('matricula', 'like', $matricula.'%')
            ->whereRaw('LENGTH(matricula) = 14')
            ->orderBy('matricula', 'desc')
            ->first();


        if($ultimo == null)
            $matricula.='0001';
        else {
            $matricula = $ultimo->matricula;
            $matricula++;
        }

        if(Alumno::where('matricula', $matricula)->first() != null){
            return null;
        }

        return $matricula;

    }

    private function generarCurpExtranjero($params){

        $primerApellido = $this->quitarAcentos($params['primer_apellido']);
        if(isset($params['segundo_apellido'])) {
            $segundoApellido = $this->quitarAcentos($params['segundo_apellido']);
        }else{
            $segundoApellido = "";
        }
        $nombre = $this->quitarAcentos($params['nombre']);
        $abreviaciones = ['AS', 'BC','BS','CC','CL','CS','CH','DF','DG','GT','GR','HG','JC','MC','MN','MS','NT',
            'NL','OC','PL','QR','SP','SL','SR','TC','TS','TL','VZ','YN','ZS'];
        $plantel = Plantel::with('municipio.estado')->find($params['plantel_id']);
        $consonantes = "BCDFGHJKLMNÑPQRSTVWXYZ";

        try{
            //Primera letra del primer apellido o X si comienza con Ñ
            $curp=($primerApellido[0] == 'Ñ') ? 'X' : $primerApellido[0];
            //Primer vocal del primer apellido o X
            $curp.=$primerApellido[strcspn($primerApellido, "AEIOUÁÉÍÓÚ")] ?? 'X';
            //Primera letra del segundo apellido o X
            $curp.=$segundoApellido[0] ?? 'X';
            //Primera letra del nombre
            $curp.=$nombre[0];
            //Fecha del registro
            $curp.=Carbon::now()->format('ymd');
            //TODO: Sexo, pero no se pide ni hay forma de obtenerlo sin el curp
            $curp.='X';
            //Abreviación del estado que lo inscribe
            $curp.=$abreviaciones[$plantel->municipio->estado_id-1];
            //Primer consonante interna del primer apellido
            $curp.=$primerApellido[strcspn($primerApellido, $consonantes, 1)+1] ?? 'X';
            //Primer consonante interna del segundo apellido
            $curp.=$segundoApellido[strcspn($segundoApellido, $consonantes, 1)+1] ?? 'X';
            //Primer consonante interna del nombre
            $curp.=$nombre[strcspn($nombre, $consonantes, 1)+1] ?? 'X';

            $consecutivo = '0'.random_int(1,9);
            $i = 0;
            while(Usuario::where('username', $curp.$consecutivo)->first() != null && $i < 9){
                $consecutivo = '0'.random_int(1,9);
                $i++;
            }

            //No se pueden generar más números distintos
            if($i > 8){
                return null;
            }

            $curp.=$consecutivo;
            $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿñÑ';
            $modificadas = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYBSAAAAAAACEEEEIIIIDNOOOOOOUUUYYBYNN';
            $curp = utf8_decode($curp);
            $curp = strtr($curp, utf8_decode($originales), $modificadas);
            $curp = strtoupper(utf8_encode($curp));
            return $curp;
        }catch(\Exception $e){
            return null;
        }

    }

    private function quitarAcentos($palabra){

        $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿ';
        $modificadas = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYBSAAAAAAACEEEEIIIIDNOOOOOOUUUYYBY';
        $palabra = utf8_decode($palabra);
        $palabra = strtr($palabra, utf8_decode($originales), $modificadas);
        $palabra = strtoupper(utf8_encode($palabra));
        return $palabra;

    }

    /**
     * Se asignan las calificaciones de revalidación a un alumno que viene de cambio de susbsistema al momento de registrarlo.
     *
     * @param $calificaciones array
     * @param $alumno_id int
     */
    private function calificacionesCambioSubsistema($calificaciones, $alumno_id){

        $calificaciones = json_decode($calificaciones);

        foreach ($calificaciones as $calif){
            CalificacionRevalidacion::create([
                'alumno_id' => $alumno_id,
                'cct' => $calif->cct,
                'tipo_asignatura' => $calif->tipo_asignatura,
                'calificacion' => $calif->calificacion,
                'creditos' => $calif->creditos,
                'horas' => $calif->horas,
                'periodo_id' => $calif->periodo_id
            ]);
        }
    }

    /**
     * Se asignan calificaciones a un alumno que no es de nuevo ingreso o que viene de cambio de carrera
     * y que apenas se está registrando en el sistema.
     *
     * @param $calificaciones_uac array
     * @param $alumno_id int
     */
    private function calificacionesNuevoAlumno($calificaciones_uac,$alumno_id){

        if($calificaciones_uac != null) {
            $calificaciones_uac = json_decode($calificaciones_uac);
            foreach ($calificaciones_uac as $calificacion) {

                for($i = 0; $i < 5; $i++){
                    if(!array_key_exists($i, $calificacion->parciales) || $calificacion->parciales[$i] == null)
                        continue;

                    CalificacionUac::create([
                        'alumno_id' => $alumno_id,
                        'carrera_uac_id' => $calificacion->carrera_uac_id,
                        'calificacion' => $calificacion->parciales[$i],
                        'periodo_id' => $calificacion->periodo_id,
                        'plantel_id' => $calificacion->plantel_id,
                        'parcial' => $i+1
                    ]);
                }
            }
        }
    }

    private function alumnosIrregularesPorCreditos(&$alumnos){

        foreach ($alumnos as $alumno){
            if($this->esAlumnoPorEgresarIrregular($alumno)){
                $alumno->tipo_alumno = 'Irregular';
            }
        }

    }

    /**
     * Saber si un alumno potencial a egresar no cumple con la totalidad de los créditos necesaria.
     *
     * @param $alumno
     * @return bool
     */
    private function esAlumnoPorEgresarIrregular($alumno){

        $calificaciones = $this->calificacionesHistorial($alumno->usuario_id);
        $calificacionesTransito = $this->calificacionesCreditosTransito($alumno->usuario_id);

        $creditos = $this->promedioGeneralCreditos($calificaciones, $calificacionesTransito, null)['creditos'];

        return ($creditos < $alumno->carrera->total_creditos) ? true : false;
    }

     /**
     * obtener alumnos candidatos buscados por grupo y carrera_uac para creacion de recursamiento intersemestral y semestral.
     *
     * @param string $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByRecursamiento(Request $request)
    {
        try {
            /* validar tipo de recursamiento */
            if($request->has("tipo_recursamiento")){
                $tipos_permitidos = ["semestral", "intersemestral"];
                if(!in_array($request->tipo_recursamiento, $tipos_permitidos)){
                    return response()->json(['message' => 'Tipo de recursamiento no encontrado'], 400);
                }
            }else{
                return response()->json(['message' => 'Es necesario el tipo de recursamiento'], 400);
            }
            $carrera_uac_id = $request->carrera_uac_id;
            $grupo_periodo_id = $request->grupo_periodo_id;
            $periodo_id = $request->periodo_id;
            $input = $request->input;
            $plantel_id = $request->plantel_id;
            $alumnos = [];
            $tipo_recursamiento = $request->tipo_recursamiento;
            /* semestral */
            if($tipo_recursamiento == "semestral"){
                if($grupo_periodo_id){
                    $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
                    $grupo = $grupo_periodo->grupo;
                    $semestre = $grupo_periodo->semestre;
                    $turno = $grupo_periodo->turno;
                    $alumnos = Alumno::whereHas('grupos', function ($query) use ($grupo, $semestre, $turno){
                        $query->where([
                            ['grupo', $grupo],
                            ['semestre', $semestre],
                            ['turno', $turno]
                        ]);
                    })->whereHas('calificacionUac', function ($query) use($carrera_uac_id, $periodo_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            ['periodo_id', $periodo_id],
                            ['calificacion', '<' , 6]
                        ]);
                    })->where('plantel_id', $plantel_id)->with(['usuario', 'carrera', 'calificacionUac.periodo', 'calificacionUac.carreraUac.uac', 'calificacionUac' => function ($query) use($carrera_uac_id, $periodo_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            ['periodo_id', $periodo_id],
                            ['calificacion', '<' , 6]
                        ]);
                    }])->get();
                }else if($input){
                    if(!Sisec::validarAlcance($request->plantel_id))
                    return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);
                    if(!$request->has("carrera_id")){
                        return response()->json(['data' => []], 200);
                    }
                    $carrera_id = $request->carrera_id;
                    /* identificar carrera uac con relacion a carrera obtenida y uac */
                    $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
                    $carrera_uac = CarreraUac::where([
                        ['carrera_id', $carrera_id],
                        ['uac_id', $carrera_uac->uac_id]
                    ])->first();
                    if(!$carrera_uac){
                        $carrera_uac = $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
                    }
                    $carrera_uac_id = $carrera_uac->id;
                    $alumnos = Alumno::whereHas('calificacionUac', function ($query) use($carrera_uac_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            ['calificacion', '<' , 6]
                        ]);
                    })->where('matricula', $input)->orWhereHas('usuario', function ($query) use ($input){
                        $query->where('nombre' , $input)
                        ->orWhere('primer_apellido' , $input)
                        ->orWhere('segundo_apellido' , $input)
                        ->orWhere('username' , $input)
                        ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                        ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                    })->where([
                        ['plantel_id', $plantel_id],
                        ['carrera_id', $carrera_id]
                    ])
                    ->with(['usuario', 'carrera', 'calificacionUac.periodo', 'calificacionUac.carreraUac.uac', 'calificacionUac' => function ($query) use($carrera_uac_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            //['periodo_id', $periodo_id],
                            ['calificacion', '<' , 6]
                        ]);
                    }])->get();
                    if(count($alumnos) < 1){
                        /* buscar alumno con materia inexistente */
                        $alumnos = Alumno::where('matricula', $input)->orWhereHas('usuario', function ($query) use ($input){
                            $query->where('nombre' , $input)
                            ->orWhere('primer_apellido' , $input)
                            ->orWhere('segundo_apellido' , $input)
                            ->orWhere('username' , $input)
                            ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                            ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                        })->where([
                            ['plantel_id', $plantel_id],
                            ['carrera_id', $carrera_id]
                        ])
                        ->with(['usuario', 'carrera', 'calificacionUac.periodo', 'calificacionUac.carreraUac.uac', 'calificacionUac' => function ($query) use($carrera_uac_id){
                            $query->where([
                                ['carrera_uac_id', $carrera_uac_id],
                                ['parcial', '>=', 4],
                                //['periodo_id', $periodo_id],
                                ['calificacion', '<' , 6]
                            ]);
                        }])->get();
                    }
                }
            }
            /* intersemestral */
            if($tipo_recursamiento == "intersemestral"){
                if($grupo_periodo_id){
                    $alumnos = Alumno::whereHas('grupos', function ($query) use ($grupo_periodo_id){
                        $query->where('grupo_periodo_id', $grupo_periodo_id);
                    })->whereHas('calificacionUac', function ($query) use($carrera_uac_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            ['calificacion', '<' , 6]
                        ]);
                    })->where('plantel_id', $plantel_id)->with(['usuario', 'carrera'])->get();
                }else if($input){
                    if(!Sisec::validarAlcance($request->plantel_id))
                    return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);
                    $carrera_id = $request->carrera_id;
                    /* identificar carrera uac con relacion a carrera obtenida y uac */
                    $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
                    $carrera_uac = CarreraUac::where([
                        ['carrera_id', $carrera_id],
                        ['uac_id', $carrera_uac->uac_id]
                    ])->first();
                    if(!$carrera_uac){
                        $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
                    }
                    $carrera_uac_id = $carrera_uac->id;
                    $alumnos = Alumno::whereHas('calificacionUac', function ($query) use($carrera_uac_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            ['calificacion', '<' , 6]
                        ]);
                    })->where('matricula', $input)->orWhereHas('usuario', function ($query) use ($input){
                        $query->where('nombre' , $input)
                        ->orWhere('primer_apellido' , $input)
                        ->orWhere('segundo_apellido' , $input)
                        ->orWhere('username' , $input)
                        ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                        ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                    })->where('plantel_id', $plantel_id)
                    ->with(['usuario', 'carrera', 'calificacionUac.periodo', 'calificacionUac.carreraUac.uac', 'calificacionUac' => function ($query) use($carrera_uac_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            //['periodo_id', $periodo_id],
                            ['calificacion', '<' , 6]
                        ]);
                    }])->get();
                }
            }
            /* comprobar si el alumno debe la uac */
            $alumno_evaluado = [];
            foreach($alumnos as $alumno){
                $ultima_calificacion = CalificacionUac::where([
                    ['alumno_id', $alumno->usuario_id],
                    ['carrera_uac_id', $carrera_uac_id],
                    ['parcial', '>=', 4]
                ])->orderBy('id', 'DESC')->first();
                if($ultima_calificacion){
                    if($ultima_calificacion->calificacion < 6){
                        array_push($alumno_evaluado, $alumno);
                    }
                }else if(!$ultima_calificacion){
                    array_push($alumno_evaluado, $alumno);
                }
            }
            return response()->json(['data' => $alumno_evaluado], 200);
        } catch(ModelNotFoundException $e) {
            return response()->json(['message' => 'No fue posible encontrar al alumno, o no cumple con los requisitos'], 400);
        } catch(QueryException $e) {
            return response()->json(['message' => 'No fue posible encontrar al alumno, o no cumple con los requisitos'], 400);;
        }
    }

    /**
     * obtener alumnos candidatos buscados por grupo y carrera_uac para creacion de extraordinarios.
     *
     * @param string $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByExtraordinario(Request $request)
    {
        try {
            $carrera_uac_id = $request->carrera_uac_id;
            $grupo_periodo_id = $request->grupo_periodo_id;
            $periodo_id = $request->periodo_id;
            $input = $request->input;
            $plantel_id = $request->plantel_id;
            $alumnos = [];
            if($grupo_periodo_id){
                $grupo_periodo = GrupoPeriodo::find($grupo_periodo_id);
                $grupo = $grupo_periodo->grupo;
                $semestre = $grupo_periodo->semestre;
                $turno = $grupo_periodo->turno;
                $alumnos = Alumno::whereHas('grupos', function ($query) use ($grupo, $semestre, $turno){
                    $query->where([
                        ['grupo', $grupo],
                        ['semestre', $semestre],
                        ['turno', $turno]
                    ]);
                })->whereHas('calificacionUac', function ($query) use($carrera_uac_id, $grupo_periodo){
                    $query->where([
                        ['carrera_uac_id', $carrera_uac_id],
                        ['parcial', '>=', 4],
                        ['periodo_id', $grupo_periodo->periodo_id],
                        ['calificacion', '<' , 6]
                    ]);
                })->where('plantel_id', $plantel_id)->with(['usuario', 'carrera', 'calificacionUac.periodo', 'calificacionUac.carreraUac.uac', 'calificacionUac' => function ($query) use($carrera_uac_id, $grupo_periodo){
                    $query->where([
                        ['carrera_uac_id', $carrera_uac_id],
                        ['parcial', '>=', 4],
                        ['periodo_id', $grupo_periodo->periodo_id],
                        ['calificacion', '<' , 6]
                    ]);
                }])->get();
            }else if($input){
                if(!Sisec::validarAlcance($request->plantel_id))
                return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);
                if(!$request->has("carrera_id")){
                    return response()->json(['data' => []], 200);
                }
                $carrera_id = $request->carrera_id;
                /* identificar carrera uac con relacion a carrera obtenida y uac */
                $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
                $carrera_uac = CarreraUac::where([
                    ['carrera_id', $carrera_id],
                    ['uac_id', $carrera_uac->uac_id]
                ])->first();
                if(!$carrera_uac){
                    $carrera_uac = CarreraUac::findOrFail($carrera_uac_id);
                }
                $carrera_uac_id = $carrera_uac->id;
                $alumnos = Alumno::whereHas('calificacionUac', function ($query) use($carrera_uac_id){
                    $query->where([
                        ['carrera_uac_id', $carrera_uac_id],
                        ['parcial', '>=', 4],
                        ['calificacion', '<' , 6]
                    ]);
                })->where('matricula', $input)->orWhereHas('usuario', function ($query) use ($input){
                    $query->where('nombre' , $input)
                    ->orWhere('primer_apellido' , $input)
                    ->orWhere('segundo_apellido' , $input)
                    ->orWhere('username' , $input)
                    ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                    ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['carrera_id', $carrera_id]
                ])
                ->with(['usuario', 'carrera', 'calificacionUac.periodo', 'calificacionUac.carreraUac.uac', 'calificacionUac' => function ($query) use($carrera_uac_id){
                    $query->where([
                        ['carrera_uac_id', $carrera_uac_id],
                        ['parcial', '>=', 4],
                        //['periodo_id', $periodo_id],
                        ['calificacion', '<' , 6]
                    ]);
                }])->get();
                if(count($alumnos) < 1){
                    /* buscar alumno con materia inexistente */
                    $alumnos = Alumno::where('matricula', $input)->orWhereHas('usuario', function ($query) use ($input){
                        $query->where('nombre' , $input)
                        ->orWhere('primer_apellido' , $input)
                        ->orWhere('segundo_apellido' , $input)
                        ->orWhere('username' , $input)
                        ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                        ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                    })->where([
                        ['plantel_id', $plantel_id],
                        ['carrera_id', $carrera_id]
                    ])
                    ->with(['usuario', 'carrera', 'calificacionUac.periodo', 'calificacionUac.carreraUac.uac', 'calificacionUac' => function ($query) use($carrera_uac_id){
                        $query->where([
                            ['carrera_uac_id', $carrera_uac_id],
                            ['parcial', '>=', 4],
                            //['periodo_id', $periodo_id],
                            ['calificacion', '<' , 6]
                        ]);
                    }])->get();
                }
            }
            /* comprobar si el alumno debe la uac */
            $alumno_evaluado = [];
            foreach($alumnos as $alumno){
                $ultima_calificacion = CalificacionUac::where([
                    ['alumno_id', $alumno->usuario_id],
                    ['carrera_uac_id', $carrera_uac_id],
                    ['parcial', '>=', 4]
                ])->orderBy('id', 'DESC')->first();
                if($ultima_calificacion){
                    if($ultima_calificacion->calificacion < 6){
                        array_push($alumno_evaluado, $alumno);
                    }
                }else if(!$ultima_calificacion){
                    array_push($alumno_evaluado, $alumno);
                }
            }
            return response()->json(['data' => $alumno_evaluado], 200);
        } catch(ModelNotFoundException $e) {
            return response()->json(['message' => 'No fue posible encontrar al alumno, o no cumple con los requisitos'], 400);
        } catch(QueryException $e) {
            return response()->json(['message' => 'No fue posible encontrar al alumno, o no cumple con los requisitos'], 400);;
        }
    }

    private function cambioDePlantel($alumno, &$params){

        $grupoActual = GrupoPeriodo::where('periodo_id', Sisec::periodoActual()->id)
            ->whereHas('alumnos', function($query) use ($alumno){
                $query->where('alumno_id', $alumno->usuario_id)
                    ->where('status', 'Inscrito');
            })->first();

        if($grupoActual == null) {
            return true;
        }

        $calificaciones = $calificaciones = CalificacionUac::where('alumno_id', $alumno->usuario_id)
            ->where('periodo_id', $grupoActual->periodo_id)
            ->get();

        if($calificaciones->isNotEmpty()){
            $params['plantel_id'] = $alumno->plantel_id;
            $params['carrera_id'] = $alumno->carrera_id;
            $params['semestre'] = $alumno->semestre;
            return false;
        }else{
            $grupoActual->alumnos()->detach($alumno->usuario_id);
            $params['semestre'] = $alumno->semestre-1;
            return true;
        }
    }

    private function cambioDeSemestre($alumno, &$params){

        $grupoActual = GrupoPeriodo::where('periodo_id', Sisec::periodoActual()->id)
            ->whereHas('alumnos', function($query) use ($alumno){
                $query->where('alumno_id', $alumno->usuario_id)
                    ->where('status', 'Inscrito');
            })->first();

        if($grupoActual == null || $grupoActual->semestre == $params['semestre']){
            return true;
        }

        $calificaciones = $calificaciones = CalificacionUac::where('alumno_id', $alumno->usuario_id)
            ->where('periodo_id', $grupoActual->periodo_id)
            ->get();

        if($calificaciones->isNotEmpty()) {
            $params['semestre'] = $alumno->semestre;
            return false;
        }else{
            $grupoActual->alumnos()->detach($alumno->usuario_id);
            return true;
        }

    }

    private function crearExpediente(Request $request, $alumno){

        $paramsExpediente = $request->only(['nss', 'institucion_nss', 'tipo_sangre', 'fecha_nacimiento',
                'municipio_nacimiento_id', 'estado_nacimiento_id', 'codigo_postal_nacimiento', 'pais_nacimiento']);

        ExpedienteAlumno::updateOrCreate([
            'alumno_id' => $alumno->usuario_id
        ],[
            'nss' => $paramsExpediente['nss'] ?? null,
            'institucion_nss' => $paramsExpediente['institucion_nss'] ?? null,
            'tipo_sangre' => $paramsExpediente['tipo_sangre'] ?? null,
            'fecha_nacimiento' => $paramsExpediente['fecha_nacimiento'] ?? null,
            'estado_nacimiento_id' => $paramsExpediente['estado_nacimiento_id'] ?? null,
            'municipio_nacimiento_id' => $paramsExpediente['municipio_nacimiento_id'] ?? null,
            'codigo_postal_nacimiento' => $paramsExpediente['codigo_postal_nacimiento'] ?? null,
            'pais_nacimiento' => $paramsExpediente['pais_nacimiento'] ?? null,
        ]);

    }

    private function actualizarTutores(Request $request, $alumno){
        //Para saber qué tutores eliminar
        $borrar = Tutor::where('alumno_id', $alumno->usuario_id)->get()->pluck('id')->toArray();
        $tutores = json_decode($request->tutores);

        if($tutores != null){

            foreach ($tutores as $tutor){
                if($tutor->id != null) {
                    $modificacion = array_search($tutor->id, $borrar);
                    unset($borrar[$modificacion]);
                }

                Tutor::updateOrCreate([
                   'id' => $tutor->id
                ],[
                    'alumno_id' => $alumno->usuario_id,
                    'nombre' => $tutor->nombre,
                    'primer_apellido' => $tutor->primer_apellido,
                    'segundo_apellido' => $tutor->segundo_apellido,
                    'numero_telefono' => $tutor->numero_telefono
                ]);
            }

            Tutor::destroy($borrar);
        }
    }

    private function asignarFotografia(Request $request, $alumno){

        $ruta = null;

        try {

            $foto = $request->file('fotografia');
            $nombre = $alumno->matricula.pathinfo($foto, PATHINFO_EXTENSION);

            $clavePlantel = $alumno->plantel->cct;
            $estado = $alumno->plantel->municipio->estado->abreviatura;
            //Eliminar la foto si ya tiene una asignada
            if($alumno->ruta_fotografia != null && Storage::exists($alumno->ruta_fotografia)){
                Storage::delete($alumno->ruta_fotografia);
            }

            $ruta = "fotos-credenciales/{$estado}/{$clavePlantel}/";
            Storage::putFileAs($ruta, $foto, $nombre);
            $ruta.=$nombre;

        }catch (\Exception $e){
            return null;
        }

        return $ruta;

    }
}
