<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    public $timestamps = false;

    protected $table = 'grupo';

    protected $fillable = ['grupo','semestre','turno','plantel_carrera_id',
        'status','created_at','id_original','accion'];

    protected $hidden = ['pivot'];

    public function plantelCarrera(){
        return $this->belongsTo('App\PlantelCarrera','plantel_carrera_id','id');
    }

    public function periodos(){
        return $this->belongsToMany('App\Periodo','grupo_periodo','grupo_id','periodo_id');
    }

    public function grupoPeriodos(){
        return $this->hasMany('App\GrupoPeriodo','grupo_id','id');
    }

    public function edicion(){
        return $this->hasOne('App\Grupo', 'id_original');
    }
}
