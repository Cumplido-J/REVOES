<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ExpedienteAlumno extends Model
{
    public $timestamps = false;
    protected $primaryKey= 'alumno_id';
    protected $table = 'expediente_alumno';
    protected $fillable = ['alumno_id', 'nss', 'institucion_nss', 'tipo_sangre', 'fecha_nacimiento', 'estado_nacimiento_id',
        'municipio_nacimiento_id', 'codigo_postal_nacimiento', 'pais_nacimiento'];

    public function alumno(){
        return $this->belongsTo('App\Alumno', 'alumno_id', 'usuario_id');
    }

    public function institucion(){
        return $this->belongsTo('App\InstitucionSeguro', 'institucion_id', 'id');
    }

    public function estadoNacimiento(){
        return $this->belongsTo('App\Estado', 'estado_nacimiento_id', 'id');
    }

    public function municipioNacimiento(){
        return $this->belongsTo('App\Municipio', 'municipio_nacimiento_id', 'id');
    }
}
