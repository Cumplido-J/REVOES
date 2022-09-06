<?php

use Illuminate\Database\Seeder;
use App\Alumno;
use App\Plantel;
use App\CalificacionUac;
use App\CarreraUac;
use App\Carrera;
use App\PlantelCarrera;
use App\GrupoPeriodo;
use App\UAC;
use App\Periodo;
use App\Docente;
use App\GrupoPeriodoOptativa;
use App\Grupo;
use App\AlumnoGrupo;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Traits\AuditoriaLogHelper;
use App\Traits\CalificarPromediarTrait;

class CalificacionCorreccionSeeder extends Seeder
{

    use AuditoriaLogHelper, CalificarPromediarTrait;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::beginTransaction();
        //crear alumno
        $files = File::allFiles('database/json/correccion/calificaciones');
        $error = false;

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file));
            var_dump('Archivo: '.$file);
            $optativas = [];
            try {
                foreach ($data as $d) {
                    //TEST ALUMNO
                    if(isset($d->{'MATRICULA ALUMNO'})){
                        var_dump("////////////////////////////////////////////////////////////////////////////"); //separador
						$matriculaAlumno = sprintf("%d", $d->{'MATRICULA ALUMNO'});
                        var_dump("alumno => ".$d->{'MATRICULA ALUMNO'});
                        $alumno = Alumno::where('matricula', $matriculaAlumno)->first();
                        if(!$alumno){
                            var_dump("NO SE ENCONTRO EL ALUMNO");
                            continue;
                        }else{
                            var_dump("ALUMNO ID => " .$alumno->usuario_id);
                        }
                        //TEST PERIODO
                        if(isset($d->{'PERIODO (Ejemplo Agosto 2020-Enero 2021)'})){
                           $periodo_json = $d->{'PERIODO (Ejemplo Agosto 2020-Enero 2021)'};
                        }else if(isset($d->{'PERIODO'})){
                            $periodo_json = $d->{'PERIODO'};
                        }else if(isset($d->{'PERIODO(ejemplo=Agosto 2018 - Enero 2019)'})){
                            $periodo_json = $d->{'PERIODO(ejemplo=Agosto 2018 - Enero 2019)'};
                        }else{
                            var_dump("NO HAY PERIODO KEY");
                            throw new Exception();
                        }
                        $periodo = Periodo::where('nombre_con_mes', strtoupper($periodo_json))->first();
                        if(!$periodo){
                            var_dump("ERROR EN PERIODO => ".$periodo_json);
                            throw new Exception();
                        }else{
                            var_dump("PERIODO DE CALIFICACIONES => ". $periodo->nombre_con_mes);
                        }
                        //TEST TURNO
                        if(isset($d->{'TURNO'})){
                            if(Str::upper($d->{'TURNO'}) == 'MATUTINO'){
                                $turno = 'TM';
                            }else if(Str::upper($d->{'TURNO'}) == 'VESPERTINO'){
                                $turno = 'TV';
                            }else if($d->{'TURNO'} != 'TM' && $d->{'TURNO'} != 'TV'){
                                var_dump('El turno está mal escrito. - '.$d->{'TURNO'});
                                throw new Exception();
                                //return null;
                            }else{
                                $turno = $d->{'TURNO'};
                            }
                        }else{
                            var_dump('Se necesita TURNO.');
                            throw new Exception();
                        }
                        //TEST UAC
                        if(isset($d->{'CLAVE ASIGNATURA'})){
                            //buscar materia
                            $uac = UAC::where('clave_uac', $d->{'CLAVE ASIGNATURA'})->first();
                        }else{
                            var_dump("ERROR EN ASIGNATURA, NO SE ENCONTRARON RESULTADOS => ".$d->{'CLAVE ASIGNATURA'});
                            throw new Exception();
                        }
                        //TEST PLANTEL
                        if(isset($d->{'CLAVE PLANTEL (CCT)'})){
                            $plantel = Plantel::where('cct', $d->{'CLAVE PLANTEL (CCT)'})->first();
                            $grupo_periodo_id = null;
                            if(!$plantel){
                                var_dump("ERROR EN PLANTEL => ".$d->{'CLAVE PLANTEL (CCT)'});
                                throw new Exception();
                            }else{
                                //TEST CARRERA
                                $carrera = Carrera::where("clave_carrera", $d->{'CLAVE CARRERA'})->first();
                                if($carrera){
                                    //TEST PLANTEL CARRERA
                                    $plantel_carrera = PlantelCarrera::where([
                                        ['carrera_id', $carrera->id],
                                        ['plantel_id', $plantel->id]
                                    ])->first();
                                    //TEST GRUPO PERIODO
                                    $grupo_periodo_sin_semestre = GrupoPeriodo::where([
                                        ['periodo_id', $periodo->id],
                                        ['grupo', $d->{'GRUPO'}],
                                        ['turno', $turno],
                                        ['semestre', $d->{'SEMESTRE'}],
                                        ['plantel_carrera_id', $plantel_carrera->id]
                                    ])->first();
                                    $grupo_periodo = $grupo_periodo_sin_semestre;
                                    if(!$grupo_periodo_sin_semestre){
                                        $grupo_periodo_con_semestre = GrupoPeriodo::where([
                                            ['periodo_id', $periodo->id],
                                            ['grupo', $d->{'SEMESTRE'}.$d->{'GRUPO'}],
                                            ['turno', $turno],
                                            ['semestre', $d->{'SEMESTRE'}],
                                            ['plantel_carrera_id', $plantel_carrera->id]
                                        ])->first();
                                        $grupo_periodo = $grupo_periodo_con_semestre;
                                    }
                                    //PERIODO ACTUAL
                                    $periodo_actual = Periodo::orderBy('id', 'DESC')->first();
                                    if($grupo_periodo){
                                        $grupo_periodo_id = $grupo_periodo->id;
                                    }else{
                                        var_dump("NO EXISTE GRUPO => ".$d->{'SEMESTRE'}." ".$d->{'GRUPO'}." - ".$d->{"TURNO"}." CREANDO GRUPO..");
                                        /* crear grupo */
                                        $grupo_periodo = $this->grupoPeriodo($d, $plantel, $carrera, $turno, $periodo, $periodo_actual);
                                        if($grupo_periodo == null) {
                                            var_dump('Algo salió mal.');
                                            throw new Exception();
                                        }
                                        $grupo_periodo_id = $grupo_periodo->id;
                                    }
                                    //Revisar si está el alumno en el grupo y si no, inscribirlo
                                    $this->alumnoGrupo($alumno, $grupo_periodo_id, $periodo_actual);
                                    if(isset($d->{'CLAVE ASIGNATURA'})){
                                        //buscar materia
                                        $uac = UAC::where('clave_uac', $d->{'CLAVE ASIGNATURA'})->first();
                                        //Si es de sexto semestre y la asignatura es optativa, asignarlo a las optativas del grupo.
                                        if($grupo_periodo->semestre == 6 && $uac->optativa == 1 && !in_array($uac->id, $optativas)){
                                            $this->optativa($grupo_periodo, $uac);
                                            array_push($optativas, $uac->id);
                                        }
                                    }
                                }
                            }
                        }
                        //TEST DOCENTE
                        $docente_id = null;
                        if(isset($d->{'CURP DOCENTE'})){
                            $docente = Docente::where('curp', $d->{'CURP DOCENTE'})->first();
                            if($docente){
                                $docente_id = $docente->docente_id;
                            }
                        }
                        //TEST CARRERA UAC
                        $carrera_uac = CarreraUac::where([
                            ['uac_id', $uac->id],
                            ['carrera_id', $carrera->id]
                        ])->first();
                        if($carrera_uac){
                            var_dump("CARRERA_UAC => ".$carrera_uac->id);
                            //TEST PARCIALES
                            $calificacion = null;
                            $parcial = null;
                            $tipo_calif = null;
                            if($d->{'PARCIAL 1'} != ""){
                                if($d->{'PARCIAL 1'} >= 0){
                                    $calificacion = $d->{'PARCIAL 1'};
                                    $calificacion == null ? $calificacion = 0 : $calificacion = $calificacion;
                                    $parcial = 1;
                                    var_dump("calificar el parcial ".$parcial." con la calificacion ".$calificacion);
                                    //TEST CALIFICACION
                                    if($calificacion != null || $calificacion >= 0){
                                        $this->calificarAlumno(
                                            $alumno->usuario_id, $carrera_uac->id, $plantel->id, 
                                            $parcial, $periodo->id, $calificacion, null, 
                                            $grupo_periodo_id, null, null, null, $docente_id, null,
                                            false, false
                                        );
                                    }else{
                                        var_dump("NO SE ENCONTRO LA CALIFICACION DEL PARCIAL ".$parcial);
                                        throw new Exception();  
                                    }
                                }
                            }
                            if($d->{'PARCIAL 2'} != ""){
                                if($d->{'PARCIAL 2'} >= 0){
                                    $calificacion = $d->{'PARCIAL 2'};
                                    $calificacion == null ? $calificacion = 0 : $calificacion = $calificacion;
                                    $parcial = 2;
                                    var_dump("calificar el parcial ".$parcial." con la calificacion ".$calificacion);
                                    //TEST CALIFICACION
                                    if($calificacion != null || $calificacion >= 0){
                                        $this->calificarAlumno(
                                            $alumno->usuario_id, $carrera_uac->id, $plantel->id, 
                                            $parcial, $periodo->id, $calificacion, null, 
                                            $grupo_periodo_id, null, null, null, $docente_id, null,
                                            false, false
                                        );
                                    }else{
                                        var_dump("NO SE ENCONTRO LA CALIFICACION DEL PARCIAL ".$parcial);
                                        throw new Exception();  
                                    }
                                }
                            }
                            if($d->{'PARCIAL 3'} != ""){
                                if($d->{'PARCIAL 3'} >= 0){
                                    $calificacion = $d->{'PARCIAL 3'};
                                    $calificacion == null ? $calificacion = 0 : $calificacion = $calificacion;
                                    $parcial = 3;
                                    var_dump("calificar el parcial ".$parcial." con la calificacion ".$calificacion);
                                    //TEST CALIFICACION
                                    if($calificacion != null || $calificacion >= 0){
                                        $this->calificarAlumno(
                                            $alumno->usuario_id, $carrera_uac->id, $plantel->id, 
                                            $parcial, $periodo->id, $calificacion, null, 
                                            $grupo_periodo_id, null, null, null, $docente_id, null,
                                            false, false
                                        );
                                    }else{
                                        var_dump("NO SE ENCONTRO LA CALIFICACION DEL PARCIAL ".$parcial);
                                        throw new Exception();  
                                    }   
                                }
                            }
                            if($d->{'CALIFICACION FINAL'} != ""){
                                if($d->{'CALIFICACION FINAL'} >= 0){
                                    $calificacion = $d->{'CALIFICACION FINAL'};
                                    $calificacion == null ? $calificacion = 0 : $calificacion = $calificacion;
                                    $parcial = 4;
                                    var_dump("calificar el parcial ".$parcial." con la calificacion ".$calificacion);
                                    //TEST CALIFICACION
                                    if($calificacion != null || $calificacion >= 0){
                                        $this->calificarAlumno(
                                            $alumno->usuario_id, $carrera_uac->id, $plantel->id, 
                                            $parcial, $periodo->id, $calificacion, null, 
                                            $grupo_periodo_id, null, null, null, $docente_id, null,
                                            false, false
                                        );
                                    }else{
                                        var_dump("NO SE ENCONTRO LA CALIFICACION DEL PARCIAL ".$parcial);
                                        throw new Exception();  
                                    }
                                }
                            }
                            if($d->{'CALIF. EXTRA (0 = No aplica, diferente a 0 = calificación extraordinaria)'} != ""){
                                $calificacion = $d->{'CALIF. EXTRA (0 = No aplica, diferente a 0 = calificación extraordinaria)'};
                                $parcial = 5;   
                                $tipo_calif = 'EXT';
                                //TEST CALIFICACION
                                if($calificacion != null){
                                    $this->calificarAlumno(
                                        $alumno->usuario_id, $carrera_uac->id, $plantel->id, 
                                        $parcial, $periodo->id, $calificacion, null, 
                                        $grupo_periodo_id,  null, null, null, $docente_id, "EXT",
                                        false, false
                                    );
                                }else{
                                    var_dump("NO SE ENCONTRO LA CALIFICACION DEL PARCIAL ".$parcial);
                                    throw new Exception();  
                                }
                            }
                            if($d->{'CALIFICACION CURSO INTERSEMESTRAL (0 = No aplica, diferente a 0 = calificación extraordinaria)'} != ""){
                                $calificacion = $d->{'CALIFICACION CURSO INTERSEMESTRAL (0 = No aplica, diferente a 0 = calificación extraordinaria)'};
                                $parcial = 6;   
                                $tipo_calif = 'CI';
                                //TEST CALIFICACION
                                if($calificacion != null){
                                    $this->calificarAlumno(
                                        $alumno->usuario_id, $carrera_uac->id, $plantel->id, 
                                        $parcial, $periodo->id, $calificacion, null, 
                                        $grupo_periodo_id, null, null, null, $docente_id, "CI",
                                        false, false
                                    );
                                }else{
                                    var_dump("NO SE ENCONTRO LA CALIFICACION DEL PARCIAL ".$parcial);
                                    throw new Exception();  
                                }
                            }
                            if($d->{'CALIFICACION RECURSAMIENTO SEMESTRAL (0 = No aplica, diferente a 0 = calificación extraordinaria)'} != ""){
                                $calificacion = $d->{'CALIFICACION RECURSAMIENTO SEMESTRAL (0 = No aplica, diferente a 0 = calificación extraordinaria)'};
                                $parcial = 4;   
                                $tipo_calif = 'RS';
                                if($calificacion != null){
                                    $this->calificarAlumno(
                                        $alumno->usuario_id, $carrera_uac->id, $plantel->id, 
                                        $parcial, $periodo->id, $calificacion, null, 
                                        $grupo_periodo_id, null, null, null, $docente_id, "RS",
                                        false, false
                                    );
                                }else{
                                    var_dump("NO SE ENCONTRO LA CALIFICACION DEL PARCIAL ".$parcial);
                                    throw new Exception();  
                                }
                            }    
                        }else{
                            var_dump("ERROR EN CARRERA_UAC, NO SE ENCONTRARON RESULTADOS => ".$d->{'MATRICULA ALUMNO'});
                            throw new Exception();
                            //continue;     
                        }
                    }
                }
            }catch(Exception $e){
                $error = true;
                var_dump('ERROR: '.$e->getMessage().' - '.$e->getLine());
                DB::rollBack();
                break;
            }
        }

        
        if(!$error)
        DB::commit();
        else
        DB::rollBack();
    }

    public function grupoPeriodo($datos, $plantel, $carrera, $turno, $periodo, $periodoActual){

        $plantelCarrera = PlantelCarrera::where('plantel_id', $plantel->id)->where('carrera_id', $carrera->id)->first();
        if($plantelCarrera == null) {
            var_dump('No existe el plantelCarrera');
            return null;
        }

        $grupo = Grupo::where([
            'plantel_carrera_id' => $plantelCarrera->id,
            'grupo' => $datos->GRUPO,
            'turno' => $turno,
            'semestre' => $datos->SEMESTRE,
            'status' => 'activo'
        ])->first();

        //Validación sólo para el periodo actual
        if($periodo->id == $periodoActual->id && $grupo == null){
            var_dump('ERROR: El grupo no existe para el periodo actual, verificar la información.');
            return null;
        }else if($grupo == null){
            $grupo = Grupo::create([
                'plantel_carrera_id' => $plantelCarrera->id,
                'grupo' => $datos->GRUPO,
                'turno' => $turno,
                'semestre' => $datos->SEMESTRE,
                'status' => 'activo'
            ]);
        }

        $grupoPeriodo = GrupoPeriodo::where([
            'plantel_carrera_id' => $plantelCarrera->id,
            'grupo' => $datos->GRUPO,
            'turno' => $turno,
            'semestre' => $datos->SEMESTRE,
            'grupo_id' => $grupo->id,
            'periodo_id' => $periodo->id,
            'status' => 'activo'
        ])->first();

        //Validación sólo para el periodo actual
        if($periodo->id == $periodoActual->id && $grupoPeriodo == null){
            var_dump('ERROR: El grupo seleccionado no se ha activado en el período, verificar la información del archivo.');
            return null;
        }else if($grupoPeriodo == null){
            $grupoPeriodo = GrupoPeriodo::create([
                'plantel_carrera_id' => $plantelCarrera->id,
                'grupo' => $datos->GRUPO,
                'turno' => $turno,
                'semestre' => $datos->SEMESTRE,
                'grupo_id' => $grupo->id,
                'periodo_id' => $periodo->id,
                'status' => 'activo',
                'max_alumnos' => 50
            ]);
        }

        return $grupoPeriodo;

    }

    private function alumnoGrupo($alumno, $grupoPeriodoId, $periodoActual){

        //Checar si el alumno está en el grupo
        $grupoPeriodo = GrupoPeriodo::find($grupoPeriodoId);
        $alumnoGrupo = AlumnoGrupo::where([
            'alumno_id' => $alumno->usuario_id,
            'grupo_periodo_id' => $grupoPeriodo->id,
            'status' => 'Inscrito'
        ])->first();

        if($alumnoGrupo == null && $grupoPeriodo->periodo_id == $periodoActual->id){
            //throw new Exception("El alumno no está inscrito en el grupo especificado. {$alumno->matricula}");
            var_dump("El alumno no está inscrito en el grupo especificado. {$alumno->matricula}");
            return;
        }

        //Si no es el periodo actual, se asigna al alumno al grupo.
        if($alumnoGrupo == null){
            $alumnoGrupo = AlumnoGrupo::create([
                'alumno_id' => $alumno->usuario_id,
                'grupo_periodo_id' => $grupoPeriodo->id,
                'status' => 'Inscrito'
            ]);
        }

    }

    private function optativa($grupo, $uac){
        GrupoPeriodoOptativa::firstOrCreate([
            'grupo_periodo_id' => $grupo->id,
            'uac_id' => $uac->id
        ]);
    }
}
