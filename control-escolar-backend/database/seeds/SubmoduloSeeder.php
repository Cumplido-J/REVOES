<?php

use Illuminate\Database\Seeder;
use App\UAC;
use App\Carrera;
use App\CarreraUac;
use Illuminate\Support\Facades\DB;
class SubmoduloSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
//        $file = File::allFiles('database/json/submodulos.json');
			DB::beginTransaction();
			try {
				$files = File::allFiles('database/json/submodulos');
					//$data = json_decode(file_get_contents('database/json/submodulos-prod-alimentos.json'));
				foreach($files as $file) {
					$data = json_decode(file_get_contents($file));
					foreach ($data as $d){
							$carrera = Carrera::where('clave_carrera', $d->CLAVE_CARRERA)->first();

							if($carrera == null){
									var_dump('La carrera: '.$d->NOMBRE_CARRERA . ' no se encuentra registrada');
									continue;
							} 
							$modulo = UAC::where('clave_uac', $d->CLAVE_MODULO)->first();

							if($modulo == null){
									var_dump('El módulo '.$d->CLAVE_MODULO.', '.$d->NOMBRE_MODULO . ' no se encuentra registrado');
									continue;
							}

							$submodulo = UAC::firstOrCreate([
									'clave_uac' => $d->CLAVE_SUBMODULO
							],[
									'nombre' => $d->NOMBRE_SUBMODULO,
									'horas' => $d->HORAS*16,
									'creditos' => $d->CREDITOS,
									'semestre' => $d->SEMESTRE,
									'optativa' => 0,
									'tipo_uac_id' => 10,
									'cecyte' => 1,
									'modulo_id' => $modulo->id
							]);

							$carrera_uac = CarreraUac::firstOrCreate([
									'carrera_id' => $carrera->id,
									'uac_id' => $submodulo->id,
									'semestre' => $submodulo->semestre
							]);
					}
				}
				DB::commit();
			} catch(\Exception $e) {
				var_dump('Error: ' . $e->getMessage());
				DB::rollBack();
			}
    }
}
