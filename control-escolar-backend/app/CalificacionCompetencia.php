<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CalificacionCompetencia extends Model
{
    public $timestamps = false;

    public $table = 'calificacion_competencia';

    protected $fillable = ['alumno_id','carrera_competencia_id','grupo_periodo_id','periodo_id','calificacion','plantel_id'];

    public function alumno(){
        return $this->belongsTo('App\Alumno');
    }

    public function carreraCompetencia(){
        return $this->belongsTo('App\CarreraCompetencia');
    }

    public function grupoPeriodo(){
        return $this->belongsTo('App\GrupoPeriodo');
    }

    public function periodo(){
        return $this->belongsTo('App\Periodo');
    }
}
