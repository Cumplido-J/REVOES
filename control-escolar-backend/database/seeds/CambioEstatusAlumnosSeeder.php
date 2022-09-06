<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Alumno;
use App\Estado;
use App\Municipio;
use App\Plantel;
use App\Periodo;
use App\CalificacionUac;
use Illuminate\Support\Facades\DB;

class CambioEstatusAlumnosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $estado = Estado::where("nombre", "Baja California Sur")->first();
        $municipios = Municipio::where("estado_id", $estado->id)->get();
        $planteles_array = [];
        foreach($municipios as $municipio){
            $planteles = Plantel::where('municipio_id', $municipio->id)->get();
            foreach($planteles as $plantel){
                array_push($planteles_array, $plantel->id);
            }
        }
        $periodo_actual = Periodo::orderBy('id', 'DESC')->first();
        //alumnos
        $test_array = [];
        $alumnos = Alumno::whereIn('plantel_id', $planteles_array)->get();
        foreach($alumnos as $alumno){
            $test = $this->estaReprobado($alumno->usuario_id);
            if($test && $alumno->tipo_alumno == 'Regular'){
                $alumno->update([
                    'tipo_alumno' => 'Irregular'
                ]);
                //var_dump('Matrícula Irregular: '.$alumno->matricula);
            }else if(!$test && $alumno->tipo_alumno == 'Irregular'){
                $alumno->update([
                    'tipo_alumno' => 'Regular'
                ]);
                //var_dump('Matricula Regular:' . $alumno->matricula);
            }
        }
    }

    public function obtenerCalificacionesFinales($alumnoId){

        $alumno = Alumno::find($alumnoId);
        $semestre = $alumno->semestre;

        $calificaciones = CalificacionUac::with('carreraUac.uac')
            ->where('alumno_id', $alumno->usuario_id)
            ->whereHas('carreraUac', function($query) use ($semestre) {
                $query->where('semestre', '<=', $semestre);
            })->where('parcial', '>=', 4)
            ->get();

        $calificaciones = $calificaciones->filter(function($dato){
            return $dato->carreraUac->uac->tipo_uac_id != 10;
        });

        $calificaciones = $calificaciones->groupBy('carreraUac.semestre');

        $calificaciones = $calificaciones->map(function ($item, $key) {
            return $item->sortByDesc('periodo_id')
                ->sortByDesc('calificacion')
                ->sortByDesc('parcial')
                ->sortByDesc('id');
        });

        //Calificaciones agrupadas por semestre y por asignatura
        $calificaciones = $calificaciones->map(function ($item, $key) {
            return $item->groupBy('carreraUac.id');
        });

        return $calificaciones;
    }

    public function estaReprobado($alumnoId){

        $calificaciones = $this->obtenerCalificacionesFinales($alumnoId);

        foreach ($calificaciones as $semestre){
            foreach ($semestre as $uac){
                if($uac[0] != null && $uac[0]->parcial >= 4 && $uac[0]->calificacion < 6){
                    return true;
                }
            }
        }

        return false;
    }
}
