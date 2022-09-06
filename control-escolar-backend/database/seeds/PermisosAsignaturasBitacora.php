<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Usuario;

class PermisosAsignaturasBitacora extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $permisosEliminar = [
            "Crear asignaciones de docente",
            "Editar asignaciones de docente",
            "Eliminar asignaciones de docente"
        ];

        $permisosNuevos = [
            "Editar asignatura de docente",
            "Eliminar asignatura de docente",
            "Crear asignatura de docente",
            "Ver asignaturas de docente",
            "Ver detalles de asignatura"
        ];

        $permisosBitacora = [
            "Ver rubricas evaluacion",
            "Crear rubricas evaluacion",
            "Editar rubricas evaluacion",
            "Eliminar rubricas evaluacion",
            "Cargar bitacora alumno"
        ];
        //quitar permisos
        $rolControlEscolarEstatal = Role::where('name', 'ROLE_CONTROL_ESCOLAR_ESTATAL')->first();
        $rolControlEscolarPlantel = Role::where('name', 'ROLE_CONTROL_ESCOLAR_PLANTEL')->first();
        $rolDev = Role::where('name', 'ROLE_DEV')->first();
        $rolDireccion = Role::where('name', 'ROLE_DIRECCION')->first();
        //Eliminar permisos
        foreach ($permisosEliminar as $permiso){
            $permiso_test = Permission::where('name', $permiso)->first();
            if($permiso_test){
                $rolControlEscolarEstatal->revokePermissionTo($permiso);
                $rolControlEscolarPlantel->revokePermissionTo($permiso);
                $rolDireccion->givePermissionTo($permiso);
                $rolDev->revokePermissionTo($permiso);
                Permission::where('name', $permiso)->first()->delete();
            }
        }
        //Crear los permisos y asignarlos todos al rol dev.
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
        $rolDocente = Role::where(['name' => 'ROLE_DOCENTE',  'guard_name' => 'api'])->first();
        //Crear los permisos y asignarlos a docente.
        foreach ($permisosBitacora as $permiso){
            $permisos_test = Permission::where('name', $permiso)->first();
            if(!$permisos_test){
                Permission::create(['name' => $permiso, 'guard_name' => 'api']);
                $rolDocente->givePermissionTo($permiso);
            }
        }
        //Crear permiso para las boletas
        $permisoBoletas = Permission::firstOrCreate(['name' => 'Generar boletas', 'guard_name' => 'api']);
        $rolDev->givePermissionTo($permisoBoletas);
        $rolDev->givePermissionTo('Agregar planteles');
        $rolControlEscolarPlantel->givePermissionTo($permisoBoletas);
        $rolControlEscolarEstatal->givePermissionTo($permisoBoletas);
        $rolDireccion->givePermissionTo($permisoBoletas);
        $rolDireccion->givePermissionTo('Lista planteles');
        //Permiso para asignar optativas a grupo-periodo
        $optativas = Permission::where('name', 'Agregar optativas a grupo-periodo')->first();
        $rolControlEscolarEstatal->givePermissionTo($optativas);
        $rolControlEscolarPlantel->givePermissionTo($optativas);
    }
}
