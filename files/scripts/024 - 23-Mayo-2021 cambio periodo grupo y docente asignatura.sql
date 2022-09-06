use sisec;

/*SE CAMBIAN A LOS ALUMNOS AL GRUPO ORIGINAL*/
UPDATE alumno_grupo SET grupo_periodo_id = 62 WHERE grupo_periodo_id = 258;
/*SE CAMBIAN LAS CALIFICACIONES AL GRUPO ORIGINAL*/
UPDATE calificacion_alumno_uac SET periodo_id = 16, grupo_periodo_id = 62 WHERE grupo_periodo_id = 258;
/*SE ACTUALIZA EL DOCENTE_ASIGNATURA AL GRUPO ORIGINAL*/
UPDATE docente_asignatura SET grupo_periodo_id = 62, periodo_id = 16 WHERE grupo_periodo_id = 258;
/*SE ELIMINA EL GRUPO QUE SE CREÓ */
DELETE FROM grupo_periodo WHERE id = 258;

/*SE DESVINCULAN LOS ALUMNOS DEL GRUPO QUE SE CREÓ*/
DELETE FROM alumno_grupo WHERE grupo_periodo_id = 259;
/*SE CAMBIAN LAS CALIFICACIONES AL GRUPO ORIGINAL*/
UPDATE calificacion_alumno_uac SET periodo_id = 16, grupo_periodo_id = 50 WHERE grupo_periodo_id = 259;
/*SE ACTUALIZA EL DOCENTE_ASIGNATURA AL GRUPO ORIGINAL*/
UPDATE docente_asignatura SET grupo_periodo_id = 50, periodo_id = 16 WHERE grupo_periodo_id = 259;
/*SE ELIMINA EL GRUPO QUE SE CREÓ */
DELETE FROM grupo_periodo WHERE id = 259;