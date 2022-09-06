<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GradoEstudio extends Model
{
    public $timestamps = false;

    protected $table = 'cat_grado_estudio';

    protected $fillable = ['nombre'];
}
