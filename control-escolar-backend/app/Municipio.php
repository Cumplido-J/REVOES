<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Municipio extends Model
{
    public $timestamps = false;

    protected $table = 'cat_municipio';

    protected $fillable = ['nombre', 'localidad','estado_id'];

    public function estado(){
        return $this->belongsTo('App\Estado', 'estado_id', 'id');
    }

    public function planteles(){
        return $this->hasMany('App\Plantel', 'municipio_id', 'id');
    }
}
