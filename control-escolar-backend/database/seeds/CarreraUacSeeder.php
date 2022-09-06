<?php

use App\UAC;
use App\Carrera;
use App\CarreraUac;
use Illuminate\Database\Seeder;

class CarreraUacSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $anios = [13, 16, 17, 18];
        $noExisten = 0;

        foreach ($anios as $anio) {
            //var_dump("Año: ".$anio);
            $files = File::allFiles('database/json/materias-carreras/'.$anio);

            foreach ($files as $file) {

                $data = json_decode(file_get_contents($file));

//                var_dump($data[0]->{'Nombre de la carrera'});

                $carrera = Carrera::where('clave_carrera', $data[0]->{'Clave de la Carrera'})
                    ->where('nombre', $data[0]->{'Nombre de la carrera'})
                    ->first();

                if ($carrera == null) {
                    /*var_dump('No existe '.$data[0]->{'Nombre de la carrera'});
                    var_dump('Archivo: '.$file->getFilenameWithoutExtension());*/
                    $noExisten++;
                    continue;
                }

                foreach ($data as $d) {
                    if ($d->{'Clave de la UAC'} == null)
                        continue;

                    /*if($d->{'Tipo de la UAC'} != 'Profesional extendida')
                        continue;*/

                    //Cargar los módulos en la tabla uac y crear la relación con la carrera
                    if ($d->{'Campo Disciplinar del MCC'} == null) {
                        $modulo = UAC::where('nombre', $d->{'Nombre de la UAC'})
                            ->where('clave_uac', $d->{'Clave de la UAC'})
                            ->where('tipo_uac_id', 4)
                            ->where('semestre', $d->{'Semestre'})
                            ->first();

                        if($modulo == null) {
                            $modulo = UAC::create([
                                'nombre' => $d->{'Nombre de la UAC'},
                                'clave_uac' => $d->{'Clave de la UAC'},
                                'md' => $d->{'MD'},
                                'ei' => $d->{'EI'},
                                'horas' => $d->{'TOTAL DE HORAS'},
                                'creditos' => $d->{'Créditos'},
                                'semestre' => $d->{'Semestre'},
                                'optativa' => 0,
                                'tipo_uac_id' => 4,
                                'cecyte' => 1
                            ]);
                        }else{
                            var_dump('Ya existe - '.$modulo->nombre);
                        }

                        $modulo_carrera = CarreraUac::where('uac_id', $modulo->id)
                            ->where('carrera_id', $carrera->id)
                            ->where('semestre', $modulo->semestre)
                            ->first();

                        if($modulo_carrera != null)
                            continue;

                        $modulo_carrera = CarreraUac::create([
                           'uac_id' => $modulo->id,
                           'semestre' => $modulo->semestre,
                           'carrera_id' => $carrera->id
                        ]);

                        continue;
                    }
                    //Para cargar la relación de materias-carreras

                    $uac = UAC::where('nombre', $d->{'Nombre de la UAC'})
                        ->first();

                    $campo_disciplinar = DB::table('cat_campo_disciplinar')
                        ->where('nombre', $d->{'Campo Disciplinar del MCC'})
                        ->first();

                    if ($campo_disciplinar == null) {
                        $campo_disciplinar = DB::table('cat_campo_disciplinar')->insertGetId([
                            'nombre' => $d->{'Campo Disciplinar del MCC'}
                        ]);
                    } else {
                        $campo_disciplinar = $campo_disciplinar->id;
                    }

                    if ($uac == null) {
                        var_dump($d->{'Nombre de la UAC'});
                        continue;
                        $optativa = ($d->{'Optativa'} == 'NO') ? false : true;

                        $tipoUac = DB::table('cat_tipo_uac')->where('nombre', $d->{'Tipo de la UAC'})->first();

                        if ($tipoUac == null) {
                            DB::table('cat_tipo_uac')->insertGetId(['nombre' => $d->{'Tipo de la UAC'}]);
                        } else {
                            $tipoUac = $tipoUac->id;
                        }

                        //Crear la uac
                        $uac = UAC::create([
                            'nombre' => $d->{'Nombre de la UAC'},
                            'clave_uac' => $d->{'Clave de la UAC'},
                            'md' => $d->{'MD'},
                            'ei' => $d->{'EI'},
                            'horas' => $d->{'TOTAL DE HORAS'},
                            'creditos' => $d->{'Créditos'},
                            'semestre' => $d->{'Semestre'},
                            'optativa' => $optativa,
                            'campo_disciplinar_id' => $campo_disciplinar,
                            'tipo_uac_id' => $tipoUac,
                            'cecyte' => 1
                        ]);
                    }else{
                        $uac->update([
                            'clave_uac' => $d->{'Clave de la UAC'},
                            'md' => $d->{'MD'},
                            'ei' => $d->{'EI'},
                            'horas' => $d->{'TOTAL DE HORAS'},
                            'creditos' => $d->{'Créditos'},
                            'semestre' => $d->{'Semestre'},
                            'campo_disciplinar_id' => $campo_disciplinar,
                            'cecyte' => 1
                        ]);
                    }

                    $carreraUac = CarreraUac::where('carrera_id', $carrera->id) ->where('uac_id', $uac->id)->first();
                    if($carreraUac == null)
                        CarreraUac::create(['carrera_id' => $carrera->id, 'uac_id' => $uac->id, 'semestre' => $d->{'Semestre'}]);
                }
            }
        }
        //var_dump($noExisten);
    }
}
