<?php
use App\CicloEscolar;
use App\Grupo;
use App\Docente;
use App\DocentePlantilla;
use App\GrupoPeriodo;
use App\TipoPlaza;
use App\Periodo;
use App\CarreraUac;
use App\Alumno;
use App\AlumnoGrupo;
use App\DocenteAsignatura;
use App\DocumentoDocente;
use App\DocumentoHasDocente;
use App\Usuario;
use App\UsuarioDocente;
use App\Plantel;
use Carbon\Carbon;
use App\CalificacionUac;
use App\ConfigEvaluacionOrdinariaParcial;
use App\PlantelCarrera;

use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        try{
          /*   DB::beginTransaction(); */
            date_default_timezone_set('America/Mazatlan'); /* zona horaria */
            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2013','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2014','07','15'),
                'nombre' => '2013-2014'
            ]);

            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2014','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2015','07','15'),
                'nombre' => '2014-2015'
            ]);

            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2015','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2016','07','15'),
                'nombre' => '2015-2016'
            ]);

            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2016','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2017','07','15'),
                'nombre' => '2016-2017'
            ]);

            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2017','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2018','07','15'),
                'nombre' => '2017-2018'
            ]);

            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2018','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2019','07','15'),
                'nombre' => '2018-2019'
            ]);

            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2019','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2020','07','15'),
                'nombre' => '2019-2020'
            ]);

            CicloEscolar::create([
                'fecha_inicio' => \Carbon\Carbon::create('2020','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2021','07','15'),
                'nombre' => '2020-2021'
            ]);

            Periodo::create([
                'nombre' => '13-14/1',
                'fecha_inicio' => \Carbon\Carbon::create('2013','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2013','12','31'),
                'ciclo_escolar_id' => 1,
                'nombre_con_mes' => 'AGOSTO 2013 - ENERO 2014'
            ]);

            Periodo::create([
                'nombre' => '13-14/2',
                'fecha_inicio' => \Carbon\Carbon::create('2014','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2014','07','15'),
                'ciclo_escolar_id' => 1,
                'nombre_con_mes' => 'FEBRERO 2014 - JULIO 2014',
            ]);

            Periodo::create([
                'nombre' => '14-15/1',
                'fecha_inicio' => \Carbon\Carbon::create('2014','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2014','12','31'),
                'ciclo_escolar_id' => 2,
                'nombre_con_mes' => 'AGOSTO 2014 - ENERO 2015'
            ]);

            Periodo::create([
                'nombre' => '14-15/2',
                'fecha_inicio' => \Carbon\Carbon::create('2015','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2015','07','15'),
                'ciclo_escolar_id' => 2,
                'nombre_con_mes' => 'FEBRERO 2015 - JULIO 2015',
            ]);

            Periodo::create([
                'nombre' => '15-16/1',
                'fecha_inicio' => \Carbon\Carbon::create('2015','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2015','12','31'),
                'ciclo_escolar_id' => 3,
                'nombre_con_mes' => 'AGOSTO 2015 - ENERO 2016'
            ]);

            Periodo::create([
                'nombre' => '15-16/2',
                'fecha_inicio' => \Carbon\Carbon::create('2016','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2016','07','15'),
                'ciclo_escolar_id' => 3,
                'nombre_con_mes' => 'FEBRERO 2016 - JULIO 2016',
            ]);

            Periodo::create([
                'nombre' => '16-17/1',
                'fecha_inicio' => \Carbon\Carbon::create('2016','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2016','12','31'),
                'ciclo_escolar_id' => 4,
                'nombre_con_mes' => 'AGOSTO 2016 - ENERO 2017'
            ]);

            Periodo::create([
                'nombre' => '16-17/2',
                'fecha_inicio' => \Carbon\Carbon::create('2017','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2017','07','15'),
                'ciclo_escolar_id' => 4,
                'nombre_con_mes' => 'FEBRERO 2017 - JULIO 2017',
            ]);

            Periodo::create([
                'nombre' => '17-18/1',
                'fecha_inicio' => \Carbon\Carbon::create('2017','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2017','12','31'),
                'ciclo_escolar_id' => 5,
                'nombre_con_mes' => 'AGOSTO 2017 - ENERO 2018'
            ]);

            Periodo::create([
                'nombre' => '17-18/2',
                'fecha_inicio' => \Carbon\Carbon::create('2018','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2018','07','15'),
                'ciclo_escolar_id' => 5,
                'nombre_con_mes' => 'FEBRERO 2018 - JULIO 2018',
            ]);

            Periodo::create([
                'nombre' => '18-19/1',
                'fecha_inicio' => \Carbon\Carbon::create('2018','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2018','12','31'),
                'ciclo_escolar_id' => 6,
                'nombre_con_mes' => 'AGOSTO 2018 - ENERO 2019'
            ]);

            Periodo::create([
                'nombre' => '18-19/2',
                'fecha_inicio' => \Carbon\Carbon::create('2019','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2019','07','15'),
                'ciclo_escolar_id' => 6,
                'nombre_con_mes' => 'FEBRERO 2019 - JULIO 2019',
            ]);

            Periodo::create([
                'nombre' => '19-20/1',
                'fecha_inicio' => \Carbon\Carbon::create('2019','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2019','12','31'),
                'ciclo_escolar_id' => 7,
                'nombre_con_mes' => 'AGOSTO 2019 - ENERO 2020'
            ]);

            Periodo::create([
                'nombre' => '19-20/2',
                'fecha_inicio' => \Carbon\Carbon::create('2020','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2020','07','15'),
                'ciclo_escolar_id' => 7,
                'nombre_con_mes' => 'FEBRERO 2020 - JULIO 2020',
            ]);

            Periodo::create([
                'nombre' => '20-21/1',
                'fecha_inicio' => \Carbon\Carbon::create('2020','07', '16'),
                'fecha_fin' => \Carbon\Carbon::create('2020','12','31'),
                'ciclo_escolar_id' => 8,
                'nombre_con_mes' => 'AGOSTO 2020 - ENERO 2021'
            ]);

            $ultimo_periodo = Periodo::create([
                'nombre' => '20-21/2',
                'fecha_inicio' => \Carbon\Carbon::create('2021','01', '01'),
                'fecha_fin' => \Carbon\Carbon::create('2021','07','15'),
                'ciclo_escolar_id' => 8,
                'nombre_con_mes' => 'FEBRERO 2021 - JULIO 2021',
            ]);

            TipoPlaza::create(
                ['nombre' => 'Interino']
            );

            TipoPlaza::create(
                ['nombre' => 'Honorarios']
            );

            TipoPlaza::create(
                ['nombre' => 'Permanente']
            );

            //Para asignar el número a los planteles de BCS
            $ids = [43,44,45,46,47,48,49,50,51,52,53, //Cecyte
                688,689,690,691,692,693,694,695,696,697,698,699,700,701]; //Emsad
            $planteles = Plantel::whereIn('id', $ids)->get();
            $numeros = ["002","003","001","004","005","006","007","008","009","010","011",
                "001","003","006","009","010","011","007","012","008","013","014","016","015","002"];

            $i = 0;

            foreach ($planteles as $plantel){
                $plantel->numero = $numeros[$i++];
                $plantel->save();
            }

            //Poner como activos a alumnos que ya existían en la bd y no han egresado
            $alumnos = DB::select('SELECT a.usuario_id FROM alumno a INNER JOIN certificado cer ON
                cer.alumno_id = a.usuario_id AND cer.tipo_certificado_id = 2');

            foreach ($alumnos as $a){
                $alumno = Alumno::find($a->usuario_id);
                $params = [
                    'estatus_inscripcion' => 'Activo'
                ];

                if($alumno->plantel_carrera_id != null) {
                    $plantelCarrera = PlantelCarrera::find($alumno->plantel_carrera_id);
                    if($plantelCarrera != null) {
                        $params['plantel_id'] = $plantelCarrera->plantel_id;
                        $params['carrera_id'] = $plantelCarrera->carrera_id;
                    }
                }
                $alumno->update($params);
            }

            /*$grupo = Grupo::create([
                'grupo' => '2C',
                'semestre' => '2',
                'turno' => 'TM',
                'plantel_carrera_id' => '1468',
            ]);

            $grupo = Grupo::create([
                'grupo' => '3C',
                'semestre' => '3',
                'turno' => 'TM',
                'plantel_carrera_id' => '1468',
            ]);*/


            /*$docente = Docente::create(
                [
                'nombre' => 'Francisco',
                'primer_apellido' => 'Avalos',
                'segundo_apellido' => 'Prado',
                'correo' => 'fjavpra@gmail.com',
                'correo_inst' => 'fjavpra@cecyte.edu.mx',
                'num_nomina' => '22345678912345678971',
                'curp' => 'AAPF970618HSLVRR06',
                'rfc' => 'AAPF970618GE7',
                'fecha_nacimiento' => \Carbon\Carbon::create('1997','01', '15'),
                'genero' => 'M',
                'direccion' => 'candelaria',
                'cp' => '23050',
                'telefono' => '6121570206',
                'fecha_ingreso' => \Carbon\Carbon::create('2020','07','15'),
                'tipo_sangre' => 'O+',
                'docente_estatus' => 1,
                'cat_municipio_nacimiento_id' => '19',
                'cat_municipio_direccion_id' => '19',
                'cedula' => '123456789456458787858789654887',
                'fecha_egreso' => \Carbon\Carbon::create('2020','05','15'),
                'maximo_grado_estudio' => 'Licenciatura'
                ]
            );*/
             /* documentacion has docente */
            /*DocumentoHasDocente::create([
                'documentos_docente_id' => 1,
                'docente_id' => $docente->id
            ]);
            /* creación de usaurio */
            /*$usuario = Usuario::create([
                'fecha_insert' => Carbon::now(),
                'username' => $docente->curp,
                'nombre' => $docente->nombre,
                'primer_apellido' => $docente->primer_apellido,
                'segundo_apellido' => $docente->segundo_apellido,
                'email' => $docente->email,
                'password' => bcrypt(123)
            ]);
            $usuario_docente = UsuarioDocente::create([
                'usuario_id' => $usuario->id,
                'docente_id' => $docente->id
            ]);

            $docente_plantilla = DocentePlantilla::create(
                [
                'fecha_asignacion' => \Carbon\Carbon::create('2020','07', '15'),
                'fecha_inicio_contrato' => \Carbon\Carbon::create('2020','07', '15'),
                'horas' => '20',
                'docente_id' => $docente->id,
                'cat_tipo_Plaza_id' => 1,
                'plantel_id' => 46
            ]);
            /* grupo periodo */
            /*$grupo = Grupo::create([
                'grupo' => '2B',
                'semestre' => '2',
                'turno' => 'TM',
                'plantel_carrera_id' => '1468',
            ]);

            $grupo_periodo = GrupoPeriodo::create([
                'grupo' => $grupo->grupo,
                'semestre' => $grupo->semestre,
                'turno' => $grupo->turno,
                'max_alumnos' => 50,
                'periodo_id' => $ultimo_periodo->id,
                'grupo_id' => $grupo->id,
                'plantel_carrera_id' => $grupo->plantel_carrera_id,
                'status' => 'activo',
            ]);

            /* TODO: falta asignar grupos_periodos */
            /*DocenteAsignatura::create(
                [
                    'grupo_periodo_id' => $grupo_periodo->id,
                    'plantilla_docente_id' => $docente_plantilla->id,
                    'carrera_uac_id' => 1951,
                    'plantel_id' => 46,
                    'periodo_id' => 16,
                    'estatus' => 1
                ]
            );

            /* alumno grupo */
            /*AlumnoGrupo::create([
                'alumno_id' => 205808,
                'grupo_periodo_id' => 1,
                'status' => 'Inscrito'
            ]);
             /* alumno grupo */
            /*AlumnoGrupo::create([
                'alumno_id' => 205832,
                'grupo_periodo_id' => 1,
                'status' => 'Inscrito'
            ]);

            //calificaciones alumno
            CalificacionUac::create([
                'alumno_id' => 205808,
                'carrera_uac_id' => 1951,
                'grupo_periodo_id' => 1,
                'periodo_id' => 16,
                'plantel_id' => 46,
                'calificacion' => 8.8,
                'docente_id' => 1,
                'parcial' => 1
            ]);

            CalificacionUac::create([
                'alumno_id' => 205832,
                'carrera_uac_id' => 1951,
                'grupo_periodo_id' => 1,
                'periodo_id' => 16,
                'plantel_id' => 46,
                'calificacion' => 8.8,
                'docente_id' => 1,
                'parcial' => 1
            ]);

            ConfigEvaluacionOrdinariaParcial::create([
                'parcial' => '1',
                'fecha_inicio' => '2021-02-20',
                'fecha_final' => '2021-03-20',
                'plantel_id' => 46,
                'periodo_id' => 16,
                'estatus' => 1
            ]);*/

            //Grupo
            /*$grupo = Grupo::create([
                'grupo' => '1A',
                'semestre' => '1',
                'turno' => 'TV',
                'plantel_carrera_id' => '1455',
            ]);

            //id 2
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

            $grupo = Grupo::create([
                'grupo' => '3A',
                'semestre' => '3',
                'turno' => 'TV',
                'plantel_carrera_id' => '1455',
            ]);

            //id 3
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

            $grupo = Grupo::create([
                'grupo' => '5A',
                'semestre' => '5',
                'turno' => 'TV',
                'plantel_carrera_id' => '1455',
            ]);

            //id 4
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

        /* DB::commit(); */
        }catch(\Exception $e){
            /*  DB::rollBack(); */
            var_dump($e->getMessage());
        }
    }
}
