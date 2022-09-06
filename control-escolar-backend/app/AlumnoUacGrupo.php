<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AlumnoUacGrupo extends Model
{
    public $timestamps = false;

    protected $table = 'alumno_uac_grupo';

    protected $fillable = ['alumno_id', 'grupo_periodo_id', 'carrera_uac_id'];

    public function carreraUac(){
        return $this->belongsTo('App\CarreraUac', 'carrera_uac_id', 'id');
    }

    public function alumno(){
        return $this->belongsTo('App\Alumno','alumno_id','usuario_id');
    }

    public function grupo(){
        return $this->belongsTo('App\GrupoPeriodo','grupo_periodo_id','id');
    }

}
