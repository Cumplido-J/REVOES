<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Periodo extends Model
{
    public $timestamps = false;

    protected $table = 'periodo';

    protected $fillable = ['fecha_inicio','fecha_fin','nombre','ciclo_escolar_id','nombre_con_mes'];

    public function cicloEscolar()
    {
        return $this->belongsTo('App\CicloEscolar');
    }
}
