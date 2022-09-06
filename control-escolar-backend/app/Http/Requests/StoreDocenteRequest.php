<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator; 
use Illuminate\Http\Exceptions\HttpResponseException;
use ResponseJson;

class StoreDocenteRequest extends FormRequest
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
            'nombre' => 'required|min:4',
            'primer_apellido' => 'required|min:3',
            'segundo_apellido' => 'min:3|nullable',
            'correo' => 'nullable|min:5|max:60|email|unique:App\Docente,correo,'.($this->id ? $this->id: ""),
            'correo_inst' => 'nullable|min:5|nullable|max:60|email|unique:App\Docente,correo_inst,'.($this->id ? $this->id: ""),
            'num_nomina' => 'nullable|min:1|max:20',
            'cedula' => 'max:8|min:1|nullable|unique:App\Docente,cedula,'.($this->id ? $this->id: ""),
            'rfc' => 'nullable|min:12|max:13|unique:App\Docente,rfc,'.($this->id ? $this->id: ""),
            'curp' => 'required|min:18|size:18|unique:App\Docente,curp,'.($this->id ? $this->id: ""),
            'fecha_nacimiento' => 'min:10|date|nullable',
            'direccion' => 'nullable|min:5',
            'cp' => 'min:1|nullable',
            'telefono' => 'min:5|nullable',
            'fecha_ingreso' => 'nullable|min:10|date',
            'fecha_baja' => 'min:10|date|nullable', 
            'fecha_reingreso' => 'min:10|date|nullable',
            'genero' => 'min:1|nullable',
            'tipo_sangre' => 'min:1|nullable',  
            /* 'docente_estatus' => 'min:1', */
            'ciudad_direccion' => 'nullable|exists:cat_municipio,id',
            'ciudad_nacimiento' => 'nullable|exists:cat_municipio,id',
            'maximo_grado_estudio' => 'min:5|nullable',
            'fecha_egreso' => 'min:10|date|nullable',
            'documento_comprobatorio' => 'nullable',
            'comentario' => 'min:5|max:300|nullable',
        ];
    }
    public  function updateQ($var)
    {
        return [$var];
    }
    public function messages() 
    {
        return [
            'nombre.required' => 'El :attribute es obligatorio',

            'primer_apellido.required' => 'El :attribute es obligatorio',

            'docente_estatus.required' => 'El :attribute es obligatorio',
            
            'rfc.required' => 'El :attribute es obligatorio',
            'rfc.size' => 'El número máximo de caracteres de :attribute es de 13',
            'rfc.min' => 'El número mínimo de caracteres de :attribute es de 12',
            'rfc.max' => 'El número mánimo de caracteres de :attribute es de 13',
            
            'curp.required' => 'El :attribute es obligatorio',
            'curp.size' => 'El número máximo de caracteres de :attribute es de 18',

            'cedula.max' => 'El :attribute es máximo de 8 caracteres',
            'cedula.size' => 'El :attribute es máximo de 8 caracteres',
            'cedula.min' => 'El :attribute es mínimo de 1 carácter',
           
            'ciudad_direccion.required' => 'El :attribute es obligatorio',
            'ciudad_nacimiento.required' => 'El :attribute es obligatorio',

            'telefono.required' => 'El :attribute es obligatorio',

            'genero.required' => 'El :attribute es obligatorio',

            'num_nomina.required' => 'El :attribute es obligatorio',
            'num_nomina.max' => 'El :attribute es máximo 20 caracteres',
            'num_nomina.min' => 'El :attribute es mínimo 1 caracteres',
            'num_nomina.size' => 'El :attribute es máximo 20 caracteres',

            'direccion.required' => 'El :attribute es obligatorio',

            'fecha_ingreso.required' => 'El :attribute es obligatorio',

            'tipo_sangre' => 'El :attribute es obligatorio',

            'fecha_egreso.required' => 'El :attribute es obligatorio',
            'fecha_egreso.after' => 'El :attribute debe ser mayor a la fecha de nacimiento',
            'fecha_egreso.before' => 'El :attribute debe ser menor a la fecha de ingreso',
 
            'fecha_nacimiento' => 'El :attribute es obligatorio',

            'maximo_grado_estudio.required' => 'El :attribute es obligatorio',

            'comentario.min' => 'El número mínimo de :attribute es de 5 caracteres',
            'documento_comprobatorio.required' => 'El :attribute es obligatorio',
            
            'correo.required' => 'El :attribute es obligatorio',
            'correo_inst.required' => 'El :attribute es obligatorio',

            'correo.max' => 'El :attribute es máximo 60 caracteres',
            'correo_inst.max' => 'El :attribute es máximo 60 caracteres',

            'correo.email' => 'El :attribute debe de ser tipo correo electrónico',
            'correo_inst.email' => 'El :attribute debe de ser tipo correo electrónico',

            'correo.unique' => 'El :attribute ya se encuentra en uso',
            'correo_inst.unique' => 'El :attribute ya se encuentra en uso',
            /* type date */
            'fecha_ingreso' => 'El :attribute debe de ser tipo fecha',
            'fecha_baja' => 'El :attribute debe de ser tipo fecha',
            'fecha_reingreso' => 'El :attribute debe de ser tipo fecha',
            'fecha_egreso' => 'El :attribute debe de ser tipo fecha',

            /* unique */
            'num_nomina.unique' => 'El :attribute ya se encuentra registrado',
            'rfc.unique' => 'El :attribute ya se encuentra registrado',
            'curp.unique' => 'El :attribute ya se encuentra registrado',
            'cedula.unique' => 'El :attribute ya se encuentra registrado',
            
            /* exist */
            'ciudad_direccion.exists' => 'No fue posible asociar la ciudad con el docente',
            'ciudad_nacimiento.exists' => 'No fue posible asociar la ciudad de nacimiento con el docente',
           
        ];
    }

    public function attributes()
    {
        return [
            'nombre' => 'nombre del docente',
            'docente_no' => 'número del docente',
            'primer_apellido' => 'primero apellido del docente',
            'segundo_apellido' => 'segundo apellido del docente',
            'docente_estatus' => 'estatus del docente',
            'rfc' => 'rfc del docente',
            'curp' => 'curp del docente',
            'direccion' => 'dirección del docente',
            'telefono' => 'telefono del docente',
            'genero' => 'genero del docente',
            'tipo_sangre' => 'tipo de sangre del docente',
            'num_nomina' => 'número de nomina del docente',
            'fecha_ingreso' => 'fecha ingreso del docente',
            'fecha_baja' => 'fecha baja del docente',
            'fecha_reingreso' => 'fecha reingreso del docente',
            'ciudad_direccion' => 'ciudad nacimiento del docente',
            'ciudad_nacimiento' => 'ciudad nacimiento del docente',
            'cedula' => 'cédula del docente',
            'maximo_grado_estudio' => 'máximo grado de estudio del docente',
            'fecha_egreso' => 'fecha de egreso del docente',
            'documento_comprobatorio' => 'documento comprobatorio',
            'correo_inst' => 'Correo institucional',
            'fecha_nacimiento' => 'Fecha de nacimiento'
        ];
    }

    public function failedValidation(Validator $validator) 
    {
        $msg = $this->getMethod() === 'POST' ? 'No fue posible almacenar los datos del docente' 
            : 'No fue posible modificar los datos del docente';
        
        throw new HttpResponseException(
            ResponseJson::error($msg, 400, $validator->errors())
        );
    }
}
