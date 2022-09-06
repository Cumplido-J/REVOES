<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermisoCambioContrasenaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permiso = Permission::firstOrCreate(['guard_name' => 'api', 'name' => 'Cambiar contraseña']);

        $control_escolar_plantel = Role::findByName('ROLE_CONTROL_ESCOLAR_PLANTEL');
        $control_escolar_plantel->givePermissionTo($permiso);

        $control_escolar_estatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL');
        $control_escolar_estatal->givePermissionTo($permiso);

        $dev = Role::findByName('ROLE_DEV');
        $dev->givePermissionTo($permiso);

        $docente = Role::findByName('ROLE_DOCENTE');
        $docente->givePermissionTo($permiso);

    }
}
