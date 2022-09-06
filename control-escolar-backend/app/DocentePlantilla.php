<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocentePlantilla extends Model
{

    public $timestamps = false;

    protected $table = 'plantilla_docente';

    protected $fillable = ['fecha_asignacion', 'fecha_inicio_contrato', 'fecha_fin_contrato', 'horas', 'docente_id', 'cat_tipo_Plaza_id', 'plantel_id', 'nombramiento_liga', 'plantilla_estatus'];

    public function docente(){
        return $this->belongsTo('App\Docente');
    }

    public function plantel(){
        return $this->belongsTo('App\Plantel');
    }

    public function tipoPlaza(){
        return $this->belongsTo('App\TipoPlaza', 'cat_tipo_Plaza_id', 'id');
    }

    public function docenteAsignatura(){
        return $this->hasMany('App\DocenteAsignatura', 'plantilla_docente_id', 'id');
    }

    public function asignaturaRecursamientoIntersemestral(){
        return $this->hasMany('App\AsignaturaRecursamientoIntersemestral', 'plantilla_docente_id', 'id');
    }

    public function grupoRecursamientoSemestral(){
        return $this->hasMany('App\GrupoRecursamientoSemestral', 'plantilla_docente_id', 'id');
    }
    
}
