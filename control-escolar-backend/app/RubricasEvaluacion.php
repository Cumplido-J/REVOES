<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RubricasEvaluacion extends Model
{
    public $timestamps = false;

    protected $table = 'rubricas_evaluacion';

    protected $fillable = ['parcial', 'total_asistencias', 'asistencia', 'examen', 'practicas', 'tareas', 'docente_asignatura_id'];

    public function docenteAsignatura(){
        return $this->belongsTo('App\DocenteAsignatura', 'docente_asignatura_id', 'id');
    }

}
