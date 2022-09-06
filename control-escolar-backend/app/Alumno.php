<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Sisec;
use Carbon\Carbon;

class Alumno extends Model
{
    public $timestamps = false;

    protected $table = 'alumno';

    protected $primaryKey = 'usuario_id';

    protected $fillable = ['usuario_id', 'matricula', 'periodo_inicio', 'periodo_termino', 'generacion', 'calificacion', 'creditos_obtenidos',
        'reprobado', 'es_bach_tec', 'semestre', 'aviso_privacidad_aceptado', 'alumno_estatus', 'plantel_carrera_id', 'plantel_id',
        'carrera_id', 'certificado_parcial', 'genero', 'numero_contacto', 'numero_movil', 'direccion', 'codigo_postal', 'cambio_subsistema',
        'cambio_carrera', 'estatus', 'tipo_alumno', 'tipo_trayectoria', 'permitir_inscripcion', 'estatus_inscripcion','listo_para_certificacion', 'ruta_fotografia'];

    /*protected $fillable = ['id','nombre','primer_apellido','segundo_apellido','numero_contacto','numero_movil','direccion',
        'codigo_postal','semestre','matricula','plantel_id','carrera_id','cambio_subsistema','cambio_carrera','estatus',
        'tipo_alumno','tipo_trayectoria'];*/

    protected $hidden = ['pivot'];

    public function grupos(){
        return $this->belongsToMany('App\GrupoPeriodo','alumno_grupo','alumno_id','grupo_periodo_id',
            'usuario_id','id')->withPivot('status as estado_inscripcion','id as alumno_grupo_id');
    }

    public function usuario(){
        return $this->belongsTo('App\Usuario','usuario_id','id');
    }

    public function documentos(){
        return $this->belongsToMany('App\DocumentoInscripcion','documento_inscripcion_alumno',
            'alumno_id','documento_id','usuario_id','id');
    }

    public function materiasIrregulares(){
        return $this->hasMany('App\AlumnoUacGrupo','alumno_id','usuario_id');
    }

    public function calificacionUac(){
        return $this->hasMany('App\CalificacionUac','alumno_id','usuario_id');
    }

    public function bitacoraEvaluacion(){
        return $this->hasMany('App\BitacoraEvaluacion','alumno_id','usuario_id');
    }

    public function plantel(){
        return $this->belongsTo('App\Plantel');
    }

    public function carrera(){
        return $this->belongsTo('App\Carrera');
    }

    public function tutores(){
        return $this->hasMany('App\Tutor', 'alumno_id', 'usuario_id');
    }

    public function expediente(){
        return $this->hasOne('App\ExpedienteAlumno', 'alumno_id', 'usuario_id');
    }

    public function getNombreCompletoAttribute($value){
        $usuario = $this->usuario;
        return $usuario->nombre.' '.$usuario->primer_apellido.' '.$usuario->segundo_apellido;
    }

    public function getNombrePorApellidoAttribute($value){
       $usuario = $this->usuario;
       return $usuario->primer_apellido.' '.$usuario->segundo_apellido.' '.$usuario->nombre;
    }

    public function getSexoAttribute($value){
        $sexo = $this->genero;
        if($sexo == ''){
            try{
                $sexo = substr($this->usuario->username, 10, 1);
            }catch(Exception $e){
                return '';
            };
        }

        if($sexo == 'H'){
            return 'Masculino';
        }else if($sexo == 'M'){
            return 'Femenino';
        }

        return '';
    }

    public function getFechaNacimientoAttribute($value){
        $expediente = $this->expediente()->first();
        if($expediente != null && $expediente->fecha_nacimiento != null){
            return Carbon::createFromFormat('Y-m-d', $expediente->fecha_nacimiento)->format('d/m/Y');
        }else{
            return Sisec::obtenerFechaNacimiento($this->usuario->username);
        }
    }


}
