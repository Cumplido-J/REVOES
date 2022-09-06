<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Competencia extends Model
{
    public $timestamps = false;

    protected $table = 'competencia';

    protected $fillable = ['modulo','competencia_emsad'];

    public function carreras(){
        return $this->belongsToMany('App\Carrera','carrera_competencia','competencia_id','carrera_id',
            'id','id');
    }
}
