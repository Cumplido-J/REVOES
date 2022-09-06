<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Alumno;

class FotosCredencialesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $files = Storage::allFiles('/fotos-sin-subir');

        foreach ($files as $foto){
            $matricula = pathinfo($foto, PATHINFO_FILENAME);
            $nombre = pathinfo($foto, PATHINFO_BASENAME);

            try{
                $alumno = Alumno::where('matricula', $matricula)->orderBy('usuario_id', 'desc')->firstOrFail();

                $clavePlantel = $alumno->plantel->cct;
                $estado = $alumno->plantel->municipio->estado->abreviatura;
                $alumno->ruta_fotografia = "fotos-credenciales/{$estado}/{$clavePlantel}/{$nombre}";
                $alumno->save();

                Storage::move($foto, $alumno->ruta_fotografia);
            }catch(\League\Flysystem\FileExistsException $e){
                var_dump('Ya existe una foto para esa matrícula: '.$matricula);
            }catch(\Illuminate\Database\Eloquent\ModelNotFoundException $e){
                var_dump('No existe el alumno con matrícula: '.$matricula);
            }catch(Exception $e){
                var_dump($e->getMessage().' '.$matricula);
            }

        }
    }
}
