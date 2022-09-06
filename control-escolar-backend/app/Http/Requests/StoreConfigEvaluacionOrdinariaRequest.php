<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreConfigEvaluacionOrdinariaRequest extends FormRequest
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
            /* 'ordinarios' => 'required', */
            'ordinarios.*.parcial' => 'required|integer|lte:3',
          
            'ordinarios.*.plantel_cct' => 'required|exists:plantel,cct',
            'ordinarios.*.fecha_inicio' => 'min:10|date|before_or_equal:ordinarios.*.fecha_final',
            'ordinarios.*.fecha_final' => 'min:10|date|after_or_equal:fecha_inicio',
            'ordinarios.*.id' => 'nullable|exists:config_evaluaciones_ordinarias_parcial,id',
            /* extraordinarios */
            /* 'extraordinarios' => 'required', */
            'extraordinarios.*.plantel_cct' => 'required|exists:plantel,cct',
            'extraordinarios.*.fecha_inicio' => 'min:10|date|before_or_equal:extraordinarios.*.fecha_final',
            'extraordinarios.*.fecha_final' => 'min:10|date|after_or_equal:extraordinarios.*.fecha_inicio',
            'extraordinarios.*.id' => 'nullable|exists:config_evaluaciones_extraordinarias,id',
            //'periodo_id' => ($this->getMethod() === 'PUT' ? 'exists:periodo,id|required' : 'nullable'),
           /*  'estado_id' => ($this->getMethod() === 'POST' ? 'required|exists:cat_estado,id' : 'nullable') */
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            /* ordinarios */
           /*  'ordinarios.required' => 'El :attribute es obligatorio', */
            /* parcial */
            'ordinarios.*.parcial.required' => 'El :attribute es obligatorio',
            'ordinarios.*.parcial.integer' => 'El :attribute debe ser un número',
            'ordinarios.*.parcial.lte' => 'El :attribute debe ser un número entre 1 y 3',


            'ordinarios.*.plantel_cct.required' => 'El :attribute es obligatorio',
           
            'ordinarios.*.periodo_id.required' => 'El :attribute es obligatorio',

            'ordinarios.*.fecha_inicio.required' => 'La :attribute es obligatorio',
            'ordinarios.*.fecha_inicio.before_or_equal' => 'La :attribute debe ser menor a fecha final',
            

            'ordinarios.*.fecha_final.required' => 'El :attribute es obligatorio',
            'ordinarios.*.fecha_final.after' => 'El :attribute deber ser mayor a la fecha de inicio',

            'ordinarios.*.plantel_cct.exists' => 'No fue posible asociar el :attribute con la configuración de evaluación ordinaria',
            'ordinarios.*.periodo_id.exists' => 'No fue posible asociar el :attribute con la configuración de evaluación ordinaria',
            'ordinarios.*.id.exists' => 'No fue posible asociar el :attribute con la configuración de evaluación ordinaria',

            /* extraordinarios */
            /* 'extraordinarios.required' => 'El :attribute es obligatorio', */
            'extraordinarios.*.plantel_cct.required' => 'El :attribute es obligatorio',
           
            'extraordinarios.*.periodo_id.required' => 'El :attribute es obligatorio',

            'extraordinarios.*.fecha_inicio.required' => 'La :attribute es obligatorio',
            'extraordinarios.*.fecha_inicio.before' => 'La :attribute debe ser menor a fecha final',
            

            'extraordinarios.*.fecha_final.required' => 'El :attribute es obligatorio',
            'extraordinarios.*.fecha_final.after' => 'El :attribute deber ser mayor a la fecha de inicio',
            'extraordinarios.*.fecha_final.before' => 'El :attribute deber ser menor a la fecha final',

            'extraordinarios.*.plantel_cct.exists' => 'No fue posible asociar el :attribute con la configuración de evaluación ordinaria',
            'extraordinarios.*.periodo_id.exists' => 'No fue posible asociar el :attribute con la configuración de evaluación ordinaria',
            'extraordinarios.*.id.exists' => 'No fue posible asociar el :attribute con la configuración de evaluación ordinaria'
            
        ];
    }

    public function attributes()
    {
        return [
            'ordinarios.*.parcial' => 'parcial',
            'ordinarios.*.fecha_inicio' => 'fecha inicio de la evaluación ordinarias',
            'ordinarios.*.fecha_final' => 'fecha final de la evaluación ordinarias',
            'ordinarios.*.plantel_cct' => 'plantel CCT',
            'ordinarios.*.periodo_id' => 'periodo de la evaluación ordinarias',
            'ordinarios.*.id' => 'ID',
            /* extraordinarios */
            'extraordinarios.*.fecha_inicio' => 'fecha inicio de la evaluación extraordinarias',
            'extraordinarios.*.fecha_final' => 'fecha final de la evaluación extraordinarias',
            'extraordinarios.*.plantel_cct' => 'plantel CCT',
            'extraordinarios.*.periodo_id' => 'periodo de la evaluación extraordinarias',
            'extraordinarios.*.id' => 'ID'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la configuración de la evaluación ordinaria' 
            : 'No fue posible modificar los datos de la configuración de la evaluación ordinaria';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
