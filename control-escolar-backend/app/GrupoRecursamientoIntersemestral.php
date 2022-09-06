<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GrupoRecursamientoIntersemestral extends Model
{
    public $timestamps = false;

    protected $table = 'grupo_recursamiento_intersemestral';

    protected $fillable = ['semestre', 'max_alumnos', 'plantel_id', 'plantel_carrera_id', 'periodo_id', 'estatus'];

  
    public function plantel(){
        return $this->belongsTo('App\Plantel');
    }

    public function periodo(){
        return $this->belongsTo('App\Periodo');
    }

    public function asignaturaIntersemestral(){
        return $this->belongsTo('App\AsignaturaRecursamientoIntersemestral','id', 'grupo_recursamiento_intersemestral_id');
    }

    public function alumnoGrupoRecursamientoIntersemestral(){
        return $this->hasMany('App\AlumnoGrupoRecursamientoIntersemestral', 'grupo_recursamiento_intersemestral_id','id');
    }
    
    public function alumnos(){
        return $this->belongsToMany('App\Alumno','alumno_grupo_recursamiento_intersemestral','grupo_recursamiento_intersemestral_id','alumno_id',
            'id','usuario_id');
    }

}
