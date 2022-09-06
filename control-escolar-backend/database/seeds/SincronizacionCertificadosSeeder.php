<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SincronizacionCertificadosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permiso = Permission::findOrCreate('Sincronizar calificaciones para certificados', 'api');
        $controlEscolarEstatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL');
        $direccion = Role::findByName('ROLE_DIRECCION');
        $dev = Role::findByName('ROLE_DEV');
        $controlEscolarEstatal->givePermissionTo($permiso);
        $dev->givePermissionTo($permiso);
        $direccion->givePermissionTo($permiso);
    }
}
