<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\UAC;
use App\Carrera;
use App\Competencia;
use App\Alumno;
use App\CarreraUac;
use App\PlantelCarrera;
use App\Periodo;
use Sisec;

class UacController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Se obtienen las asignaturas en las que se puede inscribir de manera irregular un alumno.
     *
     * @param $id_alumno
     * @return JsonResponse
     */
    public function asignaturasParaAlumnoIrregular($id_alumno){

        $alumno = Alumno::find($id_alumno);

        if($alumno == null)
            return response()->json(['message' => 'El alumno no existe'], 404);

        $periodoActual = Sisec::periodoActual();
        $mitad = explode('/', $periodoActual->nombre)[1];
        $semestres = ($mitad == '2') ? [2,4,6] : [1,3,5];

        //Pendiente: Validar lo de que ya haya cursado la asignatura anteriormente o que pertenezca
        //al semestre correcto.
        $carrera_id = $alumno->carrera_id;

        if($carrera_id == null){
            $plantelCarrera = PlantelCarrera::find($alumno->plantel_carrera_id);
            if($plantelCarrera != null)
                $carrera_id = $plantelCarrera->carrera_id;
        }

        $asignaturas = CarreraUac::where('carrera_id', $carrera_id)
            ->whereHas('uac', function($query){
                $query->where('tipo_uac_id', '!=', 4);
            })
            ->with('uac')
            ->where('semestre', '<=', $alumno->semestre)
            ->get();

        $inscritas = $this->materiasIrregularesAlumno($id_alumno)->pluck('carrera_uac_id')->toArray();

        $asignaturas = $asignaturas->filter(function($value) use ($semestres, $inscritas){
            return in_array($value->semestre, $semestres) && !in_array($value->id,$inscritas);
        })->values()->all();

        return response()->json(['data' => $asignaturas], 200);

    }

    /**
     * Obtiene las optativas que se pueden cursar en una carrera, se usa para
     * la asignación de optativas a un grupo periodo.
     *
     * @param $id
     * @return JsonResponse
     */
    public function optativasParaCarrera($id){

        $carrera = Carrera::find($id);

        if($carrera == null){
            return response()->json(['message' => 'La carrera no existe'], 404);
        }

        $optativas = UAC::whereHas('carreras', function($query) use ($id){
                $query->where('carrera.id', $id);
            })->where('optativa', 1)
            ->get();

        return response()->json(['data' => $optativas], 200);

    }

    /**
     * Devuelve las materias que debió haber cursado el alumno que viene de un cambio
     * de plantel o de carrera o apenas se está registrando al sistema.
     * Se pide el id de la carrera y el semestre al que se quiere inscribir el alumno (último cursado).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function materiasReinscripcion(Request $request){

        $materias = UAC::whereHas('carreras', function($query) use ($request){
                $query->where('carrera_id', $request->carrera_id);
            })
            ->where('semestre', '<=', $request->semestre)
            ->get()
            ->toArray();

        return response()->json(['materias' => $materias], 200);
    }

    /**
     * Devuelve las materias en las que está inscrito un alumno de manera irregular durante el periodo actual.
     * @param $alumnoId
     * @return JsonResponse
     */
    public function asignaturasInscritasAlumnoIrregular($alumnoId){

        $materias = $this->materiasIrregularesAlumno($alumnoId);

        return response()->json(['data' => $materias], 200);

    }

    private function materiasIrregularesAlumno($alumnoId){

        $alumno = Alumno::with(['materiasIrregulares' => function($query) {
            $query->whereHas('grupo', function($queryGrupo){
                $queryGrupo->where('periodo_id', Sisec::periodoActual()->id);
            });
        }, 'materiasIrregulares.carreraUac.uac', 'materiasIrregulares.grupo'])->find($alumnoId);

        return $alumno->materiasIrregulares;

    }

}
