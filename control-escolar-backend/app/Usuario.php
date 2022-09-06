<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    use HasRoles, Notifiable;

    protected $table = 'usuario';
    protected $guard_name = 'api';

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fecha_insert', 'username','nombre', 'primer_apellido','segundo_apellido','email','password','estatus'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
    */

    protected $hidden = [
        'password', 'pivot'
    ];

    public function planteles(){
        return $this->belongsToMany('App\Plantel', 'usuario_alcance','usuario_id','plantel_id',
            'id','id');
    }

    public function estados(){
        return $this->belongsToMany('App\Estado', 'usuario_alcance','usuario_id','estado_id',
            'id','id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
