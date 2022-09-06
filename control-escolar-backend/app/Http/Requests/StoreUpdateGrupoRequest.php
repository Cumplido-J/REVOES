<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateGrupoRequest extends FormRequest
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
            'plantel_id' => 'required|integer|exists:plantel,id',
            'carrera_id' => 'required|integer|exists:carrera,id',
            'turno' => 'required|min:2',
            'grupo' => 'required|min:2',
            'semestre' => 'required|max:2|integer',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'plantel_id.required' => 'El plantel es obligatorio',
            'plantel_id.exists' => 'No se encontró el plantel al que se desea asignar el grupo',
            'carrera_id.exists' => 'No se encontró la carrera a la que se desea asignar el grupo',
            'carrera_id.required' => 'El plantel es obligatorio',
            'turno.required' => 'El turno es obligatorio',
            'grupo.required' => 'El nombre del grupo es obligatorio',
            'semestre.required' => 'El semestre es obligatorio',
        ];
    }
}
