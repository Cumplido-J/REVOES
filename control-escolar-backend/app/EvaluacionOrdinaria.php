<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EvaluacionOrdinaria extends Model
{
    public $timestamps = false;

    protected $table = 'evaluaciones_ordinarias';

    protected $fillable = ['fecha_inicio', 'fecha_fin', 'perdiodo_id'];

    public function periodo()
    {
        return $this->belongsTo('App\Periodo');
    }
}
