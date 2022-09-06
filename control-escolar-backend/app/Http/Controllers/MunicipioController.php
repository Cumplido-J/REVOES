<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Municipio;
use ResponseJson;

class MunicipioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param $estadoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($estadoId)
    {
        $municipios = Municipio::where('estado_id', $estadoId)->get();

        return response()->json(['data' => $municipios], 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $municipio = Municipio::findOrFail($id);
            return ResponseJson::data($municipio, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar el municipio', 404);
        }
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

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

    }
}
