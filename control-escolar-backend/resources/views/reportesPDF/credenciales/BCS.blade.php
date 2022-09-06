<html lang="">
<head>
    <title>Credencial</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link media="all" rel="stylesheet" type="text/css" href="{{public_path().'/css/credenciales/credencial-bcs.css'}}">
</head>
<body class="body" style="font-family: 'Oswald Regular', sans-serif">
@foreach($alumnos as $alumno)
<div class="div-principal" style="background-image: url({{public_path().'/assets/bg-credencial.jpg'}});">
    <table>
	<tr>
		<td colspan="9"></td>
        <td rowspan="3"></td>
		<td colspan="9"></td>
	</tr>
	<tr>
		<td rowspan="2"></td>
		<td class="td-logo-sep" colspan="3">
			<img src="{{public_path().'/assets/logo-sep-200.png'}}" style="width: 75px; height:28px;" alt="">
        </td>
		<td rowspan="2" colspan="5">
            <div style="padding-left: 80px; margin-top: -10px;">{!! DNS2D::getBarcodeHTML($alumno->matricula, 'QRCODE', 2, 2) !!} </div>
        </td>
        <td rowspan="3"></td>
		<td class="td-logo-cecyte" colspan="7">
			<img src="{{public_path().'/assets/BCS_2.png'}}" style="width: 140px; height: 30px; margin-left: 28px;" alt="">
        </td>
		<td rowspan="13"></td>
	</tr>
	<tr>
		<td colspan="3"></td>
		<td style="height: 20px;" colspan="7" rowspan="2" class="nombre-plantel">{{$alumno->plantel->nombre_final}}</td>
	</tr>
	<tr>
		<td class="td-codigo-barras" colspan="10" rowspan="2">
{{--            Código de barras    --}}
            <div class="codigo-barras">
                <div style="margin-left: 7px; padding-top: 5px;">{!! DNS1D::getBarcodeHTML($alumno->matricula, 'CODABAR', 1.5, 35); !!}</div>
            </div>
        </td>
	</tr>
	<tr>
		<td rowspan="11"></td>
		<td rowspan="4"></td>
		<td class="td-foto" rowspan="4" colspan="5">
{{--            Foto--}}
            @if($alumno->ruta_fotografia != null && file_exists(storage_path('app/'.$alumno->ruta_fotografia)))
                @php
                    $tamanio = getimagesize(storage_path('app/'.$alumno->ruta_fotografia));
                    $alto = 120;
                    $porcentaje_alto = (($tamanio[1] - $alto) * 100) / $tamanio[1];
                    $ancho = ($tamanio[0] * $porcentaje_alto) / 100;
                    $ancho = $tamanio[0] - $ancho;
                    $margin = (150 - $ancho) / 2;
                @endphp

                <img class="foto" style="width: {{$ancho}}px; height: 120px; margin-left: {{$margin}}" src="{{storage_path('app/'.$alumno->ruta_fotografia)}}" alt="">
            @else
                <img class="foto" alt="">
            @endif
        </td>
        <td rowspan="4"></td>
	</tr>
	<tr>
		<td rowspan="10"></td>
		<td class="curp" colspan="8">
            <div>{{$alumno->usuario->username}}</div>
        </td>
		<td rowspan="10"></td>
	</tr>
	<tr>
		<td class="direccion" colspan="8" rowspan="3">
            {{$alumno->plantel->calle}}, {{$alumno->plantel->municipio->nombre}}, {{$alumno->plantel->codigo_postal}}
        </td>
	</tr>
	<tr></tr>
	<tr>
		<td class="nombre-alumno" colspan="7" rowspan="2">
            {{$alumno->nombre_completo}}
        </td>
	</tr>
	<tr>
        <td class="firma" colspan="8" rowspan="2">
            <div class="div-firma"><br><br><br></div>
        </td>
	</tr>
    <tr>
		<td class="matricula" colspan="7">
            {{$alumno->matricula}}
        </td>
	</tr>
	<tr>

        <td class="nombre-director" colspan="8">
            {{$alumno->plantel->personal->titulo_director}} {{$alumno->plantel->personal->nombre_director}}
        </td>
{{--		<td rowspan="2"></td>--}}
        <td class="bachillerato" colspan="7">
            @if($alumno->plantel->tipo_plantel_id == 18)
                BACHILLERATO TECNOLÓGICO
            @else
                BACHILLERATO GENERAL
            @endif
        </td>
	</tr>


	<tr>
{{--		<td class="nombre-director" colspan="8">--}}
{{--            {{$alumno->plantel->personal->titulo_director}} {{$alumno->plantel->personal->nombre_director}}--}}
{{--        </td>--}}
        <td class="cargo-director" colspan="8">
            {{$alumno->plantel->personal->cargo_director}}
        </td>
        <td class="nss" colspan="7">NSS: {{($alumno->expediente->nss) ?? ''}}</td>
	</tr>
	<tr>
{{--		<td class="cargo-director" colspan="8">--}}
{{--            {{$alumno->plantel->personal->cargo_director}}--}}
{{--        </td>--}}
        <td class="div-vigencia" colspan="8">
            <div class="vigencia">
                Vigencia:
                @if($alumno->grupos->first()->periodo_id != Sisec::periodoActual()->id)
                    {{Carbon\Carbon::createFromFormat('Y-m-d', $alumnos->first()->grupos->first()->periodo->fecha_fin)->format('d-m-Y')}}
                @else
                    {{Carbon\Carbon::createFromFormat('Y-m-d', Sisec::periodoActual()->fecha_fin)->format('d-m-Y')}}
                @endif
            </div>
        </td>
        <td class="telefonos" colspan="7" rowspan="1">
            <div style="text-align: center">
                @if($alumno->numero_contacto != null)
                    {{$alumno->numero_contacto}}
                    @if($alumno->numero_movil != null),
                    @endif
                @endif
                {{$alumno->numero_movil}}
            </div>
        </td>
	</tr>
    <tr></tr>

</table>
</div>
    @if($loop->iteration % 4 == 0 && $loop->iteration < count($alumnos))
        <div style="page-break-after: always"></div>
    @endif
@endforeach
</body>
</html>
