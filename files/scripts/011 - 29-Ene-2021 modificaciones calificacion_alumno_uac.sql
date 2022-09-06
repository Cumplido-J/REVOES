/* CAMBIOS EN LA TABLA CALIFICACION_ALUMNO */
USE sisec;

ALTER TABLE `sisec`.`calificacion_alumno_uac` 
ADD COLUMN `docente_id` INT(11) NULL;

ALTER TABLE `sisec`.`calificacion_alumno_uac` 
ADD CONSTRAINT `docente_calificacion_alumno_uac`
  FOREIGN KEY (`docente_id`) 
  REFERENCES `sisec`.`docente` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `sisec`.`calificacion_alumno_uac` 
ADD COLUMN `parcial` ENUM('1', '2', '3', '4', '5', '6') NOT NULL;

