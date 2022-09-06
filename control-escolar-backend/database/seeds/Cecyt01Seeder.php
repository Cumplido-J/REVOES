<?php

use App\Alumno;
use App\Plantel;
use App\PlantelCarrera;
use App\Carrera;
use App\CarreraUac;
use App\UAC;
use App\Periodo;
use App\Grupo;
use App\GrupoPeriodo;
use App\CalificacionUac;
use App\Usuario;
use App\AlumnoGrupo;
use Carbon\Carbon;

use Illuminate\Database\Seeder;

class Cecyt01Seeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $files = File::allFiles('database/json/cecyt016B');
        $cont = 1;
        foreach ($files as $file){
//            if($cont < 12){
//                $cont++;
//                continue;
//            }
            //Obtener los datos básicos para crear los grupos, activar en periodo y saber a qué carrera pertenece
            $nombreArchivo = explode('_', $file->getFilenameWithoutExtension());
            $plantel = Plantel::where('cct', $nombreArchivo[2])->first();
            if($plantel == null) {
                var_dump('No existe el plantel');
                continue;
            }

            $carrera = Carrera::where('clave_carrera', $nombreArchivo[3])->first();
            if($carrera == null) {
                var_dump('No existe la carrera');
                continue;
            }

            $plantelCarrera = PlantelCarrera::where('carrera_id', $carrera->id)->where('plantel_id', $plantel->id)->first();
            if($plantelCarrera == null) {
                var_dump('No existe la asociación entre el plantel y la carrera');
                continue;
            }

            $periodo = Periodo::where('nombre_con_mes', $nombreArchivo[4])->first();
            if($periodo == null) {
                var_dump('No existe el periodo');
                continue;
            }

            $parcial = substr($nombreArchivo[5], -1, 1);
            $semestre = substr($nombreArchivo[0], 0, 1);

            $grupo = Grupo::where('grupo', $nombreArchivo[0])
                ->where('plantel_carrera_id', $plantelCarrera->id)
                ->where('turno', $nombreArchivo[1])
                ->where('semestre', $semestre)
                ->first();

            if($grupo == null){
                //var_dump('Se crea un grupo');
                try{
                    $grupo = Grupo::create([
                        'plantel_carrera_id' => $plantelCarrera->id,
                        'grupo' => $nombreArchivo[0],
                        'semestre' => $semestre,
                        'turno' => $nombreArchivo[1],
                        'status' => 'activo'
                    ]);
                }catch(\Illuminate\Database\QueryException $e){
                    var_dump('Error al crear el grupo'.$nombreArchivo[0]);
                    continue;
                }
            }

            $grupoPeriodo = GrupoPeriodo::where('grupo', $nombreArchivo[0])
                ->where('periodo_id', $periodo->id)
                ->where('plantel_carrera_id', $plantelCarrera->id)
                ->where('grupo_id', $grupo->id)
                ->where('turno', $nombreArchivo[1])
                ->where('semestre', $semestre)
                ->first();

            if($grupoPeriodo == null) {
                //var_dump('Grupo no activo, se activa '.$nombreArchivo[0]);
                try{
                    $grupoPeriodo = GrupoPeriodo::create([
                        'plantel_carrera_id' => $plantelCarrera->id,
                        'grupo' => $nombreArchivo[0],
                        'grupo_id' => $grupo->id,
                        'semestre' => $semestre,
                        'turno' => $nombreArchivo[1],
                        'status' => 'activo',
                        'max_alumnos' => 25,
                        'periodo_id' => $periodo->id
                    ]);
                }catch(\Illuminate\Database\QueryException $e){
                    var_dump('Error al activar el grupo'.$nombreArchivo[0]. $e->getMessage());
                    continue;
                }
            }

            $data = json_decode(file_get_contents($file));

            //Obtener las carreraUac de cada columna
            $keys = array_keys((array)$data[0]);
            array_splice($keys,0,2);

            $carreraUacs = [];

//            var_dump('Obteniendo carreraUacs');
            foreach ($keys as $uac){

                $uac = UAC::where('clave_uac', $uac)->first();
                if($uac == null){
                    var_dump('La uac no existe '.$uac);
                    continue;
                }

                $carreraUac = CarreraUac::where('uac_id', $uac->id)->where('carrera_id', $carrera->id)->first();
                if($carreraUac == null) {
                    var_dump('No hay asociación entre carrera y uac '.$uac.' - '.$carrera->nombre);
                    continue;
                }

                array_push($carreraUacs, $carreraUac->id);
            }

            var_dump('Guardando datos del archivo '.$file->getFilenameWithoutExtension());
            //Se recorre cada fila para guardar las calificaciones de cada materia en el parcial actual
            foreach ($data as $d){
                $alumno = Alumno::with('usuario')->where('matricula', $d->MATRICULA)->first();

                if($alumno == null){
                    try {
                        $alumno = $this->crearAlumno($plantel, $carrera, $d->ALUMNO, $d->MATRICULA);
                    }catch(\Illuminate\Database\QueryException $e){
                        var_dump($e->getMessage());
                        continue;
                    }
                }

                //Checar si el alumno está en el grupo
                $alumnoGrupo = AlumnoGrupo::where('alumno_id', $alumno->usuario_id)
                    ->where('grupo_periodo_id', $grupoPeriodo->id)
                    ->first();

                if($alumnoGrupo == null){
//                    var_dump('Se inscribe alumno a grupo');
                    AlumnoGrupo::create([
                       'alumno_id' => $alumno->usuario_id,
                       'grupo_periodo_id' => $grupoPeriodo->id,
                       'status' => 'Inscrito'
                    ]);

                    $alumno->update([
                        'semestre' => $grupoPeriodo->semestre
                    ]);
                }

//                var_dump('Asignar calificaciones');
                foreach ($keys as $num => $uac){

                    $calificacion = ($d->{$uac} == 'NP' || $d->{$uac} == 'NA') ? 0 : $d->{$uac};

                    $calif = CalificacionUac::create([
                        'alumno_id' => $alumno->usuario_id,
                        'carrera_uac_id' => $carreraUacs[$num],
                        'grupo_periodo_id' => $grupoPeriodo->id,
                        'calificacion' => $calificacion,
                        'periodo_id' => $periodo->id,
                        'plantel_id' => $plantel->id,
                        'parcial' => $parcial
                    ]);

                }

                $uacs = CarreraUac::whereHas('calificaciones', function($query) use ($alumno, $grupoPeriodo){
                    $query->where('alumno_id', $alumno->usuario_id)
                        ->where('parcial', '<', 4)
                        ->where('grupo_periodo_id', $grupoPeriodo->id);
                })
                ->with(['calificaciones' => function($query) use ($alumno, $grupoPeriodo){
                    $query->where('alumno_id', $alumno->usuario_id)
                        ->where('parcial', '<', 4)
                        ->where('grupo_periodo_id', $grupoPeriodo->id);
                }, 'uac'])->whereIn('id', $carreraUacs)->get();

//                var_dump('Calificacion final');
                foreach ($uacs as $uac) {
                    //var_dump($uac->calificaciones->avg('calificacion'));
                    if (count($uac->calificaciones) >= 3){
                        CalificacionUac::create([
                            'alumno_id' => $alumno->usuario_id,
                            'carrera_uac_id' => $uac->id,
                            'grupo_periodo_id' => $grupoPeriodo->id,
                            'calificacion' => round($uac->calificaciones->avg('calificacion'), 1, PHP_ROUND_HALF_UP),
                            'periodo_id' => $periodo->id,
                            'plantel_id' => $plantel->id,
                            'parcial' => 4
                        ]);
                    }
                }
            }
            $cont++;
        }
    }


    private function crearAlumno($plantel, $carrera, $nombre, $matricula){

        //var_dump('Creando alumno');

        $primerApellido = explode(' ', $nombre)[0];
        $segundoApellido = explode(' ', $nombre)[1];
        $nombres = substr($nombre, strlen($primerApellido.' '.$segundoApellido.' '));

        $usuario = Usuario::create([
            'fecha_insert' => Carbon::now(),
            'username' => substr($primerApellido,0,2)
                .substr($segundoApellido, 0, 1)
                .substr($nombres, 0, 1).Str::random(12),
            'password' => bcrypt('secret'),
            'nombre' => ucwords(Str::lower($nombres)),
            'primer_apellido' => ucwords(Str::lower($primerApellido)),
            'segundo_apellido' => ucwords(Str::lower($segundoApellido)),
            'email' => Str::lower($primerApellido.substr($nombres, 0, 1).'@cecytebcs.edu.mx')
        ]);

        $usuario->assignRole('ROLE_ALUMNO');

        $alumno = Alumno::create([
            'usuario_id' => $usuario->id,
            'semestre' => 1,
            'matricula' => $matricula,
            'plantel_id' => $plantel->id,
            'carrera_id' => $carrera->id,
            'cambio_carrera' => 0,
            'estatus' => 'Documentos completos',
            'tipo_alumno' => 'Regular',
            'tipo_trayectoria' => 'Regular',
            'estatus_inscripcion' => 'Activo',
            'permitir_inscripcion' => 'Permitir'
        ]);

        $alumno = Alumno::find($usuario->id);

        return $alumno;

    }
}
