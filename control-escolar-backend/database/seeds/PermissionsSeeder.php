<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Usuario;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Falta por definir algunos de los permisos que se utilizarán para los módulos nuevos. Todo
         * se manejará en este seeder hasta que se tenga el módulo de permisos o se terminen de
         * definir para añadirlos a un archivo SQL e importarlo a la BD.
        */

        //********************* TEMPORAL PARA PRUEBAS ********************
        $temporalEstatal = Role::create(['name' => 'ROLE_ESTATAL', 'guard_name' => 'api']);
        $temporalPlantel = Role::create(['name' => 'ROLE_PLANTEL', 'guard_name' => 'api']);
        //********************* TEMPORAL PARA PRUEBAS ********************

        //Se crea el rol "ROLE_DEV"
        $rolDev = Role::create(['name' => 'ROLE_DEV', 'guard_name' => 'api']);

        $rolDireccion = Role::create(['name' => 'ROLE_DIRECCION', 'guard_name' => 'api']);
        $rolAlumno = Role::create(['name' => 'ROLE_ALUMNO', 'guard_name' => 'api']);
        $rolSeguimientoEstatal = Role::create(['name' => 'ROLE_SEGUIMIENTO_ESTATAL',  'guard_name' => 'api']);
        $rolSeguimientoPlantel = Role::create(['name' => 'ROLE_SEGUIMIENTO_PLANTEL',  'guard_name' => 'api']);
        $rolControlEscolarEstatal = Role::create(['name' => 'ROLE_CONTROL_ESCOLAR_ESTATAL',  'guard_name' => 'api']);
        $rolControlEscolarPlantel = Role::create(['name' => 'ROLE_CONTROL_ESCOLAR_PLANTEL',  'guard_name' => 'api']);
        $rolCertificacion = Role::create(['name' => 'ROLE_CERTIFICACION',  'guard_name' => 'api']);
        $rolDocente = Role::create(['name' => 'ROLE_DOCENTE',  'guard_name' => 'api']);

        $permiso = Permission::create(['name' => 'Estatal', 'guard_name' => 'api']);
        $permiso = Permission::create(['name' => 'Plantel', 'guard_name' => 'api']);
        $permiso = Permission::create(['name' => 'Nacional', 'guard_name' => 'api']);

        //Arreglo para TODOS los permisos, excepto los dos de alcance que están arriba.
        $permisos = [
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
            'Crear asignaciones de docente',
            'Editar asignaciones de docente',
            'Eliminar asignaciones de docente',
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
            /* docente */
            'Ver mis asignaciones',
            'Cargar calificaciones docente',
            //Módulos de SISEC
            'SISEC'
        ];

        //Crear los permisos y asignarlos todos al rol dev.
        foreach ($permisos as $permiso){
            Permission::create(['name' => $permiso, 'guard_name' => 'api']);
        }

        //********************* TEMPORAL PARA PRUEBAS ********************
        $temporalEstatal->givePermissionTo('Estatal');
        $temporalEstatal->givePermissionTo($permisos);
        $temporalEstatal->revokePermissionTo('Ver mis asignaciones');
        $temporalEstatal->revokePermissionTo('Cargar calificaciones docente');

        $temporalPlantel->givePermissionTo('Plantel');
        $temporalPlantel->givePermissionTo($permisos);
        $temporalPlantel->revokePermissionTo('Ver mis asignaciones');
        $temporalPlantel->revokePermissionTo('Cargar calificaciones docente');
        //********************* TEMPORAL PARA PRUEBAS ********************

        $rolDev->givePermissionTo($permisos);
        $rolDev->givePermissionTo('Nacional');
        $rolDev->revokePermissionTo('Ver mis asignaciones');
        $rolDev->revokePermissionTo('Cargar calificaciones docente');
        $rolDireccion->givePermissionTo($permisos);
        $rolDireccion->revokePermissionTo('Ver mis asignaciones');
        $rolDireccion->revokePermissionTo('Cargar calificaciones docente');
        $rolDireccion->givePermissionTo('Estatal');

        $permisosSeguimientoEstatal = [
            'Estatal'
        ];

        $permisosSeguimientoPlantel = [
            'Plantel'
        ];

        $permisosControlEstatal = [
            'Estatal',
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
            'Crear asignaciones de docente',
            'Editar asignaciones de docente',
            'Eliminar asignaciones de docente',
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
            'Configuración de evaluaciones',
            'Registrar alumnos',
            'Inscribir alumnos a grupo',
            'SISEC'
        ];

        $rolControlEscolarEstatal->givePermissionTo($permisosControlEstatal);

        $permisosControlPlantel = [
            'Plantel',
            'Ver docente',
            'Buscar docente',
            'Editar docente',
            'Eliminar docente',
            'Crear docente',
            'Dar de baja por permiso a docente',
            'Dar de baja docente',
            'Reingreso de docente',
            'Crear asignacion de docente',
            'Editar asignacion de docente',
            'Ver detalles de asignacion',
            'Crear asignaturas de docente',
            'Editar asignaturas de docente',
            'Eliminar asignaturas de docente',
            'Ver asignaciones de docente',
            'Crear asignaciones de docente',
            'Editar asignaciones de docente',
            'Eliminar asignaciones de docente',
            'Buscar grupo',
            'Crear grupo',
            'Editar grupo',
            'Eliminar grupo',
            'Activar grupo',
            'Buscar grupo periodo',
            'Eliminar grupo periodo',
            'Configuración de evaluaciones',
            'Registrar alumnos',
            'Inscribir alumnos a grupo',
            'SISEC'
        ];

        $rolControlEscolarPlantel->givePermissionTo($permisosControlPlantel);

        /* docente */
        $permisosDocente = [
            'Ver mis asignaciones',
            'Cargar calificaciones docente'
        ];
        $rolDocente->givePermissionTo($permisosDocente);
        $rolDocente->givePermissionTo('Plantel');
    }
}
