<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PersonalPlantel extends Model
{
    public $timestamps = false;

    protected $table = 'personal_plantel';

    protected $fillable = ['nombre_director', 'titulo_director', 'cargo_director', 'genero_director', 'nombre_control_escolar',
        'titulo_control_escolar', 'cargo_control_escolar', 'genero_control_escolar'];

    public function plantel(){
        return $this->belongsTo('App\Plantel');
    }
}
