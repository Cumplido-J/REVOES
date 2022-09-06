<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\DocentePlantilla;
use App\Estado;
use App\Plantel;
use Sisec;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['username', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function user()
    {
        return response()->json(auth()->user());
    }

    public function permisos(){

        $user = auth()->user();

        $roles = $user->getRoleNames()->toArray();
        $estados = [];
        $planteles = [];

        $alcance = DB::table('administrador_alcance_usuario')->where('usuario_id', $user->id)->get();

        foreach ($alcance as $a){

            $detalle = DB::table('detalle_alcance')->where('catalcanceusuario_id', $a->catalcance_id)->first();

            //Tiene permisos de estado
            if($detalle->plantel_id == null)
                array_push($estados, ['id' => $detalle->estado_id, 'nombre' => Estado::find($detalle->estado_id)->nombre]);
            //Tiene permisos sólo para un plantel
            else if($detalle->plantel_id != null)
                array_push($planteles, ['id' => $detalle->plantel_id, 'nombre' => Plantel::find($detalle->plantel_id)->nombre]);
        }

        if(in_array('ROLE_DOCENTE', $roles)){
            $usuario_docente = DB::table('usuario_docente')->where('usuario_id', $user->id)->get();
            foreach($usuario_docente as $obj){
                $plantilla = DocentePlantilla::where([
                    ['docente_id', $obj->docente_id],
                    ['fecha_fin_contrato', null]
                ])->get();
                foreach ($plantilla as $p){
                    array_push($planteles, ['id' => $p->plantel_id, 'nombre' => Plantel::find($p->plantel_id)->nombre]);
                }
            }
        }

        $periodoActual = Sisec::periodoActual();

        $esAlumno = DB::table('usuario_rol')->where('usuario_id', auth()->user()->id)->where('rol_id', 3)->first();

        $permisos = $user->getAllPermissions()->pluck('name')->toArray();

        if($esAlumno != null) {
            array_push($permisos, 'Actualizar datos');
        }

        $data = [
            'permisos' => $permisos,
            'estados' => $estados,
            'planteles' => $planteles,
            'periodo' => $periodoActual
        ];

        return response()->json($data, 200);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }


}
