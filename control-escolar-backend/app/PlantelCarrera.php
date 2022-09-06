<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlantelCarrera extends Model
{
    public $timestamps = false;

    protected $table = 'plantel_carrera';

    public function plantel(){
        return $this->belongsTo('App\Plantel', 'plantel_id');
    }

    public function carrera(){
        return $this->belongsTo('App\Carrera','carrera_id');
    }
}
