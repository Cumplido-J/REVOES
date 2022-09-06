<!DOCTYPE html>
<html>
<head>
    <title>Lista de Asistencia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/lista-asistencia.css'}}" media="all">
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
            <h1>LISTA DE ASISTENCIA</h1>
        </div>
        <div class="logo header-right">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>
    </div>
    <div class="datos-boleta">
        <div class="datos-div-izq">
            <ol class="datos">
                <li><b>Grupo: </b>{{ $grupo->grupo }}</li>
                <li><b>Semestre: </b>{{ $grupo->semestre }}</li>
                <li>
                    @if($grupo->plantelCarrera->plantel->tipo_plantel_id == 18)
                        <b>Bachillerato Tecnológico: </b>
                    @else
                        <b>Bachillerato General: </b>
                    @endif
                    {{ $grupo->plantelCarrera->carrera->nombre}}
                </li>
                <li><b>Clave: </b>{{ $grupo->plantelCarrera->carrera->clave_carrera }}</li>
                <li><b>Alumnos: </b>{{ $grupo->alumnos_count }}</li>
            </ol>
        </div>
        <div class="datos-div-der">
            <ol class="datos-der">
                <li><b>Ciclo: </b>{{ $grupo->periodo->nombre_con_mes }}</li>
                <li><b>Turno: </b>{{($grupo->turno == 'TM') ? 'Matutino' : 'Vespertino' }}</li>
                @if($docenteAsignatura != null)
                    <li><b>Docente: </b> {{$docenteAsignatura->plantillaDocente->docente->nombre}}
                        {{$docenteAsignatura->plantillaDocente->docente->primer_apellido}}
                        {{$docenteAsignatura->plantillaDocente->docente->segundo_apellido}}
                    </li>
                    <li><b>Asignatura: </b>
                        {{$docenteAsignatura->carreraUac->uac->clave_uac}}
                        {{$docenteAsignatura->carreraUac->uac->nombre}}
                    </li>
                @endif
            </ol>
        </div>
        <br>
    </div>
    <div>
        <table class="tabla-califi">
            <thead>
                <tr class="encabezado">
                    <th>Matrícula</th>
                    <th>Alumno</th>
                    @for($i = 0; $i < 15; $i++)
                        <th></th>
                    @endfor
                </tr>
            </thead>
            <tbody>
                @foreach($grupo->alumnos as $alumno)
                    <tr>
                        <td class="matricula">{{$alumno->matricula}}</td>
                        <td class="alumno">
                            {{$alumno->usuario->primer_apellido}}
                            {{$alumno->usuario->segundo_apellido}}
                            {{$alumno->usuario->nombre}}
                        </td>
                        @for($i = 0; $i < 15; $i++)
                            <td></td>
                        @endfor
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
