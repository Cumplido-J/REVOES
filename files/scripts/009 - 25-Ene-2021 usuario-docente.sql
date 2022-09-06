CREATE TABLE IF NOT EXISTS `sisec`.`usuario_docente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `docente_id` INT(11) NOT NULL,
  `usuario_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_docente_usuario_docente1_idx` (`docente_id` ASC),
  INDEX `fk_docente_usuario_usuario1_idx` (`usuario_id` ASC),
  CONSTRAINT `fk_docente_usuario_docente1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `sisec`.`docente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_docente_usuario_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `sisec`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);