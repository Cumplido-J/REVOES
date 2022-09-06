<?php

use Illuminate\Database\Seeder;
use App\Alumno;
use App\Plantel;
use App\CalificacionUac;
use App\CarreraUac;
use App\UAC;
use App\Periodo;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CorrecionMatriculasSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::beginTransaction();
        //crear alumno
        $files = File::allFiles('database/json/correccion/matriculas');
        $error = false;

        foreach ($files as $file) {

            $data = json_decode(file_get_contents($file));
            var_dump('Archivo: '.$file);
            try {
                foreach ($data as $d) {
                    if(isset($d->{'NOMBRE DEL ALUMNO'})){
                        var_dump("////////////////////////////////////////////////////////////////////////////"); //separador
                        var_dump("alumno => ".$d->{'NOMBRE DEL ALUMNO'});
                        //buscar alumno
                        $alumno = Alumno::where('matricula', $d->{'MATRICULA ACTUAL'})->first();
                        if($alumno){
                            //buscar existencia de matricula correcta
                            $matricula_correcta = Alumno::where('matricula', $d->{'MATRICULA CORRECTA'})->first();
                            if(!$matricula_correcta){
                                $alumno->update([
                                    'matricula' => $d->{'MATRICULA CORRECTA'}
                                ]);
                                var_dump("MATRICULA MODIFICADA");
                            }else{
                                var_dump("MATRICULA CORRECTA EXISTENTE => ".$d->{'MATRICULA CORRECTA'});    
                                throw new Exception();
                            }
                        }else{
                            var_dump("MATRICULA ACTUAL NO ENCONTRADA => ".$d->{'MATRICULA ACTUAL'});
                            throw new Exception();
                            //continue;
                        }
                        
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
}
