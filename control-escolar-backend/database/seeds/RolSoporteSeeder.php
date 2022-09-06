<?php

use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Usuario;

class RolSoporteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $soporte = Role::firstOrCreate(['name' => 'ROLE_SOPORTE_TECNICO', 'guard_name' => 'api']);
      
        $soporte->syncPermissions([
            'Nacional',
            'Ver docente',
            'Buscar docente',
            'Editar docente',
            'Eliminar docente',
            'Crear docente',
            'Dar de baja por permiso a docente',
            'Dar de baja docente',
            'Reingreso de docente',
            'Desactivar docente',
            'Crear asignacion de docente',
            'Editar asignacion de docente',
            'Eliminar asignacion de docente',
            'Terminar asignacion de docente',
            'Ver detalles de asignacion',
            'Crear asignaturas de docente',
            'Editar asignaturas de docente',
            'Eliminar asignaturas de docente',
            'Ver asignaciones de docente',
            'Editar asignatura de docente',
            'Eliminar asignatura de docente',
            'Crear asignatura de docente',
            'Ver asignaturas de docente',
            'Ver detalles de asignatura',
            'Buscar grupo',
            'Crear grupo',
            'Editar grupo',
            'Eliminar grupo',
            'Activar grupo',
            'Aprobar grupos',
            'Buscar grupo periodo',
            'Editar grupo periodo',
            'Eliminar grupo periodo',
            'Configurar fecha inscripcion por grupo',
            'Configurar fecha inscripcion por plantel',
            'Agregar optativas a grupo-periodo',
            'Registrar alumnos',
            'Inscribir alumnos a grupo',
            'Configuración de evaluaciones',
            'Ver mis asignaciones',
            'Cargar calificaciones docente',
            'Ver rubricas evaluacion',
            'Crear rubricas evaluacion',
            'Editar rubricas evaluacion',
            'Eliminar rubricas evaluacion',
            'Cargar bitacora alumno',
            'Cargar calificaciones recursamiento intersemestral',
            'Ver detalles de asignatura recursamiento intersemestral',
            'Ver asignaturas recursamiento intersemestral',
            'Agregar asignatura recursamiento intersemestral',
            'Editar asignatura recursamiento intersemestral',
            'Eliminar asignatura recursamiento intersemestral',
            'Configuracion de recursamiento intersemestral',
            'Configuracion de correccion parcial',
            'Generar boletas',
            'Sincronizar calificaciones para certificados',
            'Lista planteles',
            'Lista carreras',
            'Lista competencias',
        ]);

        $docente = Role::firstOrCreate(['name' => 'ROLE_DOCENTE', 'guard_name' => 'api']);

        $permiso_nuevo = [
            'Ver detalles de mis asignaturas'
        ];

        foreach ($permiso_nuevo as $permiso){
            $permisos_test = Permission::where('name', $permiso)->first();
            if(!$permisos_test){
                Permission::create(['name' => $permiso, 'guard_name' => 'api']);
                $docente->givePermissionTo($permiso);
                $soporte->givePermissionTo($permiso);
            }
        }

        
        //Cuentas para developers
        $datos = [
            [
                'fecha_insert' => \Carbon\Carbon::now(),
                'username' => 'LARB940829MJCRBR03',
                'nombre' => 'Brenda Cecilia',
                'primer_apellido' => 'Lara',
                'segundo_apellido' => 'Rubio',
                'email' => 'brenda.lara@cecytebcs.edu.mx',
                'password' => bcrypt(\Illuminate\Support\Str::random(8)),
                'rol' => 'ROLE_DEV',
                'rol_id' => 1,
            ],
            [
                'fecha_insert' => \Carbon\Carbon::now(),
                'username' => 'PAGM970304HJCRRG09',
                'nombre' => 'Miguel',
                'primer_apellido' => 'Parra',
                'segundo_apellido' => 'García',
                'email' => 'miguel.parra@cecytebcs.edu.mx',
                'password' => bcrypt(\Illuminate\Support\Str::random(8)),
                'rol' => 'ROLE_DEV',
                'rol_id' => 1,

            ],
            [
                'fecha_insert' => \Carbon\Carbon::now(),
                'username' => 'AAPF970618HSLVRR03',
                'nombre' => 'Francisco Javier',
                'primer_apellido' => 'Avalos',
                'segundo_apellido' => 'Prado',
                'email' => 'francisco.avalos@cecytebcs.edu.mx',
                'password' => bcrypt(\Illuminate\Support\Str::random(8)),
                'rol' => 'ROLE_DEV',
                'rol_id' => 1,
            ],
            [
                'fecha_insert' => \Carbon\Carbon::now(),
                'username' => 'RAVV950917HGRDLL03',
                'nombre' => 'Vladimir',
                'primer_apellido' => 'Radilla',
                'segundo_apellido' => 'del Valle',
                'email' => 'vladimir.radilla@cecytebcs.edu.mx',
                'password' => bcrypt(\Illuminate\Support\Str::random(8)),
                'rol' => 'ROLE_DEV',
                'rol_id' => 1,
            ],
            [
                'fecha_insert' => \Carbon\Carbon::now(),
                'username' => 'ZUAJ870923HBSXRS05',
                'nombre' => 'Jesús Antonio',
                'primer_apellido' => 'Zúñiga',
                'segundo_apellido' => 'Arce',
                'email' => 'jesus.zuniga@cecytebcs.edu.mx',
                'password' => bcrypt(\Illuminate\Support\Str::random(8)),
                'rol' => 'ROLE_DEV',
                'rol_id' => 1,
            ],
            [
                'fecha_insert' => \Carbon\Carbon::now(),
                'username' => 'EIVR820406MBSNLC02',
                'nombre' => 'Rocio Lizeth',
                'primer_apellido' => 'Enciso',
                'segundo_apellido' => 'Villarreal',
                'email' => 'rocio.enciso@cecytebcs.edu.mx',
                'password' => bcrypt(\Illuminate\Support\Str::random(8)),
                'rol' => 'ROLE_SOPORTE_TECNICO',
                'rol_id' => 1,
            ],
//            [
//                'fecha_insert' => \Carbon\Carbon::now(),
//                'username' => 'CUMO850417HBSVNS00',
//                'nombre' => 'Oscar Othoniel',
//                'primer_apellido' => 'Cuevas',
//                'segundo_apellido' => 'Montoya',
//                'email' => 'oscar.cuevas@cecytebcs.edu.mx',
//                'password' => bcrypt(\Illuminate\Support\Str::random(8)),
//                'rol' => 'ROLE_SOPORTE_TECNICO',
//                'rol_id' => 1,
//            ]
        ];

        foreach ($datos as $d){
            $password = \Illuminate\Support\Str::random(8);
            var_dump("{$d['username']} : {$password}");

            $usuario = Usuario::create([
                'fecha_insert' => \Carbon\Carbon::now(),
                'username' => $d['username'],
                'nombre' => $d['nombre'],
                'primer_apellido' => $d['primer_apellido'],
                'segundo_apellido' => $d['segundo_apellido'],
                'email' => $d['email'],
                'password' => bcrypt($password)
            ]);
            //Asignarle el rol correspondiente
            $usuario->assignRole($d['rol']);

            //Rol para tabla de Ricardo
            DB::table('usuario_rol')->insert([
                'usuario_id' => $usuario->id,
                'rol_id' => $d['rol_id']
            ]);

        }

        $usuarioOscar = Usuario::where('username', 'CUMO850417HBSVNS00')->first();
        $usuarioOscar->syncRoles(['ROLE_SOPORTE_TECNICO']);
        //CUMO8504173T7

        DB::table('usuario_rol')->insert([
            'usuario_id' => $usuarioOscar->id,
            'rol_id' => 1
        ]);
    }
}
