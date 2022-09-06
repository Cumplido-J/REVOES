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
            <h1>REPORTE DE ALUMNOS CON MATERIAS REPROBADAS</h1>
        </div>
        <div class="logo header-right">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>
    </div>
    <div class="datos-boleta">
        <div class="datos-div-izq">
            <ol class="datos">
                <li>
                    @if($grupo->plantelCarrera->plantel->tipo_plantel_id == 18)
                        <b>Bachillerato Tecnológico: </b>
                    @else
                        <b>Bachillerato General: </b>
                    @endif
                    {{ $grupo->plantelCarrera->carrera->nombre}}
                </li>
                <li><b>Clave: </b>{{ $grupo->plantelCarrera->carrera->clave_carrera }}</li>
                <li><b>Alumnos:</b> {{$grupo->solo_reprobados ? 'Sólo reprobados' : 'Todos'}}</li>
            </ol>
        </div>
        <div class="datos-div-der">
            <ol class="datos-der">
                <li><b>Grupo: </b>{{ $grupo->grupo }}
                    <b>   Semestre: </b>{{ $grupo->semestre }}
                    <b>   Turno: </b>{{($grupo->turno == 'TM') ? 'Matutino' : 'Vespertino' }}
                </li>
                <li><b>Ciclo: </b>{{ $grupo->periodo->nombre_con_mes }}</li>
            </ol>
        </div>
    </div>
    <div>
        <table class="tabla-califi">
            <thead>
                <tr class="encabezado">
                    <th rowspan="2">#</th>
                    <th rowspan="2">Matrícula</th>
                    <th rowspan="2" style="width:20%">Alumno</th>
                    @foreach($asignaturas as $a)
                        <th colspan="3" class="fuente-10">
                            @if($a['tipo_uac_id'] != 4 && $a['tipo_uac_id'] != 10)
                                <br>{{$a['nombre']}}
                            @else
                                {{$a['clave_uac']}}
                            @endif
                        </th>
                    @endforeach
                    <th colspan="3">Promedio</th>
                </tr>
                <tr>
                    @foreach($asignaturas as $a)
                        <th>1P</th>
                        <th>2P</th>
                        <th>3P</th>
                    @endforeach
                    <th>1P</th>
                    <th>2P</th>
                    <th>3P</th>
                </tr>
            </thead>
            <tbody>
                @foreach($grupo->alumnos as $alumno)
                    <tr>
                        <td>{{$loop->iteration}}</td>
                        <td class="matricula">{{$alumno->matricula}}</td>
                        <td class="alumno">
                            {{$alumno->usuario->primer_apellido}}
                            {{$alumno->usuario->segundo_apellido}}
                            {{$alumno->usuario->nombre}}
                        </td>
                        @foreach($asignaturas as $asignatura)
                            @php $parcial = 1; $entro = false;@endphp
                            @foreach($alumno->calificacionUac as $materia)
                                @php $entro = false; @endphp
                                @foreach($materia as $calificacion)
                                    @if($asignatura['clave_uac'] == $calificacion->carreraUac->uac->clave_uac
                                        && $calificacion->parcial == $loop->iteration)
                                        <td class="{{$calificacion->calificacion < 6 ? 'rojo' : ''}}">{{$calificacion->calificacion}}</td>
{{--                                    Para obtener promedios    --}}
                                        @php
                                            $entro = true;
                                            $parcial = $calificacion->parcial;
                                        @endphp;
                                    @endif
                                @endforeach
                                @if($entro)
                                    @for($i = $parcial; $i < 3 ; $i++)
                                        <td></td>
                                    @endfor
                                    @break;
                                @endif
                            @endforeach
                            @if(!$entro)
                                <td></td>
                                <td></td>
                                <td></td>
                            @endif

                        @endforeach

{{--                        Promedio de los parciales --}}
                        @for($i = 0; $i < 3; $i++)
                            <td class="{{$alumno->promedios[$i] < 6 ? 'rojo' : ''}}">
                                {{($alumno->promedios[$i] > 0) ? round( $alumno->promedios[$i], 1, PHP_ROUND_HALF_UP) : ''}}
                            </td>
                        @endfor

                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
