<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    public $timestamps = false;

    protected $table = 'cat_estado';

    protected $fillable = ['nombre','abreviatura','nombre_oficial'];

    public function datos(){
        return $this->hasOne('App\EstadoDatos', 'estado_id', 'id');
    }

    public function municipios(){
        return $this->hasMany('App\Municipio', 'estado_id', 'id');
    }

}
