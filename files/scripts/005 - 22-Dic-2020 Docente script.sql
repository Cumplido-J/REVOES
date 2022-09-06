CREATE TABLE IF NOT EXISTS `sisec`.`docente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(40) NOT NULL,
  `primer_apellido` VARCHAR(45) NOT NULL,
  `segundo_apellido` VARCHAR(45) NULL,
  `correo` VARCHAR(60) NOT NULL,
  `correo_inst` VARCHAR(60) NULL,
  `num_nomina` VARCHAR(20) NULL,
  `curp` VARCHAR(18) NOT NULL,
  `rfc` VARCHAR(16) NOT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `genero` ENUM('m', 'f') NOT NULL,
  `direccion` VARCHAR(300) NOT NULL,
  `cp` VARCHAR(5) NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `fecha_ingreso` DATE NOT NULL,
  `fecha_baja` DATE NULL,
  `fecha_reingreso` DATE NULL,
  `tipo_sangre` ENUM('A-', 'A+', 'B-', 'B+', 'AB-', 'AB+', 'O-', 'O+') NULL,
  `docente_estatus` INT NOT NULL DEFAULT 1,
  `cat_municipio_nacimiento_id` INT(11) NOT NULL,
  `cat_municipio_direccion_id` INT(11) NOT NULL,
  `comentario` VARCHAR(500) NULL,
  `maximo_grado_estudio` VARCHAR(25) NOT NULL,
  `fecha_egreso` DATE NOT NULL,
  `cedula` VARCHAR(30) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_docente_cat_municipio1_idx` (`cat_municipio_nacimiento_id` ASC),
  INDEX `fk_docente_cat_municipio2_idx` (`cat_municipio_direccion_id` ASC),
  CONSTRAINT `fk_docente_cat_municipio1`
    FOREIGN KEY (`cat_municipio_nacimiento_id`)
    REFERENCES `sisec`.`cat_municipio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_docente_cat_municipio2`
    FOREIGN KEY (`cat_municipio_direccion_id`)
    REFERENCES `sisec`.`cat_municipio` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`cat_tipo_Plaza` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `sisec`.`plantilla_docente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_asignacion` DATE NOT NULL,
  `fecha_inicio_contrato` DATE NOT NULL,
  `fecha_fin_contrato` DATE NULL,
  `horas` TINYINT(10) NULL,
  `docente_id` INT NOT NULL,
  `cat_tipo_Plaza_id` INT NOT NULL,
  `plantel_id` INT(11) NOT NULL,
  `nombramiento_liga` TEXT NULL,
  `plantilla_estatus` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_plantilla_docente_docente1_idx` (`docente_id` ASC),
  INDEX `fk_plantilla_docente_cat_tipo_Plaza1_idx` (`cat_tipo_Plaza_id` ASC),
  INDEX `fk_plantilla_docente_plantel1_idx` (`plantel_id` ASC),
  CONSTRAINT `fk_plantilla_docente_docente1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `sisec`.`docente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_plantilla_docente_cat_tipo_Plaza1`
    FOREIGN KEY (`cat_tipo_Plaza_id`)
    REFERENCES `sisec`.`cat_tipo_Plaza` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_plantilla_docente_plantel1`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`docente_asignatura` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `grupo_periodo_id` INT NOT NULL,
  `periodo_id` INT NOT NULL,
  `plantilla_docente_id` INT NOT NULL,
  `carrera_uac_id` INT NOT NULL,
  `plantel_id` INT NOT NULL,
  `estatus` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_docente_asginatura_grupo1_idx` (`grupo_periodo_id` ASC),
  INDEX `fk_docente_asginatura_periodo1_idx` (`periodo_id` ASC),
  INDEX `fk_docente_asginatura_plantilla_docente1_idx` (`plantilla_docente_id` ASC),
  INDEX `fk_docente_asginatura_carrera_uac1_idx` (`carrera_uac_id` ASC),
  INDEX `fk_docente_asginatura_plantel1_idx` (`plantel_id` ASC),
  CONSTRAINT `fk_docente_asginatura_carrera_uac1`
    FOREIGN KEY (`carrera_uac_id`)
    REFERENCES `sisec`.`carrera_uac` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_docente_asginatura_grupo1`
    FOREIGN KEY (`grupo_periodo_id`)
    REFERENCES `sisec`.`grupo_periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_docente_asginatura_periodo1`
    FOREIGN KEY (`periodo_id`)
    REFERENCES `sisec`.`periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_docente_asginatura_plantel1`
    FOREIGN KEY (`plantel_id`)
    REFERENCES `sisec`.`plantel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_docente_asginatura_plantilla_docente1`
    FOREIGN KEY (`plantilla_docente_id`)
    REFERENCES `sisec`.`plantilla_docente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `sisec`.`documentos_docente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` TEXT NOT NULL,
  PRIMARY KEY (`id`));

INSERT INTO `documentos_docente` (nombre) VALUES ('CURP'), ('Copia de Acta de nacimiento'), ('RFC'), ('Copia de INE'), ('Certificado médico'), ('Curriculum vitae'), ('Copia de Comprobante de domicilio'),
('Copia de Documentos que acrediten su grado académico'), ('Resultados de exámenes de antidoping'), ('Cartilla militar');

CREATE TABLE `cat_grado_estudio` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `cat_grado_estudio` (nombre) VALUES ('Bachillerato'), ('Licenciatura'), ('Maestría'), ('Especialidad'), ('Doctorado');

CREATE TABLE IF NOT EXISTS `sisec`.`documentos_docente_has_docente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `documentos_docente_id` INT NOT NULL,
  `docente_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_documentos_docente_has_docente_documentos_docente1_idx` (`documentos_docente_id` ASC),
  INDEX `fk_documentos_docente_has_docente_docente1_idx` (`docente_id` ASC),
  CONSTRAINT `fk_documentos_docente_has_docente_documentos_docente1`
    FOREIGN KEY (`documentos_docente_id`)
    REFERENCES `sisec`.`documentos_docente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_documentos_docente_has_docente_docente1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `sisec`.`docente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);





