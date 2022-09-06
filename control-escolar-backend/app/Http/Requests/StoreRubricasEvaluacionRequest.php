<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreRubricasEvaluacionRequest extends FormRequest
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
            'parcial' => ($this->getMethod() === 'POST' ? 'required|integer|lte:3' : 'nullable|integer|lte:3'),
            'total_asistencias' => 'nullable|integer',
            'asistencia' => 'nullable|lte:100',
            'examen' => 'nullable|lte:100',
            'practicas' => 'nullable|lte:100',
            'tareas' => 'nullable|lte:100',
            'docente_asignatura_id' => 'required|exists:docente_asignatura,id'
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'parcial.required' => 'El :attribute es obligatorio',
            'parcial.integer' => 'El :attribute debe de ser tipo INT',
            'parcial.lte' => 'El :attribute debe de ser entre 1 y 3',

            'total_asistencias.required' => 'El :attribute es obligatorio',
            'total_asistencias.integer' => 'El :attribute debe de ser tipo INT',

            'docente_asignatura_id.required' => 'La :attribute es obligatorio',
            'docente_asignatura_id.exists' => 'No fue posible asociar la :attribute con las rubricas de evaluación',  
            
            'asistencia.lte' => 'La :attribute debe de ser entre 1 y 100',
            'examen.lte' => 'El :attribute debe de ser entre 1 y 100',
            'practicas.lte' => 'Las :attribute debe de ser entre 1 y 100',
            'tareas.lte' => 'Las :attribute debe de ser entre 1 y 100',

            
        ];
    }

    public function attributes()
    {
        return [
            'parcial' => 'parcial',
            'total_asistencias' => 'total de asistencias',
            'docente_asignatura' => 'asignatura del docente',
            'asistencia' => 'asistencia',
            'examen' => 'examen',
            'practicas' => 'practicas',
            'tareas' => 'tareas',
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de las rubricas de evaluación' 
            : 'No fue posible modificar los datos de las rubricas de evaluación';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
