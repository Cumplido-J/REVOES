<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class FechasEvaluacionServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        require_once app_path() . '/Helpers/HelperFechasEvaluacion.php';
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
