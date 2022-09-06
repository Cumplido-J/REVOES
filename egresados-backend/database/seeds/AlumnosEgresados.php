<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AlumnosEgresados extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $files = File::allFiles('database/json/alumnos/egresados');
        DB::beginTransaction();
        $error = false;
        $rol = DB::table('roles')->where('name', 'ROLE_ALUMNO')->first();
        $carreras = collect();
        foreach ($files as $file) {

            $data = json_decode(file_get_contents($file));

            var_dump('Archivo: '.$file->getFilenameWithoutExtension());
            $plantelAnterior = "";
            $carreraAnterior = "";
            $plantel = null;
            $carrera = null;
            $plantelCarrera = null;
            $error = false;

            try{
                foreach ($data as $d) {

                    //Obtener el plantel en caso de que haya cambiado en el archivo.
                    if($plantelAnterior != $d->{'CCT de Plantel'}) {
                        var_dump("--------------------------------------------------------------------------------");
                        $plantelAnterior = $d->{'CCT de Plantel'};
                        $plantel = DB::table('plantel')->where('cct', $d->{'CCT de Plantel'})->first();
                        if ($plantel == null) {
                            var_dump('ERROR: No existe el plantel - ' . $d->{'CCT de Plantel'}.' - '.$d->{'Nombre de Plantel'});
                            $error = true;
                            break;
                        }

                         //Obtener el plantelCarrera
                        if($carrera != null) {
                            $plantelCarrera = $this->plantelCarrera($plantel, $carrera);
                        }
                        var_dump('GUARDANDO ALUMNOS DEL PLANTEL '.$plantel->cct.' - '.$plantel->nombre);
                        //var_dump("Plantel Carrera: " . $plantelCarrera);
                    }

                    //Obtener la carrera en caso de que haya cambiado en el archivo.
                    if($carreraAnterior != $d->{'Clave de Carrera'}){
                        $carreraAnterior = $d->{'Clave de Carrera'};

                        //Se busca en la colección de carreras
                        $carrera = $carreras->where('clave_carrera', $d->{'Clave de Carrera'})->first();

                        if($carrera == null) {
                            //Si no está en la colección, se trae de la bd.
                            $carrera = DB::table('carrera')
                                ->where('clave_carrera', $d->{'Clave de Carrera'})
                                ->first();
                            $carreras->push($carrera);
                        }

                        if($carrera == null){
                            var_dump('ERROR: No existe la carrera - '.$d->{'Clave de Carrera'}.' - '.$d->{'Nombre de Carrera'});
                            $error = true;
                            break;
                        }

                         //Obtener el plantelCarrera
                        $plantelCarrera = $this->plantelCarrera($plantel, $carrera);

                        var_dump('Carrera: '.$carrera->clave_carrera.' '.$carrera->nombre);
                        //var_dump("Plantel Carrera: ".$plantelCarrera);
                    }

                    if($plantelCarrera == null){
                        var_dump('Algo salió mal con el plantel carrera - '.$plantel->nombre.' - '.$carrera->nombre);
                        $error = true;
                        break;
                    }

                    if($d->CURP == null)
                        continue;

                    //Buscar si existe el usuario con el curp
                    $usuario = DB::table('usuario')->where('username', $d->CURP)->first();

                    if($usuario != null) {
                        //var_dump('Ya existe un usuario con este curp: '.$d->CURP);

                        //Buscar el alumno asociado
                        $alumno = DB::table('alumno')->where('usuario_id', $usuario->id)->first();

                        //En caso de que tenga la carrera equivocada, asignar la correcta
                        if($alumno != null && $alumno->plantel_carrera_id != $plantelCarrera){
                            DB::table('alumno')
                                ->where('usuario_id', $usuario->id)
                                ->update([
                                    'plantel_carrera_id' => $plantelCarrera,
                                    'carrera_id' => $carrera->id
                                ]);
                            var_dump("Se actualizó la carrera del alumno {$d->CURP}");
                        }

                        continue;
                    }

                    //Si el usuario no existía, se crea y se crea el alumno.
                    $usuario = DB::table('usuario')->insertGetId([
                        'username' => $d->CURP,
                        'fecha_insert' => Carbon::now(),
                        'password' => bcrypt($d->Matricula),
                        'nombre' => $d->Nombre,
                        'primer_apellido' => $d->{'Ap Paterno'},
                        'segundo_apellido' => $d->{'Ap Materno'},
                        'email' => $d->Correo
                    ]);

                    $genero = ($d->{'Género'} == 'FEMENINO') ? 'M' : 'H';
                    $turno = ($d->Turno == 'VESPERTINO') ? 'TV' : 'TM';

                    $alumno = DB::table('alumno')->insert([
                        'usuario_id' => $usuario,
                        'semestre' => 6,
                        'matricula' => $d->Matricula,
                        'plantel_id' => $plantel->id,
                        'plantel_carrera_id' => $plantelCarrera,
                        'carrera_id' => $carrera->id,
                        'cambio_carrera' => 0,
                        'estatus' => 'Documentos completos',
                        'estatus_inscripcion' => 'Egresado',
                        'permitir_inscripcion' => 'No Permitir',
                        'generacion' => "2018-2021",
                        'genero' => $genero,
                        'turno' => $turno,
                        'grupo' => $d->Grupo
                    ]);

                    $this->asignarRol($usuario, $rol);
                }
            }catch(Exception $e){
                DB::rollBack();
                $error = true;
                var_dump('Error: '.$e->getMessage());
                break;
            }
        }
        if(!$error)
            DB::commit();
        else{
            DB::rollBack();
            var_dump('HA OCURRIDO UN ERROR POR FAVOR VERIFIQUE LA INFORMACIÓN DEL JSON, SE HA HECHO ROLLBACK.');
        }
    }

    private function asignarRol($usuario, $rol){

        $usuarioRol = DB::table('usuarios_roles')->insert([
            'model_id' => $usuario,
            'role_id' => $rol->id,
            'model_type' => 'App\Usuario'
        ]);

        DB::table('usuario_rol')->insert([
            'usuario_id' => $usuario,
            'rol_id' => 3
        ]);

    }

    private function plantelCarrera($plantel, $carrera){
        $plantelCarrera = DB::table('plantel_carrera')
            ->where('carrera_id', $carrera->id)
            ->where('plantel_id', $plantel->id)
            ->first();

        if($plantelCarrera == null){
            $plantelCarrera = DB::table('plantel_carrera')->insertGetId([
                'carrera_id' => $carrera->id,
                'plantel_id' => $plantel->id
            ]);
        }else{
            $plantelCarrera = $plantelCarrera->id;
        }

        return $plantelCarrera;

    }
}
