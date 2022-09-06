<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        if(App::Environment() === 'production') {
            
        } else if(App::Environment() === 'local') {
            //----------NO EJECUTAR EN PRODUCCIÓN! SÓLO DEV -----------
            $this->call(DataSeeder::class);
            $this->call(PermissionsSeeder::class);
            $this->call(UserSeeder::class);
            $this->call(PlantelCarreraSeeder::class);
            $this->call(InformacionPlantelSeeder::class);
            $this->call(CarreraUacSeeder::class);
            $this->call(SubmoduloSeeder::class);
            $this->call(CarreraBCSSeeder::class);

            //16 de marzo
            $this->call(CambioUacEmsad::class);
            $this->call(RolesTemporales::class);
            //17 de marzo
            $this->call(PermisoAgregarAlumnos::class);
            //24 de marzo
            $this->call(PermisosAsignaturasBitacora::class);
            //29 de marzo
            $this->call(CambioClaveUacSeeder::class);
            //08 de abril
            $this->call(DocenteAsignacionSeeder::class);
            $this->call(AlumnoSeeder::class);
            //12 de abril
            $this->call(UsuarioControlEscolarSeeder::class);
            $this->call(DocenteAsignaturaSeeder::class);
            //16 de abril
            $this->call(ContrasenaAlumnoBCSSeeder::class);
            //22 abril
            $this->call(PermisosCargaCalificacion::class);
            //27 abril actualizacion c05
            $this->call(DocenteAsignacionSeeder::class);
            //21 de mayo
            $this->call(CorreccionCalificacionesDuplicadas::class);

            //21 de mayo
            $this->call(CorreccionCalificacionesDuplicadas::class);
            //28 de junio
            $this->call(PermisosRecursamientoIntersemestralSeeder::class);
            //A partir de aquí no se ha ejecutado en producción.
            //EN PROCESO
            $this->call(CalificacionesSeeder::class);
        }
    }
}
