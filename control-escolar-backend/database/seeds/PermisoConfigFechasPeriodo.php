<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermisoConfigFechasPeriodo extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permiso = Permission::findOrCreate('Configurar fechas de inicio y fin de periodo por estado', 'api');

        $rolControlEscolarEstatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL');
        $rolControlEscolarEstatal->givePermissionTo($permiso);

        $dev = Role::findByName('ROLE_DEV');
        $dev->givePermissionTo($permiso);
    }
}
