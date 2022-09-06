<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AlumnoGrupoExtraordinario extends Model
{
    public $timestamps = false;
    //public static $snakeAttributes = false;
    protected $appends = ['calificacionesEXT'];

    protected $table = 'alumno_grupo_extraordinario';

    protected $fillable = ['alumno_id', 'extraordinario_id', 'periodo_curso_id', 'carrera_uac_curso_id'];

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function periodoCurso(){
        return $this->belongsTo('App\Periodo', 'periodo_curso_id', 'id');
    }

    public function getCalificacionesEXTAttribute($value){

        $grupo_ext = Extraordinario::find($this->attributes['extraordinario_id']);
        if($grupo_ext){
            $calificaciones = CalificacionUac::where([
                ['alumno_id', $this->attributes['alumno_id']],
                ['carrera_uac_id', $this->attributes['carrera_uac_curso_id']],
                ['periodo_id', $grupo_ext->periodo_id],
                ['grupo_extraordinario_id', $this->attributes['extraordinario_id']]
            ])->orderBy('parcial')->get();
            if(count($calificaciones) > 0){
                return $calificaciones;
            }else{
                return $calificaciones = CalificacionUac::where([
                    ['alumno_id', $this->attributes['alumno_id']],
                    ['carrera_uac_id', $grupo_ext->carrera_uac_id],
                    ['periodo_id', $grupo_ext->periodo_id]
                ])->orderBy('parcial')->get();
            }
        }else{
            return [];
        }
    }

    public function carreraUacCurso(){
        return $this->belongsTo('App\CarreraUac', 'carrera_uac_curso_id', 'id');
    }

    public function extraordinario(){
        return $this->belongsTo('App\Extraordinario', 'extraordinario_id', 'id');
    }
}
