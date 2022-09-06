<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Plantel;
use App\PersonalPlantel;

class InformacionPlantelSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		DB::beginTransaction();
		$path = 'database/json/planteles';
		try {
			$files = File::allFiles($path);
			foreach($files as $file) {

				$data = json_decode(file_get_contents($file));
				foreach ($data as $d){

					$plantel = Plantel::where('cct', $d->CCT)->first();

					if($plantel == null){
						var_dump("No se encontró el plantel => " . $d->NOMBRE_PLANTEL);
						continue;
					}


					$plantel->update([
						'calle' => $d->CALLE_PLANTEL,
						'codigo_postal' => $d->CODIGO_POSTAL,
						'ciudad' => $d->CIUDAD,
						'telefono' => $d->TELEFONO_PLANTEL,
						'numero' => $d->NUMERO_PLANTEL,
						'email' => $d->CORREO_PLANTEL
					]);

					$personal = PersonalPlantel::updateOrCreate([
						'plantel_id' => $plantel->id
					],
					[
						'nombre_director' => $d->DIRECTOR_PLANTEL,
						'genero_director' => $d->GENERO_DIRECTOR,
						'cargo_director' => $d->CARGO_DIRECTOR,
						'nombre_control_escolar' => $d->ENCARGADO_CONTROL_ESCOLAR,
						'genero_control_escolar' => $d->GENERO_CONTROL_ESCOLAR,
						'cargo_control_escolar' => $d->CARGO_CONTROL_ESCOLAR,
					]);

				}
			}
			DB::commit();
		}catch(\Illuminate\Database\QueryException $e){
			var_dump($e->getMessage().' - '.$plantel->nombre);
			DB::rollBack();
		}
	}
}
