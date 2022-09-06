<!DOCTYPE html>
<html>
<head>
    <title>REDI</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/redi.css'}}" media="all">
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
            <h1>
                @if($grupo->plantelCarrera->plantel->tipo_plantel_id == 19)
                    Centro EMSAD
                @endif
                {{$grupo->plantelCarrera->plantel->nombre_final}}
            </h1>
            <h1>CLAVE: {{$grupo->plantelCarrera->plantel->cct}} </h1>
            <h1>REDI</h1>
        </div>
        <div class="logo header-right">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>
    </div>
    <p class="fecha">{{$grupo->plantelCarrera->plantel->municipio->nombre}},
        {{$grupo->plantelCarrera->plantel->municipio->estado->nombre }}
        a {{$fecha}}</p>
    <div class="datos-boleta">
        <div class="datos-div-izq-redi">
            <ol class="datos">
                <li><b>Ciclo: </b>{{ $grupo->periodo->nombre_con_mes }}</li>
                <li><b>Grupo: </b>{{ $grupo->grupo }}, {{($grupo->turno == 'TM') ? 'Matutino' : 'Vespertino' }}</li>
                <li><b>Semestre: </b>{{ $grupo->semestre }}</li>
            </ol>
        </div>
        <div class="datos-div-der-redi">
            <ol class="datos-der">
                <li>
                    @if($grupo->plantelCarrera->plantel->tipo_plantel_id == 18)
                        <b>Bachillerato Tecnológico: </b>
                    @else
                        <b>Bachillerato General: </b>
                    @endif
                    {{ $grupo->plantelCarrera->carrera->nombre}}
                </li>
                <li><b>Alumnos: </b>{{ $grupo->alumnos_count }}</li>
            </ol>
        </div>
    </div>
    <div>
        <table class="tabla-califi">
            <thead>
                <tr class="encabezado">
                    <th>#</th>
                    <th>Matrícula</th>
                    <th>Nombre</th>
                    <th>Sexo</th>
                    <th>Fecha Nac.</th>
                    <th>CURP</th>
                </tr>
            </thead>
            <tbody>
                @foreach($grupo->alumnos as $alumno)
                    <tr>
                        <td class="numero">{{$loop->iteration}}</td>
                        <td class="matricula-reporte">{{$alumno->matricula}}</td>
                        <td class="alumno-reporte">
                            {{$alumno->usuario->primer_apellido}}
                            {{$alumno->usuario->segundo_apellido}}
                            {{$alumno->usuario->nombre}}
                        </td>
                        <td class="genero">{{$alumno->sexo}}</td>
                        <td>{{$alumno->fecha_nacimiento}}</td>
                        <td>{{\Illuminate\Support\Str::upper($alumno->usuario->username)}}</td>
                    </tr>
                    @if($loop->iteration == 45 && $loop->iteration < count($grupo->alumnos))
                        </tbody>
                    </table>
                    <div class="page-break"></div>
                        <table class="tabla-califi">
                        <thead>
                            <tr class="encabezado">
                                <th>#</th>
                                <th>Matrícula</th>
                                <th>Nombre</th>
                                <th>Sexo</th>
                                <th>Fecha Nac.</th>
                                <th>CURP</th>
                            </tr>
                        </thead>
                        <tbody>
                    @endif
                @endforeach
            </tbody>
        </table>
    </div><br><br><br><br>
    <div class="firma firma-izq">
        <p>___________________________________________</p>
        @if($grupo->plantelCarrera->plantel->municipio->estado->datos != null)
            <p class="mayus"><b>{{$grupo->plantelCarrera->plantel->municipio->estado->datos->titulo_director}} {{$grupo->plantelCarrera->plantel->municipio->estado->datos->nombre_director}}</b></p>
            <p class="mayus">Director{{$grupo->plantelCarrera->plantel->municipio->estado->datos->genero_director == 'F' ? 'a' : ''}} general</p>
        @else
            <p class="mayus"><b>&nbsp;</b></p>
            <p class="mayus">Director general</p>
        @endif
    </div>
    <div class="firma firma-der"> {{--Director del plantel--}}
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
