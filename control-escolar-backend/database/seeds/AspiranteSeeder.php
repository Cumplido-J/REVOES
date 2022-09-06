<?php

use Illuminate\Database\Seeder;
use App\Aspirante;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AspiranteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $permisos = [
            'Registrar aspirantes',
            'Editar aspirantes',
            'Ver aspirantes',
            'Eliminar aspirantes',
            'Promover aspirantes'
        ];

        $rolControlEscolarEstatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL');
        $rolControlEscolarPlantel = Role::findByName('ROLE_CONTROL_ESCOLAR_PLANTEL');
        $rolDev = Role::findByName('ROLE_DEV');

        foreach($permisos as $permiso) {
            $p = Permission::findOrCreate($permiso, 'api');
            $rolControlEscolarEstatal->givePermissionTo($p);
            $rolControlEscolarPlantel->givePermissionTo($p);
            $rolDev->givePermissionTo($p);
        }

    }
}
