<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Auth;

class Docente extends Model 
{

    public $timestamps = false;
   
    protected $table = 'docente';

    protected $fillable = ['nombre', 'primer_apellido', 'segundo_apellido', 'correo', 'correo_inst', 'num_nomina', 'curp', 'rfc', 'fecha_nacimiento', 'genero', 'direccion',
    'cp', 'telefono', 'fecha_ingreso', 'fecha_baja', 'fecha_reingreso', 'tipo_sangre', 'docente_estatus', 'cat_municipio_nacimiento_id', 'cat_municipio_direccion_id',
    'maximo_grado_estudio', 'fecha_egreso', 'documento_comprobatorio', 'cedula', 'comentario'];
    
 
    public function lugarNacimiento(){
        return $this->belongsTo('App\Municipio', 'cat_municipio_nacimiento_id', 'id');
    }

    public function lugarDireccion(){
        return $this->belongsTo('App\Municipio', 'cat_municipio_direccion_id', 'id');
    }

    public function docentePlantilla(){
        return $this->hasMany('App\DocentePlantilla');
    }
    
    public function scopeLogHasDocente($query){
        return $lastActivity = LogsActivity::all()->last();
    }

    public function documentoHasDocente(){
        return $this->hasMany('App\DocumentoHasDocente');
    }

    public function scopeActive($query)
    {
    return $query->where('docente_estatus', '>', 0);
    }


}
