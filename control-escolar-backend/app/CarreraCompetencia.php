<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarreraCompetencia extends Model
{
    public $timestamps = false;

    protected $table = 'carrera_competencia';

    protected $fillable = ['semestre', 'competencia_id', 'carrera_id', 'orden', 'horas', 'creditos'];

    public function competencia(){
        return $this->belongsTo('App\Competencia', 'competencia_id');
    }

    public function carrera(){
        return $this->belongsTo('App\Carrera','carrera_id');
    }
}
