<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Carrera extends Model
{
    public $timestamps = false;

    protected $table = 'carrera';

    protected $fillable = ['nombre','clave_carrera','total_creditos','tipo_perfil_id','tipo_estudio_id',
        'campo_disciplinar_id','tipo_uac_id'];

    public function uac(){
        return $this->belongsToMany('App\UAC','carrera_uac','carrera_id','uac_id',
            'id','id');
    }

    public function carreraUac(){
        return $this->hasMany('App\CarreraUac');
    }

    public function plantelCarrera(){
        return $this->hasMany('App\PlantelCarrera');
    }
}
