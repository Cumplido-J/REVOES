USE sisec;

CREATE TABLE IF NOT EXISTS `sisec`.`rubricas_evaluacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parcial` ENUM('1', '2', '3') NOT NULL,
  `total_asistencias` INT NOT NULL,
  `asistencia` FLOAT NULL,
  `examen` FLOAT NULL,
  `practicas` FLOAT NULL,
  `tareas` FLOAT NULL,
  `docente_asignatura_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_rubricas_evaluacion_docente_asignatura_idx` (`docente_asignatura_id` ASC),
  CONSTRAINT `fk_rubricas_evaluacion_docente_asignatura`
    FOREIGN KEY (`docente_asignatura_id`)
    REFERENCES `sisec`.`docente_asignatura` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`bitacora_evaluacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parcial` ENUM('1', '2', '3') NOT NULL,
  `asistencia` FLOAT NOT NULL,
  `examen` FLOAT NULL,
  `practicas` FLOAT NULL,
  `tareas` VARCHAR(45) NULL,
  `alumno_id` INT(11) NOT NULL,
  `docente_asignatura_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_bitacora_evaluacion_alumno1_idx` (`alumno_id` ASC),
  INDEX `fk_bitacora_evaluacion_docente_asignatura1_idx` (`docente_asignatura_id` ASC),
  CONSTRAINT `fk_bitacora_evaluacion_alumno1`
    FOREIGN KEY (`alumno_id`)
    REFERENCES `sisec`.`alumno` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bitacora_evaluacion_docente_asignatura1`
    FOREIGN KEY (`docente_asignatura_id`)
    REFERENCES `sisec`.`docente_asignatura` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);