<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Iems extends Model
{
    public $timestamps = false;

    protected $table = 'cat_iems';

    protected $fillable = ['nombre', 'siglas'];
}
