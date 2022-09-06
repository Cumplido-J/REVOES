<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Usuario;

class PermisosCargaCalificacion extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $permisos = [
            "Cargar calificaciones docente"
        ];

        $permisosInscripciones = [
            'Configurar fecha inscripcion por grupo',
            'Configurar fecha inscripcion por plantel',
        ];

        $permisosRevocar = [
            "Configuración de evaluaciones"
        ];

        $permisosPlantel = [
            "Desactivar docente",
            "Terminar asignacion de docente",
            "Eliminar asignacion de docente"
        ];

        //roles
        $rolControlEscolarEstatal = Role::where('name', 'ROLE_CONTROL_ESCOLAR_ESTATAL')->first();
        $rolControlEscolarPlantel = Role::where('name', 'ROLE_CONTROL_ESCOLAR_PLANTEL')->first();
        $rolDev = Role::where('name', 'ROLE_DEV')->first();
        $rolDireccion = Role::where('name', 'ROLE_DIRECCION')->first();
        //revocar permisos
        foreach ($permisosRevocar as $permiso){
            $permiso_search = Permission::where('name', $permiso)->first();
            if($permiso_search){
                $rolControlEscolarPlantel->revokePermissionTo($permiso);
            }
        }
        //Asignar permiso
        foreach ($permisos as $permiso){
            $permisos_search = Permission::where('name', $permiso)->first();
            if($permisos_search){   
                $rolControlEscolarEstatal->givePermissionTo($permiso);
                $rolControlEscolarPlantel->givePermissionTo($permiso);
                $rolDireccion->givePermissionTo($permiso);
                $rolDev->givePermissionTo($permiso);
            }
        }
        //Asignar permiso control escolar
        foreach ($permisosInscripciones as $permiso){
            $permisos_search = Permission::where('name', $permiso)->first();
            if($permisos_search){   
                $rolControlEscolarPlantel->givePermissionTo($permiso);
            }
        }
        //Asignar permiso control escolar
        foreach ($permisosPlantel as $permiso){
            $permisos_search = Permission::where('name', $permiso)->first();
            if($permisos_search){   
                $rolControlEscolarPlantel->givePermissionTo($permiso);
            }
        }
    }
}
