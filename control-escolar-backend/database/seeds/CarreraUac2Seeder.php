<?php

use App\UAC;
use App\Carrera;
use App\CarreraUac;
use App\CatTipoUac;
use Illuminate\Database\Seeder;

class CarreraUac2Seeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::beginTransaction();
        $files = File::allFiles('database/json/materias-carreras');
        $error = false;

        foreach ($files as $file) {
            $data = json_decode(file_get_contents($file));
            var_dump('Archivo: '.$file);
            $cont = 0;
            try {
                foreach ($data as $d) {
                    /* buscar carrera */
                    $carrera = Carrera::where('clave_carrera', $d->{'Clave Carrera'})->first();
                    if($carrera){
                        /* buscar uac */
                        //var_dump("BUSCAR UAC");
                        //var_dump($d->{"Nombre de la UAC"});
                        $uac = UAC::where('clave_uac', $d->{'Clave de la UAC'})->first();
                        if($uac){
                            //var_dump("EXISTE");
                            //var_dump($d->{"Nombre de la UAC"});
                            $this->relacionCarreraUac($carrera, $uac, $d->{"Semestre"});
                        }else{
                            $cont ++;
                            var_dump("No existe la uac clave => " . $d->{'Clave de la UAC'});
                            var_dump($d->{"Nombre de la UAC"});
                            var_dump($cont);
                            /* crear uac */
                            /* tipo uac */
                            $tipo_uac = CatTipoUac::where('nombre', $d->{'Tipo de la UAC'})->first();
                            if(!$tipo_uac){
                                var_dump("Tipo uac no existe => ". $d->{'Tipo de la UAC'});
                                continue;
                            }
                            if($tipo_uac->id == 3){
                                $modulo = true;
                            }else{
                                $modulo = false;
                            }
                            var_dump("CREAR UAC =>" . $d->{"Nombre de la UAC"});
                            $uac = UAC::create([
                                'nombre' => $d->{'Nombre de la UAC'},
                                'clave_uac' => $d->{'Clave de la UAC'},
                                'horas' => ($d->{'Créditos'}/2)*16,
                                'creditos' => $d->{'Créditos'},
                                'semestre' => $d->{'Semestre'},
                                'optativa' => $d->{'Optativa'} == "No" ? 0 : 1,
                                'tipo_uac_id' => $tipo_uac->id,
                                'cecyte' => 0,
                            ]);
                            if($modulo){
                               /* $uac->update([
                                    'modulo_id' => $uac->id
                                ]);*/
                            }
                            /* relacion carrera uac*/
                            $this->relacionCarreraUac($carrera, $uac, $d->{"Semestre"});
                            //throw new Exception();      
                        }
                    }else{
                        /* crear carrera */
                        var_dump("No existe la carrera " . $d->{'Clave Carrera'});
                        throw new Exception();
                        //continue;
                    }
                }
            }catch(Exception $e){
                $error = true;
                var_dump('ERROR: '.$e->getMessage().' - '.$e->getLine());
                DB::rollBack();
                break;
            }
        }

        
        if(!$error)
        DB::commit();
        else
        DB::rollBack();
    }

    public function relacionCarreraUac($carrera, $uac, $semestre)
    {
       /* buscar relación */
       $carrera_uac = CarreraUac::where([
            ['carrera_id', $carrera->id],
            ['uac_id', $uac->id],
            ['semestre', $semestre]
        ])->first();
        if(!$carrera_uac){
            var_dump("Crear carrera uac");
            $carrera_uac = CarreraUac::create([
                'carrera_id' => $carrera->id,
                'uac_id' => $uac->id,
                'semestre' => $semestre
            ]);
        }
    }
}
