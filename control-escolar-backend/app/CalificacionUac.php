<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CalificacionUac extends Model
{
    public $timestamps = false;

    protected $table = 'calificacion_alumno_uac';

    protected $fillable = ['alumno_id','carrera_uac_id','grupo_periodo_id', 'grupo_recursamiento_intersemestral_id', 'grupo_recursamiento_semestral_id', 'grupo_extraordinario_id', 'calificacion','periodo_id','plantel_id', 'docente_id', 'parcial', 'faltas', 'tipo_calif'];

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function carreraUac(){
        return $this->belongsTo('App\CarreraUac');
    }

    public function grupoPeriodo(){
        return $this->belongsTo('App\GrupoPeriodo');
    }

    public function periodo(){
        return $this->belongsTo('App\Periodo');
    }

    public function docente(){
        return $this->belongsTo('App\Docente');
    }
}
