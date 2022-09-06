<?php

use Illuminate\Database\Seeder;
use App\UAC;
use App\CarreraUac;

class CambioUacEmsad extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Borrar las uac y carrera_uac de los que se habían cargado.
        $uac = UAC::where('id', '>=', 777)->where('id', '<=', 824)->get();

        foreach($uac as $u){
            $u->carreras()->detach();
            $u->delete();
        }

        //Cargar las materias que faltan y editar las que ya existen para añadir la clave
        $data = json_decode(file_get_contents('database/json/materias-emsad.json'));

        $carrera = 108;

        foreach ($data as $d){

            $uac = UAC::updateOrCreate(
                ['nombre' => $d->Asignatura, 'semestre' => $d->Semestre, 'cecyte' => 0],
                [
                    'clave_uac' => $d->Clave,
                    'horas' => ($d->{'No. de créditos'} / 2) * 16,
                    'creditos' => $d->{'No. de créditos'},
                    'optativa' => 0,
                    'tipo_uac_id' => 1
                ]
            );

            $carrera_uac = CarreraUac::create([
               'carrera_id' => $carrera,
               'uac_id' => $uac->id,
               'semestre' => $uac->semestre
            ]);
        }

    }
}
