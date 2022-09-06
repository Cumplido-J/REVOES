<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreBitacoraEvaluacionRequest extends FormRequest
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
            'alumnos.*.parcial' => 'required|integer|lte:3',
            'alumnos.*.asistencia' => 'nullable|lte:10',
            'alumnos.*.faltas' => 'nullable',
            'alumnos.*.examen' => 'nullable|lte:10',
            'alumnos.*.practicas' => 'nullable|lte:10',
            'alumnos.*.tareas' => 'nullable|lte:10',
            'alumnos.*.alumno_id' => 'required|exists:alumno,usuario_id',
            'docente_asignatura_id' => 'required|exists:docente_asignatura,id',
            'docente_asignacion_id' => 'required|exists:plantilla_docente,id',
            'carrera_uac_id' => 'required|exists:carrera_uac,id',
            'grupo_periodo_id' => 'exists:grupo_periodo,id',
            'plantel_id' => 'required|exists:plantel,id',
            'rubricas_evaluacion_id' => 'required|exists:rubricas_evaluacion,id'
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'alumnos.*.parcial.required' => 'El :attribute es obligatorio',
            'alumnos.*.parcial.integer' => 'El :attribute debe de ser tipo INT',
            'alumnos.*.parcial.lte' => 'El :attribute debe de ser entre 1 y 3',

            'alumnos.*.asistencia.required' => 'El :attribute es obligatorio',
            'alumnos.*.asistencia.lte' => 'El :attribute debe máximo a 10',

            'alumnos.*.examen.lte' => 'El :attribute debe máximo a 10',

            'alumnos.*.practicas.lte' => 'El :attribute debe máximo a 10',

            'alumnos.*.tareas.lte' => 'El :attribute debe máximo a 10',

            'docente_asignatura_id.required' => 'La :attribute es obligatorio',
            'docente_asignatura_id.exists' => 'No fue posible asociar la :attribute con la bitacora de evaluación',           

            'docente_asignacion_id.required' => 'La :attribute es obligatorio',
            'docente_asignacion_id.exists' => 'No fue posible asociar la :attribute con la bitacora de evaluación',           

            'alumno_id.required' => 'El :attribute es obligatorio',
            'alumno_id.exists' => 'No fue posible asociar el :attribute con la bitacora de evaluación',         
            
            'carrera_uac_id.required' => 'La :attribute es obligatorio',
            'carrera_uac_id.exists' => 'No fue posible asociar la :attribute con la bitacora de evaluación',
            
            'grupo_periodo_id.required' => 'El :attribute es obligatorio',
            'grupo_periodo_id.exists' => 'No fue posible asociar el :attribute con la bitacora de evaluación',

            'plantel_id.required' => 'El :attribute es obligatorio',
            'plantel_id.exists' => 'No fue posible asociar el :attribute con la bitacora de evaluación',

            'rubricas_evaluacion_id.required' => 'Las :attribute son obligatorias',
            'rubricas_evaluacion_id.exists' => 'No fue posible asociar las :attribute con la bitacora de evaluación',

            
        ];
    }

    public function attributes()
    {
        return [
            'parcial' => 'parcial',
            'asistencia' => 'asistencia',
            'faltas' => 'faltas',
            'docente_asignatura' => 'asignatura del docente',
            'alumno_id' => 'alumno',
            'carrera_uac_id' => 'carrera_uac',
            'grupo_periodo_id' => 'grupo periodo',
            'plantel_id' => 'plantel',
            'rubricas_evaluacion_id' => 'rubricas de evaluación',
            'docente_asignacion_id' => 'asignación del docente'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la bitacora de evaluación' 
            : 'No fue posible modificar los datos de la bitacora de evaluación';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
