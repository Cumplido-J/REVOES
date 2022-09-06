<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;

class DocumentoDocente extends Model
{
    /* use LogsActivity; */

    public $timestamps = false;

    protected static $logFillable = true;

    protected static $logName = 'Documentación';

 /*    protected static $logAttributes = ['documentoHasDocente.docente_id']; */
    
   /*  public function user()
    {
        return $this->belongsTo(Usuario::class);
    } */
    
    protected $table = 'documentos_docente';
    
    protected $fillable = [
        'nombre'
    ];
    
    public function documentoHasDocente(){
        return $this->hasMany('App\DocumentoHasDocente', 'documentos_docente_id', 'id');
    }
    
}
