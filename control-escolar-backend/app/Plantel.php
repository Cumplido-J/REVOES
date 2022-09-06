<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Plantel extends Model
{
    public $timestamps = false;

    protected $table = 'plantel';

    protected $fillable = ['nombre','cct','fecha_sinems','pdf_nombre','pdf_numero',
        'nombre_final','municipio_id','tipo_plantel_id','iems_id','opcion_educativa_id'];

    public function municipio(){
        return $this->belongsTo('App\Municipio', 'municipio_id', 'id');
    }

    public function opcionEducativa(){
        return $this->belongsTo('App\OpcionEducativa');
    }

    public function tipoPlantel(){
        return $this->belongsTo('App\TipoPlantel', 'tipo_plantel_id', 'id');
    }

    public function iems(){
        return $this->belongsTo('App\Iems');
    }

    public function personal(){
        return $this->hasOne('App\PersonalPlantel');
    }

    public function plantelCarreras()
    {
        return $this->hasMany('App\PlantelCarrera', 'plantel_id');
    }

    public function evaluacionesOrdinarias()
    {
        return $this->hasMany('App\ConfigEvaluacionOrdinariaParcial', 'plantel_id');
    }

    public function evaluacionesExtraordinarias()
    {
        return $this->hasMany('App\ConfigEvaluacionExtraordionaria', 'plantel_id');
    }

    public function recuperacionParciales()
    {
        return $this->hasMany('App\ConfigRecuperacionParcial', 'plantel_id');
    }

    public function recursamientoIntersemestrales()
    {
        return $this->hasMany('App\ConfigRecursamientoIntersemestral', 'plantel_id');
    }

    public function recursamientoSemestrales()
    {
        return $this->hasMany('App\ConfigRecursamientoSemestral', 'plantel_id');
    }

    public function configExtraordinario()
    {
        return $this->hasMany('App\ConfigEvaluacionExtraordionaria', 'plantel_id');
    }

    public function configCalificarHistorico()
    {
        return $this->hasMany('App\ConfigCalificarHistorico', 'plantel_id');
    }

}
