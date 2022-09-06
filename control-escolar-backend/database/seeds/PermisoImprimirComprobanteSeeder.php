<?php

use App\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermisoImprimirComprobanteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Crear permiso
        $permiso = Permission::firstOrCreate(['guard_name' => 'api', 'name' => 'Imprimir comprobante de inscripción aspirantes']);

        //Obtener usuarios de control escolar de BCS
        $usuariosControlEscolar = Usuario::role(['ROLE_CONTROL_ESCOLAR_PLANTEL', 'ROLE_CONTROL_ESCOLAR_ESTATAL'])
            ->get()->pluck('id');

        //Obtener el alcance para BCS
        $bcs = DB::table('detalle_alcance')->where('estado_id', 3)->get()->pluck('catalcanceusuario_id');

        //Obtener los usuarios con alcence en BCS
        $alcance = DB::table('administrador_alcance_usuario')
            ->whereIn('catalcance_id', $bcs)
            ->get();

        //Obtener sólo los usuarios de BCS de control escolar
        $alcance = $alcance->whereIn('usuario_id', $usuariosControlEscolar)->pluck('usuario_id');

        //Obtener usuarios con rol dev
        $dev = Usuario::role('ROLE_DEV')->get()->pluck('id');

        $usuarios = array_merge($alcance->toArray(), $dev->toArray());

        //Asignar el permiso al usuario
        $usuarios = Usuario::whereIn('id', $usuarios)->get();
        foreach($usuarios as $usuario){
            $usuario->givePermissionTo($permiso);
        }

    }
}
