<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UsuarioDocente extends Model
{

    public $timestamps = false;
    
    protected $table = 'usuario_docente';
    
    protected $fillable = [
        'docente_id', 'usuario_id'
    ];

   
}
