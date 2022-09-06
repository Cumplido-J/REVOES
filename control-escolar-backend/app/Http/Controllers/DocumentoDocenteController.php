<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Requests\StoreDocumentoDocenteRequest;
use Illuminate\Support\Facades\DB;
use App\Docente;
use App\Usuario;
use App\UsuarioDocente;
use App\DocentePlantilla;
use App\DocumentoDocente;
use App\DocumentoHasDocente;
use ResponseJson;
use Carbon\Carbon;
use App\Traits\AuditoriaLogHelper;

class DocumentoDocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
      
        $dcoumento_docentes = DocumentoDocente::all();

        return ResponseJson::data($dcoumento_docentes, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDocumentoDocenteRequest $request)
    {
        try {
            DB::beginTransaction();
            /* documentacion */
            foreach($request->documento as $obj) {
                $documento = DocumentoDocente::create([
                    'fecha_alta' => Carbon::now(),
                    'documento' => $obj,
                    'estatus_documento' => 1
                ]);
                /* documentacion has docente */
                DocumentoHasDocente::create([
                    'documentos_docente_id' => $documento->id,
                    'docente_id' => $request->docente_id
                ]);
            }
            DB::commit();
            return ResponseJson::msg('Documeto cargado con éxito', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar el documento', 404);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar el documento', 404);
        }
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
            $documento_docente = DocumentoDocente::all();
            return ResponseJson::data($documento_docente, 200);
        } catch(ModelNotFoundException $e) {
            return ResponseJson::msg('No fue posible encontar el documento', 404);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible encontar el documento', 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreDocumentoDocenteRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            /* documentacion */
            /* $documento = DocumentoDocente::update([
                'fecha_alta' => Carbon::now(),
                'documento' => $request->documento,
                'estatus_documento' => 1
            ]); */
            /* documentacion has docente */
            /* DocumentoHasDocente::create([
                'documentos_docente_id' => $documento->id,
                'docente_id' => $request->docente_id
            ]); */
            /* accion del historial documento */
           /*  $log_accion_documento = LogDocenteAccion::create([
                'fecha' => Carbon::now(),
                'accion' => 'Alta documento',
                'proceso' => 'Documento comprobatorio'
            ]); */
            /* relacion con documento-accion */
            /* LogHasDocumentoDocente::create([
                'log_acciones_docente_id' => $log_accion_documento->id,
                'documentos_docente_id' => $documento->id
            ]); */
            DB::commit();
            return ResponseJson::msg('Documeto cargado con éxito', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar el documento', 404);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible cargar el documento', 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $documento_docente = DocumentoDocente::findOrFail($id);
            if($documento_docente->estatus_documento == 0 || $documento_docente->estatus_documento == 2){
                throw new ModelNotFoundException();
            }
            $documento_docente->update([
                 'estatus_documento' => 0
            ]);
            DB::commit();
            return ResponseJson::msg('Datos eliminados correctamente', 200);
        } catch(ModelNotFoundException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar el documento', 404);
        } catch(QueryException $e) {
            DB::rollBack();
            return ResponseJson::msg('No fue posible eliminar el documento', 404);
        }
    }


}
