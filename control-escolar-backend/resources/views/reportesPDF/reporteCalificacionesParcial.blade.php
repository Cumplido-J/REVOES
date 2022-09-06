<!DOCTYPE html>
<html>
<head>
    <title>Estadísticas de calificaciones</title>
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
            @if($parcial < 4)
                <h1>REPORTE DE CALIFICACIONES PARA EL PARCIAL {{$parcial}}</h1>
            @elseif($parcial == 4)
                <h1>REPORTE DE CALIFICACIONES FINALES</h1>
            @endif
        </div>
        <div class="logo header-right">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>
    </div>
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
                <li><b>Alumnos: </b>{{ $grupo->alumnos_count }}
{{--                @if($parcial < 4)--}}
{{--                    <b>Parcial: </b>{{$parcial}}--}}
{{--                @endif--}}
                </li>
                <li><b>Promedio del grupo: </b>{{$promedioGeneral}}</li>

            </ol>
        </div>
    </div>
    <div>
        <table class="tabla-califi">
            <thead>
                <tr class="encabezado">
                    <th>Matrícula</th>
                    <th style="width:30%">Alumno</th>
                    @foreach($asignaturas as $a)
                        <th class="fuente-10">
                            @if($a['tipo_uac_id'] != 4 && $a['tipo_uac_id'] != 10)
                                <br>{{$a['nombre']}}
                            @else
                                {{$a['clave_uac']}}
                            @endif
                        </th>
                    @endforeach
                    <th>Promedio</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $sumaCalificaciones = array_fill(0,count($asignaturas),0);
                    $cantidadCalificaciones = array_fill(0,count($asignaturas),0);
                @endphp
                @foreach($grupo->alumnos as $alumno)
                    <tr>
                        <td class="matricula">{{$alumno->matricula}}</td>
                        <td class="alumno">
                            {{$alumno->usuario->primer_apellido}}
                            {{$alumno->usuario->segundo_apellido}}
                            {{$alumno->usuario->nombre}}
                        </td>
                        @php
                            $i = 0;
                            $suma = 0;
                            $cantAsignaturas = 0;
                            $clavePrevia = null;
                        @endphp
                        @foreach($alumno->calificacion_uac as $calif)
{{--                        Por si hay calificaciones repetidas --}}
                            @if($clavePrevia == $calif->carreraUac->uac->clave_uac)
                                @continue
                            @endif

{{--                        Si un alumno no tiene asignada la calificación para la asignatura   --}}
                            @while($i < count($asignaturas) && $asignaturas[$i]['clave_uac'] != $calif->carreraUac->uac->clave_uac)
                                <td>-</td>
                                @php $i++; @endphp
                            @endwhile

                            @if($i >= count($asignaturas))
                                @break
                            @endif

                            @if($calif->calificacion == -1)
                                <td>NP</td>
                            @else
{{--                            Ignorar submódulos en el promedio   --}}
                                @if($calif->carreraUac->uac->tipo_uac_id != 10)
                                    @php
                                        $suma+=$calif->calificacion;
                                        $cantAsignaturas++;
                                    @endphp
                                @endif
                                <td class="{{$calif->calificacion < 6 ? 'rojo' : ''}}">
                                    @if($calif->calificacion == 10)
                                        {{$calif->calificacion}}
                                    @elseif($calif->calificacion < 5)
                                        5.0
                                    @else
                                        {{number_format($calif->calificacion, 1)}}
                                    @endif
{{--                                    @if($calif->parcial == 5)--}}
{{--                                        EXT--}}
{{--                                    @elseif($calif->parcial == 6)--}}
{{--                                        CI--}}
{{--                                    @endif--}}
                                </td>

                                @php
                                    $clavePrevia = $asignaturas[$i]['clave_uac'];
                                    $i++;
                                @endphp
                            @endif

                        @endforeach
                        @for($j = $i; $j < count($asignaturas); $j++)
                            <td> - </td>
                        @endfor
{{--                    Poner el promedio del alumno    --}}
                        <td>{{($suma > 0) ? round( $suma/$cantAsignaturas, 1, PHP_ROUND_HALF_UP) : '-'}}</td>
                    </tr>
                @endforeach
                <tr><td>&nbsp;</td><td></td>
                @for($i = 0; $i < count($asignaturas)+1; $i++)
                    <td> </td>
                @endfor
                </tr>
{{--            Promedio por materia y general --}}
                <tr>
                    <td></td>
                    <td class=""><b>Promedio por Materia</b></td>
{{--                    @for($i = 0; $i < count($asignaturas); $i++)--}}
{{--                        @php(--}}
{{--                            $promedio = ($sumaCalificaciones[$i] > 0)--}}
{{--                            ? round($sumaCalificaciones[$i]/$cantidadCalificaciones[$i], 1, PHP_ROUND_HALF_UP)--}}
{{--                            : 0--}}
{{--                            );--}}
{{--                        @php($promedioGeneral += $promedio);--}}

{{--                        <td class="{{$promedio < 6 ? 'rojo' : ''}}">{{$promedio}}</td>--}}
{{--                    @endfor--}}
                    @for($i = 0; $i < count($asignaturas); $i++)
                        <td class="{{$promedioAsignaturas[$i] < 6 ? 'rojo' : ''}}">{{$promedioAsignaturas[$i]}}</td>--}}
                    @endfor
                    <td>{{$promedioGeneral}}</td>
                </tr>
{{--                Datos estadísticos--}}
                <tr>
                    <td></td>
                    <td><b>Total alumnos</b></td>
                    @for($i = 0; $i < count($asignaturas); $i++)
                        <td>{{$estadisticas['totalAlumnos'][$i]}}</td>
                    @endfor
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td><b>Alumnos reprobados</b></td>
                    @for($i = 0; $i < count($asignaturas); $i++)
                        <td>{{$estadisticas['reprobados'][$i]}}</td>
                    @endfor
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td><b>Alumnos aprobados</b></td>
                    @for($i = 0; $i < count($asignaturas); $i++)
                        <td>{{$estadisticas['aprobados'][$i]}}</td>
                    @endfor
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td><b>Porcentaje reprobados</b></td>
                    @for($i = 0; $i < count($asignaturas); $i++)
                        <td>{{$estadisticas['porcentajeReprobados'][$i]}}%</td>
                    @endfor
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td><b>Porcentaje aprobados</b></td>
                    @for($i = 0; $i < count($asignaturas); $i++)
                        <td>{{$estadisticas['porcentajeAprobados'][$i]}}%</td>
                    @endfor
                    <td></td>
                </tr>

            </tbody>
        </table>
    </div>
</body>
</html>
