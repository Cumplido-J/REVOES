USE `sisec`;

CREATE TABLE `sisec`.`carrera_uac` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `semestre` INT NOT NULL,
  `carrera_id` INT NOT NULL,
  `uac_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `uac_id_idx` (`uac_id` ASC),
  INDEX `carrera_id_idx` (`carrera_id` ASC),
  CONSTRAINT `uac_id`
    FOREIGN KEY (`uac_id`)
    REFERENCES `sisec`.`uac` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `carrera_id`
    FOREIGN KEY (`carrera_id`)
    REFERENCES `sisec`.`carrera` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `sisec`.`grupo_periodo` 
ADD COLUMN `fecha_inicio` DATE NULL AFTER `status`,
ADD COLUMN `fecha_fin` DATE NULL AFTER `fecha_inicio`,
ADD COLUMN `fecha_inicio_irregular` DATE NULL AFTER `fecha_fin`,
ADD COLUMN `fecha_fin_irregular` DATE NULL AFTER `fecha_inicio_irregular`,
ADD COLUMN `tipo_inscripcion` ENUM('alumno', 'control escolar', 'ambos') NULL AFTER `fecha_fin_irregular`,
CHANGE COLUMN `accion` `accion` ENUM('activar', 'editar', 'eliminar') NULL,
CHANGE COLUMN `status` `status` ENUM('activo', 'inactivo', 'pendiente', 'rechazado') NOT NULL;

ALTER TABLE `sisec`.`grupo` 
CHANGE COLUMN `status` `status` ENUM('activo', 'inactivo', 'pendiente', 'rechazado') NOT NULL;

CREATE TABLE `sisec`.`calificacion_revalidacion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `alumno_id` INT(11) NOT NULL,
  `cct` VARCHAR(45) NOT NULL,
  `tipo_asignatura` VARCHAR(45) NOT NULL,
  `calificacion` INT(3) NOT NULL,
  `creditos` INT(11) NULL,
  `horas` INT(11) NULL,
  `periodo_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `periodo_id_revalidacion`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
CONSTRAINT `alumno_id_revalidacion`
    FOREIGN KEY (`alumno_id`)
    REFERENCES `sisec`.`alumno` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

DROP TABLE `sisec`.`alumno_uac`;

CREATE TABLE `sisec`.`calificacion_alumno_uac` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `alumno_id` INT(11) NOT NULL,
  `carrera_uac_id` INT(11) NOT NULL,
  `grupo_periodo_id` INT(11),
  `periodo_id` INT(11),
  `plantel_id` INT(11) NOT NULL,
  `calificacion` FLOAT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `alumno_uac_alumno_id`
    FOREIGN KEY (`alumno_id`)
    REFERENCES `sisec`.`alumno` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alumno_uac_grupo_periodo_id`
    FOREIGN KEY (`grupo_periodo_id`)
    REFERENCES `sisec`.`grupo_periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alumno_uac_periodo_id`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alumno_uac_carrera_uac_id`
    FOREIGN KEY (`carrera_uac_id`)
    REFERENCES `sisec`.`carrera_uac` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alumno_uac_plantel_id`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
  ON UPDATE NO ACTION);

CREATE TABLE `sisec`.`alumno_uac_grupo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `alumno_id` INT(11) NOT NULL,
  `grupo_periodo_id` INT(11) NOT NULL,
  `carrera_uac_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `alumno_uac_grupo_alumno_id`
    FOREIGN KEY (`alumno_id`)
    REFERENCES `sisec`.`alumno` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alumno_uac_grupo_grupo_periodo_id`
    FOREIGN KEY (`grupo_periodo_id`)
    REFERENCES `sisec`.`grupo_periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alumno_uac_grupo_carrera_uac_id`
    FOREIGN KEY (`carrera_uac_id`)
    REFERENCES `sisec`.`carrera_uac` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `sisec`.`documento_inscripcion` (
`id` INT NOT NULL AUTO_INCREMENT,
`nombre` VARCHAR(45) NOT NULL,
PRIMARY KEY (`id`));

CREATE TABLE `sisec`.`documento_inscripcion_alumno` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `alumno_id` INT(11) NOT NULL,
  `documento_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `sisec`.`documento_inscripcion_alumno` 
ADD CONSTRAINT `fk_documento_id`
  FOREIGN KEY (`documento_id`)
  REFERENCES `sisec`.`documento_inscripcion` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_alumno_id_documentos`
  FOREIGN KEY (`alumno_id`)
  REFERENCES `sisec`.`alumno` (`usuario_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

INSERT INTO `documento_inscripcion` VALUES (1,'Acta de Nacimiento'),(2,'CURP'),(3,'Certificado de secundaria'),(4,'Comprobante de domicilio');

ALTER TABLE `sisec`.`alumno_grupo` 
DROP FOREIGN KEY `alumno_id`;

ALTER TABLE `sisec`.`alumno_grupo` 
ADD CONSTRAINT `alumno_id`
  FOREIGN KEY (`alumno_id`)
  REFERENCES `sisec`.`alumno` (`usuario_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `sisec`.`alumno_grupo` 
ADD COLUMN `status` ENUM('Inscrito', 'En espera') NOT NULL AFTER `grupo_periodo_id`;

