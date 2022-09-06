<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocenteAsignatura extends Model
{
    public $timestamps = false;

    protected $table = 'docente_asignatura';

    protected $fillable = ['grupo_periodo_id', 'plantilla_docente_id', 'carrera_uac_id', 'plantel_id', 'periodo_id', 'estatus'];

    public function grupoPeriodo(){
        return $this->belongsTo('App\GrupoPeriodo', 'grupo_periodo_id', 'id');
    }

    public function plantel(){
        return $this->belongsTo('App\Plantel');
    }

    public function carreraUac(){
        return $this->belongsTo('App\CarreraUac');
    }

    public function periodo(){
        return $this->belongsTo('App\Periodo');
    }

    public function plantillaDocente(){
        return $this->belongsTo('App\DocentePlantilla', 'plantilla_docente_id', 'id');
    }

    public function rubricasEvaluacion(){
        return $this->hasMany('App\RubricasEvaluacion', 'docente_asignatura_id', 'id');
    }

}
