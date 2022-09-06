<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GrupoPeriodo extends Model
{
    public $timestamps = false;

    protected $table = 'grupo_periodo';

    protected $fillable = ['grupo_id', 'periodo_id','plantel_carrera_id', 'grupo', 'turno', 'semestre',
        'max_alumnos','accion','status','id_original','fecha_inicio','fecha_fin','fecha_inicio_irregular',
        'fecha_fin_irregular','tipo_inscripcion'];

    protected $hidden = ['pivot'];

    public function grupo(){
        return $this->belongsTo('App\Grupo');
    }

    public function periodo(){
        return $this->belongsTo('App\Periodo');
    }

    public function alumnos(){
        return $this->belongsToMany('App\Alumno','alumno_grupo','grupo_periodo_id','alumno_id',
            'id','usuario_id');
    }

    public function plantelCarrera(){
        return $this->belongsTo('App\PlantelCarrera','plantel_carrera_id','id');
    }

    public function edicion(){
        return $this->hasOne('App\GrupoPeriodo', 'id_original');
    }

    public function optativas(){
        return $this->belongsToMany('App\UAC','grupo_periodo_optativa',
            'grupo_periodo_id','uac_id','id','id');
    }

    public function alumnoUacGrupo(){
        return $this->hasMany('App\AlumnoUacGrupo', 'grupo_periodo_id','id');
    }

    public function docenteAsignatura(){
        return $this->hasMany('App\DocenteAsignatura', 'grupo_periodo_id', 'id');
    }

}
