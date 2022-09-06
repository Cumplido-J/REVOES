<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AlumnoGrupo extends Pivot
{
    public $timestamps = false;

    protected $table = 'alumno_grupo';

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function grupo(){
        return $this->belongsTo('App\GrupoPeriodo', 'grupo_periodo_id', 'id');
    }
}
