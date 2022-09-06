<!DOCTYPE html>
<html>
<head>
    <title>Docentes por grupo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/reporte-docentes-grupo.css'}}" media="all">
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
            <h1>DOCENTES POR GRUPO</h1>
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
            </ol>
        </div>
        <div class="datos-div-der">
            <ol class="datos-der">
                <li><b>Ciclo: </b>{{ $grupo->periodo->nombre_con_mes }}</li>
                <li><b>Turno: </b>{{($grupo->turno == 'TM') ? 'Matutino' : 'Vespertino' }}</li>
                <li><b>Alumnos: </b>{{ $grupo->alumnos_count }}</li>
            </ol>
        </div>
        <br>
    </div>
    <div>
        <table class="tabla-califi">
            <thead>
                <tr class="encabezado">
                    <th>CURP</th>
                    <th>Docente</th>
                    <th>Clave</th>
                    <th>Materia</th>
                </tr>
            </thead>
            <tbody>
                @foreach($grupo->uacs as $uac)
                    <tr>
                        @if(count($uac->docenteAsignatura) > 0)
                            @foreach($uac->docenteAsignatura as $docenteAsignatura)
                                @if($docenteAsignatura['estatus'] != 0)
                                    <td class="curp">{{$docenteAsignatura->plantillaDocente->docente->curp}}</td>
                                    <td class="docente">
                                        {{$docenteAsignatura->plantillaDocente->docente->nombre}}
                                        {{$docenteAsignatura->plantillaDocente->docente->primer_apellido}}
                                        {{$docenteAsignatura->plantillaDocente->docente->segundo_apellido}}
                                    </td>
                                @endif
                            @endforeach
                        @else
                        <td>-</td>
                        <td>No asignado</td>
                        @endif
                        <td class="clave-uac">{{$uac->uac->clave_uac}}</td>
                        <td class="materia">{{$uac->uac->nombre}}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
