<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OpcionEducativa extends Model
{
    public $timestamps = false;

    protected $table = 'cat_opcion_educativa';

    protected $fillable = ['nombre', 'modalidad', 'observacion'];
}
