<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Usuario;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = ['','ROLE_DEV','','ROLE_ALUMNO', 'ROLE_SEGUIMIENTO', 'ROLE_CONTROLESCOLAR', 'ROLE_CERTIFICACION'];

        //Para usuarios ROLE_DEV
        $usuariosDev = DB::table('usuario_rol')->where('rol_id', 1)->get();

        //Pendiente: Cambiar ya que se hagan las pruebas
        foreach ($usuariosDev as $u){

            DB::table('usuarios_roles')->insert([
                'role_id' => 13,
                'model_type' => 'App\Usuario',
                'model_id' => $u->usuario_id
            ]);

        }
        /* docente */
        /* francisco avalos */
        /* curp: AAPF970618HSLVRR06
        pass : 123 */
        /*$usuarioDocente = DB::table('usuario_docente')->where('docente_id', 1)->first();
        DB::table('usuarios_roles')->insert([
                'role_id' => 21,
                'model_type' => 'App\Usuario',
                'model_id' => $usuarioDocente->usuario_id
        ]);*/


        //Usuarios con ROLE_ALUMNO (Sólo toma 10 de ejemplo porque son muchísimos)
        /*$usuariosAlumno = DB::table('usuario_rol')
            ->where('rol_id', 3)
            ->orderBy('usuario_id')
            ->take(10)
            ->get();

        foreach ($usuariosAlumno as $u){

            DB::table('usuarios_roles')->insert([
                'role_id' => 13,
                'model_type' => 'App\Usuario',
                'model_id' => $u->usuario_id
            ]);

        }

        //Para usuarios ROLE_CONTROLESCOLAR
        /*$usuariosControl = DB::table('usuario_rol')->where('rol_id', 5)->get();

        foreach ($usuariosControl as $u){

            $alcance = DB::table('administrador_controlescolar')->where('usuario_id', $u->usuario_id)->get();

            foreach ($alcance as $a){
                $rol = 0;
                if($a->estado_id != null){
                    //Se aplica el rol control escolar estatal
                    $rol = 16;
                }else if($a->plantel_id != null){
                    //Se aplica el rol control escolar plantel
                    $rol = 17;
                }

                if($rol != 0) {

                    DB::table('usuarios_roles')->insert([
                        'role_id' => $rol,
                        'model_type' => 'App\Usuario',
                        'model_id' => $u->usuario_id
                    ]);

                    DB::table('usuario_alcance')->insert([
                        'usuario_id' => $u->usuario_id,
                        'estado_id' => $a->estado_id,
                        'plantel_id' => $a->plantel_id
                    ]);
                }
            }

        }

        //Usuarios con ROLE_CERTIFICACION (No hay)
        /*$usuariosCertificacion = DB::table('usuario_rol')->where('rol_id', 6)->get();

        foreach ($usuariosCertificacion as $u){

            DB::table('usuarios_roles')->insert([
                'role_id' => 18,
                'model_type' => 'App\Usuario',
                'model_id' => $u->usuario_id
            ]);

            $alcance = DB::table('administrador_certificacion')->where('usuario_id', $u->usuario_id)->first();

            DB::table('usuario_alcance')->insert([
                'usuario_id' => $u->usuario_id,
                'estado_id' => $alcance->estado_id,
                'plantel_id' => $alcance->plantel_id
            ]);

        }*/

        //********************* TEMPORAL PARA PRUEBAS ********************
        /*$temporalEstatal = Usuario::create([
            'nombre' => 'Prueba estatal',
            'primer_apellido' => 'BCS',
            'segundo_apellido' => 'Prueba',
            'username' => 'LARB940829MJCRBR03',
            'email' => 'blara.dev@gmail.com',
            'password' => bcrypt('holis')
        ]);

        $temporalEstatal->assignRole('ROLE_ESTATAL');
        DB::table('usuario_alcance')->insert([
            'usuario_id' => $temporalEstatal->id,
            'estado_id' => 3,
            'plantel_id' => null
        ]);

        DB::table('usuario_rol')->insert([
            'usuario_id' => $temporalEstatal->id,
            'rol_id' => 1
        ]);

        $temporalPlantel = Usuario::create([
            'nombre' => 'Prueba plantel',
            'primer_apellido' => 'BCS',
            'segundo_apellido' => 'Prueba',
            'username' => 'PAGM970304HJCRRG09',
            'email' => 'miguelparradev@gmail.com',
            'password' => bcrypt('holis')
        ]);

        $temporalPlantel->assignRole('ROLE_PLANTEL');
        DB::table('usuario_alcance')->insert([
            'usuario_id' => $temporalPlantel->id,
            'estado_id' => null,
            'plantel_id' => 46
        ]);

        DB::table('usuario_rol')->insert([
            'usuario_id' => $temporalPlantel->id,
            'rol_id' => 1
        ]);*/
        //********************* TEMPORAL PARA PRUEBAS ********************
    }
}
