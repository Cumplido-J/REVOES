use sisec;

/* ELIMINAR ASIGNATURAS QUE NO SE IMPARTEN EN EL PERIODO Y SEMESTRE */
/* DOCENTE ID = 252 */
/* ELIMINAR CALIFICACIONES DE ASIGNATURA FISICA I ID 334 */
/*select * from calificacion_alumno_uac where grupo_periodo_id = 230 and carrera_uac_id = 4497;*/
delete from calificacion_alumno_uac where grupo_periodo_id = 230 and carrera_uac_id = 4497;
/* ELIMINAR RUBRICAS */
/*select * from rubricas_evaluacion where docente_asignatura_id = 334;*/
delete from rubricas_evaluacion where docente_asignatura_id = 334;
/* ELIMINAR BITACORA */
/*select * from bitacora_evaluacion where docente_asignatura_id = 334;*/
delete from bitacora_evaluacion where docente_asignatura_id = 334;
/* ELIMINAR ASIGNATURA */
/*select * from docente_asignatura where id = 334;*/
delete from docente_asignatura where id = 334;

/* ELIMINAR CALIFICACIONES DE ASIGNATURA FISICA I ID 332 */
/*select * from calificacion_alumno_uac where grupo_periodo_id = 230 and carrera_uac_id = 4495;*/
delete from calificacion_alumno_uac where grupo_periodo_id = 230 and carrera_uac_id = 4495;
/* ELIMINAR RUBRICAS */
/*select * from rubricas_evaluacion where docente_asignatura_id = 332;*/
delete from rubricas_evaluacion where docente_asignatura_id = 332;
/* ELIMINAR BITACORA */
/*select * from bitacora_evaluacion where docente_asignatura_id = 332;*/
delete from bitacora_evaluacion where docente_asignatura_id = 332;
/* ELIMINAR ASIGNATURA */
/*select * from docente_asignatura where id = 332;*/
delete from docente_asignatura where id = 332;

