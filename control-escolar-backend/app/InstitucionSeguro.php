<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class InstitucionSeguro extends Model
{
    public $timestamps = false;
    protected $table = 'cat_instituciones_seguro';
    protected $fillable = ['nombre','siglas'];
}
