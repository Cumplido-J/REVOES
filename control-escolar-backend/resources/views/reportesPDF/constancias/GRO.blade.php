<!DOCTYPE html>
<html lang="es">
<head>
    <title>Constancia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/constancias/GRO.css'}}" media="all">
</head>
<body>
    @foreach($alumnos as $alumno)
    <div class="header">
        <div class="logo">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>

        <div class="logo espacio-logo">
            @if(file_exists(public_path('/assets/logos-gob/'.$alumno->plantel->municipio->estado->abreviatura.'.png')))
                <img src="{{public_path('/assets/logos-gob/'.$alumno->plantel->municipio->estado->abreviatura.'.png')}}">
            @else
                <img src="{{public_path('/assets/imagen-blanca.png')}}">
            @endif
        </div>

        <div class="logo espacio-logo">
            @if(file_exists(public_path('/assets/logos-estados/'.$alumno->plantel->municipio->estado->abreviatura.'.png')))
                <img src="{{public_path('/assets/logos-estados/'.$alumno->plantel->municipio->estado->abreviatura.'.png')}}">
            @else
                <img src="{{public_path('/assets/logos-estados/logo-cecyte.png')}}">
            @endif
        </div>
    </div>

    <br><br><br>
    <div class="row">
{{--        @if($fotografia && $alumno->ruta_fotografia != null && file_exists(storage_path('app/'.$alumno->ruta_fotografia)))--}}
{{--            <img class="foto" src="{{storage_path('app/'.$alumno->ruta_fotografia)}}">--}}
{{--        @else--}}
{{--            <img class="foto" src="{{public_path().'/assets/imagen-blanca.png'}}">--}}
{{--        @endif--}}
        <div class="asunto">
            <p>
                <b>COLEGIO DE ESTUDIOS CIENTIFICOS Y TECNOLÓGICOS DEL ESTADO DE {{mb_strtoupper($alumno->plantel->municipio->estado->nombre)}}
                    <br>CENTRO DE EDUCACIÓN MEDIA SUPERIOR A DISTANCIA NÚM. {{str_pad($alumno->plantel->numero, 3, "0", STR_PAD_LEFT)}}
                    <br>CCT {{$alumno->plantel->cct}}
                </b>
            </p>
        </div>
        <br>
    </div>
    <br>
    <div class="row" style="text-align: center;">
        <p><b>CONSTANCIA DE ESTUDIOS</b></p>
    </div>
    <br>
    <div class="row">
        <p><b>A QUIEN CORRESPONDA: </b></p>
    </div>
    <div class="row texto">
        La dirección del CENTRO DE EDUCACIÓN MEDIA SUPERIOR A DISTANCIA NÚM. {{str_pad($alumno->plantel->numero, 3, "0", STR_PAD_LEFT)}}
        con Clave de Centro de Trabajo {{$alumno->plantel->cct}},
        hace constar que: <b>{{mb_strtoupper($alumno->nombre_completo)}}</b> con número de matrícula <b>{{$alumno->matricula}}</b>
        y CURP <b>{{$alumno->usuario->username}}</b> es {{($alumno->sexo == 'Femenino') ? 'alumna' : 'alumno'}} vigente
        y actualmente cursa el {{$semestre}} semestre del BACHILLERATO GENERAL con formación para el trabajo
        en {{mb_strtoupper($alumno->carrera->nombre)}}, {{($alumno->sexo == 'Femenino') ? 'inscrita' : 'inscrito'}}
        en el grupo {{$alumno->grupo->grupo}} en el periodo semestral del {{$alumno->inicioPeriodo}} al {{$alumno->finPeriodo}}.
    </div>
    <div class="row texto">
        <br>
        {{$descripcion}}
    </div>
    <br>
    <div class="row texto">
        A petición del interesado, se extiende la presente constancia con {{$alumno->promedioCreditos['creditos']}} créditos cursados de un total de {{$alumno->carrera->total_creditos}},
        con un promedio general de {{number_format($alumno->promedioCreditos['promedio'], 1)}} ({{$alumno->promedioCreditos['promedioConLetra']}}),
        en {{mb_strtoupper($alumno->plantel->municipio->nombre)}}, {{mb_strtoupper($alumno->plantel->municipio->estado->nombre)}}
        a los {{$fecha}}.
    </div>

    <br><br>
    <div class="row" style="text-align:center; font-weight:bold">
        <p>ATENTAMENTE</p>
        <br><br><br><br><br>
        <p>____________________________________________</p>
        @if($alumno->plantel->personal != null)
            <p>{{mb_strtoupper($alumno->plantel->personal->nombre_director)}} <br>
                RESPONSABLE DEL CENTRO
            </p>
        @else
            <p><br>RESPONSABLE DEL CENTRO</p>
        @endif
    </div>
    <br><br><br><br><br><br>
    <p class="copia">C.c.p. Archivo</p>

    <br>
    @if($loop->iteration < count($alumnos))
    <div style="page-break-after: always;"></div>
    @endif
    @endforeach
</body>
</html>
