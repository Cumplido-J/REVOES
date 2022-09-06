<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EstadoDatos extends Model
{

    protected $primaryKey = 'estado_id';

    protected $fillable = ['estado_id', 'titulo_director', 'nombre_director', 'genero_director'];

}
