<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreConfigRecursamientoSemestralRequest extends FormRequest
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
            'recursamiento.*.plantel_cct' => 'required|exists:plantel,cct',
            'recursamiento.*.fecha_inicio' => 'min:10|date|before_or_equal:recursamiento.*.fecha_final',
            'recursamiento.*.fecha_final' => 'min:10|date|after_or_equal:fecha_inicio',
            'recursamiento.*.fecha_final' => 'min:10|date|after_or_equal:fecha_inicio',
            'recursamiento.*.id' => 'nullable|exists:config_recursamiento_semestral,id',
            'recursamiento.*.max_alumnos' => 'required|lte:50'
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
           

            'recursamiento.*.plantel_cct.required' => 'El :attribute es obligatorio',
           
            'recursamiento.*.periodo_id.required' => 'El :attribute es obligatorio',

            'recursamiento.*.fecha_inicio.before_or_equal' => 'El :attribute deber ser menor a la fecha final',
            'recursamiento.*.fecha_final.required' => 'El :attribute es obligatorio',
            'recursamiento.*.fecha_final.after_or_equal' => 'El :attribute deber ser mayor a la fecha de inicio',

            'recursamiento.*.max_alumnos.required' => 'El :attribute es obligatorio',
            'recursamiento.*.max_alumnos.lte' => 'El :attribute no valido',

            'recursamiento.*.plantel_cct.exists' => 'No fue posible asociar el :attribute con la configuración de recursamiento semestral',

            'recursamiento.*.id.exists' => 'No fue posible asociar el :attribute con la configuración de recursamiento semestral',            
        ];
    }

    public function attributes()
    {
        return [
            'recursamiento.*.plantel_cct' => 'plantel CCT',
            'recursamiento.*.max_alumnos' => 'número de alumnos en grupo',
            'recursamiento.*.fecha_inicio' => 'fecha inicio de la evaluación ordinarias',
            'recursamiento.*.fecha_final' => 'fecha final de la evaluación ordinarias',
            'recursamiento.*.id' => 'ID',
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la configuración del recursamiento semestral' 
            : 'No fue posible modificar los datos de la configuración del recursamiento semestral';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
