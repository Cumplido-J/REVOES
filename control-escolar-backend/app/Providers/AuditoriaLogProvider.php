<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use App\Helpers\Interfaces\AuditoriaLogInterface;
use App\Helpers\Interfaces\AuditoriaLogInterface as ActivityContract;
use App\Auditoria as AuditoriaLogModel;

class AuditoriaLogProvider extends ServiceProvider
{
    
    public static function determineActivityModel(): string
    {
        $activityModel =  AuditoriaLogModel::class;

        if (! is_a($activityModel, AuditoriaLogInterface::class, true)
            || ! is_a($activityModel, Model::class, true)) {
           /*  throw InvalidConfiguration::modelIsNotValid($activityModel); */
        }

        return $activityModel;
    }

    public static function getActivityModelInstance(): ActivityContract
    {
        $activityModelClassName = self::determineActivityModel();

        return new $activityModelClassName();
    }
}
