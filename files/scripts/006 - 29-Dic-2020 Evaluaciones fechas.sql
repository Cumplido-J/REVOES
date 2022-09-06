/* CREATE TABLE IF NOT EXISTS `sisec`.`evaluaciones_ordinarias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_final` DATE NOT NULL,
  `periodo_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluaciones_ordinarias_periodo_idx` (`periodo_id` ASC),
  CONSTRAINT `fk_evaluaciones_ordinarias_periodo`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`evaluaciones_extraordinarias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_final` DATE NOT NULL,
  `periodo_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluaciones_ordinarias_periodo_idx` (`periodo_id` ASC),
  CONSTRAINT `fk_evaluaciones_ordinarias_periodo0`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`evaluaciones_ordinarias_has_plantel` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `evaluaciones_ordinarias_id` INT(11) NOT NULL,
  `plantel_id` INT(11) NOT NULL,
  `estatus` INT NOT NULL,
  `comentario` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluaciones_ordinarias_has_plantel_evaluaciones_ordinar_idx` (`evaluaciones_ordinarias_id` ASC),
  INDEX `fk_evaluaciones_ordinarias_has_plantel_plantel1_idx` (`plantel_id` ASC),
  CONSTRAINT `fk_evaluaciones_ordinarias_has_plantel_evaluaciones_ordinarias`
    FOREIGN KEY (`evaluaciones_ordinarias_id`)
    REFERENCES `sisec`.`evaluaciones_ordinarias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_evaluaciones_ordinarias_has_plantel_plantel1`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
    
CREATE TABLE IF NOT EXISTS `sisec`.`evaluaciones_extraordinarias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_final` DATE NOT NULL,
  `periodo_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluaciones_ordinarias_periodo_idx` (`periodo_id` ASC),
  CONSTRAINT `fk_evaluaciones_ordinarias_periodo0`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

  
CREATE TABLE IF NOT EXISTS `sisec`.`evaluaciones_extraordinarias_plantel` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `evaluaciones_extraordinarias_id` INT(11) NOT NULL,
  `plantel_id` INT(11) NOT NULL,
  `estatus` INT NOT NULL DEFAULT 1,
  `comentario` TEXT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluaciones_extraordinarias_plantel_evaluaciones_extrao_idx` (`evaluaciones_extraordinarias_id` ASC),
  INDEX `fk_evaluaciones_extraordinarias_plantel_plantel1_idx` (`plantel_id` ASC),
  CONSTRAINT `fk_evaluaciones_extraordinarias_plantel_evaluaciones_extraord1`
    FOREIGN KEY (`evaluaciones_extraordinarias_id`)
    REFERENCES `sisec`.`evaluaciones_extraordinarias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_evaluaciones_extraordinarias_plantel_plantel1`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
 */

/* update */

CREATE TABLE IF NOT EXISTS `sisec`.`config_evaluaciones_ordinarias_parcial` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `parcial` ENUM('1', '2', '3')  NOT NULL,
  `fecha_inicio` DATE NOT NULL,
  `fecha_final` DATE NOT NULL,
  `estatus` INT NOT NULL,
  `comentario` TEXT NULL,
  `plantel_id` INT(11) NOT NULL,
  `periodo_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluaciones_parcial_plantel1_idx` (`plantel_id` ASC),
  INDEX `fk_config_evaluaciones_ordinarias_parcial_periodo1_idx` (`periodo_id` ASC),
  CONSTRAINT `fk_evaluaciones_parcial_plantel1`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_config_evaluaciones_ordinarias_parcial_periodo1`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`config_evaluaciones_extraordinarias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_inicio` DATE NOT NULL,
  `fecha_final` DATE NOT NULL,
  `estatus` INT NOT NULL,
  `comentario` TEXT NULL,
  `plantel_id` INT(11) NOT NULL,
  `periodo_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_evaluaciones_parcial_plantel1_idx` (`plantel_id` ASC),
  INDEX `fk_config_evaluaciones_ordinarias_parcial_periodo1_idx` (`periodo_id` ASC),
  CONSTRAINT `fk_evaluaciones_parcial_plantel10`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_config_evaluaciones_ordinarias_parcial_periodo10`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);