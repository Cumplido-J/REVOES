USE sisec;

ALTER TABLE `sisec`.`bitacora_evaluacion` 
ADD COLUMN `carrera_uac_id` INT NOT NULL;
ALTER TABLE `sisec`.`bitacora_evaluacion`
ADD CONSTRAINT `fk_carrera_uac_id`
  FOREIGN KEY (`carrera_uac_id`)
  REFERENCES `sisec`.`carrera_uac` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  
ALTER TABLE `sisec`.`bitacora_evaluacion` 
ADD COLUMN `docente_id` INT NULL;
ALTER TABLE `sisec`.`bitacora_evaluacion`
ADD CONSTRAINT `fk_docente_id`
  FOREIGN KEY (`docente_id`)
  REFERENCES `sisec`.`docente` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
  

ALTER TABLE `sisec`.`bitacora_evaluacion` 
ADD COLUMN `plantel_id` INT NOT NULL;
ALTER TABLE `sisec`.`bitacora_evaluacion`
ADD CONSTRAINT `fk_plantel_id`
  FOREIGN KEY (`plantel_id`)
  REFERENCES `sisec`.`plantel` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `sisec`.`bitacora_evaluacion` 
ADD COLUMN `periodo_id` INT NOT NULL;
ALTER TABLE `sisec`.`bitacora_evaluacion`
ADD CONSTRAINT `fk_periodo_id`
  FOREIGN KEY (`periodo_id`)
  REFERENCES `sisec`.`periodo` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `sisec`.`bitacora_evaluacion` MODIFY `tareas` FLOAT NULL;
