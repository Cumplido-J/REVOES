<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConfigEvaluacionExtraordionaria extends Model
{
    public $timestamps = false;

    protected $table = 'config_evaluaciones_extraordinarias';

    protected $fillable = ['fecha_inicio', 'fecha_final', 'plantel_id', 'periodo_id', 'estatus', 'comentario'];

    public function periodo()
    {
        return $this->belongsTo('App\Periodo', 'periodo_id', 'id');
    }

    public function plantel()
    {
        return $this->belongsTo('App\Plantel', 'plantel_id', 'id');
    }

}
