<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use ResponseJson;

class StoreAspiranteRequest extends FormRequest
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
        if(strlen($this->curp) > 10){
            $regex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/';
        }else{
            $regex = '/^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/';
        }

        return [
            'nombre' => 'required',
            'primer_apellido' => 'required',
            'curp' => [
                'max:18',
                Rule::unique('aspirante','curp')
                    ->whereNull('deleted_at'),
                'unique:usuario,username',
                "regex:{$regex}"
            ],
            'plantel_id' => 'required|exists:plantel,id',
            'carrera_id' => 'exists:carrera,id',
            'telefono' => 'digits:10',
            'correo' => 'email',
            'fecha_nacimiento' => 'date_format:Y-m-d',
            'estatus_pago' => 'in:Pagado,Solicitado,Cancelado',
            'domicilio' => 'string|max:250',
            'dio_alta' => 'required|in:Administrador,Control escolar',
            'sincronizado' => 'required|boolean'
        ];
    }

    public function messages()
    {
        return [
            'plantel_id.exists' => 'El plantel seleccionado no existe.',
            'carrera_id.exists' => 'La carrera seleccionada no existe.',
            'carrera.required' => 'La carrera es obligatoria.',
            'telefono.digits' => 'El teléfono debe ser numérico y tener máximo 10 dígitos.',
            'email' => 'El formato del correo es incorrecto.',
            'curp.max' => 'El CURP debe tener máximo 18 caracteres.',
            'required' => 'El campo :attribute es obligatorio.',
            'unique' => 'Ya hay un aspirante o alumno registrado con este CURP.',
            'regex' => 'El formato del CURP es inválido.',
            'date_format' => 'El formato de la fecha es incorrecto.',
            'domicilio.max' => 'El campo domicilio puede tener máximo :max caracteres.',
            'estatus_pago.in' => 'El estatus del pago sólo puede ser Pagado, Solicitado o Cancelado.',
            'dio_alta.required' => 'Es necesario saber en qué sistema se dio de alta el aspirante.'
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
        $msg = 'No se ha podido registrar el aspirante.';
        $errors = $validator->errors()->getMessages();

        foreach ($errors as $error){
            $msg.=' '.$error[0];
        }

        throw new HttpResponseException(
            response()->json(['message' => $msg], 400)
        );
    }
}
