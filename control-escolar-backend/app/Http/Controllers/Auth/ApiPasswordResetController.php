<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Traits\AuditoriaLogHelper;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Notifications\PasswordResetRequest;
use App\Usuario;
use App\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ApiPasswordResetController extends Controller
{

    use AuditoriaLogHelper;

    /**
     * Create token password reset
     *
     * @param  [string] email
     * @return [string] message
     */
    public function create(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = Usuario::where('email', $request->email)->first();

        if (!$user)
            return response()->json([
                'message' => "No existe un usuario con ese correo electrónico."
            ], 400);

        $passwordReset = PasswordReset::updateOrCreate(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => Str::random(60)
             ]
        );

        if ($user && $passwordReset)
            $user->notify(
                new PasswordResetRequest($passwordReset->token)
            );

        return response()->json([
            'message' => 'Hemos enviado el enlace para restablecer la contraseña a su correo electrónico.'
        ]);
    }
    /**
     * Find token password reset
     *
     * @param  [string] $token
     * @return [string] message
     * @return [json] passwordReset object
     */
    public function find(Request $request)
    {
        $passwordReset = PasswordReset::where('token', $request->token)
            ->first();
        if (!$passwordReset)
            return response()->json(['message' => 'Este enlace es inválido.'], 400);
        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json(['message' => 'Este enlace ha expirado'], 400);
        }
        return response()->json(['message' => 'Enlace válido'], 200);
    }
     /**
     * Reset password
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @param  [string] token
     * @return [string] message
     * @return [json] user object
     */
    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string|confirmed',
            'token' => 'required|string'
        ]);

        $user = Usuario::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => "No se encuentra un usuario con ese correo."
            ], 400);
        }

        $passwordReset = PasswordReset::where([
            ['token', $request->token],
            ['email', $request->email]
        ])->first();

        if (!$passwordReset)
            return response()->json(['message' => 'La información proporcionada es invalida o la liga ha expirado'], 400);

        $user->password = bcrypt($request->password);
        $user->save();
        $passwordReset->delete();
        return response()->json(['message' => 'Contraseña cambiada exitosamente'], 200);
    }

    public function validateToken(Request $request){
        $valido = PasswordReset::where('token', $request->token)->first();

        if($valido == null)
            return response()->json(['message' => 'El token es inválido.'], 400);
        else
            return response()->json(['message' => 'Token válido'], 200);
    }

    public function resetWithoutToken(Request $request){

        if(!auth()->user()->hasPermissionTo('Cambiar contraseña')){
            return response()->json(['message' => 'No tiene permiso para realizar esta acción'], 403);
        }

        if(($errores = $this->validacionContrasena($request)) != null){
            return response()->json(['message' => $errores], 400);
        }

        if($request->old_password == $request->password){
            return response()->json(['message' => 'La contraseña nueva no puede ser igual a la anterior.'], 400);
        }

        $credentials = [
            'username' =>  auth()->user()->username,
            'password' => $request->old_password
        ];

        if(!auth()->attempt($credentials)){
            return response()->json(['message' => 'La contraseña actual es incorrecta'], 400);
        }

        $usuario = auth()->user();
        $usuario->password = Hash::make($request->password);
        $usuario->save();

        $this->auditoriaManualSave(
            "Cambió su contraseña",
            'usuario',
            $usuario->id,
            'resetWithoutToken',
            'App\Usuario'
        );

        return response()->json(['message' => 'Se ha modificado la contraseña'], 200);

    }

    private function validacionContrasena(Request $request){

        try{
            $request->validate([
                'password' => 'required|string|confirmed|min:8',
                'old_password' => 'required|string'
            ],[
                'password.required' => 'La contraseña nueva es requerida.',
                'password.confirmed' => 'La contraseñas no coinciden.',
                'old_password.required' => 'La contraseña actual es requerida',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.'
            ]);
        }catch(ValidationException $e){
            $errors = $e->validator->errors()->getMessages();

            //Propuesta para retornar sólo mensajes sin tantos arreglos
            $messages = "";
            foreach ($errors as $error){
                if(is_array($error)){
                    foreach ($error as $e){
                        $messages.=' '.$e;
                    }
                }else{
                    $messages.=' '.$error[0];
                }
            }

            return $messages;
        }

        return null;
    }
}
