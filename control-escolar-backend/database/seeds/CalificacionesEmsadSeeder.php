<?php

use Illuminate\Database\Seeder;
use App\CarreraUac;
use App\UAC;
use App\CalificacionUac;
use App\GrupoPeriodo;
use App\Alumno;

class CalificacionesEmsadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Datos de los json de calificaciones
        $files = File::allFiles('database/json/calificaciones');

        foreach ($files as $file){

            $data = json_decode(file_get_contents($file));
            $keys = array_keys((array)$data[0]);
            array_splice($keys,0,3);

            $carreraUacs = [];

            foreach ($keys as $uac){
                //Id 108 es el de la carrera de Tecnologías de la Información y la Comunicación que es la única
                // que se imparte en los EMSAD
                $uac = UAC::where('clave_uac', explode(' ', $uac)[0])->first();
                $carreraUac = CarreraUac::where('uac_id', $uac->id)->where('carrera_id', 108)->first();
                if($carreraUac == null) {
                    var_dump(explode(' ', $uac)[0]);
                }
                array_push($carreraUacs, $carreraUac->id);
            }

            $grupo = GrupoPeriodo::where('grupo', $data[0]->GRUPO)->first();

            foreach ($data as $d){
                $alumno = Alumno::with('usuario')->where('matricula', $d->MATRICULA)->first();

                foreach ($keys as $num => $uac){

                    CalificacionUac::create([
                        'alumno_id' => $alumno->usuario_id,
                        'carrera_uac_id' => $carreraUacs[$num],
                        'grupo_periodo_id' => $grupo->id,
                        'calificacion' => $d->{$uac},
                        'periodo_id' => 15,
                        'plantel_id' => 695,
                        'parcial' => substr($uac, -1, 1)
                    ]);

                }

                $uacs = CarreraUac::whereHas('calificaciones', function($query) use ($alumno){
                    $query->where('alumno_id', $alumno->usuario_id)->where('parcial', '<', 4);
                })
                ->with(['calificaciones' => function($query) use ($alumno){
                    $query->where('alumno_id', $alumno->usuario_id)->where('parcial', '<', 4);
                }, 'uac'])->whereIn('id', $carreraUacs)->get();


                foreach ($uacs as $uac){
                    //var_dump($uac->calificaciones->avg('calificacion'));
                    CalificacionUac::create([
                        'alumno_id' => $alumno->usuario_id,
                        'carrera_uac_id' => $uac->id,
                        'grupo_periodo_id' => $grupo->id,
                        'calificacion' => round( $uac->calificaciones->avg('calificacion'), 1, PHP_ROUND_HALF_UP),
                        'periodo_id' => 15,
                        'plantel_id' => 695,
                        'parcial' => 4
                    ]);
                }

            }
        }
    }
}
