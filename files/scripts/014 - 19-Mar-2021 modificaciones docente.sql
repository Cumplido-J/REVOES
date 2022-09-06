USE sisec;

ALTER TABLE `sisec`.`docente` MODIFY `direccion` TEXT NULL;

ALTER TABLE `sisec`.`docente` MODIFY `correo` VARCHAR(60) NULL;

ALTER TABLE `sisec`.`docente` MODIFY `cat_municipio_nacimiento_id` INT(11) NULL;

ALTER TABLE `sisec`.`docente` MODIFY `cat_municipio_direccion_id` INT(11) NULL;

ALTER TABLE `sisec`.`docente` MODIFY `fecha_egreso` DATE NULL;