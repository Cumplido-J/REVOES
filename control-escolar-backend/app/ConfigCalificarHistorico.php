<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConfigCalificarHistorico extends Model
{
    public $timestamps = false;

    protected $table = 'config_calificar_historico';

    protected $fillable = ['fecha_inicio', 'fecha_final', 'parcial', 'plantel_id', 'periodo_id'];

    public function plantel()
    {
        return $this->belongsTo('App\Plantel', 'plantel_id', 'id');
    }

}
