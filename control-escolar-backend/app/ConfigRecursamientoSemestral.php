<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConfigRecursamientoSemestral extends Model
{
    public $timestamps = false;

    protected $table = 'config_recursamiento_semestral';

    protected $fillable = ['fecha_inicio', 'fecha_final', 'plantel_id', 'periodo_id', 'max_alumnos'];

    public function periodo()
    {
        return $this->belongsTo('App\Periodo', 'periodo_id', 'id');
    }

    public function plantel()
    {
        return $this->belongsTo('App\Plantel', 'plantel_id', 'id');
    }

}
