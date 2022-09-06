<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UAC extends Model
{
    public $timestamps = false;

    protected $table = 'uac';

    protected $hidden = ['pivot'];

    protected $fillable = ['nombre','clave_uac','md','ei','horas','creditos','semestre',
        'optativa','campo_disciplinar_id','tipo_ac_id','cecyte'];

    public function carreras(){
        return $this->belongsToMany('App\Carrera','carrera_uac','uac_id','carrera_id',
            'id','id');
    }

    public function grupoOptativa(){
        return $this->hasMany('App\GrupoPeriodoOptativa', 'uac_id');
    }

    public function submodulos(){
        return $this->hasMany('App\UAC', 'modulo_id');
    }
    
    public function modulo(){
        return $this->belongsTo('App\UAC', 'modulo_id', 'id');
    }

    public function getNombreModuloAttribute($value){
        $numeros = ['I','II','III','IV','V'];
        return 'Módulo '.$numeros[substr($this->clave_uac, -1)-1].': ';
    }

    public function getNombreSubmoduloAttribute($value){
        return 'Submódulo '.substr($this->clave_uac, -1).' - ';
    }

}
