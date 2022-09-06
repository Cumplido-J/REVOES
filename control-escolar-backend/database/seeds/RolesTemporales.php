<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Usuario;


class RolesTemporales extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Obtener roles y quitar el de SISEC que era temporal
        $controlPlantel = Role::findByName('ROLE_CONTROL_ESCOLAR_PLANTEL');
        $controlPlantel->revokePermissionTo('SISEC');
        $controlEstatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL');
        $controlEstatal->revokePermissionTo('SISEC');

        $seguimientoEstatal = Role::findByName('ROLE_SEGUIMIENTO_ESTATAL');
        $seguimientoPlantel = Role::findByName('ROLE_SEGUIMIENTO_PLANTEL');
        $certificacion = Role::findByName('ROLE_CERTIFICACION');
        //Crear roles de control escolar para los módulos de sisec, para que no les aparezcan todos nuestros módulos
        //a los usuarios de todos los planteles.
        $controlEscolarEstatal = Role::firstOrCreate(['name' => 'ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC', 'guard_name' => 'api']);
        $controlEscolarPlantel = Role::firstOrCreate(['name' => 'ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC', 'guard_name' => 'api']);
        $direccion = Role::findByName('ROLE_DIRECCION');
        $alumno = Role::findByName('ROLE_ALUMNO');
        $dev = Role::findByName('ROLE_DEV');

        //Quitar el permiso temporal de SISEC a los roles que teníamos.
        $direccion->revokePermissionTo('SISEC');

        //Crear los permisos para el menú de navegación y módulos de sisec.
        $permisos = [
            'Actualizar datos',
            'Lista de alumnos',
            'Agregar alumno',
            'Agregar planteles',
            'Lista planteles',
            'Reportes',
            'Reporte estatal',
            'Reporte plantel',
            'Validar alumnos',
            'Consultar alumnos',
            'Certificar alumnos'
        ];

        foreach ($permisos as $p){
            Permission::firstOrCreate(['name' => $p, 'guard_name' => 'api']);
        }

        //Asignar todos los permisos a dev, excepto el de actualizar datos.
        $dev->givePermissionTo([
            'Lista de alumnos',
            'Agregar alumno',
            'Lista planteles',
            'Reportes',
            'Reporte estatal',
            'Reporte plantel',
            'Validar alumnos',
            'Consultar alumnos',
            'Certificar alumnos'
        ]);

        //Asignar permiso de actualizar datos a alumnos
        //$alumno->givePermissionTo('Actualizar datos');

        //Asignar permisos a los roles de seguimiento, control escolar y certificacion
        $seguimientoEstatal->givePermissionTo([
            'Lista de alumnos',
            'Lista planteles',
            'Reporte estatal'
        ]);

        $seguimientoPlantel->givePermissionTo([
            'Lista de alumnos',
            'Reporte plantel'
        ]);

        $controlEscolarPlantel->givePermissionTo([
            'Lista de alumnos',
            'Validar alumnos',
            'Consultar alumnos'
        ]);

        $controlEscolarEstatal->givePermissionTo([
            'Lista de alumnos',
            'Lista planteles',
            'Validar alumnos',
            'Consultar alumnos'
        ]);

        $certificacion->givePermissionTo([
            'Lista de alumnos',
            'Lista planteles',
            'Validar alumnos',
            'Consultar alumnos',
            'Certificar alumnos'
        ]);

        $usuariosSeguimientoPlantel = DB::table('administrador_seguimiento')
            ->where('estado_id', null)->get();

        foreach ($usuariosSeguimientoPlantel as $u) {
            $usuario = Usuario::find($u->usuario_id);
            $usuario->assignRole('ROLE_SEGUIMIENTO_PLANTEL');
        }

        $usuariosSeguimientoEstatal = DB::table('administrador_seguimiento')
            ->where('plantel_id', null)->get();

        foreach ($usuariosSeguimientoEstatal as $u){
            $usuario = Usuario::find($u->usuario_id);
            $usuario->assignRole('ROLE_SEGUIMIENTO_ESTATAL');
        }

        $usuariosControlPlantel = DB::table('administrador_controlescolar')
            ->where('estado_id', null)->get();

        foreach ($usuariosControlPlantel as $u){
            $usuario = Usuario::find($u->usuario_id);
            $usuario->assignRole('ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC');
        }

        $usuariosControlEstatal = DB::table('administrador_controlescolar')
            ->where('plantel_id', null)->get();

        foreach ($usuariosControlEstatal as $u){
            $usuario = Usuario::find($u->usuario_id);
            $usuario->assignRole('ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC');
        }

        $usuariosCertificacion = DB::table('usuario_rol')->where('rol_id', '=', 6)->get();

        foreach ($usuariosCertificacion as $u) {
            $usuario = Usuario::find($u->usuario_id);
            $usuario->assignRole('ROLE_CERTIFICACION');
        }

    }
}
