<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreConfigCalificarHistoricoRequest extends FormRequest
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
            'historico.*.plantel_cct' => 'required|exists:plantel,cct',
            'historico.*.fecha_inicio' => 'min:10|date|before_or_equal:historico.*.fecha_final',
            'historico.*.fecha_final' => 'min:10|date|after_or_equal:fecha_inicio',
            'historico.*.id' => 'nullable|exists:config_calificar_historico,id',
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
           

            'historico.*.plantel_cct.required' => 'El :attribute es obligatorio',
           
            'historico.*.periodo_id.required' => 'El :attribute es obligatorio',

            'historico.*.fecha_inicio.before_or_equal' => 'El :attribute deber ser menor a la fecha final',
            'historico.*.fecha_final.required' => 'El :attribute es obligatorio',
            'historico.*.fecha_final.after_or_equal' => 'El :attribute deber ser mayor a la fecha de inicio',

            'historico.*.plantel_cct.exists' => 'No fue posible asociar el :attribute con la configuración calificaciones historicas',

            'historico.*.id.exists' => 'No fue posible asociar el :attribute con la configuración calificaciones historicas',            
        ];
    }

    public function attributes()
    {
        return [
            'historico.*.plantel_cct' => 'plantel CCT',
            'historico.*.fecha_inicio' => 'fecha inicio de la evaluación ordinarias',
            'historico.*.fecha_final' => 'fecha final de la evaluación ordinarias',
            'historico.*.id' => 'ID',
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la configuración del historico intersemestral' 
            : 'No fue posible modificar los datos de la configuración del historico intersemestral';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
