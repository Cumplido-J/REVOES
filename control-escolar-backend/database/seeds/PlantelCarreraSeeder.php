<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\PlantelCarrera;
use App\Plantel;
use App\Carrera;

class PlantelCarreraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		DB::beginTransaction();
		$files = File::allFiles('database/json/plantel-carreras');
		
		try {
			foreach($files as $file) {
				$data = json_decode(file_get_contents($file));
				var_dump('Archivo: ' . $file);
				//$data = json_decode(file_get_contents('database/json/nayarit/Nayarit - Carreras por plantel.json'));

				foreach ($data as $d){
					$plantel = Plantel::where('cct', $d->CCT)->first();

					if($plantel == null) {
						var_dump('Plantel no existe: '.$d->NOMBRE_PLANTEL);
						continue;
					}

					$carrera = Carrera::where('clave_carrera', $d->CLAVE_CARRERA)->first();
					if($carrera == null){
						var_dump('Carrera no existe: '.$d->NOMBRE_CARRERA);
						continue;
					}

					$plantelCarrera = PlantelCarrera::where('plantel_id', $plantel->id)->where('carrera_id', $carrera->id)->first();

					if($plantelCarrera == null){
									//var_dump('No hay relación: Plantel: '.$d->NOMBRE_PLANTEL.' - '.$d->CLAVE_CARRERA.' '.$d->NOMBRE_CARRERA);
									var_dump("La asoció la carrera " . $carrera->nombre . " al plantel " . $plantel->nombre);
						PlantelCarrera::create([
						'plantel_id' => $plantel->id,
						'carrera_id' => $carrera->id
						]);
					}
				}

			}
			DB::commit();
		}catch(\Exception $e) {
			DB::rollBack();
			var_dump("Error: " . $e->getMessage() . " -  " . $e->getLine());
		}
    }
}
