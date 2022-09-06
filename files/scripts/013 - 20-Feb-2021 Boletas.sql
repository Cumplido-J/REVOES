USE sisec;

ALTER TABLE `sisec`.`periodo`
ADD COLUMN `nombre_con_mes` VARCHAR(45) NOT NULL AFTER `nombre`;

INSERT INTO `sisec`.`plantel_carrera` (`plantel_id`, `carrera_id`) VALUES ('46', '8');
UPDATE `sisec`.`carrera` SET `total_creditos` = '360' WHERE (`id` = '8');

ALTER TABLE `sisec`.`plantel` 
ADD COLUMN `calle` VARCHAR(125) NOT NULL AFTER `opcion_educativa_id`,
ADD COLUMN `codigo_postal` VARCHAR(5) NOT NULL AFTER `calle`,
ADD COLUMN `ciudad` VARCHAR(50) NOT NULL AFTER `codigo_postal`,
ADD COLUMN `telefono` VARCHAR(10) NULL AFTER `ciudad`,
ADD COLUMN `email` VARCHAR(45) NULL AFTER `telefono`;

CREATE TABLE `sisec`.`personal_plantel` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `plantel_id` INT(11) NOT NULL,
  `nombre_director` VARCHAR(100) NOT NULL,
  `título_director` VARCHAR(10) NULL,
  `cargo_director` VARCHAR(100) NOT NULL,
  `genero_director` VARCHAR(10) NOT NULL,
  `nombre_control_escolar` VARCHAR(100) NOT NULL,
  `titulo_control_escolar` VARCHAR(10) NULL,
  `cargo_control_escolar` VARCHAR(100) NOT NULL,
  `genero_control_escolar` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `plantel_datos_id_idx` (`plantel_id` ASC),
  CONSTRAINT `plantel_datos_id`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

UPDATE `sisec`.`carrera` SET `total_creditos` = '360' WHERE (`id` = '1');
UPDATE `sisec`.`carrera` SET `total_creditos` = '360' WHERE (`id` = '29');

/*TEMPORAL*/
/*INSERT INTO `sisec`.`calificacion_revalidacion` (`alumno_id`, `cct`, `tipo_asignatura`, `calificacion`, `creditos`, `horas`, `periodo_id`) VALUES ('227520', 'Colegio de Bachilleres Número 13', 'a', '10', '8', '12', '13');
INSERT INTO `sisec`.`calificacion_revalidacion` (`alumno_id`, `cct`, `tipo_asignatura`, `calificacion`, `creditos`, `horas`, `periodo_id`) VALUES ('227520', 'Colegio de Bachilleres Número 13', 'a', '10', '5', '12', '13');
INSERT INTO `sisec`.`calificacion_revalidacion` (`alumno_id`, `cct`, `tipo_asignatura`, `calificacion`, `creditos`, `horas`, `periodo_id`) VALUES ('227520', 'Colegio de Bachilleres Número 13', 'a', '10', '6', '12', '13');
INSERT INTO `sisec`.`calificacion_revalidacion` (`alumno_id`, `cct`, `tipo_asignatura`, `calificacion`, `creditos`, `horas`, `periodo_id`) VALUES ('227520', 'Colegio de Bachilleres Número 13', 'a', '10', '8', '12', '13');
INSERT INTO `sisec`.`calificacion_revalidacion` (`alumno_id`, `cct`, `tipo_asignatura`, `calificacion`, `creditos`, `horas`, `periodo_id`) VALUES ('227520', 'Colegio de Bachilleres Número 13', 'a', '10', '7', '12', '14');
INSERT INTO `sisec`.`calificacion_revalidacion` (`alumno_id`, `cct`, `tipo_asignatura`, `calificacion`, `creditos`, `horas`, `periodo_id`) VALUES ('227520', 'Colegio de Bachilleres Número 13', 'a', '10', '10', '12', '14');*/
