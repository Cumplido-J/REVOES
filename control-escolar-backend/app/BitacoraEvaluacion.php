<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BitacoraEvaluacion extends Model
{
    public $timestamps = false;

    protected $table = 'bitacora_evaluacion';

    protected $fillable = ['parcial', 'asistencia', 'examen', 'practicas', 'tareas', 'docente_asignatura_id', 'alumno_id', 'carrera_uac_id', 'plantel_id', 'docente_id', 'periodo_id', 'tipo_evaluacion'];

    public function docenteAsignatura(){
        return $this->belongsTo('App\DocenteAsignatura', 'docente_asignatura_id');
    }

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id');
    }

}
