<?php

namespace App\Http\Controllers;

use App\Alumno;
use App\Plantel;
use App\GrupoPeriodo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Sisec;
use DNS1D;
use DNS2D;
use PDF;

class CredencialController extends Controller
{
    public function imprimirCredencialAlumno($alumnoId){

        $alumnos = Alumno::with([
            'usuario',
            'plantel.personal',
            'plantel.municipio.estado',
            'carrera',
            'grupos' => function($query){
                $query->orderBy('periodo_id', 'DESC');
            }
        ])->where('usuario_id', $alumnoId)->get();

        if(!$alumnos->first()->grupos->first()){
            return response()->json(['message' => 'El alumno nunca ha estado inscrito en ningún grupo.'], 400);
        }

        $vigencia = Carbon::createFromFormat('Y-m-d',Sisec::periodoActual()->fecha_fin)->format('d-m-Y');

        if($alumnos->first()->grupos->first()->periodo_id != Sisec::periodoActual()->id){
            $vigencia = Carbon::createFromFormat('Y-m-d', $alumnos->first()->grupos->first()->periodo->fecha_fin)->format('d-m-Y');
        }

        $plantilla = $this->elegirPlantilla($alumnos->first()->plantel_id);

        if(!view()->exists($plantilla)){
            return response()->json(['message' => 'No hay una plantilla definida para las credenciales. Favor de contactar a soporte.'], 400);
        }

        return $pdf = \PDF::loadView($plantilla, compact('alumnos', 'vigencia'))
            ->setPaper('letter', 'landscape')
            ->stream('credencial.pdf');
    }

    public function imprimirCredencialPorGrupo($grupoId){
        $alumnos = Alumno::whereHas('grupos', function ($query) use ($grupoId) {
            $query->where('grupo_periodo_id', $grupoId);
        })->with([
            'usuario',
            'plantel.personal',
            'plantel.municipio.estado',
            'carrera',
            'grupos' => function($query){
                $query->orderBy('periodo_id', 'DESC');
            }])
        ->get();

        $vigencia = Sisec::periodoActual()->fecha_fin;

        $grupo = GrupoPeriodo::with('plantelCarrera')->find($grupoId);
        $plantilla = $this->elegirPlantilla($grupo->plantelCarrera->plantel_id);

        if(!view()->exists($plantilla)){
            return response()->json(['message' => 'No hay una plantilla definida para las credenciales. Favor de contactar a soporte.'], 400);
        }

        $pdf = PDF::loadView($plantilla, ['alumnos' => $alumnos, 'vigencia' => $vigencia])
            ->setPaper('letter')->setOrientation('landscape');
        return  $pdf->download('credenciales.pdf');
    }

    public function getFotosFaltantes($grupoId){

        $alumnos = Alumno::whereHas('grupos', function ($query) use ($grupoId) {
            $query->where('grupo_periodo_id', $grupoId);
        })->with('usuario', 'plantel.personal', 'plantel.municipio.estado', 'carrera')
        ->get();

        $faltantes = [];

        foreach ($alumnos as $alumno){
            if($alumno->ruta_fotografia == null || !file_exists(storage_path('app/'.$alumno->ruta_fotografia))){
                array_push($faltantes, ['matricula' => $alumno->matricula, 'alumno' => strtoupper($alumno->nombreCompleto)]);
            }
        }

        return $faltantes;

    }

    private function elegirPlantilla($plantelId){

        $plantel = Plantel::with('municipio.estado')->find($plantelId);

        return 'reportesPDF.credenciales.'.$plantel->municipio->estado->abreviatura;

    }

}
