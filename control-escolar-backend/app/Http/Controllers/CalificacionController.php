<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Alumno;
use App\Carrera;
use App\UAC;
use App\CarreraUac;
use App\Competencia;
use App\CarreraCompetencia;
use App\CalificacionUac;
use App\CalificacionRevalidacion;
use App\Periodo;
use App\Traits\AuditoriaLogHelper;
use Illuminate\Support\Facades\DB;
use Sisec;

class CalificacionController extends Controller
{
    use AuditoriaLogHelper;

    /**
     * Muestra las calificaciones de revalidación de  un alumno cuya trayectoria es de tránsito.
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function verCalificacionesAlumnoRevalidacion($id){

        $alumno = Alumno::find($id);

        if($alumno == null)
            return response()->json(['message' => 'El alumno no existe'], 404);

        if(!Sisec::validarAlcanceYPermiso($alumno->plantel_id, 'Registrar alumnos'))
            return response()->json(['message' => 'No tiene permiso para realizar esta acción.'], 403);

        if(!$alumno->tipo_trayectoria == 'Transito'){
            return response()->json(['message' => 'La trayectoria del alumno no es de tránsito'], 400);
        }

        $calificaciones_revalidacion = CalificacionRevalidacion::where('alumno_id', $alumno->usuario_id)->with('periodo')->get();

        return response()->json(['data' => $calificaciones_revalidacion], 200);

    }

    /**
     * Se sincronizan las calificaciones de módulos para los alumnos seleccionados para certificar.
     * Se añaden a la tabla 'alumno_carrera_competencia' las calificaciones finales de módulos.
     * Se añade registro de certificado de término validado a tabla certificado.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function calificacionesCompetenciasParaCertificado(Request $request){

        $alumnos = Alumno::whereIn('usuario_id', $request->alumnos)
            ->with(['calificacionUac' => function($query){
                //Filtrar por calificaciones de módulos
                $query->whereHas('carreraUac.uac', function($tipoUac){
                    $tipoUac->where('tipo_uac_id', 4)
                        ->orWhere('tipo_uac_id', 3);
                    //Calificaciones finales
                })->where('parcial', '>', 3)
                    ->orderBy('parcial', 'desc')
                    ->orderBy('periodo_id', 'desc');
            }, 'calificacionUac.carreraUac.uac', 'usuario'])->get();

        if(!Sisec::validarAlcanceYPermiso($alumnos->first()->plantel_id, 'Sincronizar calificaciones para certificados'))
            return response()->json(['message' => 'No tiene permiso para realizar esta acción'], 403);

        DB::beginTransaction();
        try{
            foreach ($alumnos as $alumno) {
                //Se agrupan las calificaciones por módulo, para los casos en los que la aprobaron en extraordinario
                //recursamiento o curso intersemestral
                if ($alumno->tipo_alumno != 'Regular' || $alumno->estatus_inscripcion != 'Activo')
                    continue;

                $carrera = $alumno->carrera()->first();
                if($carrera == null)
                    return response()->json(['message' => 'El alumno con CURP '.$alumno->usuario->username.' no tiene una carrera asignada.']);

                $calificaciones = $alumno->calificacionUac->groupBy('carreraUac.id');

                $bachTec = false;

                if($calificaciones == null || count($calificaciones) == 0){
                    return response()->json(['message' => 'El alumno con CURP '.$alumno->usuario->username.' no tiene calificaciones
                        de módulos asignadas. No se ha sincronizado ninguna calificación.'], 400);
                }

                //Si no tiene 5 módulos completos saldrá como bachillerato técnico.
                if($carrera->tipo_perfil_id == 5 && count($calificaciones) < 5)
                    $bachTec = true;

                $carreraId = $calificaciones->first()[0]->carreraUac->carrera_id;

                foreach ($calificaciones as $modulo) {
                    $competencia = Competencia::where('modulo', $modulo[0]->carreraUac->uac->nombre)->pluck("id");
                    if ($competencia == null) {
                        return response()->json(['message' => 'No se pudo sincronizar la calificación del módulo "'.$modulo[0]->carreraUac->uac->nombre.
                        '" para el alumno '.$alumno->usuario->username.'. Por favor contacte a soporte.'], 400);
                    }

                    $carreraCompetencia = CarreraCompetencia::whereIn('competencia_id', $competencia)
                        ->where('carrera_id', $modulo[0]->carreraUac->carrera_id)
                        ->with('competencia')
                        ->orderBy('orden', 'asc')
                        ->first();

                    if($carreraCompetencia == null)
                        return response()->json(['message' => 'No existe una relación entre la carrera y el módulo '.$modulo[0]->carreraUac->uac->nombre
                            .'. Favor de contactar a soporte.']
                            , 400);

                    //Si alguno de los módulos es de una carrera diferente será bach tec.
                    if($carreraId != $carreraCompetencia->carrera_id)
                        $bachTec = true;

                    DB::table('alumno_carrera_competencia')->insert([
                        'alumno_id' => $alumno->usuario_id,
                        'carrera_competencia_id' => $carreraCompetencia->id,
                        'calificacion' => $modulo[0]->calificacion
                    ]);
                }

                $certificado = DB::table('certificado')->insertGetId([
                   'alumno_id' => $alumno->usuario_id,
                   'tipo_certificado_id' => 1,
                   'estatus' => 'VALIDADO'
                ]);

                if($bachTec)
                    $alumno->es_bach_tec = true;

                if($request->periodo_inicio != null)
                    $alumno->periodo_inicio = $request->periodo_inicio;
                if($request->periodo_termino != null)
                    $alumno->periodo_termino = $request->periodo_termino;
                if($request->generacion != null)
                    $alumno->generacion = $request->generacion;

                if($alumno->periodo_inicio == null || $alumno->periodo_termino == null || $alumno->generacion == null){
                    return response()->json(['message' => 'Error al sincronizar. Verificar que todos los alumnos cuenten
                    con fecha de inicio y término de período y generación.'], 400);
                }

                $alumno->estatus_inscripcion = 'Por egresar';
                $alumno->calificacion = $this->obtenerPromedioAlumno($alumno);
                $alumno->save();

                $this->auditoriaManualSave(
                    "Sincronizó calificaciones para certificación",
                    'certificado',
                    $certificado,
                    'calificacionesCompetenciasParaCertificado',
                    'CalificacionController'
                );
            }

        }catch(Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'No se han podido sincronizar las calificaciones, intente nuevamente'], 400);
        }

        DB::commit();
        return response()->json(['message' => 'Se han sincronizado las calificaciones para los alumnos seleccionados.'], 200);
    }

    public function editarCalificacionesTransito(Request $request, $idAlumno){

        $califs = $request->calificaciones;
        $alumno = Alumno::find($idAlumno);

        if($alumno == null)
            return response()->json(['message' => 'El alumno no existe'], 404);

        if($alumno->tipo_trayectoria != 'Transito')
            return response()->json(['message' => 'El alumno no es de tránsito. Revisar su estatus y modificarlo.'], 400);

        if(!Sisec::validarAlcanceYPermiso($alumno->plantel_id, 'Registrar alumnos'))
            return response()->json(['message' => 'No tiene permiso para realizar esta acción.'], 403);

        if(!$alumno->tipo_trayectoria == 'Transito'){
            return response()->json(['message' => 'La trayectoria del alumno no es de tránsito'], 400);
        }

        $borrar = CalificacionRevalidacion::where('alumno_id', $alumno->usuario_id)->with('periodo')->get()->pluck('id')->toArray();

        DB::beginTransaction();
        try {
            foreach ($califs as $c) {
                $id = (isset($c['id'])) ? $c['id'] : null;

                if($id != null) {
                    $modificacion = array_search($id, $borrar);
                    unset($borrar[$modificacion]);
                }

                //Revisar que todas las calificaciones pertenecen al mismo alumno.
                if($c['alumno_id'] != $alumno->usuario_id){
                    DB::rollBack();
                    return response()->json(['message' => 'Hay inconsistencias en la información, intente nuevamente'], 400);
                }

                if(Periodo::find($c['periodo_id']) == null){
                    DB::rollBack();
                    return response()->json(['message' => 'Uno de los periodos asignados no existe.'], 404);
                }

                CalificacionRevalidacion::updateOrCreate(
                    [
                        'id' => (isset($c['id'])) ? $c['id'] : null,
                        'alumno_id' => $c['alumno_id']
                    ],
                    [
                        'calificacion' => $c['calificacion'],
                        'cct' => $c['cct'],
                        'tipo_asignatura' => $c['tipo_asignatura'],
                        'creditos' => $c['creditos'],
                        'horas' => $c['horas'],
                        'periodo_id' => $c['periodo_id']
                    ]
                );
            }

            CalificacionRevalidacion::destroy($borrar);

            $this->auditoriaManualSave(
                "Modificó las calificaciones de tránsito de un alumno (se guarda el id del alumno)",
                'calificacion_revalidacion',
                $alumno->usuario_id,
                'editarCalificacionesTransito',
                'CalificacionController'
            );

            DB::commit();
        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'No se han podido actualizar las calificaciones'], 400);
        }

        return response()->json(['message' => 'Se han actualizado las calificaciones de tránsito con éxito'], 200);
    }

    private function calificacionesAlumno($alumno){
        $semestre = $alumno->semestre;

        $calificaciones = CalificacionUac::with('carreraUac.uac')
            ->where('alumno_id', $alumno->usuario_id)
            ->whereHas('carreraUac', function($query) use ($semestre) {
                $query->where('semestre', '<=', $semestre);
            })->where('parcial', '>=', 4)
            ->orderBy('parcial', 'asc')
            ->get();

        $calificaciones = $calificaciones->filter(function($dato){
            return $dato->carreraUac->uac->tipo_uac_id != 10;
        });

        $calificaciones = $calificaciones->groupBy('carreraUac.semestre');

        $calificaciones = $calificaciones->map(function ($item, $key) {
            return $item->sortByDesc('periodo_id')
                ->sortByDesc('calificacion')
                ->sortByDesc('parcial')
                ->sortByDesc('id');
        });

        //Calificaciones agrupadas por semestre y por asignatura
        $calificaciones = $calificaciones->map(function ($item, $key) {
            return $item->groupBy('carreraUac.id');
        });

        return $calificaciones;
    }

    private function obtenerPromedioAlumno($alumno){

        $calificaciones = $this->calificacionesAlumno($alumno);

        $calificacionesTransito = CalificacionRevalidacion::with('periodo')->where('alumno_id', $alumno->usuario_id)->get();

        $suma = 0;
        $cantidadCalif = 0;

        foreach ($calificaciones as $uacs){
            foreach ($uacs as $uac){

                //Validar que sea calificacion final o extraordinaria
                if($uac[0]->parcial < 4)
                    continue;

                $cantidadCalif++;

                if($uac[0]->calificacion != null && $uac[0]->calificacion >= 0)
                    $suma+=$uac[0]->calificacion;
            }
        }

        $promedio = 0;

        if($calificacionesTransito != null){
            $cantidadCalif+=count($calificacionesTransito);

            foreach ($calificacionesTransito as $califTransito)
                $suma+=$califTransito->calificacion;
        }

        if($cantidadCalif > 0)
            $promedio = round( $suma/$cantidadCalif, 1, PHP_ROUND_HALF_UP);

        return $promedio;
    }


}
