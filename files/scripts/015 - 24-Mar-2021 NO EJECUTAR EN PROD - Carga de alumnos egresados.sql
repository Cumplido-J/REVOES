ALTER TABLE `sisec`.`alumno` 
ADD COLUMN `genero` ENUM('H', 'M') NULL AFTER `certificado_parcial`;

ALTER TABLE `sisec`.`alumno` 
ADD COLUMN `grupo` VARCHAR(20) NULL DEFAULT NULL AFTER `tipo_trayectoria`,
ADD COLUMN `turno` VARCHAR(2) NULL DEFAULT NULL AFTER `grupo`;
