<?php

use Illuminate\Database\Seeder;
use App\Alumno;
use App\Usuario;
use App\AlumnoGrupo;
use Carbon\Carbon;
use App\Plantel;
use App\Carrera;
use App\Periodo;
use App\PlantelCarrera;
use App\Grupo;
use App\ExpedienteAlumno;
use App\GrupoPeriodo;
use Illuminate\Support\Str;

class AlumnoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $carpetas = File::directories('database/json/alumnos');
        DB::beginTransaction();
        $periodoActual = Periodo::orderBy('id', 'DESC')->first();
        $error = false;

        foreach ($carpetas as $carpeta) {
            var_dump($carpeta);
            $files = File::allFiles($carpeta);

            foreach ($files as $file) {

                $data = json_decode(file_get_contents($file));
                var_dump("Archivo: {$file}");

                $plantel = Plantel::where('cct', $data[0]->{'CLAVE PLANTEL (CCT)'})->first();
                if ($plantel == null) {
                    var_dump('No existe el plantel - ' . $data[0]->{'CLAVE PLANTEL (CCT)'});
                    $error = true;
                    break;
                }

                $grupoAnterior = null;
                $turnoAnterior = null;
                $semestreAnterior = null;
                $carreraAnterior = null;
                $grupoPeriodo = null;
                $carrera = null;
                $plantelCarrera = null;

                $tieneFechaNac = isset($data[0]->{'FECHA-NACIMIENTO'});
                if(!$tieneFechaNac)
                    var_dump('Archivo sin fecha de nacimiento');

                try {
                    foreach ($data as $d) {

                        if ($carreraAnterior != $d->{'CLAVE CARRERA'}) {
                            $carrera = Carrera::where('clave_carrera', $d->{'CLAVE CARRERA'})->first();
                            $carreraAnterior = $d->{'CLAVE CARRERA'};
                            if ($carrera == null) {
                                var_dump('No existe la carrera - ' . $d->{'CLAVE CARRERA'} . '-' . $d->{'NOMBRE CARRERA'});
                                $error = true;
                                break;
                            }

                            $plantelCarrera = PlantelCarrera::where('plantel_id', $plantel->id)->where('carrera_id', $carrera->id)->first();
                            if ($plantelCarrera == null) {
                                var_dump("No existe relación entre {$plantel->cct} y {$carrera->clave_carrera}");
                                $error = true;
                                break;
                            }

                            $grupoPeriodo = $this->grupoPeriodo($d, $plantel, $carrera, $periodoActual);
                            if ($grupoPeriodo == null) {
                                var_dump('Algo salió mal con el grupo.');
                                $error = true;
                                break;
                            }
                        }

                        if ($d->CURP == null) {
                            //Falta generarle un curp provisional
                            var_dump("El alumno no tiene CURP {$d->NOMBRE} {$d->{'PRIMER APELLIDO'}} {$d->{'SEGUNDO APELLIDO'}}");
                            continue;
                        }

                        $usuario = Usuario::where('username', $d->CURP)->first();
                        if ($usuario != null) {
                            var_dump('Ya existe un usuario con el CURP - ' . $d->CURP);
                            var_dump('Se creará o utilizará el alumno con ese curp.');
                        } else {
                            $usuario = Usuario::create([
                                'fecha_insert' => Carbon::now(),
                                'username' => $d->CURP,
                                'password' => bcrypt($d->CURP),
                                'nombre' => $d->NOMBRE,
                                'primer_apellido' => $d->{'PRIMER APELLIDO'},
                                'segundo_apellido' => $d->{'SEGUNDO APELLIDO'}
                            ]);
                        }

                        $usuario->assignRole('ROLE_ALUMNO');

                        if ($grupoAnterior != $d->{'GRUPO ACTUAL'} || $turnoAnterior != $d->{'TURNO ACTUAL'} || $semestreAnterior != $d->{'SEMESTRE ACTUAL'}) {
                            $grupoPeriodo = $this->grupoPeriodo($d, $plantel, $carrera, $periodoActual);
                            $grupoAnterior = $d->{'GRUPO ACTUAL'};
                            $turnoAnterior = $d->{'TURNO ACTUAL'};
                            $semestreAnterior = $d->{'SEMESTRE ACTUAL'};
                            if ($grupoPeriodo == null) {
                                var_dump('Algo salió mal con el grupo.');
                                $error = true;
                                break;
                            }
                        }

                        $anioIngreso = '20' . substr($d->MATRICULA, 0, 2);
                        $anioEgreso = (int)$anioIngreso + 3;
                        $trayectoria = Str::upper($d->{'TIPO TRAYECTORIA'});
                        if ($trayectoria == 'TRANSITO' || $trayectoria == 'TRÁNSITO')
                            $trayectoria = 'Transito';
                        else if ($trayectoria == 'REGULAR')
                            $trayectoria = 'Regular';
                        else {
                            var_dump('El tipo de trayectoria es incorrecto');
                            $error = true;
                            break;
                        }

                        //                    var_dump('Creando alumno...');
                        $alumno = Alumno::updateOrCreate([
                            'usuario_id' => $usuario->id
                        ], [
                            'direccion' => $d->DIRECCION,
                            'codigo_postal' => $d->{'CODIGO POSTAL'},
                            'semestre' => $d->{'SEMESTRE ACTUAL'},
                            'matricula' => $d->MATRICULA,
                            'plantel_id' => $plantel->id,
                            'plantel_carrera_id' => $plantelCarrera->id,
                            'carrera_id' => $carrera->id,
                            'numero_movil' => $d->MOVIL,
                            'numero_contacto' => $d->TELEFONO,
                            'cambio_carrera' => 0,
                            'estatus' => 'Documentos completos',
                            'tipo_alumno' => $d->{'TIPO ALUMNO'},
                            'tipo_trayectoria' => $trayectoria,
                            'cambio_subsistema' => ($trayectoria == 'Regular') ? 0 : 1,
                            'estatus_inscripcion' => 'Activo',
                            'genero' => $d->SEXO ?? null,
                            'permitir_inscripcion' => 'Permitir',
                            'generacion' => $anioIngreso . '-' . $anioEgreso
                        ]);

                        if($tieneFechaNac) {
                            $fecha_nac = null;
                            $formats = ['y-m-d', 'Y-m-d', 'y/m/d', 'Y/m/d'];

                            foreach($formats as $format){
                                try{
                                    $fecha_nac = Carbon::createFromFormat($format, $d->{'FECHA-NACIMIENTO'})->toDateString();
                                    break;
                                }catch(Exception $e){

                                }
                            }

                            if($fecha_nac == null){
                                var_dump('Fecha de nacimiento inválida' . ' CURP: ' . $d->CURP);
                            }else{
                                try {

                                    ExpedienteAlumno::updateOrCreate([
                                        'alumno_id' => $usuario->id,
                                    ], [
                                        'fecha_nacimiento' => $fecha_nac,
                                    ]);

                                } catch (Exception $e) {
                                    var_dump('Fecha de nacimiento inválida' . ' CURP: ' . $d->CURP);
                                }
                            }
                        }

                        $this->alumnoGrupo($usuario->id, $grupoPeriodo);
                    }
                } catch (Exception $e) {
                    DB::rollback();
                    $error = true;
                    var_dump($e->getMessage());
                }
                if ($error)
                    break;
            }
            if ($error)
                break;
        }

        if (!$error)
            DB::commit();
        else {
            DB::rollback();
            var_dump('¡IMPORTANTE! HUBO UN ERROR, SE HIZO ROLLBACK');
        }
    }

    public function grupoPeriodo($datos, $plantel, $carrera, $periodo){
//        var_dump('Obteniendo grupo-periodo...');
        $turno = Str::upper($datos->{'TURNO ACTUAL'});
        if($turno == 'MATUTINO')
            $turno = 'TM';
        else if($turno == 'VESPERTINO')
            $turno = 'TV';

        $plantelCarrera = PlantelCarrera::where('plantel_id', $plantel->id)->where('carrera_id', $carrera->id)->first();
        if($plantelCarrera == null)
            return null;

        $grupo = Grupo::where('plantel_carrera_id', $plantelCarrera->id)
            ->where('grupo', $datos->{'GRUPO ACTUAL'})
            ->where('turno', $turno)
            ->where('semestre', $datos->{'SEMESTRE ACTUAL'})
            ->first();

        if($grupo == null){
            $grupo = Grupo::create([
                'plantel_carrera_id' => $plantelCarrera->id,
                'grupo' => $datos->{'GRUPO ACTUAL'},
                'turno' => $turno,
                'semestre' => $datos->{'SEMESTRE ACTUAL'},
                'status' => 'activo'
            ]);
        }

        $grupoPeriodo = GrupoPeriodo::where('grupo_id', $grupo->id)
            ->where('periodo_id', $periodo->id)
            ->where('grupo', $grupo->grupo)
            ->where('turno', $grupo->turno)
            ->where('semestre', $grupo->semestre)
            ->first();

        if($grupoPeriodo == null){
            $grupoPeriodo = GrupoPeriodo::create([
                'plantel_carrera_id' => $plantelCarrera->id,
                'grupo' => $grupo->grupo,
                'turno' => $grupo->turno,
                'semestre' => $grupo->semestre,
                'grupo_id' => $grupo->id,
                'periodo_id' => $periodo->id,
                'status' => 'activo',
                'max_alumnos' => 50
            ]);
        }

        return $grupoPeriodo;

    }

    private function alumnoGrupo($alumnoId, $grupoPeriodo){
//        var_dump('Inscribiendo alumno a grupo...');
        //Checar si el alumno está en el grupo
        $alumnoGrupo = AlumnoGrupo::where('alumno_id', $alumnoId)
            ->where('grupo_periodo_id', $grupoPeriodo->id)
            ->first();

        if($alumnoGrupo == null) {
            AlumnoGrupo::create([
                'alumno_id' => $alumnoId,
                'grupo_periodo_id' => $grupoPeriodo->id,
                'status' => 'Inscrito'
            ]);
        }
    }
}
