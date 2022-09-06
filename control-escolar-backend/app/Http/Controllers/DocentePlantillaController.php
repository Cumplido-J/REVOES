<?php

namespace App\Http\Controllers;

use App\Alumno;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreDocentePlantillaRequest;
use App\Http\Requests\StoreDocentePlantillaBajaRequest;
use Illuminate\Support\Facades\DB;
use App\Docente;
use App\Usuario;
use App\UsuarioDocente;
use App\DocentePlantilla;
use App\CarreraUac;
use App\Periodo;
use App\UAC;
use App\Plantel;
use App\DocenteAsignatura;
use Carbon\Carbon;
use App\Traits\AuditoriaLogHelper;
use Illuminate\Database\QueryException;
use PDOException;
use ResponseJson;
use ValidationsDocente;
use Sisec;

class DocentePlantillaController extends Controller {

    use AuditoriaLogHelper;
    
    public function index()
    {
        $docentes = DocentePlantilla::with('docente','plantel.municipio', 'plantel.tipoPlantel', 'plantel.opcionEducativa', 'plantel.iems','tipoPlaza')->get();

        return ResponseJson::data($docentes, 200);
    }
    
    public function store(StoreDocentePlantillaRequest $request)
    {
        try {
            DB::beginTransaction();
            /* consultar si el docente se encuentra activo */
            $is_docente_available = ValidationsDocente::isAvailableDocente($request->docente_id);
            if($is_docente_available){ 
                /* buscar disponibilidad del docente en plantel */
                 $docente_plantilla = DocentePlantilla::where([
                    ['docente_id', $request->docente_id],
                    ['plantel_id', $request->plantel_id],
                    ['plantilla_estatus', 1]
                ])->get();
                if($docente_plantilla->isEmpty()){
                    /* Libre */
                    $docente_plantilla = $this->insertPlantilla(
                        $request->fecha_asignacion,
                        $request->fecha_inicio_contrato,
                        $request->fecha_fin_contrato,
                        $request->horas,
                        $request->docente_id,
                        $request->cat_tipo_plaza_id,
                        $request->plantel_id,
                        $request->nombramiento_liga
                    );
                }else{
                    /* en uso */
                    return ResponseJson::msg('El docente ya se encuentra con una asignación activa en el plantel', 400);
                }
                $this->auditoriaSave($docente_plantilla); /* adutoria log */
            }else{
                return ResponseJson::msg('El docente se encuentra desactivado', 400);
            }
            DB::commit();
            return ResponseJson::msg('Asignación del docente creada correctamente', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la Asignación del docente', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible crear la Asignación del docente', 400);
        } 
    }

    public function show($id)
    {
        try {
            $asignatura_estatus = 0;
            $docente_plantilla = DocentePlantilla::where([
                ['id', $id],
                ['plantilla_estatus', '>', 0]
                ])->with(['docente',
            'plantel.municipio.estado', 'plantel.tipoPlantel', 'plantel.opcionEducativa', 'plantel.iems',
            'plantel.plantelCarreras.carrera',
            'tipoPlaza',
            'docenteAsignatura' => function ($query) use ($asignatura_estatus) {
                $query->where('estatus' , '>' , $asignatura_estatus)->orderBy('periodo_id', 'DESC');
            },
            'docenteAsignatura.grupoPeriodo.grupo', 'docenteAsignatura.plantel', 'docenteAsignatura.carreraUac.uac', 'docenteAsignatura.carreraUac.carrera',
            'docenteAsignatura.periodo'])->get();
            return ResponseJson::data($docente_plantilla, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la asignación del docente', 400);
        }
    }

    public function plantillasFromDocente()
    {
        try {
            $user = auth()->user();
            $periodo_actual = Sisec::periodoActual();
            $periodo_actual = $periodo_actual->id;
            $usuario_docente = DB::table('usuario_docente')->where('usuario_id', $user->id)->get();
            if($usuario_docente->isNotEmpty()){
                foreach($usuario_docente as $obj){
                    $asignatura_estatus = 0;
                    $docente_plantillas = DocentePlantilla::where([
                        ['docente_id', $obj->docente_id],
                        ['plantilla_estatus', '=' ,1]
                        ])->with([
                    'plantel.municipio.estado', 'plantel.tipoPlantel', 'plantel.opcionEducativa', 'plantel.iems',
                    'tipoPlaza',
                    'docenteAsignatura' => function ($query) use($periodo_actual){
                        $query->whereHas('grupoPeriodo', function($q) use($periodo_actual){
                            $q->whereHas('periodo', function($q) use($periodo_actual){
                                $q->where('id', $periodo_actual);
                            });
                        })->where('estatus' , '>' , 0);
                    }])->get();
                    return ResponseJson::data($docente_plantillas, 200);
                }
            }else{
             return ResponseJson::msg('No fue posible encontar la asignación del docente', 400);   
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la asignación del docente', 400);
        }
    }

    public function plantillasFromDocenteById($id)
    {
        try {
            $user = auth()->user();
            $docente_plantilla = DocentePlantilla::findOrFail($id);
            if($docente_plantilla->plantilla_estatus == 0 || $docente_plantilla->plantilla_estatus == 2){
                    throw new ModelNotFoundException();
            } 
            $docente_plantilla_is_my = $this->isMyPlantilla($user, $docente_plantilla);
            if($docente_plantilla_is_my){
                /* calificaciones */
                $periodo_actual = Sisec::periodoActual();
                $docente_plantilla = DocentePlantilla::where('id', $id)->with([
                'plantel.municipio.estado', 'plantel.tipoPlantel', 'plantel.opcionEducativa', 'plantel.iems',
                'tipoPlaza',
                'docenteAsignatura' => function ($query) use($periodo_actual){
                    $query->whereHas('grupoPeriodo', function($q) use($periodo_actual){
                        $q->whereHas('periodo', function($q) use($periodo_actual){
                            $q->where('id', $periodo_actual->id);
                        });
                    })->where('estatus' , '>' , 0);
                },
                'docenteAsignatura.grupoPeriodo.grupo', 'docenteAsignatura.plantel', 'docenteAsignatura.carreraUac.uac', 
                'docenteAsignatura.carreraUac.carrera',
                'docenteAsignatura.periodo',
                ])->get();
                return ResponseJson::data($docente_plantilla, 200);
            }else{
                return ResponseJson::msg('No fue posible encontar la asignación del docente', 400);    
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar la asignación del docente', 400);
        }
        
    }

    public function update(StoreDocentePlantillaRequest $request, $id)
    {
         try {
            $is_docente_available = ValidationsDocente::isAvailableDocente($request->docente_id);
            if($is_docente_available){
                $docente_plantilla = DocentePlantilla::findOrFail($id); /* busqueda para guarar en auditoria */
                if($docente_plantilla->plantilla_estatus == 0 || $docente_plantilla->plantilla_estatus == 2){
                    throw new ModelNotFoundException();
                } 
                $old_data = $docente_plantilla; /* datos del la plantilla */
                /* checar disponbilidad del docente */
                $docente_plantilla = DocentePlantilla::findOrFail($id); /* nueva busqueda => en caso  */
                 /* buscar plantilla docente para checar disponibilidad en plantel */
                $docente_plantilla = DocentePlantilla::where([
                    ['docente_id', $request->docente_id],
                    ['plantel_id', $request->plantel_id],
                    ['plantilla_estatus', 1]
                ])->first();
                if($docente_plantilla == null){
                 /* modificar en otro plantel */
                    $docente_plantilla = DocentePlantilla::findOrFail($id);
                    $check_hours = $this->checkHoursDocente($docente_plantilla->id, $request->horas); /* si modifica horas, checar disponibilidad */
                    if($check_hours){
                       /* checar si cuenta con asignaturas anteriormente en el plantel a modificar */
                        $check_if_exist_asignaturas = $this->isHaveAsignaturas($docente_plantilla->id);
                        if(!$check_if_exist_asignaturas){
                            $docente_plantilla->update([
                                'fecha_asignacion' => $request->fecha_asignacion,
                                'fecha_inicio_contrato' => $request->fecha_inicio_contrato,
                                'fecha_fin_contrato' => $request->fecha_fin_contrato,
                                'horas' => $request->horas,
                                'docente_id' => $request->docente_id,
                                'cat_tipo_Plaza_id' => $request->cat_tipo_plaza_id,
                                'plantel_id' => $request->plantel_id,
                                'nombramiento_liga' => $request->nombramiento_liga
                            ]);
                        }else{
                            $plantel_name = Plantel::where('id', $docente_plantilla->plantel_id)->first();
                            return ResponseJson::msg('El docente cuenta con asignaturas en el plantel '.$plantel_name->nombre, 400);
                        }             
                    }else{
                        return ResponseJson::msg('La asignación no puede tener menos horas asignadas de las horas que ya tiene en uso', 400);
                    }
                }else{
                    /* modificar dentro del mismo plantel */
                    if($docente_plantilla->id == $id){
                        $check_hours = $this->checkHoursDocente($id, $request->horas);
                         if($check_hours){
                            $docente_plantilla->update([
                                'fecha_asignacion' => $request->fecha_asignacion,
                                'fecha_inicio_contrato' => $request->fecha_inicio_contrato,
                                'fecha_fin_contrato' => $request->fecha_fin_contrato,
                                'horas' => $request->horas,
                                'docente_id' => $request->docente_id,
                                'cat_tipo_Plaza_id' => $request->cat_tipo_plaza_id,
                                'plantel_id' => $request->plantel_id,
                                'nombramiento_liga' => $request->nombramiento_liga
                            ]);
                        }else{
                            return ResponseJson::msg('La asignación no puede tener menos horas asignadas de las horas que ya tiene en uso', 400);
                        }
                    }else{
                        return ResponseJson::msg('El docente ya se encuentra con una asignación en este plantel', 400);
                    }
                }
            }else{
                return ResponseJson::msg('El docente se encuentra desactivado', 400);
            }
            $this->auditoriaSave($docente_plantilla, $old_data); /* adutoria log */
            DB::commit();
            return ResponseJson::msg('Asignación del docente modificada correctamente', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible modificar la Asignación del docente', 400);
        }
    }

    public function isHaveAsignaturas($id)
    {
      try {
            $docente_plantilla = DocentePlantilla::findOrFail($id);
            $periodo_actual = Sisec::periodoActual();
            $docente_asignatura = DocenteAsignatura::where([
                ['plantilla_docente_id', $docente_plantilla->id],
                ['periodo_id', $periodo_actual->id],
                ['estatus', '>', 0]
            ])->get();
            if($docente_asignatura->isNotEmpty()){
                return true;
            }else{
                return false;
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible dar de baja la Asignación del docente', 400);
        } catch(QueryException $e) {
            return ResponseJson::msg('No fue posible dar de baja la Asignación del docente', 400);
        }    
    }
   
    public function isMyPlantilla($user, $docente_plantilla)
    {
        try {
            $usuario_docente = UsuarioDocente::where('usuario_id', $user->id)->first();
            if($docente_plantilla->docente_id == $usuario_docente->docente_id){
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

    public function destroy($id)
    {
        try {
            $docente_plantilla = DocentePlantilla::findOrFail($id);
            $old_data = $docente_plantilla;
            $docente_plantilla = DocentePlantilla::findOrFail($id);
            if($docente_plantilla->plantilla_estatus == 0){
                throw new ModelNotFoundException();
            }
            $have_asignaturas = $this->isHaveAsignaturas($docente_plantilla->id);
            if(!$have_asignaturas){
                $docente_plantilla->update([
                    'plantilla_estatus' => 0,
                    'fecha_fin_contrato' => Carbon::now()
                ]);
                $this->auditoriaSave($docente_plantilla, $old_data); /* adutoria log */
            }else{
                return ResponseJson::msg('La Asignación cuenta con asignaturas en curso', 400);
            }
            DB::commit();
            return ResponseJson::msg('Asignación del docente eliminado correctamente', 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible eliminar la Asignación del docente', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar la Asignación del docente', 400);
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

    public function checkHoursDocente($docente_plantilla_id, $horas)
    {
        try {
            /* checar si el valor de horas se modifica ver si cumple con las el numero de horas de asignatura ya asignadas y en periodo actual*/
            $periodo_actual = Sisec::periodoActual();
            $docente_plantilla = DocentePlantilla::findOrFail($docente_plantilla_id);
            $docente_asignaturas = DocenteAsignatura::where([
                ['plantilla_docente_id', $docente_plantilla_id],
                ['periodo_id', $periodo_actual->id],
                ['estatus', '>', 0],
            ])->get();
            $count_hours = 0;
            foreach($docente_asignaturas as $obj){
              $uac_hours = $this->getHoursUac($obj->carrera_uac_id); /* get horas materia a la semana */
              $count_hours += $uac_hours; /* horas acumuladas */
            }
            if($count_hours > $horas){
                return false; 
            }
            return true;
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('Error inesperado', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('Error inesperado', 400);
        } 
    }

    public function plantillaTerminacion(StoreDocentePlantillaBajaRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $docente_plantilla = DocentePlantilla::findOrFail($id);
            if($docente_plantilla->plantilla_estatus == 0 || $docente_plantilla->plantilla_estatus == 2){
                throw new ModelNotFoundException();
            }
            $have_asignaturas = $this->isHaveAsignaturas($docente_plantilla->id);
            if(!$have_asignaturas){
                if($request->fecha_fin_contrato < $docente_plantilla->fecha_asignacion){
                    return ResponseJson::msg('La fecha de terminación no debe ser menor a la fecha de inicio de la asignación', 400); 
                }
                $old_data = $docente_plantilla;
                $docente_plantilla = DocentePlantilla::findOrFail($id);
                $docente_plantilla->update([
                    'fecha_fin_contrato' => $request->fecha_fin_contrato,
                    'plantilla_estatus' => 2,
                ]);
                $this->auditoriaSave($docente_plantilla, $old_data); /* adutoria log */
            }else{
                return ResponseJson::msg('La Asignación cuenta con asignaturas en curso', 400);
            }
            DB::commit();
            return ResponseJson::msg('Asignación del docente terminada correctamente', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible terminar la Asignación del docente', 400);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible terminar la Asignación del docente', 400);
        } 
    }

    public function insertPlantilla($fecha_asignacion, $fecha_inicio_contrato, $fecha_fin_contrato, $horas, $docente_id, $cat_tipo_Plaza_id ,$plantel_id, $nombramiento_liga = null)
    {
        $docente_plantilla = DocentePlantilla::create([
            'fecha_asignacion' => $fecha_asignacion,
            'fecha_inicio_contrato' => $fecha_inicio_contrato,
            'fecha_fin_contrato' => $fecha_fin_contrato,
            'horas' => $horas,
            'docente_id' => $docente_id,
            'cat_tipo_Plaza_id' => $cat_tipo_Plaza_id,
            'plantel_id' => $plantel_id,
            'nombramiento_liga' => $nombramiento_liga,
            'plantilla_estatus' => 1
            ]);
        return $docente_plantilla;
    }
}
