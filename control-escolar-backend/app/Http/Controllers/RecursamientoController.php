<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use App\AsignaturaRecursamientoIntersemestral;
use App\GrupoRecursamientoSemestral;
use App\Http\Requests\StoreRecursamientoIntersemestralRequest;
use App\GrupoRecursamientoIntersemestral;
use App\AlumnoGrupoRecursamientoIntersemestral;
use App\ConfigRecursamientoIntersemestral;
use App\DocenteAsignatura;
use App\DocentePlantilla;
use App\UAC;
use App\CarreraUac;
use App\Alumno;
use App\Docente;
use App\Usuario;
use App\UsuarioDocente;
use App\AlumnoGrupo;
use App\Periodo;
use App\PlantelCarrera;
use App\GrupoPeriodo;
use App\CalificacionUac;
use App\Extraordinario;
use Carbon\Carbon;
use App\Traits\AuditoriaLogHelper;
use Sisec;
use ResponseJson;
use ValidationsDocente;
use HelperPermisoAlcance;

class RecursamientoController extends Controller
{
    use AuditoriaLogHelper;

    public function getRecursamiento(Request $request)
    {
        if($request->has("tipo_recursamiento")){
            $tipos_permitidos = ["semestral", "intersemestral", "extraordinario"];
            if(!in_array($request->tipo_recursamiento, $tipos_permitidos)){
                return response()->json(['message' => 'Tipo de recursamiento no encontrado'], 400);    
            }
        }else{
            return response()->json(['message' => 'Es necesario el tipo de recursamiento'], 400);
        }
        $tipo_recursamiento = $request->tipo_recursamiento;
        $plantel_id = $request->plantel_id;
        $periodo_id = $request->periodo_id;
        $semestre_id = $request->semestre_id;
        $carrera_id = $request->carrera_id;
        /* alcance y permisos */
        $permisos = HelperPermisoAlcance::getPermisos();
        $planteles_alacance = HelperPermisoAlcance::getPermisosAlcancePlantel();  
        if($plantel_id != null || $periodo_id != null || $semestre_id != null){
            if($periodo_id != null && $plantel_id != null && $semestre_id != null && $carrera_id != null){
                $op = 9;
            }
            else if($carrera_id != null && $plantel_id != null && $semestre_id != null){
                $op = 8;
            }
            else if($periodo_id != null && $plantel_id != null && $carrera_id != null){
                $op = 7;
            }
            else if($plantel_id != null && $carrera_id != null){
                $op = 6;
            }else if($plantel_id != null && $semestre_id != null && $periodo_id != null){
                $op = 5;
            }
            else if($plantel_id != null && $semestre_id != null){ 
                $op = 4;
            }else if($periodo_id != null && $plantel_id != null){
                $op = 3; //periodo y plantel 
            }else if($periodo_id != null){
                $op = 2; //solo periodo
            }else if($plantel_id != null){
                $op = 1; //plantel
            }
            //casos
            switch($op){
                case 1:
                    $data = $this->getRecursamientoByPlantel($plantel_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 2:
                    $data = $this->getRecursamientoByPeriodo($periodo_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 3: 
                    $data = $this->getRecursamientoByPlantelAndPeriodo($periodo_id, $plantel_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 4:
                    $data = $this->getRecursamientoByPlantelAndSemestre($plantel_id, $semestre_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 5:
                    $data = $this->getRecursamientoByPlantelAndPeriodoAndSemestre($periodo_id, $plantel_id, $semestre_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 6:
                    $data = $this->getRecursamientoByPlantelAndCarrera($plantel_id, $carrera_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 7:
                    $data = $this->getRecursamientoByPlantelAndPeriodoAndCarrera($periodo_id, $plantel_id, $carrera_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 8:
                    $data = $this->getRecursamientoByPlantelAndCarreraAndSemestre($carrera_id, $plantel_id, $semestre_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
                case 9:
                    $data = $this->getRecursamientoByPlantelAndPeriodoAndSemestreAndCarrera($periodo_id, $plantel_id, $semestre_id, $carrera_id, $permisos, $planteles_alacance, $tipo_recursamiento);
                break;
            }
            return ResponseJson::data($data, 200);
        }else{
            return ResponseJson::msg("Error al intentar encontrar el recursamiento", 400);
        }
    }

    public function getRecursamientoByPlantel($plantel_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            //consultar si el plantel pertenece
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::where([
                    ['plantel_id', $plantel_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::where([
                    ['plantel_id', $plantel_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::where([
                    ['plantel_id', $plantel_id]
                ])
                ->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

    public function getRecursamientoByPeriodo($periodo_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::where([
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::where([
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::where([
                    ['periodo_id', $periodo_id]
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Estatal", $permisos) || in_array("Plantel", $permisos)){
                $recursamiento->whereIn('plantel_id', $planteles_alacance);
            }
            return $recursamiento;

        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

    public function getRecursamientoByPlantelAndPeriodo($periodo_id, $plantel_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }
 
    public function getRecursamientoByPlantelAndSemestre($plantel_id, $semestre_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::whereHas('GrupoRecursamientoIntersemestral', function ($query) use($semestre_id){
                    $query->where('semestre', $semestre_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id]
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

    public function getRecursamientoByPlantelAndPeriodoAndSemestre($periodo_id, $plantel_id, $semestre_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::whereHas('GrupoRecursamientoIntersemestral', function ($query) use($semestre_id){
                    $query->where('semestre', $semestre_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id],
                    ['periodo_id', $periodo_id]
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

    public function getRecursamientoByPlantelAndCarrera($plantel_id, $carrera_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

    public function getRecursamientoByPlantelAndPeriodoAndCarrera($periodo_id, $plantel_id, $carrera_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

    public function getRecursamientoByPlantelAndCarreraAndSemestre($carrera_id, $plantel_id, $semestre_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::whereHas('GrupoRecursamientoIntersemestral', function ($query) use($semestre_id){
                    $query->where('semestre', $semestre_id);
                })->whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id],
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

    public function getRecursamientoByPlantelAndPeriodoAndSemestreAndCarrera($periodo_id, $plantel_id, $semestre_id, $carrera_id, $permisos, $planteles_alacance, $tipo_recursamiento){
        try{
            if($tipo_recursamiento == "semestral"){
                $recursamiento = GrupoRecursamientoSemestral::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente', 
                'alumnoGrupoRecursamientoSemestral.alumno','alumnoGrupoRecursamientoSemestral.periodoCurso')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'intersemestral'){
                $recursamiento = AsignaturaRecursamientoIntersemestral::whereHas('GrupoRecursamientoIntersemestral', function ($query) use($semestre_id){
                    $query->where('semestre', $semestre_id);
                })->whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['periodo_id', $periodo_id],
                    ['estatus', 1]
                ])
                ->with('plantel', 'carreraUac', 'periodo', 'grupoPeriodo' ,'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }else if($tipo_recursamiento == 'extraordinario'){
                $recursamiento = Extraordinario::whereHas('carreraUac', function ($query) use($carrera_id){
                    $query->where('carrera_id', $carrera_id);
                })->where([
                    ['plantel_id', $plantel_id],
                    ['semestre', $semestre_id],
                    ['periodo_id', $periodo_id],
                ])->with('plantel', 'periodo', 'carreraUac', 'grupoPeriodo', 'carreraUac.carrera', 'carreraUac.uac','plantillaDocente.docente')->orderBy('periodo_id', 'DESC')->get();
            }

            if(in_array("Nacional", $permisos)){
                return $recursamiento;
            }
            if(in_array("Estatal", $permisos)){
                if(in_array($plantel_id, $planteles_alacance)){
                    return $recursamiento;
                }
            }
            if(in_array("Plantel", $permisos)){
                //comprobar plantel
                if(in_array($plantel_id, $planteles_alacance)){ 
                    return $recursamiento;
                }
            }
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('Error al intentar encontrar el recursamiento', 400);
        } 
    }

}