CREATE TABLE IF NOT EXISTS `sisec`.`evaluacion_extraordinaria` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `config_evaluaciones_extraordinarias_id` INT(11) NULL,
  `carrera_uac_id` INT(11) NOT NULL,
  `docente_id` INT(11) NOT NULL,
  `plantel_carrera_id` INT(11) NOT NULL,
  `estatus` ENUM('aceptado', 'denegado', 'terminado', 'cancelado') NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluacion_extraordinaria_config_evaluaciones_extraordin_idx` (`config_evaluaciones_extraordinarias_id` ASC),
  INDEX `fk_evaluacion_extraordinaria_carrera_uac1_idx` (`carrera_uac_id` ASC),
  INDEX `fk_evaluacion_extraordinaria_docente1_idx` (`docente_id` ASC),
  INDEX `fk_evaluacion_extraordinaria_plantel_carrera1_idx` (`plantel_carrera_id` ASC),
  CONSTRAINT `fk_evaluacion_extraordinaria_config_evaluaciones_extraordinar1`
    FOREIGN KEY (`config_evaluaciones_extraordinarias_id`)
    REFERENCES `sisec`.`config_evaluaciones_extraordinarias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_evaluacion_extraordinaria_carrera_uac1`
    FOREIGN KEY (`carrera_uac_id`)
    REFERENCES `sisec`.`carrera_uac` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_evaluacion_extraordinaria_docente1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `sisec`.`docente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_evaluacion_extraordinaria_plantel_carrera1`
    FOREIGN KEY (`plantel_carrera_id`)
    REFERENCES `sisec`.`plantel_carrera` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`evaluacion_extraordinaria_alumnos` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `evaluacion_extraordinaria_id` INT(11) NOT NULL,
  `alumno_id` INT(11) NOT NULL,
  `calificacion` FLOAT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluacion_extraordinaria_alumnos_evaluacion_extraordina_idx` (`evaluacion_extraordinaria_id` ASC),
  INDEX `fk_evaluacion_extraordinaria_alumnos_alumno1_idx` (`alumno_id` ASC),
  CONSTRAINT `fk_evaluacion_extraordinaria_alumnos_alumno1`
    FOREIGN KEY (`alumno_id`)
    REFERENCES `sisec`.`alumno` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_evaluacion_extraordinaria_alumnos_evaluacion_extraordinaria1`
    FOREIGN KEY (`evaluacion_extraordinaria_id`)
    REFERENCES `sisec`.`evaluacion_extraordinaria` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);