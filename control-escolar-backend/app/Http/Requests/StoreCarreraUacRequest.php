<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreCarreraUacRequest extends FormRequest
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
            'carrera_id' => 'required|exists:carrera,id',
            'uac_id' => 'required|exists:uac,id',
            'semestre' => 'required'
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'semestre.required' => 'El :attribute es obligatorio',

            'carrera_id.required' => 'El :attribute es obligatorio',

            'uac_id.required' => 'El :attribute es obligatorio',
            
            
            /* exist */
            'carrera_id.exists' => 'No fue posible asociar la carrera con carrera_uac',
            'uac_id.exists' => 'No fue posible asociar el grupo con carrera_uac'
        ];
    }

    public function attributes()
    {
        return [
            'carrera_id' => 'carrera de carrera_uac',
            'uac_id' => 'uac de carrera_uac',
            'semestre' => 'semestre de carrera_uac',
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos de carrera_uac' 
            : 'No fue posible modificar los datos de carrera_uac';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 202, $validator->errors())
        );
    }
}
