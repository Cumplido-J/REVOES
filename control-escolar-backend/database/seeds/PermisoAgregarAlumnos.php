<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PermisoAgregarAlumnos extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permiso = Permission::findByName('Agregar alumno');

        $controlEscolarPlantel = Role::findByName('ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC');
        $controlEscolarEstatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC');
        $seguimientoPlantel = Role::findByName('ROLE_SEGUIMIENTO_PLANTEL');
        $seguimientoEstatal = Role::findByName('ROLE_SEGUIMIENTO_ESTATAL');
        $certificacion = Role::findByName('ROLE_CERTIFICACION');

        $controlEscolarPlantel->givePermissionTo($permiso);
        $controlEscolarEstatal->givePermissionTo($permiso);
        $seguimientoPlantel->givePermissionTo($permiso);
        $seguimientoEstatal->givePermissionTo($permiso);
        $certificacion->givePermissionTo($permiso);
    }
}
