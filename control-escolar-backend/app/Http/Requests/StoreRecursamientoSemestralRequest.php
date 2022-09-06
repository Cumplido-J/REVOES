<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreRecursamientoSemestralRequest extends FormRequest
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
            //'alumnos.*.carrera_uac_id' => 'required|exists:carrera_uac,id',
            'carrera_uac_id' => 'required|exists:carrera_uac,id',
            'plantel_id' => 'required|exists:plantel,id',
            'docente_asignacion_id' => 'required|exists:plantilla_docente,id',
            'grupo_periodo_id' => 'required|exists:grupo_periodo,id'
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

            'semestre.required' => 'El :attribute es obligatorio',
            /* lte */
            'semestre.lte' => 'El :attribute debe ser entre 1 y 6',
            /* exist */
            'alumnos.*.alumno_id.exists' => 'No fue posible asociar el :attribute con el grupo de recursamiento',
            'carrera_uac_id.exists' => 'No fue posible asociar el :attribute con el grupo de recursamiento',

            //grupo_periodo
            'grupo_periodo_id.exists' => 'No fue posible asociar el :attribute con el grupo de recursamiento',
            'grupo_periodo_id.required' => 'El :attribute es obligatorio',
            
            'plantel_id.exists' => 'No fue posible asociar el :attribute con el grupo de recursamiento',
            'docente_asignacion_id.exists' => 'No fue posible asociar el :attribute con el grupo de recursamiento',
        ];
    }

    public function attributes()
    {
        return [
            'alumnos.*.alumno_id' => 'alumno',
            'carrera_uac_id' => 'carrera_uac',
            'plantel_id' => 'plantel',
            'docente_asignacion_id' => 'docente',
            'semestre.' => 'semestre',
            'grupo_periodo_id' => 'grupo periodo'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de la calificación' 
            : 'No fue posible modificar los datos de la calificación';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
