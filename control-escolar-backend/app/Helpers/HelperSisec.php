<?php

namespace App\Helpers;

use App\DocentePlantilla;
use App\Estado;
use App\Periodo;
use App\Plantel;
use App\Usuario;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;

class HelperSisec {

    /**
     * Obtiene los ids de todos los planteles que tiene asignados el usuario logueado.
     *
     * @return array
     */
    public static function plantelesUsuario(){

        $user = auth()->user();

        $roles = $user->getRoleNames()->toArray();
        $planteles = [];

        $alcance = DB::table('administrador_alcance_usuario')->where('usuario_id', $user->id)->get();

        foreach ($alcance as $a){
            $detalle = DB::table('detalle_alcance')->where('catalcanceusuario_id', $a->catalcance_id)->first();

            if($detalle->plantel_id == null) {
                $plantelesPorEstado = Plantel::select('id')->whereHas('municipio.estado', function($query) use ($detalle){
                    $query->where('estado_id', $detalle->estado_id);
                })->get()->pluck('id')->toArray();
                $planteles = array_merge($planteles, $plantelesPorEstado);
            }else if($detalle->plantel_id != null)
                array_push($planteles, $detalle->plantel_id);
        }

        //Si el usuario es también un docente
        if(in_array('ROLE_DOCENTE', $roles)){
            $usuario_docente = DB::table('usuario_docente')->where('usuario_id', $user->id)->first();

            $plantilla = DocentePlantilla::where('docente_id', $usuario_docente->docente_id)
                ->where('fecha_fin_contrato', null)
                ->get();

            foreach ($plantilla as $p){
                array_push($planteles, $p->plantel_id);
            }
        }

        return array_unique($planteles);

    }

    public static function estadosUsuario($idUsuario){

        $estados = [];

        $alcance = DB::table('administrador_alcance_usuario')->where('usuario_id', $idUsuario)->get();

        foreach ($alcance as $a){
            $detalle = DB::table('detalle_alcance')->where('catalcanceusuario_id', $a->catalcance_id)->first();

            if($detalle->plantel_id == null) {
                $estado = Estado::find($detalle->estado_id)->first()->pluck('id')->toArray();
                $estados = array_merge($estados, $estado);
            }
        }

        return array_unique($estados);
    }

    /**
     * Verifica si el usuario logueado tiene permiso para consultar información de un plantel.
     *
     * @param $plantelId
     * @return bool
     */
    public static function tienePermisoParaPlantel($plantelId){

        return in_array($plantelId, self::plantelesUsuario());

    }

    /**
     * Se valida que el usuario tenga alcance nacional o tenga permiso para consultar la información
     * de un plantel específico
     *
     * @param $plantelId
     * @return bool
     */
    public static function validarAlcance($plantelId){

        if($plantelId == null)
            return false;

        return auth()->user()->hasPermissionTo('Nacional') || self::tienePermisoParaPlantel($plantelId);

    }

    /**
     * Se valida que el usuario tenga alcance nacional o tenga permiso para consultar la información
     * de un plantel específico
     *
     * @param $estadoId
     * @return bool
     */
    public static function validarAlcanceEstatal($estadoId){

        if($estadoId == null)
            return false;

        return auth()->user()->hasPermissionTo('Nacional') || in_array($estadoId, self::estadosUsuario(auth()->user()->id));

    }

    /**
     * Se valida que el usuario tenga permiso para consultar la información de un plantel y
     * que tenga asignado el permiso para realizar una acción.
     *
     * @param $plantelId
     * @param $permiso
     * @return bool
     */
    public static function validarAlcanceYPermiso($plantelId, $permiso){

        return self::validarAlcance($plantelId) && auth()->user()->hasPermissionTo($permiso);

    }

    /**
     * Se obtiene el periodo que está activo actualmente (El último añadido a la bd)
     *
     * @return Periodo
     */
    public static function periodoActual(){

        return Periodo::orderBy('id', 'DESC')->first();

    }

    public static function obtenerFechaNacimiento($curp){
        try{
            $fecha = Str::substr($curp, 4, 6);
            return Carbon::createFromFormat('ymd', $fecha)->format('d/m/Y');
        }catch (\Exception $e){
            return '';
        }
    }

    public static function obtenerFechaActual(){

        $fecha = Carbon::now();

        $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        return $fecha->day.' de '.$meses[$fecha->month-1].' de '.$fecha->year;
    }

    public static function quitarAcentos($string){
        return strtr(utf8_decode($string), utf8_decode('àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'), 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');
    }

    public static function quitarAcentos2($palabra){

        $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿ';
        $modificadas = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYBSAAAAAAACEEEEIIIIDNOOOOOOUUUYYBY';
        $palabra = utf8_decode($palabra);
        $palabra = strtr($palabra, utf8_decode($originales), $modificadas);
        $palabra = strtoupper(utf8_encode($palabra));
        return $palabra;
    }

    public static function generarCurpExtranjero($params){

        $primerApellido = self::quitarAcentos2($params['primer_apellido']);
        if(isset($params['segundo_apellido'])) {
            $segundoApellido = self::quitarAcentos2($params['segundo_apellido']);
        }else{
            $segundoApellido = "";
        }
        $nombre = self::quitarAcentos2($params['nombre']);
        $abreviaciones = ['AS', 'BC','BS','CC','CL','CS','CH','DF','DG','GT','GR','HG','JC','MC','MN','MS','NT',
            'NL','OC','PL','QR','SP','SL','SR','TC','TS','TL','VZ','YN','ZS'];
        $plantel = Plantel::with('municipio.estado')->find($params['plantel_id']);
        $consonantes = "BCDFGHJKLMNÑPQRSTVWXYZ";

        try{
            //Primera letra del primer apellido o X si comienza con Ñ
            $curp=($primerApellido[0] == 'Ñ') ? 'X' : $primerApellido[0];
            //Primer vocal del primer apellido o X
            $curp.=$primerApellido[strcspn($primerApellido, "AEIOUÁÉÍÓÚ")] ?? 'X';
            //Primera letra del segundo apellido o X
            $curp.=$segundoApellido[0] ?? 'X';
            //Primera letra del nombre
            $curp.=$nombre[0];
            //Fecha del registro
            $curp.=Carbon::now()->format('ymd');
            //TODO: Sexo, pero no se pide ni hay forma de obtenerlo sin el curp
            $curp.='X';
            //Abreviación del estado que lo inscribe
            $curp.=$abreviaciones[$plantel->municipio->estado_id-1];
            //Primer consonante interna del primer apellido
            $curp.=$primerApellido[strcspn($primerApellido, $consonantes, 1)+1] ?? 'X';
            //Primer consonante interna del segundo apellido
            $curp.=$segundoApellido[strcspn($segundoApellido, $consonantes, 1)+1] ?? 'X';
            //Primer consonante interna del nombre
            $curp.=$nombre[strcspn($nombre, $consonantes, 1)+1] ?? 'X';

            $consecutivo = '0'.random_int(1,9);
            $i = 0;
            while(Usuario::where('username', $curp.$consecutivo)->first() != null && $i < 9){
                $consecutivo = '0'.random_int(1,9);
                $i++;
            }

            //No se pueden generar más números distintos
            if($i > 8){
                return null;
            }

            $curp.=$consecutivo;
            $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿñÑ';
            $modificadas = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYBSAAAAAAACEEEEIIIIDNOOOOOOUUUYYBYNN';
            $curp = utf8_decode($curp);
            $curp = strtr($curp, utf8_decode($originales), $modificadas);
            $curp = strtoupper(utf8_encode($curp));
            return $curp;

        }catch(\Exception $e){
            return null;
        }
    }

    /**
     * Genera la matrícula de un alumno que apenas se está registrando en el sistema.
     *
     * @param $params array
     * @return string
     */
    private function generarMatricula($params){

        $matricula = "";
        //Últimos 2 dígitos del año en que inició la prepa y 4, que es el tipo de administración.
        $matricula.=substr($params['anio_ingreso'], -2).'4';


        $plantel = Plantel::find($params['plantel_id']);
        $estado = $plantel->municipio()->first()->estado()->first()->id;

        if(strlen($estado) < 2){
            $estado = '0'.$estado;
        }

        //Dos dígitos pertenecientes al estado en el que se encuentra el plantel,
        //07 que es el tipo de plantel "Cecyte" y el número del plantel
        $matricula.=$estado.'07';

        //Si es cecyte
        if($plantel->tipo_plantel_id == 18)
            $matricula.= '0'.$plantel->numero;
        //Si es emsad
        else if($plantel->tipo_plantel_id == 19) {
            $matricula .= '5'.$plantel->numero;
        }

        //Obtener la última matrícula asignada para generar el número consecutivo.
        $ultimo = Alumno::where('matricula', 'like', $matricula.'%')
            ->whereRaw('LENGTH(matricula) = 14')
            ->orderBy('matricula', 'desc')
            ->first();


        if($ultimo == null)
            $matricula.='0001';
        else {
            $matricula = $ultimo->matricula;
            $matricula++;
        }

        if(Alumno::where('matricula', $matricula)->first() != null){
            return null;
        }

        return $matricula;

    }

}
