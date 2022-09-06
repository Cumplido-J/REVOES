<?php

use App\Plantel;
use App\Carrera;
use App\Docente;
use App\Usuario;
use App\UsuarioDocente;
use App\DocentePlantilla;
use App\TipoPlaza;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DocenteAsignacionSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::beginTransaction();
        //crear docente
        $files = File::allFiles('database/json/docentes');
        $error = false;

        foreach ($files as $file) {

            $data = json_decode(file_get_contents($file));
            var_dump('Archivo: '.$file);
            try {
                foreach ($data as $d) {
                    var_dump('EVALUAR => '.$d->NOMBRE);
                    if (strlen($d->CURP) > 18) {
                        var_dump($d->CURP . ' excede los 18 caracteres');
                        substr($d->CURP, 0, -1);
                        //continue;
                    }else if(strlen($d->CURP) < 18){
                        var_dump($d->CURP . ' menor a los 18 caracteres');
                        throw new Exception();
                        //continue;
                    }

                    if (strlen($d->HORAS) == 0 || $d->HORAS == null || $d->HORAS == "") {
                        var_dump($d->HORAS . ' debe contener número valido de horas');
                        throw new Exception(); 
                        //continue;
                    }

                    $tipoSangre = ($d->{'TIPO SANGRE'} != null) ? str_replace(' ', '', $d->{'TIPO SANGRE'}) : null;

                    //Conversión de fechas
                    $fechaNacimiento = ($d->{'FECHA NACIMIENTO'} == '') ? null : $d->{'FECHA NACIMIENTO'};
                    if($fechaNacimiento != null && Str::contains($fechaNacimiento,'/')){
                        $fechaNacimiento = Carbon::createFromFormat('d/m/Y', $fechaNacimiento);
                    }
                    $fechaEgreso = ($d->{'FECHA EGRESO(dd/mm/yyyy)'} == '') ? null : $d->{'FECHA EGRESO(dd/mm/yyyy)'};
                    if($fechaEgreso != null && Str::contains($fechaEgreso, '/')){
                        $fechaEgreso = Carbon::createFromFormat('d/m/Y', $fechaEgreso);
                    }else if($fechaEgreso == null){
                        var_dump('La fecha de egreso no puede estar vacía. CURP: '.$d->CURP);
                        //throw new Exception();
                        //continue;
                    }
                    $fechaIngreso = $d->{'FECHA INICIO SUBSISTEMA(dd/mm/yyyy)'};
                    if($fechaIngreso != null && Str::contains($fechaIngreso, '/')){
                        $fechaIngreso = Carbon::createFromFormat('d/m/Y', $fechaIngreso);
                    }

                    $docente = Docente::where('curp', $d->CURP)->first();
                    if($docente){
                        var_dump($d->CURP . ' ya existe en la BD');
                    }else {
                        var_dump($d->CURP . ' Nuevo docente');
                        $docente = Docente::firstOrCreate([
                            'curp' => $d->CURP
                        ], [
                            'nombre' => $d->NOMBRE,
                            'primer_apellido' => $d->{'PRIMER APELLIDO'},
                            'segundo_apellido' => $d->{'SEGUNDO APELLIDO'},
                            'correo' => $d->EMAIL,
                            'correo_inst' => $d->{'EMAIL INSTITUCIONAL'},
                            'num_nomina' => $d->{'NUMERO EMPLEADO'},
                            'rfc' => $d->RFC,
                            'fecha_nacimiento' => $fechaNacimiento,
                            'genero' => $d->GENERO,
                            'direccion' => $d->{'DIRECCIÓN ACTUAL'},
                            'cp' => $d->CP,
                            'telefono' => $d->TELEFONO,
                            'fecha_ingreso' => $fechaIngreso,
                            'tipo_sangre' => $tipoSangre,
                            'maximo_grado_estudio' => $d->{'MAXIMO GRADO ESTUDIO'},
                            'fecha_egreso' => $fechaEgreso,
                            'cedula' => $d->CEDULA
                        ]);

                        //crear usuario
                        $usuario = Usuario::firstOrCreate([
                            'username' => $d->CURP
                        ],
                            [
                                'fecha_insert' => Carbon::now(),
                                'nombre' => $d->NOMBRE,
                                'primer_apellido' => $d->{'PRIMER APELLIDO'},
                                'segundo_apellido' => $d->{'SEGUNDO APELLIDO'},
                                'email' => $d->EMAIL,
                                'password' => bcrypt($d->RFC)
                            ]);

                        $usuario_docente = UsuarioDocente::firstOrCreate([
                            'usuario_id' => $usuario->id,
                            'docente_id' => $docente->id
                        ]);

                        $usuario->assignRole('ROLE_DOCENTE');
                    }
                    //plantel
                    $plantel = Plantel::where('cct', str_replace(' ', '', $d->{'CLAVE PLANTEL (CCT)'}))->first();
                    if ($plantel == null) {
                        var_dump('El plantel no existe. ' . $d->{'CLAVE PLANTEL (CCT)'});
                        throw new Exception();
                        //continue;
                    }

                    $plaza = '';
                    if (Str::upper($d->{'TIPO PLAZA'}) == 'BASE') {
                        $plaza = 'Permanente';
                    } else if (Str::upper($d->{'TIPO PLAZA'}) == 'PROVISIONAL') {
                        $plaza = 'Interino';
                    }

                    $tipoPlaza = TipoPlaza::where('nombre', $plaza)->first();

                    if ($tipoPlaza == null) {
                        var_dump('No existe esta plaza: ' . $d->{'TIPO PLAZA'});
                        throw new Exception();
                        //continue;
                    }

                    //Conversión de fechas
                    $fechaFin = ($d->{'FECHA FIN SUBSISTEMA(dd/mm/yyyy)'} == '') ? null : $d->{'FECHA FIN SUBSISTEMA(dd/mm/yyyy)'};
                    if($fechaFin != null && Str::contains($fechaFin,'/')){
                        $fechaFin = Carbon::createFromFormat('d/m/Y', $fechaFin)->toDateString();
                    }
                    $fechaInicio = $d->{'FECHA INICIO SUBSISTEMA(dd/mm/yyyy)'};
                    if($fechaInicio != null && Str::contains($fechaInicio,'/')){
                        $fechaInicio = Carbon::createFromFormat('d/m/Y', $fechaInicio)->toDateString();
                    }

                    //crear asignacion
                    $docente_asignacion = DocentePlantilla::firstOrCreate([
                        'fecha_asignacion' => $fechaInicio,
                        'fecha_inicio_contrato' => $fechaInicio,
                        'fecha_fin_contrato' => $fechaFin,
                        'horas' => $d->HORAS,
                        'docente_id' => $docente->id,
                        'cat_tipo_Plaza_id' => $tipoPlaza->id,
                        'plantel_id' => $plantel->id
                    ]);
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
}
