<!DOCTYPE html>
<html>
<head>
    <title>Evaluación semestral</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/reporte-calificaciones-parcial.css'}}" media="all">
</head>
<body>
    <div class="header">
        <div class="logo">
            @if(file_exists(public_path('/assets/logos-estados/'.$grupo->plantelCarrera->plantel->municipio->estado->abreviatura.'.png')))
                <img src="{{public_path('/assets/logos-estados/'.$grupo->plantelCarrera->plantel->municipio->estado->abreviatura.'.png')}}">
            @else
                <img src="{{public_path('/assets/logos-estados/logo-cecyte.png')}}">
            @endif
        </div>
        <div class="titulo-boleta">
            <h1>COORDINACIÓN DE ORGANISMOS DESCENTRALIZADOS ESTATALES DE CECYTEs</h1>
            <h1>COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE <br>{{$grupo->plantelCarrera->plantel->municipio->estado->nombre}}</h1>
            <h1>CCT {{$grupo->plantelCarrera->plantel->cct}} {{$grupo->plantelCarrera->plantel->nombre}}</h1>
            <h1>REPORTE DE EVALUACIÓN SEMESTRAL</h1>
        </div>
        <div class="logo header-right">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>
    </div>
    <br><br>
    <div class="datos-boleta">
        <div class="datos-div-izq">
            <ol class="datos">
                <li><b>Grupo: </b>{{ $grupo->grupo }}
                    <b>   Semestre: </b>{{ $grupo->semestre }}
                    <b>   Turno: </b>{{($grupo->turno == 'TM') ? 'Matutino' : 'Vespertino' }}
                </li>
                <li>
                    @if($grupo->plantelCarrera->plantel->tipo_plantel_id == 18)
                        <b>Bachillerato Tecnológico: </b>
                    @else
                        <b>Bachillerato General: </b>
                    @endif
                    {{ $grupo->plantelCarrera->carrera->nombre}}
                </li>
                <li><b>Clave: </b>{{ $grupo->plantelCarrera->carrera->clave_carrera }}</li>
            </ol>
        </div>
        <div class="datos-div-der">
            <ol class="datos-der">
                <li><b>Ciclo: </b>{{ $grupo->periodo->nombre_con_mes }}</li>
                <li><b>Alumnos: </b>{{count($alumnos)}}
                </li>
{{--                <li><b>Promedio del grupo: </b>{{$promedioGeneral}}</li>--}}
            </ol>
        </div>
{{--        Nombres de las materias--}}
    </div>
    <div class="datos-boleta">
        <table>
            <thead>
                <tr class="encabezado">
                    <th>Clave</th>
                    <th>Nombre asignatura</th>
                </tr>
            </thead>
            <tbody>
            @foreach($asignaturas as $uac)
            <tr>
                <td>{{$uac->clave_uac}}</td>
                <td>{{$uac->nombre}}</td>
            </tr>
            @endforeach
            </tbody>
        </table>
    </div>
    <br><br>
    <div>
        <table class="tabla-califi">
            <thead>
                <tr class="encabezado">
                    <th>Matrícula</th>
                    <th style="width:35%">Alumno</th>
                    @foreach($asignaturas as $a)
                        <th class="fuente-10">
{{--                            @if($a['tipo_uac_id'] != 4 && $a['tipo_uac_id'] != 10)--}}
{{--                                <br>{{$a['nombre']}}--}}
{{--                            @else--}}
                                {{$a['clave_uac']}}
{{--                            @endif--}}
                        </th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach($alumnos as $alumno)
                    <tr>
                        <td class="matricula">{{$alumno['matricula']}}</td>
                        <td class="alumno">
                            {{$alumno['alumno']}}
                        </td>

                        @foreach($alumno['materias'] as $calificacion)

                            @if($calificacion[3] == -1)
                                <td>NP</td>
                            @else
                                <td class="{{$calificacion[3] < 6 ? 'rojo' : ''}}">
                                    @if($calificacion[3] == 10)
                                        {{$calificacion[3]}}
                                    @elseif($calificacion[3] == '')
                                        -
                                    @elseif($calificacion[3] < 5)
                                        5.0
                                    @else
                                        {{number_format($calificacion[3], 1)}}
                                    @endif
                                </td>
                            @endif
                        @endforeach
                    </tr>
                @endforeach

            </tbody>
        </table>
    </div>
    <br><br><br>
    <div class="firma firma-izq">
        <p>___________________________________________</p>
        @if($grupo->plantelCarrera->plantel->municipio->estado->datos != null)
            <p class="mayus"><b>{{$grupo->plantelCarrera->plantel->municipio->estado->datos->titulo_director}} {{$grupo->plantelCarrera->plantel->municipio->estado->datos->nombre_director}}</b></p>
            <p>Director{{$grupo->plantelCarrera->plantel->municipio->estado->datos->genero_director == 'F' ? 'a' : ''}} general</p>
        @else
            <p class="mayus"><b>&nbsp;</b></p>
            <p>DIRECTOR GENERAL</p>
        @endif
    </div>
    <div class="firma firma-der">
        <p>___________________________________________</p>
        @if($grupo->plantelCarrera->plantel->personal != null)
            <p class="mayus"><b>{{Str::upper($grupo->plantelCarrera->plantel->personal->titulo_director)}}
                    {{Str::upper($grupo->plantelCarrera->plantel->personal->nombre_director)}}</b></p>
            <p>{{Str::upper($grupo->plantelCarrera->plantel->personal->cargo_director)}}</p>
        @else
            <p class="mayus"><b>&nbsp;</b></p>
            <p>DIRECTOR DEL PLANTEL</p>
        @endif
    </div>
</body>
</html>
