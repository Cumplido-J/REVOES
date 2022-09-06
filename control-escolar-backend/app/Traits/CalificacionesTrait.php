<?php

namespace App\Traits;

use App\Alumno;
use App\CalificacionUac;
use App\GrupoPeriodo;
use App\CalificacionRevalidacion;
use Illuminate\Support\Str;
use Sisec;

trait CalificacionesTrait {

    /**
     * Se obtienen todas las calificaciones finales que tiene el alumno hasta el momento.
     *
     * @param $alumnoId
     * @return mixed
     */
    public function calificacionesHistorial($alumnoId){
        $alumno = Alumno::find($alumnoId);
        $semestre = $alumno->semestre;

        $calificaciones = CalificacionUac::with('carreraUac.uac')
            ->where('alumno_id', $alumno->usuario_id)
            ->whereHas('carreraUac', function($query) use ($semestre) {
                $query->where('semestre', '<=', $semestre);
            })->where('parcial', '>=', 4)
            ->get();

        //Quitar submódulos
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

    /**
     * Se obtienen las calificaciones finales sin las materias que está cursando actualmente el alumno.
     *
     * @param $alumno
     * @return mixed
     */
    public function calificacionesHistorialSinMateriasActuales($alumno){

        $semestre = $alumno->semestre;

        if(count($alumno->grupos) > 0){
            $semestre = $alumno->grupos[0]->semestre-1;
        }

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

        $calificaciones = $calificaciones->sortBy(function($dato){
           return $dato->carreraUac->uac->tipo_uac_id;
        });

        $calificaciones = $calificaciones->sortBy(function($dato){
            return $dato->carreraUac->semestre;
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

    /**
     * Se obtienen las calificaciones finales para las materias que el alumno
     * está cursando actualmente dependiendo de su grupo.
     *
     * @param $alumno
     * @return mixed
     */
    public function calificacionesFinalesMateriasActuales($alumno){

        if(count($alumno->grupos) <= 0)
            return null;

        $carreraUac = CarreraUac::with(['calificaciones' => function($query) use ($alumno){
                $query->where('alumno_id', $alumno->usuario_id)->where('parcial', '>', 3)->orderByDesc('parcial');
            }, 'uac'])
            ->where('carrera_id', $alumno->grupos[0]->plantelCarrera->carrera_id)
            ->whereHas('uac', function($query){
                $query->where('tipo_uac_id', '!=', 10)->where('optativa', '!=', 1);
            })->where('semestre', $alumno->grupos[0]->semestre)
            ->get();

        if($alumno->grupos->first()->semestre == 6){
            $optativas = UAC::whereHas('grupoOptativa', function($query) use ($alumno){
                $query->where('grupo_periodo_id', $alumno->grupos->first()->id);
            })->get()->pluck('id')->toArray();

            $uacOptativas = CarreraUac::with(['calificaciones' => function($query) use ($alumno){
                    $query->where('alumno_id', $alumno->usuario_id)->where('parcial', '>', 3)->orderByDesc('parcial');
                }, 'uac'])
                ->whereIn('uac_id', $optativas)
                ->where('carrera_id', $alumno->grupos[0]->plantelCarrera->carrera_id)
                ->get();

            $carreraUac = $carreraUac->merge($uacOptativas);
        }

        $carreraUac = $carreraUac->sortByDesc(function($dato){
            return $dato->uac->tipo_uac_id;
        });

        return $carreraUac;
    }

    /**
     * Se obtienen las calificaciones de tránsito separadas por periodo y con sus
     * respectivos créditos y promedio.
     *
     * @param $alumnoId
     * @return array
     */
    public function calificacionesCreditosTransito($alumnoId){

        $transito = [];
        $calificaciones = CalificacionRevalidacion::with('periodo')->where('alumno_id', $alumnoId)->get();
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
     * @param $materiasActuales
     * @return array
     */
    public function promedioGeneralCreditos($calificaciones, $calificacionesTransito, $materiasActuales){

        $suma = 0;
        $cantidadCalif = 0;
        $creditos = 0;
        $promedio = 0;

        $this->promedioYCreditosCalificacionesFinales($calificaciones, $creditos, $suma, $cantidadCalif);

        if($calificacionesTransito != null){
            $this->promedioYCreditosTransito($calificacionesTransito, $creditos, $suma, $cantidadCalif);
        }

        if($materiasActuales != null){
            $this->promedioYCreditosMateriasActuales($materiasActuales, $creditos, $suma, $cantidadCalif);
        }

        if($cantidadCalif > 0)
            $promedio = round( $suma/$cantidadCalif, 1, PHP_ROUND_HALF_UP);

        $promedioConLetra = $this->promedioConLetra($promedio);

        return [
            'creditos' => $creditos,
            'promedio' => $promedio,
            'promedioConLetra' => $promedioConLetra
        ];
    }

    /**
     * Se obtienen el promedio y créditos de las calificaciones finales que el alumno tiene asignadas.
     *
     * @param $calificaciones
     * @param $creditos
     * @param $suma
     * @param $cantidadCalif
     */
    public function promedioYCreditosCalificacionesFinales($calificaciones, &$creditos, &$suma, &$cantidadCalif){
        foreach ($calificaciones as $uacs){
            foreach ($uacs as $uac){
                $cantidadCalif++;

                //Validar que sea calificacion final o extraordinaria
                if($uac[0]->parcial < 4)
                    continue;

                //Sólo si aprobó se sumarán los créditos
                if($uac[0]->calificacion != null && $uac[0]->calificacion >= 6)
                    $creditos+=$uac[0]->carreraUac->uac->creditos;

                if($uac[0]->calificacion != null && $uac[0]->calificacion >= 0)
                    $suma+=$uac[0]->calificacion;
            }
        }
    }

    public function promedioYCreditosMateriasActuales($materiasActuales, &$creditos, &$suma, &$cantidadCalif){

        if($materiasActuales != null){
            foreach ($materiasActuales as $uac){
                if(count($uac->calificaciones) > 0 && $uac->calificaciones[0]->parcial > 3){
                    if($uac->calificaciones[0]->calificacion >= 6) {
                        $creditos += $uac->uac->creditos;
                    }
                    $cantidadCalif++;
                    $suma += $uac->calificaciones[0]->calificacion;
                }
            }
        }
    }

    public function promedioYCreditosTransito($calificacionesTransito, &$creditos, &$suma, &$cantidadCalif){

        $cantidadCalif+=count($calificacionesTransito['calificaciones']);
        foreach ($calificacionesTransito['creditos'] as $creditosTransito)
            $creditos+=$creditosTransito;
        foreach ($calificacionesTransito['promedios'] as $califTransito)
            $suma+=$califTransito;
    }

    public function promedioConLetra($promedio){
        $promedioConLetra = 'DIEZ';

        if($promedio < 10){
            $digitos = explode('.', $promedio);
            $numeros = ['CERO','UNO','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE'];
            $promedioConLetra = $numeros[$digitos[0]].' PUNTO ';
            $promedioConLetra.=(count($digitos) > 1) ? $numeros[$digitos[1]] : 'CERO';
        }

        return $promedioConLetra;
    }

    public function cantidadMateriasReprobadas($alumnoId){

        $calificaciones = $this->calificacionesHistorial($alumnoId);

        $reprobadas = 0;

        foreach ($calificaciones as $semestre) {
            foreach ($semestre as $uac){
                if($uac[0]->calificacion < 6) {
                    $reprobadas++;
                }
            }
        }

        return $reprobadas;
    }

    public function asignaturasSemestreCarrera($semestre, $carreraId, $grupo){

        $asignaturas = UAC::whereHas('carreras', function($query) use ($carreraId){
                $query->where('carrera_id', $carreraId);
            })->where('semestre', $semestre)
            ->where('optativa', 0)
            ->get();

        if($grupo != null) {
            $optativas = $grupo->optativas()->get();
            $asignaturas = $asignaturas->merge($optativas);
        }

        $asignaturas = $asignaturas->sortBy(function($dato){
           return $dato->id;
        })->values();

        return $asignaturas;
    }

    public function alumnosCalificacionesPorGrupo($grupo, $soloParciales, $soloReprobados = false){

        $parcial = $soloParciales ? 3 : 5;

        $alumnos = GrupoPeriodo::find($grupo->id)->alumnos()
            ->with(['calificacionUac' => function($query) use ($grupo, $parcial){
                $query->where('grupo_periodo_id', $grupo->id)
                    ->where('parcial', '<=', $parcial)
                    ->with('carreraUac.uac')
                    ->orderBy('parcial');
            }])
            ->get();

        if($soloReprobados){
            $alumnos = $this->obtenerAlumnosConMateriasReprobadas($alumnos);
        }

        //Organizar los datos
        $alumnos = $alumnos->map(function($item){
            //Agrupar por asignatura
            $item->calificacionUac = $item->calificacionUac->groupBy('carrera_uac_id')->values();
            //Ordenar por asignatura
            $item->calificacionUac = $item->calificacionUac->sortBy(function($carreraUac){
                return $carreraUac->first()->carreraUac->uac->id.' '.$carreraUac->first()->carreraUac->uac->tipo_uac_id;
            })->values();

            //Ordenar las calificaciones por parcial
            $item->calificacionUac->map(function($califs){

                $califs = $califs->sortBy(function($item){
                    return $item->parcial;
                });
                return $califs;
            });
            return $item;
        });

        $alumnos = $alumnos->sortBy(function($alumno) {
            return Str::upper(Sisec::quitarAcentos($alumno->nombre_por_apellido));
        })->values();

        return $alumnos;
    }

    public function obtenerAlumnosConMateriasReprobadas($alumnos){

        foreach ($alumnos as $key => $alumno){
            $reprobado = false;

            foreach($alumno->calificacionUac as $calificacion) {
                if ($calificacion->calificacion < 6) {
                    $reprobado = true;
                    break;
                }
            }
            if(!$reprobado)
                unset($alumnos[$key]);
        }

        return $alumnos;
    }

    public function formatearArregloDeCalificacionesPorMateria($calificaciones){

        $califs = [];
        foreach($calificaciones as $materia){
            $califs[$materia->first()->carreraUac->uac->clave_uac] = $materia;
        }

        return $califs;

    }

}
