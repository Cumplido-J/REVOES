<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CicloEscolar extends Model
{
    public $timestamps = false;

    protected $table = 'ciclo_escolar';

    protected $fillable = ['fecha_inicio','fecha_fin','nombre'];
}
