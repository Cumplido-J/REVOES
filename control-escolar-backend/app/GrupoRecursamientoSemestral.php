<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GrupoRecursamientoSemestral extends Model
{
    public $timestamps = false;

    protected $table = 'grupo_recursamiento_semestral';

    protected $fillable = ['grupo_periodo_id', 'plantilla_docente_id', 'carrera_uac_id', 'semestre', 'max_alumnos', 'plantel_id', 'periodo_id', 'estatus'];

    public function grupoPeriodo(){
        return $this->belongsTo('App\GrupoPeriodo');
    }

    public function plantel(){
        return $this->belongsTo('App\Plantel');
    }

    public function periodo(){
        return $this->belongsTo('App\Periodo');
    }

    public function carreraUac(){
        return $this->belongsTo('App\CarreraUac');
    }

    public function plantillaDocente(){
        return $this->belongsTo('App\DocentePlantilla', 'plantilla_docente_id', 'id');
    }

    public function alumnoGrupoRecursamientoSemestral(){
        return $this->hasMany('App\AlumnoGrupoRecursamientoSemestral', 'grupo_recursamiento_semestral_id','id');
    }
    
    public function alumnos(){
        return $this->belongsToMany('App\Alumno','alumno_grupo_recursamiento_semestral','grupo_recursamiento_semestral_id','alumno_id',
            'id','usuario_id');
    }

}
