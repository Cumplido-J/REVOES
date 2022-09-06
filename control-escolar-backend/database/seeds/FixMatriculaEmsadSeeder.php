<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Alumno;
class FixMatriculaEmsadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
			DB::beginTransaction();
			$files = File::allFiles("database/json/correccion/matriculaEmsad");
			
			try {

				foreach($files as $file) {
					var_dump('==================Procesando Archivo ' . $file);
					$data = json_decode(file_get_contents($file));
					foreach($data as $d) {
						$a = Alumno::where('matricula', $d->CORRECTO)->first();
						if($a){
							var_dump("Matrícula " . $d->CORRECTO . " ya fue asignada" . " La matrícula pertenece al alumno: " . $a->usuario_id);
						} else {
							$alumno = Alumno::with(['usuario' => function($query) use($d) {
								$query->where('username', $d->curp);
							}])
								->where('matricula', $d->ERROR)->firstOrFail();
							$alumno->matricula = $d->CORRECTO;
							$alumno->save();
						}
					}
				}
				DB::commit();
			} catch(Exception $e) {
				DB::rollBack();
				var_dump("[x]Error : " . $e->getMessage());
			}
    }
}
