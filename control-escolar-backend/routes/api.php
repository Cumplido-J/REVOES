<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by thge RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:api'])->group(function () {
    Route::get('/permisos-usuario', 'AuthController@permisos');
    Route::post('/password/reset-without-token', 'Auth\ApiPasswordResetController@resetWithoutToken');

    //Grupos
    Route::post('/grupos/filtrar','GrupoController@index')->middleware('permission:Buscar grupo');
    Route::get('/grupos/{id}','GrupoController@show')->middleware('permission:Buscar grupo');
    Route::post('/grupos','GrupoController@store')->middleware('permission:Crear grupo');
    Route::put('/grupos/{id}','GrupoController@update')->middleware('permission:Editar grupo');
    Route::delete('/grupos/{id}','GrupoController@destroy')->middleware('permission:Eliminar grupo');

    //Grupos periodos
    Route::get('/grupos-periodos','GrupoPeriodoController@index')->middleware('permission:Buscar grupo periodo');
    Route::post('grupos-periodos-por-carrera-uac', 'GrupoPeriodoController@gruposPorCarreraUAC')->middleware('permission:Buscar grupo periodo');
    Route::post('grupos-periodos', 'GrupoPeriodoController@habilitarGrupo')->middleware('permission:Activar grupo');
    Route::get('/grupos-periodos/{id}','GrupoPeriodoController@show')->middleware('permission:Buscar grupo periodo');
    Route::put('/grupos-periodos/{id}','GrupoPeriodoController@update')->middleware('permission:Buscar grupo');
    Route::delete('grupos-periodos/{id}', 'GrupoPeriodoController@destroy')->middleware('permission:Eliminar grupo periodo');
    Route::post('grupos-periodos-optativas/{id}', 'GrupoPeriodoController@asignarOptativas')->middleware('permission:Agregar optativas a grupo-periodo');
    Route::get('credencial-grupo/{id}', 'CredencialController@imprimirCredencialPorGrupo');

    //Aprobaciones
    Route::post('aprobacion-grupos', 'GrupoController@gruposParaAprobacion')->middleware('permission:Aprobar grupos');
    Route::post('aprobacion-grupos/{id}','GrupoController@aprobarRechazarGrupo')->middleware('permission:Aprobar grupos');
    Route::post('aprobacion-grupos-periodos/{id}','GrupoPeriodoController@aprobarRechazarGrupo')->middleware('permission:Aprobar grupos');
    Route::get('aprobacion-inscripciones', 'InscripcionesController@inscripcionesParaAprobacion');

    //Aspirantes
    Route::post('aspirantes','AspiranteController@store')->middleware('permission:Registrar aspirantes');
    Route::put('aspirantes/{id}','AspiranteController@update')->middleware('permission:Editar aspirantes');
    Route::delete('aspirantes/{id}','AspiranteController@destroy')->middleware('permission:Eliminar aspirantes');
    Route::post('aspirantes/filtrar', 'AspiranteController@index')->middleware('permission:Ver aspirantes');
    Route::get('aspirantes/{id}', 'AspiranteController@show')->middleware('permission:Ver aspirantes');
    Route::get('aspirantes/comprobante/{id}', 'AspiranteController@comprobanteInscripcion')->middleware('permission:Imprimir comprobante de inscripción aspirantes');
    Route::post('aspirantes/sincronizar', 'AspiranteController@sincronizar')->middleware('permission:Ver aspirantes');
    Route::post('aspirantes/configurar', 'AspiranteController@configurarFechas')->middleware('permission:Configurar fechas para aspirantes');
    Route::post('aspirantes/configurar-por-estado', 'AspiranteController@configurarFechasEstado')->middleware('permission:Configurar fechas para aspirantes');
    Route::get('aspirantes/configurar/{plantel_id}', 'AspiranteController@obtenerFechasConfiguracion')->middleware('permission:Configurar fechas para aspirantes');

    //Alumnos
    Route::post('alumnos/filtrar', 'AlumnoController@index');
    Route::get('alumnos/curp/{curp}', 'AlumnoController@show');
    Route::get('alumnos/foto/{curp}', 'AlumnoController@showFoto');
    Route::post('alumnos','AlumnoController@registrarAlumno');
    Route::put('alumnos/{id}','AlumnoController@update');
    Route::delete('alumnos/{id}','AlumnoController@destroy');
    Route::delete('baja-alumno/{id}', 'AlumnoController@darDeBaja');
    Route::get('alumnos-por-egresar/{plantel_id}', 'AlumnoController@alumnosPorEgresar');
    Route::post('alumnos-por-id', 'AlumnoController@alumnosPorId');
    Route::put('documentos-alumno/{id}', 'AlumnoController@sincronizarDocumentos');
    Route::post('cambiar-de-grupo', 'AlumnoController@cambiarGrupo');
    Route::get('credencial-alumno/{id}', 'CredencialController@imprimirCredencialAlumno');

    //Calificaciones alumno
    Route::get('calificaciones-alumno/{alumno_id}', 'CalificacionHistoricaController@calificacionesAlumno')->middleware('permission:Ver calificaciones historicas');
    Route::put('calificaciones-alumno/{alumno_id}', 'CalificacionHistoricaController@update')->middleware('permission:Editar calificaciones historicas');
    Route::post('calificaciones-alumno/{alumno_id}', 'CalificacionHistoricaController@store')->middleware('permission:Agregar calificaciones historicas');
    Route::post('calificacion-alumno-eliminar/{alumno_id}', 'CalificacionHistoricaController@eliminarCalificacionById')->middleware('permission:Eliminar calificaciones historicas');
    Route::post('calificaciones-alumno-eliminar', 'CalificacionHistoricaController@eliminarCalificacionesCarreraUac')->middleware('permission:Eliminar calificaciones historicas');

    //Consultar o sinzronizar calificaciones
    Route::get('calificaciones-alumno-revalidacion/{id}', 'CalificacionController@verCalificacionesAlumnoRevalidacion');
    Route::post('calificaciones-alumno-revalidacion/{id}', 'CalificacionController@editarCalificacionesTransito');
    Route::post('sincronizar-calificaciones-para-certificado', 'CalificacionController@calificacionesCompetenciasParaCertificado');

    //Catálogos
    Route::get('catalogos/periodos', 'PeriodoController@catalogo');
    Route::get('catalogos/carreras/{plantel_id?}', 'CarreraController@catalogo');
    Route::get('catalogos/documentos-inscripciones', 'InscripcionesController@documentos');
    Route::get('catalogos/planteles/{estado_id}', 'PlantelController@index');
    Route::get('catalogos/estados', 'EstadoController@index');
    Route::get('catalogos/municipios/{estado_id}', 'MunicipioController@index');
    Route::get('catalogos/instituciones-seguro', 'InstitucionSeguroController@index');
    Route::post('carrera-uac/filtrar', 'CarreraUacController@uacFilter');
    Route::post('carrera-uac/sin-calificar/filtrar', 'CarreraUacController@uacSinCalificarFilter');
    Route::post('carrera-uac/reprobado/filtrar', 'CarreraUacController@uacReprobadoFilter');
    Route::resource('catalogos/tipo-plaza', 'TipoPlazaController', ['except' => ['create', 'edit']]);
    Route::resource('catalogos/grado-estudio', 'GradoEstudioController', ['except' => ['create', 'edit']]);
    Route::resource('catalogos/documentos-docente', 'DocumentoDocenteController', ['except' => ['create', 'edit']]);
    Route::get('catalogos/plantel-id/{plantel_id}', 'PlantelController@getPlantelById');
    Route::post('catalogos/config-periodos-certificacion', 'PeriodoController@getConfigCtePeriodos');
    Route::get('catalogos/generaciones', 'PeriodoController@catalogoGeneraciones');

    //UAC
    Route::get('uac-optativas/{id}', 'UacController@optativasParaCarrera');
    Route::post('uac-reinscripcion', 'UacController@materiasReinscripcion');
    Route::get('uac-alumno-irregular/{id}', 'UacController@asignaturasParaAlumnoIrregular')->middleware('permission:Inscribir alumnos a grupo');
    Route::get('uac-inscrito-alumno-irregular/{id}', 'UacController@asignaturasInscritasAlumnoIrregular')->middleware('permission:Inscribir alumnos a grupo');

    //Notificaciones
    Route::get('notificaciones', 'UsuarioController@notificaciones');
    Route::delete('notificaciones', 'UsuarioController@marcarComoLeido');

    //Inscripciones
    Route::post('configuracion-inscripcion-grupo/{id}', 'InscripcionesController@configurarPeriodoInscripciones')->middleware('permission:Configurar fecha inscripcion por grupo');
    Route::post('configuracion-inscripcion-general/{id}', 'InscripcionesController@configurarInscripcionesGenerales')->middleware('permission:Configurar fecha inscripcion por plantel');
    Route::get('grupos-disponibles-por-alumno','InscripcionesController@gruposDisponiblesInscripcionPorAlumno');
    Route::post('inscripcion-por-alumno/{id}', 'InscripcionesController@inscripcionPorAlumno')->middleware('role:ROLE_ALUMNO');
    Route::post('incripcion-control-escolar', 'InscripcionesController@inscripcionPorControlEscolar')->middleware('permission:Inscribir alumnos a grupo');
    Route::post('inscripcion-alumno-irregular-asignatura','InscripcionesController@inscripcionAlumnoIrregularAsignatura')->middleware('permission:Inscribir alumnos a grupo');
    Route::post('aprobar-inscripcion-alumno', 'InscripcionesController@aprobarInscripcionAlumno')->middleware('permission:Inscribir alumnos a grupo');
    Route::get('grupos-disponibles-cambio-alumno/{id}', 'InscripcionesController@gruposDisponiblesParaCambioDeUnAlumno')->middleware('permission:Inscribir alumnos a grupo');
    Route::get('grupos-disponibles-cambio/{id}', 'InscripcionesController@gruposDisponiblesParaCambio')->middleware('permission:Inscribir alumnos a grupo');
    Route::post('cambios-de-grupo', 'InscripcionesController@cambiarAlumnosDeGrupo')->middleware('permission:Inscribir alumnos a grupo');
    Route::post('quitar-de-grupo/{id}', 'InscripcionesController@quitarAlumnoDeGrupo');

    //Boletas
    Route::post('boletas-por-grupo/{grupo_id}', 'BoletaController@boletaPorGrupo');
    Route::post('boletas-por-semestre', 'BoletaController@boletaPorSemestre');
    Route::get('boleta-por-alumno/{id}', 'BoletaController@boletaPorAlumno');
		Route::get('boletas-por-alumno/{id}', 'BoletaController@boletasPorAlumno');
    Route::get('historial-academico/{id}','BoletaController@historialAcademicoPorAlumno');
    Route::get('historial-academico-grupo/{id}','BoletaController@historialAcademicoPorGrupo');

    //Reportes
    Route::get('lista-asistencia/{grupo_id}/{carrera_uac_id}', 'ReportesController@listaAsistencia');
    Route::get('lista-asistencia/{grupo_id}', 'ReportesController@listaAsistencia');
    Route::get('docentes-grupo/{grupo_id}', 'ReportesController@docentesPorGrupo');
    Route::post('estadisticas-grupo-parcial/{grupo_id}', 'ReportesController@reporteCalificacionesParcial');
    Route::get('reporte-alumnos/{grupo_id}', 'ReportesController@reporteAlumnos');
    Route::post('reporte-alumnos-filtro', 'ReportesController@reporteAlumnosFiltro');
    Route::post('reporte-poblacion-alumnos', 'ReportesController@reportePoblacionAlumnos');
		Route::post('reporte-poblacion-alumnos-grupo', 'ReportesController@reportePoblacionAlumnosPorGrupo');
    Route::post('reporte-alumnos-reprobados/{grupo_id}', 'ReportesController@reporteReprobados');
    Route::post('constancia/{id}', 'ReportesController@constanciaPorAlumno');
    Route::post('constancia-grupo/{id}', 'ReportesController@constanciaPorGrupo');
		Route::post('reportes/alumnos-por-grupo', 'ReportesController@reporteAlumnosPorGrupo');
    Route::get('reportes/concentrado-semestral/{id}', 'ReportesController@concentradoSemestral');
    Route::get('reportes/evaluacion-semestral/{id}', 'ReportesController@evaluacionSemestral');
    Route::post('reportes/aspirantes', 'ReportesController@reporteAspirantes');

    //Configuración de fechas de inicio y fin por periodo y estado
    Route::get('config-fechas-periodo/{estadoId}/{periodoId}', 'ConfigFechaPeriodoController@index');
    Route::put('config-fechas-periodo', 'ConfigFechaPeriodoController@update')->middleware('permission:Configurar fechas de inicio y fin de periodo por estado');

    //Configuración fechas ordinarias/extraordinarias
    Route::post('config-evaluacion-ordinaria', 'ConfigEvaluacionOrdinariaParcialController@store')->middleware('permission:Configuración de evaluaciones');
    Route::get('evaluacion-ordinaria-plantel/{cct}', 'ConfigEvaluacionOrdinariaParcialController@showWithPlantel');

    //Configuraciones fechas
    Route::get('config-fechas-evaluaciones/{cct}', 'ConfigEvaluacionOrdinariaParcialController@showWithPlantel');

    //Configuración recuperacion parciales
    Route::post('config-recuperacion-parcial', 'ConfigRecuperacionParcialController@store')->middleware('permission:Configuracion de correccion parcial');
    Route::get('recuperacion-parcial-plantel/{cct}', 'ConfigRecuperacionParcialController@showWithPlantel');

    //Configuración recursamiento intersemestral
    Route::post('config-recursamiento-intersemestral', 'ConfigRecursamientoIntersemestralController@store')->middleware('permission:Configuracion de recursamiento intersemestral');
    Route::get('recursamiento-intersemestral-plantel/{cct}', 'ConfigRecursamientoIntersemestralController@showWithPlantel');

    //Configuración recursamiento semestral
    Route::post('config-recursamiento-semestral', 'ConfigRecursamientoSemestralController@store')->middleware('permission:Configuracion de recursamiento semestral');
    Route::get('recursamiento-semestral-plantel/{cct}', 'ConfigRecursamientoSemestralController@showWithPlantel');

    //Configuración calificar calificaciones historicas
    Route::post('config-calificar-historico', 'ConfigCalificarHistoricoController@store')->middleware('permission:Configuracion de modificaciones calificaciones historicas');
    Route::get('calificar-historico-plantel/{cct}', 'ConfigCalificarHistoricoController@showWithPlantel');

    //Carga calificaciones alumno from control escolar
    Route::post('calificaciones-uac', 'CalificacionUacController@storeFromControlEscolar')->middleware('permission:Cargar calificaciones docente');

    //Carga calificaciones recursamiento intersemestral from control
    Route::post('calificaciones-asignatura-intersemestral', 'CalificacionUacController@storeIntersemestralFromControlEscolar')->middleware('permission:Cargar calificaciones recursamiento intersemestral');

    //Carga calificaciones recursamiento semestral from control
    Route::post('calificaciones-uac-recursamiento-semestral', 'CalificacionUacController@storeSemestralFromControlEscolar')->middleware('permission:Cargar calificaciones recursamiento semestral');

    //Carga calificaciones extraordinario from control
    Route::post('calificaciones-extraordinario', 'CalificacionUacController@storeCalificacionesExtraordinarioFromControlEscolar')->middleware('permission:Cargar calificaciones extraordinario');

    //Carga calificaciones extraordinarias from control
    Route::post('calificaciones-uac-extraordinario', 'CalificacionUacController@storeExtraordinarioFromControlEscolar')->middleware('permission:Cargar calificaciones extraordinario');

    //Carga calificaciones alumno from docente
    Route::post('calificaciones-uac-from-docente', 'CalificacionUacController@store')->middleware('permission:Cargar calificaciones docente');

    //Bitacora evaluacion
    Route::post('bitacora-evaluacion', 'BitacoraEvaluacionController@store')->middleware('permission:Cargar bitacora alumno');

    //Bitacora evaluacion
    Route::post('bitacora-evaluacion-recursamiento-semestral', 'BitacoraEvaluacionController@storeFromRS')->middleware('permission:Cargar bitacora alumno');

    //Rubricas docente_asignatura
    Route::post('rubricas-evaluacion', 'RubricasEvaluacionController@store')->middleware('permission:Crear rubricas evaluacion');
    Route::put('rubricas-evaluacion/{id}', 'RubricasEvaluacionController@update')->middleware('permission:Editar rubricas evaluacion');
    Route::get('rubricas-evaluacion-asignatura/{id}', 'RubricasEvaluacionController@showWithAsignatura')->middleware('permission:Ver rubricas evaluacion');
    Route::delete('rubricas-evaluacion/{id}', 'RubricasEvaluacionController@destroy')->middleware('permission:Eliminar rubricas evaluacion');

    //Acuse envio calificaciones
    Route::post('acta-calificacion', 'CalificacionUacController@createAcuse');

    //Docente
    Route::get('docentes/{id}', 'DocenteController@show')->middleware('permission:Ver docente');
    Route::post('docentes', 'DocenteController@store')->middleware('permission:Crear docente');
    Route::put('docentes/{id}', 'DocenteController@update')->middleware('permission:Editar docente');
    Route::delete('docentes/{id}', 'DocenteController@destroy')->middleware('permission:Eliminar docente');
    Route::post('docentes/filtrar','DocenteController@getDocentes')->middleware('permission:Buscar docente');

    Route::post('docenteBaja/{id}','DocenteController@docenteBaja')->middleware('permission:Desactivar docente');
    Route::post('docenteAlta/{id}','DocenteController@docenteAlta')->middleware('permission:Reingreso de docente');
    //Route::post('docentePermiso/{id}','DocenteController@docenteBajaPermiso')->middleware('permission:Dar de baja por permiso a docente');

    //Asignaciones docente from control
    Route::get('docentes-plantilla/{id}', 'DocentePlantillaController@show')->middleware('permission:Ver detalles de asignacion');
    Route::post('docentes-plantilla', 'DocentePlantillaController@store')->middleware('permission:Crear asignacion de docente');
    Route::put('docentes-plantilla/{id}', 'DocentePlantillaController@update')->middleware('permission:Editar asignacion de docente');
    Route::delete('docentes-plantilla/{id}', 'DocentePlantillaController@destroy')->middleware('permission:Eliminar asignacion de docente');
    Route::post('docentes-plantilla-terminacion/{id}', 'DocentePlantillaController@plantillaTerminacion')->middleware('permission:Terminar asignacion de docente');

    //Asignaturas docente from control
    Route::get('docente-asignaturas/{id}', 'DocenteAsignaturaController@asignaturasDocenteFromControlEscolar')->middleware('permission:Ver detalles de asignatura');
    Route::delete('docente-asignaturas/{id}', 'DocenteAsignaturaController@destroy')->middleware('permission:Eliminar asignatura de docente');
    Route::post('docente-asignaturas', 'DocenteAsignaturaController@store')->middleware('permission:Crear asignatura de docente');
    Route::put('docente-asignaturas/{id}', 'DocenteAsignaturaController@update')->middleware('permission:Editar asignatura de docente');
    Route::get('docentes-asignaturas', 'DocenteAsignaturaController@getDocentesByAsignatura')->middleware('permission:Ver detalles de asignatura');

    //Asignaciones docente
    Route::get('asignaciones-docente', 'DocentePlantillaController@plantillasFromDocente')->middleware('permission:Ver mis asignaciones');
    Route::get('asignaciones-docente/{id}', 'DocentePlantillaController@plantillasFromDocenteById')->middleware('permission:Ver mis asignaciones');

    //Asignaturas docente from docente
    Route::get('asignaturas-from-docente/{id}', 'DocenteAsignaturaController@asignaturasFromDocente')->middleware('permission:Ver detalles de mis asignaturas');

    /* Recursamientos */

    //Alumnos para tipo recursamiento
    Route::post('alumnos/filtrar/candidato/recursamiento', 'AlumnoController@getByRecursamiento')->middleware('permission:Ver Alumnos candidatos para recursamiento');

    //Alumnos para extraodinarios
    Route::post('alumnos/filtrar/candidato/extraordinario', 'AlumnoController@getByExtraordinario')->middleware('permission:Ver Alumnos candidatos para extraordinario');

    //Buscar recursamientos
    Route::post('recursamientos/filtrar', 'RecursamientoController@getRecursamiento')->middleware('permission:Ver recursamientos');

    /* Recursamiento semestral */

    //Crear grupo recursamiento semestral
    Route::post('recursamiento-semestral', 'RecursamientoSemestralController@store')->middleware('permission:Agregar recursamiento semestral');

    //Editar grupo recursamiento semestral
    Route::put('recursamiento-semestral/{id}', 'RecursamientoSemestralController@update')->middleware('permission:Editar recursamiento semestral');

    //Eliminar grupo recursamiento semestral
    Route::delete('recursamiento-semestral/{id}', 'RecursamientoSemestralController@destroy')->middleware('permission:Eliminar recursamiento semestral');

    //Ver recursamiento semestral
    Route::get('recursamiento-semestral/{id}', 'RecursamientoSemestralController@show')->middleware('permission:Ver detalles recursamiento semestral');

    //Ver recursamiento semestral docente
    //Route::get('recursamiento-semestral-docente/{id}', 'RecursamientoSemestralController@showFromDocente')->middleware('permission:Ver detalles de mi recursamiento semestral');

    /* Recursamiento intersemestral */

    //Crear asignatura recursamiento intersemestral
    Route::post('asignatura-intersemestral', 'AsignaturaRecursamientoIntersemestralController@store')->middleware('permission:Agregar asignatura recursamiento intersemestral');

    //Editar asignatura recursamiento intersemestral
    Route::put('asignatura-intersemestral/{id}', 'AsignaturaRecursamientoIntersemestralController@update')->middleware('permission:Editar asignatura recursamiento intersemestral');

    //Alumnos para tipo recursamiento
    Route::post('alumnos/filtrar/recursamiento-intersemestral', 'AlumnoController@getByRecursamiento');

    //Eliminar Asignaturas recursamiento intersemestral from control escolar
    Route::delete('asignatura-intersemestral/{id}', 'AsignaturaRecursamientoIntersemestralController@destroy')->middleware('permission:Eliminar asignatura recursamiento intersemestral');

    //Ver Asignaturas recursamiento intersemestral
    Route::get('asignatura-intersemestral/{id}', 'AsignaturaRecursamientoIntersemestralController@show')->middleware('permission:Ver detalles de asignatura recursamiento intersemestral');

    //Ver Asignaturas recursamiento intersemestral from docente
    //Route::get('asignatura-intersemestral-docente/{id}', 'AsignaturaRecursamientoIntersemestralController@asignaturasRecursamientoIntersemestralFromDocente')->middleware('permission:Ver detalles de asignatura recursamiento intersemestral');

    /* extraordinario */

    //Crear grupo extraordinario
    Route::post('extraordinario', 'ExtraordinarioController@store')->middleware('permission:Agregar extraordinario');

    //Editar grupo extraordinario
    Route::put('extraordinario/{id}', 'ExtraordinarioController@update')->middleware('permission:Editar extraordinario');

    //Eliminar grupo extraordinario
    Route::delete('extraordinario/{id}', 'ExtraordinarioController@destroy')->middleware('permission:Eliminar extraordinario');

    //Ver extraordinario
    Route::get('extraordinario/{id}', 'ExtraordinarioController@show')->middleware('permission:Ver detalles extraordinario');

    //Ver extraordinario docente
    //Route::get('extraordinario-docente/{id}', 'ExtraordinarioController@showFromDocente')->middleware('permission:Ver detalles de mi extraordinario');

    //Rutas para operaciones internas
    Route::get('catalogos/idsPlanteles/{estado_id}', 'PlantelController@plantelesDeUnEstadoId');


});

/*Route::group([
    'namespace' => 'Auth',
    'prefix' => 'password'
], function () {
    Route::post('create', 'ApiPasswordResetController@create');
    Route::post('reset', 'ApiPasswordResetController@reset');
    Route::post('validate', 'ApiPasswordResetController@find');
});*/


