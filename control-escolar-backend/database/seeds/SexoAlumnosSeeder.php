<?php

use Illuminate\Database\Seeder;
use App\Plantel;
use App\Alumno;

class SexoAlumnosSeeder extends Seeder
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

        foreach ($alumnos as $alumno){
            $curp = $alumno->usuario->username;
            $sexo = strtoupper(Str::substr($curp,10,1));
//            if($sexo != 'H' && $sexo != 'M')
//                var_dump($sexo);

            if($sexo == 'H' || $sexo == 'M'){
                $alumno->genero = $sexo;
                $alumno->save();
            }

        }

    }
}
