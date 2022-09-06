<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreDocumentoDocenteRequest extends FormRequest
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
            /* 'proceso' => 'required|min:4',  */
            'documento' => 'required',
            'docente_id' => 'required|exists:docente,id', 
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'documento.required' => 'El :attribute es obligatorio',
            'docente_id.required' => 'El :attribute es obligatorio',
            'docente_id.exists' => 'No fue posible asociar el :attribute',

        ];
    }

    public function attributes()
    {
        return [
            'documento' => 'documento',
            'docente_id' => 'docente'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos del documento' 
            : 'No fue posible modificar los datos del documento';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 202, $validator->errors())
        );
    }
}
