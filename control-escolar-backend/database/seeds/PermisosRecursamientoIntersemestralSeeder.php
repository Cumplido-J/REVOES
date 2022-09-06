<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Usuario;

class PermisosRecursamientoIntersemestralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $permisosNuevos = [
            "Cargar calificaciones recursamiento intersemestral",
            "Ver detalles de asignatura recursamiento intersemestral",
            "Ver asignaturas recursamiento intersemestral",
            "Agregar asignatura recursamiento intersemestral",
            "Editar asignatura recursamiento intersemestral",
            "Eliminar asignatura recursamiento intersemestral"
        ];

        $permisosDireccion = [
            "Configuracion de recursamiento intersemestral",
            "Configuracion de correccion parcial"
        ];

        //quitar permisos
        $rolControlEscolarEstatal = Role::where('name', 'ROLE_CONTROL_ESCOLAR_ESTATAL')->first();
        $rolControlEscolarPlantel = Role::where('name', 'ROLE_CONTROL_ESCOLAR_PLANTEL')->first();
        $rolDev = Role::where('name', 'ROLE_DEV')->first();
        $rolDireccion = Role::where('name', 'ROLE_DIRECCION')->first();

        //Crear los permisos y asignarlos
        foreach ($permisosNuevos as $permiso){
            $permisos_test = Permission::where('name', $permiso)->first();
            if(!$permisos_test){
                Permission::create(['name' => $permiso, 'guard_name' => 'api']);
                $rolControlEscolarEstatal->givePermissionTo($permiso);
                $rolControlEscolarPlantel->givePermissionTo($permiso);
                $rolDireccion->givePermissionTo($permiso);
                $rolDev->givePermissionTo($permiso);
            }
        }

        //Direccion
        foreach ($permisosDireccion as $permiso){
            $permisos_test = Permission::where('name', $permiso)->first();
            if(!$permisos_test){
                Permission::create(['name' => $permiso, 'guard_name' => 'api']);
                $rolDireccion->givePermissionTo($permiso);
                $rolControlEscolarEstatal->givePermissionTo($permiso);
                $rolDev->givePermissionTo($permiso);
            }
        }
        //docente
        $rolDocente = Role::where(['name' => 'ROLE_DOCENTE',  'guard_name' => 'api'])->first();
        $permiso = Permission::where('name', 'Cargar calificaciones recursamiento intersemestral')->first();
        $rolDocente->givePermissionTo($permiso);
        $permiso = Permission::where('name', 'Ver detalles de asignatura recursamiento intersemestral')->first();
        $rolDocente->givePermissionTo($permiso);
    }
}
