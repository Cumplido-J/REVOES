<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DocumentoInscripcion extends Model
{
    public $timestamps = false;

    protected $table = 'documento_inscripcion';

    protected $hidden = ['pivot'];

    protected $fillable = ['nombre'];
}
