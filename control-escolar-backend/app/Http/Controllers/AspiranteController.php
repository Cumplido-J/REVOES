<?php

namespace App\Http\Controllers;

use App\Aspirante;
use App\ConfigAspirante;
use App\Estado;
use App\Http\Requests\StoreAspiranteRequest;
use App\Http\Requests\UpdateAspiranteRequest;
use App\Plantel;
use App\PlantelCarrera;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Sisec;

class AspiranteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {

        $query = null;
        $config = null;

        //Filtrar por estado
        if($request->plantel_id == null){
            if(auth()->user()->hasPermissionTo('Plantel'))
                return response()->json(['message' => 'Es necesario seleccionar un plantel.'], 400);

            $estado = $request->estado_id;

            $query = Aspirante::whereHas('plantel.municipio.estado', function($query) use ($estado){
                $query->where('estado_id', $estado);
            });
        }

        //Filtrar por plantel
        if($request->plantel_id != null) {
            if(!Sisec::validarAlcance($request->plantel_id))
                return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);

            $plantel = Plantel::findOrFail($request->plantel_id);

            $query = Aspirante::where('plantel_id', $request->plantel_id);

            $config = ConfigAspirante::where('plantel_id', $request->plantel_id)->first();
        }

        //Por carrera
        if($request->carrera_id != null) {

            $plantelCarrera = PlantelCarrera::where('plantel_id', $request->plantel_id)
                ->where('carrera_id', $request->carrera_id)
                ->first();

            if ($plantelCarrera == null)
                return response()->json(['message' => 'No se imparte la carrera en el plantel seleccionado.'], 400);

            $query->where('carrera_id', $request->carrera_id);
        }

        //Por sincronizado
        if($request->solo_sin_sincronizar){
            $query->where('sincronizado', false);
        }

        $aspirantes = $query->with('plantel', 'carrera')->get();

        //Por nombre, curp, etc
        if($request->cadena != null){
            $buscar = Str::upper($request->cadena);

            $aspirantes = $aspirantes->filter(function($value, $key) use ($buscar){
                return Str::contains(Str::upper($value->primer_apellido), $buscar)
                    || Str::contains(Str::upper($value->segundo_apellido),$buscar)
                    || Str::contains(Str::upper($value->nombre),$buscar)
                    || Str::contains(Str::upper($value->curp), $buscar)
                    || Str::contains(Str::upper($value->nombre_completo), $buscar);
            })->values();
        }

        return response()->json(['data' => $aspirantes, 'config' => $config], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreAspiranteRequest $request)
    {
        $validar = $this->validarFechas($request);

        if($validar != 'Correcto'){
            return response()->json(['message' => $validar], 400);
        }

        if($request->carrera_id != null) {
            $plantelCarrera = PlantelCarrera::where('plantel_id', $request->plantel_id)
                ->where('carrera_id', $request->carrera_id)
                ->first();

            if ($plantelCarrera == null)
                return response()->json(['message' => 'La carrera no está asociada al plantel elegido'], 400);
        }

        $params = $request->all();
        //Generar curp en caso de que el alumno no tenga o sea extranjero.
        if(!isset($params['curp']) || $params['curp'] == null || $params['curp'] == ""){
            return response()->json(['message' => 'Favor de ingresar un CURP para el alumno.'], 400);
        }

        $params['fecha_alta'] = Carbon::now()->toDateString();
        $params['contrasena'] = 'cecyte123';

        $aspirante = Aspirante::create($params);

        return response()->json(['data' => $aspirante, 'message' => 'Se ha registrado el aspirante.'], 200);

    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $aspirante = Aspirante::with('plantel','carrera', 'plantel.municipio.estado')->findOrFail($id);

        return response()->json(['data' => $aspirante], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateAspiranteRequest $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateAspiranteRequest $request, $id)
    {
        $validar = $this->validarFechas($request);

        if($validar != 'Correcto'){
            return response()->json(['message' => $validar], 400);
        }

        $aspirante = Aspirante::findOrFail($id);

        if($request->carrera_id != null && $this->validarPlantelCarrera($request, $aspirante) == null){
            return response()->json(['message' => 'La carrera no está asociada al plantel elegido.'], 400);
        }

        $aspirante->fill($request->all());

        if(!$aspirante->isDirty()){
            return response()->json(['message' => 'No hay cambios para guardar.'], 200);
        }

        $aspirante->save();

        return response()->json(['message' => 'Se ha actualizado el aspirante.'], 200);
    }

    public function sincronizar(Request $request){

        $sincronizar = $request->ids;

        Aspirante::withTrashed()->whereIn('id', $sincronizar)->update(['sincronizado' => 1]);

        return response()->json(['message' => 'Aspirantes sincronizados.'], 200);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {

        $aspirante = Aspirante::findOrFail($id);
        $aspirante->delete();

        return response()->json(['message' => 'Se ha eliminado el aspirante.'], 200);

    }

    public function comprobanteInscripcion($id){

        $aspirante = Aspirante::findOrFail($id);

        return $pdf = \PDF::loadView('reportesPDF.comprobanteInscripcionAspirante', compact('aspirante'))
            ->stream('comprobanteInscripcion.pdf');

    }

    public function validarPlantelCarrera($request, $aspirante){

        $plantel_id = $request->plantel_id ?? $aspirante->plantel_id;
        $carrera_id = $request->carrera_id ?? $aspirante->carrera_id;

        return PlantelCarrera::where('plantel_id', $plantel_id)
            ->where('carrera_id', $carrera_id)
            ->first();
    }

    public function obtenerFechasConfiguracion($plantelId){

        $configuracion = ConfigAspirante::where('plantel_id', $plantelId)->first();

        return response()->json(['data' => $configuracion], 200);

    }

    public function configurarFechas(Request $request){

        $validacion = Validator::make($request->all(), [
            'plantel_id' => 'required|exists:plantel,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'fecha_examen' => 'date'
        ],[
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_fin.required' => 'La fecha de fin es obligatoria.',
            'plantel_id.required' => 'El plantel es obligatorio.',
            'plantel_id.exists' => 'El plantel seleccionado no existe.',
            'date' => 'El formato de la fecha es incorrecto.'
        ]);

        if($validacion->fails()){
            $errores = $validacion->errors()->getMessages();
            $msg = '';
            foreach ($errores as $error){
                $msg.=' '.$error[0];
            }

            return response()->json(['message' => $msg], 400);
        }

        $configuracion = ConfigAspirante::updateOrCreate([
            'plantel_id' => $request->plantel_id
        ],[
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'fecha_examen' => $request->fecha_examen
        ]);

        return response()->json(['message' => 'Se ha actualizado la configuración.', 'config' => $configuracion], 200);
    }

    public function configurarFechasEstado(Request $request){
        $validacion = Validator::make($request->all(), [
            'estado_id' => 'required|exists:cat_estado,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date',
            'fecha_examen' => 'date'
        ],[
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_fin.required' => 'La fecha de fin es obligatoria.',
            'estado_id.required' => 'El estado es obligatorio.',
            'estado_id.exists' => 'El estado seleccionado no existe.',
            'date' => 'El formato de la fecha es incorrecto.'
        ]);

        if($validacion->fails()){
            $errores = $validacion->errors()->getMessages();
            $msg = '';
            foreach ($errores as $error){
                $msg.=' '.$error[0];
            }

            return response()->json(['message' => $msg], 400);
        }

        $estado = Estado::find($request->estado_id);
        $municipios = $estado->municipios;

        foreach($municipios as $municipio){
            foreach($municipio->planteles as $plantel){
                if($plantel->estatus == 1){
                    $configuracion = ConfigAspirante::updateOrCreate([
                        'plantel_id' => $plantel->id
                    ],[
                        'fecha_inicio' => $request->fecha_inicio,
                        'fecha_fin' => $request->fecha_fin,
                        'fecha_examen' => $request->fecha_examen
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Se ha actualizado la configuración para los planteles'], 400);

    }

    private function generarFolio($params){

        $folio = "";

        $plantel = Plantel::find($params['plantel_id']);
        $estado = str_pad($plantel->municipio()->first()->estado()->first()->id, 2, "0", STR_PAD_LEFT);
        $anio = substr(Carbon::now()->year, -2);

        $folio = $estado.$plantel->numero.$anio."-";

        //Obtener el último folio asignado para generar el número consecutivo.
        $ultimo = Aspirante::where('folio', 'like', $folio.'%')
            ->orderBy('folio', 'desc')
            ->first();

        if($ultimo == null)
            $folio.='0001';
        else {
            $consecutivo = (int)substr($ultimo->folio, -4);
            $consecutivo++;
            $consecutivo = str_pad($consecutivo, 4, "0", STR_PAD_LEFT);
            $folio.=$consecutivo;
        }

        return $folio;
    }

    private function validarFechas(Request $request){
        $config = ConfigAspirante::where('plantel_id', $request->plantel_id)->first();

        if(!$config){
            return 'No se han establecido fechas de inscripción de aspirantes para este plantel.';
        }

        if(!Carbon::now()->isBetween($config->fecha_inicio, $config->fecha_fin)){
            return 'Las inscripciones no están activas para este plantel.';
        }

        return 'Correcto';
    }
}
