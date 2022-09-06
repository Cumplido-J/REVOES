<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use App\Helpers\Interfaces\AuditoriaLogInterface as AudotoriaContract;

class Auditoria extends Model implements AudotoriaContract
{
    public $guarded = [];

    public $timestamps = false;
    
    protected $casts = [
        'properties' => 'collection',
    ];

    public function __construct(array $attributes = [])
    {
        
        if (! isset($this->table)) {
            $this->setTable('auditoria');
        }
          
    }

    public function causer()
    {
        return $this->belongsTo('App\Usuario', 'usuario_id');
    }

}
