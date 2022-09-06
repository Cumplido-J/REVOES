    <!DOCTYPE html>
<html>
<head>
    <title>Boleta de calificaciones</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="{{'./css/boletas.css'}}">
</head>
<body>
    @foreach($datosAlumnos as $data)
        <div class="header">
            <div class="logo">
{{--                @if(file_exists(public_path('/assets/logos-estados/'.$datosGenerales['abreviatura_estado'].'.png')))--}}
{{--                    <img src="{{public_path('/assets/logos-estados/'.$datosGenerales['abreviatura_estado'].'.png')}}">--}}
{{--                @else--}}
                    <img src="{{public_path('/assets/logos-estados/logo-cecyte.png')}}">
{{--                @endif--}}
            </div>
            <div class="titulo-boleta">
                <h1>COORDINACIÓN DE ORGANISMOS DESCENTRALIZADOS ESTATALES DE CECYTEs</h1>
                <h1>COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE <br>{{$datosGenerales['estado'] ?? $data['datosIndividuales']['estado']}}</h1>
                <h1>CCT {{$datosGenerales['cct']  ?? $data['datosIndividuales']['cct']}} {{$datosGenerales["plantel"]  ?? $data['datosIndividuales']['plantel']}}</h1>
                <h1>BOLETA DE ALUMNO</h1>
            </div>
            <div class="logo header-right">
                <img src="{{public_path('/assets/logo-sep.jpg')}}">
            </div>
        </div>
        <p class="fecha">{{$datosGenerales['municipio']  ?? $data['datosIndividuales']['municipio']}},
            {{ $datosGenerales['estado'] ?? $data['datosIndividuales']['estado'] }}
            a {{$datosGenerales['fecha']  ?? $data['datosIndividuales']['fecha']}}</p>
        <div class="datos-boleta">
            <div class="datos-div-izq">
                <ol class="datos">
                    <li><b>Alumno: </b>{{ $data['datosIndividuales']['alumno'] }}</li>
                    <li>
                        @if($datosGenerales['tipo_plantel']  ?? $data['datosIndividuales']['tipo_plantel'] == 18)
                            <b>Bachillerato Tecnológico: </b>
                        @else
                            <b>Bachillerato General: </b>
                        @endif
                        {{ $datosGenerales['carrera'] ?? $data['datosIndividuales']['carrera'] }}</li>
                    <li><b>Ciclo: </b>{{ $datosGenerales['periodo'] ?? $data['datosIndividuales']['periodo'] }}</li>
                </ol>
            </div>
            <div class="datos-div-der">
                <ol class="datos-der">
                    <li><b>Matrícula:  </b>{{ $data['datosIndividuales']['matricula'] }}</li>
                    <li><b>CURP: </b>{{ $data['datosIndividuales']['curp'] }}</li>
                    <li>
                        <b>Semestre: </b>{{ $datosGenerales['semestre'] ?? $data['datosIndividuales']['semestre'] }}
                        @if($data['datosIndividuales']['grupo'] != null)
                            <b>Grupo: </b> {{$data['datosIndividuales']['grupo']}}</li>
                        @endif
                </ol>
            </div>
        </div>
        <div class="contenido">
            <table id="tabla-califi">
                <thead>
                <tr>
                    <th rowspan="2">Clave</th>
                    <th rowspan="2">Asignatura</th>
                    <th colspan="3">Calificaciones</th>
                    <th colspan="2">Final</th>
                    <th colspan="3">Faltas</th>
                    <th rowspan="2">Total<br>faltas</th>
                </tr>
                <tr>
                    <th>P1</th>
                    <th>P2</th>
                    <th>P3</th>
                    <th>C</th>
                    <th>EXT</th>
                    <th>P1</th>
                    <th>P2</th>
                    <th>P3</th>
                </tr>
                </thead>
                <tbody>
                    @php $modulos = ['I','II','III']; @endphp
                    @foreach($data['calificaciones'] as $calificacion)
                    <tr>
                        <td style="white-space: nowrap">{{ $calificacion[0]->carreraUac->uac->clave_uac ?? $calificacion['carreraUac']->uac->clave_uac}}</td>
                        <td class="texto-izq" style="width: 350px;">
                            @php $nombreUac = ""; @endphp
                            @php $uac = $calificacion[0]->carreraUac->uac ?? $calificacion['carreraUac']->uac @endphp
                            @if($uac->tipo_uac_id == 4)
                                @php $nombreUac = $uac->nombre_modulo.$uac->nombre; @endphp
                            @elseif($uac->tipo_uac_id == 10)
                                @php $nombreUac = $uac->nombre_submodulo.$uac->nombre; @endphp
                            @else
                                @php $nombreUac = $uac->nombre; @endphp
                            @endif
                            @if(strlen($nombreUac) > 70)
                                {{substr($nombreUac, 0, 68)}}...
                            @else
                                {{ $nombreUac }}
                            @endif
                        </td>
                        @php $parcial = 0; @endphp
                        @for($i = 1; $i < 6; $i++)
                            @if(isset($calificacion['carreraUac']))
                                <td>-</td>
                            @elseif(count($calificacion) > $parcial && $calificacion[$parcial]->parcial == $i)
                                @if(Str::length($calificacion[$parcial]['calificacion']) == 0)
                                    <td>-</td>
                                @elseif($calificacion[$parcial]['calificacion'] == -1)
                                    <td>NP</td>
                                @else
                                    <td>
                                        @if($calificacion[$parcial]['calificacion'] < 10 && $calificacion[$parcial]['calificacion'] != 0)
                                            {{number_format($calificacion[$parcial]['calificacion'], 1)}}
                                        @else
                                            {{$calificacion[$parcial]['calificacion']}}
                                        @endif
                                        @if($i == 5)
                                            {{$calificacion[$parcial]->tipo_calif}}
                                        @endif
                                    </td>
                                @endif
{{--                            <td>{{$calificacion[$parcial]['calificacion']}}</td>--}}

                                @php $parcial++; @endphp
                            @elseif($i < 5)
                                <td>-</td>
                            @else
                                <td>-</td>
                            @endif
                        @endfor
                        @php $parcial = 0; @endphp
                        @php $totalFaltas = 0; @endphp

                        @for($i = 1; $i < 4; $i++)
                            @if(isset($calificacion['carreraUac']))
                                <td>-</td>
                            @elseif(count($calificacion) > $parcial && $calificacion[$parcial]->parcial == $i)
                                @if(isset($calificacion[$parcial]->faltas) && $calificacion[$parcial]->faltas != null)
                                    <td>{{$calificacion[$parcial]->faltas}}</td>
                                    @php $totalFaltas+=$calificacion[$parcial]->faltas; @endphp
                                @else
                                    <td>-</td>
                                @endif
                            @else
                                <td>-</td>
                            @endif
                            @php $parcial++ @endphp
                        @endfor
                        @if($totalFaltas > 0)
                            <td>{{$totalFaltas}}</td>
                        @else
                            <td>-</td>
                        @endif
                    </tr>
                @endforeach
                <tr>
                    <td></td>
                    <td class="texto-izq">Promedio</td>
                    @for($i = 0; $i < 4; $i++)
                        @if($data['promedios'][$i] != 0)
                            @if($data['promedios'][$i] != 10)
                                <td>{{number_format($data['promedios'][$i], 1)}}</td>
                            @else
                                <td>{{$data['promedios'][$i]}}</td>
                            @endif
                        @else
                            <td>-</td>
                        @endif
                    @endfor
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
                </tbody>
            </table>
            <br><br>
            <div class="firma">
                <p>__________________________________</p>
                @if(isset($datosGenerales['personal']))
                    <p>{{Str::upper($datosGenerales['personal']->titulo_director)}}
                        {{Str::upper($datosGenerales['personal']->nombre_director)}}</p>
                    <p>{{Str::upper($datosGenerales['personal']->cargo_director)}}</p>
                @elseif(isset($data['datosIndividuales']['personal']) && $data['datosIndividuales']['personal'] != null)
                    <p>{{Str::upper($data['datosIndividuales']['personal']->titulo_director)}}
                        {{Str::upper($data['datosIndividuales']['personal']->nombre_director)}}</p>
                    <p>{{Str::upper($data['datosIndividuales']['personal']->cargo_director)}}</p>
                @else
                    <p>&nbsp;</p>
                    <p>DIRECTOR DEL PLANTEL</p>
                @endif
            </div>
        </div>
        @if(!$loop->last)
            <br>
            @if($loop->iteration%2 == 0)
                <div class="page-break"></div>
            @endif
        @endif
        @endforeach
        <div>
        </div>
</body>
</html>
