<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreCalificacionUacRequest extends FormRequest
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
            'alumnos.*.alumno_id' => 'required|exists:alumno,usuario_id',
            'carrera_uac_id' => 'required|exists:carrera_uac,id',
            'grupo_periodo_id' => 'required|exists:grupo_periodo,id',
          /*   'periodo_id' => 'required|exists:periodo,id', */
            'plantel_id' => 'required|exists:plantel,id',
            'docente_asignacion_id' => 'required|exists:plantilla_docente,id',
            'alumnos.*.parcial' => 'required|integer|lte:3',
            'alumnos.*.calificacion' => 'nullable|lte:10',
            'alumnos.*.faltas' => 'nullable'
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'alumnos.*.alumno_id.required' => 'El :attribute es obligatorio',
            'carrera_uac_id.required' => 'El :attribute es obligatorio',
            'plantel_id.required' => 'El :attribute es obligatorio',
            'docente_asignacion_id.required' => 'El :attribute es obligatorio',
            'alumnos.*.calificacion.required' => 'El :attribute es obligatorio',
            'alumnos.*.parcial.required' => 'El :attribute es obligatorio',
            /* lte */
            'alumnos.*.parcial.lte' => 'El :attribute debe ser entre 1 y 3',
            'alumnos.*.parcial.integer' => 'El :attribute debe ser un número entero',
            /* lte */
            'alumnos.*.calificacion.lte' => 'El :attribute debe ser entre 0 y 10',
            /* required */
            'grupo_periodo_id.required' => 'El :attribute es requerido',
            /* integer */
           /*  'alumnos.*.calificacion.integer' => 'El :attribute debe ser un número entero', */
            /* exist */
            'alumnos.*.alumno_id.exists' => 'No fue posible asociar el :attribute con la calificación del alumno',
            'carrera_uac_id.exists' => 'No fue posible asociar el :attribute con la calificación del alumno',
            'grupo_periodo_id.exists' => 'No fue posible asociar el :attribute con la calificación del alumno',
            'periodo_id.exists' => 'No fue posible asociar el :attribute con la calificación del alumno',
            'plantel_id.exists' => 'No fue posible asociar el :attribute con la calificación del alumno',
            'docente_asignacion_id.exists' => 'No fue posible asociar el :attribute con la calificación del alumno',
        ];
    }

    public function attributes()
    {
        return [
            'alumnos.*.alumno_id' => 'alumno',
            'carrera_uac_id' => 'carrera_uac',
            'grupo_periodo_id' => 'grupo_periodo',
            'periodo_id' => 'periodo',
            'plantel_id' => 'plantel',
            'docente_asignacion_id' => 'docente',
            'alumnos.*.calificacion' => 'calificación',
            'alumnos.*.parcial' => 'parcial del semestre',
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la calificación uac' 
            : 'No fue posible modificar los datos de la calificación uac';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
