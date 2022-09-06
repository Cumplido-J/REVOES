CREATE TABLE IF NOT EXISTS `sisec`.`acuse_docente_carga_calificaciones_uac` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATETIME NOT NULL,
  `data` TEXT NOT NULL,
  `docente_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_acuse_docente_carga_calificaciones_uac_docente_idx` (`docente_id` ASC),
  CONSTRAINT `fk_acuse_docente_carga_calificaciones_uac_docente`
    FOREIGN KEY (`docente_id`)
    REFERENCES `sisec`.`docente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);