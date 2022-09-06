<?php

use Illuminate\Database\Seeder;
use App\Aspirante;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class ConfigAspiranteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $rolControlEscolarEstatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL');
        $rolDev = Role::findByName('ROLE_DEV');

        $p = Permission::findOrCreate('Configurar fechas para aspirantes', 'api');
        $rolControlEscolarEstatal->givePermissionTo($p);
        $rolDev->givePermissionTo($p);

    }
}
