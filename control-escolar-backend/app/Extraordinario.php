<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Extraordinario extends Model
{
    public $timestamps = false;

    protected $table = 'extraordinario';

    protected $fillable = ['grupo_periodo_id', 'plantilla_docente_id', 'carrera_uac_id', 'semestre', 'plantel_id', 'periodo_id', 'estatus'];

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

    public function alumnoGrupoExtraordinario(){
        return $this->hasMany('App\AlumnoGrupoExtraordinario', 'extraordinario_id', 'id');
    }
    
    public function alumnos(){
        return $this->belongsToMany('App\Alumno','alumno_grupo_extraordinario','extraordinario_id','alumno_id',
            'id','usuario_id');
    }

}
