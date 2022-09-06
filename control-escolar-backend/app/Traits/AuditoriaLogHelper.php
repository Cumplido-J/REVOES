<?php

namespace App\Traits;

use Illuminate\Auth\AuthManager;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use App\Helpers\ActivityLog;
use Illuminate\Support\Traits\Macroable;
use App\Helpers\Interfaces\AuditoriaLogInterface;
use App\Providers\AuditoriaLogProvider;
use Illuminate\Support\ServiceProvider;
use Carbon\Carbon;
use App\Usuario;

trait AuditoriaLogHelper
{
    use Macroable;

    /** @var \Illuminate\Auth\AuthManager */
    protected $auth;

    /** @var string */
    protected $authDriver;

    protected $activity;

    public function __construct(Auth $auth)
    {
        $this->auth = $auth;

    }

    public function accessProtected($obj, $prop) {
        $reflection = new \ReflectionClass($obj);
        $property = $reflection->getProperty($prop);
        $property->setAccessible(true);
        return $property->getValue($obj);
    }

    public function auditoriaSave($model, $model_old = null)
    {
        /* detectar si hubo cambios en update */
        if($model_old != null){
            //consultar si sufrio cambios reales
            if($model->wasChanged()){
                $action = "Update";
                $this->withProperties($model, $model_old); /* funcion descripcion (propiedades) */
            }else{
                return false; //cancelar log
            }
        }else{
            //consultar si fue create/insert
            if($model->wasRecentlyCreated){
                $action = "Create";
                $this->withProperties($model); /* funcion descripcion (propiedades) */
            }else if(!$model->exists || !$model->wasRecentlyCreated){
                //dato eliminado
                $action = "Delete";
                $this->withProperties($model); /* funcion descripcion (propiedades) */
            }else {
                return false; //cancelar log
            }
        }
        $class_name = get_class($model); /* nombre del objeto */
        $this->getActivity()->clase = $class_name; /* declarar en actividad global los atributos */
        $this->getActivity()->metodo = $action;
        $this->subjectTable($model); /* funcion tabla from */
        $user = auth()->user();
        $this->causedBy($user); /* usuario auth */
        $this->createdAt(); /* fecha */
        $this->log(); /* funcion save */
        return $this;
    }

    public function auditoriaManualSave($descripcion, $tabla, $tabla_id, $metodo, $clase){
        $this->getActivity()->clase = $clase;
        $this->getActivity()->metodo = $metodo;
        $this->getActivity()->tabla = $tabla;
        $this->getActivity()->tabla_id = $tabla_id;
        $this->causedBy(auth()->user());
        $this->createdAt();
        $this->getActivity()->descripcion = $descripcion;
        $this->log();
        return $this;
    }

    public function subjectTable($model)
    {
        $table_name = $this->accessProtected($model, 'table');
        $table_id = $this->accessProtected($model, 'attributes');
        $this->getActivity()->tabla = $table_name;
        if(get_class($model) != 'App\Alumno')
            $this->getActivity()->tabla_id = $table_id["id"];
        else
            $this->getActivity()->tabla_id = $table_id["usuario_id"];
    }

    public function causedBy($modelOrId)
    {
        if ($modelOrId === null) {
            return $this;
        }

        $model = $this->normalizeCauser($modelOrId);
        $user = $this->getActivity()->causer()->associate($model);
        return $this;
    }

    public function withProperties($properties, $old_properties = null)
    {
        if($old_properties != null){
             /*  $data = $this->accessProtected($model, 'items'); /* acceder a items */
            $new_obj = [];
            $old_obj = [];
            $attributes = $this->accessProtected($properties, 'attributes'); /* acceder a los atributos */
            $old_attributes = $this->accessProtected($old_properties, 'attributes'); /* acceder a los atributos */
            foreach($attributes as $key=>$value){
                foreach($old_attributes as $key_old=>$value_old){
                    if($key == $key_old){
                        if($value != $value_old){
                            $new_obj[$key] = $value;
                            $old_obj[$key_old] = $value_old;
                        }
                    }
                }
            }
            $details = [
               "old" =>
                    $old_obj,
               "new" =>
                   $new_obj
            ];
            $properties = $details;
        }
        $this->getActivity()->descripcion = collect($properties);
        return $this;
    }

     public function createdAt()
    {
        $this->getActivity()->fecha = Carbon::now();

        return $this;
    }

    public function log()
    {
        $activity = $this->activity;

        $activity->save();

        $this->activity = null;

        return $activity;
    }



    protected function normalizeCauser($modelOrId): Model
    {
        if ($modelOrId instanceof Model) {
            return $modelOrId;
        }

        $guard = $this->auth->guard($this->authDriver);
        $provider = method_exists($guard, 'getProvider') ? $guard->getProvider() : null;
        $model = method_exists($provider, 'retrieveById') ? $provider->retrieveById($modelOrId) : null;

        if ($model instanceof Model) {
            return $model;
        }

        throw CouldNotLogActivity::couldNotDetermineUser($modelOrId);
    }


    protected function getActivity(): AuditoriaLogInterface
    {
        if (! $this->activity instanceof AuditoriaLogInterface) {
            $this->activity = AuditoriaLogProvider::getActivityModelInstance();
        }

        return $this->activity;
    }

}
