<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AlumnoGrupoRecursamientoIntersemestral extends Pivot
{
    public $timestamps = false;

    protected $appends = ['calificacionesCI', 'parcialesAprobados'];

    protected $table = 'alumno_grupo_recursamiento_intersemestral';

    protected $fillable = ['alumno_id', 'grupo_recursamiento_intersemestral_id'];

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function grupoRecursamientoIntersemestral(){
        return $this->belongsTo('App\GrupoRecursamientoIntersemestral', 'grupo_recursamiento_intersemestral_id', 'id');
    }

    public function getCalificacionesCIAttribute($value){

        $asignatura_ci = AsignaturaRecursamientoIntersemestral::where('grupo_recursamiento_intersemestral_id', $this->attributes['grupo_recursamiento_intersemestral_id'])->first();
        if($asignatura_ci){
            $calificaciones_evaluadas = [];
            $parcialesAprobados = [];
            /* comporbar tipo de materia uac */
            $carrera_uac = CarreraUac::find($asignatura_ci->carrera_uac_id);
            $uac = UAC::find($carrera_uac->uac_id);
            if($uac->modulo_id){
                /* obtener calificaciones ci diferentes a los parciales aprobados */
                $calificaciones_ci = CalificacionUac::where([
                    ['alumno_id', $this->attributes['alumno_id']],
                    ['carrera_uac_id', $asignatura_ci->carrera_uac_id],
                    ['parcial', '<', 4],
                    ['tipo_calif', 'CI'],
                ])->orderBy('parcial')->get();
                foreach($calificaciones_ci as $obj){
                    array_push($calificaciones_evaluadas, $obj);
                    array_push($parcialesAprobados, $obj->parcial);
                }
                /* obtener calificaciones aprobatorias curso normal */
                $calificaciones_aprobatorias_ordinaria = CalificacionUac::where([
                    ['alumno_id', $this->attributes['alumno_id']],
                    ['carrera_uac_id', $asignatura_ci->carrera_uac_id],
                    ['calificacion', '>', 5],
                    ['parcial', '<', 4],
                    ['tipo_calif', null],
                ])->orderBy('parcial')->get();
                foreach($calificaciones_aprobatorias_ordinaria as $obj){
                    if(!in_array($obj->parcial, $parcialesAprobados)){
                        array_push($calificaciones_evaluadas, $obj);
                    }
                }
                /* obtener calificacion final de tipo CI */
                $calificaciones_final_ci = CalificacionUac::where([
                    ['alumno_id', $this->attributes['alumno_id']],
                    ['carrera_uac_id', $asignatura_ci->carrera_uac_id],
                    ['parcial', 6]
                ])->orderBy('parcial')->get();
                foreach($calificaciones_final_ci as $obj){
                    array_push($calificaciones_evaluadas, $obj);
                }
            }else{
                 /* obtener calificaciones aprobatorias ci */
                 $calificaciones_aprobatorias_ci = CalificacionUac::where([
                    ['alumno_id', $this->attributes['alumno_id']],
                    ['carrera_uac_id', $asignatura_ci->carrera_uac_id],
                    ['tipo_calif', 'CI'],
                ])->orderBy('parcial')->get();
                foreach($calificaciones_aprobatorias_ci as $obj){
                    array_push($calificaciones_evaluadas, $obj);
                }
            }
            /* sort calificaciones parciales */
            usort($calificaciones_evaluadas, function ($a, $b) {
                return $a['parcial'] <=> $b['parcial'];
            });
            return $calificaciones_evaluadas;
        }else{
            return [];
        }
    }

    public function getParcialesAprobadosAttribute($value){
        $asignatura_ci = AsignaturaRecursamientoIntersemestral::where('grupo_recursamiento_intersemestral_id', $this->attributes['grupo_recursamiento_intersemestral_id'])->first();
        if($asignatura_ci){
            /* comporbar tipo de materia uac */
            $carrera_uac = CarreraUac::find($asignatura_ci->carrera_uac_id);
            $uac = UAC::find($carrera_uac->uac_id);
            if($uac->modulo_id){     
                $parciales = [];
                /* obtener calificaciones aprobatorias curso normal */
                $calificaciones_aprobatorias_ordinaria = CalificacionUac::where([
                    ['alumno_id', $this->attributes['alumno_id']],
                    ['carrera_uac_id', $asignatura_ci->carrera_uac_id],
                    ['calificacion', '>', 5],
                    ['parcial', '<', 4],
                    ['tipo_calif', null],
                ])->orderBy('parcial')->get();
                foreach($calificaciones_aprobatorias_ordinaria as $obj){
                    array_push($parciales, $obj->parcial);
                }
                return $parciales;
            }else{
                return [];
            }
        }else{
            return [];
        }
    }
}
