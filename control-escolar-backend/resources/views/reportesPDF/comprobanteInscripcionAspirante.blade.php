<!DOCTYPE html>
<html lang="es">
<head>
    <title>Comprobante de Inscripción</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="{{public_path().'/css/constancia.css'}}" media="all">
    <style>
        body{
            font-size: 18px;
        }
    </style>
</head>
<body>
@for($i = 0; $i < 2; $i++)
    <div style="width: 100%; display: inline-block;">
        <div style="float:left; width: 30%;">
            @if(file_exists(public_path('/assets/logos-estados/'.$aspirante->plantel->municipio->estado->abreviatura.'.png')))
                <img src="{{public_path('/assets/logos-estados/'.$aspirante->plantel->municipio->estado->abreviatura.'.png')}}">
            @else
                <img src="{{public_path('/assets/logos-estados/logo-cecyte.png')}}">
            @endif
        </div>

        <div style="float: right; width: 70%; text-align: right;">
            <b>COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS
                <br>DEL ESTADO DE {{\Illuminate\Support\Str::upper($aspirante->plantel->municipio->estado->nombre)}}</b>
                <br><br>{{\App\Helpers\HelperSisec::obtenerFechaActual()}}
        </div>
    </div>
    <hr style="height: 3px; background-color: darkorange; border: none;">
    <div class="row">
        <div style="text-align: center;">
            <p><b>FICHA DE INSCRIPCIÓN</b></p>
        </div>
    </div>
    <br>
    <div class="row texto">
        <p><b>NOMBRE DEL ASPIRANTE: </b>{{$aspirante->nombreCompleto}}</p>
        <p><b>CURP: </b>{{$aspirante->curp}}</p>
        <p><b>TELÉFONO: </b>{{$aspirante->telefono}}</p>
        <p><b>CORREO ELECTRÓNICO: </b>{{$aspirante->correo}}</p>
        <p><b>CONTRASEÑA: </b>{{$aspirante->contrasena}}</p>
        <p><b>FECHA DE APLICACIÓN DEL EXAMEN: </b>28 de Mayo de 2022</p>
        <p><b>ENLACE PARA PRESENTAR EL EXAMEN: </b> https://cecytebcs.edu.mx/requisitos-de-ingreso</p>
    </div>
    <br><br><br>
@endfor
</body>
</html>
