<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Usuario;
use App\Docente;
use App\DocentePlantilla;
use App\UsuarioDocente;

class PermisosDocenteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //return $permisos = auth()->user()->givePermissionTo('Ver mis asignaciones');
        /* crear plantilla docente */
        $docente = Docente::where('curp', 'OUON921106MNTSLB00')->first();
        $usuario = Usuario::where('username', 'OUON921106MNTSLB00')->first();
        if($docente){
            $docente_plantilla = DocentePlantilla::create([
                'fecha_asignacion' => '2017-08-08',
                'fecha_inicio_contrato' => '2017-08-08',
                'horas' => '17',
                'docente_id' => $docente->id,
                'cat_tipo_Plaza_id' => 1,
                'plantel_id' => '997',
                'plantilla_estatus' => 1
            ]);
            /* crear relacion docente */
            $usuario_docente = UsuarioDocente::create([
                'docente_id' => $docente->id,
                'usuario_id' => $usuario->id
            ]);
            $permisos_docente = [
                'Ver mis asignaciones',
                'Cargar calificaciones docente',
                'Ver rubricas evaluacion',
                'Crear rubricas evaluacion',
                'Editar rubricas evaluacion',
                'Eliminar rubricas evaluacion',
                'Cargar bitacora alumno',
                'Cargar calificaciones recursamiento intersemestral',
                'Ver detalles de asignatura recursamiento intersemestral',
                'Ver detalles de mis asignaturas'
            ];
            foreach($permisos_docente as $permiso){
                //$asignar =  auth()->user()->givePermissionTo($permiso);
                $asignar =  $usuario->givePermissionTo($permiso);
            }
        }
    }
}
