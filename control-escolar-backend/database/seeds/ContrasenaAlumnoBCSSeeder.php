<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Plantel;
use App\Alumno;

class ContrasenaAlumnoBCSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Obtener planteles de BCS
        $plantelesBCS = Plantel::whereHas('municipio', function($query){
           $query->where('estado_id', 3);
        })->get()->pluck('id')->toArray();

        //Obtener alumnos de BCS activos.
        $alumnos = Alumno::whereIn('plantel_id', $plantelesBCS)->where('estatus_inscripcion', 'activo')->get();

        foreach ($alumnos as $alumno) {
            //Cambiar contraseña
            DB::table('usuario')->where('id', $alumno->usuario_id)->update(['password' => bcrypt($alumno->matricula)]);
            //Asignar rol de alumno en tabla de sisec.
            DB::table('usuario_rol')->insert(['usuario_id' => $alumno->usuario_id, 'rol_id' => 3]);
            var_dump('Se modificó el alumno '.$alumno->matricula);
        }

    }
}
