<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Aspirante extends Model
{
    use SoftDeletes;

    protected $table = 'aspirante';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $appends = ['nombreCompleto'];

    protected $fillable = ['nombre', 'primer_apellido', 'segundo_apellido', 'curp', 'fecha_nacimiento', 'telefono', 'correo',
        'plantel_id', 'carrera_id', 'fecha_alta', 'domicilio', 'dio_alta', 'estatus_pago', 'contrasena', 'sincronizado'];

    public function carrera(){
        return $this->belongsTo('App\Carrera')->select('id','nombre', 'clave_carrera');
    }

    public function plantel(){
        return $this->belongsTo('App\Plantel')->select('id','nombre', 'numero', 'nombre_final', 'municipio_id');
    }

    public function getNombreCompletoAttribute(){
        $nombreCompleto = "{$this->attributes['nombre']} {$this->attributes['primer_apellido']}";
        if(isset($this->attributes['segundo_apellido'])){
            $nombreCompleto.=" {$this->attributes['segundo_apellido']}";
        }
        return $nombreCompleto;
    }

}
