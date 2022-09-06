<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AcuseCargaCalificaciones extends Model
{
    public $timestamps = false;

    protected $table = 'acuse_docente_carga_calificaciones_uac';

    protected $fillable = ['fecha', 'data', 'docente_id'];


}
