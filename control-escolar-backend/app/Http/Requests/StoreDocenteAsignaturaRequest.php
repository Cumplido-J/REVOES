<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreDocenteAsignaturaRequest extends FormRequest
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
            'grupo_periodo_id' => ($this->getMethod() === 'POST' ? 'required|exists:grupo_periodo,id' : 'nullable'),
            'plantilla_docente_id' => 'required|exists:plantilla_docente,id',
            'carrera_uac_id' => 'required|exists:carrera_uac,id',
            'periodo_id' => ($this->getMethod() === 'PUT' ? 'required|exists:periodo,id' : 'nullable'),
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'grupo_periodo_id.required' => 'El :attribute es obligatorio',

            'periodo_id.required' => 'El :attribute es obligatorio',

            'plantilla_docente_id.required' => 'El :attribute es obligatorio',
            
            'carrera_uac_id.required' => 'El :attribute es obligatorio',

            
            /* exist */
            'periodo_id.exists' => 'No fue posible asociar el periodo con la asignatura del docente',
            'grupo_periodo_id.exists' => 'No fue posible asociar el grupo con docente asignatura',
            'carrera_uac_id.exists' => 'No fue posible asociar la carrera_uac con docente asignatura',
            'plantilla_docente_id.exists' => 'No fue posible asociar la plantilla_docente con docente asignatura',
           
        ];
    }

    public function attributes()
    {
        return [
            'grupo_periodo_id' => 'grupo',
            'periodo_id' => 'periodo',
            'plantilla_docente_id' => 'plantilla_docente_id de docente asignatura',
            'cat_tipo_Plaza_id' => 'cat_tipo_Plaza_id de docente asignatura'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de docente asignatura' 
            : 'No fue posible modificar los datos de docente asignatura';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
