<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CompetenciaSubModulo extends Model
{
    public $timestamps = false;

    protected $table = 'competencia_sub_modulo';

    protected $fillable = ['uac_id','competencia_id'];

    public function uac(){
        return $this->belongsTo('App\UAC', 'uac_id');
    }

    public function competencia(){
        return $this->belongsTo('App\Competencia','competencia_id');
    }
}
