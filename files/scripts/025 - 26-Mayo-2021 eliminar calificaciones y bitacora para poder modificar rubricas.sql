USE sisec;

/* eliminar calificaciones del docente id 164 de la materia id 4384 de la asignatura id 1402 => para poder eliminar/modificar rubricas */
delete from bitacora_evaluacion where docente_asignatura_id = 1402 and parcial = 2;
delete from calificacion_alumno_uac where carrera_uac_id = 4384 and docente_id = 164 and parcial = 2;