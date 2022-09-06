
</html><!DOCTYPE html>
<html>
<head>
<title>{{$dataSend["tipo_doc"]}}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" type="text/css" href="{{'./css/acuse-calificaciones.css'}}" >

</head>
<body>
  <div class="header">
    @if(file_exists(public_path('/assets/logos-estados/'.$dataSend['abreviatura_estado'].'.png')))
        <img src="{{public_path('/assets/logos-estados/'.$dataSend['abreviatura_estado'].'.png')}}">
    @else
        <img src="{{public_path('/assets/logos-estados/logo-cecyte.png')}}">
    @endif
    <div class="titulo">
        <h1>COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS<br>DEL ESTADO DE {{$dataSend["estado"]}}</h1>
        <h1>{{$dataSend["plantel"]}}</h1>
        <h1>{{$dataSend["tipo_doc"]}}</h1>
    </div>
    <div class="logo header-right">
        <img src="{{public_path().'/assets/logo-sep.jpg'}}">
    </div>
  </div>

  <p class="fecha">
  {{ $dataSend['fecha_acuse'] }}
  </p>

  <div class="inf-asignatura">
    <ol>
      <li><a>Asignatura:</a> {{ $dataSend['asignatura'] }}</li>
    </ol>
  </div>

  <div class="inf-asignatura" style="margin-top: -10px;">
    <ol>
      <li><a>Carrera Técnica:</a> {{ $dataSend['carrera'] }}</li>
    </ol>
  </div>

  <div class="datos_acuse">
    <div>
      <ol>
        <li><a>Docente:</a> {{ $dataSend['docente'] }}</li>
        @if($dataSend['grupo'] != NULL)
          <li><a>Semestre:</a> {{ $dataSend['semestre'] }}</li>
          <li><a>Grupo:</a> {{ $dataSend['grupo'] }}</li>
        @endif
        <!--  -->
      </ol>
    </div>
    <div id="second-ol">
      <ol>
      <li><a>Periodo:</a> {{ $dataSend['periodo'] }}</li>
        @if($dataSend['turno'] != NULL)
        <li><a>Turno:</a> {{ $dataSend['turno'] }}</li>
        @endif
        <li><a>Alumnos:</a> {{ $dataSend['num_alumnos'] }}</li>
      </ol>
    </div>
  </div>

<div class="contenido" style="margin-top: -15px">
   <table id="tabla-califi">
    <thead>
      <tr>
        <th rowspan="2">#</th>
        <th rowspan="2">Matrícula</th>
        <th rowspan="2">Nombre Completo</th>
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
      <?php $count = 0; ?>
        @foreach($dataSend['alumnos'] as $alumno)
          <tr>
            <?php $count++; ?><!-- contador alumnos lista -->
            <td class="num-lista">{{ $count }}</td>
            <td>{{ $alumno->matricula }}</td>
            <td>{{ $alumno->usuario->segundo_apellido ? $alumno->usuario->primer_apellido." ".$alumno->usuario->segundo_apellido." ".$alumno->usuario->nombre :
                  $alumno->usuario->primer_apellido." ".$alumno->usuario->nombre}}</td>
            <!-- calificaciones -->
                @foreach($dataSend['calificaciones'] as $calificaciones)
                  @if($calificaciones['alumno_id'] == $alumno->usuario_id){
                    @if($calificaciones['parcial'] == "1"){
                      <td>{{  $calificaciones['calificacion'] }}</td>
                    }@elseif($calificaciones['parcial'] == "2"){
                      <td>{{  $calificaciones['calificacion'] }}</td>
                    }@elseif($calificaciones['parcial'] == "3"){
                      <td>{{  $calificaciones['calificacion'] }}</td>
                    }@elseif($calificaciones['parcial'] == "4"){
                      <td>{{  $calificaciones['calificacion'] }}</td>
                    }@elseif($calificaciones['parcial'] == "5"){
                      <td>{{  $calificaciones['calificacion'] }}</td>
                    }@endif
                  }@endif
              @endforeach
            <!-- faltas -->
            @php $totalFaltas = 0; @endphp
            @foreach($dataSend['calificaciones'] as $calificaciones)
                  @if($calificaciones['alumno_id'] == $alumno->usuario_id){
                    @if($calificaciones['parcial'] == "1"){
                      @php  $calificaciones['faltas'] != '-' ? $totalFaltas += $calificaciones['faltas'] : $totalFaltas; @endphp
                      <td>{{  $calificaciones['faltas'] ? $calificaciones['faltas'] : '-' }}</td>
                    }@elseif($calificaciones['parcial'] == "2"){
                      @php  $calificaciones['faltas'] != '-' ? $totalFaltas += $calificaciones['faltas'] : $totalFaltas; @endphp
                      <td>{{  $calificaciones['faltas'] ? $calificaciones['faltas'] : '-' }}</td>
                    }@elseif($calificaciones['parcial'] == "3"){
                      @php  $calificaciones['faltas'] != '-' ? $totalFaltas += $calificaciones['faltas'] : $totalFaltas; @endphp
                      <td>{{  $calificaciones['faltas'] ? $calificaciones['faltas'] : '-' }}</td>
                    }@endif
                  }@endif
              @endforeach

          @if($totalFaltas > 0)
              <td>{{$totalFaltas}}</td>
          @else
              <td>-</td>
          @endif
        </tr>
          @if($count == 46)
              </tbody> 
            </table>
            <div class="page-break"></div>
            <table id="tabla-califi">
              <thead>
                <tr>
                  <th rowspan="2">#</th>
                  <th rowspan="2">Matrícula</th>
                  <th rowspan="2">Nombre Completo</th>
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
                  @endif
                @endforeach
              </tbody>
  </table>
</div>
  <br><br><br>
  <div class="firma firma-izq">
    <p>___________________________________________</p>
    <p class="mayus"><b>
            {{ $dataSend['control_escolar'] != null ? Str::upper($dataSend['control_escolar']->nombre_control_escolar) : "No Disponible"}}</b></p>
    <p>{{ $dataSend['control_escolar'] != null ? Str::upper($dataSend['control_escolar']->cargo_control_escolar) : "No Disponible"}}</p>
  </div>
  <div class="firma firma-der">
    <p>___________________________________________</p>
    <p class="mayus"><b>
            {{Str::upper($dataSend['docente'])}}</b></p>
    <p>DOCENTE</p>
  </div>
</body>
</html>
