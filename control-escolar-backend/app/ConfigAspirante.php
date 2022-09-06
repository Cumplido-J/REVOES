<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConfigAspirante extends Model
{
    protected $table = "config_aspirantes";

    public $timestamps = false;

    protected $fillable = ['plantel_id', 'fecha_inicio', 'fecha_fin', 'fecha_examen'];

    public function plantel(){
        return $this->belongsTo('App\Plantel', 'plantel_id', 'id');
    }
}
