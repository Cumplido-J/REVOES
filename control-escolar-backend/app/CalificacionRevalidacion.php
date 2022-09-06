<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CalificacionRevalidacion extends Model
{
    protected $table = "calificacion_revalidacion";

    public $timestamps = false;

    protected $fillable = ['alumno_id', 'cct', 'tipo_asignatura', 'calificacion', 'creditos', 'horas', 'periodo_id'];

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function periodo(){
        return $this->belongsTo('App\Periodo');
    }
}
