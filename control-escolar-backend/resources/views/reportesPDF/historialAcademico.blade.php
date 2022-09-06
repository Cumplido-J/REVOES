<!DOCTYPE html>
<html>
<head>
    <title>Historial Académico</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/historial-academico.css'}}" media="all">
    <style>
        @font-face {
            font-family: "Arial";
            src: url({{public_path().'/assets/fonts/orion/ORION.TTF'}});
        }
        @font-face {
            font-family: "Arial";
            src: url({{public_path().'/assets/fonts/orion/ORIOND.TTF'}});
            font-weight: bold;
        }
        body {
            font-family: "Arial", sans-serif;
        }
    </style>
</head>
<body>
    @foreach($alumnos as $alumno)
    <div class="header">
        <div class="logo">
            @if(file_exists(public_path('/assets/logos-estados/'.$datosGenerales['abreviatura_estado'].'.png')))
                <img src="{{public_path('/assets/logos-estados/'.$datosGenerales['abreviatura_estado'].'.png')}}">
            @else
                <img src="{{public_path('/assets/logos-estados/logo-cecyte.png')}}">
            @endif
        </div>
        <div class="titulo-boleta">
            <h1>COORDINACIÓN DE ORGANISMOS DESCENTRALIZADOS ESTATALES DE CECYTEs</h1>
            <h1>COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE <br>{{$datosGenerales['estado']}}</h1>
            <h1>CCT {{$datosGenerales['cct']}} {{$datosGenerales["plantel"]}}</h1>
            <h1>HISTORIAL ACADÉMICO DEL ALUMNO</h1>
        </div>
        <div class="logo-right">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>
    </div>
    <div class="datos-boleta">
        <div class="datos-div-izq">
            <ol class="datos">
                <li><b>Alumno: </b>{{ $alumno->datosAlumno['alumno'] }}</li>
                <li><b>CURP: </b>{{ $alumno->datosAlumno['curp'] }}</li>
                <li>
                    @if($datosGenerales['tipo_plantel'] == 18)
                        <b>Bachillerato Tecnológico: </b>
                    @else
                        <b>Bachillerato General: </b>
                    @endif
                    {{ $datosGenerales['carrera'] }}
                </li>
                <li><b>Clave: </b>{{ $datosGenerales['clave_carrera'] }}</li>
            </ol>
        </div>
        <div class="datos-div-der">
            <ol class="datos-der">
                <li><b>Matrícula:  </b>{{ $alumno->datosAlumno['matricula'] }}</li>
                <li><b>Generación: </b>{{ $alumno->datosAlumno['generacion'] }}</li>
                <li><b>Semestre: </b>{{ $datosGenerales['semestre'] }}</li>
                @if($datosGenerales['grupo'] != null)
                    <li><b>Actualmente en grupo: </b> {{$datosGenerales['grupo']}}</li>
                @endif
            </ol>
        </div>
    </div>
    <br>
    <div>
    @if($alumno->calificacionesTransito != null && count($alumno->calificacionesTransito['calificaciones']) > 0)
        <table class="tabla-califi">
            <thead>
            <tr>
                <th>Clave</th>
                <th>PORTABILIDAD</th>
                <th>Créditos</th>
                <th>Calificación</th>
            </tr>
            </thead>
            <tbody>
            @foreach($alumno->calificacionesTransito['calificaciones'] as $periodo)
                @foreach($periodo as $calificacion)
                    <tr>
                        <td class="clave">{{$calificacion['tipo_asignatura']}}</td>
                        <td class="texto-izq nombre">
                            CCT: {{$calificacion['cct']}}
                        </td>
                        @if($calificacion['calificacion'] >= 6)
                            <td class="creditos">{{$calificacion['creditos']}}</td>
                        @else
                            <td class="creditos">***</td>
                        @endif
                        <td class="calificacion">{{$calificacion['calificacion']}}</td>
                    </tr>
                @endforeach
            @endforeach
            </tbody>
        </table>
        @endif
        @foreach($alumno->calificaciones as $semestre)
            <table class="tabla-califi">
                <thead>
                    <tr>
                        <th>Clave</th>
                        <th>{{$alumno->periodos[$loop->iteration-1]['nombre_con_mes']}}</th>
                        <th>Créditos</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    @php $periodoIteracion = $alumno->periodos[$loop->iteration-1]['id'] @endphp
                    @foreach($semestre as $uac)
                        <tr>
                            <td class="clave">{{$uac->uac->clave_uac}}</td>
                            <td class="texto-izq nombre">
                                @if($uac->uac->tipo_uac_id == 4)
                                    {{$uac->uac->nombre_modulo}}
                                @endif
                                {{$uac->uac->nombre}}
                            </td>
                            @if(count($uac->calificaciones) > 0 && $uac->calificaciones[0]->parcial > 3)
                                @if($uac->calificaciones[0]->calificacion >= 6)
                                    <td class="creditos">{{$uac->calificaciones[0]->carreraUac->uac->creditos}}</td>
                                @else
                                    <td class="creditos">***</td>
                                @endif
                            @else
                                <td class="creditos">-</td>
                            @endif
                            @if(count($uac->calificaciones) > 0 && $uac->calificaciones[0]->parcial > 3)
                                <td class="calificacion">
                                    @if($uac->calificaciones[0]->calificacion < 10)
                                        {{number_format($uac->calificaciones[0]->calificacion, 1)}}
                                    @else
                                        {{$uac->calificaciones[0]->calificacion}}
                                    @endif
                                    @if(count($uac->calificaciones) > 1 && $uac->calificaciones[0]->parcial == 4)
                                        {{' RS'}}
                                    @elseif($uac->calificaciones[0]->parcial == 5)
                                        {{' EXT'}}
                                    @elseif($uac->calificaciones[0]->parcial == 6)
                                        {{'CI'}}
                                    @endif
                                </td>
                            @else
                                <td class="calificacion">-</td>
                            @endif
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endforeach
{{--        En caso de que el alumno no tenga calificaciones asignadas más que de tránsito/revalidación --}}
        @if(count($alumno->calificaciones) == 0 && $alumno->calificacionesTransito != null)
            @php($keys = array_keys($alumno->calificacionesTransito['calificaciones']))
            <table class="tabla-califi">
                <thead>
                    <tr>
                        <th>Clave</th>
                        <th>Plantel</th>
                        <th>Periodo</th>
                        <th>Créditos</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($alumno->calificacionesTransito['calificaciones'] as $calificacion)
                    <tr>
                        <td>PORTABILIDAD</td>
                        <td>
                            @foreach($alumno->calificacionesTransito['planteles'][$keys[$loop->iteration-1]] as $plantel)
                                {{$plantel}} ,
                            @endforeach
                        </td>
                        <td>{{$periodos->where('id', $calificacion[0]['periodo_id'])->first()->nombre_con_mes}}</td>
                        @if($alumno->calificacionesTransito['promedios'][$keys[$loop->iteration-1]] >= 6)
                                <td>{{$alumno->calificacionesTransito['creditos'][$keys[$loop->iteration-1]]}}</td>
                            @else
                                <td>***</td>
                            @endif
                            @if(number_format($alumno->calificacionesTransito['promedios'][$keys[$loop->iteration-1]] < 10))
                                <td>{{number_format($alumno->calificacionesTransito['promedios'][$keys[$loop->iteration-1]], 1)}}</td>
                            @else
                                <td>10</td>
                            @endif
                        </tr>
                    @endforeach
                </tbody>
        @endif
{{--        Para las materias que está cursando actualmente el alumno   --}}
        @if($alumno->materiasActuales != null)
            <table class="tabla-califi">
                <thead>
                    <tr>
                        <th>Clave</th>
                        <th>{{$periodoActual}}</th>
                        <th>Créditos</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($alumno->materiasActuales as $uac)
                        <tr>
                            <td class="clave">{{$uac->uac->clave_uac}}</td>
                            <td class="texto-izq nombre">
                                @if($uac->uac->tipo_uac_id == 4)
                                    {{$uac->uac->nombre_modulo}}
                                @endif
                                {{$uac->uac->nombre}}
                            </td>
                            @if(count($uac->calificaciones) > 0 && $uac->calificaciones[0]->parcial > 3)
                                @if($uac->calificaciones[0]->calificacion >= 6)
                                    <td class="creditos">{{$uac->uac->creditos}}</td>
                                @else
                                    <td class="creditos">***</td>
                                @endif
                            @else
                                <td class="creditos">-</td>
                            @endif
                            @if(count($uac->calificaciones) > 0 && $uac->calificaciones[0]->parcial > 3)
                                <td class="calificacion">
                                    @if($uac->calificaciones[0]->calificacion < 10)
                                        {{number_format($uac->calificaciones[0]->calificacion, 1)}}
                                    @else
                                        {{$uac->calificaciones[0]->calificacion}}
                                    @endif
                                    @if($uac->calificaciones[0]->parcial == 5)
                                        {{' EXT'}}
                                    @endif
                                </td>
                            @else
                                <td class="calificacion">-</td>
                            @endif
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>
    <p class="mayus mitad menos-top">SE EXPIDE EL PRESENTE HISTORIAL ACADÉMICO CON <b>{{$alumno->promedioCreditos['creditos']}} CRÉDITOS</b>
        CURSADOS DE UN TOTAL DE {{$datosGenerales['creditos']}}, CON UN PROMEDIO GENERAL DE
        <b>{{number_format($alumno->promedioCreditos['promedio'], 1)}}</b> ({{$alumno->promedioCreditos['promedioConLetra']}}), EL {{$datosGenerales['fecha']}},
        EN {{$datosGenerales['direccion_plantel']}},
        {{$datosGenerales['municipio']}}, {{$datosGenerales['estado']}},
        PARA LOS FINES DE CARÁCTER INFORMATIVO QUE AL INTERESADO CONVENGA.
    </p>
    <br><br>
    <div class="firma firma-izq">
        <p>___________________________________________</p>
        @if($datosGenerales['personal'] != null)
            <p class="mayus"><b>{{Str::upper($datosGenerales['personal']->titulo_director)}}
                    {{Str::upper($datosGenerales['personal']->nombre_director)}}</b></p>
            <p>{{Str::upper($datosGenerales['personal']->cargo_director)}}</p>
        @else
            <p class="mayus"><b>&nbsp;</b></p>
            <p>DIRECTOR DEL PLANTEL</p>
        @endif
    </div>
    <div class="firma firma-der">
        <p>___________________________________________</p>
        @if($datosGenerales['personal'] != null)
            <p class="mayus"><b>{{Str::upper($datosGenerales['personal']->titulo_control_escolar)}}
                    {{Str::upper($datosGenerales['personal']->nombre_control_escolar)}}</b></p>
            <p>{{Str::upper($datosGenerales['personal']->cargo_control_escolar)}}</p>
        @else
            <p class="mayus"><b>&nbsp;</b></p>
            <p>ENCARGADO DE CONTROL ESCOLAR</p>
        @endif
    </div>
    @if($loop->iteration < count($alumnos))
        <div class="page-break"></div>
    @endif
    @endforeach
</body>
</html>
