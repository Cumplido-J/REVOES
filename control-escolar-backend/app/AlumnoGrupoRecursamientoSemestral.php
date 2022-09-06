<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AlumnoGrupoRecursamientoSemestral extends Model
{
    public $timestamps = false;
    //public static $snakeAttributes = false;
    protected $appends = ['calificacionesRS'];

    protected $table = 'alumno_grupo_recursamiento_semestral';

    protected $fillable = ['alumno_id', 'grupo_recursamiento_semestral_id', 'periodo_curso_id', 'carrera_uac_curso_id'];

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function periodoCurso(){
        return $this->belongsTo('App\Periodo', 'periodo_curso_id', 'id');
    }

    public function getCalificacionesRSAttribute($value){

        $grupo_rs = GrupoRecursamientoSemestral::find($this->attributes['grupo_recursamiento_semestral_id']);
        if($grupo_rs){
            $calificaciones = CalificacionUac::where([
                ['alumno_id', $this->attributes['alumno_id']],
                ['carrera_uac_id', $this->attributes['carrera_uac_curso_id']],
                ['periodo_id', $grupo_rs->periodo_id],
                ['grupo_recursamiento_semestral_id', $this->attributes['grupo_recursamiento_semestral_id']]
            ])->orderBy('parcial')->get();
            if(count($calificaciones) > 0){
                return $calificaciones;
            }else{
                return $calificaciones = CalificacionUac::where([
                    ['alumno_id', $this->attributes['alumno_id']],
                    ['carrera_uac_id', $grupo_rs->carrera_uac_id],
                    ['periodo_id', $grupo_rs->periodo_id],
                    ['grupo_recursamiento_semestral_id', $this->attributes['grupo_recursamiento_semestral_id']]
                ])->orderBy('parcial')->get();
            }
        }else{
            return [];
        }
    }

    public function carreraUacCurso(){
        return $this->belongsTo('App\CarreraUac', 'carrera_uac_curso_id', 'id');
    }

    public function grupoRecursamientoSemestral(){
        return $this->belongsTo('App\GrupoRecursamientoSemestral', 'grupo_recursamiento_semestral_id', 'id');
    }
}
