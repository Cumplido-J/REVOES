<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoPlantel extends Model
{
    public $timestamps = false;

    protected $table = 'cat_tipo_plantel';

    protected $fillable = ['nombre'];
}
