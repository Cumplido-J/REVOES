<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Usuario;
use App\Plantel;

class UsuarioControlEscolarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::beginTransaction();
				$path = 'database/json/usuarios';
				try {
					$files = File::allFiles($path);
					foreach($files as $file) {
						$filename = $file->getFilename();
		
						$data = json_decode(file_get_contents($file));
						$regex = array('/Usuarios/i' ,'/.json/i');
						$replace = "";
						$nombreEstado = preg_replace($regex, $replace, $filename);

						$estados = array('BCS' => 3, 'Guerrero' => 12, 'Nayarit' => 18);
						$estado = $estados[$nombreEstado];
            foreach ($data as $d) {

                if($d->CURP == null){
                    var_dump('El usuario no tiene curp, no se puede guardar.');
                    continue;
                }

                $usuario = Usuario::where('username', $d->CURP)->first();

                if ($usuario != null) {
                    var_dump('Ya existe un usuario con ese CURP');
                    continue;
                }

                $usuario = Usuario::create([
                    'fecha_insert' => \Carbon\Carbon::now(),
                    'username' => $d->CURP,
                    'nombre' => $d->NOMBRE,
                    'primer_apellido' => $d->APELLIDO_PATERNO,
                    'segundo_apellido' => $d->APELLIDO_MATERNO,
                    'email' => $d->CORREO,
                    'password' => bcrypt($d->CURP)
                ]);

                $rol = Str::upper($d->ROL);
                $plantel = null;

                if (Str::upper($d->ALCANCE) == 'PLANTEL') {
                    $plantel = Plantel::where('cct', $d->CLAVE_PLANTEL)->first();
                    if ($plantel == null) {
                        throw new Exception("El plantel no existe. {$d->CLAVE_PLANTEL} {$d->NOMBRE_PLANTEL}");
                    }else{
                        $plantel = $plantel->id;
                    }
                    if($rol == 'CONTROL ESCOLAR')
                        $rol = 'ROLE_CONTROL_ESCOLAR_PLANTEL';
                    else
                        throw new Exception("Rol incorrecto. {$rol}");

                }else if(Str::upper($d->ALCANCE) == 'ESTATAL'){
                    if($rol == 'CONTROL ESCOLAR')
                        $rol = 'ROLE_CONTROL_ESCOLAR_ESTATAL';
                    else if($rol == 'DIRECCIÓN')
                        $rol = 'ROLE_DIRECCION';
                    else
                        throw new Exception("Rol incorrecto. {$rol}");

                }else{
                    throw new Exception("Alcance incorrecto. {$d->ALCANCE}");
                }

                //Asignarle el rol correspondiente
                $usuario->assignRole($rol);

                //Rol para tabla de Ricardo
                DB::table('usuario_rol')->insert([
                    'usuario_id' => $usuario->id,
                    'rol_id' => 5
                ]);

                //Alcance en nuestra tabla
                DB::table('usuario_alcance')->insert([
                    'estado_id' => $estado,
                    'plantel_id' => $plantel,
                    'usuario_id' => $usuario->id
                ]);

                //Alcance en tabla de Ricardo
                DB::table('administrador_controlescolar')->insert([
                    'usuario_id' => $usuario->id,
                    'plantel_id' => $plantel,
                    'estado_id' => $estado
                ]);

						}
					}
          DB::commit();
        }catch(Exception $e){
            var_dump($e->getMessage());
            var_dump('ERROR: SE HA HECHO ROLLBACK');
            DB::rollBack();
        }

    }
}
