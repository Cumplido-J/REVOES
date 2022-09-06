<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Sisec;
use App\Plantel;

class PlantelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param $estado_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($estado_id)
    {
        $planteles = Plantel::whereHas('municipio', function($query) use ($estado_id) {
            $query->where('estado_id', $estado_id);
        })->get();

        return response()->json(['data' => $planteles], 200);
    }

    public function getPlantelById($id)
    {
        if(!Sisec::validarAlcance($id))
        return response()->json(['message' => 'No tiene permiso para ver datos del plantel elegido.'], 403);

        $planteles = Plantel::where('id', $id)->with('municipio.estado')->first();
        
        return response()->json(['data' => $planteles], 200);
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

    public function plantelesDeUnEstadoId($id){

        $planteles = Plantel::whereHas('municipio', function($query) use ($id) {
           $query->where('estado_id', $id);
        })->get()->pluck('id');

        return response()->json(['data' => $planteles], 200);

    }
}
