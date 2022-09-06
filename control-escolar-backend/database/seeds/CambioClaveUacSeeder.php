<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CambioClaveUacSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement("UPDATE uac SET `clave_uac` = '343101-13FB' WHERE (`id` = '1')");
        DB::statement("UPDATE uac SET `clave_uac` = '322201-13FB' WHERE (`id` = '2')");
        DB::statement("UPDATE uac SET `clave_uac` = '342201-13FB' WHERE (`id` = '3')");
        DB::statement("UPDATE uac SET `clave_uac` = '344101-13FB' WHERE (`id` = '4')");
        DB::statement("UPDATE uac SET `clave_uac` = '322501-13FB' WHERE (`id` = '5')");
        DB::statement("UPDATE uac SET `clave_uac` = '322301-13FB' WHERE (`id` = '6')");
        DB::statement("UPDATE uac SET `clave_uac` = '343102-13FB' WHERE (`id` = '7')");
        DB::statement("UPDATE uac SET `clave_uac` = '322202-13FB' WHERE (`id` = '8')");
        DB::statement("UPDATE uac SET `clave_uac` = '342202-13FB' WHERE (`id` = '9')");
        DB::statement("UPDATE uac SET `clave_uac` = '322302-13FB' WHERE (`id` = '10')");
        DB::statement("UPDATE uac SET `clave_uac` = '343103-13FB' WHERE (`id` = '11')");
        DB::statement("UPDATE uac SET `clave_uac` = '322203-13FB' WHERE (`id` = '12')");
        DB::statement("UPDATE uac SET `clave_uac` = '341101-13FB' WHERE (`id` = '13')");
        DB::statement("UPDATE uac SET `clave_uac` = '322502-13FB' WHERE (`id` = '14')");
        DB::statement("UPDATE uac SET `clave_uac` = '343104-13FB' WHERE (`id` = '15')");
        DB::statement("UPDATE uac SET `clave_uac` = '322204-13FB' WHERE (`id` = '16')");
        DB::statement("UPDATE uac SET `clave_uac` = '342101-13FB' WHERE (`id` = '17')");
        DB::statement("UPDATE uac SET `clave_uac` = '341201-13FB' WHERE (`id` = '18')");
        DB::statement("UPDATE uac SET `clave_uac` = '343105-13FB', `campo_disciplinar_id` = '1' WHERE (`id` = '19')");
        DB::statement("UPDATE uac SET `clave_uac` = '322205-13FB', `campo_disciplinar_id` = '5' WHERE (`id` = '20')");
        DB::statement("UPDATE uac SET `clave_uac` = '342102-13FB' WHERE (`id` = '21')");
        DB::statement("UPDATE uac SET `clave_uac` = '322503-13FB' WHERE (`id` = '22')");
        DB::statement("UPDATE uac SET `clave_uac` = '343201-13FB', `campo_disciplinar_id` = '1' WHERE (`id` = '23')");
        DB::statement("UPDATE uac SET `clave_uac` = '322504-13FB', `campo_disciplinar_id` = '4' WHERE (`id` = '26')");
        DB::statement("UPDATE uac SET `clave_uac` = '343105-13FPp' WHERE (`id` = '19')");
    }
}
