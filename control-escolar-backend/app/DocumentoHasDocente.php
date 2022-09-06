<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocumentoHasDocente extends Model
{

    public $timestamps = false;
    
    protected $table = 'documentos_docente_has_docente';
    
    protected $fillable = [
        'documentos_docente_id', 'docente_id'
    ];

    public function documento(){
        return $this->belongsTo('App\DocumentoDocente', 'documentos_docente_id', 'id');
    }
    
    public function docente(){
        return $this->belongsTo('App\Docente');
    }

}
