<?php
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Alumno;
use App\Plantel;
use App\Estado;
use App\Usuario;

class ChangeStudentPasswordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		DB::beginTransaction();
		try{
			$estadoNombre = env("ESTADO");
			$estado = Estado::where('nombre', $estadoNombre)->first();
			$planteles = Plantel::whereHas('municipio', function($q) use($estado){
				$q->where("estado_id", $estado->id);
			})->pluck('id');

			if(is_null($planteles)) 
				Throw new \Exception("No se encuentra el estado");
			
			$alumnos = Alumno::with(['usuario'])
				->whereIn('plantel_id', $planteles)
				->where('estatus_inscripcion', 'Activo')
				->get();

			foreach($alumnos as $alumno){
				if(!is_null($alumno)) {
					$usuario = $alumno->usuario; 
					$usuario->password = bcrypt($alumno->matricula);
					var_dump("Usuario: " . $usuario->username . " password: " . $alumno->matricula);
					$usuario->save();
				}
			}
			var_dump("Total de contraseñas actualizadas: " . count($alumnos));
			DB::commit();
		}catch(\Exception $e) {
			var_dump("Ocurrió un error al realizar la actualización de contraseñas " . $e->getMessage() . $e->getLine());
			DB::rollback();
		}
	}
}
