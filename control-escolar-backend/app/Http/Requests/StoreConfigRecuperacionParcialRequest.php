<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreConfigRecuperacionParcialRequest extends FormRequest
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
            'recuperacion.*.parcial' => 'required|integer|lte:3',
            'recuperacion.*.plantel_cct' => 'required|exists:plantel,cct',
            'recuperacion.*.id' => 'nullable|exists:config_recuperacion_parcial,id',
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'recuperacion.*.parcial.required' => 'El :attribute es obligatorio',
            'recuperacion.*.parcial.integer' => 'El :attribute debe ser un número',
            'recuperacion.*.parcial.lte' => 'El :attribute debe ser un número entre 1 y 3',


            'recuperacion.*.plantel_cct.required' => 'El :attribute es obligatorio',
           
            'recuperacion.*.periodo_id.required' => 'El :attribute es obligatorio',

            'recuperacion.*.plantel_cct.exists' => 'No fue posible asociar el :attribute con la configuración de recuperación de parcial',

            'recuperacion.*.id.exists' => 'No fue posible asociar el :attribute con la configuración de recuperación de parcial',            
        ];
    }

    public function attributes()
    {
        return [
            'recuperacion.*.parcial' => 'parcial',
            'recuperacion.*.plantel_cct' => 'plantel CCT',
            'recuperacion.*.id' => 'ID',
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la configuración de la recuperación por parcial' 
            : 'No fue posible modificar los datos de la configuración de la recuperación por parcial';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
