<?php

use Illuminate\Database\Seeder;
use App\Alumno;
use App\Carrera;
use App\Grupo;
use App\GrupoPeriodo;
use App\Plantel;
use App\PlantelCarrera;
use App\AlumnoGrupo;
use App\CalificacionUac;
use App\CarreraUac;
use App\UAC;
use App\Periodo;
use App\Docente;
use App\DocentePlantilla;
use App\DocenteAsignatura;
use App\GrupoPeriodoOptativa;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CalificacionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $files = File::allFiles('database/json/calificaciones/historico');
        $parciales = ['PARCIAL 1',
            'PARCIAL 2',
            'PARCIAL 3',
            'CALIFICACION FINAL',
            'CALIF. EXTRA (0 = No aplica, diferente a 0 = calificación extraordinaria)',
            'CALIFICACION CURSO INTERSEMESTRAL (0 = No aplica, diferente a 0 = calificación extraordinaria)',
            'CALIFICACION RECURSAMIENTO SEMESTRAL (0 = No aplica, diferente a 0 = calificación extraordinaria)'
        ];
        $conjuntoDocentes = collect();
        $docentesInexistentes = [];
        $error = false;
        $periodoActual = Periodo::orderBy('id', 'DESC')->first();

        $asignaturas = collect();
        $carreraUacs = collect();

        DB::beginTransaction();
        foreach ($files as $file) {
            var_dump('------------------------------------------------------------------------------------------');
            var_dump("Archivo: {$file}");

            $data = json_decode(file_get_contents($file));

            $plantel = Plantel::where('cct', $data[0]->{'CLAVE PLANTEL (CCT)'})->first();
            if($plantel == null) {
                var_dump('No existe el plantel - '.$data[0]->{'CLAVE PLANTEL (CCT)'});
                $error = true;
                break;
            }

            $claveAnterior = '';
            $periodoAnterior = null;
            $alumnoAnterior = null;

            $grupoPeriodo = null;
            $alumno = null;
            $docentesParaPeriodoActual = [];
            $optativas = [];

            $carrera = Carrera::where('clave_carrera', $data[0]->{'CLAVE CARRERA'})->first();
            if($carrera == null){
                var_dump('No existe la carrera - '.$data[0]->{'CLAVE CARRERA'});
                $error = true;
                break;
            }

            $grupoPeriodo = $this->grupoPeriodo($data[0], $plantel, $carrera, $periodoActual);
            if($grupoPeriodo == null) {
                var_dump('Algo salió mal.');
                $error = true;
                break;
            }

            try {
                //Guardar cada calificación
                foreach ($data as $d) {
                    if($alumnoAnterior != $d->{'MATRICULA ALUMNO'} || $alumno == null){

                        if($d->{'MATRICULA ALUMNO'} == null)
                            continue;

                        $alumno = Alumno::with('usuario')
                            ->where('matricula', $d->{'MATRICULA ALUMNO'})
                            ->where('plantel_id', $plantel->id)
                            //->where('carrera_id', $carrera->id)
                            ->first();

                        $alumnoAnterior = $d->{'MATRICULA ALUMNO'};

                        if($alumno == null){
                            if($periodoActual->id == $grupoPeriodo->periodo_id)
                                var_dump('El alumno no existe o no está registrado en el plantel/carrera: '. $d->{'MATRICULA ALUMNO'});
                            continue;
                        }

                        //Revisar si está el alumno en el grupo y si no, inscribirlo
                        $this->alumnoGrupo($alumno, $grupoPeriodo, $periodoActual);

                    }

                    //Para no cambiar todas las claves de 6to
                    if($grupoPeriodo->semestre == 6 && ($d->{'CLAVE ASIGNATURA'} == '343201-13' || $d->{'CLAVE ASIGNATURA'} == '322504-13')){
                        $d->{'CLAVE ASIGNATURA'} = $d->{'CLAVE ASIGNATURA'}.'FB';
                    }

                    //Buscar la asignatura en la colección
                    $uac = $asignaturas->where('clave_uac', $d->{'CLAVE ASIGNATURA'})->first();
                    //Si no está, buscarla en la BD
                    if($uac == null) {
                        $uac = UAC::where('clave_uac', $d->{'CLAVE ASIGNATURA'})
                            ->first();
                        if($uac != null)
                            $asignaturas->push($uac);
                        else{
                            var_dump('No existe la asignatura - '.$d->ASIGNATURA);
                            var_dump($d->{'MATRICULA ALUMNO'});
                            $error = true;
                            break;
                        }
                    }

                    //Si es de sexto semestre y la asignatura es optativa, asignarlo a las optativas del grupo.
                    if($grupoPeriodo->semestre == 6 && $uac->optativa == 1 && !in_array($uac->id, $optativas)){
                        $this->optativa($grupoPeriodo, $uac);
                        array_push($optativas, $uac->id);
                    }

                    //Buscar la carrera-uac en la colección
                    $carreraUac = $carreraUacs->where('carrera_id', $carrera->id)
                        ->where('uac_id', $uac->id)
                        ->first();

                    //Si no está, buscarla en la BD
                    if($carreraUac == null) {
                        $carreraUac = CarreraUac::where('carrera_id', $carrera->id)
                            ->where('uac_id', $uac->id)
                            ->first();
                        if($carreraUac != null)
                            $carreraUacs->push($carreraUac);
                        else{
                            $error = true;
                            var_dump('No hay relación entre la carrera '.$carrera->nombre.' y la uac '.$uac->nombre.'-'.$uac->clave_uac);
                            break;
                        }
                    }


                    //Buscar el docente en la colección de docentes
                    $docente = $conjuntoDocentes->where('curp', $d->{'CURP DOCENTE'})->first();
                    //Si no se ha obtenido, obtenerlo o añadirlo al arreglo de docentes que no están registrados.
                    if($docente == null && !in_array($d->{'CURP DOCENTE'},$docentesInexistentes)) {
                        //var_dump('Buscar el docente no registrado?');
                        $docente = Docente::where('curp', $d->{'CURP DOCENTE'})->first();
                        if($docente != null) {
                            $conjuntoDocentes->push($docente);
                        }else{
                            array_push($docentesInexistentes, $d->{'CURP DOCENTE'});
                        }
                    }

                    $docenteId = ($docente != null) ? $docente->id : null;

                    if($docenteId != null) {
                        $this->docenteAsignatura($docenteId, $carreraUac, $grupoPeriodo, $plantel);
                    }else if(
                        //En caso de que sea periodo actual se revisa que el docente esté registrado.
                        $docenteId == null
                        && $grupoPeriodo->periodo_id == $periodoActual->id
                        && $uac->tipo_uac_id != 4
                        && !in_array($d->{'CURP DOCENTE'}, $docentesParaPeriodoActual)
                    ){
                        var_dump("Materia {$uac->nombre} - No está el docente {$d->{'CURP DOCENTE'}}");
                        array_push($docentesParaPeriodoActual, $d->{'CURP DOCENTE'});
                        /*Esto se tiene comentado por mientras para agilizar la revisión de archivos,
                          pero hay que quitar el comentario porque no debería haber calificaciones sin docente al menos
                          en el periodo actual.
                        */
                        //$error = true;
                        //break;
                    }

                    for ($i = 0; $i < 7; $i++) {
                        //Si ya se cargó la calificación del primer parcial y es del periodo actual, terminar el ciclo.
                        /*if($i > 0 && $periodoActual->id == $grupoPeriodo->periodo_id)
                            break;*/

                        if (Str::length($d->{$parciales[$i]}) == 0) {
                            continue;
                        }

                        $parcial = ($i == 6) ? 4 : $i + 1;

                        //Para cuando traen 0's en la columna de EXT, CI y RS
                        if($i > 3 && $d->{$parciales[$i]} == 0)
                            continue;

                        $calificacion = str_replace(',', '.', $d->{$parciales[$i]});
                        if ($calificacion == 'NP' || $calificacion == 'NA') {
                            $calificacion = -1;
                        }
                        $calif = CalificacionUac::create([
                            'alumno_id' => $alumno->usuario_id,
                            'carrera_uac_id' => $carreraUac->id,
                            'grupo_periodo_id' => $grupoPeriodo->id,
                            'calificacion' => $calificacion,
                            'periodo_id' => $grupoPeriodo->periodo_id,
                            'plantel_id' => $plantel->id,
                            'docente_id' => $docenteId,
                            'parcial' => $parcial
                        ]);
                    }
                }

            }catch(Exception $e){
                DB::rollBack();
                $error = true;
                var_dump('ERROR: '.$e->getMessage());
                break;
            }

            if($error){
                DB::rollBack();
                break;
            }
        }

        if(!$error)
            DB::commit();
        else{
            DB::rollBack();
            var_dump('OCURRIÓ UN ERROR, se hizo rollback, verificar el último mensaje para saber qué sucedió.');
        }

    }

    private function optativa($grupo, $uac){

        GrupoPeriodoOptativa::firstOrCreate([
            'grupo_periodo_id' => $grupo->id,
            'uac_id' => $uac->id
        ]);

    }

    public function grupoPeriodo($datos, $plantel, $carrera, $periodoActual){

        $plantelCarrera = PlantelCarrera::where('plantel_id', $plantel->id)->where('carrera_id', $carrera->id)->first();
        if($plantelCarrera == null) {
            var_dump('No existe el plantelCarrera');
            return null;
        }

        $turno = $datos->TURNO;
        if(Str::upper($datos->TURNO) == 'MATUTINO'){
            $turno = 'TM';
        }else if(Str::upper($datos->TURNO) == 'VESPERTINO'){
            $turno = 'TV';
        }else if($datos->TURNO != 'TM' && $datos->TURNO != 'TV'){
            var_dump('El turno está mal escrito. - '.$datos->TURNO);
            return null;
        }

        try {
            //code...
            $check_periodo = $datos->{'PERIODO(ejemplo=Agosto 2018 - Enero 2019)'};
        } catch (\Throwable $th) {
            //throw $th;
            $check_periodo = $datos->{'PERIODO'};
        }

        $periodo = Periodo::where('nombre_con_mes', $check_periodo)->first();
        if($periodo == null) {
            var_dump('No se encontró el periodo. -'.$check_periodo);
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

    private function alumnoGrupo($alumno, $grupoPeriodo, $periodoActual){

        //Checar si el alumno está en el grupo
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

    private function docenteAsignatura($docente, $carreraUac, $grupoPeriodo, $plantel){

        $periodo = Periodo::find($grupoPeriodo->periodo_id);

        $plantilla = DocentePlantilla::where('docente_id', $docente)
            ->where('plantel_id', $plantel->id)
            ->where('fecha_fin_contrato', null)
            ->first();

        if($plantilla == null){
            $plantilla = DocentePlantilla::where('docente_id', $docente)
            ->where('plantel_id', $plantel->id)
            ->where('fecha_fin_contrato', '>=', Carbon::parse($periodo->fecha_fin)->subMonth())
            ->first();
        }

        if($plantilla != null) {
            DocenteAsignatura::firstOrCreate([
                'carrera_uac_id' => $carreraUac->id,
                'grupo_periodo_id' => $grupoPeriodo->id,
                'periodo_id' => $grupoPeriodo->periodo_id,
                'plantel_id' => $plantel->id,
                'plantilla_docente_id' => $plantilla->id
            ]);
        }/*else{
            var_dump("El docente no tiene un contrato activo en el plantel. Id docente = {$docente}");
        }*/
    }
}
