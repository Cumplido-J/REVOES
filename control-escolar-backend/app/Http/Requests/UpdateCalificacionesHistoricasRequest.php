<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class UpdateCalificacionesHistoricasRequest extends FormRequest
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
        return [
            //'calificaciones.*.calificacion_id' =>  ($this->getMethod() === 'PUT' ? 'required|exists:calificacion_alumno_uac,id' : 'nullable'),
            'calificaciones.*.calificacion' => 'nullable|lte:10',
            'calificaciones.*.tipo_calificacion' => ($this->getMethod() === 'POST' ? 'required|in:N,EXT,CI,RS' : 'nullable|in:N,EXT,CI,RS'),
            'carrera_uac_id' => ($this->getMethod() === 'POST' ? 'required|exists:carrera_uac,id' : 'nullable'),
            'faltas' => 'nullable'
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'calificacion_id.required' => 'El :attribute es obligatorio',
            /* lte */
            'calificacion.lte' => 'El :attribute debe ser entre 0 y 10',
            /* exist */
            'calificacion_id.exists' => 'No fue posible asociar el :attribute con la calificación del alumno',
        ];
    }

    public function attributes()
    {
        return [
            'calificacion_id' => 'calificacion_id',
            'calificacion' => 'calificación',
            'faltas' => 'faltas del parcial',
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la calificación' 
            : 'No fue posible modificar los datos de la calificación';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
