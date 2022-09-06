<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CatTipoUac extends Model
{
    public $timestamps = false;

    protected $table = 'cat_tipo_uac';

    protected $fillable = ['nombre', 'competencias_uac'];

}
