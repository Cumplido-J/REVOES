<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreDocentePlantillaBajaRequest extends FormRequest
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
            /* 'fecha_asignacion' => 'required|min:10',  */
           /*  'fecha_inicio_contrato' => 'required|min:10',  */
            'fecha_fin_contrato' => 'required|min:10',
           /*  'horas' => 'required|min:1', */
         /*    'docente_id' => 'required|exists:docente,id', */
          /*   'cat_tipo_Plaza_id' => 'required|exists:cat_tipo_plaza,id', */
            /* 'plantel_id' => 'required|exists:plantel,id', */
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
          

            'fecha_fin_contrato.required' => 'El :attribute es obligatorio',

            'plantel_id.required' => 'El :attribute es obligatorio',

            'docente_id.required' => 'El :attribute es obligatorio',
            
            'cat_tipo_Plaza_id.required' => 'El :attribute es obligatorio',
            
            /* exist */
            'plantel_id.exists' => 'No fue posible asociar el plantel con la plantilla',
            'docente_id.exists' => 'No fue posible asociar el docente con la plantilla',
            'cat_tipo_Plaza_id.exists' => 'No fue posible asociar la cat plaza con la plantilla',
           
        ];
    }

    public function attributes()
    {
        return [
            'fecha_asignacion' => 'fecha_asignacion de la plantilla',
            'fecha_inicio_contrato' => 'fecha_inicio_contrato de la plantilla',
            'fecha_fin_contrato' => 'fecha_fin_contrato de la plantilla',
            'horas' => 'horas de la plantilla',
            'plantel_id' => 'plantel de la plantilla',
            'docente_id' => 'docente_id de la plantilla',
            'cat_tipo_Plaza_id' => 'cat_tipo_Plaza_id de la plantilla'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la plantilla_docente' 
            : 'No fue posible modificar los datos de la plantilla_docente';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 202, $validator->errors())
        );
    }
}
