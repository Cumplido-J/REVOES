<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreDocentePlantillaRequest extends FormRequest
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
            'fecha_asignacion' => 'required|min:10|date', 
            'fecha_inicio_contrato' => 'required|min:10|date|after_or_equal:fecha_asignacion', 
            /* 'fecha_fin_contrato' => 'required|min:10', */
            'horas' => 'required|min:1|max:2|lte:50',
            'docente_id' => 'required|exists:docente,id',
            'cat_tipo_plaza_id' => 'required|exists:cat_tipo_Plaza,id',
            'plantel_id' => 'required|exists:plantel,id',
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'fecha_asignacion.required' => 'La :attribute es obligatorio',

            'fecha_inicio_contrato.required' => 'La :attribute es obligatorio',
            'fecha_inicio_contrato.after_or_equal' => 'La :attribute debe ser mayor o igual a la fecha de la asignación',

        /*     'fecha_fin_contrato.required' => 'El :attribute es obligatorio', */

            'horas.required' => 'El :attribute es obligatorio',
            'horas.max' => 'El máximo de horas son 2 dígitos',
            'horas.lte' => 'Las :attribute debe ser menor o igual a 50',

            'plantel_id.required' => 'El :attribute es obligatorio',

            'docente_id.required' => 'El :attribute es obligatorio',
            
            'cat_tipo_plaza_id.required' => 'El :attribute es obligatorio',

            
            /* exist */
            'plantel_id.exists' => 'No fue posible asociar el plantel con la asignación',
            'docente_id.exists' => 'No fue posible asociar el docente con la asignación',
            'cat_tipo_plaza_id.exists' => 'No fue posible asociar la cat plaza con la asignación',
           
        ];
    }

    public function attributes()
    {
        return [
            'fecha_asignacion' => 'fecha de la asignación',
            'fecha_inicio_contrato' => 'fecha inicio de la asignación',
            'fecha_fin_contrato' => 'fecha fin de la asignación',
            'horas' => 'horas de la asignación',
            'plantel_id' => 'plantel de la asignación',
            'docente_id' => 'docente_id de la asignación',
            'cat_tipo_plaza_id' => 'tipo de plaza de la asignación'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la asignación con el docente' 
            : 'No fue posible modificar los datos de la asignación con el docente';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
