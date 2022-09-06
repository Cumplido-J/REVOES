<html lang="">
<head>
    <title>Credencial</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link media="all" rel="stylesheet" type="text/css" href="{{public_path().'/css/credenciales/credencial-gro.css'}}">
    <style>
        @font-face {
            font-family: "Kanit";
            src: url({{public_path().'/assets/fonts/kanit/Kanit-Regular.ttf'}});
        }
        @font-face {
            font-family: "Encode Sans";
            src: url({{public_path().'/assets/fonts/encodeSans/EncodeSans-Regular.ttf'}});
        }
        @font-face {
            font-family: "Encode Sans";
            src: url({{public_path().'/assets/fonts/encodeSans/EncodeSans-Bold.ttf'}});
            font-weight: bold;
        }
    </style>
</head>
<body>
@foreach($alumnos as $alumno)
    <div class="div-principal">
        <div style="width: 50%; float: left"> {{-- Div de la izquierda --}}
            <div style="height: 50%; background-image: url({{public_path().'/assets/credenciales/GRO/fondo.png'}});
                background-size: cover;"> {{-- Div para fondo guinda--}}
                <div style="width:100%; text-align: center;">
                    <img src="{{public_path().'/assets/credenciales/GRO/logo-sep.png'}}" style="width:80%;">
                </div>
                <div style="width:100%; text-align: center;">
                    <div style="width: 50%; text-align: center; float: left">
                        <img src="{{public_path().'/assets/credenciales/GRO/logo-cecyte.png'}}" style="width:100%">
                    </div>
                    <div style="width: 50%; text-align: center; float: left;">
                        <img src="{{public_path().'/assets/credenciales/GRO/logo-emsad.png'}}" style="width:90%">
                    </div>
                </div>
            </div>
            <div style="width: 100%; margin-top: -50%">
                <div style="width: 46%; font-size: 19px; float: left;">
                    <div style="width: 100%; color: white;">
                        <div style="width: 88%; padding-left: 15px; height: 75px;">
                            <span style="font-size: 17px;"><b>Nombre</b><br></span>
                            <b>{{\Illuminate\Support\Str::title($alumno->usuario->nombre)}}</b>
                        </div>
                    </div>
                    <div style="background-color: #E8DCBF; width: 200%; color: #5B5B69; height: 18%; vertical-align: middle;">
                        <div style="padding: 13px;">
                            {{\Illuminate\Support\Str::title($alumno->usuario->primer_apellido)}}<br>
                            {{\Illuminate\Support\Str::title($alumno->usuario->segundo_apellido)}}
                        </div>
                    </div>
                </div>
                <div style="width: 120px; float: left; border: 3px solid #BC965E; border-radius: 15px; height: 38%"> {{--Div para la foto --}}
                    @if($alumno->ruta_fotografia != null && file_exists(storage_path('app/'.$alumno->ruta_fotografia)))
                        @php
                            $tamanio = getimagesize(storage_path('app/'.$alumno->ruta_fotografia));

                            $ancho = 120;
                            $porcentaje_ancho = (($tamanio[0] - $ancho) * 100) / $tamanio[0];
                            $alto = ($tamanio[1] * $porcentaje_ancho) / 100;
                            $alto = $tamanio[1] - $alto;
                            $margin = (165 - $alto) / 2;

                        @endphp

                        <img class="foto" style="width: 120px; height: {{$alto}}; border-radius: 13px; margin-top: {{$margin}}"
                             src="{{storage_path('app/'.$alumno->ruta_fotografia)}}" alt="">
                    @else
                        <img src="{{public_path().'/assets/imagen-blanca.png'}}" style="width:100%; border-radius: 13px;
                         height: 165px;">
                    @endif
                </div>
            </div>
            <div style="width: 100%;">
                <div style="width:65%; margin-top:-10px; padding-left: 13px; float: left;">
                    <p style="font-size: 7px; color: #BC965E"><b>Matrícula: </b></p>
                    <p style="font-size: 12px">{{$alumno->matricula}}</p>
                    <p style="font-size: 7px; color: #BC965E"><b>CURP: </b></p>
                    <p style="font-size: 12px;">{{$alumno->usuario->username}}</p>
                    <p style="font-size: 7px; color: #BC965E"><b>Especialidad: </b> </p>
                    <p style="font-size: 12px">
                        @if($alumno->plantel->tipo_plantel_id == 18)
                            {{$alumno->carrera->nombre}}
                        @else
                            Bachillerato General
                        @endif
                    </p>
                </div>
                <div style="width: 30%; float: left;">
                    <p style="font-size: 7px; color: #BC965E"><b>Grupo: </b>
                        <span style="font-size: 12px; color: black;">{{$alumno->grupos->first()-> grupo ?? ''}}</span>
                    </p>
                    <div style="margin-top: 15px;">
                        {!! DNS2D::getBarcodeHTML("Matricula: ".$alumno->matricula."\nAlumno: ".$alumno->nombre_completo.
                            "\nCURP: ".$alumno->usuario->username, 'QRCODE', 2, 2) !!}
                    </div>
                </div>
            </div>

        </div>
        <div style="width: 50%; float:right; text-align: center; font-size: 10px;"> {{-- Div de la derecha --}}
            <img src="{{public_path().'/assets/credenciales/GRO/logo-sep-color.png'}}" style="width: 80%; margin-top: 20px;"><br>
            @if($alumno->plantel->tipo_plantel_id == 19)
                Centro de Educación Media Superior a Distancia<br>
            @else
                Plantel CECyTE
            @endif
            <p>{{$alumno->plantel->nombre_final}} CCT {{$alumno->plantel->cct}}</p>
            <p>&nbsp;</p>
            <p style="color: #BC965E; font-size: 11px;"><b>AUTORIZA: </b> </p>
            <br><br><br><br><br><br>
            <div style="width: 90%; margin-left: 5%; border-bottom: 1px solid;"></div>
            <p style="font-size: 12px;"><b>{{$alumno->plantel->personal->nombre_director}}</b></p>
            <p style="font-size: 11px; color: #BC965E;"><b>{{$alumno->plantel->personal->cargo_director}}</b></p>
            <p style="line-height: 12px">{{$alumno->plantel->calle}}, C.P. {{$alumno->plantel->codigo_postal}}, {{$alumno->plantel->ciudad}}, GUERRERO. </p>
            <p>&nbsp;</p>
            <p>{{$alumno->plantel->email}}</p>
            <br>
            VIGENCIA: <br>
            @if($alumno->grupos->first()->periodo_id == Sisec::periodoActual()->id)
                {{\Sisec::periodoActual()->cicloEscolar->nombre}}
            @else
                {{$alumno->grupos->first()->periodo->cicloEscolar->nombre}}
            @endif
        </div>
        <div style="width: 100%; background-image: url({{public_path().'/assets/credenciales/GRO/bordado.png'}});
            background-size: cover; height: 5%; float: left;">
        </div>
    </div>
    @if($loop->iteration % 4 == 0 && $loop->iteration < count($alumnos))
        <div style="page-break-after: always"></div>
    @endif
@endforeach
</body>
