<?php

use Illuminate\Database\Seeder;
use App\Alumno;
use App\Plantel;
use App\CalificacionUac;
use App\CarreraUac;
use App\Carrera;
use App\PlantelCarrera;
use App\GrupoPeriodo;
use App\UAC;
use App\Periodo;
use App\Docente;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Traits\AuditoriaLogHelper;
use App\Traits\CalificarPromediarTrait;

class CalificacionesModulosSeeder extends Seeder
{
    use AuditoriaLogHelper, CalificarPromediarTrait;
    
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::beginTransaction();
        $error = false;
        try {
            $alumnos_array_id = [];
            $periodo_id = env('PERIODO_ID', null);
            $plantel_cct = env('PLANTEL_CCT', null);
            $matriculas = env('MATRICULAS', null);
            $alumnos_array_id = explode(",", $matriculas);
            $plantel_id = null;
            if($plantel_cct != null){
                $plantel = Plantel::where('cct', $plantel_cct)->first();
                if($plantel){
                    $plantel_id = $plantel->id;
                }
            }
            $uac_sub_modulos_id = []; //uacs sub modulos
            $uac_sub_modulos = UAC::where('modulo_id', '<>', NULL)->get();
            foreach($uac_sub_modulos as $obj){
                array_push($uac_sub_modulos_id, $obj->id);
            }
            $carrera_uacs_sub_modulos_id = []; //carrera uacs sub modulos
            $carrera_uacs_sub_modulos = CarreraUac::whereIn('uac_id', $uac_sub_modulos_id)->with('uac', 'carrera')->get();
            foreach($carrera_uacs_sub_modulos as $obj){
                array_push($carrera_uacs_sub_modulos_id, $obj->id);
            }
            //calificaciones por parcial y final
            $calificaciones_parcial = [];
            //for($parcial = 1; $parcial <= 6; $parcial ++){
                //obtener ultimas calficaciones (por el tema de recursamiento)
                if($plantel_id != null && $periodo_id != null){
                    $calificacion_parcial = CalificacionUac::where([
                        ['periodo_id', $periodo_id],
                        ['plantel_id', $plantel_id],
                        ['parcial', '<', 4]  
                    ])->whereIn('carrera_uac_id', $carrera_uacs_sub_modulos_id)->orderBy('id', 'DESC')->get();
                    foreach($calificacion_parcial as $obj){
                        array_push($calificaciones_parcial, $obj);
                    }
                }else if($plantel_id != null){
                    $calificacion_parcial = CalificacionUac::where([
                        ['plantel_id', $plantel_id],
                        ['parcial', '<', 4]  
                    ])->whereIn('carrera_uac_id', $carrera_uacs_sub_modulos_id)->orderBy('id', 'DESC')->get();
                     foreach($calificacion_parcial as $obj){
                        array_push($calificaciones_parcial, $obj);
                    }
                }else if($periodo_id != null){
                    $calificacion_parcial = CalificacionUac::where([
                        ['periodo_id', $periodo_id],
                        ['parcial', '<', 4]  
                    ])->whereIn('carrera_uac_id', $carrera_uacs_sub_modulos_id)->orderBy('id', 'DESC')->get();
                     foreach($calificacion_parcial as $obj){
                        array_push($calificaciones_parcial, $obj);
                    }
                }else if($matriculas != null){
                    foreach($alumnos_array_id as $matricula){
                        $alumno = Alumno::where('matricula', $matricula)->first();
                        $calificacion_parcial = CalificacionUac::where([
                            ['alumno_id', $alumno->usuario_id],
                            ['parcial', '<', 4]  
                        ])->whereIn('carrera_uac_id', $carrera_uacs_sub_modulos_id)->orderBy('id', 'DESC')->get();
                        foreach($calificacion_parcial as $obj){
                            array_push($calificaciones_parcial, $obj);
                        }
                    }
                }else{
                    var_dump("SE NECESITAN VALORES");
                    return false;
                }
                foreach($calificaciones_parcial as $calificacion_parcial){
                    if($calificacion_parcial['tipo_calif'] == null){
                        $this->calificarAlumno(
                            $calificacion_parcial['alumno_id'], $calificacion_parcial['carrera_uac_id'], $calificacion_parcial['plantel_id'], 
                            $calificacion_parcial['parcial'], $calificacion_parcial['periodo_id'], $calificacion_parcial['calificacion'], $calificacion_parcial['faltas'], 
                            $calificacion_parcial['grupo_periodo_id'], $calificacion_parcial['grupo_recursamiento_intersemestral_id'], $calificacion_parcial['grupo_recursamiento_semestral_id'], null, $calificacion_parcial['docente_id'], $calificacion_parcial['tipo_calif'],
                            false, false
                        );
                    }
                }
                foreach($calificaciones_parcial as $calificacion_parcial){
                    if($calificacion_parcial['tipo_calif'] == 'CI'){
                        $this->calificarAlumno(
                            $calificacion_parcial['alumno_id'], $calificacion_parcial['carrera_uac_id'], $calificacion_parcial['plantel_id'], 
                            $calificacion_parcial['parcial'], $calificacion_parcial['periodo_id'], $calificacion_parcial['calificacion'], $calificacion_parcial['faltas'], 
                            $calificacion_parcial['grupo_periodo_id'], $calificacion_parcial['grupo_recursamiento_intersemestral_id'], $calificacion_parcial['grupo_recursamiento_semestral_id'], null, $calificacion_parcial['docente_id'], $calificacion_parcial['tipo_calif'],
                            false, false
                        );
                    }
                }
                foreach($calificaciones_parcial as $calificacion_parcial){
                    if($calificacion_parcial['tipo_calif'] == 'RS'){
                        $this->calificarAlumno(
                            $calificacion_parcial['alumno_id'], $calificacion_parcial['carrera_uac_id'], $calificacion_parcial['plantel_id'], 
                            $calificacion_parcial['parcial'], $calificacion_parcial['periodo_id'], $calificacion_parcial['calificacion'], $calificacion_parcial['faltas'], 
                            $calificacion_parcial['grupo_periodo_id'], $calificacion_parcial['grupo_recursamiento_intersemestral_id'], $calificacion_parcial['grupo_recursamiento_semestral_id'], null, $calificacion_parcial['docente_id'], $calificacion_parcial['tipo_calif'],
                            false, false
                        );
                    }
                }
                foreach($calificaciones_parcial as $calificacion_parcial){
                    if($calificacion_parcial['tipo_calif'] == 'EXT'){
                        $this->calificarAlumno(
                            $calificacion_parcial['alumno_id'], $calificacion_parcial['carrera_uac_id'], $calificacion_parcial['plantel_id'], 
                            $calificacion_parcial['parcial'], $calificacion_parcial['periodo_id'], $calificacion_parcial['calificacion'], $calificacion_parcial['faltas'], 
                            $calificacion_parcial['grupo_periodo_id'], $calificacion_parcial['grupo_recursamiento_intersemestral_id'], $calificacion_parcial['grupo_recursamiento_semestral_id'], null, $calificacion_parcial['docente_id'], $calificacion_parcial['tipo_calif'],
                            false, false
                        );
                    }
                }
            //}
            DB::commit();
            return "TERMINADO";
        }catch(Exception $e){
            DB::rollBack();
            $error = true;
            var_dump('ERROR: '.$e->getMessage().' - '.$e->getLine());
        }

    }
}
