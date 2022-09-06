<?php

use Illuminate\Database\Seeder;
use App\CalificacionUac;
use App\BitacoraEvaluacion;
use App\Alumno;

class CorreccionCalificacionesDuplicadas extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //eliminar calificacion parcial 4
        //$calificacion_final = CalificacionUac::where('parcial', 4)->delete();
        $calificacions_duplicas = DB::select("SELECT alumno_id, parcial, carrera_uac_id, grupo_periodo_id, count(*) AS cont FROM calificacion_alumno_uac
        GROUP BY alumno_id, carrera_uac_id, parcial, grupo_periodo_id
        HAVING COUNT(*)>1");
        foreach($calificacions_duplicas as $obj){
            // var_dump($obj);
            $calificacion = CalificacionUac::where([
                ['alumno_id', $obj->alumno_id],
                ['carrera_uac_id', $obj->carrera_uac_id],
                ['grupo_periodo_id', $obj->grupo_periodo_id],
                ['parcial', $obj->parcial]
            ])->get();
            if(count($calificacion) > 1){
                $cont = $obj->cont; //numero de registros
                $cont_eliminar = $cont - 1; //eliminar todos menos 1
                //echo "ELIMINAR =>" . $cont_eliminar;
                for($i = 0; $i < $cont_eliminar; $i++){
                    //eliminar repetidos
                    $calificacion[$i]->delete();
                }
            }
        }
        //bitacora
        $bitacora_evaluacion = DB::select("SELECT alumno_id, parcial, carrera_uac_id, docente_asignatura_id, count(*) AS cont FROM bitacora_evaluacion
        GROUP BY alumno_id, carrera_uac_id, parcial, docente_asignatura_id
        HAVING COUNT(*)>1");
        foreach($bitacora_evaluacion as $obj){
            // var_dump($obj);
            $bitacora = BitacoraEvaluacion::where([
                ['alumno_id', $obj->alumno_id],
                ['carrera_uac_id', $obj->carrera_uac_id],
                ['docente_asignatura_id', $obj->docente_asignatura_id],
                ['parcial', $obj->parcial]
            ])->get();
            if(count($bitacora) > 1){
                $cont = $obj->cont; //numero de registros
                $cont_eliminar = $cont - 1; //eliminar todos menos 1
                //echo "ELIMINAR =>" . $cont_eliminar;
                for($i = 0; $i < $cont_eliminar; $i++){
                    //eliminar repetidos
                    $bitacora[$i]->delete();
                }
            }
        }
    }
}
