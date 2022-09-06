<!DOCTYPE html>
<html lang="es">
<head>
    <title>Constancia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/constancia.css'}}" media="all">
</head>
<body>

    <div class="header">
        <div class="logo">
            @if(file_exists(public_path('/assets/logos-estados/'.$alumno->plantel->municipio->estado->abreviatura.'.png')))
                <img src="{{public_path('/assets/logos-estados/'.$alumno->plantel->municipio->estado->abreviatura.'.png')}}">
            @else
                <img src="{{public_path('/assets/logos-estados/logo-cecyte.png')}}">
            @endif
        </div>

        <div class="logo espacio-logo">
            <img src="{{public_path().'/assets/logo-sep.jpg'}}">
        </div>

        <div class="logo espacio-logo">
            @if(file_exists(public_path('/assets/logos-gob/'.$alumno->plantel->municipio->estado->abreviatura.'.png')))
                <img src="{{public_path('/assets/logos-gob/'.$alumno->plantel->municipio->estado->abreviatura.'.png')}}">
            @else
                <img src="{{public_path('/assets/imagen-blanca.png')}}">
            @endif
        </div>
    </div>

    <br><br><br>
    <div class="row">
        @if($fotografia && $alumno->ruta_fotografia != null && file_exists(storage_path('app/'.$alumno->ruta_fotografia)))
            <img class="foto" src="{{storage_path('app/'.$alumno->ruta_fotografia)}}">
        @else
            <img class="foto" src="{{public_path().'/assets/imagen-blanca.png'}}">
        @endif
        <div class="asunto">
            <p>Asunto: Constancia de estudios</p>
        </div>
        <br>
    </div>
    <br>
    <div class="row">
        <p>A QUIEN CORRESPONDA:</p>
    </div>
    <br>
    <div class="row texto">
        @if($alumno->plantel->tipo_plantel_id == 18)
            El Plantel Cecyte
        @else
            El Centro EMSaD
        @endif
            {{str_replace('Plantel', '', $alumno->plantel->nombre_final)}} con Clave de Centro de Trabajo {{$alumno->plantel->cct}},
        hace constar que: {{mb_strtoupper($alumno->nombre_completo)}} con número de matrícula {{$alumno->matricula}},
        con CURP {{$alumno->usuario->username}} es {{($alumno->sexo == 'Femenino') ? 'alumna' : 'alumno'}} de
        {{$semestre}} semestre del Bachillerato {{($alumno->plantel->tipo_plantel_id == 18) ? 'Tecnológico con la carrera técnica '
        : 'General en la formación para el trabajo '}}
        en {{mb_strtoupper($alumno->carrera->nombre)}} perteneciente al grupo {{$alumno->grupo->grupo}} correspondiente al periodo
        semestral del {{$inicioPeriodo}} al {{$finPeriodo}}.
    </div>
    <div class="row texto">
        <br>
        {{$descripcion}}
    </div>
    <br>
    <div class="row texto">
        Por lo que a petición del interesado y para los fines legales que haya lugar, se extiende la presente en {{$alumno->plantel->ciudad}},
        municipio de {{$alumno->plantel->municipio->nombre}}, {{$alumno->plantel->municipio->estado->nombre}} a los
        {{$fecha}}.
    </div>

    <br><br>
    <div class="row">
        <p>Atentamente <br>"Ciencia y Tecnología, <i>Luz y Camino</i> "</p>
        <br><br><br>
        @if($alumno->plantel->personal != null)
            <p>{{$alumno->plantel->personal->nombre_director}} <br>
                @if($alumno->plantel->tipo_plantel_id == 18)
                    {{explode(' ', $alumno->plantel->personal->cargo_director)[0]}} del {{(!str_contains(strtolower($alumno->plantel->nombre_final), 'plantel')) ? 'Plantel' : ''}}
                @else
                    Responsable del Centro EMSaD
                @endif
                {{$alumno->plantel->nombre_final}}
            </p>
        @else
            <p>&nbsp;<br>
                @if($alumno->plantel->tipo_plantel_id == 18)
                    Director del {{(!str_contains(strtolower($alumno->plantel->nombre_final), 'plantel')) ? 'Plantel' : ''}}
                @else
                    Responsable del Centro EMSaD
                @endif
                {{$alumno->plantel->nombre_final}}
            </p>
        @endif
    </div>
    <br><br><br><br><br><br>
    <p class="copia">C.c.p. Archivo</p>

    <br><hr>
</body>
</html>
