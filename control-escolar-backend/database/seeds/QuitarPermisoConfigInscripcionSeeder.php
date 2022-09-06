<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Usuario;

class QuitarPermisoConfigInscripcionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        //Rol
        $rolControlEscolarPlantel = Role::where('name', 'ROLE_CONTROL_ESCOLAR_PLANTEL')->first();

        //Quitar permisos
        $rolControlEscolarPlantel->revokePermissionTo('Configurar fecha inscripcion por grupo');
        $rolControlEscolarPlantel->revokePermissionTo('Configurar fecha inscripcion por plantel');

    }
}
