<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CarreraUac extends Model
{
    public $timestamps = false;

    protected $table = 'carrera_uac';

    protected $fillable = ['semestre', 'uac_id', 'carrera_id'];

    public function uac(){
        return $this->belongsTo('App\UAC', 'uac_id');
    }

    public function carrera(){
        return $this->belongsTo('App\Carrera','carrera_id');
    }

    public function calificaciones(){
        return $this->hasMany('App\CalificacionUac');
    }

    public function docenteAsignatura(){
        return $this->hasMany('App\DocenteAsignatura', 'carrera_uac_id', 'id');
    }

}
