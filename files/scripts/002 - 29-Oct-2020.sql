CREATE TABLE `sisec`.`ciclo_escolar` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `fecha_inicio` DATE NULL,
  `fecha_fin` DATE NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `sisec`.`grupo` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `grupo` VARCHAR(5) NOT NULL,
    `semestre` INT NOT NULL,
    `turno` VARCHAR(5) NOT NULL,
    `plantel_carrera_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `plantel_carrera_id_idx` (`plantel_carrera_id` ASC),
    CONSTRAINT `plantel_carrera_id` FOREIGN KEY (`plantel_carrera_id`)
        REFERENCES `sisec`.`plantel_carrera` (`id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE `sisec`.`periodo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_fin` DATE NOT NULL,
  `ciclo_escolar_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `ciclo_escolar_id_idx` (`ciclo_escolar_id` ASC),
  CONSTRAINT `ciclo_escolar_id`
    FOREIGN KEY (`ciclo_escolar_id`)
    REFERENCES `sisec`.`ciclo_escolar` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `sisec`.`grupo_periodo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `periodo_id` INT NOT NULL,
  `grupo_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `grupo_id_idx2` (`grupo_id` ASC),
  INDEX `periodo_id_idx2` (`periodo_id` ASC),
  CONSTRAINT `grupo_id_grupo`
    FOREIGN KEY (`grupo_id`)
    REFERENCES `sisec`.`grupo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `periodo_id_periodo`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `sisec`.`grupo` 
ADD COLUMN `status` ENUM('activo', 'inactivo') NOT NULL AFTER `plantel_carrera_id`;

ALTER TABLE `sisec`.`grupo_periodo` 
ADD COLUMN `status` ENUM('activo', 'inactivo') NOT NULL AFTER `grupo_id`;
    
CREATE TABLE `sisec`.`alumno_grupo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `alumno_id` INT NOT NULL,
  `grupo_periodo_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `grupo_periodo_id_idx` (`grupo_periodo_id` ASC),
  INDEX `alumno_id_idx` (`alumno_id` ASC),
  CONSTRAINT `grupo_periodo_id`
    FOREIGN KEY (`grupo_periodo_id`)
    REFERENCES `sisec`.`grupo_periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alumno_id`
    FOREIGN KEY (`alumno_id`)
    REFERENCES `sisec`.`alumno` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);