<?php

use Illuminate\Database\Seeder;
use App\Usuario;
use App\Grupo;
use App\GrupoPeriodo;
use App\Alumno;
use App\CalificacionUac;
use Carbon\Carbon;

class CalificacionesPruebaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //Usuario y alumno para la prueba con calificaciones
        $usuario = Usuario::create([
            'fecha_insert' => Carbon::now(),
            'username' => 'CAHM040607HBSSRRA3',
            'password' => bcrypt('secret'),
            'nombre' => 'Martin Tadeo',
            'primer_apellido' => 'Castillo',
            'segundo_apellido' => 'Hernandez',
            'email' => 'tadeocastillohernandez@gmail.com'
        ]);

        $usuario->assignRole('ROLE_ALUMNO');

        $alumno = Alumno::create([
            'usuario_id' => $usuario->id,
            'numero_contacto' => '',
            'numero_movil' => '',
            'direccion' => 'San José del Cabo, BCS',
            'codigo_postal' => '23400',
            'semestre' => 4,
            'matricula' => '19403070040737',
            'plantel_id' => 46,
            'carrera_id' => 8,
            'cambio_carrera' => 0,
            'estatus' => 'Documentos completos',
            'tipo_alumno' => 'Regular',
            'tipo_trayectoria' => 'Regular',
            'permitir_inscripcion' => 'Permitir',
            'estatus_inscripcion' => 'Activo'
        ]);

        //3ro
        $grupo = Grupo::create([
            'grupo' => '3B',
            'semestre' => '3',
            'turno' => 'TM',
            'plantel_carrera_id' => '2317',
        ]);

        //Id 5
        $grupo_periodo = GrupoPeriodo::create([
            'grupo' => $grupo->grupo,
            'semestre' => $grupo->semestre,
            'turno' => $grupo->turno,
            'max_alumnos' => 25,
            'periodo_id' => 15,
            'grupo_id' => $grupo->id,
            'plantel_carrera_id' => $grupo->plantel_carrera_id,
            'status' => 'activo',
        ]);

        $grupo_periodo->alumnos()->attach($usuario->id, ['status' => 'Inscrito']);

        //Grupo
        $grupo = Grupo::create([
            'grupo' => '4B',
            'semestre' => '4',
            'turno' => 'TM',
            'plantel_carrera_id' => '2317',
        ]);

        //Id 6
        $grupo_periodo = GrupoPeriodo::create([
            'grupo' => $grupo->grupo,
            'semestre' => $grupo->semestre,
            'turno' => $grupo->turno,
            'max_alumnos' => 25,
            'periodo_id' => 16,
            'grupo_id' => $grupo->id,
            'plantel_carrera_id' => $grupo->plantel_carrera_id,
            'status' => 'activo',
        ]);

        $grupo_periodo->alumnos()->attach($usuario->id, ['status' => 'Inscrito']);

        $periodo = 13;
        $uacs = [3386, 3387, 3388, 3389, 3390, 3385, 3391, 3392, 3393, 3394, 4232,
            4231, 4143];
        $calificaciones = [10, 8, 9, 10, 9, 9, 9.7, 9.5, 9, 9.7, 9.2, 9.2, 9.2];
        $periodos = [5, 12];

        //Calificaciones para alumno de cecyte
        $x = 0;

        foreach ($uacs as $uac){
            for($i = 1; $i < 5; $i++) {
                CalificacionUac::create([
                    'alumno_id' => $usuario->id, //Cambiar por $usuario->id
                    'carrera_uac_id' => $uac,
                    'periodo_id' => $periodo,
                    'plantel_id' => 46,
                    'calificacion' => $calificaciones[$x],
                    'parcial' => $i,
                ]);
            }
            if($x == $periodos[0] || $x == $periodos[1])
                $periodo++;
            $x++;
        }

        $uacsTercero = [4234, 4233, 4144, 3398, 3397, 3396, 3395];
        $calificaciones = [6, 8.8, 8, 7.6, 8, 10, 10, 9.3, 7.2, 9.5, 9.2, 8.6, 6.5, 9, 9,
            8.2, 8.2, 5, 9, 7.4, 8.2, 7.8, 7.1, 7.7, 10, 10, 10, 10];

        $x = 0;
        foreach ($uacsTercero as $uac){
            for($i = 1; $i < 5; $i++){
                CalificacionUac::create([
                    'alumno_id' => $usuario->id, //Cambiar por $usuario->id
                    'carrera_uac_id' => $uac,
                    'periodo_id' => 15,
                    'plantel_id' => 46,
                    'calificacion' => $calificaciones[$x++],
                    'grupo_periodo_id' => 2,
                    'parcial' => $i,
                ]);
            }
        }
    }
}
