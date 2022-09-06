<?php

use Illuminate\Database\Seeder;
use App\Alumno;
use App\Carrera;
use App\Grupo;
use App\GrupoPeriodo;
use App\Plantel;
use App\PlantelCarrera;
use App\CarreraUac;
use App\UAC;
use App\Periodo;
use App\Docente;
use App\DocentePlantilla;
use App\DocenteAsignatura;
use Illuminate\Support\Facades\DB;

class DocenteAsignaturaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $files = File::allFiles('database/json/docentes-asignaturas/primera-carga');
        $error = false;

        DB::beginTransaction();
        foreach ($files as $file) {
            $conjuntoAsignaturas = collect();
            var_dump("Archivo: {$file}");
            $data = json_decode(file_get_contents($file));

            $plantel = Plantel::where('cct', $data[0]->{'CLAVE PLANTEL (CCT)'})->first();
            if($plantel == null) {
                var_dump('No existe el plantel - '.$data[0]->{'CLAVE PLANTEL (CCT)'});
                $error = true;
                break;
            }

            $claveAnterior = '';
            $periodoAnterior = null;

            $grupoPeriodo = null;

            $carrera = Carrera::where('clave_carrera', $data[0]->{'CLAVE CARRERA'})->first();
            if($carrera == null){
                var_dump('No existe la carrera - '.$data[0]->{'CLAVE CARRERA'});
                $error = true;
                break;
            }

            $grupoPeriodo = $this->grupoPeriodo($data[0], $plantel, $carrera);
            if($grupoPeriodo == null) {
                var_dump('Algo salió mal.');
                $error = true;
                break;
            }

            //var_dump('Asignando docentes a grupo '.$grupoPeriodo->grupo.' - semestre: '.$grupoPeriodo->semestre
            //.' - turno: '.$grupoPeriodo->turno);

            try {
                //Guardar cada calificación
                foreach ($data as $d) {

                    //Buscar la asignatura en la colección de asignaturas
                    $uac = $conjuntoAsignaturas->where('clave_uac', $d->{'CLAVE ASIGNATURA'})->first();
                    //Si no se ha obtenido, obtenerlo o añadirlo al arreglo de asignaturas que no están registradas.
                    if($uac == null) {
                        //var_dump('Nueva asignatura: '.$d->ASIGNATURA);
                        $uac = UAC::where('clave_uac', $d->{'CLAVE ASIGNATURA'})->first();
                        if($uac != null) {
                            $conjuntoAsignaturas->push($uac);
                        }else{
                            var_dump('No existe la asignatura - '.$d->{'CLAVE ASIGNATURA'}.' - '.$d->ASIGNATURA);
                            $error = true;
                            break;
                        }
                    }else{
                        var_dump('Se les ha asignado un docente a las asignaturas.');
                        break;
                    }

                    $carreraUac = CarreraUac::where('carrera_id', $carrera->id)
                        ->where('uac_id', $uac->id)
                        ->first();

                    if($carreraUac == null){
                        var_dump('No hay relación entre la carrera '.$carrera->nombre.' y la uac '.$uac->nombre);
                        $error = true;
                        break;
                    }else{
                        $conjuntoAsignaturas->push($carreraUac);
                    }

                    if($d->{'CURP DOCENTE'} == null) {
                        var_dump('La asignatura ' . $d->{'CLAVE ASIGNATURA'} . ' no tiene un docente asignado.');
                        continue;
                    }

                    $docente = Docente::where('curp', $d->{'CURP DOCENTE'})->first();
                    if($docente == null) {
                        var_dump('El docente no existe - '.$d->{'CURP DOCENTE'});
//                        $error = true;
                        continue;
                    }

                    $docenteId = ($docente != null) ? $docente->id : null;

                    if($docenteId != null)
                        $this->docenteAsignatura($docenteId, $carreraUac, $grupoPeriodo, $plantel, $d->{'CURP DOCENTE'});

                    //var_dump('Se asignó el docente '.$d->{'CURP DOCENTE'}.' a la asignatura '.$d->{'CLAVE ASIGNATURA'});
                }
            }catch(Exception $e){
                DB::rollBack();
                var_dump($e->getMessage());
                var_dump($e->getLine());
                break;
            }

            if($error)
                break;
        }
        if(!$error)
            DB::commit();
        else {
            var_dump('HA OCURRIDO UN ERROR, SE HA HECHO ROLLBACK');
            DB::rollBack();
        }

    }

    public function grupoPeriodo($datos, $plantel, $carrera){

        $plantelCarrera = PlantelCarrera::where('plantel_id', $plantel->id)->where('carrera_id', $carrera->id)->first();
        if($plantelCarrera == null) {
            var_dump('No existe el plantelCarrera');
            return null;
        }

        $turno = $datos->TURNO;
        if(Str::upper($datos->TURNO) == 'MATUTINO'){
            $turno = 'TM';
        }else if(Str::upper($datos->TURNO) == 'VESPERTINO'){
            $turno = 'TV';
        }else if($datos->TURNO != 'TM' && $datos->TURNO != 'TV'){
            var_dump('El turno está mal escrito. - '.$datos->TURNO);
            return null;
        }

        try {
            $check_periodo = $datos->{'PERIODO(ejemplo=Agosto 2018 - Enero 2019)'};
        } catch (\Throwable $th) {
            $check_periodo = $datos->{'PERIODO'};
        }

        $periodo = Periodo::where('nombre_con_mes', $check_periodo)->first();
        if($periodo == null) {
            var_dump('No se encontró el periodo. -'.$check_periodo);
            return null;
        }

        $grupoPeriodo = GrupoPeriodo::where([
            'plantel_carrera_id' => $plantelCarrera->id,
            'grupo' => $datos->GRUPO,
            'turno' => $turno,
            'semestre' => $datos->SEMESTRE,
            'periodo_id' => $periodo->id,
            'status' => 'activo'
        ])->first();

        if($grupoPeriodo == null) {
            var_dump("No existe el grupo {$datos->GRUPO} - {$datos->SEMESTRE} - {$datos->TURNO} -
            {$datos->{'CARRERA NOMBRE'}} - {$datos->{'CLAVE CARRERA'}}");
            var_dump("{$plantelCarrera->id}-{$datos->GRUPO}-{$turno}-{$datos->SEMESTRE}-{$periodo->id}");
        }

        return $grupoPeriodo;

    }

    private function docenteAsignatura($docente, $carreraUac, $grupoPeriodo, $plantel, $curp){
        $periodo = Periodo::find($grupoPeriodo->periodo_id);

        $plantilla = DocentePlantilla::where('docente_id', $docente)
            ->where('plantel_id', $plantel->id)
            ->where('fecha_fin_contrato', null)
            ->first();

        if($plantilla == null){
            $plantilla = DocentePlantilla::where('docente_id', $docente)
            ->where('plantel_id', $plantel->id)
            ->where('fecha_fin_contrato', '>=', $periodo->fecha_fin)
            ->first();
        }

        if($plantilla != null) {
            $existe = DocenteAsignatura::where([
                'carrera_uac_id' => $carreraUac->id,
                'grupo_periodo_id' => $grupoPeriodo->id,
                'periodo_id' => $grupoPeriodo->periodo_id,
                'plantel_id' => $plantel->id,
                'plantilla_docente_id' => $plantilla->id
            ])->first();

            if($existe == null) {
                DocenteAsignatura::create([
                    'carrera_uac_id' => $carreraUac->id,
                    'grupo_periodo_id' => $grupoPeriodo->id,
                    'periodo_id' => $grupoPeriodo->periodo_id,
                    'plantel_id' => $plantel->id,
                    'plantilla_docente_id' => $plantilla->id
                ]);
            }else{
                var_dump('El docente ya estaba asignado a la materia.');
            }
        }else{
            var_dump('El docente no está asignado al plantel '.$curp);
        }
    }
}
