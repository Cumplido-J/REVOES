<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ConfigFechaPeriodo extends Model
{
    public $timestamps = false;

    protected $table = 'config_fechas_periodo_estado';

    protected $fillable = ['estado_id', 'periodo_id', 'fecha_inicio', 'fecha_fin'];

    public function periodo()
    {
        return $this->belongsTo('App\Periodo', 'periodo_id', 'id');
    }

    public function estado()
    {
        return $this->belongsTo('App\Estado', 'estado_id', 'id');
    }

}
