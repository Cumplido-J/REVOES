<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreDocenteRequest;
use App\Http\Requests\StoreDocenteBajaRequest;
use Illuminate\Support\Facades\DB;
use App\Docente;
use App\Usuario;
use App\UsuarioDocente;
use App\DocentePlantilla;
use App\DocumentoDocente;
use App\DocumentoHasDocente;
use App\Municipio;
use App\Plantel;
use App\Estado;
use ResponseJson;
use Carbon\Carbon;
use App\Traits\AuditoriaLogHelper;
use HelperPermisoAlcance;
use Sisec;

class DocenteController extends Controller
{
    use AuditoriaLogHelper;

    public function index(Request $request)
    {
      
        $docentes = Docente::with(
        'lugarNacimiento.estado',
        'lugarDireccion.estado',
        'docentePlantilla.plantel.municipio', 'docentePlantilla.plantel.tipoPlantel', 'docentePlantilla.plantel.opcionEducativa',
        'docentePlantilla.plantel.iems',
        'documentoHasDocente.documento'
        )->get();

        return ResponseJson::data($docentes, 200);
    }

    public function store(StoreDocenteRequest $request)
    {
        try {
            DB::beginTransaction();
            $docente = Docente::create([
                'nombre' => $request->nombre,
                'primer_apellido' => $request->primer_apellido,
                'segundo_apellido' => $request->segundo_apellido,
                'correo' => $request->correo,
                'correo_inst' => $request->correo_inst,
                'num_nomina' => $request->num_nomina,
                'rfc' => $request->rfc,
                'curp' => $request->curp,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'direccion' => $request->direccion,
                'cp' => $request->cp,
                'telefono' => $request->telefono,
                'fecha_ingreso' => Carbon::now(),
                'genero' => $request->genero,
                'tipo_sangre' => $request->tipo_sangre,
                'cat_municipio_direccion_id' => $request->ciudad_direccion,
                'cat_municipio_nacimiento_id' => $request->ciudad_nacimiento,
                'fecha_egreso' => $request->fecha_egreso,
                'maximo_grado_estudio' => $request->maximo_grado_estudio,
                'comentario' => $request->comentario,
                'cedula' => $request->cedula,
                'docente_estatus' => 1
            ]);
            /* documentacion */
            if(isset($request->documento_comprobatorio)){
                foreach($request->documento_comprobatorio as $obj) {
                    $documento = DocumentoDocente::where(
                        'nombre', $obj
                    )->first();
                    /* documentacion has docente */
                    DocumentoHasDocente::create([
                        'documentos_docente_id' => $documento->id,
                        'docente_id' => $docente->id
                    ]);
                   /*  $this->auditoriaSave("Create", $documento); */ /* adutoria log */
                }
            }
            /* creación de usuario para sistema */
            $usuario_test = Usuario::where('username', $request->curp)->first();
            if($usuario_test){
                $usuario_docente = UsuarioDocente::where('usuario_id', $usuario_test->id)->first();
                if(!$usuario_docente){
                    $usuario_docente = UsuarioDocente::create([
                        'usuario_id' => $usuario_test->id,
                        'docente_id' => $docente->id
                    ]);
                    /* permisos docente */
                    $permisos_docente = [
                        'Ver mis asignaciones',
                        'Cargar calificaciones docente',
                        'Ver rubricas evaluacion',
                        'Crear rubricas evaluacion',
                        'Editar rubricas evaluacion',
                        'Eliminar rubricas evaluacion',
                        'Cargar bitacora alumno',
                        'Cargar calificaciones recursamiento intersemestral',
                        'Ver detalles de asignatura recursamiento intersemestral',
                        'Ver detalles de mis asignaturas'
                    ];
                    foreach($permisos_docente as $permiso){
                        $asignar = $usuario_test->givePermissionTo($permiso);
                    }
                }
            }else{
                if(isset($request->rfc)){
                    $password = $request->rfc;
                }else{
                    $password = $request->curp;
                }
                $usuario = Usuario::create([
                    'fecha_insert' => Carbon::now(),
                    'username' => $docente->curp,
                    'nombre' => $docente->nombre,
                    'primer_apellido' => $docente->primer_apellido,
                    'segundo_apellido' => $docente->segundo_apellido,
                    'email' => $docente->email,
                    'password' => bcrypt($password)
                ]);
                $usuario_docente = UsuarioDocente::create([
                    'usuario_id' => $usuario->id,
                    'docente_id' => $docente->id
                ]);
                $usuario->assignRole('ROLE_DOCENTE');
                $this->auditoriaSave($usuario); /* adutoria log */
            }
            //rol docente
            $this->auditoriaSave($docente); /* adutoria log */
            DB::commit();
            return ResponseJson::msg('Docente creado con éxito', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear al docente', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear al docente', 400);
        } 
    }

    public function update(StoreDocenteRequest $request, $id)
    {
        try{
            DB::beginTransaction();
            $docente = Docente::findOrFail($id);
            if($docente->docente_estatus != 1 ){
                throw new ModelNotFoundException();
            }
            $old_docente = $docente;
            $docente = Docente::findOrFail($id);
            //comporbar curp para cambio de usuario
            if($docente->curp != $request->curp){
                //curp cambio y username
                /*$usuario_docente = UsuarioDocente::where('docente_id', $docente->id)->first();
                $usuario_old = Usuario::where('id', $usuario_docente->usuario_id)->first();
                $usuario = Usuario::where('id', $usuario_docente->usuario_id)->first();
                $usuario->update(['username' => $request->curp]);
                $this->auditoriaSave($usuario, $usuario_old);*/ /* adutoria log */
            }
            //cambios en nombre y correo
            //docente
            $docente->update([
                'nombre' => $request->nombre,
                'primer_apellido' => $request->primer_apellido,
                'segundo_apellido' => $request->segundo_apellido,
                'correo' => $request->correo,
                'correo_inst' => $request->correo_inst,
                'num_nomina' => $request->num_nomina,
                'rfc' => $request->rfc,
                'curp' => $request->curp,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'direccion' => $request->direccion,
                'cp' => $request->cp,
                'telefono' => $request->telefono,
                'fecha_ingreso' => $request->fecha_ingreso,
                'fecha_baja' => $request->fecha_baja,
                'fecha_reingreso' => $request->fecha_reingreso,
                'genero' => $request->genero,
                'tipo_sangre' => $request->tipo_sangre,
                'docente_estatus' => $docente->docente_estatus,
                'cat_municipio_direccion_id' => $request->ciudad_direccion,
                'cat_municipio_nacimiento_id' => $request->ciudad_nacimiento,
                'fecha_egreso' => $request->fecha_egreso,
                'maximo_grado_estudio' => $request->maximo_grado_estudio,
                'comentario' => $request->comentario,
                'cedula' => $request->cedula,
                'id' => $request->id
            ]);
             /* documentacion */
            /* eliminar vieja documentación */
            if(isset($request->documento_comprobatorio)){
                $documento_has_docente = DocumentoHasDocente::where(
                     'docente_id', $request->id
                    )->delete();
                foreach($request->documento_comprobatorio as $obj) {
                    $documento = DocumentoDocente::where(
                        'nombre', $obj
                    )->first();
                    /* documentacion has docente */
                    DocumentoHasDocente::create([
                        'documentos_docente_id' => $documento->id,
                        'docente_id' => $docente->id
                    ]);
                }
            }
            /* mofificación de usuario para sistema */
            $usuario_docente = UsuarioDocente::where('docente_id', $docente->id)->first();
            $usuario_old = Usuario::where('id', $usuario_docente->usuario_id)->first();
            $usuario = Usuario::where('id', $usuario_docente->usuario_id)->first();
            $usuario->update([
                'username' => $docente->curp,
                'password' => bcrypt($docente->rfc),
                'nombre' => $docente->nombre,
                'primer_apellido' => $docente->primer_apellido,
                'segundo_apellido' => $docente->segundo_apellido,
                'email' => $docente->email
            ]);
            $this->auditoriaSave($usuario, $usuario_old); /* adutoria log */
            $this->auditoriaSave($docente, $old_docente); /* adutoria log */
            DB::commit();
            return ResponseJson::msg('Datos del docente modificados correctamente', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            $details = ['El docente no se encuentra activo'];
            return ResponseJson::error('No fue posible modificar los datos del docente', 400, $details);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible modificar los datos del docente', 400);
        } 
    }

    public function show($id)
    {
        try {
            $docente = Docente::findOrFail($id);
            if($docente->docente_estatus == 0){
                throw new ModelNotFoundException();
            }
            $plantilla_estatus = 0;
            $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
            $permisos = HelperPermisoAlcance::getPermisos();
            $fecha_actual = Carbon::now()->toDateString();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual_id = $periodo_actual->id; //intval($periodo_actual->id) - 1
            if(in_array('Nacional', $permisos)){
                $docente = Docente::where('id', $id)
                ->with([
                    'lugarNacimiento.estado',
                    'lugarDireccion.estado',
                    'docentePlantilla' => function($query) use($plantilla_estatus) {
                        $query->where('plantilla_estatus', '>', $plantilla_estatus);
                    },
                    'docentePlantilla.tipoPlaza',
                    'docentePlantilla.plantel.municipio.estado', 'docentePlantilla.plantel.tipoPlantel', 'docentePlantilla.plantel.opcionEducativa',
                    'docentePlantilla.plantel.iems',
                    'docentePlantilla.plantel.plantelCarreras.carrera',
                    'docentePlantilla.docenteAsignatura' => function($query) use($plantilla_estatus){
                        $query->where('estatus', '>', $plantilla_estatus)->orderBy('periodo_id', 'DESC');
                    },
                    'docentePlantilla.docenteAsignatura.grupoPeriodo.grupo',
                    'docentePlantilla.docenteAsignatura.grupoPeriodo.periodo',
                    'docentePlantilla.docenteAsignatura.plantel',
                    'docentePlantilla.docenteAsignatura.carreraUac.uac' => function ($query){
                        $query->doesntHave('submodulos');
                    },
                    'docentePlantilla.docenteAsignatura.carreraUac.carrera',
                    'docentePlantilla.docenteAsignatura.periodo',
                    //recursamiento intersemestral con fecha activa
                    'docentePlantilla.asignaturaRecursamientoIntersemestral' => function ($query) use($fecha_actual, $periodo_actual_id){
                        $query->with([
                            'carreraUac',
                            'carreraUac.uac',
                            'carreraUac.carrera',
                            'periodo',
                            'grupoPeriodo',
                            'grupoRecursamientoIntersemestral.alumnoGrupoRecursamientoIntersemestral.alumno',
                            'plantel.recursamientoIntersemestrales'
                        ])->orderBy('periodo_id', 'DESC');
                    },
                    /* recursamiento semestral */
                    'docentePlantilla.grupoRecursamientoSemestral' => function ($query) use($fecha_actual, $periodo_actual_id){
                        $query->with([
                            'carreraUac',
                            'carreraUac.uac',
                            'carreraUac.carrera',
                            'periodo',
                            'grupoPeriodo',
                            'alumnoGrupoRecursamientoSemestral.alumno',
                            'alumnoGrupoRecursamientoSemestral.periodoCurso',
                            'plantel.recursamientoSemestrales'
                        ])->orderBy('periodo_id', 'DESC');
                    },
                    'documentoHasDocente.documento'
                ])->get();
            }else{
                $docente_con_plantilla = Docente::where('id', $id)->whereHas('docentePlantilla', function ($query) use($planteles_alacance){
                    $query->whereIn('plantel_id', $planteles_alacance);
                })->with([
                    'lugarNacimiento.estado',
                    'lugarDireccion.estado',
                    'docentePlantilla' => function($query) use($plantilla_estatus, $planteles_alacance) {
                        $query->where('plantilla_estatus', '>', $plantilla_estatus)->whereIn('plantel_id', $planteles_alacance);
                    },
                    'docentePlantilla.tipoPlaza',
                    'docentePlantilla.plantel.municipio.estado', 'docentePlantilla.plantel.tipoPlantel', 'docentePlantilla.plantel.opcionEducativa',
                    'docentePlantilla.plantel.iems',
                    'docentePlantilla.plantel.plantelCarreras.carrera',
                    'docentePlantilla.docenteAsignatura' => function($query) use($plantilla_estatus){
                        $query->where('estatus', '>', $plantilla_estatus)->orderBy('periodo_id', 'DESC');
                    },
                    'docentePlantilla.docenteAsignatura.grupoPeriodo.grupo',
                    'docentePlantilla.docenteAsignatura.grupoPeriodo.periodo',
                    'docentePlantilla.docenteAsignatura.plantel',
                    'docentePlantilla.docenteAsignatura.carreraUac.uac' => function ($query){
                        $query->doesntHave('submodulos');
                    },
                    'docentePlantilla.docenteAsignatura.carreraUac.carrera',
                    'docentePlantilla.docenteAsignatura.periodo',
                    //recursamiento intersemestral con fecha activa
                    'docentePlantilla.asignaturaRecursamientoIntersemestral' => function ($query) use($fecha_actual, $periodo_actual){
                        $query->where('estatus', 1)->with([
                            'carreraUac',
                            'carreraUac.uac',
                            'carreraUac.carrera',
                            'periodo',
                            'grupoPeriodo',
                            'grupoRecursamientoIntersemestral.alumnoGrupoRecursamientoIntersemestral.alumno',
                            'plantel.recursamientoIntersemestrales'
                        ])->orderBy('periodo_id', 'DESC');
                    },
                    /* recursamiento semestral */
                    'docentePlantilla.grupoRecursamientoSemestral' => function ($query) use($fecha_actual, $periodo_actual_id){
                        $query->with([
                            'carreraUac',
                            'carreraUac.uac',
                            'carreraUac.carrera',
                            'periodo',
                            'grupoPeriodo',
                            'alumnoGrupoRecursamientoSemestral.alumno',
                            'alumnoGrupoRecursamientoSemestral.periodoCurso',
                            'plantel.recursamientoSemestrales'
                        ])->orderBy('periodo_id', 'DESC');
                    },
                    'documentoHasDocente.documento'
                ]);
                $docente = Docente::where('id', $id)->with([
                    'lugarNacimiento.estado',
                    'lugarDireccion.estado',
                    'docentePlantilla' => function($query) use($plantilla_estatus, $planteles_alacance) {
                        $query->where('plantilla_estatus', '>', $plantilla_estatus)->whereIn('plantel_id', $planteles_alacance);
                    },
                    'docentePlantilla.tipoPlaza',
                    'docentePlantilla.plantel.municipio.estado', 'docentePlantilla.plantel.tipoPlantel', 'docentePlantilla.plantel.opcionEducativa',
                    'docentePlantilla.plantel.iems',
                    'docentePlantilla.plantel.plantelCarreras.carrera',
                    'docentePlantilla.docenteAsignatura' => function($query) use($plantilla_estatus){
                        $query->where('estatus', '>', $plantilla_estatus)->orderBy('periodo_id', 'DESC');
                    },
                    'docentePlantilla.docenteAsignatura.grupoPeriodo.grupo',
                    'docentePlantilla.docenteAsignatura.grupoPeriodo.periodo',
                    'docentePlantilla.docenteAsignatura.plantel',
                    'docentePlantilla.docenteAsignatura.carreraUac.uac' => function ($query){
                        $query->doesntHave('submodulos');
                    },
                    'docentePlantilla.docenteAsignatura.carreraUac.carrera',
                    'docentePlantilla.docenteAsignatura.periodo',
                    //recursamiento intersemestral con fecha activa
                    'docentePlantilla.asignaturaRecursamientoIntersemestral' => function ($query) use($fecha_actual, $periodo_actual){
                        $query->where('estatus', 1)->with([
                            'carreraUac',
                            'carreraUac.uac',
                            'carreraUac.carrera',
                            'periodo',
                            'grupoPeriodo',
                            'grupoRecursamientoIntersemestral.alumnoGrupoRecursamientoIntersemestral.alumno',
                            'plantel.recursamientoIntersemestrales'
                        ])->orderBy('periodo_id', 'DESC');
                    },
                    /* recursamiento semestral */
                    'docentePlantilla.grupoRecursamientoSemestral' => function ($query) use($fecha_actual, $periodo_actual_id){
                        $query->with([
                            'carreraUac',
                            'carreraUac.uac',
                            'carreraUac.carrera',
                            'periodo',
                            'grupoPeriodo',
                            'alumnoGrupoRecursamientoSemestral.alumno',
                            'alumnoGrupoRecursamientoSemestral.periodoCurso',
                            'plantel.recursamientoSemestrales'
                        ])->orderBy('periodo_id', 'DESC');
                    },
                    'documentoHasDocente.documento'
                ])->doesntHave('docentePlantilla')->union($docente_con_plantilla)->get();
            }
            if($docente == null){
                throw new ModelNotFoundException();   
            }
            return ResponseJson::data($docente, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg("No fue posible econtrar al docente", 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible econtrar al docente', 400);
        } 
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $docente = Docente::findOrFail($id);
            $old_docente = $docente;
            /* validar que no tenga contratos activos */
            $docente_plantilla = DocentePlantilla::where([
                ['docente_id', $id],
                ['plantilla_estatus', 1]
                ])->get();
            if($docente_plantilla->isNotEmpty()){
                return ResponseJson::msg('No fue posible eliminar al docente ya que cuenta con una asignación en curso', 400);   
            }
            $docente = Docente::findOrFail($id);
            $docente->update([
                 'docente_estatus' => 0
            ]);
            $this->auditoriaSave($docente, $old_docente); /* adutoria log */
            DB::commit();
            return ResponseJson::msg('Datos eliminados correctamente', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar al docente', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar al docente', 400);
        } 
    }

    public function docenteBaja(StoreDocenteBajaRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $docente = Docente::findOrFail($id);
            /* if not exist */
            if($docente->docente_estatus == 0 || $docente->docente_estatus == 2){
                throw new ModelNotFoundException();
            }
            $old_docente = $docente; /* guardar old datos */
            $check_plantillas = $this->isHavePlantillaAvailable($id);
            if(!$check_plantillas){
                /* no contiene plantillas activas */
                $docente = Docente::findOrFail($id);
                $docente->update([
                    'docente_estatus' => 2,
                  /*   'comentario' => $request->comentario, */
                    'fecha_baja' =>  Carbon::now(),
                ]);
                $this->auditoriaSave($docente, $old_docente); /* adutoria log */
                /* cambiar estatus usuario */
                $docente_usuario = UsuarioDocente::where('docente_id', $id)->first();
                $usuario = Usuario::find($docente_usuario->usuario_id);
                $old_docente_usuario = $usuario;
                $usuario->update([
                    'estatus' => 0
                ]);
                $this->auditoriaSave($docente_usuario, $old_docente_usuario); /* adutoria log */
            }else{
                /* tiene plantillas aun en uso */
                return ResponseJson::msg("No se logró dar de baja al docente ya que cuenta con asignaciones en curso", 400); 
            }
            DB::commit();
            return ResponseJson::data($docente, 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible dar baja al docente', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible dar baja al docente', 400);
        } 
    }

    public function docenteAlta(StoreDocenteBajaRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $docente = Docente::findOrFail($id);
            /* if not exist */
            if($docente->docente_estatus == 0 || $docente->docente_estatus == 1){
                throw new ModelNotFoundException();
            }
            $old_docente = $docente;
            $docente = Docente::findOrFail($id);
            $docente->update([
                'docente_estatus' => 1,
                'comentario' => $request->comentario,
                /* 'fecha_baja' =>  null, */
                'fecha_reingreso' =>  Carbon::now(),
            ]);
            $this->auditoriaSave($docente, $old_docente); /* adutoria log */
            /* cambiar estatus usuario */
            $docente_usuario = UsuarioDocente::where('docente_id', $id)->first();
            $usuario = Usuario::find($docente_usuario->usuario_id);
            $old_docente_usuario = $usuario;
            $usuario->update([
                'estatus' => 1
            ]);
            $this->auditoriaSave($docente_usuario, $old_docente_usuario); /* adutoria log */
            DB::commit();
            return ResponseJson::data($docente, 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible reingresar al docente', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible reingresar al docente', 400);
        } 
    }

    public function docenteBajaPermiso(StoreDocenteBajaRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $docente = Docente::findOrFail($id);
            /* if not exist */
            if($docente->docente_estatus != 1){ /* si es diferen a activo */
                throw new ModelNotFoundException();
            }
            $old_docente = $docente;
            $docente = Docente::findOrFail($id);
            $docente->update([
                 'docente_estatus' => 3,
                 'comentario' => $request->comentario,
                 'fecha_baja' => Carbon::now(),
            ]);
            $this->auditoriaSave($docente, $old_docente); /* adutoria log */
            DB::commit();
            return ResponseJson::data($docente, 200);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible dar baja por permiso al docente', 400);
        } catch(ModelNotFoundException $e) {
             DB::rollBack();
            return ResponseJson::msg('No fue posible dar baja por permiso al docente', 400);
        } 
    }

    public function getDocentes(Request $request)
    {   
        /* exist request */
        $input = $request->input;
        $plantel = $request->plantel_id;
        $estado = $request->estado_id;
        /* alcance y permisos */
        $permisos = HelperPermisoAlcance::getPermisos();
        $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();
        $estado_alcance = HelperPermisoAlcance::getPermisosAlcanceEstado();
        if($input != null || $plantel != null || $estado != null){
            /* evaluar que combinacion llega */
            if($input != null && $plantel != null){
                $op = 3;
            }else if($estado != null && $input != null){
                $op = 5;
            }else if($input != null){
                $op = 1;
            }else if($plantel != null){
                $op = 2;
            }else if($estado != null){
                $op = 4;
            }
            switch ($op) {
                case 1:
                    /* solo input */
                    $data = $this->docenteByInput($input, $permisos, $planteles_alacance);
                    break;
                case 2:
                    /* solo plantel */
                    $data = $this->docenteByPlantel($plantel, $planteles_alacance, $permisos);
                    break;
                case 3:
                    /* plantel, input */
                    $data = $this->docenteByPlantelInput($plantel, $input, $planteles_alacance, $permisos);
                    break;
                case 4:
                    /* estado */
                    $data = $this->docenteByEstado($estado, $estado_alcance, $permisos);
                    break;
                case 5:
                    /* estado, input */
                    $data = $this->docenteByEstadoInput($estado, $input, $estado_alcance, $permisos);
                    break;
            }
            return ResponseJson::data($data, 200);
        }else{
            return ResponseJson::msg("Error al intentar encontrar al docente", 400);
        }
    }

    public function docenteByInput($input, $permisos, $planteles_alacance){
        try{
            if(in_array("Nacional", $permisos)) {
                //nacional
                $docente = Docente::where(function($query) use ($input){
                    $query->where('num_nomina', $input)
                    ->orWhere('curp', $input)
                    ->orWhere('nombre' , $input)
                    ->orWhere('primer_apellido' , $input)
                    ->orWhere('segundo_apellido' , $input)
                    ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                    ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                })->orderBy('primer_apellido', 'ASC')->get();
                return $docente;
            }
            //docentes con asignaciones activas y terminadas y eliminadas by input
            $docente_con_plantilla = Docente::whereHas('docentePlantilla', function ($query) use($planteles_alacance){
                $query/*->where('plantilla_estatus', '>', 0)*/->whereHas('plantel', function ($query) use ($planteles_alacance){
                    $query->whereIn('id', $planteles_alacance);
                });
            })->where(function($query) use ($input){
                $query->where('num_nomina', $input)
                ->orWhere('curp', $input)
                ->orWhere('nombre' , $input)
                ->orWhere('primer_apellido' , $input)
                ->orWhere('segundo_apellido' , $input)
                ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
            })->orderBy('primer_apellido', 'ASC');
            //docentes sin plantilla
            $docente_sin_plantilla = Docente::where(function($query) use ($input){
                $query->where('num_nomina', $input)
                ->orWhere('curp', $input)
                ->orWhere('nombre' , $input)
                ->orWhere('primer_apellido' , $input)
                ->orWhere('segundo_apellido' , $input)
                ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
            })->orderBy('primer_apellido', 'ASC')->doesntHave('docentePlantilla')->union($docente_con_plantilla)->get();
            $resultado = $docente_sin_plantilla;
            return $resultado;

        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        }
    }

    public function docenteByPlantel($plantel, $planteles_alacance, $permisos){
        try{
            //consultar si el plantel pertenece
            if(in_array("Nacional", $permisos)){
                $docente = Docente::whereHas('docentePlantilla', function($query) use ($plantel){
                    $query->where([
                        ['plantel_id', $plantel],
                        ['plantilla_estatus', 1]
                    ]);
                })->with(['docentePlantilla' => function ($query) use($plantel) {$query->where('plantel_id', $plantel);}])->orderBy('primer_apellido', 'ASC')->get();
                return $docente;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel, $planteles_alacance)){
                    $docente = Docente::whereHas('docentePlantilla', function($query) use ($plantel){
                        $query->where([
                                ['plantel_id', $plantel],
                                ['plantilla_estatus', 1]
                            ]);
                    })->with(['docentePlantilla' => function ($query) use($plantel) {$query->where('plantel_id', $plantel);}])->orderBy('primer_apellido', 'ASC')->get();
                    return $docente;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel, $planteles_alacance)){
                    $docente = Docente::whereHas('docentePlantilla', function($query) use ($plantel){
                        $query->where([
                                ['plantel_id', $plantel],
                                ['plantilla_estatus', 1]
                            ]);
                    })->with(['docentePlantilla' => function ($query) use($plantel) {$query->where('plantel_id', $plantel);}])->orderBy('primer_apellido', 'ASC')->get();
                    return $docente;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } 
    }
    
    public function docenteByPlantelInput($plantel, $input, $planteles_alacance, $permisos){
        try {
            if(in_array('Nacional', $permisos)){
                $docente = Docente::whereHas('docentePlantilla', function($query) use ($plantel, $input){
                    $query->where([
                            ['plantel_id', $plantel],
                            //['plantilla_estatus', 1]
                        ]);
                })->where(function($query) use ($input) {
                        $query->where('num_nomina', $input)
                        ->orWhere('curp', $input)
                        ->orWhere('nombre' , $input)
                        ->orWhere('primer_apellido' , $input)
                        ->orWhere('segundo_apellido' , $input)
                        ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                        ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                        }
                )->with(['docentePlantilla' => function ($query) use($plantel){ $query->where('plantel_id', $plantel); }])->orderBy('primer_apellido', 'ASC')->get();
                return $docente;
            }
            if(in_array('Estatal', $permisos)){
                //comprobar si el plantel a buscar pertenece a la lista
                if(in_array($plantel ,$planteles_alacance)){
                    $docente = Docente::whereHas('docentePlantilla', function($query) use ($plantel, $input){
                        $query->where([
                                ['plantel_id', $plantel],
                                //['plantilla_estatus', 1]
                            ]);
                    })->where(function($query) use ($input) {
                            $query->where('num_nomina', $input)
                            ->orWhere('curp', $input)
                            ->orWhere('nombre' , $input)
                            ->orWhere('primer_apellido' , $input)
                            ->orWhere('segundo_apellido' , $input)
                            ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                            ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                            }
                    )->with(['docentePlantilla' => function ($query) use($plantel){ $query->where('plantel_id', $plantel); }])->orderBy('primer_apellido', 'ASC')->get();
                    return $docente;
                }
            }
            if(in_array('Plantel', $permisos)){
                if(in_array($plantel, $planteles_alacance)){
                    $docente = Docente::whereHas('docentePlantilla', function($query) use ($plantel, $input){
                        $query->where([
                                ['plantel_id', $plantel],
                                //['plantilla_estatus', 1]
                            ]);
                    })->where(function($query) use ($input) {
                            $query->where('num_nomina', $input)
                            ->orWhere('curp', $input)
                            ->orWhere('nombre' , $input)
                            ->orWhere('primer_apellido' , $input)
                            ->orWhere('segundo_apellido' , $input)
                            ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                            ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                            }
                    )->with(['docentePlantilla' => function ($query) use($plantel){ $query->where('plantel_id', $plantel); }])->orderBy('primer_apellido', 'ASC')->get();
                    return $docente;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } 

    }

    public function docenteByEstado($estado, $estado_alcance, $permisos){
        try{
            if(in_array('Nacional', $permisos)){
                $docente = Docente::whereHas('docentePlantilla', function($query) use ($estado){
                    $query->where('plantilla_estatus', 1)->whereHas('plantel',  function($query) use ($estado){
                        $query->whereHas('municipio',  function($query) use ($estado){
                            $query->whereHas('estado',  function($query) use ($estado){
                                $query->where('id', $estado);
                            });
                        });
                    });
                })->orderBy('primer_apellido', 'ASC')->get();
                return $docente;
            }
            if(in_array('Estatal', $permisos)){
                //comprobar estado
                if(in_array($estado, $estado_alcance)){
                    $docente = Docente::whereHas('docentePlantilla', function($query) use ($estado){
                        $query->where('plantilla_estatus', 1)->whereHas('plantel',  function($query) use ($estado){
                            $query->whereHas('municipio',  function($query) use ($estado){
                                $query->whereHas('estado',  function($query) use ($estado){
                                    $query->where('id', $estado);
                                });
                            });
                        });
                    })->orderBy('primer_apellido', 'ASC')->get();
                    return $docente;
                }
            }
            if(in_array('Plantel', $permisos)){
               //return null;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } 
    }

    public function docenteByEstadoInput($estado, $input, $estado_alcance, $permisos){
        try{
            if(in_array('Nacional', $permisos)){
                $docente = Docente::whereHas('docentePlantilla', function($query) use ($estado){
                    $query->where('plantilla_estatus', 1)->whereHas('plantel',  function($query) use ($estado){
                        $query->whereHas('municipio',  function($query) use ($estado){
                            $query->whereHas('estado',  function($query) use ($estado){
                                $query->where('id', $estado);
                            });
                        });
                    });
                })->where(function($query) use ($input) {
                    $query->where('num_nomina', $input)
                        ->orWhere('curp', $input)
                        ->orWhere('nombre' , $input)
                        ->orWhere('primer_apellido' , $input)
                        ->orWhere('segundo_apellido' , $input)
                        ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                        ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                })->orderBy('primer_apellido', 'ASC')->get();
                return $docente;
            }
            if(in_array('Estatal', $permisos)){
                //comprobar estado busqueda
                if(in_array($estado, $estado_alcance)){
                    $docente = Docente::whereHas('docentePlantilla', function($query) use ($estado){
                        $query->where('plantilla_estatus', 1)->whereHas('plantel',  function($query) use ($estado){
                            $query->whereHas('municipio',  function($query) use ($estado){
                                $query->whereHas('estado',  function($query) use ($estado){
                                    $query->where('id', $estado);
                                });
                            });
                        });
                    })->where(function($query) use ($input) {
                        $query->where('num_nomina', $input)
                            ->orWhere('curp', $input)
                            ->orWhere('nombre' , $input)
                            ->orWhere('primer_apellido' , $input)
                            ->orWhere('segundo_apellido' , $input)
                            ->orWhereRaw("CONCAT(`nombre`, ' ', `primer_apellido`, ' ', `segundo_apellido`) LIKE ?", ['%'.$input.'%'])
                            ->orWhereRaw("CONCAT(`primer_apellido`, ' ', `segundo_apellido`, ' ', `nombre`) LIKE ?", ['%'.$input.'%']);
                    })->orderBy('primer_apellido', 'ASC')->get();
                    return $docente;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } 
    }

    public function isHavePlantillaAvailable($docente_id){
        try{
            $docente_plantilla = DocentePlantilla::where([
                ['docente_id', $docente_id],
                ['plantilla_estatus', 1]
                ])->get();
            if($docente_plantilla->isNotEmpty()){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar al docente', 400);
        } 
    }

}
