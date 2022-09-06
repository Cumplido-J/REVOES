<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AsignaturaRecursamientoIntersemestral extends Model
{
    public $timestamps = false;

    protected $table = 'asignatura_recursamiento_intersemestral';

    protected $fillable = ['grupo_recursamiento_intersemestral_id', 'grupo_periodo_id', 'plantilla_docente_id', 'carrera_uac_id', 'plantel_id', 'periodo_id', 'estatus'];

    public function grupoRecursamientoIntersemestral(){
        return $this->belongsTo('App\GrupoRecursamientoIntersemestral');
    }

    public function grupoPeriodo(){
        return $this->belongsTo('App\GrupoPeriodo');
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

}
