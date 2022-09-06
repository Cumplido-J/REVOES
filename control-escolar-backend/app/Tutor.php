<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    public $timestamps = false;
    protected $table = 'tutor';
    protected $fillable = ['nombre', 'primer_apellido', 'segundo_apellido', 'alumno_id', 'numero_telefono'];
    protected $appends = ['nombre_completo'];

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function getNombreCompletoAttribute($value){
        return $this->attributes['nombre'].' '.$this->attributes['primer_apellido'].' '.$this->attributes['segundo_apellido'];
    }
}
