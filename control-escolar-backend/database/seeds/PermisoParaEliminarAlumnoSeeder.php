<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;


class PermisoParaEliminarAlumnoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permiso = Permission::findOrCreate('Eliminar alumnos', 'api');

        $rolControlEscolarEstatal = Role::findByName('ROLE_CONTROL_ESCOLAR_ESTATAL');
        $rolControlEscolarEstatal->givePermissionTo($permiso);
    }
}
