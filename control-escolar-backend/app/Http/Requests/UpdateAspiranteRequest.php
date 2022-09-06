<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use ResponseJson;

class UpdateAspiranteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $id = $this->route('id');

        if(strlen($this->curp) > 10){
            $regex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/';
        }else{
            $regex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/';
        }
        
        return [
            'curp' => [
                'max:18',
                Rule::unique('aspirante', 'curp')
                    ->ignore($id)
                    ->whereNull('deleted_at'),
                Rule::unique('usuario', 'username'),
                "regex:{$regex}"
            ],
            'plantel_id' => 'exists:plantel,id',
            'carrera_id' => 'exists:carrera,id',
            'telefono' => 'digits:10',
            'correo' => 'email',
            'fecha_nacimiento' => 'date_format:Y-m-d',
            'domicilio' => 'string|max:250',
            'estatus_pago' => 'in:Pagado,Solicitado,Cancelado'
        ];
    }

    public function messages()
    {
        return [
            'plantel_id.exists' => 'El plantel seleccionado no existe.',
            'carrera_id.exists' => 'La carrera seleccionada no existe.',
            'telefono.digits' => 'El teléfono debe ser numérico y tener máximo 10 dígitos.',
            'email' => 'El formato del correo es incorrecto.',
            'curp.max' => 'El CURP debe tener máximo 18 caracteres.',
            'required' => 'El campo :attribute es obligatorio.',
            'unique' => 'Ya se ha registrado un aspirante con este CURP.',
            'regex' => 'El formato del CURP es inválido.',
            'date_format' => 'El formato de la fecha es incorrecto.',
            'domicilio.max' => 'El campo domicilio puede tener máximo :max caracteres.',
            'estatus_pago.in' => 'El estatus del pago sólo puede ser Pagado, Solicitado o Cancelado.',
        ];
    }

    public function attributes()
    {
        return [
            'primer_apellido' => 'apellido paterno',
            'plantel_id' => 'plantel',
            'carrera_id' => 'carrera'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $msg = 'No se ha podido actualizar el aspirante.';
        $errors = $validator->errors()->getMessages();

        foreach ($errors as $error){
            $msg.=' '.$error[0];
        }

        throw new HttpResponseException(
            response()->json(['message' => $msg], 400)
        );
    }
}
