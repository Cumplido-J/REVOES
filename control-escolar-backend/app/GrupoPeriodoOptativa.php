<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GrupoPeriodoOptativa extends Model
{
    public $timestamps = false;

    protected $table = 'grupo_periodo_optativa';

    protected $fillable = ['grupo_periodo_id', 'uac_id'];

    public function uac(){
        return $this->belongsTo('App\Uac', 'uac_id', 'id');
    }

    public function grupoPeriodo(){
        return $this->belongsTo('App\GrupoPeriodo');
    }

}
