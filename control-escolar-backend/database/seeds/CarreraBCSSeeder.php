<?php

use Illuminate\Database\Seeder;
use App\UAC;
use App\CarreraUac;

class CarreraBCSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Se cargan las materias de la carrera de EMSAD
        $data = json_decode(file_get_contents('database/json/materias-emsad.json'));

        $carrera = 108;

        foreach ($data as $d){
            $uac = UAC::create([
                'nombre' => $d->Asignatura,
                'clave_uac' => $d->Clave,
                'horas' => ($d->{'No. de créditos'}/2)*16,
                'creditos' => $d->{'No. de créditos'},
                'semestre' => $d->Semestre,
                'optativa' => 0,
                'cecyte' => 0,
                'tipo_uac_id' => 1
            ]);

            $carrera_uac = CarreraUac::create([
               'carrera_id' => $carrera,
               'uac_id' => $uac->id,
               'semestre' => $uac->semestre
            ]);
        }

    }
}
