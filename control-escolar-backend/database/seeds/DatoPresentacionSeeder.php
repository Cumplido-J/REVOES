<?php

use Illuminate\Database\Seeder;
use App\Usuario;
use App\Grupo;
use App\GrupoPeriodo;

class DatoPresentacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $controlEscolar = Usuario::create([
            'username' => 'LARB940829MJCRBR05',
            'nombre' => 'Control Escolar',
            'primer_apellido' => 'Baja California Sur',
            'password' => bcrypt('holis'),
            'email' => 'controlescolarbcs@cecytebcs.edu.mx',
            'fecha_insert' => \Carbon\Carbon::now()
        ]);

        $controlEscolar->assignRole('ROLE_CONTROL_ESCOLAR_PLANTEL');

        DB::table('usuario_alcance')->insert([
            'usuario_id' => $controlEscolar->id,
            'estado_id' => null,
            'plantel_id' => 45
        ]);

        DB::table('usuario_rol')->insert([
           'usuario_id' => $controlEscolar->id,
            'rol_id' => 5
        ]);

        Grupo::create([
            'grupo' => '2A',
            'semestre' => 2,
            'turno' => 'TM',
            'plantel_carrera_id' => 1460,
            'status' => 'pendiente',
            'accion' => 'crear'
        ]);

        GrupoPeriodo::create([
            'grupo' => '4B',
            'semestre' => 4,
            'turno' => 'TM',
            'plantel_carrera_id' => 1460,
            'periodo_id' => 16,
            'status' => 'pendiente',
            'accion' => 'activar',
            'grupo_id' => 12,
            'max_alumnos' => 40
        ]);

        Grupo::create([
            'grupo' => '6B',
            'semestre' => 6,
            'turno' => 'TM',
            'plantel_carrera_id' => 1460,
            'status' => 'activo'
        ]);

        Grupo::create([
            'grupo' => '2B',
            'semestre' => 2,
            'turno' => 'TM',
            'plantel_carrera_id' => 1455,
            'status' => 'activo'
        ]);

        Grupo::create([
            'grupo' => '4B',
            'semestre' => 4,
            'turno' => 'TM',
            'plantel_carrera_id' => 1455,
            'status' => 'activo'
        ]);

        Grupo::create([
            'grupo' => '6B',
            'semestre' => 6,
            'turno' => 'TM',
            'plantel_carrera_id' => 1455,
            'status' => 'activo'
        ]);

    }
}
