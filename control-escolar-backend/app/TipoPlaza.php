<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TipoPlaza extends Model
{
    public $timestamps = false;

    protected $table = 'cat_tipo_Plaza';

    protected $fillable = ['nombre'];
}
