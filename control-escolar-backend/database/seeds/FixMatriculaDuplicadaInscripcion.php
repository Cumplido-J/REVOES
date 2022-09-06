<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Alumno;

class FixMatriculaDuplicadaInscripcion extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
		{
			$matriculaRepetida = '21403070100020';
			DB::beginTransaction();
			try{
					var_dump("================Iniciando actualización================");
					$alumnos = Alumno::where('matricula', $matriculaRepetida)->get();
					$inc = 1;
					foreach($alumnos as $a) {
						$nuevaMatricula = $this->crearNuevaMatricula($a->matricula, $inc);
						
						while($this->existeMatricula($nuevaMatricula) != null) {
							var_dump("Matrícula " . $nuevaMatricula . " no está disponible");
							$nuevaMatricula = $this->crearNuevaMatricula($nuevaMatricula, ++$inc);
						}
						$a->matricula = $nuevaMatricula;
						$a->save();
						var_dump('Actualizando nueva matrícula=> ' .  $nuevaMatricula);
						$inc++;
					}
				DB::commit();	
			} catch(Exception $e) {
				var_dump("Ocurrió un error al generar las matrículas: " . $e->getMessage());
				DB::rollBack();
			}
		}

		public function crearNuevaMatricula($old, $inc) 
		{
			return substr($old, 0, 10) . str_pad($inc, 4, '0', STR_PAD_LEFT);
		}

		public function existeMatricula($matricula)
		{
			return Alumno::where('matricula', $matricula)->first();
		}
}
